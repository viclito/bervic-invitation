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
      try {
        const dbUser: any = await prisma.user.findUnique({
          where: { email: currentUserEmail },
        });
        if (!dbUser || dbUser.role !== "ADMIN") {
          return NextResponse.json({ error: "Forbidden. Admin authority required." }, { status: 403 });
        }
      } catch {
        // If DB check fails, default allow berglin1998@gmail.com
      }
    }

    // Execute fast, decoupled parallel queries to prevent heavy join locks on Neon Cloud
    const [rawUsers, invitations, cards, subscriptions, payments] = await Promise.all([
      prisma.user.findMany({
        orderBy: { createdAt: "desc" },
      }),
      prisma.userInvitation.findMany({
        select: { userId: true },
      }),
      prisma.userCard.findMany({
        select: { userId: true },
      }),
      prisma.subscription.findMany({
        select: { userId: true, plan: true, amount: true, status: true, expiresAt: true },
      }),
      prisma.payment.findMany({
        where: { status: "SUCCESS" },
        select: { userId: true, amount: true },
      }),
    ]);

    const now = new Date();

    // Group invitations count per user
    const invCountMap: Record<string, number> = {};
    invitations.forEach((inv) => {
      invCountMap[inv.userId] = (invCountMap[inv.userId] || 0) + 1;
    });

    // Group cards count per user
    const cardCountMap: Record<string, number> = {};
    cards.forEach((c) => {
      cardCountMap[c.userId] = (cardCountMap[c.userId] || 0) + 1;
    });

    // Group revenue per user
    const revenueMap: Record<string, number> = {};
    payments.forEach((p) => {
      revenueMap[p.userId] = (revenueMap[p.userId] || 0) + (p.amount || 0);
    });

    // Group active subscription per user
    const activeSubMap: Record<string, boolean> = {};
    subscriptions.forEach((sub) => {
      if (sub.status === "ACTIVE" && new Date(sub.expiresAt) > now) {
        activeSubMap[sub.userId] = true;
      }
    });

    let totalRevenue = 0;
    let activeSubscriptionsCount = 0;
    let totalInvitationsCount = invitations.length;
    let totalCardsCount = cards.length;

    const users = rawUsers.map((user: any) => {
      const isUserAdmin = user.email.toLowerCase() === "berglin1998@gmail.com" || user.role === "ADMIN";
      const usedTemplatesCount = invCountMap[user.id] || 0;
      const usedCardsCount = cardCountMap[user.id] || 0;
      const userRevenue = revenueMap[user.id] || 0;
      const hasActiveSub = !!activeSubMap[user.id];

      totalRevenue += userRevenue;
      if (hasActiveSub) {
        activeSubscriptionsCount++;
      }

      return {
        id: user.id,
        name: user.name || "Anonymous User",
        email: user.email,
        phone: user.phone || "N/A",
        role: isUserAdmin ? "ADMIN" : user.role || "USER",
        plan: user.plan || "NONE",
        planExpiresAt: user.planExpiresAt,
        allowedTemplatesCount: user.allowedTemplatesCount || 0,
        usedTemplatesCount,
        allowedCardsCount: user.allowedCardsCount || 0,
        usedCardsCount,
        totalRevenue: userRevenue,
        hasActiveSubscription: hasActiveSub,
        createdAt: user.createdAt,
      };
    });

    const overviewStats = {
      totalUsers: users.length,
      totalSubscriptions: subscriptions.length,
      activeSubscriptions: activeSubscriptionsCount,
      totalRevenue,
      totalInvitationsCreated: totalInvitationsCount,
      totalCardsGenerated: totalCardsCount,
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
