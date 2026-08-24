import { v2 as cloudinary, UploadApiOptions, UploadApiResponse } from "cloudinary";

// ── Cloudinary Account 1: Templates, Invitations, User Cards, Guest RSVP ──
export const cloudinaryConfigPrimary = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dyhqbizxz",
  api_key: process.env.CLOUDINARY_API_KEY || process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || "273927643392139",
  api_secret: process.env.CLOUDINARY_API_SECRET || "d0toKMwln1HDgLoqH36-Qq-ctF4",
};

// ── Cloudinary Account 2: Canva Studio & Shop Products ──
export const cloudinaryConfigSecondary = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME2 || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME2 || "dqiwclph",
  api_key: process.env.CLOUDINARY_API_KEY2 || process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY2 || "564451441525367",
  api_secret: process.env.CLOUDINARY_API_SECRET2 || "2sR2OzquIFhGjxSeMWNm6nNXQxA",
};

/**
 * Returns the appropriate Cloudinary config based on the destination service.
 * - "canva" | "shop" => Account 2 (dqiwclph)
 * - "templates" | other => Account 1 (dyhqbizxz)
 */
export function getCloudinaryConfig(target?: string | null) {
  const normalized = (target || "").toLowerCase().trim();
  if (normalized === "canva" || normalized === "shop") {
    return cloudinaryConfigSecondary;
  }
  return cloudinaryConfigPrimary;
}

/**
 * Determines which Cloudinary account an image URL belongs to for safe deletion/management.
 */
export function getCloudinaryConfigForUrl(url: string) {
  const cloud2 = cloudinaryConfigSecondary.cloud_name;
  if (url && cloud2 && url.includes(`/${cloud2}/`)) {
    return cloudinaryConfigSecondary;
  }
  return cloudinaryConfigPrimary;
}

/**
 * Safely extracts the Cloudinary public_id from an image/asset URL.
 */
export function extractCloudinaryPublicId(url: string): string | null {
  if (!url || !url.includes("res.cloudinary.com")) return null;

  try {
    const uploadIndex = url.indexOf("/upload/");
    if (uploadIndex === -1) return null;

    let path = url.substring(uploadIndex + 8);
    // Strip version prefix e.g. "v1785396939/"
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

/**
 * Uploads a Buffer to Cloudinary via upload_stream using the designated account.
 */
export async function uploadBufferToCloudinary(
  buffer: Buffer,
  options: UploadApiOptions = {},
  target?: string | null
): Promise<UploadApiResponse> {
  const config = getCloudinaryConfig(target);

  const defaultFolder =
    target === "canva-overlays" || target === "overlays"
      ? "bervic-canva/overlays"
      : target === "canva"
      ? "bervic-canva"
      : target === "shop"
      ? "bervic-shop"
      : "bervic-invitations";

  const uploadOptions: UploadApiOptions = {
    ...config,
    folder: options.folder || defaultFolder,
    resource_type: options.resource_type || "auto",
    transformation: options.transformation || [
      {
        width: 2560,
        height: 2560,
        crop: "limit",
        quality: "auto:good",
        fetch_format: "auto",
      },
    ],
    flags: options.flags || "strip_profile",
    ...options,
  };

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
      if (error || !result) {
        reject(error || new Error("Cloudinary upload failed"));
      } else {
        resolve(result);
      }
    });
    stream.end(buffer);
  });
}

/**
 * Destroys an image in Cloudinary, automatically identifying the correct account from its URL or publicId.
 */
export async function deleteCloudinaryImage(
  publicIdOrUrl: string,
  target?: string | null
): Promise<{ result: string; publicId: string }> {
  let targetPublicId = publicIdOrUrl;
  let config = getCloudinaryConfig(target);

  if (publicIdOrUrl.startsWith("http://") || publicIdOrUrl.startsWith("https://")) {
    config = getCloudinaryConfigForUrl(publicIdOrUrl);
    const extracted = extractCloudinaryPublicId(publicIdOrUrl);
    if (!extracted) {
      throw new Error("Invalid Cloudinary URL provided for deletion");
    }
    targetPublicId = extracted;
  }

  const res = await cloudinary.uploader.destroy(targetPublicId, {
    ...config,
    invalidate: true,
  });

  return { result: res.result || "ok", publicId: targetPublicId };
}

/**
 * Lists ONLY PNG/WebP overlay graphics uploaded for Canva builder.
 */
export async function listCloudinaryPNGOverlays(
  maxResults: number = 100
): Promise<string[]> {
  const config = cloudinaryConfigSecondary;
  const urls: string[] = [];

  try {
    const result = await cloudinary.api.resources({
      ...config,
      type: "upload",
      prefix: "bervic-canva/overlays",
      max_results: maxResults,
    });
    if (result && Array.isArray(result.resources)) {
      result.resources.forEach((r: any) => {
        if (
          r.secure_url &&
          (r.format === "png" ||
            r.format === "webp" ||
            r.secure_url.toLowerCase().endsWith(".png") ||
            r.secure_url.toLowerCase().endsWith(".webp"))
        ) {
          urls.push(r.secure_url);
        }
      });
    }
  } catch (err) {
    console.warn("Cloudinary list overlays failed:", err);
  }

  return urls;
}


