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
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // 1. Check if user already exists (case-insensitive)
    let userRecord: any = null;
    try {
      userRecord = await prisma.user.findFirst({
        where: { email: { equals: cleanEmail, mode: "insensitive" } },
      });
    } catch {}

    if (userRecord) {
      // Update existing user with new password, name, phone
      try {
        userRecord = await prisma.user.update({
          where: { id: userRecord.id },
          data: {
            name: name.trim(),
            password: hashedPassword,
            phone: phone ? phone.trim() : null,
          },
        });
      } catch {
        // Fallback SQL
        await prisma.$executeRawUnsafe(
          `UPDATE "User" SET "name" = $1, "password" = $2, "phone" = $3, "updatedAt" = NOW() WHERE LOWER("email") = $4`,
          name.trim(),
          hashedPassword,
          phone ? phone.trim() : null,
          cleanEmail
        );
      }
    } else {
      // Create new user in PostgreSQL
      try {
        userRecord = await prisma.user.create({
          data: {
            id: userId,
            name: name.trim(),
            email: cleanEmail,
            password: hashedPassword,
            phone: phone ? phone.trim() : null,
            plan: "NONE",
            allowedTemplatesCount: 0,
            allowedCardsCount: 0,
            role: "USER",
          },
        });
      } catch (createErr: any) {
        console.warn("Prisma user creation warning, executing raw SQL insert:", createErr?.message);
        try {
          await prisma.$executeRawUnsafe(
            `INSERT INTO "User" ("id", "name", "email", "password", "phone", "plan", "allowedTemplatesCount", "allowedCardsCount", "role", "createdAt", "updatedAt") 
             VALUES ($1, $2, $3, $4, $5, 'NONE', 0, 0, 'USER', NOW(), NOW())
             ON CONFLICT ("email") DO UPDATE SET "name" = EXCLUDED."name", "password" = EXCLUDED."password", "phone" = EXCLUDED."phone", "updatedAt" = NOW()`,
            userId,
            name.trim(),
            cleanEmail,
            hashedPassword,
            phone ? phone.trim() : null
          );
          userRecord = { id: userId, email: cleanEmail };
        } catch (rawErr: any) {
          console.error("Raw SQL user insert error:", rawErr?.message);
        }
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
