import type { Metadata } from "next";
import HomeHero from "@/components/home/HomeHero";
import HomeValues from "@/components/home/HomeValues";
import HomeFeatured from "@/components/home/HomeFeatured";
import HomeCategories from "@/components/home/HomeCategories";

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

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <HomeValues />
      <HomeFeatured />
      <HomeCategories />
      {/* Newsletter band lives in the global Footer (layout.tsx) */}
    </>
  );
}
