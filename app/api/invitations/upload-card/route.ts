import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { prisma } from "@/lib/prisma";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY || process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const { invitationId, cardImageBase64, cardTheme } = await req.json();

    if (!invitationId || !cardImageBase64) {
      return NextResponse.json({ error: "Missing invitationId or cardImageBase64" }, { status: 400 });
    }

    // Upload base64 image data string directly to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(cardImageBase64, {
      folder: "bervic-card-previews",
      resource_type: "image",
    });

    const secureUrl = uploadResult.secure_url;

    // Fetch existing invitation to update socialLinksJson
    const existing = await prisma.userInvitation.findUnique({
      where: { id: invitationId },
    });

    let currentSocial: Record<string, unknown> = {};
    if (existing?.socialLinksJson) {
      try {
        currentSocial = JSON.parse(existing.socialLinksJson);
      } catch {}
    }

    currentSocial.cardTheme = cardTheme || currentSocial.cardTheme || "peach";
    currentSocial.cardImageUrl = secureUrl;

    await prisma.userInvitation.update({
      where: { id: invitationId },
      data: {
        socialLinksJson: JSON.stringify(currentSocial),
      },
    });

    return NextResponse.json({ success: true, cardImageUrl: secureUrl });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to upload card image";
    console.error("Card upload error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
