"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Check, ShoppingBag } from "lucide-react";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useCartStore } from "@/store/useCartStore";
import { products } from "@/data/products";
import { formatCLP } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

/* ──────────────────────────────────────────────────────────────────
   WishlistCard — individual card with filled heart, fade-out on remove,
   size-picker popover for "Agregar al carrito"
   ────────────────────────────────────────────────────────────────── */
function WishlistCard({ product }: { product: Product }) {
  const toggle = useWishlistStore((s) => s.toggle);
  const addItem = useCartStore((s) => s.addItem);

  const [removing, setRemoving] = useState(false);
  const [showSizes, setShowSizes] = useState(false);
  const [added, setAdded] = useState(false);

  const sizeRef = useRef<HTMLDivElement>(null);

  /* Close size picker on click outside */
  useEffect(() => {
    if (!showSizes) return;
    function onClickOutside(e: MouseEvent) {
      if (sizeRef.current && !sizeRef.current.contains(e.target as Node)) {
        setShowSizes(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [showSizes]);

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  function needsBorder(hex: string) {
    const light = ["#ffffff", "#f5f5dc", "#efecda", "#f0ead6", "#faf0e6"];
    return light.some((c) => c === hex.toLowerCase());
  }

  /* Remove with fade-out animation */
  function handleRemove(e: React.MouseEvent) {
    e.preventDefault();
    setRemoving(true);
    setTimeout(() => toggle(product.id), 320);
  }

  /* Add to cart logic */
  function handleAddButton(e: React.MouseEvent) {
    e.preventDefault();
    if (product.sizes.length === 1) {
      addItem(product, product.sizes[0], product.colors[0]);
      showAddedFeedback();
    } else {
      setShowSizes((prev) => !prev);
    }
  }

  function handleSelectSize(e: React.MouseEvent, size: string) {
    e.preventDefault();
    addItem(product, size, product.colors[0]);
    setShowSizes(false);
    showAddedFeedback();
  }

  function showAddedFeedback() {
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div
      className={cn(
        "transition-all duration-300 ease-out",
        removing ? "opacity-0 scale-95 pointer-events-none" : "opacity-100"
      )}
    >
      <Link href={`/shop/${product.slug}`} className="group relative block">
        {/* ── Image container ──────────────────────────────────── */}
        <div className="relative overflow-hidden bg-[#F7F5F0] aspect-[3/4]">
          {/* Main image */}
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-opacity duration-500 group-hover:opacity-0"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {/* Hover image */}
          {product.images[1] && (
            <Image
              src={product.images[1]}
              alt={`${product.name} — vista alternativa`}
              fill
              className="object-cover transition-opacity duration-500 opacity-0 group-hover:opacity-100"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
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

          {/* Filled heart — removes from wishlist */}
          <button
            onClick={handleRemove}
            aria-label="Quitar de favoritos"
            className="absolute top-2 right-2 p-1 text-bloomsy-black hover:text-black/50 transition-colors"
          >
            <Heart size={16} className="fill-bloomsy-black text-bloomsy-black" />
          </button>

          {/* ── Slide-up bottom panel ──────────────────────────── */}
          <div
            ref={sizeRef}
            className={cn(
              "absolute bottom-0 left-0 right-0 transition-transform duration-300",
              showSizes || added
                ? "translate-y-0"
                : "translate-y-full group-hover:translate-y-0"
            )}
          >
            {/* Feedback: added */}
            {added ? (
              <div className="w-full bg-bloomsy-gray text-bloomsy-cream text-[10px] tracking-widest uppercase py-3 flex items-center justify-center gap-1.5">
                <Check size={12} strokeWidth={2.5} />
                Agregado
              </div>
            ) : showSizes ? (
              /* Size picker grid */
              <div className="bg-bloomsy-cream border-t border-black/10 p-3">
                <p className="text-[9px] tracking-widest uppercase text-black/40 text-center mb-2">
                  Elige tu talla
                </p>
                <div className="flex flex-wrap gap-1.5 justify-center">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={(e) => handleSelectSize(e, size)}
                      className="text-[10px] border border-black/25 px-2.5 py-1 hover:bg-bloomsy-black hover:text-bloomsy-cream hover:border-bloomsy-black transition-colors"
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Default: add to cart button */
              <button
                onClick={handleAddButton}
                className="w-full bg-bloomsy-black text-bloomsy-cream text-[10px] tracking-widest uppercase py-3 hover:bg-bloomsy-gray transition-colors flex items-center justify-center gap-1.5"
              >
                <ShoppingBag size={11} />
                Agregar al carrito
              </button>
            )}
          </div>
        </div>

        {/* ── Product info ─────────────────────────────────────── */}
        <div className="pt-3 space-y-1.5">
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
                <span className="text-[10px] text-black/40">
                  +{product.colors.length - 5}
                </span>
              )}
            </div>
          )}

          <p className="text-[13px] leading-snug text-bloomsy-black">
            {product.name}
          </p>

          <div className="flex items-baseline gap-2">
            <span className="text-sm font-medium">{formatCLP(product.price)}</span>
            {product.originalPrice && (
              <span className="text-xs text-black/40 line-through">
                {formatCLP(product.originalPrice)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
   WishlistClient — main page component
   ────────────────────────────────────────────────────────────────── */
export default function WishlistClient() {
  const ids = useWishlistStore((s) => s.ids);

  /* Resolve full Product objects from the global products list */
  const wishlistedProducts = products.filter((p) => ids.includes(p.id));

  /* ── Empty state ───────────────────────────────────────────── */
  if (ids.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[65vh] text-center px-4">
        <Heart
          size={64}
          strokeWidth={1}
          className="text-black/15 mb-6"
        />
        <h1 className="font-display text-3xl md:text-[40px] font-light mb-3">
          Tu lista de deseos está vacía
        </h1>
        <p className="text-sm text-black/50 mb-8 max-w-xs leading-relaxed">
          Guarda tus piezas favoritas tocando el&nbsp;♡ en cualquier producto
        </p>
        <Link
          href="/shop"
          className="bg-bloomsy-black text-bloomsy-cream text-[11px] tracking-widest uppercase px-10 py-3.5 hover:bg-bloomsy-gray transition-colors"
        >
          Explorar tienda
        </Link>
      </div>
    );
  }

  /* ── Items ─────────────────────────────────────────────────── */
  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="text-[10px] tracking-widest uppercase text-black/40 mb-7 flex items-center gap-2">
        <Link href="/" className="hover:text-black transition-colors">
          Inicio
        </Link>
        <span>/</span>
        <span className="text-bloomsy-black">Lista de deseos</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-4xl md:text-5xl font-light mb-2">
          Lista de deseos
        </h1>
        <p className="text-sm text-black/45">
          {wishlistedProducts.length}{" "}
          {wishlistedProducts.length === 1 ? "pieza guardada" : "piezas guardadas"}
        </p>
      </div>

      {/* Grid: 3 desktop / 2 tablet / 1 mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-10 mb-12">
        {wishlistedProducts.map((product) => (
          <WishlistCard key={product.id} product={product} />
        ))}
      </div>

      {/* Footer link */}
      <div className="border-t border-black/8 pt-6">
        <Link
          href="/shop"
          className="text-[11px] text-black/40 hover:text-bloomsy-black transition-colors tracking-wide"
        >
          ← Seguir explorando
        </Link>
      </div>
    </div>
  );
}
