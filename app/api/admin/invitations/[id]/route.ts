import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { ensureDbSchema } from "@/lib/ensureDbSchema";

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
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
