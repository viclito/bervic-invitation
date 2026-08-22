import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureDbSchema } from "@/lib/ensureDbSchema";
import { getAdminAuth } from "@/lib/adminAuth";

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await ensureDbSchema();
    const auth = await getAdminAuth("CANVA_TEMPLATES_MANAGE");

    if (auth.error || !auth.admin) {
      return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: auth.status || 401 });
    }

    const { id } = await context.params;

    let template: any = null;
    if ((prisma as any).canvaTemplate) {
      template = await (prisma as any).canvaTemplate.findFirst({
        where: {
          OR: [{ id }, { slug: id }],
        },
      });
    } else {
      const rows: any[] = await prisma.$queryRawUnsafe(
        `SELECT * FROM "CanvaTemplate" WHERE "id" = $1 OR "slug" = $1 LIMIT 1`,
        id
      );
      template = rows[0] || null;
    }

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

    let updatedTemplate: any = null;

    if ((prisma as any).canvaTemplate) {
      updatedTemplate = await (prisma as any).canvaTemplate.update({
        where: { id },
        data: {
          name: name !== undefined ? String(name).trim() : undefined,
          slug: slug !== undefined ? String(slug).trim() : undefined,
          topic: topic !== undefined ? String(topic).trim() : undefined,
          category: category !== undefined ? String(category).trim() : undefined,
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
    } else {
      await prisma.$executeRawUnsafe(
        `UPDATE "CanvaTemplate" SET
          "name" = COALESCE($2, "name"),
          "topic" = COALESCE($3, "topic"),
          "category" = COALESCE($4, "category"),
          "aspectRatio" = COALESCE($5, "aspectRatio"),
          "backgroundColor" = COALESCE($6, "backgroundColor"),
          "backgroundImage" = $7,
          "previewImage" = $8,
          "elementsJson" = COALESCE($9, "elementsJson"),
          "isActive" = COALESCE($10, "isActive"),
          "sortOrder" = COALESCE($11, "sortOrder"),
          "updatedAt" = NOW()
         WHERE "id" = $1`,
        id,
        name,
        topic,
        category,
        aspectRatio,
        backgroundColor,
        backgroundImage,
        previewImage,
        elementsJson,
        isActive,
        sortOrder
      );

      const rows: any[] = await prisma.$queryRawUnsafe(
        `SELECT * FROM "CanvaTemplate" WHERE "id" = $1 LIMIT 1`,
        id
      );
      updatedTemplate = rows[0];
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
