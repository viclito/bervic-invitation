import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/getAuthUser";
import { ensureDbSchema } from "@/lib/ensureDbSchema";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: Request) {
  try {
    await ensureDbSchema();
    const authUser = await getAuthUser(req);
    const userId = authUser?.id;
    const userEmail = authUser?.email?.toLowerCase().trim();

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
          allowedCinematicCount: true,
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
        allowedCinematicCount: isAdmin ? 99 : 0,
        allowedCardsCount: isAdmin ? 99 : 0,
        usedTemplatesCount: 0,
        usedCinematicCount: 0,
        usedCardsCount: 0,
        remainingTemplateSlots: isAdmin ? 99 : 0,
        remainingCinematicSlots: isAdmin ? 99 : 0,
        remainingCardSlots: isAdmin ? 99 : 0,
        userInvitations: [],
        savedCards: [],
      });
    }

    const now = new Date();
    const allInvs = user.invitations || [];
    const isCinematicSlug = (s: string) => s === "scroll-scrubber" || s === "premium-scroll";
    const usedCinematicCount = allInvs.filter((inv: any) => isCinematicSlug(inv.templateSlug)).length;
    const usedTemplatesCount = allInvs.filter((inv: any) => !isCinematicSlug(inv.templateSlug)).length;
    const usedCardsCount = (user.cards || []).length;

    // Admin always gets full pass
    if (isAdmin) {
      return NextResponse.json({
        success: true,
        plan: "CINEMATIC_2000",
        hasCinematicPass: true,
        planExpiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        isActive: true,
        allowedTemplatesCount: 99,
        allowedCinematicCount: 99,
        allowedCardsCount: 99,
        usedTemplatesCount,
        usedCinematicCount,
        usedCardsCount,
        remainingTemplateSlots: 99,
        remainingCinematicSlots: 99,
        remainingCardSlots: 99,
        userInvitations: user.invitations || [],
        savedCards: user.cards || [],
      });
    }

    // ── Auto-Recovery Engine: Calculate active plan & cumulative quotas directly from payment history ──
    // Auto-heal any Payment records stuck in "CREATED" status from Razorpay checkout
    const createdPayments = (user.payments || []).filter(
      (p: any) => p.status === "CREATED"
    );
    if (createdPayments.length > 0) {
      for (const cp of createdPayments) {
        try {
          await prisma.payment.update({
            where: { id: cp.id },
            data: { status: "SUCCESS" },
          });
          cp.status = "SUCCESS";
        } catch {}
      }
    }

    const validPayments = (user.payments || []).filter(
      (p: any) => p.status === "SUCCESS" || p.status === "COMPLETED" || p.status === "CREATED"
    );
    const validSubscriptions = (user.subscriptions || []).filter(
      (s: any) => s.status === "ACTIVE" || !s.status
    );

    let computedPlan = user.plan && user.plan !== "NONE" ? user.plan : "NONE";
    let computedExpiresAt: Date | null = user.planExpiresAt ? new Date(user.planExpiresAt) : null;
    let computedTemplatesCount = user.allowedTemplatesCount || 0;
    let computedCinematicCount = (user as any).allowedCinematicCount || 0;
    // Base 2 Free Cards for every logged-in user
    let computedCardsCount = Math.max(2, user.allowedCardsCount || 2);

    if (validPayments.length > 0 || validSubscriptions.length > 0) {
      let totalTemplatesFromHistory = 0;
      let totalCinematicFromHistory = 0;
      let totalCardsFromHistory = 0;
      let highestPlanFromHistory = "NONE";
      let maxExpiryFromHistory: Date | null = null;

      validPayments.forEach((p: any) => {
        const pPlan = p.plan || (p.amount === 99 ? "CARDS_99" : p.amount >= 2000 ? "CINEMATIC_2000" : p.amount >= 1799 ? "PRO_1799" : "BASIC_599");
        const created = p.createdAt ? new Date(p.createdAt) : new Date();
        const months = pPlan === "BASIC_599" || pPlan === "CARDS_99" ? 6 : 12;
        const exp = new Date(created);
        exp.setMonth(exp.getMonth() + months);

        if (!maxExpiryFromHistory || exp > maxExpiryFromHistory) {
          maxExpiryFromHistory = exp;
        }

        if (pPlan === "BASIC_599") {
          totalTemplatesFromHistory += 1;
          totalCardsFromHistory += 2;
          if (highestPlanFromHistory === "NONE") highestPlanFromHistory = "BASIC_599";
        } else if (pPlan === "PRO_1799") {
          totalTemplatesFromHistory += 4;
          totalCardsFromHistory += 6;
          if (highestPlanFromHistory !== "CINEMATIC_2000") highestPlanFromHistory = "PRO_1799";
        } else if (pPlan === "CINEMATIC_2000") {
          totalCinematicFromHistory += 1;
          totalCardsFromHistory += 10;
          if (highestPlanFromHistory === "NONE") highestPlanFromHistory = "CINEMATIC_2000";
        } else if (pPlan === "CARDS_99") {
          totalCardsFromHistory += 5;
        }
      });

      const paymentOrderIds = new Set(validPayments.map((p: any) => p.razorpayOrderId).filter(Boolean));
      validSubscriptions.forEach((s: any) => {
        if (s.razorpayOrderId && paymentOrderIds.has(s.razorpayOrderId)) return;

        const sPlan = s.plan || (s.amount === 99 ? "CARDS_99" : s.amount >= 2000 ? "CINEMATIC_2000" : s.amount >= 1799 ? "PRO_1799" : "BASIC_599");
        const exp = s.expiresAt ? new Date(s.expiresAt) : new Date(Date.now() + 180 * 86400000);

        if (!maxExpiryFromHistory || exp > maxExpiryFromHistory) {
          maxExpiryFromHistory = exp;
        }

        if (sPlan === "BASIC_599") {
          totalTemplatesFromHistory += 1;
          totalCardsFromHistory += 2;
          if (highestPlanFromHistory === "NONE") highestPlanFromHistory = "BASIC_599";
        } else if (sPlan === "PRO_1799") {
          totalTemplatesFromHistory += 4;
          totalCardsFromHistory += 6;
          if (highestPlanFromHistory !== "CINEMATIC_2000") highestPlanFromHistory = "PRO_1799";
        } else if (sPlan === "CINEMATIC_2000") {
          totalCinematicFromHistory += 1;
          totalCardsFromHistory += 10;
          if (highestPlanFromHistory === "NONE") highestPlanFromHistory = "CINEMATIC_2000";
        } else if (sPlan === "CARDS_99") {
          totalCardsFromHistory += 5;
        }
      });

      if (computedPlan === "NONE" && highestPlanFromHistory !== "NONE") {
        computedPlan = highestPlanFromHistory;
      }

      const existingExpiryTime = user.planExpiresAt ? new Date(user.planExpiresAt).getTime() : 0;
      const historyExpiryTime = maxExpiryFromHistory ? (maxExpiryFromHistory as Date).getTime() : 0;

      if (historyExpiryTime > existingExpiryTime) {
        computedExpiresAt = maxExpiryFromHistory;
      } else if (user.planExpiresAt) {
        computedExpiresAt = new Date(user.planExpiresAt);
      }

      computedTemplatesCount = Math.max(computedTemplatesCount, totalTemplatesFromHistory);
      computedCinematicCount = Math.max(computedCinematicCount, totalCinematicFromHistory);
      computedCardsCount = Math.max(computedCardsCount, 2 + totalCardsFromHistory);

      // Auto-heal the User DB record if stale or unassigned
      if (
        user.plan !== computedPlan ||
        user.allowedTemplatesCount !== computedTemplatesCount ||
        (user as any).allowedCinematicCount !== computedCinematicCount ||
        user.allowedCardsCount !== computedCardsCount
      ) {
        try {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              plan: computedPlan,
              planExpiresAt: computedExpiresAt,
              allowedTemplatesCount: computedTemplatesCount,
              allowedCinematicCount: computedCinematicCount,
              allowedCardsCount: computedCardsCount,
            },
          });
        } catch {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              plan: computedPlan,
              planExpiresAt: computedExpiresAt,
              allowedTemplatesCount: computedTemplatesCount,
              allowedCardsCount: computedCardsCount,
            },
          });
          await prisma.$executeRawUnsafe(
            `UPDATE "User" SET "allowedCinematicCount" = $1 WHERE "id" = $2;`,
            computedCinematicCount,
            user.id
          );
        }
      }
    }

    const isSubscribed =
      (computedPlan !== "NONE" && computedExpiresAt && new Date(computedExpiresAt) > now) ||
      validPayments.length > 0 ||
      validSubscriptions.length > 0 ||
      computedTemplatesCount > 0 ||
      computedCinematicCount > 0;

    const remainingTemplateSlots = Math.max(0, computedTemplatesCount - usedTemplatesCount);
    const remainingCinematicSlots = Math.max(0, computedCinematicCount - usedCinematicCount);
    const remainingCardSlots = Math.max(0, computedCardsCount - usedCardsCount);

    return NextResponse.json({
      success: true,
      isLoggedIn: true,
      plan: isSubscribed ? computedPlan : "NONE",
      hasCinematicPass: computedCinematicCount > 0,
      planExpiresAt: isSubscribed ? computedExpiresAt : null,
      isActive: isSubscribed,
      allowedTemplatesCount: computedTemplatesCount,
      allowedCinematicCount: computedCinematicCount,
      allowedCardsCount: computedCardsCount,
      usedTemplatesCount,
      usedCinematicCount,
      usedCardsCount,
      remainingTemplateSlots,
      remainingCinematicSlots,
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
