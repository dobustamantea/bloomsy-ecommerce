"use client";

import { useEffect, useState } from "react";
import { Package, ShoppingBag, Mail, AlertTriangle, TrendingUp, Truck, CalendarDays } from "lucide-react";

interface DashboardData {
  totalProducts: number;
  pendingOrders: number;
  toDispatchOrders: number;
  shippedOrders: number;
  todayOrders: number;
  subscribers: number;
  totalRevenue: number;
  lowStockProducts: number;
}

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-black/10 ${className}`} />;
}

function formatCLP(amount: number) {
  return "$" + amount.toLocaleString("es-CL");
}

export default function DashboardSection() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const cards = data
    ? [
        {
          label: "Pedidos hoy",
          value: String(data.todayOrders),
          icon: CalendarDays,
          alert: false,
          alertColor: "",
          wide: false,
        },
        {
          label: "Pendientes de pago",
          value: String(data.pendingOrders),
          icon: ShoppingBag,
          alert: data.pendingOrders > 0,
          alertColor: "text-orange-600",
          wide: false,
        },
        {
          label: "Por despachar",
          value: String(data.toDispatchOrders),
          icon: Package,
          alert: data.toDispatchOrders > 0,
          alertColor: "text-yellow-600",
          wide: false,
        },
        {
          label: "En camino",
          value: String(data.shippedOrders),
          icon: Truck,
          alert: false,
          alertColor: "",
          wide: false,
        },
        {
          label: "Stock bajo",
          value: String(data.lowStockProducts),
          icon: AlertTriangle,
          alert: data.lowStockProducts > 0,
          alertColor: "text-red-600",
          wide: false,
        },
        {
          label: "Suscriptores",
          value: String(data.subscribers),
          icon: Mail,
          alert: false,
          alertColor: "",
          wide: false,
        },
        {
          label: "Ingresos totales",
          value: formatCLP(data.totalRevenue),
          icon: TrendingUp,
          alert: false,
          alertColor: "",
          wide: true,
        },
      ]
    : [];

  return (
    <div className="p-4 md:p-6">
      <h1
        className="text-2xl md:text-3xl font-medium mb-6"
        style={{ fontFamily: "var(--font-cormorant, serif)" }}
      >
        Dashboard
      </h1>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[...Array(7)].map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className={`bg-white border border-black/10 p-4 ${
                  card.wide ? "col-span-2 md:col-span-1" : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs text-black/45 mb-1">{card.label}</div>
                    <div
                      className={`text-2xl font-medium tabular-nums ${
                        card.alert ? card.alertColor : "text-black"
                      }`}
                    >
                      {card.value}
                    </div>
                  </div>
                  <Icon
                    size={20}
                    strokeWidth={1.5}
                    className={card.alert ? card.alertColor : "text-black/25"}
                  />
                </div>
                {card.alert && (
                  <div className={`text-xs mt-2 font-medium ${card.alertColor}`}>
                    Requiere atención
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
