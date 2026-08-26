import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureDbSchema } from "@/lib/ensureDbSchema";
import { getAdminAuth } from "@/lib/adminAuth";

export async function POST(req: Request) {
  try {
    await ensureDbSchema();
    const auth = await getAdminAuth("INVITATIONS_MANAGE");

    if (auth.error || !auth.admin) {
      return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: auth.status || 401 });
    }

    const body = await req.json();
    const { invitationId, unlockState } = body;

    if (!invitationId) {
      return NextResponse.json({ error: "invitationId is required" }, { status: 400 });
    }

    const targetInv: any = await prisma.userInvitation.findUnique({
      where: { id: invitationId },
      select: { id: true, partnerOne: true, partnerTwo: true, isUnlockedByAdmin: true, isLockedByAdmin: true },
    });

    if (!targetInv) {
      return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
    }

    const shouldUnlock = typeof unlockState === "boolean" ? unlockState : !targetInv.isUnlockedByAdmin;
    const newIsUnlockedByAdmin = shouldUnlock;
    const newIsLockedByAdmin = !shouldUnlock;

    let updatedInv: any = null;
    try {
      updatedInv = await prisma.userInvitation.update({
        where: { id: invitationId },
        data: {
          isUnlockedByAdmin: newIsUnlockedByAdmin,
          isLockedByAdmin: newIsLockedByAdmin,
        },
        select: { id: true, isUnlockedByAdmin: true, isLockedByAdmin: true },
      });
    } catch {
      await prisma.$executeRawUnsafe(
        `UPDATE "UserInvitation" SET "isUnlockedByAdmin" = $1, "isLockedByAdmin" = $2 WHERE "id" = $3;`,
        newIsUnlockedByAdmin,
        newIsLockedByAdmin,
        invitationId
      );
      updatedInv = { id: invitationId, isUnlockedByAdmin: newIsUnlockedByAdmin, isLockedByAdmin: newIsLockedByAdmin };
    }

    return NextResponse.json({
      success: true,
      message: `Successfully ${shouldUnlock ? "UNLOCKED" : "LOCKED"} editing for invitation "${targetInv.partnerOne} & ${targetInv.partnerTwo}"!`,
      isUnlockedByAdmin: updatedInv.isUnlockedByAdmin,
      isLockedByAdmin: updatedInv.isLockedByAdmin,
    });
  } catch (error: any) {
    console.error("Admin Toggle Lock Error:", error);
    return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 });
  }
}
