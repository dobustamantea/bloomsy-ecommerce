import Image from "next/image";
import Link from "next/link";
import { products } from "@/data/products";
import type { ProductCategory } from "@/types";

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
    <section className="bg-[#F0EDE0] py-18 md:py-24">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-10 md:mb-12">
          <h2 className="font-display text-[40px] md:text-[48px] font-light leading-tight">
            Explorar por categoría
          </h2>
        </div>

        {/* 4-col grid on desktop, 2-col on mobile */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {CATEGORY_CARDS.map(({ value, label, href }) => {
            const image =
              products.find((p) => p.category === value)?.images[0] ?? null;

            return (
              <Link
                key={value}
                href={href}
                className="group relative block aspect-[3/4] overflow-hidden bg-bloomsy-black"
              >
                {/* Product image */}
                {image && (
                  <Image
                    src={image}
                    alt={label}
                    fill
                    className="object-cover opacity-75 transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                )}

                {/* Dark overlay — deepens on hover */}
                <div className="absolute inset-0 bg-black/25 group-hover:bg-black/45 transition-colors duration-400" />

                {/* Category label */}
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
