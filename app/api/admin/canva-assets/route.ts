import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureDbSchema } from "@/lib/ensureDbSchema";
import { getAdminAuth } from "@/lib/adminAuth";
import { listCloudinaryPNGOverlays } from "@/lib/cloudinary";

export const dynamic = "force-dynamic";

function isPurePNGOverlay(url: string): boolean {
  if (!url || typeof url !== "string") return false;
  const lower = url.toLowerCase().trim();

  // Exclude full card previews, jpeg photos, backgrounds, covers
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return false;
  if (
    lower.includes("preview") ||
    lower.includes("cover") ||
    lower.includes("bg_") ||
    lower.includes("background") ||
    lower.includes("card_") ||
    lower.includes("top-floral-arch.webp") ||
    lower.includes("shop_") ||
    lower.includes("products/")
  ) {
    return false;
  }

  // Must be in overlays folder or be a png/webp overlay asset
  if (lower.includes("bervic-canva/overlays") || lower.includes("/overlays/")) {
    return true;
  }

  // Element overlays with png or webp
  if (lower.endsWith(".png") || lower.endsWith(".webp")) {
    return true;
  }

  return false;
}

export async function GET() {
  try {
    await ensureDbSchema();
    const auth = await getAdminAuth("CANVA_TEMPLATES_MANAGE");

    if (auth.error || !auth.admin) {
      return NextResponse.json(
        { error: auth.error || "Unauthorized" },
        { status: auth.status || 401 }
      );
    }

    const assetSet = new Set<string>();

    // 1. Fetch only dedicated uploaded PNG overlays from Cloudinary Account 2 (bervic-canva/overlays)
    try {
      const cloudinaryOverlays = await listCloudinaryPNGOverlays(100);
      cloudinaryOverlays.forEach((url) => {
        if (isPurePNGOverlay(url)) {
          assetSet.add(url);
        }
      });
    } catch (e) {
      console.warn("Failed to fetch Cloudinary PNG overlays:", e);
    }

    // 2. Fetch image overlays used as elements in DB CanvaTemplate records (strictly filtering out backgrounds/previews)
    try {
      let templates: any[] = [];
      if ((prisma as any).canvaTemplate) {
        templates = await (prisma as any).canvaTemplate.findMany({
          select: { elementsJson: true },
        });
      } else {
        templates = await prisma.$queryRawUnsafe(`
          SELECT "elementsJson" FROM "CanvaTemplate"
        `);
      }

      for (const t of templates || []) {
        let elements = [];
        try {
          elements =
            typeof t.elementsJson === "string"
              ? JSON.parse(t.elementsJson || "[]")
              : t.elementsJson || [];
        } catch {
          elements = [];
        }

        const processEl = (el: any) => {
          if (el && el.type === "image" && el.src && typeof el.src === "string") {
            const src = el.src.trim();
            if (isPurePNGOverlay(src)) {
              assetSet.add(src);
            }
          }
        };

        if (Array.isArray(elements)) {
          elements.forEach(processEl);
        } else if (elements && Array.isArray((elements as any).layers)) {
          (elements as any).layers.forEach((l: any) => {
            if (Array.isArray(l.elements)) {
              l.elements.forEach(processEl);
            }
          });
        }
      }
    } catch (e) {
      console.warn("Failed to extract overlays from templates:", e);
    }

    // 3. Known valid local high-resolution overlays
    const standardAssets = [
      "/images/canva/leaf-divider.webp",
      "/images/canva/floral-footer.webp",
      "/images/canva/vintage-swirl-header.webp",
      "/images/canva/vintage-wave-divider.webp",
      "/images/canva/vintage-swirl-footer.webp",
    ];

    standardAssets.forEach((src) => {
      if (isPurePNGOverlay(src)) assetSet.add(src);
    });

    const allAssets = Array.from(assetSet).filter(Boolean);

    return NextResponse.json({
      success: true,
      count: allAssets.length,
      assets: allAssets,
    });
  } catch (err: unknown) {
    console.error("Admin Canva Assets GET Error:", err);
    return NextResponse.json(
      { error: (err as Error)?.message || "Failed to fetch Canva assets" },
      { status: 500 }
    );
  }
}

