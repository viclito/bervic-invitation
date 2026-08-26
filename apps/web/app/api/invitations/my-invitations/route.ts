import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/getAuthUser";
import { cleanupExpiredInvitations } from "@/lib/cleanupExpiredInvitations";
import { ensureDbSchema } from "@/lib/ensureDbSchema";
import { checkInvitationLockStatus } from "@/lib/lockCheck";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: Request) {
  try {
    await ensureDbSchema();
    // Run cleanup asynchronously without blocking the user response
    cleanupExpiredInvitations().catch((err) => {
      console.warn("Background invitation cleanup warning:", err?.message);
    });

    const user = await getAuthUser(req);

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const userEmail = user.email.toLowerCase().trim();
    const targetUserId = user.id;

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

    const mappedInvitations = (invitations || []).map((inv: any) => {
      const lockRes = checkInvitationLockStatus({
        createdAt: inv.createdAt,
        weddingDate: inv.weddingDate || inv.weddingTime,
        isUnlockedByAdmin: inv.isUnlockedByAdmin,
        isLockedByAdmin: inv.isLockedByAdmin,
      });
      return {
        ...inv,
        isLocked: lockRes.isLocked,
        timeUntilLockText: lockRes.timeUntilLockText,
        lockReason: lockRes.lockReason,
      };
    });

    return NextResponse.json({ invitations: mappedInvitations });
  } catch (error: any) {
    console.error("Fetch User Invitations Error:", error);
    return NextResponse.json(
      { invitations: [], error: error?.message || "Failed to fetch user invitations" },
      { status: 200 }
    );
  }
}
