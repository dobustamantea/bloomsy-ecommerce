/**
 * lib/prisma.ts — Prisma 7 singleton using @prisma/adapter-pg.
 *
 * Prisma 7 removed the native library engine; a driver adapter is now
 * required for direct (non-Accelerate) PostgreSQL connections.
 *
 * The DATABASE_URL guard ensures Next.js builds without a DB env var don't
 * crash at import time — all queries fall back to static data via the
 * try/catch wrappers in lib/products.ts.
 */

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

type GlobalWithPrisma = typeof globalThis & { prisma?: PrismaClient };

function createClient(): PrismaClient {
  // Fall back to a dummy URL so PrismaClient can be instantiated even when
  // DATABASE_URL is absent (e.g., Vercel preview builds). Actual queries will
  // throw and be caught by lib/products.ts, returning the static fallback data.
  const connectionString =
    process.env.DATABASE_URL ?? "postgresql://localhost:5432/dummy";

  // Pass a PoolConfig directly to avoid the @types/pg version conflict between
  // the project's pg package and the one bundled inside @prisma/adapter-pg.
  const adapter = new PrismaPg({ connectionString });

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

const globalForPrisma = globalThis as GlobalWithPrisma;

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
