import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/getAuthUser";
import { prisma } from "@/lib/prisma";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

export async function POST(req: Request) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser?.email) {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
    }

    const { plan } = await req.json();
    if (plan !== "BASIC_599" && plan !== "PRO_1799" && plan !== "CINEMATIC_2000" && plan !== "CARDS_99") {
      return NextResponse.json({ error: "Invalid plan selected." }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          ...(authUser.id ? [{ id: authUser.id }] : []),
          { email: authUser.email.toLowerCase().trim() },
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const amountInPaise =
      plan === "CARDS_99"
        ? 9900
        : plan === "CINEMATIC_2000"
        ? 200000
        : plan === "PRO_1799"
        ? 179900
        : 59900; // in paise

    const amountInRupees =
      plan === "CARDS_99"
        ? 99
        : plan === "CINEMATIC_2000"
        ? 2000
        : plan === "PRO_1799"
        ? 1799
        : 599;

    const orderOptions = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_${user.id.slice(-6)}_${Date.now()}`,
      notes: {
        userId: user.id,
        userEmail: user.email,
        plan,
      },
    };

    const razorpayOrder = await razorpay.orders.create(orderOptions);

    // Save payment record in DB
    await prisma.payment.create({
      data: {
        userId: user.id,
        razorpayOrderId: razorpayOrder.id,
        amount: amountInRupees,
        plan,
        status: "CREATED",
      },
    });

    return NextResponse.json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID,
      user: {
        name: user.name || authUser?.name || "Customer",
        email: user.email,
        phone: user.phone || "",
      },
    });
  } catch (error: any) {
    console.error("Error creating Razorpay order:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to create payment order." },
      { status: 500 }
    );
  }
}
