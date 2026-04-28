import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

// Use direct connection (port 5432) for seed, not PgBouncer (port 6543)
const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL || "";
const pool = new pg.Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const templates = [
  { name: "Basic T-Shirt Front", slug: "basic-tshirt-front", category: "TSHIRT" as const, thumbnailUrl: "/templates/tshirt-front.png", templateFileUrl: "/templates/tshirt-front.glb", designArea: { x: 150, y: 120, w: 200, h: 250 }, isPremium: false, sortOrder: 1 },
  { name: "Basic T-Shirt Back", slug: "basic-tshirt-back", category: "TSHIRT" as const, thumbnailUrl: "/templates/tshirt-back.png", templateFileUrl: "/templates/tshirt-back.glb", designArea: { x: 150, y: 120, w: 200, h: 250 }, isPremium: false, sortOrder: 2 },
  { name: "Premium T-Shirt Mockup", slug: "premium-tshirt", category: "TSHIRT" as const, thumbnailUrl: "/templates/tshirt-premium.png", templateFileUrl: "/templates/tshirt-premium.glb", designArea: { x: 140, y: 110, w: 220, h: 270 }, isPremium: true, sortOrder: 3 },
  { name: "Hoodie Front", slug: "hoodie-front", category: "HOODIE" as const, thumbnailUrl: "/templates/hoodie-front.png", templateFileUrl: "/templates/hoodie-front.glb", designArea: { x: 140, y: 150, w: 220, h: 240 }, isPremium: true, sortOrder: 4 },
  { name: "Baseball Cap", slug: "baseball-cap", category: "HAT" as const, thumbnailUrl: "/templates/cap-baseball.png", templateFileUrl: "/templates/cap-baseball.glb", designArea: { x: 100, y: 60, w: 180, h: 120 }, isPremium: false, sortOrder: 5 },
  { name: "Coffee Mug", slug: "coffee-mug", category: "MUG" as const, thumbnailUrl: "/templates/mug-coffee.png", templateFileUrl: "/templates/mug-coffee.glb", designArea: { x: 80, y: 100, w: 240, h: 180 }, isPremium: false, sortOrder: 6 },
  { name: "Travel Tumbler", slug: "travel-tumbler", category: "TUMBLER" as const, thumbnailUrl: "/templates/tumbler.png", templateFileUrl: "/templates/tumbler.glb", designArea: { x: 90, y: 80, w: 220, h: 300 }, isPremium: true, sortOrder: 9 },
  { name: "Canvas Tote Bag", slug: "canvas-totebag", category: "TOTEBAG" as const, thumbnailUrl: "/templates/totebag.png", templateFileUrl: "/templates/totebag.glb", designArea: { x: 100, y: 80, w: 200, h: 240 }, isPremium: false, sortOrder: 10 },
  { name: "White Mug Premium", slug: "white-mug-premium", category: "MUG" as const, thumbnailUrl: "/templates/mug-white.png", templateFileUrl: "/templates/mug-white.glb", designArea: { x: 80, y: 100, w: 240, h: 180 }, isPremium: true, sortOrder: 14 },
  { name: "Oversized T-Shirt", slug: "oversized-tshirt", category: "TSHIRT" as const, thumbnailUrl: "/templates/tshirt-oversized.png", templateFileUrl: "/templates/tshirt-oversized.glb", designArea: { x: 130, y: 100, w: 240, h: 300 }, isPremium: true, sortOrder: 15 },
];

async function main() {
  console.log("Seeding Supabase database...");

  for (const t of templates) {
    await prisma.mockupTemplate.upsert({
      where: { slug: t.slug },
      update: { ...t, designArea: t.designArea },
      create: { ...t, designArea: t.designArea },
    });
    console.log(`  + ${t.name}`);
  }

  console.log(`\nSeeded ${templates.length} templates!`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
