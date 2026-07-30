import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY || process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export function extractCloudinaryPublicId(url: string): string | null {
  if (!url || !url.includes("res.cloudinary.com")) return null;

  try {
    const uploadIndex = url.indexOf("/upload/");
    if (uploadIndex === -1) return null;

    let path = url.substring(uploadIndex + 8);
    // Strip version string if present e.g. "v1785396939/"
    if (path.match(/^v\d+\//)) {
      path = path.replace(/^v\d+\//, "");
    }

    // Strip extension e.g. ".jpg", ".png", ".webp"
    const lastDotIndex = path.lastIndexOf(".");
    if (lastDotIndex !== -1) {
      path = path.substring(0, lastDotIndex);
    }

    return path;
  } catch (e) {
    console.error("Failed to extract Cloudinary public_id:", e);
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "bervic-invitations",
          resource_type: "auto",
        },
        (error, result) => {
          if (error || !result) {
            reject(error || new Error("Cloudinary upload failed"));
          } else {
            resolve(result as { secure_url: string; public_id: string });
          }
        }
      );

      uploadStream.end(buffer);
    });

    return NextResponse.json({
      message: "Image uploaded successfully to Cloudinary",
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
    });
  } catch (error: any) {
    console.error("Cloudinary Upload Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to upload image to Cloudinary" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { url, publicId } = body;

    const targetPublicId = publicId || (url ? extractCloudinaryPublicId(url) : null);

    if (!targetPublicId) {
      return NextResponse.json(
        { error: "No valid Cloudinary URL or publicId provided for deletion" },
        { status: 400 }
      );
    }

    const result = await cloudinary.uploader.destroy(targetPublicId, { invalidate: true });

    return NextResponse.json({
      message: "Old image deleted from Cloudinary successfully",
      publicId: targetPublicId,
      result,
    });
  } catch (error: any) {
    console.error("Cloudinary Delete Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to delete image from Cloudinary" },
      { status: 500 }
    );
  }
}
