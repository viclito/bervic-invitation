import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { code, invitationId } = body;

    if (!code) {
      return NextResponse.json(
        { success: false, error: "Missing QR code or pass token" },
        { status: 400 }
      );
    }

    const cleanCode = String(code).trim();

    // Query guest by uniqueCode or id
    const guest = await prisma.guest.findFirst({
      where: {
        OR: [
          { uniqueCode: cleanCode },
          { id: cleanCode },
        ],
        ...(invitationId ? { invitationId } : {}),
      },
      include: {
        invitation: {
          select: {
            partnerOne: true,
            partnerTwo: true,
            slug: true,
          },
        },
      },
    });

    if (!guest) {
      return NextResponse.json(
        { success: false, error: "Unrecognized QR Pass. Guest not found in attendee list." },
        { status: 404 }
      );
    }

    // Update status to ATTENDING if previously PENDING
    if (guest.status !== "ATTENDING") {
      await prisma.guest.update({
        where: { id: guest.id },
        data: { status: "ATTENDING" },
      });
    }

    return NextResponse.json({
      success: true,
      guest: {
        id: guest.id,
        name: guest.name,
        phone: guest.phone,
        plusOnes: guest.plusOnes,
        status: "ATTENDING",
        invitationSlug: guest.invitation?.slug,
      },
    });
  } catch (error: any) {
    console.error("POST /api/guests/verify-pass error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
