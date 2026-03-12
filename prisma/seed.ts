import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { products } from "../data/products";

// Prisma 7 requires a driver adapter; pass PoolConfig directly to avoid
// the @types/pg version conflict with the pg package in node_modules.
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding Bloomsy database...");

  // Clear in reverse dependency order
  await prisma.orderItem.deleteMany();
  await prisma.review.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();

  console.log("🗑️  Cleared existing data");

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

      // Variants — size × color cross product, stock=10
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
    console.log(`  ✓ ${p.name}`);
  }

  console.log(`\n✅ Seeded ${seeded} products successfully!`);
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
