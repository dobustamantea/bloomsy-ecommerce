import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as dotenv from "dotenv";
import { products } from "../data/products";

dotenv.config({ path: ".env.local" });

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding Bloomsy database...");

  await prisma.orderItem.deleteMany();
  await prisma.review.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();

  console.log("Cleared existing data");

  let seeded = 0;

  for (const product of products) {
    await prisma.$transaction([
      prisma.product.create({
        data: {
          id: product.id,
          slug: product.slug,
          name: product.name,
          category: product.category,
          price: product.price,
          originalPrice: product.originalPrice ?? null,
          description: product.description,
          care: product.care,
          isNew: product.isNew,
          isFeatured: product.isFeatured,
          isActive: true,
        },
      }),
      ...product.images.map((url, position) =>
        prisma.productImage.create({
          data: { productId: product.id, url, position },
        })
      ),
      ...product.sizes.flatMap((size) =>
        product.colors.map((color) =>
          prisma.productVariant.create({
            data: {
              productId: product.id,
              size,
              color: color.name,
              colorHex: color.hex,
              stock: 10,
            },
          })
        )
      ),
      ...(product.reviews ?? []).map((review) =>
        prisma.review.create({
          data: {
            productId: product.id,
            author: review.author,
            rating: review.rating,
            comment: review.comment,
            createdAt: new Date(review.date),
          },
        })
      ),
    ]);

    seeded++;
    console.log(`  OK ${product.name}`);
  }

  console.log(`Seeded ${seeded} products successfully.`);
}

main()
  .catch((error) => {
    console.error("Seed error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
