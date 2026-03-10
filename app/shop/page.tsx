import type { Metadata } from "next";
import ShopClient from "@/components/shop/ShopClient";

export const metadata: Metadata = {
  title: "Tienda",
  description:
    "Explora todo el catálogo de Bloomsy. Ropa femenina chilena en tallas S a 4XL.",
};

interface ShopPageProps {
  searchParams: { sort?: string; categoria?: string };
}

export default function ShopPage({ searchParams }: ShopPageProps) {
  return <ShopClient initialCategory={searchParams.categoria} />;
}
