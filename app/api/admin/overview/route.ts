import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

async function fetchUsersWithRetry(retries = 2, delayMs = 400) {
  let lastErr: any = null;
  for (let i = 0; i < retries; i++) {
    try {
      return await prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          _count: {
            select: {
              invitations: true,
              cards: true,
              subscriptions: true,
            },
          },
          subscriptions: {
            orderBy: { createdAt: "desc" },
            take: 5,
          },
          payments: {
            where: { status: "SUCCESS" },
            select: { amount: true },
          },
        },
      });
    } catch (err: any) {
      lastErr = err;
      console.warn(`[Admin Overview DB Attempt ${i + 1}/${retries} Failed]:`, err?.message || err);
      if (i < retries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }
  throw lastErr;
}

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

    // Fetch users with retry & fallback
    let rawUsers: any[] = [];
    let isFallback = false;

    try {
      rawUsers = await fetchUsersWithRetry(2, 500);
    } catch (dbErr: any) {
      console.warn("Neon Cloud DB connection cold-start timeout. Serving graceful admin session view.");
      isFallback = true;
      rawUsers = [
        {
          id: (session.user as any)?.id || "admin-berglin-1",
          name: session.user.name || "berglin viclito",
          email: "berglin1998@gmail.com",
          phone: "+91 90421 27115",
          role: "ADMIN",
          plan: "PRO_999",
          planExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          allowedTemplatesCount: 99,
          allowedCardsCount: 99,
          createdAt: new Date(),
          _count: { invitations: 1, cards: 1, subscriptions: 1 },
          payments: [{ amount: 999 }],
          subscriptions: [{ status: "ACTIVE", expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) }],
        },
      ];
    }

    const now = new Date();

    let totalRevenue = 0;
    let activeSubscriptionsCount = 0;
    let totalInvitationsCount = 0;
    let totalCardsCount = 0;

    const users = rawUsers.map((user: any) => {
      const isUserAdmin = user.email.toLowerCase() === "berglin1998@gmail.com" || user.role === "ADMIN";
      const usedTemplatesCount = user._count?.invitations || 0;
      const usedCardsCount = user._count?.cards || 0;

      totalInvitationsCount += usedTemplatesCount;
      totalCardsCount += usedCardsCount;

      const userRevenue = (user.payments || []).reduce((acc: number, p: any) => acc + (p.amount || 0), 0);
      totalRevenue += userRevenue;

      const hasActiveSub = (user.subscriptions || []).some(
        (sub: any) => sub.status === "ACTIVE" && new Date(sub.expiresAt) > now
      );

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

    let totalSubscriptionsCount = activeSubscriptionsCount;
    if (!isFallback) {
      try {
        totalSubscriptionsCount = await prisma.subscription.count();
      } catch {
        totalSubscriptionsCount = activeSubscriptionsCount;
      }
    }

    const overviewStats = {
      totalUsers: users.length,
      totalSubscriptions: totalSubscriptionsCount,
      activeSubscriptions: activeSubscriptionsCount,
      totalRevenue,
      totalInvitationsCreated: totalInvitationsCount,
      totalCardsGenerated: totalCardsCount,
    };

    return NextResponse.json({
      success: true,
      stats: overviewStats,
      users,
      isFallback,
    });
  } catch (error: any) {
    console.error("Admin Overview Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to connect to database" },
      { status: 500 }
    );
  }
}
