"use client";

import { useState } from "react";
import AdminNav from "./_components/AdminNav";
import DashboardSection from "./_components/DashboardSection";
import ProductsSection from "./_components/ProductsSection";
import OrdersSection from "./_components/OrdersSection";
import CatalogSection from "./_components/CatalogSection";
import SubscribersSection from "./_components/SubscribersSection";

export type AdminSection = "dashboard" | "products" | "orders" | "catalog" | "subscribers";

const SECTION_LABELS: Record<AdminSection, string> = {
  dashboard:   "Dashboard",
  products:    "Productos",
  orders:      "Pedidos",
  catalog:      "Cat\u00E1logo",
  subscribers: "Suscriptores",
};

const ADMIN_NAME = "Julieta";

export default function AdminPage() {
  const [section, setSection] = useState<AdminSection>("dashboard");

  return (
    <div
      className="fixed inset-0 z-[100] overflow-hidden bg-[#EFECDA] text-black"
      style={{ fontFamily: "var(--font-dm-sans, sans-serif)" }}
    >
      <div className="flex h-full">
        {/* Desktop sidebar */}
        <AdminNav
          section={section}
          onSectionChange={setSection}
          adminName={ADMIN_NAME}
        />

        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Desktop header */}
          <header className="hidden md:flex items-center justify-between px-6 py-3.5 border-b border-black/10 bg-[#EFECDA] shrink-0">
            <div className="text-xs text-black/40">
              Admin{" "}
              <span className="text-black/25">›</span>{" "}
              <span className="text-black/70 font-medium">
                {SECTION_LABELS[section]}
              </span>
            </div>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs border border-black/30 px-3 py-1.5 hover:bg-black hover:text-white hover:border-black transition-colors"
            >
              Ver tienda →
            </a>
          </header>

          {/* Mobile header (only shows store link) */}
          <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-black/10 shrink-0">
            <span
              className="text-lg font-medium"
              style={{ fontFamily: "var(--font-cormorant, serif)" }}
            >
              {SECTION_LABELS[section]}
            </span>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-black/40 hover:text-black"
            >
              Ver tienda →
            </a>
          </header>

          {/* Section content */}
          <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
            {section === "dashboard"   && <DashboardSection />}
            {section === "products"    && <ProductsSection />}
            {section === "orders"      && <OrdersSection />}
            {section === "catalog"      && <CatalogSection />}
            {section === "subscribers" && <SubscribersSection />}
          </main>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <AdminNav
        section={section}
        onSectionChange={setSection}
        adminName={ADMIN_NAME}
        mobile
      />
    </div>
  );
}

