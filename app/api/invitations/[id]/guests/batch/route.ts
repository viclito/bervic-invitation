import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(req: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: invitationId } = await params;
    const body = await req.json();

    const { guests, clearExisting = false } = body;

    if (!Array.isArray(guests) || guests.length === 0) {
      return NextResponse.json({ error: "Please provide an array of guests" }, { status: 400 });
    }

    // Verify invitation ownership
    const invitation = await prisma.userInvitation.findUnique({
      where: { id: invitationId },
      include: { user: true },
    });

    if (!invitation || invitation.user.email.toLowerCase() !== session.user.email.toLowerCase()) {
      return NextResponse.json({ error: "Unauthorized or invitation not found" }, { status: 404 });
    }

    if (clearExisting) {
      await prisma.guest.deleteMany({
        where: { invitationId },
      });
    }

    const preparedGuests = guests.map((g: any) => ({
      invitationId,
      name: String(g.name || "Guest").trim(),
      phone: String(g.phone || "").trim().replace(/[^\d+]/g, ""),
      email: g.email ? String(g.email).trim() : null,
      status: ["PENDING", "ATTENDING", "DECLINED"].includes(String(g.status).toUpperCase())
        ? String(g.status).toUpperCase()
        : "PENDING",
      plusOnes: Number(g.plusOnes) || 0,
      dietaryNotes: g.dietaryNotes ? String(g.dietaryNotes).trim() : null,
    })).filter((g: any) => g.name.length > 0 && g.phone.length >= 5);

    if (preparedGuests.length === 0) {
      return NextResponse.json(
        { error: "No valid guests with valid name and phone numbers found" },
        { status: 400 }
      );
    }

    // Bulk insert using createMany
    const result = await prisma.guest.createMany({
      data: preparedGuests,
    });

    return NextResponse.json({
      message: `Successfully imported ${result.count} guests!`,
      count: result.count,
    });
  } catch (error: any) {
    console.error("Batch Guest Import Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to batch import guests" },
      { status: 500 }
    );
  }
}
