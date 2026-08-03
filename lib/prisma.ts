import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const getDbUrl = () => {
  let url = process.env.DATABASE_URL || "";
  if (url && !url.includes("connection_limit")) {
    const pgbouncerParam = url.includes("pooler") && !url.includes("pgbouncer") ? "&pgbouncer=true" : "";
    url += (url.includes("?") ? "&" : "?") + `connection_limit=10&pool_timeout=15&connect_timeout=15${pgbouncerParam}`;
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
