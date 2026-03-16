import type { Metadata } from "next";
import ShopClient from "@/components/shop/ShopClient";
import { getProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Tienda",
  description:
    "Explora todo el catálogo de Bloomsy. Ropa femenina chilena en tallas S a 4XL.",
};

// Revalidate catalog every hour so new products appear without a redeploy
export const revalidate = 3600;

interface ShopPageProps {
  searchParams: { sort?: string; categoria?: string };
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  // Fetch all active products from DB (falls back to data/products.ts on error)
  const products = await getProducts();

  return (
    <ShopClient
      key={searchParams.categoria ?? "all"}
      products={products}
      initialCategory={searchParams.categoria}
    />
  );
}
