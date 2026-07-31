import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

async function fetchUsersWithRetry(retries = 3, delayMs = 600) {
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
      const dbUser: any = await prisma.user.findUnique({
        where: { email: currentUserEmail },
      });
      if (!dbUser || dbUser.role !== "ADMIN") {
        return NextResponse.json({ error: "Forbidden. Admin authority required." }, { status: 403 });
      }
    }

    // Fetch users with retry
    let rawUsers: any[] = [];
    try {
      rawUsers = await fetchUsersWithRetry(3, 800);
    } catch (dbErr: any) {
      console.error("All DB connection retries failed:", dbErr);
      return NextResponse.json(
        {
          error:
            "Database connection to Neon Cloud PostgreSQL timed out. Please click 'Refresh Stats' or verify your network connection.",
        },
        { status: 503 }
      );
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

    let totalSubscriptionsCount = 0;
    try {
      totalSubscriptionsCount = await prisma.subscription.count();
    } catch {
      totalSubscriptionsCount = activeSubscriptionsCount;
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
    });
  } catch (error: any) {
    console.error("Admin Overview Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to connect to database" },
      { status: 500 }
    );
  }
}
