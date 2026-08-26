import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, otp, name, image, mode = "password" } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    // 1. Password-based login
    if (mode === "password") {
      if (!password) {
        return NextResponse.json({ error: "Password is required" }, { status: 400 });
      }

      const user = await prisma.user.findFirst({
        where: { email: { equals: cleanEmail, mode: "insensitive" } },
      });

      if (!user || !user.password) {
        return NextResponse.json(
          { error: "Invalid email or password. If you registered with Google, use Google Sign In." },
          { status: 401 }
        );
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return NextResponse.json(
          { error: "Invalid email or password" },
          { status: 401 }
        );
      }

      // Generate a mobile auth session token
      const token = Buffer.from(
        JSON.stringify({
          userId: user.id,
          email: user.email,
          role: user.role,
          issuedAt: Date.now(),
        })
      ).toString("base64url");

      return NextResponse.json({
        success: true,
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          image: user.image,
          role: user.role,
          plan: user.plan,
          allowedTemplatesCount: user.allowedTemplatesCount,
          allowedCardsCount: user.allowedCardsCount,
          allowedCinematicCount: user.allowedCinematicCount,
        },
      });
    }

    // 2. OTP-based login
    if (mode === "otp") {
      if (!otp) {
        return NextResponse.json({ error: "OTP is required" }, { status: 400 });
      }

      const record = await prisma.otpVerification.findFirst({
        where: {
          email: cleanEmail,
          code: otp.trim(),
        },
        orderBy: { createdAt: "desc" },
      });

      if (!record || new Date() > record.expiresAt) {
        return NextResponse.json(
          { error: "Invalid or expired OTP code" },
          { status: 400 }
        );
      }

      await prisma.otpVerification.update({
        where: { id: record.id },
        data: { verified: true },
      });

      let user = await prisma.user.findFirst({
        where: { email: { equals: cleanEmail, mode: "insensitive" } },
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            name: cleanEmail.split("@")[0],
            email: cleanEmail,
            emailVerified: new Date(),
            plan: "NONE",
            role: "USER",
          },
        });
      }

      const token = Buffer.from(
        JSON.stringify({
          userId: user.id,
          email: user.email,
          role: user.role,
          issuedAt: Date.now(),
        })
      ).toString("base64url");

      return NextResponse.json({
        success: true,
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          image: user.image,
          role: user.role,
          plan: user.plan,
          allowedTemplatesCount: user.allowedTemplatesCount,
          allowedCardsCount: user.allowedCardsCount,
          allowedCinematicCount: user.allowedCinematicCount,
        },
      });
    }

    // 3. Google OAuth Mobile login
    if (mode === "google") {
      let user = await prisma.user.findFirst({
        where: { email: { equals: cleanEmail, mode: "insensitive" } },
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            name: name || cleanEmail.split("@")[0],
            email: cleanEmail,
            image: image || null,
            emailVerified: new Date(),
            plan: "NONE",
            allowedTemplatesCount: 0,
            allowedCardsCount: 0,
            role: "USER",
          },
        });
      }

      const token = Buffer.from(
        JSON.stringify({
          userId: user.id,
          email: user.email,
          role: user.role,
          issuedAt: Date.now(),
        })
      ).toString("base64url");

      return NextResponse.json({
        success: true,
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          image: user.image,
          role: user.role,
          plan: user.plan,
          allowedTemplatesCount: user.allowedTemplatesCount,
          allowedCardsCount: user.allowedCardsCount,
          allowedCinematicCount: user.allowedCinematicCount,
        },
      });
    }

    return NextResponse.json({ error: "Invalid login mode" }, { status: 400 });
  } catch (error: any) {
    console.error("Mobile Login Error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
