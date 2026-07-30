import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateOtp, sendOtpEmail } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Delete existing OTPs for this email
    await prisma.otpVerification.deleteMany({
      where: { email: cleanEmail },
    });

    // Create new OTP record
    await prisma.otpVerification.create({
      data: {
        email: cleanEmail,
        code: otp,
        expiresAt,
      },
    });

    // Send email
    await sendOtpEmail(cleanEmail, otp);

    return NextResponse.json({ message: "OTP sent successfully to your email" });
  } catch (error: any) {
    console.error("Send OTP Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to send OTP email" },
      { status: 500 }
    );
  }
}
