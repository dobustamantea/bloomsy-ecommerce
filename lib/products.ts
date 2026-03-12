/**
 * lib/products.ts — Data layer para productos usando Prisma + Supabase.
 *
 * Todas las funciones devuelven el tipo `Product` de @/types para que
 * los componentes existentes funcionen sin cambios.
 *
 * Fallback: si la BD no está disponible (ej. proyecto pausado), se usan
 * los datos hardcodeados de data/products.ts para que el sitio no rompa.
 */

import type { Product, ProductCategory, SortOption } from "@/types";
import { prisma } from "./prisma";
import type { Prisma } from "@prisma/client";

/* ── Helpers ─────────────────────────────────────────────────────── */

type PrismaProduct = Awaited<ReturnType<typeof fetchOne>>;

/** Convierte un registro Prisma al tipo Product de la app */
function mapProduct(p: NonNullable<PrismaProduct>): Product {
  // Deduplicate colors from variants
  const colorMap = new Map<string, { name: string; hex: string }>();
  for (const v of p.variants) {
    if (!colorMap.has(v.color)) colorMap.set(v.color, { name: v.color, hex: v.colorHex });
  }

  // Deduplicate sizes from variants (preserve natural order)
  const sizeSet = new Set<string>();
  for (const v of p.variants) sizeSet.add(v.size);

  return {
    id:           p.id,
    slug:         p.slug,
    name:         p.name,
    category:     p.category as ProductCategory,
    price:        p.price,
    originalPrice: p.originalPrice ?? undefined,
    colors:       Array.from(colorMap.values()),
    sizes:        Array.from(sizeSet),
    images:       p.images.sort((a, b) => a.position - b.position).map((i) => i.url),
    description:  p.description,
    care:         p.care,
    isNew:        p.isNew,
    isFeatured:   p.isFeatured,
    reviews:      p.reviews.map((r) => ({
      author:  r.author,
      rating:  r.rating,
      comment: r.comment,
      date:    r.createdAt.toISOString().slice(0, 10),
    })),
  };
}

async function fetchOne(slug: string) {
  return prisma.product.findUnique({
    where:   { slug, isActive: true },
    include: { images: true, variants: true, reviews: { orderBy: { createdAt: "desc" } } },
  });
}

/* ── Public API ──────────────────────────────────────────────────── */

export interface ProductFilters {
  category?: string;
  sizes?:    string[];
  colors?:   string[];
  minPrice?: number;
  maxPrice?: number;
  sort?:     SortOption;
}

/** Lista de productos con filtros opcionales */
export async function getProducts(filters: ProductFilters = {}): Promise<Product[]> {
  try {
    const { category, sizes, colors, minPrice, maxPrice, sort } = filters;

    const where: Prisma.ProductWhereInput = {
      isActive: true,
      ...(category && { category }),
      ...(minPrice !== undefined || maxPrice !== undefined
        ? { price: { gte: minPrice, lte: maxPrice } }
        : {}),
      ...(sizes?.length
        ? { variants: { some: { size: { in: sizes } } } }
        : {}),
      ...(colors?.length
        ? { variants: { some: { color: { in: colors } } } }
        : {}),
    };

    const orderBy: Prisma.ProductOrderByWithRelationInput =
      sort === "price-asc"
        ? { price: "asc" }
        : sort === "price-desc"
        ? { price: "desc" }
        : { createdAt: "desc" }; // newest / best-seller fallback

    const rows = await prisma.product.findMany({
      where,
      orderBy,
      include: { images: true, variants: true, reviews: true },
    });

    return rows.map(mapProduct);
  } catch (err) {
    console.error("[getProducts] DB error, falling back to static data:", err);
    const { products } = await import("@/data/products");
    return products;
  }
}

/** Producto por slug */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const row = await fetchOne(slug);
    return row ? mapProduct(row) : null;
  } catch (err) {
    console.error("[getProductBySlug] DB error, falling back to static data:", err);
    const { products } = await import("@/data/products");
    return products.find((p) => p.slug === slug) ?? null;
  }
}

/** Primeros 4 productos destacados para el home */
export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const rows = await prisma.product.findMany({
      where:   { isFeatured: true, isActive: true },
      take:    4,
      orderBy: { createdAt: "desc" },
      include: { images: true, variants: true, reviews: true },
    });
    return rows.map(mapProduct);
  } catch (err) {
    console.error("[getFeaturedProducts] DB error, falling back to static data:", err);
    const { products } = await import("@/data/products");
    return products.filter((p) => p.isFeatured).slice(0, 4);
  }
}

/** Slugs de todos los productos activos — para generateStaticParams */
export async function getAllProductSlugs(): Promise<string[]> {
  try {
    const rows = await prisma.product.findMany({
      where:  { isActive: true },
      select: { slug: true },
    });
    return rows.map((r) => r.slug);
  } catch (err) {
    console.error("[getAllProductSlugs] DB error, falling back to static data:", err);
    const { products } = await import("@/data/products");
    return products.map((p) => p.slug);
  }
}
