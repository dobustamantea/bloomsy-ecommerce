import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import * as dotenv from "dotenv";
import { products } from "../data/products";

dotenv.config({ path: ".env.local" });

const connectionString = process.env.DATABASE_URL!;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const pool = new Pool({ connectionString });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const adapter = new PrismaPg(pool as any); // dual @types/pg version workaround
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Ã°Å¸Å’Â± Seeding Bloomsy database...");

  // Clear in reverse dependency order
  await prisma.orderItem.deleteMany();
  await prisma.review.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();

  console.log("Ã°Å¸â€”â€˜Ã¯Â¸Â  Cleared existing data");

  let seeded = 0;

  for (const p of products) {
    await prisma.$transaction([
      // Product
      prisma.product.create({
        data: {
          id:            p.id,
          slug:          p.slug,
          name:          p.name,
          category:      p.category,
          price:         p.price,
          originalPrice: p.originalPrice ?? null,
          description:   p.description,
          care:          p.care,
          isNew:         p.isNew,
          isFeatured:    p.isFeatured,
          isActive:      true,
        },
      }),

      // Images
      ...p.images.map((url, position) =>
        prisma.productImage.create({
          data: { productId: p.id, url, position },
        })
      ),

      // Variants Ã¢â‚¬â€ size Ãƒâ€” color cross product, stock=10
      ...p.sizes.flatMap((size) =>
        p.colors.map((color) =>
          prisma.productVariant.create({
            data: {
              productId: p.id,
              size,
              color:    color.name,
              colorHex: color.hex,
              stock:    10,
            },
          })
        )
      ),

      // Reviews
      ...(p.reviews ?? []).map((r) =>
        prisma.review.create({
          data: {
            productId: p.id,
            author:    r.author,
            rating:    r.rating,
            comment:   r.comment,
            createdAt: new Date(r.date),
          },
        })
      ),
    ]);

    seeded++;
    console.log(`  Ã¢Å“â€œ ${p.name}`);
  }

  console.log(`\nÃ¢Å“â€¦ Seeded ${seeded} products successfully!`);
}

main()
  .catch((e) => {
    console.error("Ã¢ÂÅ’ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
