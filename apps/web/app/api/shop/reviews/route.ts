import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/getAuthUser";
import { prisma } from "@/lib/prisma";
import { ensureDbSchema } from "@/lib/ensureDbSchema";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await ensureDbSchema();
    const user = await getAuthUser(req);
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");
    const checkReviewed = searchParams.get("checkReviewed");

    if (checkReviewed === "true") {
      const userId = user?.id;
      if (!userId) {
        return NextResponse.json({
          reviewedProductIds: [],
          reviewedOrderIds: [],
        });
      }

      try {
        const rows: any[] = await prisma.$queryRawUnsafe(
          `SELECT "productId", "orderId" FROM "ProductReview" WHERE "userId" = $1`,
          userId
        );
        const reviewedProductIds = Array.from(
          new Set(rows.map((r: any) => r.productId).filter(Boolean))
        );
        const reviewedOrderIds = Array.from(
          new Set(rows.map((r: any) => r.orderId).filter(Boolean))
        );
        return NextResponse.json({
          reviewedProductIds,
          reviewedOrderIds,
        });
      } catch (dbErr) {
        console.warn("Error fetching user review status:", dbErr);
        return NextResponse.json({
          reviewedProductIds: [],
          reviewedOrderIds: [],
        });
      }
    }

    if (productId) {
      try {
        const reviews: any[] = await prisma.$queryRawUnsafe(
          `SELECT "id", "productId", "userId", "orderId", "userName", "rating", "reviewText", "createdAt"
           FROM "ProductReview"
           WHERE "productId" = $1
           ORDER BY "createdAt" DESC
           LIMIT 50`,
          productId
        );

        return NextResponse.json({ reviews });
      } catch (dbErr) {
        console.warn("Error querying reviews for product:", dbErr);
        return NextResponse.json({ reviews: [] });
      }
    }

    return NextResponse.json({ reviews: [] });
  } catch (error: any) {
    console.error("GET /api/shop/reviews failure:", error);
    return NextResponse.json({ reviews: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureDbSchema();
    const user = await getAuthUser(req);

    const body = await req.json().catch(() => ({}));
    const productId = typeof body.productId === "string" ? body.productId.trim() : "";
    const rawRating = Number(body.rating);
    const rating = !isNaN(rawRating) && rawRating >= 1 && rawRating <= 5 ? Math.round(rawRating) : 5;
    const reviewText = typeof body.reviewText === "string" ? body.reviewText.trim() : "";
    const orderId = typeof body.orderId === "string" ? body.orderId.trim() : null;

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required to submit a review." },
        { status: 400 }
      );
    }

    if (!reviewText) {
      return NextResponse.json(
        { error: "Please enter your review or feedback." },
        { status: 400 }
      );
    }

    // Verify order delivery status if an orderId is provided
    if (orderId) {
      try {
        const orderRows: any[] = await prisma.$queryRawUnsafe(
          `SELECT "status" FROM "CardOrder" WHERE "id" = $1 LIMIT 1`,
          orderId
        );
        if (orderRows && orderRows[0]) {
          const ordStatus = (orderRows[0].status || "").toUpperCase();
          if (ordStatus !== "DELIVERED") {
            return NextResponse.json(
              { error: "Reviews can only be submitted after your invitation cards have been delivered." },
              { status: 400 }
            );
          }
        }
      } catch (checkErr) {
        console.warn("Order delivery check notice:", checkErr);
      }
    }

    const userId = user?.id || null;
    const userName =
      (typeof body.userName === "string" && body.userName.trim()) ||
      user?.name ||
      "Verified Customer";

    const reviewId = "rev_" + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);

    await prisma.$executeRawUnsafe(
      `INSERT INTO "ProductReview" ("id", "productId", "userId", "orderId", "userName", "rating", "reviewText", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())`,
      reviewId,
      productId,
      userId,
      orderId,
      userName,
      rating,
      reviewText
    );

    try {
      const stats: any[] = await prisma.$queryRawUnsafe(
        `SELECT COUNT(*)::int as count, AVG("rating")::numeric(3, 1) as avg_rating
         FROM "ProductReview"
         WHERE "productId" = $1`,
        productId
      );

      if (stats && stats[0] && Number(stats[0].count) > 0) {
        const totalReviews = Number(stats[0].count);
        const avgRating = Number(stats[0].avg_rating) || 5.0;

        await prisma.$executeRawUnsafe(
          `UPDATE "ShopProduct"
           SET "rating" = $1,
               "reviewsCount" = GREATEST("reviewsCount", $2),
               "updatedAt" = NOW()
           WHERE "id" = $3`,
          avgRating,
          totalReviews,
          productId
        );
      }
    } catch (statsErr) {
      console.warn("Product review stats aggregation notice:", statsErr);
    }

    return NextResponse.json({
      success: true,
      review: {
        id: reviewId,
        productId,
        userId,
        orderId,
        userName,
        rating,
        reviewText,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error("POST /api/shop/reviews error:", error);
    return NextResponse.json(
      { error: "Failed to submit review. Please try again." },
      { status: 500 }
    );
  }
}
