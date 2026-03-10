"use client";

import { cn } from "@/lib/utils";
import { formatCLP } from "@/lib/utils";
import { X } from "lucide-react";
import {
  CATEGORIES,
  ALL_SIZES,
  CURVY_SIZES,
  ALL_COLORS,
  MIN_PRICE,
  MAX_PRICE,
} from "@/data/products";

export interface FilterState {
  categories: string[];
  sizes: string[];
  colors: string[];
  minPrice: number;
  maxPrice: number;
}

interface FilterSidebarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

function needsBorder(hex: string) {
  const lightColors = ["#ffffff", "#f5f5dc", "#efecda", "#f0ead6", "#faf0e6", "#fffaf0", "#fff8dc", "#faebd7", "#f5f0eb"];
  return lightColors.some((c) => c.toLowerCase() === hex.toLowerCase());
}

export default function FilterSidebar({ filters, onChange }: FilterSidebarProps) {
  function toggleCategory(cat: string) {
    const next = filters.categories.includes(cat)
      ? filters.categories.filter((c) => c !== cat)
      : [...filters.categories, cat];
    onChange({ ...filters, categories: next });
  }

  function toggleSize(size: string) {
    const next = filters.sizes.includes(size)
      ? filters.sizes.filter((s) => s !== size)
      : [...filters.sizes, size];
    onChange({ ...filters, sizes: next });
  }

  function toggleColor(colorName: string) {
    const next = filters.colors.includes(colorName)
      ? filters.colors.filter((c) => c !== colorName)
      : [...filters.colors, colorName];
    onChange({ ...filters, colors: next });
  }

  const activeCount =
    filters.categories.length +
    filters.sizes.length +
    filters.colors.length +
    (filters.minPrice > MIN_PRICE || filters.maxPrice < MAX_PRICE ? 1 : 0);

  function clearAll() {
    onChange({ categories: [], sizes: [], colors: [], minPrice: MIN_PRICE, maxPrice: MAX_PRICE });
  }

  return (
    <aside className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-[10px] tracking-widest uppercase text-black/40">Filtros</p>
        {activeCount > 0 && (
          <button
            onClick={clearAll}
            className="text-[10px] tracking-widest uppercase text-black/50 hover:text-black transition-colors flex items-center gap-1"
          >
            <X size={10} /> Limpiar todo
          </button>
        )}
      </div>

      {/* Active chips */}
      {activeCount > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {filters.categories.map((cat) => {
            const label = CATEGORIES.find((c) => c.value === cat)?.label ?? cat;
            return (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className="flex items-center gap-1 bg-bloomsy-black text-bloomsy-cream text-[9px] tracking-widest uppercase px-2 py-1"
              >
                {label} <X size={8} />
              </button>
            );
          })}
          {filters.sizes.map((size) => (
            <button
              key={size}
              onClick={() => toggleSize(size)}
              className="flex items-center gap-1 bg-bloomsy-black text-bloomsy-cream text-[9px] tracking-widest uppercase px-2 py-1"
            >
              {size} <X size={8} />
            </button>
          ))}
          {filters.colors.map((colorName) => {
            const color = ALL_COLORS.find((c) => c.name === colorName);
            return (
              <button
                key={colorName}
                onClick={() => toggleColor(colorName)}
                className="flex items-center gap-1 bg-bloomsy-black text-bloomsy-cream text-[9px] tracking-widest uppercase px-2 py-1"
              >
                {color && (
                  <span
                    className="block w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: color.hex }}
                  />
                )}
                {colorName} <X size={8} />
              </button>
            );
          })}
          {(filters.minPrice > MIN_PRICE || filters.maxPrice < MAX_PRICE) && (
            <button
              onClick={() => onChange({ ...filters, minPrice: MIN_PRICE, maxPrice: MAX_PRICE })}
              className="flex items-center gap-1 bg-bloomsy-black text-bloomsy-cream text-[9px] tracking-widest uppercase px-2 py-1"
            >
              {formatCLP(filters.minPrice)} – {formatCLP(filters.maxPrice)} <X size={8} />
            </button>
          )}
        </div>
      )}

      {/* Category */}
      <div>
        <p className="text-[10px] tracking-widest uppercase text-black/40 mb-3">Categoría</p>
        <ul className="space-y-2">
          {CATEGORIES.map(({ value, label }) => (
            <li key={value}>
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.categories.includes(value)}
                  onChange={() => toggleCategory(value)}
                  className="sr-only"
                />
                <span
                  className={cn(
                    "w-3.5 h-3.5 border flex-shrink-0 flex items-center justify-center transition-colors",
                    filters.categories.includes(value)
                      ? "bg-bloomsy-black border-bloomsy-black"
                      : "border-black/30 group-hover:border-bloomsy-black"
                  )}
                >
                  {filters.categories.includes(value) && (
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                      <path d="M1 4L3 6L7 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  )}
                </span>
                <span className="text-sm text-black/70 group-hover:text-black transition-colors capitalize">
                  {label}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* Size */}
      <div>
        <p className="text-[10px] tracking-widest uppercase text-black/40 mb-3">Talla</p>
        <div className="flex flex-wrap gap-1.5">
          {ALL_SIZES.map((size) => {
            const isCurvy = CURVY_SIZES.includes(size);
            const active = filters.sizes.includes(size);
            return (
              <button
                key={size}
                onClick={() => toggleSize(size)}
                className={cn(
                  "text-[11px] px-2.5 py-1 border transition-colors",
                  active
                    ? "bg-bloomsy-black text-bloomsy-cream border-bloomsy-black"
                    : isCurvy
                    ? "border-bloomsy-black text-bloomsy-black hover:bg-bloomsy-black hover:text-bloomsy-cream"
                    : "border-black/20 text-black/60 hover:border-bloomsy-black hover:text-bloomsy-black"
                )}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Color */}
      <div>
        <p className="text-[10px] tracking-widest uppercase text-black/40 mb-3">Color</p>
        <div className="flex flex-wrap gap-2">
          {ALL_COLORS.map((color) => {
            const active = filters.colors.includes(color.name);
            return (
              <button
                key={color.name}
                onClick={() => toggleColor(color.name)}
                title={color.name}
                aria-label={color.name}
                className={cn(
                  "w-6 h-6 rounded-full transition-transform hover:scale-110",
                  active && "ring-2 ring-offset-1 ring-bloomsy-black",
                  needsBorder(color.hex) && "ring-1 ring-black/20"
                )}
                style={{ backgroundColor: color.hex }}
              />
            );
          })}
        </div>
      </div>

      {/* Price range */}
      <div>
        <p className="text-[10px] tracking-widest uppercase text-black/40 mb-3">Precio</p>
        <div className="space-y-3">
          <div className="flex justify-between text-xs text-black/50">
            <span>{formatCLP(filters.minPrice)}</span>
            <span>{formatCLP(filters.maxPrice)}</span>
          </div>
          <input
            type="range"
            min={MIN_PRICE}
            max={MAX_PRICE}
            step={1000}
            value={filters.maxPrice}
            onChange={(e) => onChange({ ...filters, maxPrice: Number(e.target.value) })}
            className="w-full accent-bloomsy-black"
          />
        </div>
      </div>
    </aside>
  );
}
