import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureDbSchema } from "@/lib/ensureDbSchema";
import { getAdminAuth } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await ensureDbSchema();
    const auth = await getAdminAuth("SHOP_PRODUCTS_MANAGE");
    if (auth.error || !auth.admin) {
      return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: auth.status || 401 });
    }

    const resolvedParams = await params;
    const { id } = resolvedParams;

    const body = await req.json();
    const { name, icon, sortOrder, isActive } = body;

    const updateData: any = {};
    if (name !== undefined) updateData.name = String(name).trim();
    if (icon !== undefined) updateData.icon = icon ? String(icon).trim() : null;
    if (sortOrder !== undefined) updateData.sortOrder = Number(sortOrder) || 0;
    if (isActive !== undefined) updateData.isActive = Boolean(isActive);

    let updatedOccasion: any = null;
    try {
      if ((prisma as any).shopOccasion) {
        updatedOccasion = await (prisma as any).shopOccasion.update({
          where: { id },
          data: updateData,
        });
      }
    } catch {
      // Fallback SQL
      await prisma.$executeRawUnsafe(
        `UPDATE "ShopOccasion" SET "name" = COALESCE($1, "name"), "icon" = $2, "sortOrder" = COALESCE($3, "sortOrder"), "isActive" = COALESCE($4, "isActive"), "updatedAt" = NOW() WHERE "id" = $5`,
        updateData.name ?? null,
        updateData.icon ?? null,
        updateData.sortOrder ?? null,
        updateData.isActive ?? null,
        id
      );
      updatedOccasion = { id, ...updateData };
    }

    return NextResponse.json({ occasion: updatedOccasion });
  } catch (error: any) {
    console.error("PUT /api/admin/shop/occasions/[id] error:", error);
    return NextResponse.json({ error: error?.message || "Failed to update occasion" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await ensureDbSchema();
    const auth = await getAdminAuth("SHOP_PRODUCTS_MANAGE");
    if (auth.error || !auth.admin) {
      return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: auth.status || 401 });
    }
    const resolvedParams = await params;
    const { id } = resolvedParams;

    try {
      if ((prisma as any).shopOccasion) {
        await (prisma as any).shopOccasion.delete({ where: { id } });
      }
    } catch {
      // Fallback
      await prisma.$executeRawUnsafe(`DELETE FROM "ShopOccasion" WHERE "id" = $1`, id);
    }

    return NextResponse.json({ success: true, message: `Occasion "${id}" deleted permanently` });
  } catch (error: any) {
    console.error("DELETE /api/admin/shop/occasions/[id] error:", error);
    return NextResponse.json({ error: error?.message || "Failed to delete occasion" }, { status: 500 });
  }
}
