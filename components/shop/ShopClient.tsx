"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import FilterSidebar, { FilterState } from "./FilterSidebar";
import MobileFiltersSheet from "./MobileFiltersSheet";
import { MIN_PRICE, MAX_PRICE } from "@/data/products";
import type { Product, SortOption } from "@/types";
import Link from "next/link";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Más nuevo" },
  { value: "price-asc", label: "Precio: menor a mayor" },
  { value: "price-desc", label: "Precio: mayor a menor" },
  { value: "best-seller", label: "Más vendido" },
];

const defaultFilters: FilterState = {
  categories: [],
  sizes: [],
  colors: [],
  minPrice: MIN_PRICE,
  maxPrice: MAX_PRICE,
};

interface ShopClientProps {
  products: Product[];
  initialCategory?: string;
}

export default function ShopClient({ products, initialCategory }: ShopClientProps) {
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<FilterState>({
    ...defaultFilters,
    categories: initialCategory ? [initialCategory] : [],
  });
  const [sort, setSort] = useState<SortOption>("newest");

  // Sincronizar filtro de categoría cuando cambia la URL (navegación cliente)
  useEffect(() => {
    const categoria = searchParams.get("categoria") ?? undefined;
    setFilters((prev) => ({
      ...prev,
      categories: categoria ? [categoria] : [],
    }));
  }, [searchParams]);
  const availableColors = useMemo(() => {
    const palette = new Map<string, Product["colors"][number]>();

    for (const product of products) {
      for (const color of product.colors) {
        if (!palette.has(color.name)) {
          palette.set(color.name, color);
        }
      }
    }

    return Array.from(palette.values()).sort((a, b) =>
      a.name.localeCompare(b.name, "es")
    );
  }, [products]);

  const filtered = useMemo(() => {
    let list = [...products];

    if (filters.categories.length > 0) {
      list = list.filter((p) => filters.categories.includes(p.category));
    }
    if (filters.sizes.length > 0) {
      list = list.filter((p) => filters.sizes.some((s) => p.sizes.includes(s)));
    }
    if (filters.colors.length > 0) {
      list = list.filter((p) =>
        filters.colors.some((c) => p.colors.some((pc) => pc.name === c))
      );
    }
    list = list.filter(
      (p) => p.price >= filters.minPrice && p.price <= filters.maxPrice
    );

    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "best-seller":
        list.sort(
          (a, b) =>
            b.reviews.reduce((s, r) => s + r.rating, 0) / (b.reviews.length || 1) -
            a.reviews.reduce((s, r) => s + r.rating, 0) / (a.reviews.length || 1)
        );
        break;
      case "newest":
      default:
        list.sort((a, b) => (a.isNew === b.isNew ? 0 : a.isNew ? -1 : 1));
        break;
    }

    return list;
  }, [filters, sort]);

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-10">
      {/* Page header */}
      <div className="mb-8">
        <p className="text-[10px] tracking-[0.3em] uppercase text-black/40 mb-2">Tienda</p>
        <h1 className="font-display text-4xl md:text-5xl font-light leading-none">
          Todo el catálogo
        </h1>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6 gap-4">
        <p className="text-xs text-black/40 hidden md:block">
          {filtered.length} producto{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}
        </p>

        {/* Mobile: filters button */}
        <div className="md:hidden">
          <MobileFiltersSheet
            filters={filters}
            onChange={setFilters}
            resultCount={filtered.length}
            availableColors={availableColors}
          />
        </div>

        {/* Sort */}
        <div className="relative ml-auto">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="appearance-none bg-transparent border border-black/20 text-[11px] tracking-widest uppercase pl-3 pr-8 py-2 focus:outline-none focus:border-bloomsy-black cursor-pointer"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={12}
            className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-black/50"
          />
        </div>
      </div>

      <div className="flex gap-10">
        {/* Desktop sidebar */}
        <div className="hidden md:block w-52 flex-shrink-0">
          <FilterSidebar
            filters={filters}
            onChange={setFilters}
            availableColors={availableColors}
          />
        </div>

        {/* Grid */}
        <div className="flex-1">
          <p className="text-xs text-black/40 mb-4 md:hidden">
            {filtered.length} producto{filtered.length !== 1 ? "s" : ""}
          </p>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="text-black/40 text-sm mb-4">
                No encontramos productos con esos filtros.
              </p>
              <Link
                href="/shop"
                onClick={() => setFilters(defaultFilters)}
                className="text-[11px] tracking-widest uppercase border border-bloomsy-black px-6 py-2 hover:bg-bloomsy-black hover:text-bloomsy-cream transition-colors"
              >
                Limpiar filtros
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-8">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
