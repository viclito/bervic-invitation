import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export async function getAuthUser(req?: Request) {
  // 1. Check for Mobile Bearer Authorization Header
  if (req) {
    const authHeader =
      req.headers.get("authorization") || req.headers.get("Authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const rawToken = authHeader.replace("Bearer ", "").trim();
      try {
        const decoded = JSON.parse(
          Buffer.from(rawToken, "base64url").toString("utf-8")
        );
        if (decoded.userId) {
          const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
          });
          if (user) return user;
        } else if (decoded.email) {
          const user = await prisma.user.findUnique({
            where: { email: decoded.email.toLowerCase().trim() },
          });
          if (user) return user;
        }
      } catch {}
    }
  }

  // 2. Check for NextAuth Cookie Session (Web browser)
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email.toLowerCase().trim() },
      });
      if (user) return user;
    }
  } catch {}

  return null;
}
