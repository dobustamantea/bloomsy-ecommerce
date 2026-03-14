"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useCartStore } from "@/store/useCartStore";
import { formatCLP } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const toggle = useWishlistStore((s) => s.toggle);
  const isWishlisted = useWishlistStore((s) => s.isWishlisted(product.id));
  const addItem = useCartStore((s) => s.addItem);

  const discount =
    product.originalPrice != null && product.originalPrice > 0
      ? Math.round((1 - product.price / product.originalPrice) * 100)
      : null;

  const defaultColor = product.colors[0];
  const defaultSize = product.sizes[0];

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    addItem(product, defaultSize, defaultColor);
  }

  function handleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    toggle(product.id);
  }

  // Determine if a color swatch needs a border (light colors)
  function needsBorder(hex: string) {
    const lightColors = ["#FFFFFF", "#F5F5DC", "#EFECDA", "#F0EAD6", "#FAF0E6", "#FFFAF0", "#FFF8DC", "#FAEBD7"];
    return lightColors.some((c) => c.toLowerCase() === hex.toLowerCase());
  }

  return (
    <Link href={`/shop/${product.slug}`} className="group relative block">
      {/* Image container */}
      <div className="relative overflow-hidden bg-[#F7F5F0] aspect-[3/4]">
        {/* Main image */}
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover transition-opacity duration-500 group-hover:opacity-0"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        {/* Hover image */}
        {product.images[1] && (
          <Image
            src={product.images[1]}
            alt={`${product.name} — vista alternativa`}
            fill
            className="object-cover transition-opacity duration-500 opacity-0 group-hover:opacity-100"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        )}

        {/* Badges */}
        {product.isNew && (
          <span className="absolute top-2 left-2 bg-bloomsy-black text-bloomsy-cream text-[9px] tracking-widest uppercase px-2 py-1">
            Nuevo
          </span>
        )}
        {discount !== null && (
          <span className="absolute top-2 right-8 bg-bloomsy-black text-bloomsy-cream text-[9px] tracking-widest uppercase px-2 py-1">
            -{discount}%
          </span>
        )}

        {/* Wishlist */}
        <button
          onClick={handleWishlist}
          aria-label={isWishlisted ? "Quitar de favoritos" : "Agregar a favoritos"}
          className="absolute top-2 right-2 p-1 text-bloomsy-black/60 hover:text-bloomsy-black transition-colors"
        >
          <Heart
            size={16}
            className={cn(isWishlisted && "fill-bloomsy-black text-bloomsy-black")}
          />
        </button>

        {/* Slide-up "Agregar" button */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={handleAddToCart}
            className="w-full bg-bloomsy-black text-bloomsy-cream text-[10px] tracking-widest uppercase py-3 hover:bg-bloomsy-gray transition-colors"
          >
            Agregar
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="pt-3 space-y-1.5">
        {/* Color swatches */}
        {product.colors.length > 0 && (
          <div className="flex items-center gap-1">
            {product.colors.slice(0, 5).map((color) => (
              <span
                key={color.name}
                title={color.name}
                className={cn(
                  "block w-3 h-3 rounded-full",
                  needsBorder(color.hex) && "ring-1 ring-black/20"
                )}
                style={{ backgroundColor: color.hex }}
              />
            ))}
            {product.colors.length > 5 && (
              <span className="text-[10px] text-black/40">+{product.colors.length - 5}</span>
            )}
          </div>
        )}

        <p className="text-[13px] leading-snug text-bloomsy-black">{product.name}</p>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-medium">{formatCLP(product.price)}</span>
          {product.originalPrice != null && product.originalPrice > 0 && (
            <span className="text-xs text-black/40 line-through">
              {formatCLP(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
