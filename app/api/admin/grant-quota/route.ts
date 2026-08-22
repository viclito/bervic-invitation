import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminAuth } from "@/lib/adminAuth";

export async function POST(req: Request) {
  try {
    const auth = await getAdminAuth("USERS_MANAGE");

    if (auth.error || !auth.admin) {
      return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: auth.status || 401 });
    }

    const body = await req.json();
    const { userId, addTemplateSlots, addCinematicSlots, addCardCredits, overridePlan } = body;

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
          allowedCinematicCount: true,
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
    const cinematicInc = parseInt(addCinematicSlots, 10) || 0;
    const cardInc = parseInt(addCardCredits, 10) || 0;

    let currentTemplates = targetUser.allowedTemplatesCount || 0;
    let currentCinematic = targetUser.allowedCinematicCount || 0;
    let currentCards = targetUser.allowedCardsCount || 0;

    const targetPlan = overridePlan || targetUser.plan;

    // Normalize legacy 99 / 100 mock values to actual plan base before adding granted quota
    if (targetPlan === "BASIC_599") {
      if (currentTemplates >= 99) currentTemplates = 1;
      if (currentCinematic >= 99) currentCinematic = 0;
      if (currentCards >= 99) currentCards = 2;
    } else if (targetPlan === "PRO_1799") {
      if (currentTemplates >= 99) currentTemplates = 4;
      if (currentCinematic >= 99) currentCinematic = 0;
      if (currentCards >= 99) currentCards = 6;
    } else if (targetPlan === "CINEMATIC_2000") {
      if (currentTemplates >= 99) currentTemplates = 1;
      if (currentCinematic >= 99) currentCinematic = 1;
      if (currentCards >= 99) currentCards = 10;
    } else {
      if (currentTemplates >= 99) currentTemplates = 0;
      if (currentCinematic >= 99) currentCinematic = 0;
      if (currentCards >= 99) currentCards = 0;
    }

    const newTemplateQuota = Math.max(0, currentTemplates + templateInc);
    const newCinematicQuota = Math.max(0, currentCinematic + cinematicInc);
    const newCardQuota = Math.max(0, currentCards + cardInc);

    const updateData: any = {
      allowedTemplatesCount: newTemplateQuota,
      allowedCinematicCount: newCinematicQuota,
      allowedCardsCount: newCardQuota,
    };

    if (overridePlan && ["NONE", "BASIC_599", "PRO_1799", "CINEMATIC_2000"].includes(overridePlan)) {
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
        allowedCinematicCount: true,
        allowedCardsCount: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Successfully granted +${templateInc} standard templates, +${cinematicInc} cinematic passes, and +${cardInc} card credits to ${updatedUser.name || updatedUser.email}! Total: ${updatedUser.allowedTemplatesCount} standard, ${updatedUser.allowedCinematicCount} cinematic, & ${updatedUser.allowedCardsCount} cards.`,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        plan: updatedUser.plan,
        allowedTemplatesCount: updatedUser.allowedTemplatesCount,
        allowedCinematicCount: updatedUser.allowedCinematicCount,
        allowedCardsCount: updatedUser.allowedCardsCount,
      },
    });
  } catch (error: any) {
    console.error("Admin Grant Quota Error:", error);
    return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 });
  }
}
