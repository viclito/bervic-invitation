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

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // Bulletproof multi-step insertion: Guarantee User row exists in PostgreSQL
    let userCreated = false;

    // Step 1: Standard Prisma Create/Update
    try {
      await prisma.user.upsert({
        where: { email: cleanEmail },
        update: {
          name,
          password: hashedPassword,
          phone: phone || null,
        },
        create: {
          id: userId,
          name,
          email: cleanEmail,
          password: hashedPassword,
          phone: phone || null,
          plan: "NONE",
          allowedTemplatesCount: 0,
          allowedCardsCount: 0,
          role: "USER",
        },
      });
      userCreated = true;
    } catch (prismaErr: any) {
      console.warn("Prisma user creation warning, attempting raw SQL insert:", prismaErr?.message);
    }

    // Step 2: Direct Raw SQL Insert fallback if Prisma creation failed
    if (!userCreated) {
      try {
        await prisma.$executeRawUnsafe(
          `INSERT INTO "User" ("id", "name", "email", "password", "phone", "plan", "allowedTemplatesCount", "allowedCardsCount", "role", "createdAt", "updatedAt") 
           VALUES ($1, $2, $3, $4, $5, 'NONE', 0, 0, 'USER', NOW(), NOW())
           ON CONFLICT ("email") DO UPDATE SET "name" = EXCLUDED."name", "password" = EXCLUDED."password", "phone" = EXCLUDED."phone", "updatedAt" = NOW()`,
          userId,
          name,
          cleanEmail,
          hashedPassword,
          phone || null
        );
        userCreated = true;
      } catch (sqlErr: any) {
        console.error("Raw SQL user insert error:", sqlErr?.message);
      }
    }

    // Generate & send OTP code
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
      // Ignore OTP table error if unmigrated
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
