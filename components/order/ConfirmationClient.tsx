"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, MessageCircle, MapPin, CreditCard, Building2, CheckCircle } from "lucide-react";
import { useCheckoutStore } from "@/store/useCheckoutStore";
import { useCartStore } from "@/store/useCartStore";
import { formatCLP } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function ConfirmationClient() {
  const order = useCheckoutStore((s) => s.order);
  const clearOrder = useCheckoutStore((s) => s.clearOrder);
  const clearCart = useCartStore((s) => s.clearCart);
  const [animated, setAnimated] = useState(false);

  /* Clear cart on arrival, animate check */
  useEffect(() => {
    clearCart();
    const t = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(t);
  }, [clearCart]);

  /* Generate a fallback order number if none stored (e.g. direct URL access) */
  const [fallbackOrder] = useState(() => {
    const year = new Date().getFullYear();
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `BLM-${year}-${rand}`;
  });

  const orderNumber = order?.orderNumber ?? fallbackOrder;

  return (
    <div className="max-w-[860px] mx-auto px-4 md:px-8 py-14 md:py-20">
      {/* ── Hero: animated check + title ───────────────────────── */}
      <div className="flex flex-col items-center text-center mb-12">
        {/* Animated circle check */}
        <div
          className={cn(
            "w-20 h-20 rounded-full border-2 flex items-center justify-center mb-7 transition-all duration-700",
            animated
              ? "border-green-600 bg-green-50 scale-100 opacity-100"
              : "border-black/10 bg-transparent scale-75 opacity-0"
          )}
        >
          <CheckCircle
            size={40}
            className={cn(
              "transition-all duration-500 delay-300",
              animated ? "text-green-600 scale-100" : "text-black/10 scale-50"
            )}
          />
        </div>

        <p className="text-[10px] tracking-[0.3em] uppercase text-black/40 mb-3">
          ¡Gracias por tu compra!
        </p>
        <h1 className="font-display text-4xl md:text-5xl font-light mb-4">
          Pedido recibido
        </h1>
        <p className="text-black/50 text-sm leading-relaxed max-w-md">
          Te contactaremos pronto para confirmar tu pedido y coordinar la entrega.
        </p>

        {/* Order number badge */}
        <div className="mt-6 px-5 py-3 border border-black/15 inline-flex flex-col items-center gap-1">
          <span className="text-[9px] tracking-widest uppercase text-black/40">
            Número de pedido
          </span>
          <span className="font-display text-xl tracking-wider font-medium">
            {orderNumber}
          </span>
        </div>
      </div>

      {/* ── Order details ─────────────────────────────────────── */}
      {order ? (
        <div className="space-y-8">
          {/* Items */}
          <section className="border border-black/10 p-6">
            <p className="text-[10px] tracking-widest uppercase text-black/40 mb-5">
              Productos
            </p>
            <ul className="space-y-5 divide-y divide-black/8">
              {order.items.map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-4 pt-5 first:pt-0"
                >
                  <div className="relative w-14 h-16 flex-shrink-0 overflow-hidden bg-[#F7F5F0]">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm line-clamp-2">{item.name}</p>
                    <p className="text-[10px] text-black/40 mt-0.5">
                      T.{item.size} · {item.colorName} · ×{item.quantity}
                    </p>
                  </div>
                  <span className="text-sm font-medium flex-shrink-0">
                    {formatCLP(item.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>

            {/* Totals */}
            <div className="mt-5 pt-5 border-t border-black/10 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-black/50">Subtotal</span>
                <span>{formatCLP(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-black/50">Envío</span>
                {order.shippingCost === 0 ? (
                  <span className="text-green-700 font-medium">GRATIS</span>
                ) : (
                  <span>{formatCLP(order.shippingCost)}</span>
                )}
              </div>
              <div className="flex justify-between items-baseline pt-2 border-t border-black/10">
                <span className="text-[11px] tracking-widest uppercase text-black/40">
                  Total
                </span>
                <span className="font-display text-2xl font-medium">
                  {formatCLP(order.total)}
                </span>
              </div>
            </div>
          </section>

          {/* Delivery + Payment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Delivery */}
            <section className="border border-black/10 p-5 space-y-3">
              <p className="text-[10px] tracking-widest uppercase text-black/40 flex items-center gap-2">
                <MapPin size={11} /> Entrega
              </p>
              {order.deliveryType === "delivery" ? (
                <div className="text-sm text-black/70 space-y-1">
                  <p className="font-medium text-bloomsy-black">{order.name}</p>
                  <p>{order.address}{order.apartment ? `, ${order.apartment}` : ""}</p>
                  <p>{order.city}{order.region ? `, ${order.region}` : ""}</p>
                  {order.postalCode && <p>CP {order.postalCode}</p>}
                </div>
              ) : (
                <div className="text-sm text-black/70">
                  <p className="font-medium text-bloomsy-black">Retiro personal</p>
                  <p>
                    Te contactaremos al{" "}
                    <a
                      href="https://wa.me/56992723158"
                      className="text-bloomsy-black underline underline-offset-2"
                    >
                      WhatsApp
                    </a>{" "}
                    para coordinar
                  </p>
                </div>
              )}
            </section>

            {/* Payment */}
            <section className="border border-black/10 p-5 space-y-3">
              <p className="text-[10px] tracking-widest uppercase text-black/40 flex items-center gap-2">
                <CreditCard size={11} /> Pago
              </p>
              {order.paymentMethod === "webpay" ? (
                <div className="text-sm text-black/70">
                  <p className="font-medium text-bloomsy-black">Webpay</p>
                  <p>Débito / Crédito / Prepago · Transbank</p>
                </div>
              ) : (
                <div className="text-sm text-black/70 space-y-1">
                  <p className="font-medium text-bloomsy-black flex items-center gap-1">
                    <Building2 size={13} /> Transferencia bancaria
                  </p>
                  <p className="text-black/50 leading-relaxed">
                    Recuerda enviar tu comprobante a{" "}
                    <strong className="text-bloomsy-black">
                      info@bloomsy.cl
                    </strong>{" "}
                    con el número de pedido{" "}
                    <strong className="font-mono">{orderNumber}</strong>
                  </p>
                </div>
              )}
            </section>
          </div>

          {/* Transfer reminder banner */}
          {order.paymentMethod === "transfer" && (
            <div className="bg-amber-50 border border-amber-200 p-5 text-sm text-amber-800 leading-relaxed">
              <p className="font-medium mb-1">⚠️ Recuerda completar el pago</p>
              <p>
                Tu pedido quedará pendiente hasta que recibamos el comprobante de
                transferencia en{" "}
                <a
                  href="mailto:info@bloomsy.cl"
                  className="underline underline-offset-2"
                >
                  info@bloomsy.cl
                </a>{" "}
                con el asunto{" "}
                <strong className="font-mono">{orderNumber}</strong>.
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Fallback if page accessed directly without order data */
        <div className="text-center text-black/40 text-sm py-8">
          <p>Tu pedido fue procesado exitosamente.</p>
          <p className="mt-1">Recibirás un email de confirmación a la brevedad.</p>
        </div>
      )}

      {/* ── CTAs ─────────────────────────────────────────────── */}
      <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          href="/shop"
          className="bg-bloomsy-black text-bloomsy-cream text-[11px] tracking-widest uppercase px-10 py-3.5 hover:bg-bloomsy-gray transition-colors"
        >
          Seguir comprando
        </Link>

        <a
          href="https://wa.me/56992723158"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-[11px] tracking-widest uppercase border border-black/20 px-8 py-3.5 hover:border-bloomsy-black transition-colors"
        >
          <MessageCircle size={14} />
          ¿Preguntas? Escríbenos
        </a>
      </div>
    </div>
  );
}
