import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/getAuthUser";
import { ensureDbSchema } from "@/lib/ensureDbSchema";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    await ensureDbSchema();
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: authUser.id },
      select: {
        id: true,
        name: true,
        email: true,
        plan: true,
        planExpiresAt: true,
        allowedCardsCount: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const body = await req.json();
    const {
      cardId,
      id,
      templateId,
      templateName,
      partnerOne,
      partnerTwo,
      weddingDate,
      weddingTime,
      venue,
      city,
      tagline,
      couplePhoto,
      hashtag,
      cardDataJson,
    } = body;

    const targetCardId = cardId || id;

    // 1. If updating an existing card by ID
    if (targetCardId) {
      const existing = await prisma.userCard.findFirst({
        where: { id: targetCardId, userId: user.id },
      });

      if (existing) {
        const updated = await prisma.userCard.update({
          where: { id: existing.id },
          data: {
            templateName: templateName || existing.templateName,
            partnerOne: partnerOne || existing.partnerOne,
            partnerTwo: partnerTwo || existing.partnerTwo,
            weddingDate: weddingDate || existing.weddingDate,
            weddingTime: weddingTime || existing.weddingTime,
            venue: venue || existing.venue,
            city: city || existing.city,
            tagline: tagline || existing.tagline,
            couplePhoto: couplePhoto || existing.couplePhoto,
            hashtag: hashtag || existing.hashtag,
            cardDataJson: typeof cardDataJson === "string" ? cardDataJson : JSON.stringify(cardDataJson || body),
          },
        });

        return NextResponse.json({
          success: true,
          message: "Card updated in your gallery!",
          card: updated,
        });
      }
    }

    // 2. Otherwise create a new saved card in the user's gallery
    const newCard = await prisma.userCard.create({
      data: {
        userId: user.id,
        templateId: Number(templateId) || 1,
        templateName: templateName || "Custom Invitation Card",
        partnerOne: partnerOne || "Sophia",
        partnerTwo: partnerTwo || "Alexander",
        weddingDate: weddingDate || "October 30, 2026",
        weddingTime: weddingTime || "6:30 PM",
        venue: venue || "Elamba Mudakkal Palace",
        city: city || "Kerala, India",
        tagline: tagline || "Together Forever",
        couplePhoto: couplePhoto || null,
        hashtag: hashtag || null,
        cardDataJson: typeof cardDataJson === "string" ? cardDataJson : JSON.stringify(cardDataJson || body),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Card saved to your dashboard gallery!",
      card: newCard,
    });
  } catch (error: any) {
    console.error("Error saving card to gallery:", error);
    return NextResponse.json({ error: error?.message || "Failed to save card." }, { status: 500 });
  }
}
