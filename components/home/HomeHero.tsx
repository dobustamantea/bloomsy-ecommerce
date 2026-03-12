import Image from "next/image";
import Link from "next/link";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&q=80&fit=crop";

export default function HomeHero() {
  return (
    <section className="flex flex-col md:grid md:grid-cols-2 md:h-[100svh]">
      {/* ── Text — mobile: bottom (order-2), desktop: left (order-1) ── */}
      {/* py-14 mobile garantiza que el texto no quede pegado a la imagen */}
      <div className="order-2 md:order-1 flex flex-col justify-center px-8 md:px-14 lg:px-20 py-14 md:py-0">
        <p className="text-[11px] tracking-[0.35em] uppercase text-black/40 mb-7">
          Nueva Colección 2026
        </p>

        <h1 className="font-display text-[56px] md:text-[80px] lg:text-[96px] font-light leading-none tracking-tight mb-7 text-bloomsy-black">
          High Modern
          <br />
          Style
        </h1>

        <p className="text-base text-black/55 leading-relaxed mb-10 max-w-xs">
          Ropa femenina chilena para mujeres reales. Tallas S&nbsp;a&nbsp;4XL.
        </p>

        <div className="flex flex-wrap gap-4">
          <Link
            href="/shop"
            className="bg-bloomsy-black text-bloomsy-cream text-[11px] tracking-widest uppercase px-8 py-3.5 hover:bg-bloomsy-gray transition-colors"
          >
            Ver colección
          </Link>
          <Link
            href="/shop?sort=newest"
            className="border border-bloomsy-black text-bloomsy-black text-[11px] tracking-widest uppercase px-8 py-3.5 hover:bg-bloomsy-black hover:text-bloomsy-cream transition-colors"
          >
            Novedades
          </Link>
        </div>
      </div>

      {/* ── Image — mobile: top 40vh (order-1), desktop: right full (order-2) ── */}
      <div className="order-1 md:order-2 relative h-[40vh] md:h-full">
        <Image
          src={HERO_IMAGE}
          alt="Bloomsy Nueva Colección 2026 — modelo con estilo high modern"
          fill
          priority
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
    </section>
  );
}
