import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUserEmail = session.user.email.toLowerCase().trim();
    const isAdmin = currentUserEmail === "berglin1998@gmail.com";

    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden. Admin authority required." }, { status: 403 });
    }

    // 1. Fetch Users cleanly WITHOUT requesting unmigrated 'role' column from PostgreSQL
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
          allowedCardsCount: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      });
    } catch (err1: any) {
      console.warn("Prisma findMany user query warning, attempting SQL fallback:", err1?.message);
      try {
        rawUsers = await prisma.$queryRawUnsafe(
          `SELECT "id", "name", "email", "phone", "plan", "planExpiresAt", "allowedTemplatesCount", "allowedCardsCount", "createdAt" FROM "User" ORDER BY "createdAt" DESC`
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
      rawUsers.unshift({
        id: (session.user as any)?.id || "admin-1",
        name: session.user.name || "berglin viclito",
        email: "berglin1998@gmail.com",
        phone: "+91 90421 27115",
        plan: "PRO_1799",
        allowedTemplatesCount: 99,
        allowedCardsCount: 99,
        createdAt: new Date(),
      });
    }

    // 2. Fetch Invitations, Cards, Subscriptions, Payments
    let invitations: any[] = [];
    let cards: any[] = [];
    let subscriptions: any[] = [];
    let payments: any[] = [];

    try {
      invitations = await prisma.userInvitation.findMany({
        select: { id: true, userId: true },
      });
    } catch {
      try {
        invitations = await prisma.$queryRawUnsafe(`SELECT "id", "userId" FROM "UserInvitation"`);
      } catch {}
    }

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
        select: { id: true, userId: true, plan: true, amount: true, status: true, expiresAt: true },
      });
    } catch {
      try {
        subscriptions = await prisma.$queryRawUnsafe(`SELECT "id", "userId", "plan", "amount", "status", "expiresAt" FROM "Subscription"`);
      } catch {}
    }

    try {
      payments = await prisma.payment.findMany({
        select: { id: true, userId: true, amount: true, status: true, plan: true },
      });
    } catch {
      try {
        payments = await prisma.$queryRawUnsafe(`SELECT "id", "userId", "amount", "status", "plan" FROM "Payment"`);
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

    // Group revenue per user from Payments & Subscriptions
    const revenueMap: Record<string, number> = {};
    
    (payments || []).forEach((p) => {
      if (p?.userId && p.amount) {
        revenueMap[p.userId] = Math.max(revenueMap[p.userId] || 0, Number(p.amount) || 0);
      }
    });

    (subscriptions || []).forEach((sub) => {
      if (sub?.userId && sub.amount) {
        revenueMap[sub.userId] = Math.max(revenueMap[sub.userId] || 0, Number(sub.amount) || 0);
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
      
      // Calculate revenue for user
      let userRevenue = revenueMap[user.id] || 0;
      if (userRevenue === 0 && !isUserAdmin) {
        if (user.plan === "BASIC_599") userRevenue = 599;
        if (user.plan === "PRO_1799") userRevenue = 1799;
        if (user.plan === "CINEMATIC_2000") userRevenue = 2000;
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

      // Allowed quotas
      let allowedTemplates = user.allowedTemplatesCount || 0;
      let allowedCards = user.allowedCardsCount || 0;

      if (!isUserAdmin) {
        if (user.plan === "BASIC_599") {
          allowedTemplates = allowedTemplates > 0 ? allowedTemplates : 1;
          allowedCards = allowedCards > 0 ? allowedCards : 2;
          if (allowedTemplates === 99) allowedTemplates = 1;
          if (allowedCards === 99) allowedCards = 2;
        } else if (user.plan === "PRO_1799") {
          allowedTemplates = allowedTemplates > 0 ? allowedTemplates : 4;
          allowedCards = allowedCards > 0 ? allowedCards : 6;
          if (allowedTemplates === 99) allowedTemplates = 4;
          if (allowedCards === 99) allowedCards = 6;
        } else if (user.plan === "CINEMATIC_2000") {
          allowedTemplates = allowedTemplates > 0 ? allowedTemplates : 1;
          allowedCards = allowedCards > 0 ? allowedCards : 10;
          if (allowedTemplates === 99) allowedTemplates = 1;
          if (allowedCards === 99) allowedCards = 10;
        }
      }

      return {
        id: user.id,
        name: user.name || (email ? email.split("@")[0] : "User"),
        email: user.email || "N/A",
        phone: user.phone || "N/A",
        role: isUserAdmin ? "ADMIN" : "USER",
        plan: isUserAdmin ? "PRO_1799" : user.plan || "NONE",
        planExpiresAt: user.planExpiresAt,
        allowedTemplatesCount: isUserAdmin ? 99 : allowedTemplates,
        usedTemplatesCount,
        allowedCardsCount: isUserAdmin ? 99 : allowedCards,
        usedCardsCount,
        totalRevenue: isUserAdmin ? 0 : userRevenue,
        hasActiveSubscription: isUserAdmin ? true : hasActiveSub,
        createdAt: user.createdAt,
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
    });
  } catch (error: any) {
    console.error("Admin Overview Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch user analytics" },
      { status: 500 }
    );
  }
}
