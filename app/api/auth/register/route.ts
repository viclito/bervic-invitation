import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { generateOtp, sendOtpEmail } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    const { name, email, password, phone } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if user exists
    let existingUser: any = null;
    try {
      existingUser = await prisma.user.findUnique({
        where: { email: cleanEmail },
        select: { id: true },
      });
    } catch {
      // Ignore lookup error
    }

    if (existingUser) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with fail-safe fallback if role column is missing on DB
    try {
      await prisma.user.create({
        data: {
          name,
          email: cleanEmail,
          password: hashedPassword,
          phone,
        },
      });
    } catch (createErr: any) {
      if (createErr?.message?.includes("role")) {
        const newId = `user_${Date.now()}`;
        await prisma.$executeRawUnsafe(
          `INSERT INTO "User" ("id", "name", "email", "password", "phone", "plan", "allowedTemplatesCount", "allowedCardsCount", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, 'PRO_999', 99, 99, NOW(), NOW()) ON CONFLICT ("email") DO NOTHING`,
          newId,
          name,
          cleanEmail,
          hashedPassword,
          phone || null
        );
      } else {
        throw createErr;
      }
    }

    // Generate & send OTP
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    try {
      await prisma.otpVerification.create({
        data: {
          email: cleanEmail,
          code: otp,
          expiresAt,
        },
      });
    } catch {
      // Ignore OTP table failure if unmigrated
    }

    try {
      await sendOtpEmail(cleanEmail, otp);
    } catch (mailError) {
      console.warn("Mail send warning:", mailError);
    }

    return NextResponse.json({
      message: "Registration successful. Please verify your email with the OTP code sent to you.",
      email: cleanEmail,
    });
  } catch (error: any) {
    console.error("Register Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to register user" },
      { status: 500 }
    );
  }
}
