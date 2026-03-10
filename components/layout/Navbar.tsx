"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import AnnouncementBar from "./AnnouncementBar";

const CATEGORIES = [
  { label: "Poleras", href: "/categoria/poleras" },
  { label: "Tops", href: "/categoria/tops" },
  { label: "Faldas", href: "/categoria/faldas" },
  { label: "Abrigos", href: "/categoria/abrigos" },
  { label: "Pantalones", href: "/categoria/pantalones" },
  { label: "Bodys", href: "/categoria/bodys" },
  { label: "Chalecos", href: "/categoria/chalecos" },
  { label: "Conjuntos", href: "/categoria/conjuntos" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);

  // Sticky shadow on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change (simple approach)
  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <AnnouncementBar />

      <header
        className={cn(
          "sticky top-0 z-50 bg-bloomsy-cream transition-shadow duration-200",
          scrolled && "shadow-[0_1px_0_0_rgba(0,0,0,0.12)]"
        )}
      >
        <nav className="max-w-[1400px] mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-4">
          {/* Mobile: hamburger */}
          <button
            className="md:hidden p-1 -ml-1"
            onClick={() => setMobileOpen(true)}
            aria-label="Abrir menú"
          >
            <Menu size={22} />
          </button>

          {/* Logo */}
          <Link
            href="/"
            className="font-display text-2xl md:text-3xl tracking-[0.18em] uppercase font-light text-bloomsy-black shrink-0 mx-auto md:mx-0"
          >
            Bloomsy
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6 text-xs tracking-widest uppercase">
            {/* Shop with dropdown */}
            <div
              className="relative group"
              onMouseEnter={() => setShopOpen(true)}
              onMouseLeave={() => setShopOpen(false)}
            >
              <button className="flex items-center gap-1 py-1 hover:opacity-60 transition-opacity">
                Shop
                <ChevronDown
                  size={12}
                  className={cn(
                    "transition-transform duration-200",
                    shopOpen && "rotate-180"
                  )}
                />
              </button>

              {shopOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 z-50">
                  <div className="bg-bloomsy-cream border border-black/10 shadow-lg p-4 grid grid-cols-2 gap-x-8 gap-y-2 min-w-[280px]">
                    <Link
                      href="/shop"
                      className="col-span-2 text-xs tracking-widest uppercase font-medium pb-2 border-b border-black/10 hover:opacity-60 transition-opacity"
                    >
                      Ver todo
                    </Link>
                    {CATEGORIES.map((cat) => (
                      <Link
                        key={cat.href}
                        href={cat.href}
                        className="text-xs tracking-wider uppercase py-1 hover:opacity-60 transition-opacity"
                      >
                        {cat.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link href="/shop" className="hover:opacity-60 transition-opacity">
              Novedades
            </Link>
            <Link href="/about" className="hover:opacity-60 transition-opacity">
              Nosotras
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Search */}
            {searchOpen ? (
              <div className="flex items-center gap-2 absolute left-0 right-0 top-0 h-16 bg-bloomsy-cream px-4 md:px-8 z-10 md:relative md:inset-auto md:h-auto md:bg-transparent">
                <Search size={16} className="shrink-0 text-black/50" />
                <input
                  autoFocus
                  type="search"
                  placeholder="Buscar productos…"
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-black/40"
                />
                <button onClick={() => setSearchOpen(false)} className="p-1">
                  <X size={18} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="p-1.5 hover:opacity-60 transition-opacity"
                aria-label="Buscar"
              >
                <Search size={20} />
              </button>
            )}

            <Link
              href="/wishlist"
              className="hidden sm:flex p-1.5 hover:opacity-60 transition-opacity"
              aria-label="Lista de deseos"
            >
              <Heart size={20} />
            </Link>

            <Link
              href="/account"
              className="hidden sm:flex p-1.5 hover:opacity-60 transition-opacity"
              aria-label="Mi cuenta"
            >
              <User size={20} />
            </Link>

            <Link
              href="/cart"
              className="p-1.5 hover:opacity-60 transition-opacity relative"
              aria-label="Carrito"
            >
              <ShoppingBag size={20} />
              {/* Cart badge — managed by Zustand store later */}
              <span
                id="cart-badge"
                className="absolute -top-0.5 -right-0.5 bg-bloomsy-black text-bloomsy-cream text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center hidden"
              />
            </Link>
          </div>
        </nav>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] flex">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer */}
          <aside className="relative bg-bloomsy-cream w-72 max-w-full h-full flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-5 h-16 border-b border-black/10">
              <span className="font-display text-xl tracking-[0.15em] uppercase">
                Bloomsy
              </span>
              <button onClick={() => setMobileOpen(false)} aria-label="Cerrar menú">
                <X size={20} />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-5 py-6 space-y-1">
              <p className="text-[10px] tracking-widest uppercase text-black/40 mb-3">
                Categorías
              </p>
              <Link
                href="/shop"
                onClick={() => setMobileOpen(false)}
                className="block py-2.5 text-sm tracking-widest uppercase border-b border-black/5 hover:opacity-60"
              >
                Ver todo
              </Link>
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.href}
                  href={cat.href}
                  onClick={() => setMobileOpen(false)}
                  className="block py-2.5 text-sm tracking-widest uppercase border-b border-black/5 hover:opacity-60"
                >
                  {cat.label}
                </Link>
              ))}

              <div className="pt-4 space-y-1">
                <p className="text-[10px] tracking-widest uppercase text-black/40 mb-3">
                  Más
                </p>
                {[
                  { label: "Novedades", href: "/shop" },
                  { label: "Nosotras", href: "/about" },
                  { label: "Contacto", href: "/contacto" },
                  { label: "Mi cuenta", href: "/account" },
                  { label: "Lista de deseos", href: "/wishlist" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="block py-2.5 text-sm tracking-widest uppercase border-b border-black/5 hover:opacity-60"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </nav>

            <div className="px-5 py-5 border-t border-black/10 text-xs text-black/40 space-y-1">
              <p>info@bloomsy.cl</p>
              <p>+56 9 9272 3158</p>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
