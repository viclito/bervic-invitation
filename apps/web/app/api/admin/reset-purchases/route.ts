import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminAuth } from "@/lib/adminAuth";

export async function POST() {
  try {
    const auth = await getAdminAuth("ADMINS_MANAGE");

    if (auth.error || !auth.admin) {
      return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: auth.status || 401 });
    }

    const adminUser = await prisma.user.findUnique({
      where: { email: "berglin1998@gmail.com" },
      select: { id: true },
    });

    const adminUserId = adminUser ? adminUser.id : null;

    // 1. Delete all Subscription & Payment records
    await prisma.subscription.deleteMany({});
    await prisma.payment.deleteMany({});

    // 2. Delete non-admin invitations and cards
    await prisma.userInvitation.deleteMany({
      where: adminUserId ? { NOT: { userId: adminUserId } } : {},
    });
    await prisma.userCard.deleteMany({
      where: adminUserId ? { NOT: { userId: adminUserId } } : {},
    });

    // 3. Reset all non-admin user accounts to plan = NONE, 0 slots
    await prisma.user.updateMany({
      where: {
        NOT: {
          email: "berglin1998@gmail.com",
        },
      },
      data: {
        plan: "NONE",
        planExpiresAt: null,
        allowedTemplatesCount: 0,
        allowedCardsCount: 0,
      },
    });
    await prisma.$executeRawUnsafe(
      `UPDATE "User" SET "allowedCinematicCount" = 0 WHERE "email" != 'berglin1998@gmail.com';`
    );

    // 4. Ensure Admin account maintains CINEMATIC_2000 full access
    await prisma.user.updateMany({
      where: {
        email: "berglin1998@gmail.com",
      },
      data: {
        plan: "CINEMATIC_2000",
        allowedTemplatesCount: 99,
        allowedCardsCount: 99,
      },
    });

    return NextResponse.json({
      success: true,
      message: "All non-admin user purchases, subscriptions, invitations, and cards have been reset to zero successfully.",
    });
  } catch (error: any) {
    console.error("Reset Purchases Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to reset user purchases" },
      { status: 500 }
    );
  }
}
