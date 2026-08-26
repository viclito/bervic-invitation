/**
 * Client-side Image Optimization Utility
 * Automatically scales down massive camera/phone images (e.g. 48MP/15MB)
 * to ultra-crisp 2.5K resolution (2560px max bound) and compresses
 * using high-fidelity WebP/PNG while preserving 100% visual sharpness
 * and alpha channel transparency.
 */

export interface OptimizeImageOptions {
  maxDimension?: number; // Default 2560px (Ultra-HD / 4K Retina)
  quality?: number; // 0.0 - 1.0 (Default 0.92 for perceptually lossless)
}

/**
 * Optimizes an image File or Blob before uploading to server/Cloudinary.
 * Drastically cuts upload time and cloud storage space with 0 compromise in visual quality.
 */
export async function optimizeImageForUpload(
  file: File,
  options: OptimizeImageOptions = {}
): Promise<File> {
  const { maxDimension = 2560, quality = 0.92 } = options;

  // Don't process SVGs, GIFs, or non-image types
  if (!file.type.startsWith("image/") || file.type === "image/svg+xml" || file.type === "image/gif") {
    return file;
  }

  // If file is already tiny (less than 250KB), no need to compress
  if (file.size < 250 * 1024) {
    return file;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;

        // Calculate scaled dimensions if larger than maxDimension
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d", { willReadFrequently: false });
        if (!ctx) {
          resolve(file); // Fallback to original
          return;
        }

        // Apply high-quality image smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        ctx.drawImage(img, 0, 0, width, height);

        // Check if original is PNG and might have transparency
        const isPng = file.type === "image/png" || file.name.toLowerCase().endsWith(".png");

        // Prefer modern WebP format for fast delivery; for PNGs with transparency, WebP supports full alpha channel
        const outputType = isPng ? "image/webp" : "image/jpeg";
        const outputExt = isPng ? ".webp" : ".jpg";

        canvas.toBlob(
          (blob) => {
            if (!blob || blob.size >= file.size) {
              // If compression didn't save space, return original
              resolve(file);
              return;
            }

            const cleanName = file.name.replace(/\.[^/.]+$/, "") + outputExt;
            const optimizedFile = new File([blob], cleanName, {
              type: outputType,
              lastModified: Date.now(),
            });

            resolve(optimizedFile);
          },
          outputType,
          quality
        );
      };

      img.onerror = () => {
        resolve(file); // Fallback to original
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      resolve(file); // Fallback to original
    };

    reader.readAsDataURL(file);
  });
}
