"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { useSession } from "next-auth/react";
import AccountSignOutButton from "@/components/account/AccountSignOutButton";
import { getDisplayName } from "@/lib/auth-helpers";
import { cn } from "@/lib/utils";
import AnnouncementBar from "./AnnouncementBar";
import CartDrawer from "@/components/cart/CartDrawer";
import { useCartStore, selectItemCount } from "@/store/useCartStore";
import { useWishlistStore, selectWishlistCount } from "@/store/useWishlistStore";

const CATEGORIES = [
  { label: "Poleras", href: "/shop?categoria=poleras" },
  { label: "Tops", href: "/shop?categoria=tops" },
  { label: "Camisas", href: "/shop?categoria=camisas" },
  { label: "Blusas", href: "/shop?categoria=blusas" },
  { label: "Faldas", href: "/shop?categoria=faldas" },
  { label: "Abrigos", href: "/shop?categoria=abrigos" },
  { label: "Pantalones", href: "/shop?categoria=pantalones" },
  { label: "Bodys", href: "/shop?categoria=bodys" },
  { label: "Chalecos", href: "/shop?categoria=chalecos" },
  { label: "Conjuntos", href: "/shop?categoria=conjuntos" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  const cartCount = useCartStore(selectItemCount);
  const wishlistCount = useWishlistStore(selectWishlistCount);
  const { data: session, status } = useSession();

  const isAuthenticated = status === "authenticated" && !!session?.user;
  const isAdmin = Boolean(session?.user?.isAdmin);
  const accountLabel = getDisplayName(session?.user?.name, session?.user?.email);
  const mobileLinks = [
    { label: "Novedades", href: "/shop" },
    { label: "Nosotras", href: "/about" },
    { label: "Contacto", href: "/contacto" },
    { label: isAuthenticated ? accountLabel : "Mi cuenta", href: "/account" },
    ...(isAdmin ? [{ label: "Admin", href: "/admin" }] : []),
    { label: "Lista de deseos", href: "/wishlist" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
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
          <button
            className="md:hidden p-1 -ml-1"
            onClick={() => setMobileOpen(true)}
            aria-label="Abrir menu"
          >
            <Menu size={22} />
          </button>

          <Link href="/" className="shrink-0 mx-auto md:mx-0">
            <Image
              src="https://ikuacwkjcheyjlitfvit.supabase.co/storage/v1/object/public/product-images/assets/Bloomsy%20SoloW.png"
              alt="Bloomsy"
              width={320}
              height={96}
              className="h-5 md:h-6 w-auto object-contain"
              priority
            />
          </Link>

          <div className="hidden md:flex items-center gap-6 text-xs tracking-widest uppercase">
            <div
              className="relative group"
              onMouseEnter={() => setShopOpen(true)}
              onMouseLeave={() => setShopOpen(false)}
            >
              <button className="flex items-center gap-1 py-1 uppercase hover:opacity-60 transition-opacity">
                Tienda
                <ChevronDown
                  size={12}
                  className={cn(
                    "transition-transform duration-200",
                    shopOpen && "rotate-180"
                  )}
                />
              </button>

              {shopOpen ? (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 z-50">
                  <div className="bg-bloomsy-cream border border-black/10 shadow-lg p-4 grid grid-cols-2 gap-x-8 gap-y-2 min-w-[280px]">
                    <Link
                      href="/shop"
                      className="col-span-2 text-xs tracking-widest uppercase font-medium pb-2 border-b border-black/10 hover:opacity-60 transition-opacity"
                    >
                      Ver todo
                    </Link>
                    {CATEGORIES.map((category) => (
                      <Link
                        key={category.href}
                        href={category.href}
                        className="text-xs tracking-wider uppercase py-1 hover:opacity-60 transition-opacity"
                      >
                        {category.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            <Link href="/shop" className="hover:opacity-60 transition-opacity">
              Novedades
            </Link>
            <Link href="/about" className="hover:opacity-60 transition-opacity">
              Nosotras
            </Link>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            {searchOpen ? (
              <div className="flex items-center gap-2 absolute left-0 right-0 top-0 h-16 bg-bloomsy-cream px-4 md:px-8 z-10 md:relative md:inset-auto md:h-auto md:bg-transparent">
                <Search size={16} className="shrink-0 text-black/50" />
                <input
                  autoFocus
                  type="search"
                  placeholder="Buscar productos..."
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
              className="hidden sm:flex p-1.5 hover:opacity-60 transition-opacity relative"
              aria-label="Lista de deseos"
            >
              <Heart size={20} />
              {wishlistCount > 0 ? (
                <span className="absolute -top-0.5 -right-0.5 bg-bloomsy-black text-bloomsy-cream text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {wishlistCount > 9 ? "9+" : wishlistCount}
                </span>
              ) : null}
            </Link>

            {isAuthenticated ? (
              <div className="hidden sm:flex items-center gap-2">
                {isAdmin ? (
                  <Link
                    href="/admin"
                    className="flex items-center gap-2 px-2 py-1.5 text-[11px] tracking-[0.18em] uppercase hover:opacity-60 transition-opacity"
                  >
                    Admin
                  </Link>
                ) : null}
                <Link
                  href="/account"
                  className="flex items-center gap-2 px-2 py-1.5 text-[11px] tracking-[0.18em] uppercase hover:opacity-60 transition-opacity"
                  aria-label="Mi cuenta"
                >
                  <User size={18} />
                  <span className="max-w-28 truncate">{accountLabel}</span>
                </Link>
                <AccountSignOutButton
                  label="Salir"
                  className="border-0 px-2 py-1.5 text-[11px] tracking-[0.18em] hover:bg-transparent hover:text-bloomsy-black"
                />
              </div>
            ) : (
              <Link
                href="/account"
                className="hidden sm:flex p-1.5 hover:opacity-60 transition-opacity"
                aria-label="Mi cuenta"
              >
                <User size={20} />
              </Link>
            )}

            <button
              onClick={() => setCartDrawerOpen(true)}
              className="p-1.5 hover:opacity-60 transition-opacity relative"
              aria-label="Abrir carrito"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 ? (
                <span className="absolute -top-0.5 -right-0.5 bg-bloomsy-black text-bloomsy-cream text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              ) : null}
            </button>
          </div>
        </nav>
      </header>

      <CartDrawer open={cartDrawerOpen} onClose={() => setCartDrawerOpen(false)} />

      {mobileOpen ? (
        <div className="fixed inset-0 z-[60] flex">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />

          <aside className="relative bg-bloomsy-cream w-72 max-w-full h-full flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-5 h-16 border-b border-black/10">
              <span className="font-display text-xl tracking-[0.15em] uppercase">
                Bloomsy
              </span>
              <button onClick={() => setMobileOpen(false)} aria-label="Cerrar menu">
                <X size={20} />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-5 py-6 space-y-1">
              <p className="text-[10px] tracking-widest uppercase text-black/40 mb-3">
                Categorias
              </p>
              <Link
                href="/shop"
                onClick={() => setMobileOpen(false)}
                className="block py-2.5 text-sm tracking-widest uppercase border-b border-black/5 hover:opacity-60"
              >
                Ver todo
              </Link>
              {CATEGORIES.map((category) => (
                <Link
                  key={category.href}
                  href={category.href}
                  onClick={() => setMobileOpen(false)}
                  className="block py-2.5 text-sm tracking-widest uppercase border-b border-black/5 hover:opacity-60"
                >
                  {category.label}
                </Link>
              ))}

              <div className="pt-4 space-y-1">
                <p className="text-[10px] tracking-widest uppercase text-black/40 mb-3">
                  Mas
                </p>
                {mobileLinks.map((item) => (
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

              {isAuthenticated ? (
                <div className="pt-4">
                  <AccountSignOutButton
                    label="Cerrar sesion"
                    className="w-full justify-center"
                    onComplete={() => setMobileOpen(false)}
                  />
                </div>
              ) : null}
            </nav>

            <div className="px-5 py-5 border-t border-black/10 text-xs text-black/40 space-y-1">
              <p>info@bloomsy.cl</p>
              <p>+56 9 9272 3158</p>
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
