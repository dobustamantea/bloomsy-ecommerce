import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { products } from "@/data/products";
import ProductGallery from "@/components/shop/ProductGallery";
import ProductOptions from "@/components/shop/ProductOptions";
import ProductAccordions from "@/components/shop/ProductAccordions";
import ReviewSection from "@/components/shop/ReviewSection";
import RelatedProducts from "@/components/shop/RelatedProducts";

interface ProductPageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = products.find((p) => p.slug === params.slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description.slice(0, 155),
    openGraph: {
      images: [product.images[0]],
    },
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = products.find((p) => p.slug === params.slug);
  if (!product) notFound();

  return (
    <>
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-10">
        {/* Breadcrumb */}
        <nav className="text-[10px] tracking-widest uppercase text-black/40 mb-8 flex items-center gap-2">
          <a href="/" className="hover:text-black transition-colors">Inicio</a>
          <span>/</span>
          <a href="/shop" className="hover:text-black transition-colors">Tienda</a>
          <span>/</span>
          <span className="text-bloomsy-black">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14">
          {/* Gallery */}
          <ProductGallery images={product.images} name={product.name} />

          {/* Info panel */}
          <div className="space-y-6">
            {/* Category + Name */}
            <div>
              <p className="text-[10px] tracking-widest uppercase text-black/40 mb-2 capitalize">
                {product.category}
              </p>
              <h1 className="font-display text-3xl md:text-4xl font-light leading-snug">
                {product.name}
              </h1>

              {/* Star summary */}
              {product.reviews.length > 0 && (
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => {
                      const avg =
                        product.reviews.reduce((s, r) => s + r.rating, 0) /
                        product.reviews.length;
                      return (
                        <svg
                          key={i}
                          width="11"
                          height="11"
                          viewBox="0 0 24 24"
                          fill={i < Math.round(avg) ? "currentColor" : "none"}
                          stroke="currentColor"
                          strokeWidth="2"
                          className="text-bloomsy-black"
                        >
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      );
                    })}
                  </div>
                  <span className="text-xs text-black/40">
                    ({product.reviews.length})
                  </span>
                </div>
              )}
            </div>

            {/* Options (color, size, cart, wishlist) */}
            <ProductOptions product={product} />

            {/* Accordions */}
            <ProductAccordions description={product.description} care={product.care} />
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-12 border-t border-black/10">
        <p className="text-[10px] tracking-[0.3em] uppercase text-black/40 mb-8">Reseñas</p>
        <div className="max-w-xl">
          <ReviewSection reviews={product.reviews} />
        </div>
      </div>

      {/* Related */}
      <RelatedProducts category={product.category} excludeId={product.id} />
    </>
  );
}
