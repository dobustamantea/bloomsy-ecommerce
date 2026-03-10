"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Truck, Store, CreditCard, Building2 } from "lucide-react";
import {
  checkoutSchema,
  type CheckoutFormValues,
  CHILEAN_REGIONS,
} from "@/lib/checkout-schema";
import { useCartStore, selectTotal } from "@/store/useCartStore";
import { useCheckoutStore } from "@/store/useCheckoutStore";
import { formatCLP, SHIPPING_COST, FREE_SHIPPING_THRESHOLD } from "@/lib/utils";
import { cn } from "@/lib/utils";

/* ── shared field styles ─────────────────────────────────────── */
const inputCls =
  "w-full border border-black/20 bg-transparent px-3 py-2.5 text-sm focus:outline-none focus:border-bloomsy-black placeholder:text-black/30 transition-colors";
const labelCls = "block text-[10px] tracking-widest uppercase text-black/50 mb-1.5";
const errorCls = "text-[11px] text-red-500 mt-1";

/* ── Section wrapper ──────────────────────────────────────────── */
function Section({
  number,
  title,
  children,
}: {
  number: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <span className="w-6 h-6 bg-bloomsy-black text-bloomsy-cream text-[10px] font-bold rounded-full flex items-center justify-center flex-shrink-0">
          {number}
        </span>
        <h2 className="text-[11px] tracking-widest uppercase">{title}</h2>
      </div>
      <div className="pl-9 space-y-4">{children}</div>
    </div>
  );
}

function generateOrderNumber() {
  const year = new Date().getFullYear();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `BLM-${year}-${rand}`;
}

export default function CheckoutForm() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore(selectTotal);
  const setOrder = useCheckoutStore((s) => s.setOrder);

  /* Redirect to shop if cart is empty */
  useEffect(() => {
    if (items.length === 0) router.replace("/shop");
  }, [items, router]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { deliveryType: "delivery", paymentMethod: "webpay" },
    mode: "onChange",
  });

  const deliveryType = watch("deliveryType");
  const paymentMethod = watch("paymentMethod");

  const shippingFree =
    deliveryType === "pickup" || subtotal >= FREE_SHIPPING_THRESHOLD;
  const shippingCost = shippingFree ? 0 : SHIPPING_COST;
  const total = subtotal + shippingCost;

  const [loading, setLoading] = useState(false);

  async function onSubmit(data: CheckoutFormValues) {
    setLoading(true);
    /* Simulate processing */
    await new Promise((res) => setTimeout(res, 1200));

    setOrder({
      name: data.name,
      email: data.email,
      phone: data.phone,
      deliveryType: data.deliveryType,
      address: data.address ?? "",
      apartment: data.apartment ?? "",
      city: data.city ?? "",
      region: data.region ?? "",
      postalCode: data.postalCode ?? "",
      paymentMethod: data.paymentMethod,
      subtotal,
      shippingCost,
      total,
      items: items.map((item) => ({
        name: item.product.name,
        slug: item.product.slug,
        image: item.product.images[0],
        size: item.size,
        colorName: item.color.name,
        colorHex: item.color.hex,
        price: item.product.price,
        quantity: item.quantity,
      })),
      orderNumber: generateOrderNumber(),
    });

    router.push("/order/confirmacion");
  }

  if (items.length === 0) return null; /* handled by useEffect redirect */

  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-10">
      {/* Page header */}
      <div className="mb-8">
        <p className="text-[10px] tracking-[0.3em] uppercase text-black/40 mb-2">
          Checkout
        </p>
        <h1 className="font-display text-4xl md:text-5xl font-light">
          Finalizar compra
        </h1>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-start"
      >
        {/* ── LEFT: form sections ──────────────────────────────── */}
        <div className="flex-1 min-w-0 space-y-10">
          {/* ── 1. Contact ──────────────────────────────────────── */}
          <Section number={1} title="Datos de contacto">
            <div>
              <label className={labelCls}>Nombre completo</label>
              <input
                type="text"
                placeholder="María González"
                className={cn(inputCls, errors.name && "border-red-400")}
                {...register("name")}
              />
              {errors.name && (
                <p className={errorCls}>{errors.name.message}</p>
              )}
            </div>
            <div>
              <label className={labelCls}>Email</label>
              <input
                type="email"
                placeholder="maria@email.com"
                className={cn(inputCls, errors.email && "border-red-400")}
                {...register("email")}
              />
              {errors.email && (
                <p className={errorCls}>{errors.email.message}</p>
              )}
            </div>
            <div>
              <label className={labelCls}>Teléfono</label>
              <input
                type="tel"
                placeholder="+56 9 8765 4321"
                className={cn(inputCls, errors.phone && "border-red-400")}
                {...register("phone")}
              />
              {errors.phone && (
                <p className={errorCls}>{errors.phone.message}</p>
              )}
            </div>
          </Section>

          {/* ── 2. Delivery type ────────────────────────────────── */}
          <Section number={2} title="Tipo de entrega">
            {/* Radio options */}
            <div className="space-y-3">
              {/* Despacho */}
              <label
                className={cn(
                  "flex items-start gap-3 p-4 border cursor-pointer transition-colors",
                  deliveryType === "delivery"
                    ? "border-bloomsy-black bg-black/[0.02]"
                    : "border-black/15 hover:border-black/30"
                )}
              >
                <input
                  type="radio"
                  value="delivery"
                  className="sr-only"
                  {...register("deliveryType")}
                />
                <span
                  className={cn(
                    "w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors",
                    deliveryType === "delivery"
                      ? "border-bloomsy-black"
                      : "border-black/30"
                  )}
                >
                  {deliveryType === "delivery" && (
                    <span className="w-2 h-2 rounded-full bg-bloomsy-black" />
                  )}
                </span>
                <div>
                  <p className="text-sm flex items-center gap-2">
                    <Truck size={14} className="text-black/50" />
                    Despacho a domicilio
                  </p>
                  <p className="text-[11px] text-black/40 mt-0.5">
                    {subtotal >= FREE_SHIPPING_THRESHOLD
                      ? "Gratis · StarKen · 3–5 días hábiles"
                      : `$3.990 · StarKen · 3–5 días hábiles · Gratis sobre $65.000`}
                  </p>
                </div>
              </label>

              {/* Retiro */}
              <label
                className={cn(
                  "flex items-start gap-3 p-4 border cursor-pointer transition-colors",
                  deliveryType === "pickup"
                    ? "border-bloomsy-black bg-black/[0.02]"
                    : "border-black/15 hover:border-black/30"
                )}
              >
                <input
                  type="radio"
                  value="pickup"
                  className="sr-only"
                  {...register("deliveryType")}
                />
                <span
                  className={cn(
                    "w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors",
                    deliveryType === "pickup"
                      ? "border-bloomsy-black"
                      : "border-black/30"
                  )}
                >
                  {deliveryType === "pickup" && (
                    <span className="w-2 h-2 rounded-full bg-bloomsy-black" />
                  )}
                </span>
                <div>
                  <p className="text-sm flex items-center gap-2">
                    <Store size={14} className="text-black/50" />
                    Retiro personal — Gratis
                  </p>
                  <p className="text-[11px] text-black/40 mt-0.5">
                    Coordinar por WhatsApp
                  </p>
                </div>
              </label>
            </div>

            {/* Delivery address fields */}
            {deliveryType === "delivery" && (
              <div className="space-y-4 mt-4 pt-4 border-t border-black/8">
                <div>
                  <label className={labelCls}>Dirección</label>
                  <input
                    type="text"
                    placeholder="Calle y número"
                    className={cn(
                      inputCls,
                      errors.address && "border-red-400"
                    )}
                    {...register("address")}
                  />
                  {errors.address && (
                    <p className={errorCls}>{errors.address.message}</p>
                  )}
                </div>
                <div>
                  <label className={labelCls}>
                    Departamento / Oficina{" "}
                    <span className="normal-case tracking-normal text-black/30">
                      (opcional)
                    </span>
                  </label>
                  <input
                    type="text"
                    placeholder="Depto 5B"
                    className={inputCls}
                    {...register("apartment")}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Ciudad</label>
                    <input
                      type="text"
                      placeholder="Santiago"
                      className={cn(inputCls, errors.city && "border-red-400")}
                      {...register("city")}
                    />
                    {errors.city && (
                      <p className={errorCls}>{errors.city.message}</p>
                    )}
                  </div>
                  <div>
                    <label className={labelCls}>
                      Código postal{" "}
                      <span className="normal-case tracking-normal text-black/30">
                        (opcional)
                      </span>
                    </label>
                    <input
                      type="text"
                      placeholder="8320000"
                      className={inputCls}
                      {...register("postalCode")}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Región</label>
                  <select
                    className={cn(
                      inputCls,
                      "cursor-pointer",
                      errors.region && "border-red-400"
                    )}
                    {...register("region")}
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Selecciona tu región
                    </option>
                    {CHILEAN_REGIONS.map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>
                  {errors.region && (
                    <p className={errorCls}>{errors.region.message}</p>
                  )}
                </div>
              </div>
            )}

            {/* Pickup info box */}
            {deliveryType === "pickup" && (
              <div className="mt-4 p-4 bg-black/[0.03] border border-black/8 text-sm text-black/60 leading-relaxed">
                Te contactaremos al WhatsApp{" "}
                <a
                  href="https://wa.me/56992723158"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-bloomsy-black underline underline-offset-2"
                >
                  +56 9 9272 3158
                </a>{" "}
                para coordinar el retiro en nuestro punto de entrega.
              </div>
            )}
          </Section>

          {/* ── 3. Payment ──────────────────────────────────────── */}
          <Section number={3} title="Método de pago">
            <div className="space-y-3">
              {/* Webpay */}
              <label
                className={cn(
                  "flex items-start gap-3 p-4 border cursor-pointer transition-colors",
                  paymentMethod === "webpay"
                    ? "border-bloomsy-black bg-black/[0.02]"
                    : "border-black/15 hover:border-black/30"
                )}
              >
                <input
                  type="radio"
                  value="webpay"
                  className="sr-only"
                  {...register("paymentMethod")}
                />
                <span
                  className={cn(
                    "w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors",
                    paymentMethod === "webpay"
                      ? "border-bloomsy-black"
                      : "border-black/30"
                  )}
                >
                  {paymentMethod === "webpay" && (
                    <span className="w-2 h-2 rounded-full bg-bloomsy-black" />
                  )}
                </span>
                <div>
                  <p className="text-sm flex items-center gap-2">
                    <CreditCard size={14} className="text-black/50" />
                    Webpay — Débito / Crédito / Prepago
                  </p>
                  <p className="text-[11px] text-black/40 mt-0.5">
                    Pago seguro con Transbank
                  </p>
                </div>
              </label>

              {/* Transfer */}
              <label
                className={cn(
                  "flex items-start gap-3 p-4 border cursor-pointer transition-colors",
                  paymentMethod === "transfer"
                    ? "border-bloomsy-black bg-black/[0.02]"
                    : "border-black/15 hover:border-black/30"
                )}
              >
                <input
                  type="radio"
                  value="transfer"
                  className="sr-only"
                  {...register("paymentMethod")}
                />
                <span
                  className={cn(
                    "w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors",
                    paymentMethod === "transfer"
                      ? "border-bloomsy-black"
                      : "border-black/30"
                  )}
                >
                  {paymentMethod === "transfer" && (
                    <span className="w-2 h-2 rounded-full bg-bloomsy-black" />
                  )}
                </span>
                <div>
                  <p className="text-sm flex items-center gap-2">
                    <Building2 size={14} className="text-black/50" />
                    Transferencia bancaria
                  </p>
                  <p className="text-[11px] text-black/40 mt-0.5">
                    Confirmaremos tu pedido al recibir el comprobante
                  </p>
                </div>
              </label>
            </div>

            {/* Transfer bank info */}
            {paymentMethod === "transfer" && (
              <div className="mt-4 p-5 bg-black/[0.03] border border-black/8 space-y-2.5">
                <p className="text-[10px] tracking-widest uppercase text-black/40 mb-3">
                  Datos bancarios
                </p>
                {[
                  ["Banco", "Pendiente de completar"],
                  ["RUT", "Pendiente de completar"],
                  ["Nombre", "Pendiente de completar"],
                  ["Email", "info@bloomsy.cl"],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-black/50">{label}</span>
                    <span
                      className={
                        value === "Pendiente de completar"
                          ? "text-black/30 italic"
                          : "font-medium"
                      }
                    >
                      {value}
                    </span>
                  </div>
                ))}
                <p className="text-[11px] text-black/50 pt-2 border-t border-black/8 leading-relaxed">
                  Envía el comprobante a{" "}
                  <strong className="text-bloomsy-black">
                    info@bloomsy.cl
                  </strong>{" "}
                  con tu número de pedido para confirmar tu compra.
                </p>
              </div>
            )}
          </Section>

          {/* Mobile submit (below form) */}
          <div className="lg:hidden pt-2">
            <button
              type="submit"
              disabled={!isValid || loading}
              className={cn(
                "w-full flex items-center justify-center gap-2 text-[11px] tracking-widest uppercase py-4 transition-colors",
                isValid && !loading
                  ? "bg-bloomsy-black text-bloomsy-cream hover:bg-bloomsy-gray"
                  : "bg-black/20 text-black/40 cursor-not-allowed"
              )}
            >
              {loading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Procesando...
                </>
              ) : (
                "Confirmar pedido"
              )}
            </button>
          </div>
        </div>

        {/* ── RIGHT: sticky order summary ──────────────────────── */}
        <div className="w-full lg:w-80 flex-shrink-0 lg:sticky lg:top-24">
          <div className="border border-black/10 p-6 space-y-5">
            <p className="text-[10px] tracking-[0.25em] uppercase text-black/40">
              Tu pedido
            </p>

            {/* Item list */}
            <ul className="space-y-4 border-b border-black/10 pb-5">
              {items.map((item) => (
                <li
                  key={`${item.product.id}-${item.size}-${item.color.name}`}
                  className="flex items-center gap-3"
                >
                  <div className="relative w-14 h-16 flex-shrink-0 overflow-hidden bg-[#F7F5F0]">
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                    <span className="absolute -top-1.5 -right-1.5 bg-bloomsy-black text-bloomsy-cream text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs leading-snug line-clamp-2">
                      {item.product.name}
                    </p>
                    <p className="text-[10px] text-black/40 mt-0.5">
                      T.{item.size} · {item.color.name}
                    </p>
                  </div>
                  <span className="text-xs font-medium flex-shrink-0">
                    {formatCLP(item.product.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>

            {/* Totals */}
            <div className="space-y-2.5">
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

            <div className="flex justify-between items-baseline border-t border-black/10 pt-4">
              <span className="text-[11px] tracking-widest uppercase text-black/40">
                Total
              </span>
              <span className="font-display text-2xl font-medium">
                {formatCLP(total)}
              </span>
            </div>

            {/* Desktop submit */}
            <button
              type="submit"
              disabled={!isValid || loading}
              className={cn(
                "hidden lg:flex w-full items-center justify-center gap-2 text-[11px] tracking-widest uppercase py-4 transition-colors",
                isValid && !loading
                  ? "bg-bloomsy-black text-bloomsy-cream hover:bg-bloomsy-gray"
                  : "bg-black/20 text-black/40 cursor-not-allowed"
              )}
            >
              {loading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Procesando...
                </>
              ) : (
                "Confirmar pedido"
              )}
            </button>

            <Link
              href="/cart"
              className="block text-center text-[11px] text-black/40 hover:text-bloomsy-black transition-colors tracking-wide"
            >
              ← Volver al carrito
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
