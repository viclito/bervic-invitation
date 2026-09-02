import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureDbSchema } from "@/lib/ensureDbSchema";
import { getAdminAuth } from "@/lib/adminAuth";
import crypto from "crypto";

export async function GET() {
  try {
    await ensureDbSchema();
    const auth = await getAdminAuth("SHOP_PRODUCTS_MANAGE");

    if (auth.error || !auth.admin) {
      return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: auth.status || 401 });
    }

    let products: any[] = [];
    try {
      products = await prisma.$queryRawUnsafe(`
        SELECT * FROM "ShopProduct" ORDER BY "sortOrder" ASC, "createdAt" DESC
      `);
    } catch {
      if ((prisma as any).shopProduct) {
        products = await (prisma as any).shopProduct.findMany({
          orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        });
      }
    }

    return NextResponse.json({ products });
  } catch (err: unknown) {
    console.error("Admin Shop Products GET Error:", err);
    return NextResponse.json({ error: (err as Error)?.message || "Failed to fetch shop products" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await ensureDbSchema();
    const auth = await getAdminAuth("SHOP_PRODUCTS_MANAGE");

    if (auth.error || !auth.admin) {
      return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: auth.status || 401 });
    }

    const body = await req.json();
    const {
      name,
      category = "royal",
      pricePerCard = 65,
      minCopies = 50,
      previewImage,
      galleryImages = "[]",
      badge = "",
      paperType = "350 GSM Textured Board",
      dimensions = "5.5 x 8.5 inches",
      description = "",
      features = [],
      pricingTiersJson = null,
      canvaTemplateId = null,
      rating = 5.0,
      reviewsCount = 50,
      isActive = true,
      sortOrder = 0,
    } = body;

    if (!name || !previewImage) {
      return NextResponse.json({ error: "Product name and image URL are required." }, { status: 400 });
    }

    const featuresJson = Array.isArray(features)
      ? JSON.stringify(features)
      : typeof features === "string"
      ? features
      : "[]";

    const cleanPricingTiersJson = pricingTiersJson && typeof pricingTiersJson === "object"
      ? JSON.stringify(pricingTiersJson)
      : typeof pricingTiersJson === "string"
      ? pricingTiersJson
      : null;

    const id = `prod_${crypto.randomBytes(12).toString("hex")}`;
    const cleanName = String(name).trim();
    const cleanCategory = String(category).toLowerCase();
    const cleanPrice = Number(pricePerCard) || 65;
    const cleanCopies = Number(minCopies) || 50;
    const cleanPreview = String(previewImage).trim();
    const cleanGallery = typeof galleryImages === "string" ? galleryImages : JSON.stringify(galleryImages || []);
    const cleanBadge = badge ? String(badge).trim() : null;
    const cleanPaper = String(paperType).trim() || "350 GSM Textured Board";
    const cleanDimensions = String(dimensions).trim() || "5.5 x 8.5 inches";
    const cleanDesc = String(description).trim();
    const cleanCanvaId = canvaTemplateId ? String(canvaTemplateId).trim() : null;
    const cleanRating = Number(rating) || 5.0;
    const cleanReviews = Number(reviewsCount) || 50;
    const cleanIsActive = Boolean(isActive);
    const cleanSortOrder = Number(sortOrder) || 0;

    let product: any = null;
    let prismaCreateFailed = false;

    if ((prisma as any).shopProduct) {
      try {
        product = await (prisma as any).shopProduct.create({
          data: {
            id,
            name: cleanName,
            category: cleanCategory,
            pricePerCard: cleanPrice,
            minCopies: cleanCopies,
            previewImage: cleanPreview,
            galleryImages: cleanGallery,
            badge: cleanBadge,
            paperType: cleanPaper,
            dimensions: cleanDimensions,
            description: cleanDesc,
            featuresJson,
            pricingTiersJson: cleanPricingTiersJson,
            canvaTemplateId: cleanCanvaId,
            rating: cleanRating,
            reviewsCount: cleanReviews,
            isActive: cleanIsActive,
            sortOrder: cleanSortOrder,
          },
        });
      } catch (prismaErr) {
        console.warn("Prisma create failed, falling back to raw SQL:", prismaErr);
        prismaCreateFailed = true;
      }
    }

    if (!product || prismaCreateFailed) {
      await prisma.$executeRawUnsafe(
        `INSERT INTO "ShopProduct" ("id", "name", "category", "pricePerCard", "minCopies", "previewImage", "galleryImages", "badge", "paperType", "dimensions", "description", "featuresJson", "pricingTiersJson", "canvaTemplateId", "rating", "reviewsCount", "isActive", "sortOrder", "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, NOW(), NOW())`,
        id,
        cleanName,
        cleanCategory,
        cleanPrice,
        cleanCopies,
        cleanPreview,
        cleanGallery,
        cleanBadge,
        cleanPaper,
        cleanDimensions,
        cleanDesc,
        featuresJson,
        cleanPricingTiersJson,
        cleanCanvaId,
        cleanRating,
        cleanReviews,
        cleanIsActive,
        cleanSortOrder
      );

      const rows: any[] = await prisma.$queryRawUnsafe(
        `SELECT * FROM "ShopProduct" WHERE "id" = $1 LIMIT 1`,
        id
      );
      product = rows[0] || {
        id,
        name: cleanName,
        category: cleanCategory,
        pricePerCard: cleanPrice,
        minCopies: cleanCopies,
        previewImage: cleanPreview,
        galleryImages: cleanGallery,
        badge: cleanBadge,
        paperType: cleanPaper,
        dimensions: cleanDimensions,
        description: cleanDesc,
        featuresJson,
        rating: cleanRating,
        reviewsCount: cleanReviews,
        isActive: cleanIsActive,
        sortOrder: cleanSortOrder,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    return NextResponse.json({ success: true, product });
  } catch (err: unknown) {
    console.error("Admin Shop Product Create Error:", err);
    return NextResponse.json({ error: (err as Error)?.message || "Failed to create shop product" }, { status: 500 });
  }
}

// Bulk update status (activate / deactivate)
export async function PATCH(req: Request) {
  try {
    await ensureDbSchema();
    const auth = await getAdminAuth("SHOP_PRODUCTS_MANAGE");

    if (auth.error || !auth.admin) {
      return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: auth.status || 401 });
    }

    const body = await req.json();
    const { productIds, isActive } = body;

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json({ error: "productIds array is required." }, { status: 400 });
    }

    if ((prisma as any).shopProduct) {
      await (prisma as any).shopProduct.updateMany({
        where: { id: { in: productIds } },
        data: { isActive: Boolean(isActive) },
      });
    } else {
      await prisma.$executeRawUnsafe(
        `UPDATE "ShopProduct" SET "isActive" = $1, "updatedAt" = NOW() WHERE "id" = ANY($2::text[])`,
        Boolean(isActive),
        productIds
      );
    }

    return NextResponse.json({ success: true, updatedCount: productIds.length });
  } catch (err: unknown) {
    console.error("Admin Shop Products Bulk PATCH Error:", err);
    return NextResponse.json({ error: (err as Error)?.message || "Failed to bulk update products" }, { status: 500 });
  }
}

// Bulk delete products
export async function DELETE(req: Request) {
  try {
    await ensureDbSchema();
    const auth = await getAdminAuth("SHOP_PRODUCTS_MANAGE");

    if (auth.error || !auth.admin) {
      return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: auth.status || 401 });
    }

    const body = await req.json();
    const { productIds } = body;

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json({ error: "productIds array is required." }, { status: 400 });
    }

    if ((prisma as any).shopProduct) {
      await (prisma as any).shopProduct.deleteMany({
        where: { id: { in: productIds } },
      });
    } else {
      await prisma.$executeRawUnsafe(
        `DELETE FROM "ShopProduct" WHERE "id" = ANY($1::text[])`,
        productIds
      );
    }

    return NextResponse.json({ success: true, deletedCount: productIds.length });
  } catch (err: unknown) {
    console.error("Admin Shop Products Bulk DELETE Error:", err);
    return NextResponse.json({ error: (err as Error)?.message || "Failed to bulk delete products" }, { status: 500 });
  }
}

