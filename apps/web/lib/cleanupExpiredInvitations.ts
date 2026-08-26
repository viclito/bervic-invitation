import { prisma } from "@/lib/prisma";
import { deleteCloudinaryImage } from "@/lib/cloudinary";

export async function deleteCloudinaryImages(urls: string[]) {
  for (const url of urls) {
    try {
      await deleteCloudinaryImage(url);
    } catch (err) {
      console.error(`Failed to destroy Cloudinary image ${url}:`, err);
    }
  }
}

export async function cleanupExpiredInvitations() {
  try {
    const now = new Date();
    // Only cleanup invitations if the owner user's subscription has expired
    const allInvitations = await prisma.userInvitation.findMany({
      include: { user: true },
    });

    for (const inv of allInvitations) {
      const userPlanExpiresAt = inv.user?.planExpiresAt;
      const isUserSubscribed = !!(userPlanExpiresAt && new Date(userPlanExpiresAt) > now);

      // If user has an active subscription, DO NOT DELETE! Assets remain live.
      if (isUserSubscribed) continue;

      // If subscription is expired (or no subscription), check if plan expired over 7 days ago
      if (userPlanExpiresAt && now.getTime() - new Date(userPlanExpiresAt).getTime() < 7 * 24 * 60 * 60 * 1000) {
        continue;
      }

      // Collect all Cloudinary image URLs for cleanup
      const imagesToDelete: string[] = [];

      if (inv.heroImage) imagesToDelete.push(inv.heroImage);
      if (inv.coupleImage) imagesToDelete.push(inv.coupleImage);

      if (inv.locationsJson) {
        try {
          const locs = JSON.parse(inv.locationsJson);
          for (const l of locs) {
            if (l.image) imagesToDelete.push(l.image);
          }
        } catch (e) {}
      }

      if (inv.galleryImagesJson) {
        try {
          const gallery = JSON.parse(inv.galleryImagesJson);
          for (const g of gallery) {
            if (typeof g === "string") imagesToDelete.push(g);
          }
        } catch (e) {}
      }

      // 1. Delete images from Cloudinary
      await deleteCloudinaryImages(imagesToDelete);

      // 2. Delete invitation record from PostgreSQL database
      await prisma.userInvitation.delete({
        where: { id: inv.id },
      });

      console.log(`Cleaned expired invitation ID: ${inv.id} (Slug: ${inv.slug}) post subscription expiry.`);
    }
  } catch (error) {
    console.error("Error during automatic invitation cleanup:", error);
  }
}
