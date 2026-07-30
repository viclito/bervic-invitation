import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(req: Request, { params }: RouteParams) {
  try {
    const { id: identifier } = await params;
    const body = await req.json();

    const { name, phone, email, status, plusOnes = 0, dietaryNotes = "" } = body;

    if (!name || !status) {
      return NextResponse.json(
        { error: "Name and RSVP Response (Attending or Declined) are required" },
        { status: 400 }
      );
    }

    const invitation = await prisma.userInvitation.findFirst({
      where: {
        OR: [{ id: identifier }, { slug: identifier }],
      },
    });

    if (!invitation) {
      return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
    }

    const cleanedPhone = phone ? phone.trim().replace(/[^\d+]/g, "") : "";

    // Check if guest exists by phone or name in this invitation
    let existingGuest = null;
    if (cleanedPhone) {
      existingGuest = await prisma.guest.findFirst({
        where: {
          invitationId: invitation.id,
          phone: cleanedPhone,
        },
      });
    }

    if (!existingGuest) {
      existingGuest = await prisma.guest.findFirst({
        where: {
          invitationId: invitation.id,
          name: {
            equals: name.trim(),
            mode: "insensitive",
          },
        },
      });
    }

    let guest;
    if (existingGuest) {
      guest = await prisma.guest.update({
        where: { id: existingGuest.id },
        data: {
          status: status === "ATTENDING" ? "ATTENDING" : "DECLINED",
          plusOnes: status === "ATTENDING" ? Number(plusOnes) || 0 : 0,
          dietaryNotes: dietaryNotes ? dietaryNotes.trim() : existingGuest.dietaryNotes,
          email: email ? email.trim() : existingGuest.email,
        },
      });
    } else {
      guest = await prisma.guest.create({
        data: {
          invitationId: invitation.id,
          name: name.trim(),
          phone: cleanedPhone || "N/A",
          email: email ? email.trim() : null,
          status: status === "ATTENDING" ? "ATTENDING" : "DECLINED",
          plusOnes: status === "ATTENDING" ? Number(plusOnes) || 0 : 0,
          dietaryNotes: dietaryNotes ? dietaryNotes.trim() : null,
        },
      });
    }

    return NextResponse.json({
      message: status === "ATTENDING" ? "Thank you for confirming your attendance!" : "Thank you for letting us know.",
      guest,
    });
  } catch (error: any) {
    console.error("Public RSVP Submission Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to submit RSVP response" },
      { status: 500 }
    );
  }
}
