import { NextResponse } from "next/server";
import { templatesRegistry } from "@/data/templatesRegistry";

export const dynamic = "force-static";
export const revalidate = 3600;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    let templates = templatesRegistry;
    if (category && category !== "all") {
      templates = templatesRegistry.filter(
        (t) => t.category.toLowerCase() === category.toLowerCase()
      );
    }

    return NextResponse.json(
      {
        templates,
        total: templates.length,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to load templates", templates: [] },
      { status: 500 }
    );
  }
}
