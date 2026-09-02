import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureDbSchema } from "@/lib/ensureDbSchema";
import { getAdminAuth } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await ensureDbSchema();
    const auth = await getAdminAuth("SHOP_PRODUCTS_MANAGE");

    if (auth.error || !auth.admin) {
      return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: auth.status || 401 });
    }

    let categories: any[] = [];
    try {
      const rows: any[] = await prisma.$queryRawUnsafe(`
        SELECT * FROM "ShopCategory" ORDER BY "type" ASC, "sortOrder" ASC, "createdAt" ASC
      `);
      categories = rows || [];
    } catch {
      if ((prisma as any).shopCategory && typeof (prisma as any).shopCategory.findMany === "function") {
        categories = await (prisma as any).shopCategory.findMany({
          orderBy: [{ type: "asc" }, { sortOrder: "asc" }, { createdAt: "asc" }],
        });
      }
    }

    // Get count of products for each category
    const categoryIds = categories.map((c) => c.id);
    let countsMap: Record<string, number> = {};

    try {
      const productCounts: any[] = await prisma.$queryRawUnsafe(`
        SELECT "category", COUNT(*)::int as count 
        FROM "ShopProduct" 
        WHERE "category" = ANY($1::text[]) 
        GROUP BY "category"
      `, categoryIds);

      productCounts.forEach((r) => {
        countsMap[r.category] = Number(r.count) || 0;
      });
    } catch {
      // Fallback
    }

    const result = categories.map((cat) => ({
      ...cat,
      productCount: countsMap[cat.id] || 0,
      label: cat.icon ? `${cat.icon} ${cat.name}` : cat.name,
    }));

    return NextResponse.json({ categories: result });
  } catch (err: unknown) {
    console.error("Admin Shop Categories GET Error:", err);
    return NextResponse.json(
      { error: (err as Error)?.message || "Failed to fetch categories" },
      { status: 500 }
    );
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
    const { name, slug, icon, type = "invitations", sortOrder = 0 } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    // Generate safe slug ID if not provided
    let categoryId = (slug || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9_]+/g, "-")
      .replace(/(^-|-$)/g, "");

    if (!categoryId) {
      categoryId = name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9_]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }

    if (!categoryId) {
      return NextResponse.json({ error: "Could not generate a valid category slug" }, { status: 400 });
    }

    // Check if category ID already exists
    const existing: any[] = await prisma.$queryRawUnsafe(
      `SELECT "id" FROM "ShopCategory" WHERE "id" = $1 LIMIT 1`,
      categoryId
    );

    if (existing && existing.length > 0) {
      return NextResponse.json(
        { error: `Category slug '${categoryId}' already exists. Please choose another name or slug.` },
        { status: 409 }
      );
    }

    const validTypes = ["invitations", "return_gifts"];
    const categoryType = validTypes.includes(type) ? type : "invitations";
    const categoryIcon = (icon || "").trim();
    const safeSortOrder = parseInt(String(sortOrder), 10) || 0;

    await prisma.$executeRawUnsafe(
      `INSERT INTO "ShopCategory" ("id", "name", "icon", "type", "sortOrder", "isActive", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      categoryId,
      name.trim(),
      categoryIcon,
      categoryType,
      safeSortOrder
    );

    const createdRows: any[] = await prisma.$queryRawUnsafe(
      `SELECT * FROM "ShopCategory" WHERE "id" = $1 LIMIT 1`,
      categoryId
    );

    const created = createdRows[0] || {
      id: categoryId,
      name: name.trim(),
      icon: categoryIcon,
      type: categoryType,
      sortOrder: safeSortOrder,
      isActive: true,
    };

    return NextResponse.json({
      message: "Category created successfully",
      category: {
        ...created,
        productCount: 0,
        label: created.icon ? `${created.icon} ${created.name}` : created.name,
      },
    });
  } catch (err: unknown) {
    console.error("Admin Shop Category POST Error:", err);
    return NextResponse.json(
      { error: (err as Error)?.message || "Failed to create category" },
      { status: 500 }
    );
  }
}
