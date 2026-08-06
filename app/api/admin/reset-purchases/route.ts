import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUserEmail = session.user.email.toLowerCase().trim();
    if (currentUserEmail !== "berglin1998@gmail.com") {
      return NextResponse.json({ error: "Forbidden. Admin authority required." }, { status: 403 });
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
