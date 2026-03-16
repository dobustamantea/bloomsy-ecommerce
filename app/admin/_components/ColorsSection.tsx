"use client";

import { useEffect, useState } from "react";
import { Plus, X, Check } from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────────────

interface Color {
  id: string;
  name: string;
  hex: string;
  isActive: boolean;
  createdAt: string;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function isValidHex(hex: string) {
  return /^#[0-9A-Fa-f]{6}$/.test(hex);
}

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-black/10 ${className}`} />;
}

const MIGRATION_SQL = `CREATE TABLE "Color" (
  "id"        TEXT         NOT NULL,
  "name"      TEXT         NOT NULL,
  "hex"       TEXT         NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Color_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Color_name_key" ON "Color"("name");`;

// ── Component ─────────────────────────────────────────────────────────────────

export default function ColorsSection() {
  const [colors, setColors] = useState<Color[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: "", hex: "" });
  const [newForm, setNewForm] = useState({ name: "", hex: "#000000" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/colors")
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d)) {
          setColors(d);
        } else {
          setError("Tabla Color no encontrada. Ejecuta el SQL de migración en Supabase.");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Error de conexión");
        setLoading(false);
      });
  }, []);

  async function createColor() {
    if (!newForm.name.trim() || !isValidHex(newForm.hex)) return;
    setSaving(true);
    const res = await fetch("/api/admin/colors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newForm),
    });
    if (res.ok) {
      const color: Color = await res.json();
      setColors((c) => [...c, color].sort((a, b) => a.name.localeCompare(b.name)));
      setNewForm({ name: "", hex: "#000000" });
    }
    setSaving(false);
  }

  async function updateColor(id: string) {
    if (!editForm.name.trim() || !isValidHex(editForm.hex)) return;
    const existing = colors.find((c) => c.id === id);
    const res = await fetch(`/api/admin/colors/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...editForm, isActive: existing?.isActive ?? true }),
    });
    if (res.ok) {
      setColors((c) =>
        c.map((x) => (x.id === id ? { ...x, name: editForm.name, hex: editForm.hex } : x))
      );
      setEditingId(null);
    }
  }

  async function deleteColor(id: string) {
    if (!confirm("¿Eliminar este color? Verifica que no esté en uso en variantes antes de eliminar."))
      return;
    const res = await fetch(`/api/admin/colors/${id}`, { method: "DELETE" });
    if (res.ok) setColors((c) => c.filter((x) => x.id !== id));
  }

  // ── Migration error state ────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="p-4 md:p-6">
        <h1
          className="text-2xl md:text-3xl font-medium mb-5"
          style={{ fontFamily: "var(--font-cormorant, serif)" }}
        >
          Colores
        </h1>
        <div className="border border-yellow-200 bg-yellow-50 p-4 text-sm">
          <p className="font-medium text-yellow-800 mb-2">{error}</p>
          <p className="text-yellow-700 text-xs mb-2">
            Corre este SQL en el editor SQL de Supabase:
          </p>
          <pre className="bg-white border border-yellow-100 p-3 text-xs font-mono overflow-x-auto text-gray-700 whitespace-pre">
            {MIGRATION_SQL}
          </pre>
          <p className="text-yellow-600 text-xs mt-2">
            Luego recarga la página.
          </p>
        </div>
      </div>
    );
  }

  // ── Main ─────────────────────────────────────────────────────────────────────
  return (
    <div className="p-4 md:p-6">
      <h1
        className="text-2xl md:text-3xl font-medium mb-6"
        style={{ fontFamily: "var(--font-cormorant, serif)" }}
      >
        Colores
      </h1>

      {/* Create form */}
      <div className="border border-black/10 bg-white p-4 mb-6">
        <h2 className="text-sm font-medium mb-3">Nuevo color</h2>
        <div className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="block text-xs text-black/45 mb-1">Nombre</label>
            <input
              type="text"
              value={newForm.name}
              onChange={(e) => setNewForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Negro"
              className="border border-black/20 px-3 py-2 text-sm focus:outline-none focus:border-black w-40"
            />
          </div>
          <div>
            <label className="block text-xs text-black/45 mb-1">Color</label>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={newForm.hex}
                onChange={(e) => setNewForm((f) => ({ ...f, hex: e.target.value }))}
                className="w-10 h-9 cursor-pointer border border-black/20 p-0.5"
              />
              <input
                type="text"
                value={newForm.hex}
                onChange={(e) => setNewForm((f) => ({ ...f, hex: e.target.value }))}
                maxLength={7}
                placeholder="#000000"
                className="border border-black/20 px-2 py-2 text-sm font-mono w-24 focus:outline-none focus:border-black"
              />
            </div>
          </div>
          <button
            onClick={createColor}
            disabled={saving || !newForm.name.trim() || !isValidHex(newForm.hex)}
            className="flex items-center gap-1.5 px-4 py-2 bg-black text-white text-sm hover:bg-black/80 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Plus size={14} /> Agregar
          </button>
        </div>
        {newForm.hex && !isValidHex(newForm.hex) && (
          <p className="text-xs text-red-500 mt-1.5">HEX inválido (ej: #FF0000)</p>
        )}
      </div>

      {/* Color grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      ) : colors.length === 0 ? (
        <div className="text-sm text-black/35 text-center py-12">
          No hay colores aún. Agrega el primero.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {colors.map((color) => (
            <div key={color.id} className="border border-black/10 bg-white overflow-hidden">
              {editingId === color.id ? (
                /* Edit inline */
                <div className="p-3 space-y-2">
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                    className="w-full border border-black/20 px-2 py-1.5 text-xs focus:outline-none focus:border-black"
                  />
                  <div className="flex gap-1.5 items-center">
                    <input
                      type="color"
                      value={editForm.hex}
                      onChange={(e) => setEditForm((f) => ({ ...f, hex: e.target.value }))}
                      className="w-7 h-7 cursor-pointer border border-black/20 p-0 shrink-0"
                    />
                    <input
                      type="text"
                      value={editForm.hex}
                      onChange={(e) => setEditForm((f) => ({ ...f, hex: e.target.value }))}
                      maxLength={7}
                      className="flex-1 border border-black/20 px-1.5 py-1.5 text-xs font-mono focus:outline-none focus:border-black"
                    />
                  </div>
                  {!isValidHex(editForm.hex) && (
                    <p className="text-xs text-red-500">HEX inválido</p>
                  )}
                  <div className="flex gap-1">
                    <button
                      onClick={() => updateColor(color.id)}
                      disabled={!isValidHex(editForm.hex)}
                      className="flex-1 text-xs py-1.5 bg-black text-white hover:bg-black/80 transition-colors flex items-center justify-center gap-1 disabled:opacity-40"
                    >
                      <Check size={10} /> Guardar
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-2.5 text-xs border border-black/20 hover:border-black transition-colors"
                    >
                      <X size={10} />
                    </button>
                  </div>
                </div>
              ) : (
                /* Swatch display */
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    setEditingId(color.id);
                    setEditForm({ name: color.name, hex: color.hex });
                  }}
                >
                  <div
                    className="h-14 w-full"
                    style={{ backgroundColor: color.hex }}
                  />
                  <div className="p-2 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-medium truncate">{color.name}</div>
                      <div className="text-xs text-black/40 font-mono">{color.hex}</div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteColor(color.id);
                      }}
                      className="text-black/20 hover:text-red-500 transition-colors p-0.5"
                    >
                      <X size={13} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
