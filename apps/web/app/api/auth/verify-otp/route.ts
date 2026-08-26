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

    // Mark OTP record verified
    await prisma.otpVerification.update({
      where: { id: record.id },
      data: { verified: true },
    });

    // Ensure User row exists and update emailVerified date
    let userFound = false;
    try {
      const updated = await prisma.user.updateMany({
        where: { email: { equals: cleanEmail, mode: "insensitive" } },
        data: { emailVerified: new Date() },
      });
      if (updated.count > 0) userFound = true;
    } catch {}

    // Fallback: If user row was somehow missing, create it now!
    if (!userFound) {
      const newId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      try {
        await prisma.user.upsert({
          where: { email: cleanEmail },
          update: { emailVerified: new Date() },
          create: {
            id: newId,
            name: cleanEmail.split("@")[0],
            email: cleanEmail,
            emailVerified: new Date(),
            plan: "NONE",
            allowedTemplatesCount: 0,
            allowedCardsCount: 0,
            role: "USER",
          },
        });
      } catch {
        try {
          await prisma.$executeRawUnsafe(
            `INSERT INTO "User" ("id", "name", "email", "emailVerified", "plan", "allowedTemplatesCount", "allowedCardsCount", "role", "createdAt", "updatedAt")
             VALUES ($1, $2, $3, NOW(), 'NONE', 0, 0, 'USER', NOW(), NOW())
             ON CONFLICT ("email") DO UPDATE SET "emailVerified" = NOW()`,
            newId,
            cleanEmail.split("@")[0],
            cleanEmail
          );
        } catch {}
      }
    }

    return NextResponse.json({ message: "Email verified successfully!" });
  } catch (error: any) {
    console.error("Verify OTP Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to verify OTP" },
      { status: 500 }
    );
  }
}
