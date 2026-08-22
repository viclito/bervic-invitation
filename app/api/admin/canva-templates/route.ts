import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureDbSchema } from "@/lib/ensureDbSchema";
import { getAdminAuth } from "@/lib/adminAuth";
import crypto from "crypto";

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

export async function GET() {
  try {
    await ensureDbSchema();
    const auth = await getAdminAuth("CANVA_TEMPLATES_MANAGE");

    if (auth.error || !auth.admin) {
      return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: auth.status || 401 });
    }

    let templates: any[] = [];
    try {
      if ((prisma as any).canvaTemplate) {
        templates = await (prisma as any).canvaTemplate.findMany({
          orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        });
      } else {
        templates = await prisma.$queryRawUnsafe(`
          SELECT * FROM "CanvaTemplate" ORDER BY "sortOrder" ASC, "createdAt" DESC
        `);
      }
    } catch {
      templates = await prisma.$queryRawUnsafe(`
        SELECT * FROM "CanvaTemplate" ORDER BY "sortOrder" ASC, "createdAt" DESC
      `);
    }

    const formattedTemplates = (templates || []).map((t: any) => {
      let elements = [];
      try {
        elements = typeof t.elementsJson === "string" ? JSON.parse(t.elementsJson) : t.elementsJson || [];
      } catch {
        elements = [];
      }

      let colorVariants = null;
      try {
        if (t.colorVariantsJson) {
          colorVariants = typeof t.colorVariantsJson === "string" ? JSON.parse(t.colorVariantsJson) : t.colorVariantsJson;
        }
      } catch {
        colorVariants = null;
      }

      return {
        id: t.id,
        slug: t.slug,
        name: t.name,
        topic: t.topic,
        category: t.category,
        aspectRatio: t.aspectRatio,
        backgroundColor: t.backgroundColor,
        backgroundImage: t.backgroundImage,
        previewImage: t.previewImage,
        elements,
        colorVariants,
        isActive: t.isActive,
        sortOrder: t.sortOrder,
        createdAt: t.createdAt,
        updatedAt: t.updatedAt,
      };
    });

    return NextResponse.json({ templates: formattedTemplates });
  } catch (err: unknown) {
    console.error("Admin Canva Templates GET Error:", err);
    return NextResponse.json(
      { error: (err as Error)?.message || "Failed to fetch Canva templates" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await ensureDbSchema();
    const auth = await getAdminAuth("CANVA_TEMPLATES_MANAGE");

    if (auth.error || !auth.admin) {
      return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: auth.status || 401 });
    }

    const body = await req.json();
    const {
      name,
      slug: customSlug,
      topic = "vintage",
      category = "Vintage Floral",
      aspectRatio = "classic",
      backgroundColor = "#F3EAD8",
      backgroundImage = null,
      previewImage = null,
      elements = [],
      colorVariants = null,
      isActive = true,
      sortOrder = 0,
    } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Template name is required." }, { status: 400 });
    }

    const cleanName = String(name).trim();
    const baseSlug = customSlug && customSlug.trim() ? slugify(customSlug) : slugify(cleanName);
    const uniqueSlug = `${baseSlug}-${crypto.randomBytes(3).toString("hex")}`;
    const id = `tmpl_${crypto.randomBytes(12).toString("hex")}`;

    const elementsJson = typeof elements === "string" ? elements : JSON.stringify(elements || []);
    const colorVariantsJson = colorVariants
      ? typeof colorVariants === "string"
        ? colorVariants
        : JSON.stringify(colorVariants)
      : null;

    let createdTemplate: any = null;
    let prismaFailed = false;

    if ((prisma as any).canvaTemplate) {
      try {
        createdTemplate = await (prisma as any).canvaTemplate.create({
          data: {
            id,
            slug: uniqueSlug,
            name: cleanName,
            topic: String(topic).toLowerCase() === "modern" ? "modern" : "vintage",
            category: String(category).trim(),
            aspectRatio: String(aspectRatio).trim(),
            backgroundColor: String(backgroundColor).trim(),
            backgroundImage: backgroundImage ? String(backgroundImage).trim() : null,
            previewImage: previewImage ? String(previewImage).trim() : null,
            elementsJson,
            colorVariantsJson,
            isActive: Boolean(isActive),
            sortOrder: Number(sortOrder) || 0,
          },
        });
      } catch (e) {
        console.warn("Prisma CanvaTemplate create failed, using raw SQL:", e);
        prismaFailed = true;
      }
    }

    if (!createdTemplate || prismaFailed) {
      await prisma.$executeRawUnsafe(
        `INSERT INTO "CanvaTemplate" ("id", "slug", "name", "topic", "category", "aspectRatio", "backgroundColor", "backgroundImage", "previewImage", "elementsJson", "colorVariantsJson", "isActive", "sortOrder", "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW(), NOW())`,
        id,
        uniqueSlug,
        cleanName,
        String(topic).toLowerCase() === "modern" ? "modern" : "vintage",
        String(category).trim(),
        String(aspectRatio).trim(),
        String(backgroundColor).trim(),
        backgroundImage ? String(backgroundImage).trim() : null,
        previewImage ? String(previewImage).trim() : null,
        elementsJson,
        colorVariantsJson,
        Boolean(isActive),
        Number(sortOrder) || 0
      );

      const rows: any[] = await prisma.$queryRawUnsafe(
        `SELECT * FROM "CanvaTemplate" WHERE "id" = $1 LIMIT 1`,
        id
      );
      createdTemplate = rows[0];
    }

    return NextResponse.json({ success: true, template: createdTemplate });
  } catch (err: unknown) {
    console.error("Admin Canva Template Create Error:", err);
    return NextResponse.json(
      { error: (err as Error)?.message || "Failed to create Canva template" },
      { status: 500 }
    );
  }
}

// Bulk delete or toggle status
export async function DELETE(req: Request) {
  try {
    await ensureDbSchema();
    const auth = await getAdminAuth("CANVA_TEMPLATES_MANAGE");

    if (auth.error || !auth.admin) {
      return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: auth.status || 401 });
    }

    const body = await req.json();
    const { templateIds } = body;

    if (!Array.isArray(templateIds) || templateIds.length === 0) {
      return NextResponse.json({ error: "templateIds array is required." }, { status: 400 });
    }

    if ((prisma as any).canvaTemplate) {
      await (prisma as any).canvaTemplate.deleteMany({
        where: { id: { in: templateIds } },
      });
    } else {
      await prisma.$executeRawUnsafe(
        `DELETE FROM "CanvaTemplate" WHERE "id" = ANY($1::text[])`,
        templateIds
      );
    }

    return NextResponse.json({ success: true, deletedCount: templateIds.length });
  } catch (err: unknown) {
    console.error("Admin Canva Templates Bulk DELETE Error:", err);
    return NextResponse.json(
      { error: (err as Error)?.message || "Failed to bulk delete Canva templates" },
      { status: 500 }
    );
  }
}
