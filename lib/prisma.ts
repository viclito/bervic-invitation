import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const getDbUrl = () => {
  let url = process.env.DATABASE_URL || "";

  // On local development, bypass Windows local IPv6 DNS timeouts by mapping Neon host to IPv4 + options=endpoint
  if (process.env.NODE_ENV !== "production" && url && url.includes(".neon.tech")) {
    const endpointMatch = url.match(/@(ep-[a-z0-9-]+?)(?:-pooler)?\./i);
    if (endpointMatch && endpointMatch[1]) {
      const endpointId = endpointMatch[1];
      url = url
        .replace(/&channel_binding=require/gi, "")
        .replace(/\?channel_binding=require/gi, "?")
        .replace(/@ep-[a-z0-9-]+?(?:-pooler)?\.c-4\.us-east-2\.aws\.neon\.tech/gi, "@16.59.10.57");

      const optionParam = `options=endpoint%3D${endpointId}`;
      if (!url.includes("options=")) {
        url += (url.includes("?") ? "&" : "?") + optionParam;
      }
    }
  }

  if (url && !url.includes("pool_timeout")) {
    url += (url.includes("?") ? "&" : "?") + `connection_limit=25&pool_timeout=60&connect_timeout=30`;
  }
  return url;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasourceUrl: getDbUrl(),
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
