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

    let occasions: any[] = [];
    try {
      if ((prisma as any).shopOccasion) {
        occasions = await (prisma as any).shopOccasion.findMany({
          orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        });
      }
    } catch {
      // fallback
    }

    if (!occasions || occasions.length === 0) {
      try {
        occasions = await prisma.$queryRawUnsafe(
          `SELECT * FROM "ShopOccasion" ORDER BY "sortOrder" ASC, "createdAt" ASC`
        );
      } catch {
        occasions = [];
      }
    }

    return NextResponse.json({ occasions: occasions || [] });
  } catch (error: any) {
    console.error("GET /api/admin/shop/occasions error:", error);
    return NextResponse.json({ error: error?.message || "Failed to fetch occasions" }, { status: 500 });
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
    const { id, name, icon, sortOrder, isActive } = body;

    if (!id || !name) {
      return NextResponse.json({ error: "ID (slug) and Name are required" }, { status: 400 });
    }

    const cleanId = String(id).trim().toLowerCase().replace(/[^a-z0-9_-]/g, "_");
    const cleanName = String(name).trim();
    const cleanIcon = icon ? String(icon).trim() : null;
    const cleanSortOrder = Number(sortOrder) || 0;
    const cleanIsActive = isActive !== undefined ? Boolean(isActive) : true;

    let createdOccasion: any = null;
    try {
      if ((prisma as any).shopOccasion) {
        createdOccasion = await (prisma as any).shopOccasion.create({
          data: {
            id: cleanId,
            name: cleanName,
            icon: cleanIcon,
            sortOrder: cleanSortOrder,
            isActive: cleanIsActive,
          },
        });
      }
    } catch {
      // Fallback direct SQL insert
      await prisma.$executeRawUnsafe(
        `INSERT INTO "ShopOccasion" ("id", "name", "icon", "sortOrder", "isActive", "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
         ON CONFLICT ("id") DO UPDATE SET "name" = $2, "icon" = $3, "sortOrder" = $4, "isActive" = $5, "updatedAt" = NOW()`,
        cleanId,
        cleanName,
        cleanIcon,
        cleanSortOrder,
        cleanIsActive
      );
      createdOccasion = {
        id: cleanId,
        name: cleanName,
        icon: cleanIcon,
        sortOrder: cleanSortOrder,
        isActive: cleanIsActive,
      };
    }

    return NextResponse.json({ occasion: createdOccasion }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/admin/shop/occasions error:", error);
    return NextResponse.json({ error: error?.message || "Failed to create occasion" }, { status: 500 });
  }
}
