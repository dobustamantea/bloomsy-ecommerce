"use client";

import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Palette,
  Mail,
  Tag,
} from "lucide-react";
import Image from "next/image";
import type { AdminSection } from "../page";

const LOGO_SRC =
  "https://ikuacwkjcheyjlitfvit.supabase.co/storage/v1/object/public/product-images/assets/Bloomsy%20SoloW.png";

const NAV_ITEMS: {
  key: AdminSection;
  label: string;
  icon: React.ElementType;
}[] = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "products", label: "Productos", icon: Package },
  { key: "orders", label: "Pedidos", icon: ShoppingBag },
  { key: "catalog", label: "Catalogo", icon: Palette },
  { key: "discounts", label: "Descuentos", icon: Tag },
  { key: "subscribers", label: "Suscriptores", icon: Mail },
];

interface Props {
  section: AdminSection;
  onSectionChange: (s: AdminSection) => void;
  adminName: string;
  mobile?: boolean;
}

export default function AdminNav({
  section,
  onSectionChange,
  adminName,
  mobile,
}: Props) {
  if (mobile) {
    return (
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-black/10 bg-[#EFECDA]">
        <div className="flex">
          {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => onSectionChange(key)}
              className={`flex-1 flex flex-col items-center py-2 gap-0.5 text-[9px] transition-colors ${
                section === key ? "text-black" : "text-black/35"
              }`}
            >
              <Icon
                size={18}
                strokeWidth={section === key ? 2 : 1.5}
              />
              <span className="leading-none">{label.split(" ")[0]}</span>
            </button>
          ))}
        </div>
      </nav>
    );
  }

  return (
    <aside className="hidden md:flex flex-col w-60 shrink-0 border-r border-black/10 bg-[#EFECDA]">
      <div className="px-6 py-5 border-b border-black/10">
        <Image
          src={LOGO_SRC}
          alt="Bloomsy"
          width={320}
          height={96}
          className="h-5 w-auto object-contain mb-1"
          priority
        />
        <div className="text-xs text-black/45 mt-0.5">
          Panel Admin · {adminName}
        </div>
      </div>

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

      <div className="px-6 py-4 border-t border-black/10">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-black/40 hover:text-black transition-colors"
        >
          Ver tienda →
        </a>
      </div>
    </aside>
  );
}
