"use client";

import { useState } from "react";
import { Heart, ShoppingBag, Check } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { formatCLP } from "@/lib/utils";
import { cn } from "@/lib/utils";
import SizeGuideModal from "./SizeGuideModal";
import type { Product } from "@/types";

interface ProductOptionsProps {
  product: Product;
}

function needsBorder(hex: string) {
  const lightColors = ["#ffffff", "#f5f5dc", "#efecda", "#f0ead6", "#faf0e6", "#fffaf0", "#fff8dc", "#faebd7", "#f5f0eb"];
  return lightColors.some((c) => c.toLowerCase() === hex.toLowerCase());
}

export default function ProductOptions({ product }: ProductOptionsProps) {
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const toggle = useWishlistStore((s) => s.toggle);
  const isWishlisted = useWishlistStore((s) => s.isWishlisted(product.id));

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  function handleAddToCart() {
    if (!selectedSize) return;
    addItem(product, selectedSize, selectedColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="space-y-6">
      {/* Price */}
      <div className="flex items-baseline gap-3">
        <span className="font-display text-3xl font-light">{formatCLP(product.price)}</span>
        {product.originalPrice && (
          <>
            <span className="text-black/40 line-through text-base">
              {formatCLP(product.originalPrice)}
            </span>
            <span className="bg-bloomsy-black text-bloomsy-cream text-[9px] tracking-widest uppercase px-2 py-0.5">
              -{discount}%
            </span>
          </>
        )}
      </div>

      {/* Color selector */}
      <div>
        <p className="text-[10px] tracking-widest uppercase text-black/40 mb-3">
          Color:{" "}
          <span className="text-bloomsy-black normal-case tracking-normal">
            {selectedColor.name}
          </span>
        </p>
        <div className="flex items-center gap-2.5">
          {product.colors.map((color) => (
            <button
              key={color.name}
              onClick={() => setSelectedColor(color)}
              title={color.name}
              aria-label={color.name}
              className={cn(
                "w-7 h-7 rounded-full transition-transform hover:scale-110",
                selectedColor.name === color.name && "ring-2 ring-offset-1 ring-bloomsy-black",
                needsBorder(color.hex) && "ring-1 ring-black/20"
              )}
              style={{ backgroundColor: color.hex }}
            />
          ))}
        </div>
      </div>

      {/* Size selector */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] tracking-widest uppercase text-black/40">Talla</p>
          <SizeGuideModal />
        </div>
        <div className="flex flex-wrap gap-2">
          {product.sizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={cn(
                "text-[11px] px-3 py-1.5 border transition-colors",
                selectedSize === size
                  ? "bg-bloomsy-black text-bloomsy-cream border-bloomsy-black"
                  : "border-black/20 text-black/60 hover:border-bloomsy-black hover:text-bloomsy-black"
              )}
            >
              {size}
            </button>
          ))}
        </div>
        {!selectedSize && (
          <p className="text-[10px] text-black/40 mt-2">Selecciona una talla</p>
        )}
      </div>

      {/* Add to cart + wishlist */}
      <div className="flex gap-3">
        <button
          onClick={handleAddToCart}
          disabled={!selectedSize}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 text-[11px] tracking-widest uppercase py-4 transition-colors",
            selectedSize
              ? added
                ? "bg-green-800 text-white"
                : "bg-bloomsy-black text-bloomsy-cream hover:bg-bloomsy-gray"
              : "bg-black/10 text-black/30 cursor-not-allowed"
          )}
        >
          {added ? (
            <>
              <Check size={14} /> Agregado
            </>
          ) : (
            <>
              <ShoppingBag size={14} /> Agregar al carrito
            </>
          )}
        </button>

        <button
          onClick={() => toggle(product.id)}
          aria-label={isWishlisted ? "Quitar de favoritos" : "Agregar a favoritos"}
          className="border border-black/20 px-4 hover:border-bloomsy-black transition-colors"
        >
          <Heart
            size={16}
            className={cn(isWishlisted && "fill-bloomsy-black text-bloomsy-black")}
          />
        </button>
      </div>

      {/* Shipping */}
      <p className="text-xs text-black/50 leading-relaxed">
        Envío $3.990 a todo Chile vía Starken · Gratis sobre $50.000 · 3–5 días hábiles
      </p>
    </div>
  );
}
