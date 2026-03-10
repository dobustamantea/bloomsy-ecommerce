"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, X } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import {
  formatCLP,
  FREE_SHIPPING_THRESHOLD,
  SHIPPING_COST,
} from "@/lib/utils";

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const hasFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shipping = hasFreeShipping ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;
  const missingForFreeShipping = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0);
  const freeShippingProgress = Math.min(
    (subtotal / FREE_SHIPPING_THRESHOLD) * 100,
    100
  );

  if (items.length === 0) {
    return (
      <section className="max-w-[1400px] mx-auto px-4 md:px-8 py-16 md:py-24">
        <div className="max-w-md mx-auto text-center">
          <div className="mx-auto w-16 h-16 rounded-full border border-black/15 flex items-center justify-center mb-5">
            <ShoppingBag size={28} className="text-black/60" />
          </div>
          <h1 className="font-display text-4xl font-light mb-3">
            Tu carrito está vacío
          </h1>
          <p className="text-sm text-black/60 mb-8">
            Aún no agregas productos. Descubre nuestras novedades.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center bg-bloomsy-black text-bloomsy-cream text-[11px] tracking-widest uppercase px-8 py-4 hover:bg-bloomsy-gray transition-colors"
          >
            Explorar tienda
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-[1400px] mx-auto px-4 md:px-8 py-10 md:py-12">
      <div className="mb-8">
        <p className="text-[10px] tracking-[0.3em] uppercase text-black/40 mb-2">
          Carrito
        </p>
        <h1 className="font-display text-4xl md:text-5xl font-light leading-none">
          Tu selección
        </h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="border-y border-black/10 divide-y divide-black/10">
          {items.map((item) => (
            <article
              key={`${item.product.id}-${item.size}-${item.color.name}`}
              className="py-5 flex gap-4"
            >
              <Link
                href={`/shop/${item.product.slug}`}
                className="relative w-20 h-20 shrink-0 overflow-hidden bg-white/60"
              >
                <Image
                  src={item.product.images[0]}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </Link>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Link
                      href={`/shop/${item.product.slug}`}
                      className="font-medium text-sm leading-tight hover:opacity-70 transition-opacity"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-xs text-black/55 mt-1">
                      Color: {item.color.name} · Talla: {item.size}
                    </p>
                    <p className="text-sm mt-2">{formatCLP(item.product.price)}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      removeItem(item.product.id, item.size, item.color.name)
                    }
                    className="text-xs text-black/55 hover:text-bloomsy-black transition-colors inline-flex items-center gap-1"
                    aria-label={`Eliminar ${item.product.name}`}
                  >
                    <X size={14} />
                    <span className="hidden sm:inline">Eliminar</span>
                  </button>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="inline-flex items-center border border-black/20">
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(
                          item.product.id,
                          item.size,
                          item.color.name,
                          Math.max(item.quantity - 1, 1)
                        )
                      }
                      className="w-8 h-8 text-sm hover:bg-black/5 transition-colors"
                      aria-label="Disminuir cantidad"
                    >
                      -
                    </button>
                    <span className="w-10 text-center text-sm">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(
                          item.product.id,
                          item.size,
                          item.color.name,
                          item.quantity + 1
                        )
                      }
                      className="w-8 h-8 text-sm hover:bg-black/5 transition-colors"
                      aria-label="Aumentar cantidad"
                    >
                      +
                    </button>
                  </div>

                  <p className="font-medium text-sm">
                    {formatCLP(item.product.price * item.quantity)}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <aside className="lg:sticky lg:top-24 h-fit border border-black/10 bg-white/50 p-5 md:p-6 space-y-5">
          <h2 className="font-display text-3xl font-light">Resumen de tu pedido</h2>

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-black/60">Subtotal</span>
              <span>{formatCLP(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-black/60">Envío</span>
              {hasFreeShipping ? (
                <span className="text-emerald-700 font-medium">GRATIS</span>
              ) : (
                <span>{formatCLP(SHIPPING_COST)}</span>
              )}
            </div>
          </div>

          <div>
            <div className="h-2 rounded-full bg-black/10 overflow-hidden">
              <div
                className="h-full bg-bloomsy-black transition-all duration-500"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
            <p className="text-xs mt-2">
              {hasFreeShipping
                ? "¡Tienes envío gratis! 🎉"
                : `Te faltan ${formatCLP(
                    missingForFreeShipping
                  )} para envío gratis`}
            </p>
          </div>

          <div className="pt-2 border-t border-black/10 flex items-end justify-between">
            <span className="text-sm uppercase tracking-wider">Total</span>
            <span className="font-display text-4xl leading-none">{formatCLP(total)}</span>
          </div>

          <Link
            href="/checkout"
            className="w-full inline-flex items-center justify-center bg-bloomsy-black text-bloomsy-cream text-[11px] tracking-widest uppercase py-4 hover:bg-bloomsy-gray transition-colors"
          >
            Finalizar compra
          </Link>

          <Link
            href="/shop"
            className="inline-flex text-[11px] tracking-wider uppercase text-black/65 hover:text-bloomsy-black transition-colors"
          >
            ← Seguir comprando
          </Link>
        </aside>
      </div>
    </section>
  );
}
