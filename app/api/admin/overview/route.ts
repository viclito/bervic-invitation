import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { ensureDbSchema } from "@/lib/ensureDbSchema";
import { checkInvitationLockStatus } from "@/lib/lockCheck";

export async function GET(req: Request) {
  try {
    await ensureDbSchema();
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

    let rawUsers: any[] = [];
    try {
      rawUsers = await prisma.user.findMany({
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
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      });
    } catch (err1: any) {
      console.warn("Prisma findMany user query warning, attempting SQL fallback:", err1?.message);
      try {
        rawUsers = await prisma.$queryRawUnsafe(
          `SELECT "id", "name", "email", "phone", "plan", "planExpiresAt", "allowedTemplatesCount", "allowedCinematicCount", "allowedCardsCount", "createdAt" FROM "User" ORDER BY "createdAt" DESC`
        );
      } catch (err2: any) {
        console.error("Raw SQL user query error:", err2?.message);
      }
    }

    if (!Array.isArray(rawUsers)) {
      rawUsers = [];
    }

    // Guarantee admin account is present in rawUsers list
    const hasAdminInList = rawUsers.some((u: any) => u.email && u.email.toLowerCase() === "berglin1998@gmail.com");
    if (!hasAdminInList) {
      try {
        const adminDbUser = await prisma.user.findUnique({
          where: { email: "berglin1998@gmail.com" },
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
            createdAt: true,
          },
        });
        if (adminDbUser) {
          rawUsers.unshift(adminDbUser);
        }
      } catch (adminErr: any) {
        console.warn("Admin user fetch warning:", adminErr?.message);
      }
    }

    let invitations: any[] = [];
    let cards: any[] = [];
    let subscriptions: any[] = [];
    let payments: any[] = [];

    try {
      invitations = await prisma.userInvitation.findMany({
        select: {
          id: true,
          userId: true,
          templateSlug: true,
          partnerOne: true,
          partnerTwo: true,
          slug: true,
          weddingDate: true,
          isUnlockedByAdmin: true,
          isLockedByAdmin: true,
          createdAt: true,
          user: { select: { name: true, email: true } },
          _count: { select: { guests: true } },
        },
        orderBy: { createdAt: "desc" },
      });
    } catch {
      try {
        invitations = await prisma.$queryRawUnsafe(
          `SELECT "id", "userId", "templateSlug", "partnerOne", "partnerTwo", "slug", "weddingDate", "isUnlockedByAdmin", "isLockedByAdmin", "createdAt" FROM "UserInvitation" ORDER BY "createdAt" DESC`
        );
      } catch {}
    }

    // Enforce lock status using lockCheck utility
    invitations = invitations.map((inv) => {
      const lockRes = checkInvitationLockStatus({
        createdAt: inv.createdAt,
        weddingDate: inv.weddingDate,
        isUnlockedByAdmin: inv.isUnlockedByAdmin,
        isLockedByAdmin: inv.isLockedByAdmin,
      });
      return {
        ...inv,
        isLocked: lockRes.isLocked,
        timeUntilLockText: lockRes.timeUntilLockText,
        lockReason: lockRes.lockReason,
      };
    });

    try {
      cards = await prisma.userCard.findMany({
        select: { id: true, userId: true },
      });
    } catch {
      try {
        cards = await prisma.$queryRawUnsafe(`SELECT "id", "userId" FROM "UserCard"`);
      } catch {}
    }

    try {
      subscriptions = await prisma.subscription.findMany({
        select: { id: true, userId: true, plan: true, amount: true, status: true, expiresAt: true, createdAt: true },
        orderBy: { createdAt: "desc" },
      });
    } catch {
      try {
        subscriptions = await prisma.$queryRawUnsafe(`SELECT "id", "userId", "plan", "amount", "status", "expiresAt", "createdAt" FROM "Subscription" ORDER BY "createdAt" DESC`);
      } catch {}
    }

    try {
      payments = await prisma.payment.findMany({
        select: { id: true, userId: true, amount: true, status: true, plan: true, createdAt: true },
        orderBy: { createdAt: "desc" },
      });
    } catch {
      try {
        payments = await prisma.$queryRawUnsafe(`SELECT "id", "userId", "amount", "status", "plan", "createdAt" FROM "Payment" ORDER BY "createdAt" DESC`);
      } catch {}
    }

    // 3. Scan invitations, subscriptions, payments for any user IDs missing in rawUsers
    const existingUserIds = new Set(rawUsers.map((u: any) => u.id));
    const missingUserIds = new Set<string>();

    (invitations || []).forEach((inv: any) => {
      if (inv?.userId && !existingUserIds.has(inv.userId)) missingUserIds.add(inv.userId);
    });
    (subscriptions || []).forEach((sub: any) => {
      if (sub?.userId && !existingUserIds.has(sub.userId)) missingUserIds.add(sub.userId);
    });
    (payments || []).forEach((p: any) => {
      if (p?.userId && !existingUserIds.has(p.userId)) missingUserIds.add(p.userId);
    });

    for (const mId of Array.from(missingUserIds)) {
      try {
        const extraUser = await prisma.user.findUnique({
          where: { id: mId },
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
            createdAt: true,
          },
        });
        if (extraUser) {
          rawUsers.push(extraUser);
          existingUserIds.add(extraUser.id);
        }
      } catch {}
    }

    const now = new Date();

    // Group invitations count per user
    const invCountMap: Record<string, number> = {};
    (invitations || []).forEach((inv) => {
      if (inv?.userId) invCountMap[inv.userId] = (invCountMap[inv.userId] || 0) + 1;
    });

    // Group cards count per user
    const cardCountMap: Record<string, number> = {};
    (cards || []).forEach((c) => {
      if (c?.userId) cardCountMap[c.userId] = (cardCountMap[c.userId] || 0) + 1;
    });

    // Group subscriptions & payments history per user (Deduplicating matched Payment & Subscription rows)
    const userSubscriptionsMap: Record<string, any[]> = {};
    const userPurchasedPlansMap: Record<string, Set<string>> = {};

    const rawTxMap: Record<string, { payments: any[]; subscriptions: any[] }> = {};

    (payments || []).forEach((p: any) => {
      if (p?.userId) {
        if (!rawTxMap[p.userId]) rawTxMap[p.userId] = { payments: [], subscriptions: [] };
        rawTxMap[p.userId].payments.push(p);
      }
    });

    (subscriptions || []).forEach((sub: any) => {
      if (sub?.userId) {
        if (!rawTxMap[sub.userId]) rawTxMap[sub.userId] = { payments: [], subscriptions: [] };
        rawTxMap[sub.userId].subscriptions.push(sub);
      }
    });

    Object.keys(rawTxMap).forEach((uId) => {
      const uPayments = rawTxMap[uId].payments;
      const uSubs = rawTxMap[uId].subscriptions;

      userSubscriptionsMap[uId] = [];
      userPurchasedPlansMap[uId] = new Set<string>();

      const processedOrders = new Set<string>();

      // 1. Process canonical Subscriptions first (holds accurate expiresAt and status)
      uSubs.forEach((sub: any) => {
        const created = sub.createdAt ? new Date(sub.createdAt) : new Date();

        // Skip duplicate subscriptions for the same razorpay order ID or created within 2 minutes
        if (sub.razorpayOrderId && processedOrders.has(sub.razorpayOrderId)) {
          return;
        }

        const isDupSub = userSubscriptionsMap[uId].some((existing: any) => {
          const exCreated = new Date(existing.createdAt);
          const diffMs = Math.abs(created.getTime() - exCreated.getTime());
          return diffMs < 2 * 60 * 1000 && existing.plan === sub.plan;
        });
        if (isDupSub) return;

        const expires = sub.expiresAt ? new Date(sub.expiresAt) : new Date(created.getTime() + 180 * 86400000);

        if (sub.plan && sub.plan !== "NONE") {
          userPurchasedPlansMap[uId].add(sub.plan);
        }

        if (sub.razorpayOrderId) {
          processedOrders.add(sub.razorpayOrderId);
        }

        userSubscriptionsMap[uId].push({
          id: sub.id,
          type: "SUBSCRIPTION",
          plan: sub.plan || "UNKNOWN",
          amount: Number(sub.amount) || 0,
          status: sub.status || "ACTIVE",
          createdAt: created.toISOString(),
          expiresAt: expires.toISOString(),
          isExpired: now > expires,
        });
      });

      // 2. Include Payments ONLY IF no matching Subscription exists for that order / timestamp
      uPayments.forEach((p: any) => {
        const created = p.createdAt ? new Date(p.createdAt) : new Date();
        const orderId = p.razorpayOrderId;

        if (orderId && processedOrders.has(orderId)) return;

        const isDuplicateTime = uSubs.some((sub: any) => {
          const subCreated = sub.createdAt ? new Date(sub.createdAt) : new Date();
          const diffMs = Math.abs(created.getTime() - subCreated.getTime());
          return diffMs < 5 * 60 * 1000 && (sub.plan === p.plan || Number(sub.amount) === Number(p.amount));
        });
        if (isDuplicateTime) return;

        const pPlan = p.plan || "BASIC_599";
        const validityMonths = pPlan === "BASIC_599" ? 6 : 12;
        const expires = new Date(created);
        expires.setMonth(expires.getMonth() + validityMonths);

        const isSucc = p.status === "SUCCESS" || p.status === "COMPLETED";
        if (isSucc && p.plan && p.plan !== "NONE") {
          userPurchasedPlansMap[uId].add(p.plan);
        }

        userSubscriptionsMap[uId].push({
          id: p.id,
          type: "PAYMENT",
          plan: p.plan || "UNKNOWN",
          amount: Number(p.amount) || 0,
          status: p.status || "UNKNOWN",
          createdAt: created.toISOString(),
          expiresAt: expires.toISOString(),
          isExpired: now > expires,
        });
      });
    });

    // Group revenue per user from Payments & Subscriptions (SUM ONLY SUCCESSFUL TRANSACTIONS)
    const revenueMap: Record<string, number> = {};
    const processedUserIds = new Set<string>();
    
    (payments || []).forEach((p: any) => {
      if (p?.userId && p.amount && (p.status === "SUCCESS" || p.status === "COMPLETED")) {
        const amt = Number(p.amount) || 0;
        revenueMap[p.userId] = (revenueMap[p.userId] || 0) + amt;
        processedUserIds.add(p.userId);
      }
    });

    (subscriptions || []).forEach((sub: any) => {
      if (sub?.userId && sub.amount && (sub.status === "ACTIVE" || !sub.status) && !processedUserIds.has(sub.userId)) {
        const amt = Number(sub.amount) || 0;
        revenueMap[sub.userId] = (revenueMap[sub.userId] || 0) + amt;
      }
    });

    // Group active subscription status per user
    const activeSubMap: Record<string, boolean> = {};
    (subscriptions || []).forEach((sub) => {
      if (sub?.userId && (sub.status === "ACTIVE" || !sub.status) && new Date(sub.expiresAt) > now) {
        activeSubMap[sub.userId] = true;
      }
    });

    let calculatedTotalRevenue = 0;
    let activeSubscriptionsCount = 0;

    const users = rawUsers.map((user: any) => {
      const email = (user.email || "").toLowerCase().trim();
      const isUserAdmin = email === "berglin1998@gmail.com";
      const usedTemplatesCount = invCountMap[user.id] || 0;
      const usedCardsCount = cardCountMap[user.id] || 0;
      
      let userRevenue = revenueMap[user.id] || 0;
      if (userRevenue === 0 && !isUserAdmin) {
        let basePlanRev = user.plan === "BASIC_599" ? 599 : user.plan === "PRO_1799" ? 1799 : user.plan === "CINEMATIC_2000" ? 2000 : 0;
        let cinematicPassRev = (user.allowedCinematicCount || 0) * 2000;
        if (user.plan === "CINEMATIC_2000" && cinematicPassRev > 0) {
          cinematicPassRev = (user.allowedCinematicCount - 1) * 2000;
        }
        userRevenue = basePlanRev + cinematicPassRev;
      }

      const hasActiveSub =
        !isUserAdmin &&
        ((user.plan && user.plan !== "NONE" && user.planExpiresAt && new Date(user.planExpiresAt) > now) ||
          !!activeSubMap[user.id]);

      if (!isUserAdmin) {
        calculatedTotalRevenue += userRevenue;
        if (hasActiveSub) {
          activeSubscriptionsCount++;
        }
      }

      // Allowed quotas calculation from DB columns & transaction history
      let allowedTemplates = user.allowedTemplatesCount || 0;
      let allowedCinematic = user.allowedCinematicCount || 0;
      let allowedCards = user.allowedCardsCount || 0;
      let userPlan = user.plan || "NONE";

      if (!isUserAdmin) {
        const uPayments = (payments || []).filter((p: any) => p.userId === user.id && (p.status === "SUCCESS" || p.status === "COMPLETED"));
        const uSubs = (subscriptions || []).filter((sub: any) => sub.userId === user.id);

        let histTemplates = 0;
        let histCinematic = 0;
        let histCards = 0;
        let histPlan = "NONE";

        uPayments.forEach((p: any) => {
          const pPlan = p.plan || (p.amount >= 2000 ? "CINEMATIC_2000" : p.amount >= 1799 ? "PRO_1799" : "BASIC_599");
          if (pPlan === "BASIC_599") {
            histTemplates += 1;
            histCards += 2;
            if (histPlan === "NONE") histPlan = "BASIC_599";
          } else if (pPlan === "PRO_1799") {
            histTemplates += 4;
            histCards += 6;
            if (histPlan !== "CINEMATIC_2000") histPlan = "PRO_1799";
          } else if (pPlan === "CINEMATIC_2000") {
            histCinematic += 1;
            histCards += 10;
            if (histPlan === "NONE") histPlan = "CINEMATIC_2000";
          }
        });

        if (userPlan === "NONE" && histPlan !== "NONE") {
          userPlan = histPlan;
        }

        allowedTemplates = Math.max(allowedTemplates, histTemplates);
        allowedCinematic = Math.max(allowedCinematic, histCinematic);
        allowedCards = Math.max(allowedCards, histCards);

        if (userPlan === "BASIC_599") {
          allowedTemplates = Math.max(allowedTemplates, 1);
          allowedCards = Math.max(allowedCards, 2);
        } else if (userPlan === "PRO_1799") {
          allowedTemplates = Math.max(allowedTemplates, 4);
          allowedCards = Math.max(allowedCards, 6);
        } else if (userPlan === "CINEMATIC_2000") {
          allowedCinematic = Math.max(allowedCinematic, 1);
          allowedCards = Math.max(allowedCards, 10);
        }
      }

      const purchasedPlansSet = userPurchasedPlansMap[user.id] || new Set<string>();
      if (user.plan && user.plan !== "NONE") {
        purchasedPlansSet.add(user.plan);
      }
      const purchasedPlansList = Array.from(purchasedPlansSet);

      const history = userSubscriptionsMap[user.id] || [];

      return {
        id: user.id,
        name: user.name || (email ? email.split("@")[0] : "User"),
        email: user.email || "N/A",
        phone: user.phone || "N/A",
        role: isUserAdmin ? "ADMIN" : "USER",
        plan: isUserAdmin ? "CINEMATIC_2000" : userPlan || "NONE",
        purchasedPlansList: isUserAdmin ? ["CINEMATIC_2000"] : purchasedPlansList,
        subscriptionsHistory: history,
        planExpiresAt: user.planExpiresAt,
        allowedTemplatesCount: isUserAdmin ? 99 : allowedTemplates,
        allowedCinematicCount: isUserAdmin ? 99 : allowedCinematic,
        usedTemplatesCount,
        allowedCardsCount: isUserAdmin ? 99 : allowedCards,
        usedCardsCount,
        totalRevenue: isUserAdmin ? 0 : userRevenue,
        hasActiveSubscription: isUserAdmin ? true : hasActiveSub,
        createdAt: user.createdAt,
      };
    });

    // Format invitations detailed analytics for Admin
    const invitationsList = (invitations || []).map((inv: any) => {
      const lockData = checkInvitationLockStatus({
        createdAt: inv.createdAt,
        weddingDate: inv.weddingDate,
        isUnlockedByAdmin: inv.isUnlockedByAdmin,
        isLockedByAdmin: inv.isLockedByAdmin,
      });

      return {
        id: inv.id,
        userId: inv.userId,
        userName: inv.user?.name || "User",
        userEmail: inv.user?.email || "N/A",
        templateSlug: inv.templateSlug,
        partnerOne: inv.partnerOne || "Bride",
        partnerTwo: inv.partnerTwo || "Groom",
        slug: inv.slug,
        createdAt: inv.createdAt,
        weddingDate: inv.weddingDate,
        isUnlockedByAdmin: !!inv.isUnlockedByAdmin,
        isLockedByAdmin: !!inv.isLockedByAdmin,
        daysInUse: lockData.daysInUse,
        isLocked: lockData.isLocked,
        lockReason: lockData.lockReason || null,
        timeUntilLockText: lockData.timeUntilLockText || null,
        lockStartTime: lockData.lockStartTime || null,
        guestsCount: inv._count?.guests || 0,
      };
    });

    const payingUserCount = users.filter((u) => u.role !== "ADMIN" && u.plan !== "NONE").length;

    const overviewStats = {
      totalUsers: users.length,
      totalSubscriptions: payingUserCount,
      activeSubscriptions: activeSubscriptionsCount,
      totalRevenue: calculatedTotalRevenue,
      totalInvitationsCreated: (invitations || []).length,
      totalCardsGenerated: (cards || []).length,
    };

    return NextResponse.json({
      success: true,
      stats: overviewStats,
      users,
      invitationsList,
    });
  } catch (error: any) {
    console.error("Admin Overview Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch user analytics" },
      { status: 500 }
    );
  }
}
