import { NextResponse } from "next/server";
import {
  uploadBufferToCloudinary,
  deleteCloudinaryImage,
  extractCloudinaryPublicId,
} from "@/lib/cloudinary";

export { extractCloudinaryPublicId };

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const queryTarget = searchParams.get("target");

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const bodyTarget = (formData.get("target") as string | null) || queryTarget || "templates";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult = await uploadBufferToCloudinary(
      buffer,
      {
        resource_type: "auto",
      },
      bodyTarget
    );

    return NextResponse.json({
      message: "Image uploaded successfully to Cloudinary",
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      target: bodyTarget,
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
    const { url, publicId, target } = body;

    const targetIdentifier = publicId || url;

    if (!targetIdentifier) {
      return NextResponse.json(
        { error: "No valid Cloudinary URL or publicId provided for deletion" },
        { status: 400 }
      );
    }

    const deleteResult = await deleteCloudinaryImage(targetIdentifier, target);

    return NextResponse.json({
      message: "Old image deleted from Cloudinary successfully",
      publicId: deleteResult.publicId,
      result: deleteResult.result,
    });
  } catch (error: any) {
    console.error("Cloudinary Delete Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to delete image from Cloudinary" },
      { status: 500 }
    );
  }
}
