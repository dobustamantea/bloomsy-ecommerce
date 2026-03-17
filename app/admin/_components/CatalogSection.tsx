"use client";

import { useEffect, useState } from "react";
import { Plus, X, Check } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Color {
  id: string;
  name: string;
  hex: string;
  isActive: boolean;
  createdAt: string;
}

interface Size {
  id: string;
  name: string;
  sortOrder: number;
  createdAt: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function isValidHex(hex: string) {
  return /^#[0-9A-Fa-f]{6}$/.test(hex);
}

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-black/10 ${className}`} />;
}

// ── Colors sub-panel ──────────────────────────────────────────────────────────

function ColorsPanel() {
  const [colors, setColors] = useState<Color[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: "", hex: "" });
  const [newForm, setNewForm] = useState({ name: "", hex: "#000000" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/colors")
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d)) setColors(d); })
      .finally(() => setLoading(false));
  }, []);

  function startEdit(c: Color) {
    setEditingId(c.id);
    setEditForm({ name: c.name, hex: c.hex });
  }

  async function saveEdit() {
    if (!editingId || !isValidHex(editForm.hex)) return;
    setSaving(true);
    const existing = colors.find((c) => c.id === editingId);
    await fetch(`/api/admin/colors/${editingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...editForm, isActive: existing?.isActive ?? true }),
    });
    setColors((prev) => prev.map((c) => c.id === editingId ? { ...c, ...editForm } : c));
    setEditingId(null);
    setSaving(false);
  }

  async function deleteColor(id: string) {
    if (!confirm("¿Eliminar este color?")) return;
    await fetch(`/api/admin/colors/${id}`, { method: "DELETE" });
    setColors((prev) => prev.filter((c) => c.id !== id));
  }

  async function createColor() {
    if (!newForm.name.trim() || !isValidHex(newForm.hex)) return;
    setSaving(true);
    const res = await fetch("/api/admin/colors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newForm),
    });
    const created: Color = await res.json();
    setColors((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)));
    setNewForm({ name: "", hex: "#000000" });
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-2">
        {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-10 rounded" />)}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {colors.map((c) =>
          editingId === c.id ? (
            <div key={c.id} className="border border-black/30 p-2 flex gap-2 items-center">
              <input
                type="color"
                value={editForm.hex}
                onChange={(e) => setEditForm({ ...editForm, hex: e.target.value })}
                className="w-8 h-8 cursor-pointer border-0 p-0 bg-transparent shrink-0"
              />
              <input
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="flex-1 min-w-0 border-b border-black/30 text-sm bg-transparent focus:outline-none focus:border-black px-1"
                placeholder="Nombre"
              />
              <button onClick={saveEdit} disabled={saving} className="text-black hover:opacity-60">
                <Check size={14} />
              </button>
              <button onClick={() => setEditingId(null)} className="text-black/40 hover:opacity-60">
                <X size={14} />
              </button>
            </div>
          ) : (
            <button
              key={c.id}
              onClick={() => startEdit(c)}
              className="border border-black/10 p-2 flex items-center gap-2 hover:border-black/30 transition-colors group text-left"
            >
              <div className="w-7 h-7 shrink-0 border border-black/15" style={{ backgroundColor: c.hex }} />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium truncate">{c.name}</p>
                <p className="text-[10px] text-black/40 font-mono">{c.hex}</p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); deleteColor(c.id); }}
                className="opacity-0 group-hover:opacity-100 text-black/25 hover:text-red-500 transition-opacity"
              >
                <X size={12} />
              </button>
            </button>
          )
        )}
      </div>

      <div className="border border-dashed border-black/20 p-2 flex gap-2 items-center">
        <input
          type="color"
          value={newForm.hex}
          onChange={(e) => setNewForm({ ...newForm, hex: e.target.value })}
          className="w-8 h-8 cursor-pointer border-0 p-0 bg-transparent shrink-0"
        />
        <input
          value={newForm.name}
          onChange={(e) => setNewForm({ ...newForm, name: e.target.value })}
          onKeyDown={(e) => e.key === "Enter" && createColor()}
          placeholder="Nuevo color…"
          className="flex-1 bg-transparent text-sm focus:outline-none"
        />
        <button
          onClick={createColor}
          disabled={saving || !newForm.name.trim()}
          className="text-black/40 hover:text-black disabled:opacity-30"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
}

// ── Sizes sub-panel ───────────────────────────────────────────────────────────

function SizesPanel() {
  const [sizes, setSizes] = useState<Size[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [newName, setNewName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/sizes")
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d)) setSizes(d); })
      .finally(() => setLoading(false));
  }, []);

  async function saveEdit(id: string) {
    if (!editName.trim()) return;
    setSaving(true);
    await fetch(`/api/admin/sizes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editName.trim() }),
    });
    setSizes((prev) => prev.map((s) => s.id === id ? { ...s, name: editName.trim() } : s));
    setEditingId(null);
    setSaving(false);
  }

  async function deleteSize(id: string) {
    if (!confirm("¿Eliminar esta talla?")) return;
    await fetch(`/api/admin/sizes/${id}`, { method: "DELETE" });
    setSizes((prev) => prev.filter((s) => s.id !== id));
  }

  async function createSize() {
    if (!newName.trim()) return;
    setSaving(true);
    const res = await fetch("/api/admin/sizes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName.trim() }),
    });
    const created: Size = await res.json();
    setSizes((prev) => [...prev, created]);
    setNewName("");
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-9 w-14 rounded" />)}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {sizes.map((s) =>
          editingId === s.id ? (
            <div key={s.id} className="flex items-center border border-black/30 px-2 gap-1">
              <input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && saveEdit(s.id)}
                className="w-16 bg-transparent text-sm focus:outline-none py-1.5"
                autoFocus
              />
              <button onClick={() => saveEdit(s.id)} disabled={saving} className="text-black hover:opacity-60">
                <Check size={13} />
              </button>
              <button onClick={() => setEditingId(null)} className="text-black/40 hover:opacity-60">
                <X size={13} />
              </button>
            </div>
          ) : (
            <button
              key={s.id}
              onClick={() => { setEditingId(s.id); setEditName(s.name); }}
              className="group flex items-center gap-1 border border-black/15 px-3 py-1.5 text-sm hover:border-black/40 transition-colors"
            >
              <span>{s.name}</span>
              <button
                onClick={(e) => { e.stopPropagation(); deleteSize(s.id); }}
                className="opacity-0 group-hover:opacity-100 text-black/25 hover:text-red-500 transition-opacity ml-1"
              >
                <X size={11} />
              </button>
            </button>
          )
        )}

        <div className="flex items-center border border-dashed border-black/20 px-2 gap-1">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && createSize()}
            placeholder="Nueva…"
            className="w-20 bg-transparent text-sm focus:outline-none py-1.5 placeholder:text-black/30"
          />
          <button
            onClick={createSize}
            disabled={saving || !newName.trim()}
            className="text-black/40 hover:text-black disabled:opacity-30"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>
      <p className="text-[11px] text-black/35">Toca una talla para editarla · X para eliminarla</p>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function CatalogSection() {
  return (
    <div className="p-4 md:p-6 space-y-8 max-w-2xl">
      <section>
        <h2 className="text-xl font-light mb-1" style={{ fontFamily: "var(--font-cormorant, serif)" }}>
          Tallas
        </h2>
        <p className="text-xs text-black/45 mb-4">
          Tallas disponibles para seleccionar al crear variantes de productos.
        </p>
        <SizesPanel />
      </section>

      <div className="border-t border-black/10" />

      <section>
        <h2 className="text-xl font-light mb-1" style={{ fontFamily: "var(--font-cormorant, serif)" }}>
          Colores
        </h2>
        <p className="text-xs text-black/45 mb-4">
          Toca un color para editar nombre o valor HEX.
        </p>
        <ColorsPanel />
      </section>
    </div>
  );
}
