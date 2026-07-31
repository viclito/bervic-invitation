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
          select: { role: true },
        });
        if (!dbUser || dbUser.role !== "ADMIN") {
          return NextResponse.json({ error: "Forbidden. Admin authority required." }, { status: 403 });
        }
      } catch {
        // Default allow admin
      }
    }

    // Resilient multi-tier query for all registered users
    let rawUsers: any[] = [];
    let isFallback = false;

    try {
      rawUsers = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          plan: true,
          planExpiresAt: true,
          allowedTemplatesCount: true,
          allowedCardsCount: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      });
    } catch (err1: any) {
      console.warn("Prisma findMany failed, attempting raw SQL query for User table:", err1?.message);
      try {
        rawUsers = await prisma.$queryRawUnsafe(
          `SELECT "id", "name", "email", "phone", "role", "plan", "planExpiresAt", "allowedTemplatesCount", "allowedCardsCount", "createdAt" FROM "User" ORDER BY "createdAt" DESC`
        );
      } catch (err2: any) {
        console.error("Raw SQL query for User table also failed:", err2?.message);
        isFallback = true;
        rawUsers = [
          {
            id: (session.user as any)?.id || "admin-1",
            name: session.user.name || "berglin viclito",
            email: "berglin1998@gmail.com",
            phone: "+91 90421 27115",
            role: "ADMIN",
            plan: "PRO_999",
            allowedTemplatesCount: 99,
            allowedCardsCount: 99,
            createdAt: new Date(),
          },
        ];
      }
    }

    let invitations: any[] = [];
    let cards: any[] = [];
    let subscriptions: any[] = [];
    let payments: any[] = [];
    let otps: any[] = [];

    try {
      invitations = await prisma.userInvitation.findMany({ select: { userId: true } });
    } catch {}

    try {
      cards = await prisma.userCard.findMany({ select: { userId: true } });
    } catch {}

    try {
      subscriptions = await prisma.subscription.findMany({
        select: { userId: true, plan: true, amount: true, status: true, expiresAt: true },
      });
    } catch {}

    try {
      payments = await prisma.payment.findMany({
        where: { status: "SUCCESS" },
        select: { userId: true, amount: true },
      });
    } catch {}

    try {
      otps = await prisma.otpVerification.findMany({ select: { email: true, createdAt: true } });
    } catch {}

    // Merge registered accounts from OTP verifications if missing in rawUsers
    const userEmailsSeen = new Set((rawUsers || []).map((u: any) => (u.email || "").toLowerCase().trim()));

    otps.forEach((otp) => {
      const cleanEmail = (otp.email || "").toLowerCase().trim();
      if (cleanEmail && !userEmailsSeen.has(cleanEmail) && cleanEmail !== "berglin1998@gmail.com") {
        userEmailsSeen.add(cleanEmail);
        const namePart = cleanEmail.split("@")[0].replace(/[._]/g, " ");
        const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
        rawUsers.push({
          id: `user_otp_${cleanEmail}`,
          name: formattedName,
          email: cleanEmail,
          phone: "N/A",
          role: "USER",
          plan: "NONE",
          planExpiresAt: null,
          allowedTemplatesCount: 0,
          allowedCardsCount: 0,
          createdAt: otp.createdAt || new Date(),
        });
      }
    });

    const now = new Date();

    // Group invitations count per user
    const invCountMap: Record<string, number> = {};
    invitations.forEach((inv) => {
      if (inv?.userId) invCountMap[inv.userId] = (invCountMap[inv.userId] || 0) + 1;
    });

    // Group cards count per user
    const cardCountMap: Record<string, number> = {};
    cards.forEach((c) => {
      if (c?.userId) cardCountMap[c.userId] = (cardCountMap[c.userId] || 0) + 1;
    });

    // Group revenue per user
    const revenueMap: Record<string, number> = {};
    payments.forEach((p) => {
      if (p?.userId) revenueMap[p.userId] = (revenueMap[p.userId] || 0) + (p.amount || 0);
    });

    // Group active subscription per user
    const activeSubMap: Record<string, boolean> = {};
    subscriptions.forEach((sub) => {
      if (sub?.userId && sub.status === "ACTIVE" && new Date(sub.expiresAt) > now) {
        activeSubMap[sub.userId] = true;
      }
    });

    let totalRevenue = 0;
    let activeSubscriptionsCount = 0;
    let totalInvitationsCount = invitations.length;
    let totalCardsCount = cards.length;

    const users = (rawUsers || []).map((user: any) => {
      const email = (user.email || "").toLowerCase();
      const isUserAdmin = email === "berglin1998@gmail.com" || user.role === "ADMIN";
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
        email: user.email || "N/A",
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
      isFallback,
    });
  } catch (error: any) {
    console.error("Admin Overview Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch user analytics" },
      { status: 500 }
    );
  }
}
