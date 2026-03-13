"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Minus, Plus, ShoppingBag, CheckCircle2, Truck } from "lucide-react";
import { useCartStore, selectTotal } from "@/store/useCartStore";
import { formatCLP, SHIPPING_COST, FREE_SHIPPING_THRESHOLD } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore(selectTotal);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);

  const shippingFree = subtotal >= FREE_SHIPPING_THRESHOLD;
  const progressPct = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
  const amountRemaining = FREE_SHIPPING_THRESHOLD - subtotal;
  const total = subtotal + (shippingFree ? 0 : SHIPPING_COST);

  /* Lock body scroll when drawer is open */
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  /* Close on Escape key */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/40 z-[70] transition-opacity duration-300",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-label="Carrito de compras"
        aria-modal="true"
        className={cn(
          "fixed top-0 right-0 bottom-0 w-full max-w-[400px] bg-bloomsy-cream z-[80] flex flex-col shadow-2xl transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-black/10 flex-shrink-0">
          <p className="text-[11px] tracking-widest uppercase">
            Mi bolsa
            {items.length > 0 && (
              <span className="ml-2 text-black/40">({items.length})</span>
            )}
          </p>
          <button
            onClick={onClose}
            aria-label="Cerrar carrito"
            className="text-black/40 hover:text-bloomsy-black transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {items.length === 0 ? (
          /* ── Empty state ──────────────────────────────────── */
          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-4">
            <ShoppingBag size={44} strokeWidth={1} className="text-black/15" />
            <p className="text-sm text-black/50">Tu carrito está vacío</p>
            <Link
              href="/shop"
              onClick={onClose}
              className="text-[11px] tracking-widest uppercase border border-bloomsy-black px-8 py-2.5 hover:bg-bloomsy-black hover:text-bloomsy-cream transition-colors"
            >
              Explorar tienda
            </Link>
          </div>
        ) : (
          <>
            {/* ── Items list ────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-0 divide-y divide-black/8">
              {/* Free shipping bar */}
              <div className="pb-4 space-y-2">
                <div className="flex items-center gap-1.5">
                  {shippingFree ? (
                    <CheckCircle2 size={12} className="text-green-700 flex-shrink-0" />
                  ) : (
                    <Truck size={12} className="text-black/30 flex-shrink-0" />
                  )}
                  <p
                    className={cn(
                      "text-[11px] leading-snug",
                      shippingFree ? "text-green-700 font-medium" : "text-black/50"
                    )}
                  >
                    {shippingFree
                      ? "¡Tienes envío gratis! 🎉"
                      : `Te faltan ${formatCLP(amountRemaining)} para envío gratis`}
                  </p>
                </div>
                <div className="h-0.5 bg-black/10 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      shippingFree ? "bg-green-600" : "bg-bloomsy-black"
                    )}
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>

              {items.map((item) => (
                <div
                  key={`${item.product.id}-${item.size}-${item.color.name}`}
                  className="flex gap-3 py-4"
                >
                  <Link href={`/shop/${item.product.slug}`} onClick={onClose} className="flex-shrink-0">
                    <div className="relative w-16 h-20 overflow-hidden bg-[#F7F5F0]">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                  </Link>

                  <div className="flex-1 min-w-0 flex flex-col gap-1">
                    <div className="flex items-start justify-between gap-1">
                      <Link
                        href={`/shop/${item.product.slug}`}
                        onClick={onClose}
                        className="text-xs leading-snug hover:opacity-60 transition-opacity line-clamp-2"
                      >
                        {item.product.name}
                      </Link>
                      <button
                        onClick={() =>
                          removeItem(item.product.id, item.size, item.color.name)
                        }
                        aria-label="Eliminar"
                        className="text-black/25 hover:text-black transition-colors p-0.5 -mt-0.5 flex-shrink-0"
                      >
                        <X size={12} />
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-black/10 flex-shrink-0"
                        style={{ backgroundColor: item.color.hex }}
                      />
                      <span className="text-[10px] text-black/40">
                        {item.color.name} · T.{item.size}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-xs font-medium">
                        {formatCLP(item.product.price * item.quantity)}
                      </span>
                      {/* Qty */}
                      <div className="flex items-center">
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
                          aria-label="Disminuir"
                          className={cn(
                            "w-6 h-6 border border-black/20 flex items-center justify-center",
                            item.quantity <= 1
                              ? "text-black/15 cursor-not-allowed"
                              : "hover:border-bloomsy-black"
                          )}
                        >
                          <Minus size={9} />
                        </button>
                        <span className="w-7 h-6 border-t border-b border-black/20 flex items-center justify-center text-xs">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.size,
                              item.color.name,
                              item.quantity + 1
                            )
                          }
                          aria-label="Aumentar"
                          className="w-6 h-6 border border-black/20 flex items-center justify-center hover:border-bloomsy-black"
                        >
                          <Plus size={9} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Footer ────────────────────────────────────── */}
            <div className="flex-shrink-0 border-t border-black/10 px-5 py-5 space-y-3">
              {/* Total row */}
              <div className="flex justify-between items-baseline">
                <span className="text-[11px] tracking-widest uppercase text-black/40">
                  Total
                </span>
                <span className="font-display text-xl font-medium">
                  {formatCLP(total)}
                </span>
              </div>

              <Link
                href="/checkout"
                onClick={onClose}
                className="block w-full bg-bloomsy-black text-bloomsy-cream text-[11px] tracking-widest uppercase text-center py-3.5 hover:bg-bloomsy-gray transition-colors"
              >
                Ir al checkout
              </Link>

              <Link
                href="/cart"
                onClick={onClose}
                className="block w-full border border-black/20 text-[11px] tracking-widest uppercase text-center py-3 hover:border-bloomsy-black transition-colors"
              >
                Ver carrito completo
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
}
