import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureDbSchema } from "@/lib/ensureDbSchema";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await ensureDbSchema();

    const templates: any[] = await prisma.$queryRawUnsafe(`
      SELECT * FROM "CanvaTemplate" WHERE "isActive" = true ORDER BY "sortOrder" ASC, "createdAt" DESC
    `);

    // Format parsed elements and color variants
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
        id: t.slug || t.id,
        dbId: t.id,
        name: t.name,
        topic: t.topic || "vintage",
        category: t.category || "Custom Admin Template",
        pricePerCard: t.pricePerCard !== undefined && t.pricePerCard !== null ? Number(t.pricePerCard) : 30,
        minCopies: t.minCopies !== undefined && t.minCopies !== null ? Number(t.minCopies) : 50,
        paperType: t.paperType || "350 GSM Textured Metallic Gold Cardstock",
        badge: t.badge || null,
        previewImage: t.previewImage || "/images/canva/template1-thumb.webp",
        aspectRatio: t.aspectRatio || "classic",
        backgroundColor: t.backgroundColor || "#F3EAD8",
        backgroundImage: t.backgroundImage || undefined,
        elements,
        colorVariants,
        isCustom: true,
        sortOrder: t.sortOrder ?? 0,
        createdAt: t.createdAt,
      };
    });

    return NextResponse.json({ templates: formattedTemplates });
  } catch (err: unknown) {
    console.error("Canva Templates Public GET Error:", err);
    return NextResponse.json(
      { error: (err as Error)?.message || "Failed to fetch Canva templates" },
      { status: 500 }
    );
  }
}
