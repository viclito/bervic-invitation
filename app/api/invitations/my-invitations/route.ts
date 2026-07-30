import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { cleanupExpiredInvitations } from "@/lib/cleanupExpiredInvitations";

export async function GET() {
  try {
    // Run automatic cleanup of expired invitations (> 3 days past wedding date)
    await cleanupExpiredInvitations();

    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email.toLowerCase() },
    });

    if (!dbUser) {
      return NextResponse.json({ invitations: [] });
    }

    const invitations = await prisma.userInvitation.findMany({
      where: { userId: dbUser.id },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ invitations });
  } catch (error: any) {
    console.error("Fetch User Invitations Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch user invitations" },
      { status: 500 }
    );
  }
}
