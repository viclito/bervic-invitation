import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/getAuthUser";
import { generateGuestCode } from "@/lib/guestCode";

interface RouteParams {
  params: Promise<{ id: string }>;
}

async function resolveInvitationId(userId: string, requestedId?: string): Promise<string | null> {
  if (requestedId && requestedId !== "undefined" && requestedId !== "default") {
    const inv = await prisma.userInvitation.findFirst({
      where: { id: requestedId },
    });
    if (inv) return inv.id;
  }

  // Find latest user invitation
  let userInv = await prisma.userInvitation.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  if (!userInv) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const draft = await prisma.userDraftDetails.findFirst({
      where: { userId, isActive: true },
    });

    const p1 = draft?.hostNameOne || user?.name?.split(" ")[0] || "Host";
    const p2 = draft?.hostNameTwo || "Partner";
    const slug = `${p1.toLowerCase().replace(/[^a-z0-9]/g, "")}-and-${p2.toLowerCase().replace(/[^a-z0-9]/g, "")}-${Date.now().toString().slice(-4)}`;

    userInv = await prisma.userInvitation.create({
      data: {
        userId,
        templateSlug: "art-deco",
        coupleInitials: draft?.coupleInitials || "S & A",
        partnerOne: p1,
        partnerTwo: p2,
        tagline: draft?.tagline || "Together with their families",
        inviteLine: draft?.inviteLine || "Invite you to celebrate their wedding",
        weddingDate: draft?.eventDate || "2026-10-24",
        weddingTime: draft?.eventTime || "5:00 PM",
        heroImage: draft?.coverImage || "",
        coupleImage: draft?.coupleImage || "",
        venuePlace: draft?.venueName || "The Grand Palace",
        eventsJson: draft?.functionsJson || "[]",
        timelineDayJson: draft?.dayTimelineJson || "[]",
        loveStoryText: draft?.loveStoryText || "",
        loveStoryVideoUrl: draft?.loveStoryVideoUrl || "",
        locationsJson: draft?.locationsJson || "[]",
        galleryImagesJson: draft?.galleryImagesJson || "[]",
        contactPhone: user?.phone || "+91 9876543210",
        contactAddress: draft?.venueAddress || "New Delhi",
        socialLinksJson: "[]",
        slug,
      },
    });
  }

  return userInv.id;
}

export async function GET(req: Request, { params }: RouteParams) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: rawId } = await params;
    const invitationId = await resolveInvitationId(user.id, rawId);

    if (!invitationId) {
      return NextResponse.json({
        guests: [],
        stats: {
          totalGuests: 0,
          attending: 0,
          declined: 0,
          pending: 0,
          totalPlusOnes: 0,
          totalAttendingPeople: 0,
          responseRate: 0,
        },
      });
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
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: rawId } = await params;
    const invitationId = await resolveInvitationId(user.id, rawId);

    if (!invitationId) {
      return NextResponse.json({ error: "Could not find or create invitation profile" }, { status: 400 });
    }

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
        uniqueCode: generateGuestCode(),
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

export async function PUT(req: Request, { params }: RouteParams) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: invitationId } = await params;
    const body = await req.json();

    const { guestId, name, phone, email, status = "PENDING", plusOnes = 0, dietaryNotes = "" } = body;

    if (!guestId || !name || !phone) {
      return NextResponse.json({ error: "Guest ID, Name and Phone number are required" }, { status: 400 });
    }

    // Clean phone number (keep digits and leading +)
    const cleanedPhone = phone.trim().replace(/[^\d+]/g, "");

    const updatedGuest = await prisma.guest.update({
      where: { id: guestId, invitationId },
      data: {
        name: name.trim(),
        phone: cleanedPhone,
        email: email?.trim() || null,
        status,
        plusOnes: Number(plusOnes) || 0,
        dietaryNotes: dietaryNotes?.trim() || null,
      },
    });

    return NextResponse.json({ message: "Guest updated successfully", guest: updatedGuest });
  } catch (error: any) {
    console.error("Update Guest Error:", error);
    return NextResponse.json({ error: error?.message || "Failed to update guest" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
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
