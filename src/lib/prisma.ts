import { PrismaClient } from "@prisma/client";

const DATABASE_URL = process.env.DATABASE_URL || "not set";
if (process.env.NODE_ENV !== "production") {
  console.log("[prisma] DATABASE_URL:", DATABASE_URL);
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
