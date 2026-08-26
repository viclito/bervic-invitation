import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureDbSchema } from "@/lib/ensureDbSchema";
import { getAdminAuth } from "@/lib/adminAuth";

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await ensureDbSchema();
    const auth = await getAdminAuth("INVITATIONS_MANAGE");

    if (auth.error || !auth.admin) {
      return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: auth.status || 401 });
    }

    const { id: invitationId } = await context.params;

    if (!invitationId) {
      return NextResponse.json({ error: "invitationId is required" }, { status: 400 });
    }

    const targetInv = await prisma.userInvitation.findUnique({
      where: { id: invitationId },
      select: { id: true, slug: true, partnerOne: true, partnerTwo: true, userId: true },
    });

    if (!targetInv) {
      return NextResponse.json({ error: "Invitation template not found" }, { status: 404 });
    }

    // Delete the invitation (cascades to guests)
    await prisma.userInvitation.delete({
      where: { id: invitationId },
    });

    return NextResponse.json({
      success: true,
      message: `Successfully deleted invitation template "${targetInv.partnerOne} & ${targetInv.partnerTwo}" (/${targetInv.slug})`,
      deletedId: invitationId,
    });
  } catch (error: any) {
    console.error("Admin Delete Invitation Error:", error);
    return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 });
  }
}
