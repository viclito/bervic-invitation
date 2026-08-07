import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { ensureDbSchema } from "@/lib/ensureDbSchema";

export async function POST(req: Request) {
  try {
    await ensureDbSchema();
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUserEmail = session.user.email.toLowerCase().trim();
    const isAdmin = currentUserEmail === "berglin1998@gmail.com";

    if (!isAdmin) {
      const dbUser: any = await prisma.user.findUnique({
        where: { email: currentUserEmail },
        select: { id: true, role: true },
      });
      if (!dbUser || dbUser.role !== "ADMIN") {
        return NextResponse.json({ error: "Forbidden. Admin authority required." }, { status: 403 });
      }
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
