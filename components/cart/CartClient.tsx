"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, X, Minus, Plus, Truck, CheckCircle2 } from "lucide-react";
import { useCartStore, selectTotal } from "@/store/useCartStore";
import { formatCLP, SHIPPING_COST, FREE_SHIPPING_THRESHOLD } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { CartItem } from "@/types";

/** Stock disponible para un ítem del carrito. Infinity = sin datos (fallback). */
function getItemStock(item: CartItem): number {
  if (item.product.variants.length === 0) return Infinity;
  const v = item.product.variants.find(
    (v) => v.color === item.color.name && v.size === item.size
  );
  return v?.stock ?? 0;
}

export default function CartClient() {
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore(selectTotal);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);

  const shippingFree = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shippingCost = shippingFree ? 0 : SHIPPING_COST;
  const total = subtotal + shippingCost;

  const progressPct = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
  const amountRemaining = FREE_SHIPPING_THRESHOLD - subtotal;

  /* ─── EMPTY STATE ─────────────────────────────────────────────── */
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-28 px-4 text-center">
        <ShoppingBag
          size={52}
          strokeWidth={1}
          className="text-black/20 mb-6"
        />
        <h2 className="font-display text-3xl font-light mb-3">
          Tu carrito está vacío
        </h2>
        <p className="text-sm text-black/50 mb-8 max-w-xs">
          Agrega productos desde nuestra tienda y aparecerán aquí.
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

  /* ─── ITEMS + SUMMARY ─────────────────────────────────────────── */
  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-10">
      {/* Heading */}
      <div className="mb-8">
        <p className="text-[10px] tracking-[0.3em] uppercase text-black/40 mb-2">
          Mi bolsa
        </p>
        <h1 className="font-display text-4xl md:text-5xl font-light">
          Carrito de compras
        </h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-start">
        {/* ── LEFT: item list ────────────────────────────────────── */}
        <div className="flex-1 min-w-0 space-y-0 divide-y divide-black/8 border-y border-black/10">
          {items.map((item) => {
            const linePrice = item.product.price * item.quantity;
            const itemStock = getItemStock(item);
            const atMax = item.quantity >= itemStock;
            return (
              <div
                key={`${item.product.id}-${item.size}-${item.color.name}`}
                className="flex gap-4 py-5"
              >
                {/* Thumbnail */}
                <Link
                  href={`/shop/${item.product.slug}`}
                  className="flex-shrink-0"
                >
                  <div className="relative w-20 h-24 overflow-hidden bg-[#F7F5F0]">
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      href={`/shop/${item.product.slug}`}
                      className="text-sm leading-snug hover:opacity-60 transition-opacity line-clamp-2"
                    >
                      {item.product.name}
                    </Link>
                    <button
                      onClick={() =>
                        removeItem(
                          item.product.id,
                          item.size,
                          item.color.name
                        )
                      }
                      aria-label="Eliminar producto"
                      className="flex-shrink-0 text-black/30 hover:text-black transition-colors p-0.5 -mt-0.5"
                    >
                      <X size={14} />
                    </button>
                  </div>

                  {/* Color + size chips */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="flex items-center gap-1 text-[11px] text-black/50">
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-black/10 flex-shrink-0"
                        style={{ backgroundColor: item.color.hex }}
                      />
                      {item.color.name}
                    </span>
                    <span className="text-black/20 text-[10px]">·</span>
                    <span className="text-[11px] text-black/50">
                      Talla {item.size}
                    </span>
                  </div>

                  {/* Price + qty */}
                  <div className="flex items-center justify-between mt-auto pt-1">
                    <span className="text-sm font-medium">
                      {formatCLP(linePrice)}
                    </span>

                    {/* Quantity control */}
                    <div className="flex items-center gap-0">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.product.id,
                            item.size,
                            item.color.name,
                            item.quantity - 1
                          )
                        }
                        disabled={item.quantity <= 1}
                        aria-label="Disminuir cantidad"
                        className={cn(
                          "w-7 h-7 border border-black/20 flex items-center justify-center transition-colors",
                          item.quantity <= 1
                            ? "text-black/20 cursor-not-allowed"
                            : "hover:border-bloomsy-black hover:text-bloomsy-black"
                        )}
                      >
                        <Minus size={11} />
                      </button>
                      <span className="w-8 h-7 border-t border-b border-black/20 flex items-center justify-center text-sm">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          !atMax &&
                          updateQuantity(
                            item.product.id,
                            item.size,
                            item.color.name,
                            item.quantity + 1
                          )
                        }
                        disabled={atMax}
                        aria-label="Aumentar cantidad"
                        className={cn(
                          "w-7 h-7 border border-black/20 flex items-center justify-center transition-colors",
                          atMax
                            ? "text-black/20 cursor-not-allowed"
                            : "hover:border-bloomsy-black hover:text-bloomsy-black"
                        )}
                      >
                        <Plus size={11} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── RIGHT: order summary ───────────────────────────────── */}
        <div className="w-full lg:w-80 lg:sticky lg:top-24 flex-shrink-0">
          <div className="border border-black/10 p-6 space-y-5">
            <p className="text-[10px] tracking-[0.25em] uppercase text-black/40">
              Resumen de tu pedido
            </p>

            {/* Free shipping progress */}
            <div className="space-y-2.5">
              <div className="flex items-start gap-2">
                {shippingFree ? (
                  <CheckCircle2 size={14} className="text-green-700 mt-0.5 flex-shrink-0" />
                ) : (
                  <Truck size={14} className="text-black/30 mt-0.5 flex-shrink-0" />
                )}
                <p
                  className={cn(
                    "text-xs leading-snug",
                    shippingFree ? "text-green-700 font-medium" : "text-black/50"
                  )}
                >
                  {shippingFree
                    ? "¡Tienes envío gratis! 🎉"
                    : `Te faltan ${formatCLP(amountRemaining)} para envío gratis`}
                </p>
              </div>

              {/* Progress bar */}
              <div className="h-1 bg-black/10 rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    shippingFree ? "bg-green-600" : "bg-bloomsy-black"
                  )}
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>

            {/* Line items */}
            <div className="space-y-3 pt-1 border-t border-black/10">
              <div className="flex justify-between text-sm">
                <span className="text-black/60">Subtotal</span>
                <span>{formatCLP(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-black/60">Envío</span>
                {shippingFree ? (
                  <span className="text-green-700 font-medium">GRATIS</span>
                ) : (
                  <span>{formatCLP(SHIPPING_COST)}</span>
                )}
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between items-baseline border-t border-black/10 pt-4">
              <span className="text-[11px] tracking-widest uppercase text-black/40">
                Total
              </span>
              <span className="font-display text-2xl font-medium">
                {formatCLP(total)}
              </span>
            </div>

            {/* CTA */}
            <Link
              href="/checkout"
              className="block w-full bg-bloomsy-black text-bloomsy-cream text-[11px] tracking-widest uppercase text-center py-4 hover:bg-bloomsy-gray transition-colors"
            >
              Finalizar compra
            </Link>

            <Link
              href="/shop"
              className="block text-center text-[11px] text-black/40 hover:text-bloomsy-black transition-colors tracking-wide"
            >
              ← Seguir comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
