import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";

const featured = products.filter((p) => p.isFeatured).slice(0, 4);

export default function HomeFeatured() {
  return (
    <section className="bg-bloomsy-cream py-14 md:py-24">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-10 md:mb-12">
          <p className="text-[10px] tracking-[0.35em] uppercase text-black/35 mb-3">
            Colección
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-light">
            Nueva temporada
          </h2>
        </div>

        {/* 4-column product grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8 mb-12">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/shop"
            className="inline-block border border-bloomsy-black text-bloomsy-black text-[11px] tracking-widest uppercase px-10 py-3.5 hover:bg-bloomsy-black hover:text-bloomsy-cream transition-colors"
          >
            Ver todo el catálogo
          </Link>
        </div>
      </div>
    </section>
  );
}
