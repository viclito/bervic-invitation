import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { ensureDbSchema } from "@/lib/ensureDbSchema";

function isAdmin(email?: string | null) {
  return email?.toLowerCase() === "berglin1998@gmail.com";
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await ensureDbSchema();
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !isAdmin(session.user.email)) {
      return NextResponse.json({ error: "Unauthorized. Admin authority required." }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();

    const updateData: Record<string, unknown> = {};

    if (body.name !== undefined) updateData.name = String(body.name).trim();
    if (body.category !== undefined) updateData.category = String(body.category).toLowerCase();
    if (body.pricePerCard !== undefined) updateData.pricePerCard = Number(body.pricePerCard) || 0;
    if (body.minCopies !== undefined) updateData.minCopies = Number(body.minCopies) || 50;
    if (body.previewImage !== undefined) updateData.previewImage = String(body.previewImage).trim();
    if (body.galleryImages !== undefined) {
      updateData.galleryImages = typeof body.galleryImages === "string" ? body.galleryImages : JSON.stringify(body.galleryImages || []);
    }
    if (body.badge !== undefined) updateData.badge = body.badge ? String(body.badge).trim() : null;
    if (body.paperType !== undefined) updateData.paperType = String(body.paperType).trim();
    if (body.dimensions !== undefined) updateData.dimensions = String(body.dimensions).trim();
    if (body.description !== undefined) updateData.description = String(body.description).trim();
    if (body.rating !== undefined) updateData.rating = Number(body.rating) || 5.0;
    if (body.reviewsCount !== undefined) updateData.reviewsCount = Number(body.reviewsCount) || 50;
    if (body.isActive !== undefined) updateData.isActive = Boolean(body.isActive);
    if (body.sortOrder !== undefined) updateData.sortOrder = Number(body.sortOrder) || 0;
    if (body.canvaTemplateId !== undefined) {
      updateData.canvaTemplateId = body.canvaTemplateId ? String(body.canvaTemplateId).trim() : null;
    }
    if (body.features !== undefined) {
      updateData.featuresJson = Array.isArray(body.features)
        ? JSON.stringify(body.features)
        : typeof body.features === "string"
        ? body.features
        : "[]";
    } else if (body.featuresJson !== undefined) {
      updateData.featuresJson = typeof body.featuresJson === "string" ? body.featuresJson : JSON.stringify(body.featuresJson || []);
    }

    let updated: any = null;
    let prismaUpdateFailed = false;

    if ((prisma as any).shopProduct) {
      try {
        updated = await (prisma as any).shopProduct.update({
          where: { id },
          data: updateData,
        });
      } catch (prismaErr) {
        console.warn("Prisma update failed, falling back to raw SQL:", prismaErr);
        prismaUpdateFailed = true;
      }
    }

    if (!updated || prismaUpdateFailed) {
      // Dynamic SQL update fallback
      const setClauses: string[] = [];
      const values: unknown[] = [];
      let paramIdx = 1;

      for (const [key, val] of Object.entries(updateData)) {
        setClauses.push(`"${key}" = $${paramIdx}`);
        values.push(val);
        paramIdx++;
      }

      setClauses.push(`"updatedAt" = NOW()`);
      values.push(id);

      if (setClauses.length > 0) {
        await prisma.$executeRawUnsafe(
          `UPDATE "ShopProduct" SET ${setClauses.join(", ")} WHERE "id" = $${paramIdx}`,
          ...values
        );
      }

      const rows: any[] = await prisma.$queryRawUnsafe(
        `SELECT * FROM "ShopProduct" WHERE "id" = $1 LIMIT 1`,
        id
      );
      updated = rows[0] || { id, ...updateData };
    }

    return NextResponse.json({ success: true, product: updated });
  } catch (err: unknown) {
    console.error("Admin Shop Product Update Error:", err);
    return NextResponse.json({ error: (err as Error)?.message || "Failed to update shop product" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await ensureDbSchema();
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !isAdmin(session.user.email)) {
      return NextResponse.json({ error: "Unauthorized. Admin authority required." }, { status: 403 });
    }

    const { id } = await params;

    if ((prisma as any).shopProduct) {
      await (prisma as any).shopProduct.delete({
        where: { id },
      });
    } else {
      await prisma.$executeRawUnsafe(`DELETE FROM "ShopProduct" WHERE "id" = $1`, id);
    }

    return NextResponse.json({ success: true, message: "Product deleted successfully" });
  } catch (err: unknown) {
    console.error("Admin Shop Product Delete Error:", err);
    return NextResponse.json({ error: (err as Error)?.message || "Failed to delete shop product" }, { status: 500 });
  }
}
