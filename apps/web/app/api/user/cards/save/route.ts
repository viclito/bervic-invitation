import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/getAuthUser";

export async function POST(req: Request) {
  try {
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
        cards: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const effectiveAllowedCards = Math.max(2, user.allowedCardsCount || 2);
    const usedCardsCount = user.cards.length;

    if (usedCardsCount >= effectiveAllowedCards) {
      return NextResponse.json(
        {
          error: `You have used all your card download credits (${usedCardsCount} of ${effectiveAllowedCards} cards used). Get 5 additional High-Res Card Credits for just ₹99!`,
        },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
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
    } = body;

    // Check if user already saved this exact card previously
    const existingCard = await prisma.userCard.findFirst({
      where: {
        userId: user.id,
        templateId: Number(templateId),
        partnerOne: partnerOne || "Sophia",
        partnerTwo: partnerTwo || "Alexander",
      },
    });

    if (existingCard) {
      return NextResponse.json({
        success: true,
        message: "Card already recorded in your subscription.",
        card: existingCard,
        remainingCardSlots: Math.max(0, effectiveAllowedCards - usedCardsCount),
      });
    }

    // Save new card to database (deducts 1 credit count)
    const newCard = await prisma.userCard.create({
      data: {
        userId: user.id,
        templateId: Number(templateId) || 1,
        templateName: templateName || `Template #${templateId}`,
        partnerOne: partnerOne || "Sophia",
        partnerTwo: partnerTwo || "Alexander",
        weddingDate: weddingDate || "August 14, 2025",
        weddingTime: weddingTime || "4:00 PM",
        venue: venue || "The Grand Chapel",
        city: city || "Bangalore, India",
        tagline: tagline || "Together Forever",
        couplePhoto: couplePhoto || "/images/templates/couple-photo.jpg",
        hashtag: hashtag || "#ForeverTogether",
        cardDataJson: JSON.stringify(body),
      },
    });

    const updatedUsedCount = usedCardsCount + 1;
    const remainingCardSlots = Math.max(0, effectiveAllowedCards - updatedUsedCount);

    return NextResponse.json({
      success: true,
      message: "Card recorded successfully!",
      card: newCard,
      usedCardsCount: updatedUsedCount,
      remainingCardSlots,
    });
  } catch (error: any) {
    console.error("Error saving downloaded card:", error);
    return NextResponse.json({ error: "Failed to record downloaded card." }, { status: 500 });
  }
}
