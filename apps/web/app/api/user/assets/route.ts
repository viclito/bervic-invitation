import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { ensureDbSchema } from "@/lib/ensureDbSchema";
import { uploadBufferToCloudinary, deleteCloudinaryImage } from "@/lib/cloudinary";

export const dynamic = "force-dynamic";

async function resolveUserId(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;
  const userObj = session.user as any;
  if (userObj.id) return String(userObj.id);
  if (userObj.email) {
    try {
      const cleanEmail = userObj.email.toLowerCase().trim();
      const dbUser = await prisma.user.findUnique({
        where: { email: cleanEmail },
        select: { id: true },
      });
      if (dbUser?.id) return dbUser.id;

      const rows: any[] = await prisma.$queryRawUnsafe(
        `SELECT "id" FROM "User" WHERE LOWER("email") = $1 LIMIT 1`,
        cleanEmail
      );
      return rows?.[0]?.id || null;
    } catch {
      return null;
    }
  }
  return null;
}

export async function GET() {
  try {
    await ensureDbSchema();
    const userId = await resolveUserId();

    if (!userId) {
      // Unauthenticated guests have no account assets stored in the database
      return NextResponse.json({ success: true, assets: [], count: 0, isGuest: true });
    }

    let assets: any[] = [];

    try {
      if ((prisma as any).userAsset) {
        assets = await (prisma as any).userAsset.findMany({
          where: { userId },
          orderBy: { createdAt: "desc" },
          take: 100,
        });
      } else {
        assets = await prisma.$queryRawUnsafe(
          `SELECT "id", "userId", "name", "url", "publicId", "fileType", "createdAt" 
           FROM "UserAsset" 
           WHERE "userId" = $1 
           ORDER BY "createdAt" DESC 
           LIMIT 100`,
          userId
        );
      }
    } catch (dbErr) {
      console.warn("UserAsset query fallback error:", dbErr);
      assets = [];
    }

    return NextResponse.json({
      success: true,
      assets: assets.map((a) => ({
        id: a.id,
        name: a.name || "Custom Graphic",
        url: a.url,
        fileType: a.fileType || "image",
        createdAt: a.createdAt,
      })),
      count: assets.length,
      isGuest: false,
    });
  } catch (error: any) {
    console.error("GET /api/user/assets error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to load user assets", assets: [] },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await ensureDbSchema();
    const userId = await resolveUserId();

    let fileUrl = "";
    let publicId: string | null = null;
    let fileName = "Uploaded Asset";

    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      if (!file) {
        return NextResponse.json({ error: "No file provided" }, { status: 400 });
      }

      fileName = file.name || "Custom Image";
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadResult = await uploadBufferToCloudinary(
        buffer,
        {
          folder: "bervic-user-assets",
          resource_type: "image",
        },
        "user-assets"
      );

      fileUrl = uploadResult.secure_url;
      publicId = uploadResult.public_id;
    } else {
      const body = await req.json();
      fileUrl = body.url;
      fileName = body.name || "Custom Image";
      publicId = body.publicId || null;
    }

    if (!fileUrl) {
      return NextResponse.json({ error: "Missing asset image URL" }, { status: 400 });
    }

    // If logged in, persist to UserAsset strictly scoped to userId
    if (userId) {
      const assetId = `asset_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      let savedAsset: any = null;

      try {
        if ((prisma as any).userAsset) {
          savedAsset = await (prisma as any).userAsset.create({
            data: {
              id: assetId,
              userId,
              name: fileName,
              url: fileUrl,
              publicId,
              fileType: "image",
            },
          });
        } else {
          await prisma.$executeRawUnsafe(
            `INSERT INTO "UserAsset" ("id", "userId", "name", "url", "publicId", "fileType", "createdAt", "updatedAt")
             VALUES ($1, $2, $3, $4, $5, 'image', NOW(), NOW())`,
            assetId,
            userId,
            fileName,
            fileUrl,
            publicId
          );
          savedAsset = { id: assetId, userId, name: fileName, url: fileUrl };
        }
      } catch (insertErr) {
        console.warn("Failed to persist userAsset row in DB, using fallback:", insertErr);
        savedAsset = { id: assetId, userId, name: fileName, url: fileUrl };
      }

      return NextResponse.json({
        success: true,
        asset: {
          id: savedAsset.id,
          name: fileName,
          url: fileUrl,
        },
        isGuest: false,
      });
    }

    // If guest, return the uploaded URL with a guest indicator
    return NextResponse.json({
      success: true,
      asset: {
        id: `guest_${Date.now()}`,
        name: fileName,
        url: fileUrl,
      },
      isGuest: true,
    });
  } catch (error: any) {
    console.error("POST /api/user/assets error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to upload asset" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    await ensureDbSchema();
    const userId = await resolveUserId();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const queryId = searchParams.get("id");
    let bodyId: string | null = null;
    try {
      const body = await req.json();
      bodyId = body?.id || null;
    } catch {}

    const assetId = queryId || bodyId;
    if (!assetId) {
      return NextResponse.json({ error: "Missing asset ID" }, { status: 400 });
    }

    // Strict multi-tenant isolation: only delete if asset belongs to userId
    try {
      if ((prisma as any).userAsset) {
        const existing = await (prisma as any).userAsset.findFirst({
          where: { id: assetId, userId },
        });

        if (!existing) {
          return NextResponse.json(
            { error: "Asset not found or unauthorized to delete" },
            { status: 404 }
          );
        }

        if (existing.publicId) {
          deleteCloudinaryImage(existing.publicId, "user-assets").catch(() => {});
        }

        await (prisma as any).userAsset.delete({
          where: { id: assetId },
        });
      } else {
        const rows: any[] = await prisma.$queryRawUnsafe(
          `SELECT "id", "publicId" FROM "UserAsset" WHERE "id" = $1 AND "userId" = $2 LIMIT 1`,
          assetId,
          userId
        );

        if (!rows || rows.length === 0) {
          return NextResponse.json(
            { error: "Asset not found or unauthorized to delete" },
            { status: 404 }
          );
        }

        if (rows[0]?.publicId) {
          deleteCloudinaryImage(rows[0].publicId, "user-assets").catch(() => {});
        }

        await prisma.$executeRawUnsafe(
          `DELETE FROM "UserAsset" WHERE "id" = $1 AND "userId" = $2`,
          assetId,
          userId
        );
      }
    } catch (delErr: any) {
      console.warn("Delete UserAsset error:", delErr);
      return NextResponse.json({ error: delErr?.message || "Failed to delete asset" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Asset deleted from your account" });
  } catch (error: any) {
    console.error("DELETE /api/user/assets error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to delete asset" },
      { status: 500 }
    );
  }
}
