import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getAdminAuth } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const auth = await getAdminAuth("CANVA_TEMPLATES_MANAGE");
    if (auth.error || !auth.admin) {
      return NextResponse.json(
        { error: auth.error || "Unauthorized" },
        { status: auth.status || 401 }
      );
    }

    const bgDir = path.join(process.cwd(), "public", "images", "canva", "backgrounds");
    let textureFiles: string[] = [];

    if (fs.existsSync(bgDir)) {
      textureFiles = fs
        .readdirSync(bgDir)
        .filter((f) => f.endsWith(".webp") || f.endsWith(".png") || f.endsWith(".jpg"))
        .sort((a, b) => {
          return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
        });
    }

    const textures = textureFiles.map((filename, idx) => {
      const num = String(idx + 1).padStart(2, "0");
      return {
        id: `texture-${num}`,
        name: `Texture ${num}`,
        num,
        src: `/images/canva/backgrounds/${filename}`,
      };
    });

    return NextResponse.json({ textures, count: textures.length });
  } catch (err: any) {
    console.error("Failed to list textures:", err);
    return NextResponse.json({ error: "Failed to list textures", textures: [] }, { status: 500 });
  }
}
