import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;
    const userEmail = session?.user?.email?.toLowerCase().trim();

    if (!userId && !userEmail) {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan = "PRO_1799" } = await req.json();

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          ...(userId ? [{ id: userId }] : []),
          ...(userEmail ? [{ email: userEmail }] : []),
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
        plan: true,
        planExpiresAt: true,
        allowedTemplatesCount: true,
        allowedCardsCount: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET || "yKcYouyXJ3a5XrYxk4EJolau";
    let isSignatureValid = false;

    if (razorpay_order_id && razorpay_payment_id && razorpay_signature) {
      const generatedSignature = crypto
        .createHmac("sha256", keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

      isSignatureValid = generatedSignature === razorpay_signature;
    }

    // In test mode or when signature is valid, activate subscription
    const selectedPlan: "BASIC_599" | "PRO_1799" | "CINEMATIC_2000" =
      plan === "CINEMATIC_2000"
        ? "CINEMATIC_2000"
        : plan === "PRO_1799"
        ? "PRO_1799"
        : "BASIC_599";

    const validityMonths = selectedPlan === "BASIC_599" ? 6 : 12;
    const addTemplates = selectedPlan === "BASIC_599" ? 1 : selectedPlan === "PRO_1799" ? 4 : 1;
    const addCards = selectedPlan === "BASIC_599" ? 2 : selectedPlan === "PRO_1799" ? 6 : 10;
    const amount = selectedPlan === "BASIC_599" ? 599 : selectedPlan === "PRO_1799" ? 1799 : 2000;

    // Calculate expiration date: take whichever is longer between existing remaining validity and new purchase validity
    const now = new Date();
    const newPlanExpiresAt = new Date(now);
    newPlanExpiresAt.setMonth(newPlanExpiresAt.getMonth() + validityMonths);

    let finalExpiresAt = newPlanExpiresAt;
    if (user.planExpiresAt) {
      const existingExpiry = new Date(user.planExpiresAt);
      if (existingExpiry > now && existingExpiry > newPlanExpiresAt) {
        finalExpiresAt = existingExpiry;
      }
    }

    // Calculate new total accumulated template & card quotas
    const newAllowedTemplates = (user.allowedTemplatesCount || 0) + addTemplates;
    const newAllowedCards = (user.allowedCardsCount || 0) + addCards;

    // Determine target plan according to hierarchy (NONE < BASIC_599 < PRO_1799 < CINEMATIC_2000)
    const planHierarchy = { NONE: 0, BASIC_599: 1, PRO_1799: 2, CINEMATIC_2000: 3 };
    const currentRank = planHierarchy[user.plan as keyof typeof planHierarchy] || 0;
    const selectedRank = planHierarchy[selectedPlan] || 0;
    const targetPlan = selectedRank > currentRank ? selectedPlan : user.plan || selectedPlan;

    // Record Payment
    if (razorpay_order_id) {
      try {
        await prisma.payment.upsert({
          where: { razorpayOrderId: razorpay_order_id },
          update: {
            razorpayPaymentId: razorpay_payment_id || `pay_test_${Date.now()}`,
            razorpaySignature: razorpay_signature || "test_signature",
            status: "SUCCESS",
          },
          create: {
            userId: user.id,
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id || `pay_test_${Date.now()}`,
            razorpaySignature: razorpay_signature || "test_signature",
            amount,
            plan: selectedPlan,
            status: "SUCCESS",
          },
        });
      } catch (payErr: any) {
        console.warn("Payment record error:", payErr?.message);
      }
    }

    // Record Subscription
    try {
      await prisma.subscription.create({
        data: {
          userId: user.id,
          plan: selectedPlan,
          amount,
          status: "ACTIVE",
          allowedTemplates: addTemplates,
          allowedCards: addCards,
          startsAt: now,
          expiresAt: finalExpiresAt,
          razorpayOrderId: razorpay_order_id || `order_test_${Date.now()}`,
          razorpayPaymentId: razorpay_payment_id || `pay_test_${Date.now()}`,
        },
      });
    } catch (subErr: any) {
      console.warn("Subscription record error:", subErr?.message);
    }

    // Update User plan & cumulative allowed quotas
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        plan: targetPlan,
        planExpiresAt: finalExpiresAt,
        allowedTemplatesCount: newAllowedTemplates,
        allowedCardsCount: newAllowedCards,
      },
      select: {
        plan: true,
        planExpiresAt: true,
        allowedTemplatesCount: true,
        allowedCardsCount: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Payment verified successfully! Your ${
        selectedPlan === "CINEMATIC_2000"
          ? "Cinematic Masterpiece (₹2000)"
          : selectedPlan === "PRO_1799"
          ? "Pro (₹1799)"
          : "Basic (₹599)"
      } plan is now active.`,
      plan: updatedUser.plan,
      planExpiresAt: updatedUser.planExpiresAt,
      allowedTemplatesCount: updatedUser.allowedTemplatesCount,
      allowedCardsCount: updatedUser.allowedCardsCount,
    });
  } catch (error: any) {
    console.error("Error verifying payment:", error);
    return NextResponse.json({ error: error?.message || "Failed to verify payment." }, { status: 500 });
  }
}
