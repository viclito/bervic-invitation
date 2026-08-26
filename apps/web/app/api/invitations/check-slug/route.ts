import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureDbSchema } from "@/lib/ensureDbSchema";

export async function GET(req: Request) {
  try {
    await ensureDbSchema();
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug") || "";
    const currentInvitationId = searchParams.get("invitationId") || "";

    if (!slug || slug.trim() === "") {
      return NextResponse.json({ available: false, error: "Empty slug" }, { status: 400 });
    }

    const formattedSlug = slug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    if (!formattedSlug) {
      return NextResponse.json({ available: false, error: "Invalid slug format" }, { status: 400 });
    }

    const existing = await prisma.userInvitation.findFirst({
      where: {
        slug: formattedSlug,
        ...(currentInvitationId ? { NOT: { id: currentInvitationId } } : {}),
      },
      select: { id: true },
    });

    return NextResponse.json({
      slug: formattedSlug,
      available: !existing,
      message: existing ? "Route is already taken" : "Route is available",
    });
  } catch (error: any) {
    console.error("Error checking slug availability:", error);
    return NextResponse.json(
      { available: true, message: "Route check bypassed" },
      { status: 200 }
    );
  }
}
