import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";
import type { ProductCategory } from "@/types";

interface RelatedProductsProps {
  category: ProductCategory;
  excludeId: string;
}

export default function RelatedProducts({ category, excludeId }: RelatedProductsProps) {
  const related = products
    .filter((p) => p.category === category && p.id !== excludeId)
    .slice(0, 4);

  if (related.length === 0) return null;

  return (
    <section className="max-w-[1400px] mx-auto px-4 md:px-8 py-14 border-t border-black/10">
      <p className="text-[10px] tracking-[0.3em] uppercase text-black/40 mb-6">
        También te puede gustar
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8">
        {related.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
