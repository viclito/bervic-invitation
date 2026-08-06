import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { ensureDbSchema } from "@/lib/ensureDbSchema";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: Request) {
  try {
    await ensureDbSchema();
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;
    const userEmail = session?.user?.email?.toLowerCase().trim();

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
        userInvitations: [],
        savedCards: [],
      });
    }

    const isAdmin = userEmail === "berglin1998@gmail.com";

    let user: any = null;
    try {
      user = await prisma.user.findFirst({
        where: {
          OR: [
            ...(userId ? [{ id: userId }] : []),
            ...(userEmail ? [{ email: userEmail }] : []),
          ],
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          plan: true,
          planExpiresAt: true,
          allowedTemplatesCount: true,
          allowedCardsCount: true,
          invitations: {
            select: { id: true, templateSlug: true, partnerOne: true, partnerTwo: true, slug: true },
          },
          cards: {
            orderBy: { createdAt: "desc" },
          },
          payments: {
            where: { status: "SUCCESS" },
          },
          subscriptions: {
            where: { status: "ACTIVE" },
          },
        },
      });
    } catch (dbErr: any) {
      console.warn("Subscription fetch DB warning:", dbErr?.message);
    }

    if (!user) {
      return NextResponse.json({
        plan: isAdmin ? "CINEMATIC_2000" : "NONE",
        isActive: isAdmin,
        allowedTemplatesCount: isAdmin ? 99 : 0,
        allowedCardsCount: isAdmin ? 99 : 0,
        usedTemplatesCount: 0,
        usedCardsCount: 0,
        remainingTemplateSlots: isAdmin ? 99 : 0,
        remainingCardSlots: isAdmin ? 99 : 0,
        userInvitations: [],
        savedCards: [],
      });
    }

    const now = new Date();
    const usedTemplatesCount = (user.invitations || []).length;
    const usedCardsCount = (user.cards || []).length;

    // Admin always gets full pass
    if (isAdmin) {
      return NextResponse.json({
        plan: "CINEMATIC_2000",
        planExpiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        isActive: true,
        allowedTemplatesCount: 99,
        allowedCardsCount: 99,
        usedTemplatesCount,
        usedCardsCount,
        remainingTemplateSlots: 99,
        remainingCardSlots: 99,
        userInvitations: user.invitations || [],
        savedCards: user.cards || [],
      });
    }

    // Check if user has real paid payments or active subscriptions
    const hasSuccessfulPayment = (user.payments || []).length > 0;
    const hasActiveSubscription = (user.subscriptions || []).some(
      (sub: any) => new Date(sub.expiresAt) > now
    );
    const hasAdminGrantedQuotas = (user.allowedTemplatesCount || 0) > 0 || (user.allowedCardsCount || 0) > 0;

    const isSubscribed =
      user.plan !== "NONE" &&
      user.planExpiresAt &&
      new Date(user.planExpiresAt) > now &&
      (hasSuccessfulPayment || hasActiveSubscription || hasAdminGrantedQuotas);

    // If user has not paid and has no subscription, clean up mock free quotas
    if (!isSubscribed && user.plan !== "NONE") {
      try {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            plan: "NONE",
            planExpiresAt: null,
            allowedTemplatesCount: 0,
            allowedCardsCount: 0,
          },
        });
      } catch {
        // Ignore cleanup warning
      }
      user.plan = "NONE";
      user.planExpiresAt = null;
    }

    let allowedTemplates = 0;
    let allowedCards = 0;

    if (isSubscribed) {
      const defaultTemplates = user.plan === "CINEMATIC_2000" ? 1 : user.plan === "PRO_1799" ? 4 : 1;
      const defaultCards = user.plan === "CINEMATIC_2000" ? 10 : user.plan === "PRO_1799" ? 6 : 2;

      allowedTemplates = user.allowedTemplatesCount > 0 ? user.allowedTemplatesCount : defaultTemplates;
      allowedCards = user.allowedCardsCount > 0 ? user.allowedCardsCount : defaultCards;

      // Fix legacy mock 99 values for non-admin users
      if (allowedTemplates === 99) allowedTemplates = defaultTemplates;
      if (allowedCards === 99) allowedCards = defaultCards;
    }

    const remainingTemplateSlots = Math.max(0, allowedTemplates - usedTemplatesCount);
    const remainingCardSlots = Math.max(0, allowedCards - usedCardsCount);

    return NextResponse.json({
      plan: isSubscribed ? user.plan : "NONE",
      planExpiresAt: isSubscribed ? user.planExpiresAt : null,
      isActive: isSubscribed,
      allowedTemplatesCount: allowedTemplates,
      allowedCardsCount: allowedCards,
      usedTemplatesCount,
      usedCardsCount,
      remainingTemplateSlots,
      remainingCardSlots,
      userInvitations: user.invitations || [],
      savedCards: user.cards || [],
    });
  } catch (error: any) {
    console.error("Error fetching user subscription:", error);
    return NextResponse.json({
      plan: "NONE",
      isActive: false,
      allowedTemplatesCount: 0,
      allowedCardsCount: 0,
      usedTemplatesCount: 0,
      usedCardsCount: 0,
      remainingTemplateSlots: 0,
      remainingCardSlots: 0,
      userInvitations: [],
      savedCards: [],
    });
  }
}
