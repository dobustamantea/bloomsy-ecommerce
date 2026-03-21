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

/** Stock disponible para una combinación color+talla.
 *  Si no hay datos de variantes (fallback estático), asume stock disponible. */
function getStock(product: Product, colorName: string, size: string): number {
  if (product.variants.length === 0) return 1;
  const v = product.variants.find((v) => v.color === colorName && v.size === size);
  return v?.stock ?? 0;
}

export default function ProductOptions({ product }: ProductOptionsProps) {
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const cartItems = useCartStore((s) => s.items);
  const toggle = useWishlistStore((s) => s.toggle);
  const isWishlisted = useWishlistStore((s) => s.isWishlisted(product.id));

  const discount = product.originalPrice != null && product.originalPrice > 0
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  // Stock de la variante actualmente seleccionada
  const selectedStock = selectedSize
    ? getStock(product, selectedColor.name, selectedSize)
    : null;

  // Cantidad ya en el carrito para esta variante
  const cartQuantity = selectedSize
    ? (cartItems.find(
        (item) =>
          item.product.id === product.id &&
          item.size === selectedSize &&
          item.color.name === selectedColor.name
      )?.quantity ?? 0)
    : 0;

  const canAddToCart =
    selectedSize !== null &&
    (selectedStock ?? 0) > 0 &&
    cartQuantity < (selectedStock ?? 0);

  function handleColorChange(color: typeof selectedColor) {
    setSelectedColor(color);
    // Si la talla seleccionada no tiene stock para el nuevo color, la limpiamos
    if (selectedSize && getStock(product, color.name, selectedSize) === 0) {
      setSelectedSize(null);
    }
  }

  function handleAddToCart() {
    if (!canAddToCart) return;
    addItem(product, selectedSize!, selectedColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="space-y-6">
      {/* Price */}
      <div className="flex items-baseline gap-3">
        <span className="font-display text-3xl font-light">{formatCLP(product.price)}</span>
        {product.originalPrice != null && product.originalPrice > 0 && (
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
              onClick={() => handleColorChange(color)}
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
          {product.sizes.map((size) => {
            const stock = getStock(product, selectedColor.name, size);
            const isOutOfStock = stock === 0;
            const isSelected = selectedSize === size;
            return (
              <button
                key={size}
                onClick={() => !isOutOfStock && setSelectedSize(size)}
                disabled={isOutOfStock}
                aria-label={isOutOfStock ? `${size} — agotado` : size}
                className={cn(
                  "text-[11px] px-3 py-1.5 border transition-colors relative",
                  isSelected
                    ? "bg-bloomsy-black text-bloomsy-cream border-bloomsy-black"
                    : isOutOfStock
                    ? "border-black/10 text-black/25 cursor-not-allowed line-through"
                    : "border-black/20 text-black/60 hover:border-bloomsy-black hover:text-bloomsy-black"
                )}
              >
                {size}
              </button>
            );
          })}
        </div>
        {!selectedSize && (
          <p className="text-[10px] text-black/40 mt-2">Selecciona una talla</p>
        )}
        {selectedSize && selectedStock === 0 && (
          <p className="text-[10px] text-red-500 mt-2">Esta variante está agotada</p>
        )}
      </div>

      {/* Add to cart + wishlist */}
      <div className="flex gap-3">
        <button
          onClick={handleAddToCart}
          disabled={!canAddToCart}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 text-[11px] tracking-widest uppercase py-4 transition-colors",
            canAddToCart
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
