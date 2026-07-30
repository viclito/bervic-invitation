import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
    }

    const { plan } = await req.json();
    if (plan !== "BASIC_299" && plan !== "PRO_999") {
      return NextResponse.json({ error: "Invalid plan selected." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const amount = plan === "BASIC_299" ? 29900 : 99900; // in paise

    const orderOptions = {
      amount,
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
        amount: plan === "BASIC_299" ? 299 : 999,
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
        name: user.name || session.user.name || "Customer",
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
