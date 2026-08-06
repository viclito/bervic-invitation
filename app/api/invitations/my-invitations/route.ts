import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { cleanupExpiredInvitations } from "@/lib/cleanupExpiredInvitations";
import { ensureDbSchema } from "@/lib/ensureDbSchema";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    await ensureDbSchema();
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
    const userIdFromSession = (session.user as any)?.id;

    let dbUser: any = null;
    try {
      dbUser = await prisma.user.findUnique({
        where: { email: userEmail },
        select: {
          id: true,
          email: true,
          phone: true,
        },
      });
    } catch (dbErr: any) {
      console.warn("User lookup DB warning in my-invitations:", dbErr?.message);
    }

    if (!dbUser) {
      try {
        const raw: any = await prisma.$queryRawUnsafe(
          `SELECT "id", "email", "phone" FROM "User" WHERE LOWER("email") = $1 LIMIT 1`,
          userEmail
        );
        if (raw && raw.length > 0) {
          dbUser = raw[0];
        }
      } catch {}
    }

    const targetUserId = dbUser?.id || userIdFromSession;

    let invitations: any[] = [];
    if (targetUserId) {
      try {
        invitations = await prisma.userInvitation.findMany({
          where: {
            OR: [
              { userId: targetUserId },
              ...(userEmail ? [{ userId: `user_otp_${userEmail}` }] : []),
            ],
          },
          orderBy: { updatedAt: "desc" },
        });
      } catch (invErr: any) {
        console.warn("Invitations fetch DB warning in my-invitations:", invErr?.message);
        try {
          invitations = await prisma.$queryRawUnsafe(
            `SELECT * FROM "UserInvitation" WHERE "userId" = $1 ORDER BY "updatedAt" DESC`,
            targetUserId
          );
        } catch {}
      }
    }

    return NextResponse.json({ invitations: invitations || [] });
  } catch (error: any) {
    console.error("Fetch User Invitations Error:", error);
    return NextResponse.json(
      { invitations: [], error: error?.message || "Failed to fetch user invitations" },
      { status: 200 }
    );
  }
}
