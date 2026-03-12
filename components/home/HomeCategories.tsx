import Image from "next/image";
import Link from "next/link";
import { products } from "@/data/products";
import type { ProductCategory } from "@/types";

/* Fallback para categorías sin producto en data/products.ts */
const CATEGORY_FALLBACK: Partial<Record<ProductCategory, string>> = {
  faldas:
    "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600&q=80&fit=crop",
  pantalones:
    "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&q=80&fit=crop",
  chalecos:
    "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=600&q=80&fit=crop",
};

const CATEGORY_CARDS: {
  value: ProductCategory;
  label: string;
  href: string;
}[] = [
  { value: "poleras",    label: "Poleras",    href: "/categoria/poleras"    },
  { value: "abrigos",    label: "Abrigos",    href: "/categoria/abrigos"    },
  { value: "conjuntos",  label: "Conjuntos",  href: "/categoria/conjuntos"  },
  { value: "tops",       label: "Tops",       href: "/categoria/tops"       },
  { value: "faldas",     label: "Faldas",     href: "/categoria/faldas"     },
  { value: "pantalones", label: "Pantalones", href: "/categoria/pantalones" },
  { value: "bodys",      label: "Bodys",      href: "/categoria/bodys"      },
  { value: "chalecos",   label: "Chalecos",   href: "/categoria/chalecos"   },
];

export default function HomeCategories() {
  return (
    /*
     * pt-16 mobile: separa el título del botón "VER TODO" de HomeFeatured
     * pb-20 mobile: da aire antes del newsletter del footer
     */
    <section className="bg-[#F0EDE0] pt-16 pb-20 md:py-24">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">

        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="font-display text-[40px] md:text-[48px] font-light leading-tight">
            Explorar por categoría
          </h2>
        </div>

        {/* 2-col mobile / 4-col desktop */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {CATEGORY_CARDS.map(({ value, label, href }) => {
            /* Usa imagen del producto si existe, si no el fallback de Unsplash */
            const image =
              products.find((p) => p.category === value)?.images[0] ??
              CATEGORY_FALLBACK[value] ??
              null;

            return (
              <Link
                key={value}
                href={href}
                className="group relative block aspect-[3/4] overflow-hidden bg-bloomsy-black"
              >
                {image && (
                  <Image
                    src={image}
                    alt={label}
                    fill
                    className="object-cover opacity-75 transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                )}

                {/* Overlay — se oscurece en hover */}
                <div className="absolute inset-0 bg-black/25 group-hover:bg-black/45 transition-colors duration-400" />

                {/* Etiqueta de categoría */}
                <div className="absolute inset-0 flex items-end justify-center pb-6 px-3">
                  <span className="font-display text-[22px] text-white font-light tracking-wide text-center leading-tight">
                    {label}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}
