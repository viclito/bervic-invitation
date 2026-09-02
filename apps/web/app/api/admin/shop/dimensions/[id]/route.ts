import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureDbSchema } from "@/lib/ensureDbSchema";
import { getAdminAuth } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ensureDbSchema();
    const auth = await getAdminAuth("SHOP_PRODUCTS_MANAGE");

    if (auth.error || !auth.admin) {
      return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: auth.status || 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { label, type, sortOrder } = body;

    if (!label || typeof label !== "string" || !label.trim()) {
      return NextResponse.json({ error: "Dimension label is required" }, { status: 400 });
    }

    const cleanLabel = label.trim();
    let updatedDimension: any = null;

    try {
      const result: any[] = await prisma.$queryRawUnsafe(`
        UPDATE "ShopDimension"
        SET "label" = $1,
            "type" = COALESCE($2, "type"),
            "sortOrder" = COALESCE($3, "sortOrder"),
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = $4
        RETURNING *;
      `, cleanLabel, type || null, sortOrder !== undefined ? Number(sortOrder) : null, id);

      updatedDimension = result?.[0];
    } catch {
      if ((prisma as any).shopDimension && typeof (prisma as any).shopDimension.update === "function") {
        updatedDimension = await (prisma as any).shopDimension.update({
          where: { id },
          data: {
            label: cleanLabel,
            ...(type ? { type } : {}),
            ...(sortOrder !== undefined ? { sortOrder: Number(sortOrder) } : {}),
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      dimension: updatedDimension || { id, label: cleanLabel, type, sortOrder },
      message: "Dimension updated successfully",
    });
  } catch (err: unknown) {
    console.error("Admin Shop Dimension PUT Error:", err);
    return NextResponse.json(
      { error: (err as Error)?.message || "Failed to update dimension" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ensureDbSchema();
    const auth = await getAdminAuth("SHOP_PRODUCTS_MANAGE");

    if (auth.error || !auth.admin) {
      return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: auth.status || 401 });
    }

    const { id } = await params;

    try {
      await prisma.$executeRawUnsafe(`DELETE FROM "ShopDimension" WHERE "id" = $1;`, id);
    } catch {
      if ((prisma as any).shopDimension && typeof (prisma as any).shopDimension.delete === "function") {
        await (prisma as any).shopDimension.delete({ where: { id } });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Dimension deleted successfully",
    });
  } catch (err: unknown) {
    console.error("Admin Shop Dimension DELETE Error:", err);
    return NextResponse.json(
      { error: (err as Error)?.message || "Failed to delete dimension" },
      { status: 500 }
    );
  }
}
