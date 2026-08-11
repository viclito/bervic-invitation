import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const getDbUrl = () => {
  let url = process.env.DATABASE_URL || "";
  if (url && !url.includes("pool_timeout")) {
    const pgbouncerParam = url.includes("pooler") && !url.includes("pgbouncer") ? "&pgbouncer=true" : "";
    url += (url.includes("?") ? "&" : "?") + `connection_limit=25&pool_timeout=60&connect_timeout=30${pgbouncerParam}`;
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
