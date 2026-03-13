"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Package, Plus, Save, Users } from "lucide-react";
import {
  adminOrderStatuses,
  adminProductCategories,
} from "@/lib/admin-schema";
import { cn, formatCLP } from "@/lib/utils";

interface AdminVariant {
  id: string;
  size: string;
  color: string;
  colorHex: string;
  stock: number;
}

interface AdminImage {
  id: string;
  url: string;
  position: number;
}

interface AdminProduct {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  originalPrice: number | null;
  description: string;
  care: string[];
  images: AdminImage[];
  variants: AdminVariant[];
  isNew: boolean;
  isFeatured: boolean;
  isActive: boolean;
  updatedAt: string;
}

interface AdminOrderItem {
  id: string;
  name: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
}

interface AdminOrder {
  id: string;
  orderNumber: string;
  status: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingType: string;
  address: string | null;
  city: string | null;
  region: string | null;
  paymentMethod: string;
  subtotal: number;
  shipping: number;
  total: number;
  createdAt: string;
  items: AdminOrderItem[];
}

interface AdminSubscriber {
  id: string;
  email: string;
  createdAt: string;
}

interface AdminDashboardProps {
  products: AdminProduct[];
  orders: AdminOrder[];
  subscribers: AdminSubscriber[];
}

interface ProductFormState {
  name: string;
  slug: string;
  category: (typeof adminProductCategories)[number];
  price: string;
  originalPrice: string;
  description: string;
  careText: string;
  imagesText: string;
  variants: Array<{
    size: string;
    color: string;
    colorHex: string;
    stock: string;
  }>;
  isNew: boolean;
  isFeatured: boolean;
  isActive: boolean;
}

const inputClassName =
  "w-full border border-black/15 bg-white px-4 py-3 text-sm text-bloomsy-black outline-none transition-colors placeholder:text-black/30 focus:border-black";

const textareaClassName = `${inputClassName} min-h-28 resize-y`;

function createEmptyForm(): ProductFormState {
  return {
    name: "",
    slug: "",
    category: "poleras",
    price: "",
    originalPrice: "",
    description: "",
    careText: "",
    imagesText: "",
    variants: [
      {
        size: "",
        color: "",
        colorHex: "#000000",
        stock: "0",
      },
    ],
    isNew: false,
    isFeatured: false,
    isActive: true,
  };
}

function mapProductToForm(product: AdminProduct): ProductFormState {
  return {
    name: product.name,
    slug: product.slug,
    category: product.category as ProductFormState["category"],
    price: String(product.price),
    originalPrice: product.originalPrice ? String(product.originalPrice) : "",
    description: product.description,
    careText: product.care.join("\n"),
    imagesText: product.images
      .sort((a, b) => a.position - b.position)
      .map((image) => image.url)
      .join("\n"),
    variants: product.variants.map((variant) => ({
      size: variant.size,
      color: variant.color,
      colorHex: variant.colorHex,
      stock: String(variant.stock),
    })),
    isNew: product.isNew,
    isFeatured: product.isFeatured,
    isActive: product.isActive,
  };
}

function buildPayload(form: ProductFormState) {
  return {
    name: form.name,
    slug: form.slug,
    category: form.category,
    price: Number(form.price),
    originalPrice: form.originalPrice.trim() ? Number(form.originalPrice) : null,
    description: form.description,
    care: form.careText
      .split("\n")
      .map((value) => value.trim())
      .filter(Boolean),
    images: form.imagesText
      .split("\n")
      .map((value) => value.trim())
      .filter(Boolean),
    variants: form.variants.map((variant) => ({
      size: variant.size,
      color: variant.color,
      colorHex: variant.colorHex,
      stock: Number(variant.stock),
    })),
    isNew: form.isNew,
    isFeatured: form.isFeatured,
    isActive: form.isActive,
  };
}

export default function AdminDashboard({
  products,
  orders,
  subscribers,
}: AdminDashboardProps) {
  const router = useRouter();
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    products[0]?.id ?? null
  );
  const [form, setForm] = useState<ProductFormState>(() =>
    products[0] ? mapProductToForm(products[0]) : createEmptyForm()
  );
  const [productMessage, setProductMessage] = useState("");
  const [productError, setProductError] = useState("");
  const [orderFeedback, setOrderFeedback] = useState<Record<string, string>>({});
  const [orderStatuses, setOrderStatuses] = useState<Record<string, string>>(() =>
    Object.fromEntries(orders.map((order) => [order.id, order.status]))
  );
  const [isSavingProduct, startSavingProduct] = useTransition();
  const [isUpdatingOrderId, setIsUpdatingOrderId] = useState<string | null>(null);

  const selectedProduct = useMemo(
    () => products.find((product) => product.id === selectedProductId) ?? null,
    [products, selectedProductId]
  );

  useEffect(() => {
    if (selectedProduct) {
      setForm(mapProductToForm(selectedProduct));
      setProductError("");
      setProductMessage("");
      return;
    }

    if (!selectedProductId) {
      setForm(createEmptyForm());
      setProductError("");
      setProductMessage("");
    }
  }, [selectedProduct, selectedProductId]);

  function updateField<K extends keyof ProductFormState>(
    field: K,
    value: ProductFormState[K]
  ) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function updateVariant(
    index: number,
    field: keyof ProductFormState["variants"][number],
    value: string
  ) {
    setForm((current) => ({
      ...current,
      variants: current.variants.map((variant, variantIndex) =>
        variantIndex === index ? { ...variant, [field]: value } : variant
      ),
    }));
  }

  function addVariant() {
    setForm((current) => ({
      ...current,
      variants: [
        ...current.variants,
        {
          size: "",
          color: "",
          colorHex: "#000000",
          stock: "0",
        },
      ],
    }));
  }

  function removeVariant(index: number) {
    setForm((current) => ({
      ...current,
      variants:
        current.variants.length === 1
          ? current.variants
          : current.variants.filter((_, variantIndex) => variantIndex !== index),
    }));
  }

  function startNewProduct() {
    setSelectedProductId(null);
    setForm(createEmptyForm());
    setProductError("");
    setProductMessage("");
  }

  function saveProduct() {
    setProductError("");
    setProductMessage("");

    startSavingProduct(() => {
      void (async () => {
        const isEditing = Boolean(selectedProductId);
        const endpoint = isEditing
          ? `/api/admin/products/${selectedProductId}`
          : "/api/admin/products";

        const response = await fetch(endpoint, {
          method: isEditing ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(buildPayload(form)),
        });

        const result = await response.json();

        if (!response.ok) {
          setProductError(result.error ?? "No fue posible guardar el producto.");
          return;
        }

        setProductMessage(
          isEditing
            ? "Producto actualizado correctamente."
            : "Producto creado correctamente."
        );
        router.refresh();
      })();
    });
  }

  async function updateOrderStatus(orderId: string) {
    setIsUpdatingOrderId(orderId);
    setOrderFeedback((current) => ({ ...current, [orderId]: "" }));

    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: orderStatuses[orderId],
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setOrderFeedback((current) => ({
          ...current,
          [orderId]: result.error ?? "No fue posible actualizar el pedido.",
        }));
        return;
      }

      setOrderFeedback((current) => ({
        ...current,
        [orderId]: "Estado actualizado.",
      }));
      router.refresh();
    } finally {
      setIsUpdatingOrderId(null);
    }
  }

  const inventoryUnits = products.reduce(
    (sum, product) =>
      sum +
      product.variants.reduce(
        (variantSum, variant) => variantSum + variant.stock,
        0
      ),
    0
  );

  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-3">
        <article className="border border-black/10 bg-white/60 p-5">
          <p className="text-[10px] tracking-[0.24em] uppercase text-black/40">
            Productos
          </p>
          <p className="mt-3 font-display text-4xl font-light">{products.length}</p>
          <p className="mt-2 text-sm text-black/55">
            {inventoryUnits} unidades sumando todo el inventario.
          </p>
        </article>

        <article className="border border-black/10 bg-white/60 p-5">
          <p className="text-[10px] tracking-[0.24em] uppercase text-black/40">
            Pedidos
          </p>
          <p className="mt-3 font-display text-4xl font-light">{orders.length}</p>
          <p className="mt-2 text-sm text-black/55">
            {orders.filter((order) => order.status === "pending").length} pendientes de revisar.
          </p>
        </article>

        <article className="border border-black/10 bg-white/60 p-5">
          <p className="text-[10px] tracking-[0.24em] uppercase text-black/40">
            Suscriptores
          </p>
          <p className="mt-3 font-display text-4xl font-light">{subscribers.length}</p>
          <p className="mt-2 text-sm text-black/55">
            Base actual del newsletter de Bloomsy.
          </p>
        </article>
      </section>

      <section className="grid gap-8 xl:grid-cols-[340px_minmax(0,1fr)]">
        <div className="border border-black/10 bg-white/60 p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] tracking-[0.24em] uppercase text-black/40">
                Catalogo
              </p>
              <h2 className="mt-3 font-display text-3xl font-light">
                Productos
              </h2>
            </div>

            <button
              type="button"
              onClick={startNewProduct}
              className="inline-flex items-center gap-2 border border-black/10 px-3 py-2 text-[11px] tracking-[0.2em] uppercase transition-colors hover:border-black"
            >
              <Plus size={14} />
              Nuevo
            </button>
          </div>

          <div className="mt-6 space-y-3">
            {products.map((product) => {
              const totalStock = product.variants.reduce(
                (sum, variant) => sum + variant.stock,
                0
              );

              return (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => setSelectedProductId(product.id)}
                  className={cn(
                    "w-full border px-4 py-4 text-left transition-colors",
                    selectedProductId === product.id
                      ? "border-bloomsy-black bg-bloomsy-cream"
                      : "border-black/10 bg-white hover:border-black/30"
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{product.name}</p>
                      <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-black/40">
                        {product.category}
                      </p>
                    </div>
                    <span className="text-xs text-black/45">
                      {totalStock} u.
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-black/55">
                    <span>{formatCLP(product.price)}</span>
                    <span>{product.isActive ? "Activo" : "Oculto"}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="border border-black/10 bg-white/60 p-6 md:p-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[10px] tracking-[0.24em] uppercase text-black/40">
                {selectedProductId ? "Edicion" : "Alta"}
              </p>
              <h2 className="mt-3 font-display text-3xl font-light">
                {selectedProductId ? "Editar producto" : "Crear producto"}
              </h2>
            </div>

            {selectedProduct ? (
              <p className="text-sm text-black/50">
                Ultima actualizacion{" "}
                {new Intl.DateTimeFormat("es-CL", {
                  dateStyle: "medium",
                  timeStyle: "short",
                }).format(new Date(selectedProduct.updatedAt))}
              </p>
            ) : null}
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-[10px] tracking-[0.22em] uppercase text-black/45">
                Nombre
              </label>
              <input
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                className={inputClassName}
                placeholder="Polera Essential Negra"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[10px] tracking-[0.22em] uppercase text-black/45">
                Slug
              </label>
              <input
                value={form.slug}
                onChange={(event) => updateField("slug", event.target.value)}
                className={inputClassName}
                placeholder="polera-essential-negra"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[10px] tracking-[0.22em] uppercase text-black/45">
                Categoria
              </label>
              <select
                value={form.category}
                onChange={(event) =>
                  updateField(
                    "category",
                    event.target.value as ProductFormState["category"]
                  )
                }
                className={inputClassName}
              >
                {adminProductCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-[10px] tracking-[0.22em] uppercase text-black/45">
                Precio
              </label>
              <input
                type="number"
                min="0"
                value={form.price}
                onChange={(event) => updateField("price", event.target.value)}
                className={inputClassName}
                placeholder="24990"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[10px] tracking-[0.22em] uppercase text-black/45">
                Precio original
              </label>
              <input
                type="number"
                min="0"
                value={form.originalPrice}
                onChange={(event) =>
                  updateField("originalPrice", event.target.value)
                }
                className={inputClassName}
                placeholder="29990"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="mb-1.5 block text-[10px] tracking-[0.22em] uppercase text-black/45">
              Descripcion
            </label>
            <textarea
              value={form.description}
              onChange={(event) => updateField("description", event.target.value)}
              className={textareaClassName}
              placeholder="Describe el producto, su fit y detalles importantes."
            />
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-[10px] tracking-[0.22em] uppercase text-black/45">
                Cuidados
              </label>
              <textarea
                value={form.careText}
                onChange={(event) => updateField("careText", event.target.value)}
                className={textareaClassName}
                placeholder={"Lavar a mano\nNo usar secadora\nPlanchar a baja temperatura"}
              />
              <p className="mt-2 text-xs text-black/45">
                Un cuidado por linea.
              </p>
            </div>

            <div>
              <label className="mb-1.5 block text-[10px] tracking-[0.22em] uppercase text-black/45">
                Fotos
              </label>
              <textarea
                value={form.imagesText}
                onChange={(event) => updateField("imagesText", event.target.value)}
                className={textareaClassName}
                placeholder={"https://...\nhttps://..."}
              />
              <p className="mt-2 text-xs text-black/45">
                Una URL por linea. La primera se usa como portada.
              </p>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] tracking-[0.24em] uppercase text-black/40">
                  Inventario
                </p>
                <h3 className="mt-2 text-lg font-medium text-bloomsy-black">
                  Variantes y stock
                </h3>
              </div>

              <button
                type="button"
                onClick={addVariant}
                className="inline-flex items-center gap-2 border border-black/10 px-3 py-2 text-[11px] tracking-[0.2em] uppercase transition-colors hover:border-black"
              >
                <Plus size={14} />
                Variante
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {form.variants.map((variant, index) => (
                <div
                  key={`${index}-${variant.size}-${variant.color}`}
                  className="grid gap-3 border border-black/10 bg-white p-4 md:grid-cols-[1fr_1fr_130px_110px_auto]"
                >
                  <input
                    value={variant.size}
                    onChange={(event) =>
                      updateVariant(index, "size", event.target.value)
                    }
                    className={inputClassName}
                    placeholder="M"
                  />
                  <input
                    value={variant.color}
                    onChange={(event) =>
                      updateVariant(index, "color", event.target.value)
                    }
                    className={inputClassName}
                    placeholder="Negro"
                  />
                  <input
                    value={variant.colorHex}
                    onChange={(event) =>
                      updateVariant(index, "colorHex", event.target.value)
                    }
                    className={inputClassName}
                    placeholder="#000000"
                  />
                  <input
                    type="number"
                    min="0"
                    value={variant.stock}
                    onChange={(event) =>
                      updateVariant(index, "stock", event.target.value)
                    }
                    className={inputClassName}
                    placeholder="0"
                  />
                  <button
                    type="button"
                    onClick={() => removeVariant(index)}
                    disabled={form.variants.length === 1}
                    className="border border-black/10 px-3 py-3 text-[11px] tracking-[0.18em] uppercase transition-colors hover:border-black disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Quitar
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-4">
            {[
              { key: "isNew", label: "Nuevo" },
              { key: "isFeatured", label: "Destacado" },
              { key: "isActive", label: "Visible en tienda" },
            ].map((toggle) => (
              <label
                key={toggle.key}
                className="inline-flex items-center gap-3 border border-black/10 bg-white px-4 py-3 text-sm"
              >
                <input
                  type="checkbox"
                  checked={
                    form[
                      toggle.key as keyof Pick<
                        ProductFormState,
                        "isNew" | "isFeatured" | "isActive"
                      >
                    ]
                  }
                  onChange={(event) =>
                    updateField(
                      toggle.key as "isNew" | "isFeatured" | "isActive",
                      event.target.checked
                    )
                  }
                />
                {toggle.label}
              </label>
            ))}
          </div>

          {productError ? (
            <p className="mt-4 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {productError}
            </p>
          ) : null}

          {productMessage ? (
            <p className="mt-4 border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {productMessage}
            </p>
          ) : null}

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={saveProduct}
              disabled={isSavingProduct}
              className="inline-flex items-center justify-center gap-2 bg-bloomsy-black px-5 py-3 text-[11px] tracking-[0.22em] uppercase text-bloomsy-cream transition-colors hover:bg-bloomsy-gray disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSavingProduct ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save size={16} />
                  {selectedProductId ? "Actualizar producto" : "Crear producto"}
                </>
              )}
            </button>

            {selectedProductId ? (
              <button
                type="button"
                onClick={startNewProduct}
                className="border border-black/10 px-5 py-3 text-[11px] tracking-[0.22em] uppercase transition-colors hover:border-black"
              >
                Crear otro
              </button>
            ) : null}
          </div>
        </div>
      </section>

      <section className="border border-black/10 bg-white/60 p-6 md:p-8">
        <div className="flex items-center gap-3">
          <Package size={18} className="text-black/45" />
          <div>
            <p className="text-[10px] tracking-[0.24em] uppercase text-black/40">
              Operacion
            </p>
            <h2 className="mt-2 font-display text-3xl font-light">
              Pedidos
            </h2>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          {orders.map((order) => (
            <article key={order.id} className="border border-black/10 bg-white p-5 md:p-6">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-[10px] tracking-[0.24em] uppercase text-black/40">
                    {order.orderNumber}
                  </p>
                  <h3 className="mt-2 text-lg font-medium text-bloomsy-black">
                    {order.customerName}
                  </h3>
                  <div className="mt-3 space-y-1 text-sm text-black/60">
                    <p>{order.customerEmail}</p>
                    <p>{order.customerPhone}</p>
                    <p>
                      {new Intl.DateTimeFormat("es-CL", {
                        dateStyle: "long",
                        timeStyle: "short",
                      }).format(new Date(order.createdAt))}
                    </p>
                  </div>
                </div>

                <div className="min-w-[280px] space-y-4">
                  <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
                    <div>
                      <label className="mb-1.5 block text-[10px] tracking-[0.22em] uppercase text-black/45">
                        Estado
                      </label>
                      <select
                        value={orderStatuses[order.id] ?? order.status}
                        onChange={(event) =>
                          setOrderStatuses((current) => ({
                            ...current,
                            [order.id]: event.target.value,
                          }))
                        }
                        className={inputClassName}
                      >
                        {adminOrderStatuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={() => void updateOrderStatus(order.id)}
                      disabled={isUpdatingOrderId === order.id}
                      className="inline-flex items-center justify-center gap-2 bg-bloomsy-black px-5 py-3 text-[11px] tracking-[0.22em] uppercase text-bloomsy-cream transition-colors hover:bg-bloomsy-gray disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isUpdatingOrderId === order.id ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Guardando
                        </>
                      ) : (
                        <>
                          <Save size={16} />
                          Actualizar
                        </>
                      )}
                    </button>
                  </div>

                  <div className="border border-black/10 bg-bloomsy-cream p-4 text-sm text-black/60">
                    <p>
                      <strong className="text-black/75">Entrega:</strong>{" "}
                      {order.shippingType}
                    </p>
                    {order.address ? (
                      <p className="mt-1">
                        <strong className="text-black/75">Direccion:</strong>{" "}
                        {order.address}, {order.city}, {order.region}
                      </p>
                    ) : null}
                    <p className="mt-1">
                      <strong className="text-black/75">Pago:</strong>{" "}
                      {order.paymentMethod}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-start">
                <ul className="space-y-3 border-t border-black/8 pt-5">
                  {order.items.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-start justify-between gap-4 text-sm"
                    >
                      <div>
                        <p className="text-bloomsy-black">{item.name}</p>
                        <p className="mt-1 text-black/50">
                          Talla {item.size} | {item.color} | Cantidad {item.quantity}
                        </p>
                      </div>
                      <span className="font-medium text-bloomsy-black">
                        {formatCLP(item.price * item.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="min-w-[220px] border border-black/10 bg-white p-4 text-sm text-black/60">
                  <div className="flex items-center justify-between">
                    <span>Subtotal</span>
                    <span>{formatCLP(order.subtotal)}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span>Envio</span>
                    <span>{formatCLP(order.shipping)}</span>
                  </div>
                  <div className="mt-3 border-t border-black/10 pt-3 text-base font-medium text-bloomsy-black">
                    <div className="flex items-center justify-between">
                      <span>Total</span>
                      <span>{formatCLP(order.total)}</span>
                    </div>
                  </div>
                  {orderFeedback[order.id] ? (
                    <p className="mt-3 text-xs text-emerald-700">
                      {orderFeedback[order.id]}
                    </p>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border border-black/10 bg-white/60 p-6 md:p-8">
        <div className="flex items-center gap-3">
          <Users size={18} className="text-black/45" />
          <div>
            <p className="text-[10px] tracking-[0.24em] uppercase text-black/40">
              Comunidad
            </p>
            <h2 className="mt-2 font-display text-3xl font-light">
              Suscriptores
            </h2>
          </div>
        </div>

        <div className="mt-8 overflow-hidden border border-black/10 bg-white">
          <div className="grid grid-cols-[minmax(0,1fr)_220px] border-b border-black/10 bg-bloomsy-cream px-5 py-3 text-[10px] tracking-[0.22em] uppercase text-black/40">
            <span>Email</span>
            <span>Fecha de suscripcion</span>
          </div>

          {subscribers.length === 0 ? (
            <div className="px-5 py-8 text-sm text-black/55">
              Aun no hay suscriptores guardados.
            </div>
          ) : (
            <div>
              {subscribers.map((subscriber) => (
                <div
                  key={subscriber.id}
                  className="grid grid-cols-[minmax(0,1fr)_220px] border-b border-black/10 px-5 py-4 text-sm last:border-b-0"
                >
                  <span className="truncate">{subscriber.email}</span>
                  <span className="text-black/55">
                    {new Intl.DateTimeFormat("es-CL", {
                      dateStyle: "medium",
                    }).format(new Date(subscriber.createdAt))}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
