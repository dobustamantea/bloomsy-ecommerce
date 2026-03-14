import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

type GlobalWithPrisma = typeof globalThis & { prisma?: PrismaClient };

function createClient(): PrismaClient {
  const connectionString =
    process.env.DATABASE_URL ?? "postgresql://localhost:5432/dummy";

  // max: 1 es el valor recomendado para entornos serverless (Vercel).
  // Cada invocacion de funcion comparte una sola conexion y no agota
  // el pool de Supabase PgBouncer (Session mode limit).
  // IMPORTANTE: en Supabase usar la URL de Transaction mode (puerto 6543)
  // en vez de la de Session mode (puerto 5432) para mayor concurrencia.
  const adapter = new PrismaPg({ connectionString, max: 1 });

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