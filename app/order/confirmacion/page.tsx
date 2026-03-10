"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo } from "react";
import { Check, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useCartStore } from "@/store/useCartStore";
import { formatCLP } from "@/lib/utils";
import { useCheckoutStore } from "@/store/useCheckoutStore";

export default function OrderConfirmationPage() {
  const clearCart = useCartStore((state) => state.clearCart);
  const lastOrder = useCheckoutStore((state) => state.lastOrder);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  const fallbackOrderNumber = useMemo(
    () => `BLM-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    []
  );

  const orderNumber = lastOrder?.orderNumber || fallbackOrderNumber;

  return (
    <section className="max-w-[1400px] mx-auto px-4 md:px-8 py-12 md:py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-20 h-20 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-5"
          >
            <Check size={42} />
          </motion.div>

          <h1 className="font-display text-5xl md:text-6xl font-light leading-none">
            ¡Pedido recibido!
          </h1>
          <p className="text-black/65 mt-4">
            Gracias por tu compra. Te contactaremos pronto para confirmar.
          </p>
          <p className="text-sm tracking-widest uppercase mt-4">
            Numero de pedido: <span className="font-medium">{orderNumber}</span>
          </p>
        </div>

        <div className="border border-black/10 bg-white/40 p-5 md:p-6 space-y-6">
          <h2 className="font-display text-3xl font-light">Resumen del pedido</h2>

          {lastOrder ? (
            <>
              <div className="space-y-3">
                {lastOrder.items.map((item) => (
                  <article
                    key={`${item.product.id}-${item.size}-${item.color.name}`}
                    className="flex gap-3"
                  >
                    <div className="relative w-16 h-16 shrink-0 bg-white/80">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm">{item.product.name}</p>
                      <p className="text-xs text-black/60 mt-1">
                        Talla: {item.size} · Color: {item.color.name}
                      </p>
                      <p className="text-xs text-black/60">Cantidad: {item.quantity}</p>
                    </div>
                    <p className="text-sm whitespace-nowrap">
                      {formatCLP(item.product.price * item.quantity)}
                    </p>
                  </article>
                ))}
              </div>

              <div className="border-t border-black/10 pt-4 text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-black/60">Subtotal</span>
                  <span>{formatCLP(lastOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black/60">Envio</span>
                  <span>
                    {lastOrder.shipping === 0
                      ? "GRATIS"
                      : formatCLP(lastOrder.shipping)}
                  </span>
                </div>
                <div className="flex justify-between border-t border-black/10 pt-2">
                  <span className="uppercase tracking-wider">Total</span>
                  <span className="font-display text-3xl leading-none">
                    {formatCLP(lastOrder.total)}
                  </span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5 text-sm">
                <div className="border border-black/10 p-4 space-y-1">
                  <p className="text-[11px] tracking-wider uppercase text-black/60">
                    Metodo de pago
                  </p>
                  <p>
                    {lastOrder.paymentMethod === "webpay"
                      ? "Webpay (Debito / Credito / Prepago)"
                      : "Transferencia bancaria"}
                  </p>
                  {lastOrder.paymentMethod === "transfer" && (
                    <p className="text-black/70 pt-2">
                      Recuerda enviar el comprobante a info@bloomsy.cl.
                    </p>
                  )}
                </div>

                <div className="border border-black/10 p-4 space-y-1">
                  <p className="text-[11px] tracking-wider uppercase text-black/60">
                    Datos de entrega
                  </p>
                  <p>{lastOrder.customer.fullName}</p>
                  <p>{lastOrder.customer.email}</p>
                  <p>{lastOrder.customer.phone}</p>

                  {lastOrder.deliveryMethod === "delivery" &&
                  lastOrder.deliveryAddress ? (
                    <div className="pt-2 text-black/75">
                      <p>{lastOrder.deliveryAddress.addressLine1}</p>
                      {lastOrder.deliveryAddress.apartment && (
                        <p>{lastOrder.deliveryAddress.apartment}</p>
                      )}
                      <p>
                        {lastOrder.deliveryAddress.city},{" "}
                        {lastOrder.deliveryAddress.region}
                      </p>
                      {lastOrder.deliveryAddress.postalCode && (
                        <p>CP: {lastOrder.deliveryAddress.postalCode}</p>
                      )}
                    </div>
                  ) : (
                    <p className="pt-2 text-black/75">
                      Retiro personal (coordinacion por WhatsApp).
                    </p>
                  )}
                </div>
              </div>
            </>
          ) : (
            <p className="text-sm text-black/70">
              No encontramos detalles del pedido en esta sesion, pero tu carrito ya
              fue limpiado.
            </p>
          )}
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-center">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center bg-bloomsy-black text-bloomsy-cream text-[11px] tracking-widest uppercase px-8 py-4 hover:bg-bloomsy-gray transition-colors"
          >
            Seguir comprando
          </Link>

          <a
            href="https://wa.me/56992723158"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 border border-black/20 text-[11px] tracking-widest uppercase px-8 py-4 hover:border-bloomsy-black transition-colors"
          >
            <MessageCircle size={14} />
            ¿Preguntas? Escribenos
          </a>
        </div>
      </div>
    </section>
  );
}
