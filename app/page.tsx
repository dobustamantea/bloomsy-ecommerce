import type { Metadata } from "next";
import HomeHero from "@/components/home/HomeHero";
import HomeValues from "@/components/home/HomeValues";
import HomeFeatured from "@/components/home/HomeFeatured";
import HomeCategories from "@/components/home/HomeCategories";
import { getFeaturedProducts } from "@/lib/products";

// Revalidate home every hour
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Bloomsy — High Modern Style",
  description:
    "Ropa femenina chilena para mujeres reales. Tallas S a 4XL. Envío a todo Chile.",
  openGraph: {
    title: "Bloomsy — High Modern Style",
    description: "Ropa femenina chilena para mujeres reales. Tallas S a 4XL.",
    images: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&q=80&fit=crop",
    ],
  },
};

export default async function HomePage() {
  const featured = await getFeaturedProducts();

  return (
    <>
      <HomeHero />
      <HomeValues />
      <HomeFeatured products={featured} />
      <HomeCategories />
      {/* Newsletter band lives in the global Footer (layout.tsx) */}
    </>
  );
}
