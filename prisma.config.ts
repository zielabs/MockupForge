// Prisma 7 config — connection URL for Supabase PostgreSQL
// Use DIRECT_URL (port 5432) for Prisma CLI operations (migrate, push, seed)
// The pooled URL (port 6543 via PgBouncer) is used at runtime by PrismaClient
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DIRECT_URL"] || process.env["DATABASE_URL"],
  },
});
