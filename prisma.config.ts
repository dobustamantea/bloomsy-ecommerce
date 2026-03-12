import { config } from "dotenv";
// Next.js uses .env.local — load it explicitly for Prisma CLI
config({ path: ".env.local" });
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Runtime queries: Transaction mode pooler (port 6543, with PgBouncer)
    // Migrations use DIRECT_URL (see prisma migrate command overrides)
    url: process.env["DATABASE_URL"]!,
  },
});
