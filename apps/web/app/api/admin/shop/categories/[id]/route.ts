import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureDbSchema } from "@/lib/ensureDbSchema";
import { getAdminAuth } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

export async function PUT(
  req: Request,
  context: any
) {
  try {
    await ensureDbSchema();
    const auth = await getAdminAuth("SHOP_PRODUCTS_MANAGE");

    if (auth.error || !auth.admin) {
      return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: auth.status || 401 });
    }

    const { id: categoryId } = (await context.params) as { id: string };
    const body = await req.json();
    const { name, icon, type, sortOrder, isActive, newSlug } = body;

    // Check category exists
    const existing: any[] = await prisma.$queryRawUnsafe(
      `SELECT * FROM "ShopCategory" WHERE "id" = $1 LIMIT 1`,
      categoryId
    );

    if (!existing || existing.length === 0) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    const current = existing[0];
    const updatedName = name !== undefined ? String(name).trim() : current.name;
    const updatedIcon = icon !== undefined ? String(icon).trim() : current.icon;
    const updatedType = type !== undefined ? String(type).trim() : current.type;
    const updatedSortOrder = sortOrder !== undefined ? parseInt(String(sortOrder), 10) || 0 : current.sortOrder;
    const updatedIsActive = isActive !== undefined ? Boolean(isActive) : current.isActive;

    // Handle slug change if requested and valid
    let finalId = categoryId;
    if (newSlug && typeof newSlug === "string") {
      const sanitizedNewSlug = newSlug
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9_]+/g, "-")
        .replace(/(^-|-$)/g, "");

      if (sanitizedNewSlug && sanitizedNewSlug !== categoryId) {
        // Check collision
        const collision: any[] = await prisma.$queryRawUnsafe(
          `SELECT "id" FROM "ShopCategory" WHERE "id" = $1 LIMIT 1`,
          sanitizedNewSlug
        );
        if (collision && collision.length > 0) {
          return NextResponse.json(
            { error: `Slug '${sanitizedNewSlug}' is already in use by another category.` },
            { status: 409 }
          );
        }

        // Insert new category with new id, migrate products, delete old
        await prisma.$executeRawUnsafe(
          `INSERT INTO "ShopCategory" ("id", "name", "icon", "type", "sortOrder", "isActive", "createdAt", "updatedAt")
           VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP)`,
          sanitizedNewSlug,
          updatedName,
          updatedIcon,
          updatedType,
          updatedSortOrder,
          updatedIsActive,
          current.createdAt
        );

        // Update all products with old category id
        await prisma.$executeRawUnsafe(
          `UPDATE "ShopProduct" SET "category" = $1 WHERE "category" = $2`,
          sanitizedNewSlug,
          categoryId
        );

        // Delete old category row
        await prisma.$executeRawUnsafe(
          `DELETE FROM "ShopCategory" WHERE "id" = $1`,
          categoryId
        );

        finalId = sanitizedNewSlug;
      }
    }

    if (finalId === categoryId) {
      await prisma.$executeRawUnsafe(
        `UPDATE "ShopCategory"
         SET "name" = $1, "icon" = $2, "type" = $3, "sortOrder" = $4, "isActive" = $5, "updatedAt" = CURRENT_TIMESTAMP
         WHERE "id" = $6`,
        updatedName,
        updatedIcon,
        updatedType,
        updatedSortOrder,
        updatedIsActive,
        categoryId
      );
    }

    const updatedRows: any[] = await prisma.$queryRawUnsafe(
      `SELECT * FROM "ShopCategory" WHERE "id" = $1 LIMIT 1`,
      finalId
    );

    return NextResponse.json({
      message: "Category updated successfully",
      category: updatedRows[0],
    });
  } catch (err: unknown) {
    console.error("Admin Shop Category PUT Error:", err);
    return NextResponse.json(
      { error: (err as Error)?.message || "Failed to update category" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  context: any
) {
  try {
    await ensureDbSchema();
    const auth = await getAdminAuth("SHOP_PRODUCTS_MANAGE");

    if (auth.error || !auth.admin) {
      return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: auth.status || 401 });
    }

    const { id: categoryId } = (await context.params) as { id: string };

    // Check if category exists
    const existing: any[] = await prisma.$queryRawUnsafe(
      `SELECT * FROM "ShopCategory" WHERE "id" = $1 LIMIT 1`,
      categoryId
    );

    if (!existing || existing.length === 0) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    const category = existing[0];

    // Check if products are currently assigned to this category
    const productRows: any[] = await prisma.$queryRawUnsafe(
      `SELECT COUNT(*)::int as count FROM "ShopProduct" WHERE "category" = $1`,
      categoryId
    );

    const productCount = Number(productRows[0]?.count) || 0;
    if (productCount > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete category '${category.name}'. There are currently ${productCount} product(s) assigned to this category. Please reassign or remove those products before deleting this category.`,
          productCount,
        },
        { status: 400 }
      );
    }

    await prisma.$executeRawUnsafe(
      `DELETE FROM "ShopCategory" WHERE "id" = $1`,
      categoryId
    );

    return NextResponse.json({
      success: true,
      message: `Category '${category.name}' deleted successfully`,
    });
  } catch (err: unknown) {
    console.error("Admin Shop Category DELETE Error:", err);
    return NextResponse.json(
      { error: (err as Error)?.message || "Failed to delete category" },
      { status: 500 }
    );
  }
}
