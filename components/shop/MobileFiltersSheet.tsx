"use client";

import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import FilterSidebar, { FilterState } from "./FilterSidebar";

interface MobileFiltersSheetProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  resultCount: number;
}

export default function MobileFiltersSheet({
  filters,
  onChange,
  resultCount,
}: MobileFiltersSheetProps) {
  const [open, setOpen] = useState(false);

  const activeCount =
    filters.categories.length + filters.sizes.length + filters.colors.length;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 text-[11px] tracking-widest uppercase border border-bloomsy-black px-4 py-2 hover:bg-bloomsy-black hover:text-bloomsy-cream transition-colors"
      >
        <SlidersHorizontal size={13} />
        Filtros
        {activeCount > 0 && (
          <span className="bg-bloomsy-black text-bloomsy-cream text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
            {activeCount}
          </span>
        )}
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sheet */}
      <div
        className={`fixed inset-x-0 bottom-0 z-50 bg-bloomsy-cream rounded-t-2xl transition-transform duration-300 ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ maxHeight: "85dvh", overflowY: "auto" }}
      >
        {/* Handle */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-black/10">
          <p className="text-[10px] tracking-widest uppercase">Filtros</p>
          <button onClick={() => setOpen(false)} aria-label="Cerrar filtros">
            <X size={16} />
          </button>
        </div>

        <div className="px-5 py-6">
          <FilterSidebar filters={filters} onChange={onChange} />
        </div>

        {/* CTA */}
        <div className="sticky bottom-0 bg-bloomsy-cream border-t border-black/10 px-5 py-4">
          <button
            onClick={() => setOpen(false)}
            className="w-full bg-bloomsy-black text-bloomsy-cream text-[11px] tracking-widest uppercase py-3"
          >
            Ver {resultCount} productos
          </button>
        </div>
      </div>
    </>
  );
}
