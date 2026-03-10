"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreditCard, Landmark, Loader2, Store, Truck } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import {
  formatCLP,
  FREE_SHIPPING_THRESHOLD,
  SHIPPING_COST,
} from "@/lib/utils";
import { useCheckoutStore } from "@/store/useCheckoutStore";

const CHILE_REGIONS = [
  "Arica y Parinacota",
  "Tarapaca",
  "Antofagasta",
  "Atacama",
  "Coquimbo",
  "Valparaiso",
  "Metropolitana de Santiago",
  "Libertador General Bernardo O'Higgins",
  "Maule",
  "Nuble",
  "Biobio",
  "La Araucania",
  "Los Rios",
  "Los Lagos",
  "Aysen del General Carlos Ibanez del Campo",
  "Magallanes y de la Antartica Chilena",
] as const;

const checkoutSchema = z
  .object({
    fullName: z.string().trim().min(1, "Ingresa tu nombre completo"),
    email: z
      .string()
      .trim()
      .min(1, "Ingresa tu email")
      .email("Ingresa un email valido"),
    phone: z
      .string()
      .trim()
      .regex(/^\+56\s9\s\d{4}\s\d{4}$/, "Usa el formato +56 9 XXXX XXXX"),
    deliveryMethod: z.enum(["delivery", "pickup"]),
    addressLine1: z.string().trim().optional(),
    apartment: z.string().trim().optional(),
    city: z.string().trim().optional(),
    region: z.string().trim().optional(),
    postalCode: z.string().trim().optional(),
    paymentMethod: z.enum(["webpay", "transfer"]),
  })
  .superRefine((values, ctx) => {
    if (values.deliveryMethod !== "delivery") return;

    if (!values.addressLine1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["addressLine1"],
        message: "Ingresa tu direccion",
      });
    }
    if (!values.city) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["city"],
        message: "Ingresa tu ciudad",
      });
    }
    if (!values.region) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["region"],
        message: "Selecciona tu region",
      });
    }
  });

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

const inputClassName =
  "w-full bg-white/60 border border-black/20 px-3 py-3 text-sm placeholder:text-black/35 focus:outline-none focus:border-bloomsy-black";

export default function CheckoutPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const items = useCartStore((state) => state.items);
  const setLastOrder = useCheckoutStore((state) => state.setLastOrder);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [items]
  );

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      deliveryMethod: "delivery",
      addressLine1: "",
      apartment: "",
      city: "",
      region: "",
      postalCode: "",
      paymentMethod: "webpay",
    },
  });

  const deliveryMethod = watch("deliveryMethod");
  const paymentMethod = watch("paymentMethod");

  const shipping =
    deliveryMethod === "pickup"
      ? 0
      : subtotal >= FREE_SHIPPING_THRESHOLD
        ? 0
        : SHIPPING_COST;
  const total = subtotal + shipping;

  useEffect(() => {
    if (items.length === 0) {
      router.replace("/shop");
    }
  }, [items.length, router]);

  const onSubmit = async (values: CheckoutFormValues) => {
    if (items.length === 0) {
      router.replace("/shop");
      return;
    }

    setIsSubmitting(true);

    const orderNumber = `BLM-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    setLastOrder({
      orderNumber,
      createdAt: new Date().toISOString(),
      items,
      subtotal,
      shipping,
      total,
      customer: {
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
      },
      deliveryMethod: values.deliveryMethod,
      deliveryAddress:
        values.deliveryMethod === "delivery"
          ? {
              addressLine1: values.addressLine1 || "",
              apartment: values.apartment || undefined,
              city: values.city || "",
              region: values.region || "",
              postalCode: values.postalCode || undefined,
            }
          : undefined,
      paymentMethod: values.paymentMethod,
    });

    await new Promise((resolve) => setTimeout(resolve, 900));
    router.push("/order/confirmacion");
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="max-w-[1400px] mx-auto px-4 md:px-8 py-10 md:py-12">
      <div className="mb-8">
        <p className="text-[10px] tracking-[0.3em] uppercase text-black/40 mb-2">
          Checkout
        </p>
        <h1 className="font-display text-4xl md:text-5xl font-light leading-none">
          Finaliza tu compra
        </h1>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]"
      >
        <div className="space-y-8">
          <section className="border border-black/10 bg-white/40 p-5 md:p-6 space-y-4">
            <h2 className="font-display text-3xl font-light">Datos de contacto</h2>

            <div>
              <label className="block text-[11px] tracking-wider uppercase mb-2">
                Nombre completo
              </label>
              <input
                type="text"
                {...register("fullName")}
                className={inputClassName}
                placeholder="Ej: Camila Rojas"
              />
              {errors.fullName && (
                <p className="text-xs text-red-700 mt-1">{errors.fullName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-[11px] tracking-wider uppercase mb-2">
                Email
              </label>
              <input
                type="email"
                {...register("email")}
                className={inputClassName}
                placeholder="nombre@email.com"
              />
              {errors.email && (
                <p className="text-xs text-red-700 mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-[11px] tracking-wider uppercase mb-2">
                Telefono
              </label>
              <input
                type="tel"
                {...register("phone")}
                className={inputClassName}
                placeholder="+56 9 1234 5678"
              />
              {errors.phone && (
                <p className="text-xs text-red-700 mt-1">{errors.phone.message}</p>
              )}
            </div>
          </section>

          <section className="border border-black/10 bg-white/40 p-5 md:p-6 space-y-4">
            <h2 className="font-display text-3xl font-light">Tipo de entrega</h2>

            <label className="block border border-black/20 p-4 cursor-pointer">
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  value="delivery"
                  {...register("deliveryMethod")}
                  className="mt-1"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium flex items-center gap-2">
                    <Truck size={16} />
                    Despacho a domicilio - {formatCLP(SHIPPING_COST)} (Gratis sobre{" "}
                    {formatCLP(FREE_SHIPPING_THRESHOLD)})
                  </p>
                </div>
              </div>
            </label>

            <label className="block border border-black/20 p-4 cursor-pointer">
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  value="pickup"
                  {...register("deliveryMethod")}
                  className="mt-1"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium flex items-center gap-2">
                    <Store size={16} />
                    Retiro personal - Gratis (Coordinar por WhatsApp)
                  </p>
                </div>
              </div>
            </label>

            {deliveryMethod === "delivery" ? (
              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-[11px] tracking-wider uppercase mb-2">
                    Direccion (calle y numero)
                  </label>
                  <input
                    type="text"
                    {...register("addressLine1")}
                    className={inputClassName}
                    placeholder="Ej: Av. Providencia 1234"
                  />
                  {errors.addressLine1 && (
                    <p className="text-xs text-red-700 mt-1">
                      {errors.addressLine1.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] tracking-wider uppercase mb-2">
                    Departamento / oficina (opcional)
                  </label>
                  <input
                    type="text"
                    {...register("apartment")}
                    className={inputClassName}
                    placeholder="Ej: Depto 403"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] tracking-wider uppercase mb-2">
                      Ciudad
                    </label>
                    <input
                      type="text"
                      {...register("city")}
                      className={inputClassName}
                      placeholder="Ej: Santiago"
                    />
                    {errors.city && (
                      <p className="text-xs text-red-700 mt-1">{errors.city.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] tracking-wider uppercase mb-2">
                      Region
                    </label>
                    <select {...register("region")} className={inputClassName}>
                      <option value="">Selecciona una region</option>
                      {CHILE_REGIONS.map((region) => (
                        <option key={region} value={region}>
                          {region}
                        </option>
                      ))}
                    </select>
                    {errors.region && (
                      <p className="text-xs text-red-700 mt-1">{errors.region.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] tracking-wider uppercase mb-2">
                    Codigo postal (opcional)
                  </label>
                  <input
                    type="text"
                    {...register("postalCode")}
                    className={inputClassName}
                    placeholder="Ej: 7500000"
                  />
                </div>
              </div>
            ) : (
              <div className="bg-black text-bloomsy-cream text-sm p-4">
                Te contactaremos al WhatsApp +56 9 9272 3158 para coordinar el
                retiro.
              </div>
            )}
          </section>

          <section className="border border-black/10 bg-white/40 p-5 md:p-6 space-y-4">
            <h2 className="font-display text-3xl font-light">Metodo de pago</h2>

            <label className="block border border-black/20 p-4 cursor-pointer">
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  value="webpay"
                  {...register("paymentMethod")}
                  className="mt-1"
                />
                <div>
                  <p className="text-sm font-medium flex items-center gap-2">
                    <CreditCard size={16} />
                    Webpay (Debito / Credito / Prepago)
                  </p>
                  <span className="inline-flex mt-2 border border-black/20 px-2 py-1 text-[10px] tracking-widest uppercase">
                    Transbank
                  </span>
                </div>
              </div>
            </label>

            <label className="block border border-black/20 p-4 cursor-pointer">
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  value="transfer"
                  {...register("paymentMethod")}
                  className="mt-1"
                />
                <div>
                  <p className="text-sm font-medium flex items-center gap-2">
                    <Landmark size={16} />
                    Transferencia bancaria
                  </p>
                </div>
              </div>
            </label>

            {paymentMethod === "transfer" && (
              <div className="bg-white/70 border border-black/15 p-4 text-sm space-y-1">
                <p>
                  Banco: <span className="text-black/60">[pendiente de completar]</span>
                </p>
                <p>
                  RUT: <span className="text-black/60">[pendiente]</span>
                </p>
                <p>
                  Nombre: <span className="text-black/60">[pendiente]</span>
                </p>
                <p>
                  Email: <span className="font-medium">info@bloomsy.cl</span>
                </p>
                <p className="text-black/70 pt-2">
                  Envia el comprobante a info@bloomsy.cl con tu numero de pedido.
                </p>
              </div>
            )}
          </section>
        </div>

        <aside className="lg:sticky lg:top-24 h-fit border border-black/10 bg-white/50 p-5 md:p-6 space-y-5">
          <h2 className="font-display text-3xl font-light">Resumen</h2>

          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {items.map((item) => (
              <article
                key={`${item.product.id}-${item.size}-${item.color.name}`}
                className="flex gap-3"
              >
                <div className="relative w-14 h-14 shrink-0 bg-white/80">
                  <Image
                    src={item.product.images[0]}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm leading-tight">{item.product.name}</p>
                  <p className="text-xs text-black/55 mt-1">
                    Talla: {item.size} · Color: {item.color.name}
                  </p>
                  <p className="text-xs text-black/55 mt-1">Cantidad: {item.quantity}</p>
                </div>
                <p className="text-sm whitespace-nowrap">
                  {formatCLP(item.product.price * item.quantity)}
                </p>
              </article>
            ))}
          </div>

          <div className="space-y-3 text-sm border-t border-black/10 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-black/60">Subtotal</span>
              <span>{formatCLP(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-black/60">Envio</span>
              {shipping === 0 ? (
                <span className="text-emerald-700 font-medium">GRATIS</span>
              ) : (
                <span>{formatCLP(shipping)}</span>
              )}
            </div>
            <div className="flex items-center justify-between border-t border-black/10 pt-3">
              <span className="uppercase tracking-wider">Total</span>
              <span className="font-display text-3xl leading-none">{formatCLP(total)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !isValid}
            className="w-full inline-flex items-center justify-center gap-2 bg-bloomsy-black text-bloomsy-cream text-[11px] tracking-widest uppercase py-4 hover:bg-bloomsy-gray transition-colors disabled:bg-black/25 disabled:text-black/40 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Confirmando...
              </>
            ) : (
              "Confirmar pedido"
            )}
          </button>

          <Link
            href="/cart"
            className="inline-flex text-[11px] tracking-wider uppercase text-black/65 hover:text-bloomsy-black transition-colors"
          >
            ← Volver al carrito
          </Link>
        </aside>
      </form>
    </section>
  );
}
