"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Download } from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────────────

interface OrderItem {
  id: string;
  name: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
}

interface Order {
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
  notes: string | null;
  createdAt: string;
  items: OrderItem[];
}

// ── Config ───────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  pending:   { label: "Pendiente",  className: "bg-gray-100 text-gray-600" },
  confirmed: { label: "Confirmado", className: "bg-blue-100 text-blue-700" },
  paid:      { label: "Pagado",     className: "bg-green-100 text-green-700" },
  preparing: { label: "Preparando", className: "bg-yellow-100 text-yellow-700" },
  shipped:   { label: "En envío",   className: "bg-orange-100 text-orange-700" },
  delivered: { label: "Entregado",  className: "bg-green-200 text-green-800" },
  cancelled: { label: "Cancelado",  className: "bg-red-100 text-red-700" },
};

const STATUS_FLOW = ["pending", "confirmed", "paid", "preparing", "shipped", "delivered"];

const FILTER_TABS = [
  { key: "all",        label: "Todos" },
  { key: "pending",    label: "Pendientes" },
  { key: "inprogress", label: "En proceso" },
  { key: "delivered",  label: "Entregados" },
  { key: "cancelled",  label: "Cancelados" },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatCLP(n: number) {
  return "$" + n.toLocaleString("es-CL");
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("es-CL", {
    day: "2-digit", month: "2-digit", year: "2-digit",
  });
}

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-black/10 ${className}`} />;
}

function filterOrders(orders: Order[], tab: string) {
  if (tab === "all")        return orders;
  if (tab === "pending")    return orders.filter((o) => o.status === "pending");
  if (tab === "inprogress") return orders.filter((o) =>
    ["confirmed", "paid", "preparing", "shipped"].includes(o.status)
  );
  if (tab === "delivered")  return orders.filter((o) => o.status === "delivered");
  if (tab === "cancelled")  return orders.filter((o) => o.status === "cancelled");
  return orders;
}

function isPickup(shippingType: string) {
  return shippingType === "pickup" || shippingType?.toLowerCase().includes("retiro");
}

function getStatusConfig(order: Order) {
  if (order.status === "shipped" && isPickup(order.shippingType)) {
    return { label: "Listo para retiro", className: "bg-blue-100 text-blue-700" };
  }
  return STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function OrdersSection() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [trackingInputId, setTrackingInputId] = useState<string | null>(null);
  const [trackingValue, setTrackingValue] = useState("");

  useEffect(() => {
    fetch("/api/admin/orders")
      .then((r) => r.json())
      .then((d) => { setOrders(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  async function updateStatus(id: string, status: string, trackingNumber?: string) {
    setUpdatingId(id);
    await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, ...(trackingNumber ? { trackingNumber } : {}) }),
    });
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status } : o));
    setUpdatingId(null);
    setTrackingInputId(null);
    setTrackingValue("");
  }

  function exportCSV() {
    const headers = ["#Orden", "Cliente", "Email", "Teléfono", "Estado", "Total", "Fecha"];
    const rows = orders.map((o) => [
      o.orderNumber,
      `"${o.customerName}"`,
      o.customerEmail,
      o.customerPhone,
      o.status,
      o.total,
      o.createdAt,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pedidos-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const filtered = filterOrders(orders, activeTab);

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h1
          className="text-2xl md:text-3xl font-medium"
          style={{ fontFamily: "var(--font-cormorant, serif)" }}
        >
          Pedidos
        </h1>
        <button
          onClick={exportCSV}
          className="flex items-center gap-1.5 text-sm border border-black px-3 py-1.5 hover:bg-black hover:text-white transition-colors"
        >
          <Download size={14} />
          CSV
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`shrink-0 px-3 py-1.5 text-xs transition-colors ${
              activeTab === tab.key
                ? "bg-black text-white"
                : "border border-black/20 hover:border-black"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-sm text-black/35 text-center py-12">
          No hay pedidos en esta categoría
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((order) => {
            const sc = getStatusConfig(order);
            const isExpanded = expandedId === order.id;
            const currentIdx = STATUS_FLOW.indexOf(order.status);
            const nextStatus =
              currentIdx >= 0 && currentIdx < STATUS_FLOW.length - 1
                ? STATUS_FLOW[currentIdx + 1]
                : null;
            const prevStatus = currentIdx > 0 ? STATUS_FLOW[currentIdx - 1] : null;

            return (
              <div key={order.id} className="border border-black/10 bg-white">
                {/* Row */}
                <div
                  className="flex items-center gap-3 p-3 cursor-pointer hover:bg-black/[0.02] transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : order.id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium">#{order.orderNumber}</span>
                      <span className={`text-xs px-1.5 py-0.5 ${sc.className}`}>
                        {sc.label}
                      </span>
                    </div>
                    <div className="text-xs text-black/45 truncate mt-0.5">
                      {order.customerName} · {formatDate(order.createdAt)}
                    </div>
                  </div>
                  <div className="text-sm font-medium shrink-0">{formatCLP(order.total)}</div>
                  {isExpanded ? (
                    <ChevronUp size={14} className="text-black/35 shrink-0" />
                  ) : (
                    <ChevronDown size={14} className="text-black/35 shrink-0" />
                  )}
                </div>

                {/* Expanded */}
                {isExpanded && (
                  <div className="border-t border-black/10 p-3 space-y-4">
                    {/* Customer details */}
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                      <div>
                        <div className="text-black/40">Email</div>
                        <div className="font-medium break-all">{order.customerEmail}</div>
                      </div>
                      <div>
                        <div className="text-black/40">Teléfono</div>
                        <div className="font-medium">{order.customerPhone}</div>
                      </div>
                      <div>
                        <div className="text-black/40">Tipo de envío</div>
                        <div className="font-medium">{order.shippingType}</div>
                      </div>
                      <div>
                        <div className="text-black/40">Pago</div>
                        <div className="font-medium">{order.paymentMethod}</div>
                      </div>
                      {order.address && (
                        <div className="col-span-2">
                          <div className="text-black/40">Dirección</div>
                          <div className="font-medium">
                            {order.address}, {order.city}, {order.region}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Items */}
                    <div className="border-t border-black/10 pt-3 space-y-1">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between text-xs">
                          <span className="text-black/70">
                            {item.name} · {item.size} · {item.color} × {item.quantity}
                          </span>
                          <span className="font-medium shrink-0 ml-2">
                            {formatCLP(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                      <div className="flex justify-between text-xs font-medium border-t border-black/10 pt-2 mt-1">
                        <span>Total</span>
                        <span>{formatCLP(order.total)}</span>
                      </div>
                    </div>

                    {/* Status actions */}
                    {order.status !== "delivered" && order.status !== "cancelled" && (
                      <div className="flex flex-wrap gap-2 border-t border-black/10 pt-3">
                        {prevStatus && (
                          <button
                            onClick={() => updateStatus(order.id, prevStatus)}
                            disabled={updatingId === order.id}
                            className="flex-1 text-xs border border-black/20 py-2 hover:border-black transition-colors disabled:opacity-40 whitespace-nowrap"
                          >
                            ← {STATUS_CONFIG[prevStatus]?.label}
                          </button>
                        )}
                        {nextStatus && nextStatus !== "shipped" && (
                          <button
                            onClick={() => updateStatus(order.id, nextStatus)}
                            disabled={updatingId === order.id}
                            className="flex-1 text-xs bg-black text-white py-2 hover:bg-black/80 transition-colors disabled:opacity-40 whitespace-nowrap"
                          >
                            {STATUS_CONFIG[nextStatus]?.label} →
                          </button>
                        )}
                        {nextStatus === "shipped" && isPickup(order.shippingType) && (
                          <button
                            onClick={() => updateStatus(order.id, "shipped")}
                            disabled={updatingId === order.id}
                            className="flex-1 text-xs bg-black text-white py-2 hover:bg-black/80 transition-colors disabled:opacity-40 whitespace-nowrap"
                          >
                            Listo para retiro →
                          </button>
                        )}
                        {nextStatus === "shipped" && !isPickup(order.shippingType) && (
                          trackingInputId === order.id ? (
                            <div className="flex-1 flex gap-2 items-center">
                              <input
                                type="text"
                                placeholder="Número de seguimiento Starken"
                                value={trackingValue}
                                onChange={(e) => setTrackingValue(e.target.value)}
                                className="flex-1 text-xs border border-black/30 px-2 py-2 outline-none focus:border-black"
                              />
                              <button
                                onClick={() => updateStatus(order.id, "shipped", trackingValue || undefined)}
                                disabled={updatingId === order.id}
                                className="text-xs bg-black text-white px-3 py-2 hover:bg-black/80 transition-colors disabled:opacity-40 whitespace-nowrap"
                              >
                                Confirmar
                              </button>
                              <button
                                onClick={() => { setTrackingInputId(null); setTrackingValue(""); }}
                                className="text-xs border border-black/20 px-2 py-2 hover:border-black transition-colors whitespace-nowrap"
                              >
                                ✕
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => { setTrackingInputId(order.id); setTrackingValue(""); }}
                              disabled={updatingId === order.id}
                              className="flex-1 text-xs bg-black text-white py-2 hover:bg-black/80 transition-colors disabled:opacity-40 whitespace-nowrap"
                            >
                              En envío →
                            </button>
                          )
                        )}
                        <button
                          onClick={() => {
                            if (confirm("¿Cancelar este pedido?"))
                              updateStatus(order.id, "cancelled");
                          }}
                          disabled={updatingId === order.id}
                          className="text-xs text-red-500 border border-red-200 px-3 py-2 hover:bg-red-50 transition-colors disabled:opacity-40"
                        >
                          Cancelar
                        </button>
                      </div>
                    )}

                    {order.notes && (
                      <div className="text-xs text-black/45 border-t border-black/10 pt-2">
                        Notas: {order.notes}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
