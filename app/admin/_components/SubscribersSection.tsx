"use client";

import { useEffect, useState } from "react";
import { Search, Download, Trash2 } from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────────────

interface Subscriber {
  id: string;
  email: string;
  createdAt: string;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("es-CL", {
    day: "2-digit", month: "2-digit", year: "2-digit",
  });
}

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-black/10 ${className}`} />;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function SubscribersSection() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/admin/subscribers")
      .then((r) => r.json())
      .then((d) => { setSubscribers(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = subscribers.filter((s) =>
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  async function deleteSubscriber(id: string, email: string) {
    if (!confirm(`¿Eliminar a ${email} de los suscriptores?`)) return;
    const res = await fetch(`/api/admin/subscribers/${id}`, { method: "DELETE" });
    if (res.ok) setSubscribers((s) => s.filter((x) => x.id !== id));
  }

  function exportCSV() {
    const rows: (string | number)[][] = [
      ["Email", "Fecha"],
      ...filtered.map((s) => [s.email, formatDate(s.createdAt)]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `suscriptores-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1
            className="text-2xl md:text-3xl font-medium"
            style={{ fontFamily: "var(--font-cormorant, serif)" }}
          >
            Suscriptores
          </h1>
          {!loading && (
            <p className="text-sm text-black/45 mt-0.5">
              {subscribers.length} {subscribers.length === 1 ? "suscriptor" : "suscriptores"} en total
            </p>
          )}
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-1.5 text-sm border border-black px-3 py-1.5 hover:bg-black hover:text-white transition-colors"
        >
          <Download size={14} />
          CSV
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4 mt-4">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/35" />
        <input
          type="text"
          placeholder="Buscar por email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-sm border border-black/20 bg-transparent focus:outline-none focus:border-black"
        />
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-2">
          {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-12" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-sm text-black/35 text-center py-12">
          {search ? "No se encontraron resultados" : "No hay suscriptores aún"}
        </div>
      ) : (
        <div className="border border-black/10 bg-white divide-y divide-black/5">
          {filtered.map((s) => (
            <div key={s.id} className="flex items-center justify-between px-4 py-3">
              <div className="min-w-0 mr-3">
                <div className="text-sm font-medium truncate">{s.email}</div>
                <div className="text-xs text-black/40">{formatDate(s.createdAt)}</div>
              </div>
              <button
                onClick={() => deleteSubscriber(s.id, s.email)}
                className="text-black/20 hover:text-red-500 transition-colors p-1 shrink-0"
                aria-label="Eliminar suscriptor"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
