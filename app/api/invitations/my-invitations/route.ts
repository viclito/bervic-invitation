import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { cleanupExpiredInvitations } from "@/lib/cleanupExpiredInvitations";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    // Run cleanup asynchronously without blocking the user response
    cleanupExpiredInvitations().catch((err) => {
      console.warn("Background invitation cleanup warning:", err?.message);
    });

    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const userEmail = session.user.email.toLowerCase().trim();

    let dbUser: any = null;
    try {
      dbUser = await prisma.user.findUnique({
        where: { email: userEmail },
      });
    } catch (dbErr: any) {
      console.warn("User lookup DB error in my-invitations:", dbErr?.message);
    }

    if (!dbUser) {
      return NextResponse.json({ invitations: [] });
    }

    let invitations: any[] = [];
    try {
      invitations = await prisma.userInvitation.findMany({
        where: { userId: dbUser.id },
        orderBy: { updatedAt: "desc" },
      });
    } catch (invErr: any) {
      console.warn("Invitations fetch DB error in my-invitations:", invErr?.message);
    }

    return NextResponse.json({ invitations });
  } catch (error: any) {
    console.error("Fetch User Invitations Error:", error);
    return NextResponse.json(
      { invitations: [], error: error?.message || "Failed to fetch user invitations" },
      { status: 200 }
    );
  }
}
