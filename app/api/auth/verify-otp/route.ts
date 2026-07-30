import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();
    if (!email || !otp) {
      return NextResponse.json({ error: "Email and OTP code are required" }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    const record = await prisma.otpVerification.findFirst({
      where: {
        email: cleanEmail,
        code: otp.trim(),
      },
      orderBy: { createdAt: "desc" },
    });

    if (!record) {
      return NextResponse.json({ error: "Invalid OTP code" }, { status: 400 });
    }

    if (new Date() > record.expiresAt) {
      return NextResponse.json({ error: "OTP code has expired. Please request a new one." }, { status: 400 });
    }

    // Mark record verified
    await prisma.otpVerification.update({
      where: { id: record.id },
      data: { verified: true },
    });

    // Update user's emailVerified date
    await prisma.user.updateMany({
      where: { email: cleanEmail },
      data: { emailVerified: new Date() },
    });

    return NextResponse.json({ message: "Email verified successfully!" });
  } catch (error: any) {
    console.error("Verify OTP Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to verify OTP" },
      { status: 500 }
    );
  }
}
