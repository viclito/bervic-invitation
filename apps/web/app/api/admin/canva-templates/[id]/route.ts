import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureDbSchema } from "@/lib/ensureDbSchema";
import { getAdminAuth } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await ensureDbSchema();
    const auth = await getAdminAuth("CANVA_TEMPLATES_MANAGE");

    if (auth.error || !auth.admin) {
      return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: auth.status || 401 });
    }

    const { id } = await context.params;

    const rows: any[] = await prisma.$queryRawUnsafe(
      `SELECT * FROM "CanvaTemplate" WHERE "id" = $1 OR "slug" = $1 LIMIT 1`,
      id
    );
    const template: any = rows[0] || null;

    if (!template) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

    let elements = [];
    try {
      elements = typeof template.elementsJson === "string" ? JSON.parse(template.elementsJson) : template.elementsJson || [];
    } catch {
      elements = [];
    }

    let colorVariants = null;
    try {
      if (template.colorVariantsJson) {
        colorVariants = typeof template.colorVariantsJson === "string" ? JSON.parse(template.colorVariantsJson) : template.colorVariantsJson;
      }
    } catch {
      colorVariants = null;
    }

    return NextResponse.json({
      template: {
        id: template.id,
        slug: template.slug,
        name: template.name,
        topic: template.topic,
        category: template.category,
        pricePerCard: template.pricePerCard !== undefined && template.pricePerCard !== null ? Number(template.pricePerCard) : 30,
        minCopies: template.minCopies !== undefined && template.minCopies !== null ? Number(template.minCopies) : 50,
        paperType: template.paperType || "350 GSM Textured Metallic Gold Cardstock",
        badge: template.badge || null,
        aspectRatio: template.aspectRatio,
        backgroundColor: template.backgroundColor,
        backgroundImage: template.backgroundImage,
        previewImage: template.previewImage,
        elements,
        colorVariants,
        isActive: template.isActive,
        sortOrder: template.sortOrder,
        createdAt: template.createdAt,
        updatedAt: template.updatedAt,
      },
    });
  } catch (err: unknown) {
    console.error("Admin Canva Template GET [id] Error:", err);
    return NextResponse.json(
      { error: (err as Error)?.message || "Failed to fetch template" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await ensureDbSchema();
    const auth = await getAdminAuth("CANVA_TEMPLATES_MANAGE");

    if (auth.error || !auth.admin) {
      return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: auth.status || 401 });
    }

    const { id } = await context.params;
    const body = await req.json();
    const {
      name,
      slug,
      topic,
      category,
      pricePerCard,
      minCopies,
      paperType,
      badge,
      aspectRatio,
      backgroundColor,
      backgroundImage,
      previewImage,
      elements,
      colorVariants,
      isActive,
      sortOrder,
    } = body;

    const elementsJson = elements !== undefined ? (typeof elements === "string" ? elements : JSON.stringify(elements)) : undefined;
    const colorVariantsJson = colorVariants !== undefined ? (typeof colorVariants === "string" ? colorVariants : JSON.stringify(colorVariants)) : undefined;

    const numPrice = pricePerCard !== undefined ? (Number(pricePerCard) > 0 ? Number(pricePerCard) : 30) : undefined;
    const numMinCopies = minCopies !== undefined ? (Number(minCopies) > 0 ? Number(minCopies) : 50) : undefined;

    let updatedTemplate: any = null;
    let prismaSuccess = false;

    if ((prisma as any).canvaTemplate) {
      try {
        updatedTemplate = await (prisma as any).canvaTemplate.update({
          where: { id },
          data: {
            name: name !== undefined ? String(name).trim() : undefined,
            slug: slug !== undefined ? String(slug).trim() : undefined,
            topic: topic !== undefined ? String(topic).trim() : undefined,
            category: category !== undefined ? String(category).trim() : undefined,
            ...(numPrice !== undefined ? { pricePerCard: numPrice } : {}),
            ...(numMinCopies !== undefined ? { minCopies: numMinCopies } : {}),
            ...(paperType !== undefined ? { paperType: String(paperType).trim() } : {}),
            ...(badge !== undefined ? { badge: badge ? String(badge).trim() : null } : {}),
            aspectRatio: aspectRatio !== undefined ? String(aspectRatio).trim() : undefined,
            backgroundColor: backgroundColor !== undefined ? String(backgroundColor).trim() : undefined,
            backgroundImage: backgroundImage !== undefined ? (backgroundImage ? String(backgroundImage).trim() : null) : undefined,
            previewImage: previewImage !== undefined ? (previewImage ? String(previewImage).trim() : null) : undefined,
            ...(elementsJson !== undefined ? { elementsJson } : {}),
            ...(colorVariantsJson !== undefined ? { colorVariantsJson } : {}),
            isActive: isActive !== undefined ? Boolean(isActive) : undefined,
            sortOrder: sortOrder !== undefined ? Number(sortOrder) : undefined,
          },
        });
        prismaSuccess = true;
      } catch (prismaErr) {
        console.warn("Prisma CanvaTemplate update failed, falling back to SQL:", prismaErr);
      }
    }

    if (!updatedTemplate || !prismaSuccess) {
      const existing: any[] = await prisma.$queryRawUnsafe(
        `SELECT * FROM "CanvaTemplate" WHERE "id" = $1 OR "slug" = $1 LIMIT 1`,
        id
      );
      const cur = existing[0] || {};
      const targetId = cur.id || id;

      await prisma.$executeRawUnsafe(
        `UPDATE "CanvaTemplate" SET
          "name" = COALESCE($2, "name"),
          "topic" = COALESCE($3, "topic"),
          "category" = COALESCE($4, "category"),
          "pricePerCard" = COALESCE($5, "pricePerCard"),
          "minCopies" = COALESCE($6, "minCopies"),
          "paperType" = COALESCE($7, "paperType"),
          "badge" = $8,
          "aspectRatio" = COALESCE($9, "aspectRatio"),
          "backgroundColor" = COALESCE($10, "backgroundColor"),
          "backgroundImage" = $11,
          "previewImage" = $12,
          "elementsJson" = COALESCE($13, "elementsJson"),
          "isActive" = COALESCE($14, "isActive"),
          "sortOrder" = COALESCE($15, "sortOrder"),
          "updatedAt" = NOW()
         WHERE "id" = $1 OR "slug" = $1`,
        targetId,
        name !== undefined ? String(name).trim() : null,
        topic !== undefined ? String(topic).trim() : null,
        category !== undefined ? String(category).trim() : null,
        numPrice !== undefined ? numPrice : null,
        numMinCopies !== undefined ? numMinCopies : null,
        paperType !== undefined ? String(paperType).trim() : null,
        badge !== undefined ? (badge ? String(badge).trim() : null) : (cur.badge || null),
        aspectRatio !== undefined ? String(aspectRatio).trim() : null,
        backgroundColor !== undefined ? String(backgroundColor).trim() : null,
        backgroundImage !== undefined ? (backgroundImage ? String(backgroundImage).trim() : null) : (cur.backgroundImage || null),
        previewImage !== undefined ? (previewImage ? String(previewImage).trim() : null) : (cur.previewImage || null),
        elementsJson !== undefined ? elementsJson : null,
        isActive !== undefined ? Boolean(isActive) : null,
        sortOrder !== undefined ? Number(sortOrder) : null
      );

      const rows: any[] = await prisma.$queryRawUnsafe(
        `SELECT * FROM "CanvaTemplate" WHERE "id" = $1 OR "slug" = $1 LIMIT 1`,
        targetId
      );
      updatedTemplate = rows[0];
    }

    // Sync connected ShopProduct if linked
    if (numPrice !== undefined || paperType !== undefined || badge !== undefined) {
      try {
        if ((prisma as any).shopProduct) {
          await (prisma as any).shopProduct.updateMany({
            where: {
              OR: [
                { canvaTemplateId: id },
                { canvaTemplateId: updatedTemplate?.slug },
                { name: updatedTemplate?.name || name },
              ],
            },
            data: {
              ...(numPrice !== undefined ? { pricePerCard: numPrice } : {}),
              ...(paperType !== undefined ? { paperType: String(paperType).trim() } : {}),
              ...(badge !== undefined ? { badge: badge ? String(badge).trim() : null } : {}),
            },
          });
        }
      } catch {
        // ignore sync warning
      }
    }

    return NextResponse.json({ success: true, template: updatedTemplate });
  } catch (err: unknown) {
    console.error("Admin Canva Template PUT [id] Error:", err);
    return NextResponse.json(
      { error: (err as Error)?.message || "Failed to update template" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await ensureDbSchema();
    const auth = await getAdminAuth("CANVA_TEMPLATES_MANAGE");

    if (auth.error || !auth.admin) {
      return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: auth.status || 401 });
    }

    const { id } = await context.params;

    if ((prisma as any).canvaTemplate) {
      await (prisma as any).canvaTemplate.delete({
        where: { id },
      });
    } else {
      await prisma.$executeRawUnsafe(`DELETE FROM "CanvaTemplate" WHERE "id" = $1`, id);
    }

    return NextResponse.json({ success: true, message: "Template deleted successfully" });
  } catch (err: unknown) {
    console.error("Admin Canva Template DELETE [id] Error:", err);
    return NextResponse.json(
      { error: (err as Error)?.message || "Failed to delete template" },
      { status: 500 }
    );
  }
}
