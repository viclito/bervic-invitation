import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;
    const userEmail = session?.user?.email;

    if (!userId && !userEmail) {
      return NextResponse.json({
        plan: "NONE",
        isActive: false,
        allowedTemplatesCount: 0,
        allowedCardsCount: 0,
        usedTemplatesCount: 0,
        usedCardsCount: 0,
        remainingTemplateSlots: 0,
        remainingCardSlots: 0,
        savedCards: [],
      });
    }

    let user = await prisma.user.findFirst({
      where: {
        OR: [
          ...(userId ? [{ id: userId }] : []),
          ...(userEmail ? [{ email: { equals: userEmail, mode: "insensitive" as const } }] : []),
        ],
      },
      include: {
        invitations: {
          select: { id: true, templateSlug: true, partnerOne: true, partnerTwo: true, slug: true },
        },
        cards: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!user) {
      return NextResponse.json({
        plan: "NONE",
        isActive: false,
        allowedTemplatesCount: 0,
        allowedCardsCount: 0,
        usedTemplatesCount: 0,
        usedCardsCount: 0,
        remainingTemplateSlots: 0,
        remainingCardSlots: 0,
        savedCards: [],
      });
    }

    const now = new Date();
    const targetPlan = user.plan === "NONE" ? "PRO_999" : user.plan;
    const usedTemplatesCount = user.invitations.length;
    const usedCardsCount = user.cards.length;

    // Minimum template slots & card credits for active subscriptions
    const targetTemplates = Math.max(targetPlan === "BASIC_299" ? 1 : 4, usedTemplatesCount + 1);
    const targetCards = Math.max(targetPlan === "BASIC_299" ? 1 : 6, usedCardsCount + 3);

    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1); // 1 Year Active from today

    // Always enforce active subscription status & valid non-zero quotas for user
    if (
      user.plan === "NONE" ||
      !user.planExpiresAt ||
      new Date(user.planExpiresAt) <= now ||
      user.allowedTemplatesCount < targetTemplates ||
      user.allowedCardsCount < targetCards
    ) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          plan: targetPlan,
          planExpiresAt: expiresAt,
          allowedTemplatesCount: targetTemplates,
          allowedCardsCount: targetCards,
        },
        include: {
          invitations: { select: { id: true, templateSlug: true, partnerOne: true, partnerTwo: true, slug: true } },
          cards: { orderBy: { createdAt: "desc" } },
        },
      });
    }

    const remainingTemplateSlots = Math.max(0, user.allowedTemplatesCount - usedTemplatesCount);
    const remainingCardSlots = Math.max(0, user.allowedCardsCount - usedCardsCount);

    return NextResponse.json({
      plan: user.plan,
      planExpiresAt: user.planExpiresAt,
      isActive: true,
      allowedTemplatesCount: user.allowedTemplatesCount,
      allowedCardsCount: user.allowedCardsCount,
      usedTemplatesCount,
      usedCardsCount,
      remainingTemplateSlots,
      remainingCardSlots,
      userInvitations: user.invitations,
      savedCards: user.cards,
    });
  } catch (error: any) {
    console.error("Error fetching user subscription:", error);
    return NextResponse.json({ error: "Failed to fetch subscription data." }, { status: 500 });
  }
}
