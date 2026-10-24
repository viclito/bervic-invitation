import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { listCloudinaryPNGOverlays } from "@/lib/cloudinary";

export const dynamic = "force-dynamic";

function isPurePNGOverlay(url: string): boolean {
  if (!url || typeof url !== "string") return false;
  const lower = url.toLowerCase().trim();
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return false;
  if (
    lower.includes("preview") ||
    lower.includes("cover") ||
    lower.includes("bg_") ||
    lower.includes("background") ||
    lower.includes("card_") ||
    lower.includes("shop_") ||
    lower.includes("products/")
  ) {
    return false;
  }
  if (lower.includes("bervic-canva/overlays") || lower.includes("/overlays/")) {
    return true;
  }
  if (lower.endsWith(".png") || lower.endsWith(".webp") || lower.endsWith(".svg")) {
    return true;
  }
  return false;
}

export async function GET() {
  try {
    const assetSet = new Set<string>();

    // 1. Cloudinary overlays if available
    try {
      const cloudinaryOverlays = await listCloudinaryPNGOverlays(100);
      cloudinaryOverlays.forEach((url) => {
        if (isPurePNGOverlay(url)) {
          assetSet.add(url);
        }
      });
    } catch {
      // Ignore Cloudinary failure in offline / local dev
    }

    // 2. Local public canva graphics
    const canvaDir = path.join(process.cwd(), "public", "images", "canva");
    if (fs.existsSync(canvaDir)) {
      const files = fs.readdirSync(canvaDir);
      for (const file of files) {
        if (
          file.endsWith(".webp") ||
          file.endsWith(".png") ||
          file.endsWith(".svg")
        ) {
          if (
            !file.includes("thumb") &&
            !file.includes("bg") &&
            !file.includes("template") &&
            !file.startsWith("modern2-") &&
            !file.startsWith("modern-floral-") &&
            !file.startsWith("modern3-")
          ) {
            assetSet.add(`/images/canva/${file}`);
          }
        }
      }
    }

    // Add prominent motifs and overlays
    const standardOverlays = [
      "/images/canva/floral-header.webp",
      "/images/canva/floral-footer.webp",
      "/images/canva/leaf-divider.webp",
      "/images/canva/interlocked-rings.svg",
      "/images/canva/vintage-swirl-header.webp",
      "/images/canva/vintage-swirl-footer.webp",
      "/images/canva/vintage-wave-divider.webp",
      "/images/canva/victorian-header-swirl.webp",
      "/images/canva/victorian-footer-swirl.webp",
      "/images/canva/victorian-center-divider.webp",
      "/images/canva/victorian-date-badge.webp",
      "/images/canva/modern3-foliage-top.webp",
      "/images/canva/modern3-foliage-bottom.webp",
    ];

    standardOverlays.forEach((o) => assetSet.add(o));

    const assets = Array.from(assetSet);
    return NextResponse.json({ assets, count: assets.length });
  } catch (err: unknown) {
    console.error("Public Canva assets error:", err);
    return NextResponse.json({ error: "Failed to list assets", assets: [] }, { status: 500 });
  }
}
