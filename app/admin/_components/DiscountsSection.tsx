"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, ToggleLeft, ToggleRight, Tag } from "lucide-react";

interface DiscountCode {
  id: string;
  code: string;
  type: "PERCENTAGE" | "FIXED_AMOUNT";
  value: number;
  minOrderAmount: number | null;
  maxUses: number | null;
  usedCount: number;
  isActive: boolean;
  expiresAt: string | null;
  createdAt: string;
}

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-black/10 rounded ${className ?? ""}`} />;
}

function formatCLP(n: number) {
  return `$${n.toLocaleString("es-CL")}`;
}

function formatValue(code: DiscountCode) {
  return code.type === "PERCENTAGE" ? `${code.value}%` : formatCLP(code.value);
}

function isExpired(code: DiscountCode) {
  return !!code.expiresAt && new Date(code.expiresAt) < new Date();
}

function generateCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 8 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join("");
}

const defaultForm = {
  code: "",
  type: "PERCENTAGE" as "PERCENTAGE" | "FIXED_AMOUNT",
  value: "",
  minOrderAmount: "",
  maxUses: "",
  expiresAt: "",
};

export default function DiscountsSection() {
  const [codes, setCodes] = useState<DiscountCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(defaultForm);
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetch("/api/admin/discount-codes")
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d)) setCodes(d);
      })
      .finally(() => setLoading(false));
  }, []);

  async function toggleActive(code: DiscountCode) {
    await fetch(`/api/admin/discount-codes/${code.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !code.isActive }),
    });
    setCodes((prev) =>
      prev.map((c) => (c.id === code.id ? { ...c, isActive: !c.isActive } : c))
    );
  }

  async function deleteCode(id: string) {
    if (!confirm("Eliminar este codigo de descuento?")) return;
    await fetch(`/api/admin/discount-codes/${id}`, { method: "DELETE" });
    setCodes((prev) => prev.filter((c) => c.id !== id));
  }

  async function createCode(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    if (!form.code.trim() || !form.value) {
      setFormError("Codigo y valor son requeridos");
      return;
    }
    setCreating(true);
    const res = await fetch("/api/admin/discount-codes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: form.code.toUpperCase().trim(),
        type: form.type,
        value: Number(form.value),
        minOrderAmount: form.minOrderAmount ? Number(form.minOrderAmount) : null,
        maxUses: form.maxUses ? Number(form.maxUses) : null,
        expiresAt: form.expiresAt || null,
      }),
    });
    const data: DiscountCode & { error?: string } = await res.json();
    if (!res.ok) {
      setFormError(data.error ?? "Error al crear");
      setCreating(false);
      return;
    }
    setCodes((prev) => [data, ...prev]);
    setForm(defaultForm);
    setShowForm(false);
    setCreating(false);
  }

  const inputCls =
    "w-full border border-black/20 px-3 py-2 text-sm focus:outline-none focus:border-black bg-transparent";
  const labelCls =
    "block text-[10px] tracking-widest uppercase text-black/40 mb-1";

  return (
    <div className="p-4 md:p-6 max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2
            className="text-xl font-light"
            style={{ fontFamily: "var(--font-cormorant, serif)" }}
          >
            Codigos de descuento
          </h2>
          <p className="text-xs text-black/45 mt-0.5">
            Gestiona cupones y promociones
          </p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-1.5 bg-black text-white text-xs px-3 py-2 hover:bg-black/80 transition-colors"
        >
          <Plus size={14} />
          Nuevo codigo
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <form
          onSubmit={createCode}
          className="border border-black/15 p-4 space-y-4 bg-white"
        >
          <p className="text-xs font-medium tracking-wide uppercase text-black/50">
            Nuevo codigo
          </p>

          <div>
            <label className={labelCls}>Codigo</label>
            <div className="flex gap-2">
              <input
                value={form.code}
                onChange={(e) =>
                  setForm({ ...form, code: e.target.value.toUpperCase() })
                }
                placeholder="BIENVENIDA10"
                className={`${inputCls} flex-1 font-mono tracking-widest`}
              />
              <button
                type="button"
                onClick={() => setForm({ ...form, code: generateCode() })}
                className="text-xs border border-black/20 px-3 py-2 hover:bg-black/5 whitespace-nowrap"
              >
                Generar
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Tipo</label>
              <select
                value={form.type}
                onChange={(e) =>
                  setForm({
                    ...form,
                    type: e.target.value as "PERCENTAGE" | "FIXED_AMOUNT",
                  })
                }
                className={inputCls}
              >
                <option value="PERCENTAGE">Porcentaje (%)</option>
                <option value="FIXED_AMOUNT">Monto fijo ($)</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>
                {form.type === "PERCENTAGE" ? "Porcentaje" : "Monto (CLP)"}
              </label>
              <input
                type="number"
                value={form.value}
                onChange={(e) => setForm({ ...form, value: e.target.value })}
                placeholder={form.type === "PERCENTAGE" ? "10" : "5000"}
                min={1}
                max={form.type === "PERCENTAGE" ? 100 : undefined}
                className={inputCls}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Minimo de compra (opcional)</label>
              <input
                type="number"
                value={form.minOrderAmount}
                onChange={(e) =>
                  setForm({ ...form, minOrderAmount: e.target.value })
                }
                placeholder="50000"
                min={0}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Max. usos (vacio = ilimitado)</label>
              <input
                type="number"
                value={form.maxUses}
                onChange={(e) => setForm({ ...form, maxUses: e.target.value })}
                placeholder="ilimitado"
                min={1}
                className={inputCls}
              />
            </div>
          </div>

          <div>
            <label className={labelCls}>Vence (opcional)</label>
            <input
              type="datetime-local"
              value={form.expiresAt}
              onChange={(e) =>
                setForm({ ...form, expiresAt: e.target.value })
              }
              className={inputCls}
            />
          </div>

          {formError && (
            <p className="text-xs text-red-500">{formError}</p>
          )}

          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              disabled={creating}
              className="flex-1 bg-black text-white text-xs py-2.5 tracking-widest uppercase hover:bg-black/80 disabled:opacity-50"
            >
              {creating ? "Creando..." : "Crear codigo"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setFormError(null);
              }}
              className="px-4 text-xs border border-black/20 hover:bg-black/5"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* Table */}
      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-14" />
          ))}
        </div>
      ) : codes.length === 0 ? (
        <div className="text-center py-16 text-black/30">
          <Tag size={32} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">No hay codigos de descuento</p>
        </div>
      ) : (
        <div className="border border-black/10 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/10 bg-black/[0.02]">
                {["Codigo", "Descuento", "Min.", "Usos", "Vence", "Estado", ""].map(
                  (h, i) => (
                    <th
                      key={i}
                      className={`text-left text-[10px] tracking-widest uppercase text-black/40 px-4 py-3 font-normal ${
                        i === 2 || i === 4 ? "hidden md:table-cell" : ""
                      }`}
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {codes.map((c) => {
                const expired = isExpired(c);
                return (
                  <tr
                    key={c.id}
                    className={`border-b border-black/5 ${expired ? "opacity-45" : ""}`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-semibold tracking-widest">
                          {c.code}
                        </span>
                        {expired && (
                          <span className="text-[9px] bg-black/10 text-black/50 px-1.5 py-0.5 rounded uppercase tracking-wide">
                            Expirado
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium">{formatValue(c)}</td>
                    <td className="px-4 py-3 text-black/50 hidden md:table-cell">
                      {c.minOrderAmount ? formatCLP(c.minOrderAmount) : "-"}
                    </td>
                    <td className="px-4 py-3 text-black/60">
                      {c.usedCount}
                      {c.maxUses !== null ? `/${c.maxUses}` : ""}
                    </td>
                    <td className="px-4 py-3 text-black/50 text-xs hidden md:table-cell">
                      {c.expiresAt
                        ? new Date(c.expiresAt).toLocaleDateString("es-CL")
                        : "-"}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleActive(c)}
                        className="flex items-center gap-1.5 text-xs"
                      >
                        {c.isActive ? (
                          <>
                            <ToggleRight size={20} className="text-green-600" />
                            <span className="text-green-700 hidden md:inline">
                              Activo
                            </span>
                          </>
                        ) : (
                          <>
                            <ToggleLeft size={20} className="text-black/30" />
                            <span className="text-black/40 hidden md:inline">
                              Inactivo
                            </span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => deleteCode(c.id)}
                        className="text-black/20 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
