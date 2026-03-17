"use client";

import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Palette,
  Mail,
} from "lucide-react";
import type { AdminSection } from "../page";

const NAV_ITEMS: { key: AdminSection; label: string; icon: React.ElementType }[] = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "products", label: "Productos", icon: Package },
  { key: "orders", label: "Pedidos", icon: ShoppingBag },
  { key: "catalog", label: "Cat\u00E1logo", icon: Palette },
  { key: "subscribers", label: "Suscriptores", icon: Mail },
];

interface Props {
  section: AdminSection;
  onSectionChange: (s: AdminSection) => void;
  adminName: string;
  mobile?: boolean;
}

export default function AdminNav({ section, onSectionChange, adminName, mobile }: Props) {
  if (mobile) {
    return (
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-black/10 bg-[#EFECDA]">
        <div className="flex">
          {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => onSectionChange(key)}
              className={`flex-1 flex flex-col items-center py-2.5 gap-1 text-[10px] transition-colors ${
                section === key ? "text-black" : "text-black/35"
              }`}
            >
              <Icon size={20} strokeWidth={section === key ? 2 : 1.5} />
              <span className="leading-none">{label.split(" ")[0]}</span>
            </button>
          ))}
        </div>
      </nav>
    );
  }

  return (
    <aside className="hidden md:flex flex-col w-60 shrink-0 border-r border-black/10 bg-[#EFECDA]">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-black/10">
        <div
          className="text-xl font-medium tracking-wide"
          style={{ fontFamily: "var(--font-cormorant, serif)" }}
        >
          Bloomsy
        </div>
        <div className="text-xs text-black/45 mt-0.5">
          Panel Admin · {adminName}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 overflow-y-auto">
        {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => onSectionChange(key)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 mb-0.5 text-sm transition-colors ${
              section === key
                ? "bg-black text-white"
                : "text-black/55 hover:text-black hover:bg-black/5"
            }`}
          >
            <Icon size={17} strokeWidth={1.5} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      {/* Footer link */}
      <div className="px-6 py-4 border-t border-black/10">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-black/40 hover:text-black transition-colors"
        >
          ← Ver tienda
        </a>
      </div>
    </aside>
  );
}
