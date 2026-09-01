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
    // Only cleanup invitations if the owner user's subscription has expired AND the wedding was long ago
    const allInvitations = await prisma.userInvitation.findMany({
      include: { user: true },
    });

    for (const inv of allInvitations) {
      // NEVER delete invitations created within the last 60 days
      if (inv.createdAt) {
        const createdAgeMs = now.getTime() - new Date(inv.createdAt).getTime();
        if (createdAgeMs < 60 * 24 * 60 * 60 * 1000) {
          continue;
        }
      }

      // If wedding date is in the future, NEVER delete!
      if (inv.weddingDate) {
        const eventDate = new Date(inv.weddingDate);
        if (!isNaN(eventDate.getTime()) && eventDate > now) {
          continue;
        }
        // If the event was less than 30 days ago, keep active for guests to see photos & video
        if (!isNaN(eventDate.getTime()) && now.getTime() - eventDate.getTime() < 30 * 24 * 60 * 60 * 1000) {
          continue;
        }
      }

      const userPlanExpiresAt = inv.user?.planExpiresAt;
      const isUserSubscribed = !!(userPlanExpiresAt && new Date(userPlanExpiresAt) > now);

      // If user has an active subscription, DO NOT DELETE! Assets remain live.
      if (isUserSubscribed) continue;

      // If user has no planExpiresAt set (e.g. admin or lifetime or standard user), DO NOT DELETE
      if (!userPlanExpiresAt) continue;

      // Only delete if subscription expired over 30 days ago
      if (now.getTime() - new Date(userPlanExpiresAt).getTime() < 30 * 24 * 60 * 60 * 1000) {
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

      console.log(`Cleaned expired invitation ID: ${inv.id} (Slug: ${inv.slug}) post subscription & event expiry.`);
    }
  } catch (error) {
    console.error("Error during automatic invitation cleanup:", error);
  }
}
