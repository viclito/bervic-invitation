import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // Refresh card limit (Set allowedCardsCount to 6 for Pro or 1 for Basic, or +6 for test mode)
    const newAllowedCardsCount = user.plan === "BASIC_299" ? 1 : 6;
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        allowedCardsCount: newAllowedCardsCount,
        planExpiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year active
      },
    });

    return NextResponse.json({
      success: true,
      message: `Card limit refreshed to ${newAllowedCardsCount} cards!`,
      allowedCardsCount: updatedUser.allowedCardsCount,
    });
  } catch (error: any) {
    console.error("Error refreshing card limit:", error);
    return NextResponse.json({ error: "Failed to refresh card limit." }, { status: 500 });
  }
}
