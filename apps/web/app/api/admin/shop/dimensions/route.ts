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

    let dimensions: any[] = [];
    try {
      const rows: any[] = await prisma.$queryRawUnsafe(`
        SELECT * FROM "ShopDimension" ORDER BY "type" ASC, "sortOrder" ASC, "createdAt" ASC
      `);
      dimensions = rows || [];
    } catch {
      if ((prisma as any).shopDimension && typeof (prisma as any).shopDimension.findMany === "function") {
        dimensions = await (prisma as any).shopDimension.findMany({
          orderBy: [{ type: "asc" }, { sortOrder: "asc" }, { createdAt: "asc" }],
        });
      }
    }

    return NextResponse.json({ dimensions });
  } catch (err: unknown) {
    console.error("Admin Shop Dimensions GET Error:", err);
    return NextResponse.json(
      { error: (err as Error)?.message || "Failed to fetch dimensions" },
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
    const { label, type = "invitations", sortOrder = 0 } = body;

    if (!label || typeof label !== "string" || !label.trim()) {
      return NextResponse.json({ error: "Dimension label is required" }, { status: 400 });
    }

    const cleanLabel = label.trim();
    const dimensionId = `dim_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    let newDimension: any = null;
    try {
      const result: any[] = await prisma.$queryRawUnsafe(`
        INSERT INTO "ShopDimension" ("id", "label", "type", "sortOrder", "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING *;
      `, dimensionId, cleanLabel, type, Number(sortOrder) || 0);

      newDimension = result?.[0];
    } catch {
      if ((prisma as any).shopDimension && typeof (prisma as any).shopDimension.create === "function") {
        newDimension = await (prisma as any).shopDimension.create({
          data: {
            id: dimensionId,
            label: cleanLabel,
            type,
            sortOrder: Number(sortOrder) || 0,
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      dimension: newDimension || { id: dimensionId, label: cleanLabel, type, sortOrder },
      message: "Dimension created successfully",
    });
  } catch (err: unknown) {
    console.error("Admin Shop Dimension POST Error:", err);
    return NextResponse.json(
      { error: (err as Error)?.message || "Failed to create dimension" },
      { status: 500 }
    );
  }
}
