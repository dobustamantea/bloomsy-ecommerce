"use client";

import { useEffect, useState, useCallback, useId } from "react";
import {
  Search,
  Plus,
  ChevronDown,
  ChevronUp,
  X,
  Loader2,
  ImageIcon,
} from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";

// ── Types ────────────────────────────────────────────────────────────────────

interface Variant {
  id?: string;
  size: string;
  color: string;
  colorHex: string;
  stock: number;
}

interface ProductImage {
  id?: string;
  url: string;
  position: number;
}

interface AdminProduct {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  originalPrice: number | null;
  description: string;
  care: string[];
  isNew: boolean;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
  variants: Variant[];
  images: ProductImage[];
}

interface FormState {
  name: string;
  slug: string;
  category: string;
  price: string;
  originalPrice: string;
  description: string;
  care: string;
  isNew: boolean;
  isFeatured: boolean;
  isActive: boolean;
  images: string[];
  variants: Variant[];
}

type AccordionKey = "info" | "description" | "photos" | "inventory";
type SortKey = "newest" | "name" | "price" | "stock";

// ── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES = [
  "poleras", "tops", "faldas", "abrigos",
  "pantalones", "bodys", "chalecos", "conjuntos",
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function getProductStock(p: AdminProduct) {
  return p.variants.reduce((s, v) => s + v.stock, 0);
}

function stockBadge(stock: number): { label: string; className: string } {
  if (stock === 0) return { label: "0", className: "bg-gray-200 text-gray-600" };
  if (stock < 5) return { label: String(stock), className: "bg-red-100 text-red-700" };
  if (stock < 20) return { label: String(stock), className: "bg-yellow-100 text-yellow-700" };
  return { label: String(stock), className: "bg-green-100 text-green-700" };
}

function toSlug(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

function formatPrice(raw: string) {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  return Number(digits).toLocaleString("es-CL");
}

function parsePrice(formatted: string) {
  return parseInt(formatted.replace(/[.\s]/g, "").replace(/,/g, ""), 10) || 0;
}

function emptyForm(): FormState {
  return {
    name: "", slug: "", category: "poleras",
    price: "", originalPrice: "",
    description: "", care: "",
    isNew: false, isFeatured: false, isActive: true,
    images: [""],
    variants: [{ size: "", color: "", colorHex: "#000000", stock: 0 }],
  };
}

function productToForm(p: AdminProduct): FormState {
  return {
    name: p.name,
    slug: p.slug,
    category: p.category,
    price: p.price.toLocaleString("es-CL"),
    originalPrice: p.originalPrice ? p.originalPrice.toLocaleString("es-CL") : "",
    description: p.description,
    care: p.care.join("\n"),
    isNew: p.isNew,
    isFeatured: p.isFeatured,
    isActive: p.isActive,
    images: p.images.length > 0 ? p.images.map((i) => i.url) : [""],
    variants: p.variants.length > 0
      ? p.variants
      : [{ size: "", color: "", colorHex: "#000000", stock: 0 }],
  };
}

// ── Toast ────────────────────────────────────────────────────────────────────

interface ToastItem { id: number; type: "success" | "error"; msg: string }

function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const show = useCallback((type: "success" | "error", msg: string) => {
    const id = Date.now();
    setToasts((t) => [...t, { id, type, msg }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  }, []);
  return { toasts, show };
}

function ToastContainer({ toasts }: { toasts: ToastItem[] }) {
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`px-4 py-3 text-sm text-white shadow-lg ${
            t.type === "success" ? "bg-black" : "bg-red-600"
          }`}
        >
          {t.msg}
        </div>
      ))}
    </div>
  );
}

// ── Accordion ────────────────────────────────────────────────────────────────

function AccordionItem({
  title, open, onToggle, children,
}: {
  title: string; open: boolean; onToggle: () => void; children: React.ReactNode;
}) {
  return (
    <div className="border-b border-black/10 last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between py-3 text-sm font-medium text-left"
      >
        {title}
        {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
      </button>
      {open && <div className="pb-4">{children}</div>}
    </div>
  );
}

// ── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-black/10 ${className}`} />;
}

// ── Types (colors) ────────────────────────────────────────────────────────────

interface ColorOption {
  id: string;
  name: string;
  hex: string;
}

// ── Main Component ───────────────────────────────────────────────────────────

export default function ProductsSection() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [colors, setColors] = useState<ColorOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState<SortKey>("newest");
  const [selectedId, setSelectedId] = useState<string | "new" | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [openSections, setOpenSections] = useState<Set<AccordionKey>>(new Set<AccordionKey>(["info"]));
  const { toasts, show } = useToast();
  const uid = useId();

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/products").then((r) => r.json()),
      fetch("/api/admin/colors").then((r) => r.json()),
    ]).then(([prods, cols]) => {
      setProducts(prods);
      if (Array.isArray(cols)) setColors(cols);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  function selectProduct(p: AdminProduct) {
    if (hasChanges && !confirm("¿Descartar cambios sin guardar?")) return;
    setSelectedId(p.id);
    setForm(productToForm(p));
    setHasChanges(false);
    setOpenSections(new Set<AccordionKey>(["info"]));
  }

  function newProduct() {
    if (hasChanges && !confirm("¿Descartar cambios sin guardar?")) return;
    setSelectedId("new");
    setForm(emptyForm());
    setHasChanges(false);
    setOpenSections(new Set<AccordionKey>(["info"]));
  }

  function updateForm<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setHasChanges(true);
  }

  function handleNameChange(name: string) {
    setForm((f) => ({ ...f, name, slug: toSlug(name) }));
    setHasChanges(true);
  }

  function toggleSection(s: AccordionKey) {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(s)) next.delete(s); else next.add(s);
      return next;
    });
  }

  async function handleSave() {
    setSaving(true);
    const payload = {
      name: form.name,
      slug: form.slug,
      category: form.category,
      price: parsePrice(form.price),
      originalPrice: form.originalPrice ? parsePrice(form.originalPrice) : null,
      description: form.description,
      care: form.care.split("\n").map((s) => s.trim()).filter(Boolean),
      isNew: form.isNew,
      isFeatured: form.isFeatured,
      isActive: form.isActive,
      images: form.images.filter(Boolean),
      variants: form.variants.filter((v) => v.size || v.color),
    };

    try {
      const isNew = selectedId === "new";
      const res = await fetch(
        isNew ? "/api/admin/products" : `/api/admin/products/${selectedId}`,
        {
          method: isNew ? "POST" : "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { error?: string }).error ?? "Error");
      }
      if (isNew) {
        const saved: AdminProduct = await res.json();
        setProducts((p) => [saved, ...p]);
        setSelectedId(saved.id);
        setForm(productToForm(saved));
      } else {
        // PATCH returns { success: true } — reconstruct locally
        const existing = products.find((p) => p.id === selectedId);
        if (existing) {
          const updated: AdminProduct = {
            ...existing,
            name: payload.name,
            slug: payload.slug,
            category: payload.category,
            price: payload.price,
            originalPrice: payload.originalPrice,
            description: payload.description,
            care: payload.care,
            isNew: payload.isNew,
            isFeatured: payload.isFeatured,
            isActive: payload.isActive,
            images: payload.images.map((url, i) => ({ url, position: i })),
            variants: payload.variants,
          };
          setProducts((p) => p.map((x) => (x.id === selectedId ? updated : x)));
          setForm(productToForm(updated));
        }
      }
      setHasChanges(false);
      show("success", isNew ? "Producto creado" : "Producto actualizado");
    } catch (e) {
      show("error", e instanceof Error ? e.message : "Error al guardar el producto");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!selectedId || selectedId === "new") return;
    if (!confirm("¿Eliminar este producto? Esta acción no se puede deshacer.")) return;
    const res = await fetch(`/api/admin/products/${selectedId}`, { method: "DELETE" });
    if (res.ok) {
      setProducts((p) => p.filter((x) => x.id !== selectedId));
      setSelectedId(null);
      show("success", "Producto eliminado");
    } else {
      show("error", "Error al eliminar");
    }
  }

  const filtered = products
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    .filter((p) => categoryFilter === "all" || p.category === categoryFilter)
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "price") return a.price - b.price;
      if (sortBy === "stock") return getProductStock(a) - getProductStock(b);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="flex h-full overflow-hidden">
      <ToastContainer toasts={toasts} />

      {/* ── Product list panel ── */}
      <div
        className={`${
          selectedId ? "hidden md:flex" : "flex"
        } flex-col w-full md:w-72 xl:w-80 border-r border-black/10 shrink-0 overflow-hidden`}
      >
        {/* Toolbar */}
        <div className="p-3 border-b border-black/10 space-y-2">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-black/35" />
              <input
                type="text"
                placeholder="Buscar producto..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-7 pr-3 py-1.5 text-sm border border-black/20 bg-transparent focus:outline-none focus:border-black"
              />
            </div>
            <button
              onClick={newProduct}
              className="flex items-center gap-1 px-3 py-1.5 text-sm bg-black text-white hover:bg-black/80 transition-colors shrink-0"
            >
              <Plus size={14} /> Nuevo
            </button>
          </div>

          <div className="flex gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="flex-1 text-xs py-1.5 px-2 border border-black/20 bg-transparent focus:outline-none"
            >
              <option value="all">Todas</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortKey)}
              className="flex-1 text-xs py-1.5 px-2 border border-black/20 bg-transparent focus:outline-none"
            >
              <option value="newest">Más reciente</option>
              <option value="name">Nombre A-Z</option>
              <option value="price">Precio</option>
              <option value="stock">Stock</option>
            </select>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-3 space-y-2">
              {[...Array(7)].map((_, i) => <Skeleton key={i} className="h-16" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-6 text-sm text-black/35 text-center">No hay productos</div>
          ) : (
            filtered.map((product) => {
              const stock = getProductStock(product);
              const badge = stockBadge(stock);
              const firstImage = product.images[0]?.url;
              const isSelected = selectedId === product.id;
              return (
                <button
                  key={product.id}
                  onClick={() => selectProduct(product)}
                  className={`w-full flex items-center gap-3 p-3 border-b border-black/5 text-left transition-colors ${
                    isSelected ? "bg-black text-white" : "hover:bg-black/5"
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="w-10 h-10 shrink-0 overflow-hidden bg-gray-100 flex items-center justify-center border border-black/10">
                    {firstImage ? (
                      <img
                        src={firstImage}
                        alt=""
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <ImageIcon size={13} className="text-black/25" />
                    )}
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{product.name}</div>
                    <div className={`text-xs ${isSelected ? "text-white/55" : "text-black/40"}`}>
                      {product.category}
                    </div>
                  </div>
                  {/* Stock badge */}
                  <span className={`text-xs px-1.5 py-0.5 font-medium shrink-0 ${badge.className}`}>
                    {badge.label}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* ── Editor panel ── */}
      {selectedId && (
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Editor header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-black/10 shrink-0">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (hasChanges && !confirm("¿Descartar cambios?")) return;
                  setSelectedId(null);
                  setHasChanges(false);
                }}
                className="md:hidden mr-1 text-black/40 hover:text-black"
              >
                ←
              </button>
              <span className="text-sm font-medium truncate max-w-[180px] md:max-w-none">
                {selectedId === "new" ? "Nuevo producto" : (form.name || "Editar producto")}
              </span>
              {hasChanges && (
                <span className="text-xs text-orange-500 shrink-0">● Sin guardar</span>
              )}
            </div>
            {selectedId !== "new" && (
              <button
                onClick={handleDelete}
                className="text-xs text-red-400 hover:text-red-600 shrink-0"
              >
                Eliminar
              </button>
            )}
          </div>

          {/* Form */}
          <div className="flex-1 overflow-y-auto px-4 pb-24 md:pb-6">
            {/* Información básica */}
            <AccordionItem
              title="Información básica"
              open={openSections.has("info")}
              onToggle={() => toggleSection("info")}
            >
              <div className="space-y-3">
                <div>
                  <label htmlFor={`${uid}-name`} className="block text-xs text-black/45 mb-1">
                    Nombre
                  </label>
                  <input
                    id={`${uid}-name`}
                    type="text"
                    value={form.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full border border-black/20 px-3 py-2 text-sm focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label htmlFor={`${uid}-slug`} className="block text-xs text-black/45 mb-1">
                    Slug (auto-generado)
                  </label>
                  <input
                    id={`${uid}-slug`}
                    type="text"
                    value={form.slug}
                    onChange={(e) => updateForm("slug", e.target.value)}
                    className="w-full border border-black/20 px-3 py-2 text-xs font-mono focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label htmlFor={`${uid}-cat`} className="block text-xs text-black/45 mb-1">
                    Categoría
                  </label>
                  <select
                    id={`${uid}-cat`}
                    value={form.category}
                    onChange={(e) => updateForm("category", e.target.value)}
                    className="w-full border border-black/20 px-3 py-2 text-sm focus:outline-none focus:border-black bg-transparent"
                  >
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor={`${uid}-price`} className="block text-xs text-black/45 mb-1">
                      Precio ($)
                    </label>
                    <input
                      id={`${uid}-price`}
                      type="text"
                      inputMode="numeric"
                      value={form.price}
                      onChange={(e) => updateForm("price", formatPrice(e.target.value))}
                      className="w-full border border-black/20 px-3 py-2 text-sm focus:outline-none focus:border-black"
                      placeholder="16.990"
                    />
                  </div>
                  <div>
                    <label htmlFor={`${uid}-orig`} className="block text-xs text-black/45 mb-1">
                      Precio original ($)
                    </label>
                    <input
                      id={`${uid}-orig`}
                      type="text"
                      inputMode="numeric"
                      value={form.originalPrice}
                      onChange={(e) => updateForm("originalPrice", formatPrice(e.target.value))}
                      className="w-full border border-black/20 px-3 py-2 text-sm focus:outline-none focus:border-black"
                      placeholder="Opcional"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-5">
                  {(
                    [
                      ["isNew", "Nuevo"] as const,
                      ["isFeatured", "Destacado"] as const,
                      ["isActive", "Activo"] as const,
                    ]
                  ).map(([key, label]) => (
                    <label key={key} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form[key]}
                        onChange={(e) => updateForm(key, e.target.checked)}
                        className="w-4 h-4 accent-black"
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </div>
            </AccordionItem>

            {/* Descripción */}
            <AccordionItem
              title="Descripción y cuidados"
              open={openSections.has("description")}
              onToggle={() => toggleSection("description")}
            >
              <div className="space-y-3">
                <div>
                  <label htmlFor={`${uid}-desc`} className="block text-xs text-black/45 mb-1">
                    Descripción
                  </label>
                  <textarea
                    id={`${uid}-desc`}
                    value={form.description}
                    onChange={(e) => updateForm("description", e.target.value)}
                    rows={4}
                    className="w-full border border-black/20 px-3 py-2 text-sm focus:outline-none focus:border-black resize-none"
                  />
                </div>
                <div>
                  <label htmlFor={`${uid}-care`} className="block text-xs text-black/45 mb-1">
                    Instrucciones de cuidado (una por línea)
                  </label>
                  <textarea
                    id={`${uid}-care`}
                    value={form.care}
                    onChange={(e) => updateForm("care", e.target.value)}
                    rows={3}
                    placeholder={"Lavar a mano\nNo usar secadora"}
                    className="w-full border border-black/20 px-3 py-2 text-sm focus:outline-none focus:border-black resize-none"
                  />
                </div>
              </div>
            </AccordionItem>

            {/* Fotos */}
            <AccordionItem
              title="Fotos"
              open={openSections.has("photos")}
              onToggle={() => toggleSection("photos")}
            >
              <ImageUploader
                key={selectedId ?? "new"}
                photos={form.images}
                productSlug={form.slug}
                onChange={(urls) => updateForm("images", urls)}
              />
            </AccordionItem>

            {/* Variantes */}
            <AccordionItem
              title="Inventario y variantes"
              open={openSections.has("inventory")}
              onToggle={() => toggleSection("inventory")}
            >
              <div className="space-y-2">
                {/* Header */}
                <div className="hidden sm:grid grid-cols-[1fr_1fr_4rem_1.5rem] gap-1 text-xs text-black/35 pb-1 border-b border-black/10">
                  <span>Talla</span>
                  <span>Color</span>
                  <span>Stock</span>
                  <span />
                </div>

                {colors.length === 0 && (
                  <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 px-3 py-2">
                    No hay colores registrados. Crea colores en la sección{" "}
                    <strong>Colores</strong> primero.
                  </p>
                )}

                {form.variants.map((v, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-[1fr_1fr_4rem_1.5rem] gap-1 items-center"
                  >
                    {/* Talla */}
                    <input
                      type="text"
                      value={v.size}
                      onChange={(e) => {
                        const vs = [...form.variants];
                        vs[i] = { ...vs[i], size: e.target.value };
                        updateForm("variants", vs);
                      }}
                      placeholder="S"
                      className="border border-black/20 px-2 py-1.5 text-xs focus:outline-none focus:border-black"
                    />

                    {/* Color select */}
                    <div className="flex gap-1 items-center min-w-0">
                      {/* Swatch preview */}
                      <div
                        className="w-5 h-5 shrink-0 border border-black/20 rounded-sm"
                        style={{ backgroundColor: v.colorHex || "#ccc" }}
                      />
                      <select
                        value={v.color}
                        onChange={(e) => {
                          const chosen = colors.find((c) => c.name === e.target.value);
                          const vs = [...form.variants];
                          vs[i] = {
                            ...vs[i],
                            color: chosen?.name ?? "",
                            colorHex: chosen?.hex ?? "#000000",
                          };
                          updateForm("variants", vs);
                        }}
                        className="flex-1 border border-black/20 px-1 py-1.5 text-xs focus:outline-none focus:border-black bg-transparent min-w-0"
                      >
                        <option value="">— Color —</option>
                        {colors.map((c) => (
                          <option key={c.id} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Stock */}
                    <input
                      type="number"
                      value={v.stock}
                      onChange={(e) => {
                        const vs = [...form.variants];
                        vs[i] = { ...vs[i], stock: Number(e.target.value) };
                        updateForm("variants", vs);
                      }}
                      min={0}
                      className="border border-black/20 px-2 py-1.5 text-xs focus:outline-none focus:border-black"
                    />
                    <button
                      type="button"
                      onClick={() => updateForm("variants", form.variants.filter((_, j) => j !== i))}
                      className="text-black/25 hover:text-red-500 flex items-center justify-center"
                    >
                      <X size={13} />
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() =>
                    updateForm("variants", [
                      ...form.variants,
                      { size: "", color: "", colorHex: "#000000", stock: 0 },
                    ])
                  }
                  className="text-xs text-black/45 hover:text-black flex items-center gap-1 mt-1"
                >
                  <Plus size={12} /> Agregar variante
                </button>
              </div>
            </AccordionItem>
          </div>

          {/* Sticky save button */}
          <div className="shrink-0 border-t border-black/10 p-3 bg-[#EFECDA]">
            <button
              onClick={handleSave}
              disabled={saving || !hasChanges}
              className="w-full py-3 text-sm font-medium bg-black text-white hover:bg-black/80 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {saving && <Loader2 size={15} className="animate-spin" />}
              {selectedId === "new" ? "Crear producto" : "Actualizar producto"}
            </button>
          </div>
        </div>
      )}

      {/* Empty state on desktop */}
      {!selectedId && (
        <div className="hidden md:flex flex-1 items-center justify-center text-sm text-black/30">
          Selecciona un producto para editar
        </div>
      )}
    </div>
  );
}
