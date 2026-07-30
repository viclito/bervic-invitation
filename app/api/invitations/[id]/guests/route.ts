import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: invitationId } = await params;

    // Verify invitation ownership
    const invitation = await prisma.userInvitation.findUnique({
      where: { id: invitationId },
      include: {
        user: true,
      },
    });

    if (!invitation || invitation.user.email.toLowerCase() !== session.user.email.toLowerCase()) {
      return NextResponse.json({ error: "Invitation not found or unauthorized" }, { status: 404 });
    }

    const guests = await prisma.guest.findMany({
      where: { invitationId },
      orderBy: { createdAt: "desc" },
    });

    const totalGuests = guests.length;
    const attending = guests.filter((g) => g.status === "ATTENDING").length;
    const declined = guests.filter((g) => g.status === "DECLINED").length;
    const pending = guests.filter((g) => g.status === "PENDING").length;
    const totalPlusOnes = guests
      .filter((g) => g.status === "ATTENDING")
      .reduce((sum, g) => sum + (g.plusOnes || 0), 0);

    const totalAttendingPeople = attending + totalPlusOnes;
    const responseRate = totalGuests > 0 ? Math.round(((attending + declined) / totalGuests) * 100) : 0;

    return NextResponse.json({
      guests,
      stats: {
        totalGuests,
        attending,
        declined,
        pending,
        totalPlusOnes,
        totalAttendingPeople,
        responseRate,
      },
    });
  } catch (error: any) {
    console.error("Get Guests Error:", error);
    return NextResponse.json({ error: error?.message || "Failed to fetch guests" }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: invitationId } = await params;
    const body = await req.json();

    const { name, phone, email, status = "PENDING", plusOnes = 0, dietaryNotes = "" } = body;

    if (!name || !phone) {
      return NextResponse.json({ error: "Name and Phone number are required" }, { status: 400 });
    }

    // Clean phone number (keep digits and leading +)
    const cleanedPhone = phone.trim().replace(/[^\d+]/g, "");

    const newGuest = await prisma.guest.create({
      data: {
        invitationId,
        name: name.trim(),
        phone: cleanedPhone,
        email: email?.trim() || null,
        status,
        plusOnes: Number(plusOnes) || 0,
        dietaryNotes: dietaryNotes?.trim() || null,
      },
    });

    return NextResponse.json({ message: "Guest added successfully", guest: newGuest });
  } catch (error: any) {
    console.error("Create Guest Error:", error);
    return NextResponse.json({ error: error?.message || "Failed to add guest" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: invitationId } = await params;
    const { searchParams } = new URL(req.url);
    const guestId = searchParams.get("guestId");

    if (!guestId) {
      return NextResponse.json({ error: "Guest ID is required" }, { status: 400 });
    }

    await prisma.guest.delete({
      where: { id: guestId, invitationId },
    });

    return NextResponse.json({ message: "Guest deleted successfully" });
  } catch (error: any) {
    console.error("Delete Guest Error:", error);
    return NextResponse.json({ error: error?.message || "Failed to delete guest" }, { status: 500 });
  }
}
