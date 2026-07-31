import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUserEmail = session.user.email.toLowerCase().trim();
    const isAdmin = currentUserEmail === "berglin1998@gmail.com";

    if (!isAdmin) {
      const dbUser: any = await prisma.user.findUnique({
        where: { email: currentUserEmail },
        select: { id: true, role: true },
      });
      if (!dbUser || dbUser.role !== "ADMIN") {
        return NextResponse.json({ error: "Forbidden. Admin authority required." }, { status: 403 });
      }
    }

    const body = await req.json();
    const { userId, addTemplateSlots, addCardCredits, overridePlan } = body;

    if (!userId) {
      return NextResponse.json({ error: "Target userId is required" }, { status: 400 });
    }

    let targetUser: any = null;
    try {
      targetUser = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          plan: true,
          allowedTemplatesCount: true,
          allowedCardsCount: true,
        },
      });
    } catch (dbErr: any) {
      return NextResponse.json(
        { error: "Database connection error. Please try again." },
        { status: 503 }
      );
    }

    if (!targetUser) {
      return NextResponse.json({ error: "Target user not found" }, { status: 404 });
    }

    const templateInc = parseInt(addTemplateSlots, 10) || 0;
    const cardInc = parseInt(addCardCredits, 10) || 0;

    const newTemplateQuota = Math.max(0, (targetUser.allowedTemplatesCount || 0) + templateInc);
    const newCardQuota = Math.max(0, (targetUser.allowedCardsCount || 0) + cardInc);

    const updateData: any = {
      allowedTemplatesCount: newTemplateQuota,
      allowedCardsCount: newCardQuota,
    };

    if (overridePlan && ["NONE", "BASIC_299", "PRO_999"].includes(overridePlan)) {
      updateData.plan = overridePlan;
      if (overridePlan !== "NONE") {
        const nextMonth = new Date();
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        updateData.planExpiresAt = nextMonth;
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        plan: true,
        allowedTemplatesCount: true,
        allowedCardsCount: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Successfully granted +${templateInc} template slots and +${cardInc} card credits to ${updatedUser.name || updatedUser.email}!`,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        plan: updatedUser.plan,
        allowedTemplatesCount: updatedUser.allowedTemplatesCount,
        allowedCardsCount: updatedUser.allowedCardsCount,
      },
    });
  } catch (error: any) {
    console.error("Admin Grant Quota Error:", error);
    return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 });
  }
}
