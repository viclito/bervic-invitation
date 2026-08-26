import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureDbSchema } from "@/lib/ensureDbSchema";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    await ensureDbSchema();
    const url = new URL(req.url);
    const token = url.searchParams.get("token") || "";

    // Form data from Razorpay POST
    const formData = await req.formData();
    const razorpay_order_id = formData.get("razorpay_order_id")?.toString() || "";
    const razorpay_payment_id = formData.get("razorpay_payment_id")?.toString() || "";
    const razorpay_signature = formData.get("razorpay_signature")?.toString() || "";

    if (!razorpay_order_id || !razorpay_payment_id) {
      return NextResponse.redirect(new URL("/checkout/mobile-pay?status=error&msg=Missing+payment+details", req.url));
    }

    // Find payment record in DB to get user and plan
    const payment = await prisma.payment.findUnique({
      where: { razorpayOrderId: razorpay_order_id },
      include: { user: true },
    });

    if (!payment || !payment.user) {
      return NextResponse.redirect(new URL("/checkout/mobile-pay?status=error&msg=Order+not+found", req.url));
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET || "";
    let isSignatureValid = false;

    if (razorpay_signature) {
      const generatedSignature = crypto
        .createHmac("sha256", keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");
      isSignatureValid = generatedSignature === razorpay_signature;
    }

    const plan = (payment.plan || "PRO_1799") as "BASIC_599" | "PRO_1799" | "CINEMATIC_2000" | "CARDS_99";
    const validityMonths = plan === "BASIC_599" ? 6 : plan === "CARDS_99" ? 6 : 12;
    const addTemplates = plan === "BASIC_599" ? 1 : plan === "PRO_1799" ? 4 : 0;
    const addCards = plan === "CARDS_99" ? 5 : plan === "BASIC_599" ? 2 : plan === "PRO_1799" ? 6 : 10;

    const now = new Date();
    const newPlanExpiresAt = new Date(now);
    newPlanExpiresAt.setMonth(newPlanExpiresAt.getMonth() + validityMonths);

    let finalExpiresAt = newPlanExpiresAt;
    if (payment.user.planExpiresAt) {
      const existingExpiry = new Date(payment.user.planExpiresAt);
      if (existingExpiry > now && existingExpiry > newPlanExpiresAt) {
        finalExpiresAt = existingExpiry;
      }
    }

    const newAllowedTemplates = ((payment.user as any).allowedTemplatesCount || 0) + addTemplates;
    const newAllowedCinematic = ((payment.user as any).allowedCinematicCount || 0) + (plan === "CINEMATIC_2000" ? 1 : 0);
    const newAllowedCards = ((payment.user as any).allowedCardsCount || 0) + addCards;

    // Update payment & subscription
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: "SUCCESS",
      },
    });

    await prisma.user.update({
      where: { id: payment.userId },
      data: {
        plan: plan === "CINEMATIC_2000" || plan === "CARDS_99" ? payment.user.plan : plan,
        planExpiresAt: finalExpiresAt,
        allowedTemplatesCount: newAllowedTemplates,
        allowedCinematicCount: newAllowedCinematic,
        allowedCardsCount: newAllowedCards,
      },
    });

    const redirectUrl = new URL(`/checkout/mobile-pay?status=success&plan=${plan}&orderId=${razorpay_order_id}`, req.url);
    return NextResponse.redirect(redirectUrl, { status: 303 });
  } catch (error: any) {
    console.error("Razorpay callback processing error:", error);
    return NextResponse.redirect(new URL("/checkout/mobile-pay?status=error&msg=Verification+failed", req.url));
  }
}

export async function GET(req: Request) {
  return POST(req);
}
