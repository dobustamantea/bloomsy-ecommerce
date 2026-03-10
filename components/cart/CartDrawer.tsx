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

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shipping =
    subtotal >= FREE_SHIPPING_THRESHOLD || items.length === 0 ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;

  return (
    <div
      className={`fixed inset-0 z-[70] transition ${
        open ? "pointer-events-auto" : "pointer-events-none"
      }`}
      aria-hidden={!open}
    >
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      <aside
        className={`absolute right-0 top-0 h-full w-full max-w-md bg-bloomsy-cream shadow-2xl border-l border-black/10 transition-transform duration-300 flex flex-col ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Carrito"
      >
        <div className="h-16 px-5 border-b border-black/10 flex items-center justify-between">
          <p className="font-display text-2xl font-light">Carrito</p>
          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:opacity-60 transition-opacity"
            aria-label="Cerrar carrito"
          >
            <X size={20} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 px-6 py-8 flex flex-col items-center justify-center text-center">
            <div className="w-14 h-14 rounded-full border border-black/15 flex items-center justify-center mb-4">
              <ShoppingBag size={24} className="text-black/60" />
            </div>
            <p className="font-display text-3xl font-light mb-2">Tu carrito esta vacio</p>
            <p className="text-sm text-black/60 mb-6">
              Agrega tus favoritos y vuelve aqui para finalizar.
            </p>
            <Link
              href="/shop"
              onClick={onClose}
              className="inline-flex items-center justify-center bg-bloomsy-black text-bloomsy-cream text-[11px] tracking-widest uppercase px-7 py-3 hover:bg-bloomsy-gray transition-colors"
            >
              Explorar tienda
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {items.map((item) => (
                <article
                  key={`${item.product.id}-${item.size}-${item.color.name}`}
                  className="border-b border-black/10 pb-4"
                >
                  <div className="flex gap-3">
                    <Link
                      href={`/shop/${item.product.slug}`}
                      onClick={onClose}
                      className="relative w-16 h-16 shrink-0 bg-white/80"
                    >
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </Link>

                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between gap-2">
                        <Link
                          href={`/shop/${item.product.slug}`}
                          onClick={onClose}
                          className="text-sm leading-tight hover:opacity-70 transition-opacity"
                        >
                          {item.product.name}
                        </Link>
                        <button
                          type="button"
                          onClick={() =>
                            removeItem(item.product.id, item.size, item.color.name)
                          }
                          className="text-black/55 hover:text-bloomsy-black transition-colors"
                          aria-label={`Eliminar ${item.product.name}`}
                        >
                          <X size={14} />
                        </button>
                      </div>

                      <p className="text-xs text-black/55 mt-1">
                        Talla: {item.size} · Color: {item.color.name}
                      </p>
                      <p className="text-sm mt-1">{formatCLP(item.product.price)}</p>

                      <div className="mt-2 flex items-center justify-between">
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
                            className="w-7 h-7 text-sm hover:bg-black/5 transition-colors"
                            aria-label="Disminuir cantidad"
                          >
                            -
                          </button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
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
                            className="w-7 h-7 text-sm hover:bg-black/5 transition-colors"
                            aria-label="Aumentar cantidad"
                          >
                            +
                          </button>
                        </div>

                        <p className="text-sm font-medium">
                          {formatCLP(item.product.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="border-t border-black/10 p-5 space-y-4 bg-white/50">
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-black/60">Subtotal</span>
                  <span>{formatCLP(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-black/60">Envio</span>
                  <span>{shipping === 0 ? "GRATIS" : formatCLP(shipping)}</span>
                </div>
                <div className="flex items-center justify-between border-t border-black/10 pt-2">
                  <span className="uppercase tracking-wider">Total</span>
                  <span className="font-display text-3xl leading-none">
                    {formatCLP(total)}
                  </span>
                </div>
              </div>

              <Link
                href="/checkout"
                onClick={onClose}
                className="w-full inline-flex items-center justify-center bg-bloomsy-black text-bloomsy-cream text-[11px] tracking-widest uppercase py-4 hover:bg-bloomsy-gray transition-colors"
              >
                Ir al checkout
              </Link>

              <Link
                href="/cart"
                onClick={onClose}
                className="inline-flex text-[11px] tracking-wider uppercase text-black/65 hover:text-bloomsy-black transition-colors"
              >
                Ver carrito completo
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
