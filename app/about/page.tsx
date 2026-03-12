import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, Heart, MapPin } from "lucide-react";

export const metadata: Metadata = {
  // EDITAR: título y descripción SEO de la página Nosotras
  title: "Nosotras — Bloomsy",
  description:
    "Conoce la historia de Bloomsy, la marca chilena de moda femenina para mujeres reales. Tallas S a 4XL.",
};

/* ── Helpers ─────────────────────────────────────────────────────── */
const img = (id: string, w = 800) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=80&fit=crop`;

/* ── Gallery images (6) — se usan imágenes de los productos existentes ── */
// EDITAR: reemplazar estos IDs por fotos reales de la marca cuando estén disponibles
const GALLERY_IMAGES = [
  { id: "1515886657613-9f3515b0c78f", alt: "Bloomsy lookbook" },
  { id: "1483985988355-763728e1935b", alt: "Detalle de tela" },
  { id: "1554568218-0f1715e72254", alt: "Sesión de fotos Bloomsy" },
  { id: "1572804013427-4d7ca7268217", alt: "Colección nueva temporada" },
  { id: "1525507119028-ed4c629a60a3", alt: "Piezas seleccionadas" },
  { id: "1539109136881-3be0616acf4b", alt: "Estilo Bloomsy" },
];

/* ── Values data ─────────────────────────────────────────────────── */
const VALUES = [
  {
    Icon: Sparkles,
    // EDITAR: título del valor 1
    title: "Estilo sin límites",
    // EDITAR: descripción del valor 1
    text: "La moda no tiene talla. Bloomsy existe para que cada mujer encuentre su estilo, desde la S hasta la 4XL.",
  },
  {
    Icon: Heart,
    // EDITAR: título del valor 2
    title: "Hecho con intención",
    // EDITAR: descripción del valor 2
    text: "Cada prenda es seleccionada con cuidado. Priorizamos calidad, comodidad y diseño que dura más allá de una temporada.",
  },
  {
    Icon: MapPin,
    // EDITAR: título del valor 3
    title: "Orgullo chileno",
    // EDITAR: descripción del valor 3
    text: "Somos una marca chilena, para mujeres chilenas. Enviamos a todo el país y celebramos la diversidad de nuestra clienta.",
  },
];

/* ── Team data ───────────────────────────────────────────────────── */
// EDITAR: reemplazar con datos reales del equipo
const TEAM = [
  {
    initial: "J",
    // EDITAR: nombre completo de Julieta
    name: "Julieta [Apellido]",
    // EDITAR: rol
    role: "Fundadora & Directora Creativa",
    // EDITAR: Instagram handle
    instagram: "@bloomsy.cl",
  },
  {
    initial: "C",
    // EDITAR: nombre completo
    name: "[Nombre] [Apellido]",
    // EDITAR: rol
    role: "Fotografía & Contenido",
    // EDITAR: Instagram handle (dejar vacío si no aplica)
    instagram: "",
  },
  {
    initial: "A",
    // EDITAR: nombre completo
    name: "[Nombre] [Apellido]",
    // EDITAR: rol
    role: "Atención al Cliente",
    // EDITAR: Instagram handle (dejar vacío si no aplica)
    instagram: "",
  },
];

/* ══════════════════════════════════════════════════════════════════ */
export default function AboutPage() {
  return (
    <main>
      {/* ══════════════════════════════════════════════════════════
          SECCIÓN 1 — HERO
          ══════════════════════════════════════════════════════════ */}
      <section className="bg-bloomsy-cream min-h-[60vh] flex items-center">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-16 md:py-20 w-full">
          <div className="grid grid-cols-1 md:grid-cols-[60%_40%] gap-10 md:gap-16 items-center">
            {/* Texto */}
            <div>
              {/* EDITAR: eyebrow */}
              <p className="text-[10px] tracking-[0.35em] uppercase text-black/35 mb-5">
                Nuestra historia
              </p>

              {/* EDITAR: título principal del hero */}
              <h1 className="font-display text-[48px] md:text-[72px] font-light leading-[1.05] mb-7">
                Bloomsy nació
                <br />
                de una idea simple
              </h1>

              {/* EDITAR: párrafo introductorio */}
              <p className="text-[15px] md:text-base text-black/65 leading-relaxed max-w-xl">
                Creemos que la moda debe ser para todas. Sin importar la talla,
                el presupuesto ni el momento. Bloomsy es ropa chilena hecha con
                intención, para mujeres reales con estilo y actitud.
              </p>
            </div>

            {/* Imagen derecha — solo desktop */}
            {/* EDITAR: reemplazar por una foto representativa de la marca */}
            <div className="hidden md:block relative aspect-[3/4] overflow-hidden">
              <Image
                src={img("1515886657613-9f3515b0c78f", 900)}
                alt="Bloomsy — nuestra historia"
                fill
                className="object-cover"
                sizes="40vw"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECCIÓN 2 — QUIÉN ES JULIETA
          ══════════════════════════════════════════════════════════ */}
      <section className="bg-bloomsy-black text-bloomsy-cream">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-16 md:py-24">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-10 md:gap-16">
            {/* Avatar circular placeholder */}
            {/* EDITAR: reemplazar este bloque por <Image> con la foto real de Julieta */}
            <div className="flex-shrink-0">
              <div className="w-[180px] h-[180px] md:w-[220px] md:h-[220px] rounded-full bg-[#2a2a2a] flex items-center justify-center">
                <span className="font-display text-[64px] font-light text-bloomsy-cream/60 select-none">
                  J
                </span>
              </div>
            </div>

            {/* Texto */}
            <div className="text-center md:text-left">
              {/* EDITAR: eyebrow */}
              <p className="text-[10px] tracking-[0.35em] uppercase text-bloomsy-cream/35 mb-4">
                La fundadora
              </p>

              {/* EDITAR: nombre completo de Julieta */}
              <h2 className="font-display text-[40px] md:text-[48px] font-light text-bloomsy-cream mb-1">
                Julieta [Apellido]
              </h2>

              {/* EDITAR: cargo */}
              <p className="text-[12px] tracking-widest uppercase text-bloomsy-cream/45 mb-7">
                Fundadora &amp; Directora Creativa
              </p>

              {/* EDITAR: párrafo 1 sobre Julieta */}
              <p className="text-[15px] text-bloomsy-cream/70 leading-relaxed mb-4 max-w-2xl">
                Julieta siempre supo que quería crear algo propio. Con años de
                experiencia en moda y un ojo afinado para el estilo, fundó
                Bloomsy con una visión clara: democratizar la moda femenina en
                Chile.
              </p>

              {/* EDITAR: párrafo 2 sobre Julieta */}
              <p className="text-[15px] text-bloomsy-cream/70 leading-relaxed max-w-2xl">
                Cada pieza de Bloomsy pasa por sus manos. Desde la elección de
                telas hasta la última foto del catálogo, Julieta cuida cada
                detalle para que tú te sientas increíble.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECCIÓN 3 — FILOSOFÍA / VALORES
          ══════════════════════════════════════════════════════════ */}
      <section className="bg-bloomsy-cream py-16 md:py-24">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          {/* EDITAR: título de la sección de valores */}
          <h2 className="font-display text-[40px] md:text-[48px] font-light text-center mb-12 md:mb-16">
            Lo que nos mueve
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
            {VALUES.map(({ Icon, title, text }) => (
              <div
                key={title}
                className="flex flex-col items-center md:items-start text-center md:text-left gap-5"
              >
                <div className="w-11 h-11 rounded-full bg-bloomsy-black flex items-center justify-center flex-shrink-0">
                  <Icon size={20} strokeWidth={1.25} className="text-bloomsy-cream" />
                </div>
                <div>
                  <h3 className="text-[15px] font-medium tracking-wide mb-2">
                    {title}
                  </h3>
                  <p className="text-[14px] text-black/55 leading-relaxed">
                    {text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECCIÓN 4 — EL EQUIPO
          ══════════════════════════════════════════════════════════ */}
      <section className="bg-[#F7F5F0] py-16 md:py-24">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          {/* EDITAR: título de la sección de equipo */}
          <h2 className="font-display text-[40px] md:text-[48px] font-light text-center mb-2">
            Nuestro equipo
          </h2>
          {/* EDITAR: subtítulo de equipo */}
          <p className="text-sm text-black/45 text-center mb-12 md:mb-16">
            Las personas detrás de Bloomsy
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 max-w-3xl mx-auto">
            {TEAM.map(({ initial, name, role, instagram }) => (
              <div
                key={initial + name}
                className="flex flex-col items-center text-center gap-4"
              >
                {/* Avatar placeholder — EDITAR: reemplazar con <Image> cuando haya fotos reales */}
                <div className="w-[120px] h-[120px] rounded-full bg-bloomsy-black flex items-center justify-center flex-shrink-0">
                  <span className="font-display text-[44px] font-light text-bloomsy-cream/60 select-none">
                    {initial}
                  </span>
                </div>

                {/* EDITAR: nombre del integrante */}
                <div>
                  <p className="text-[15px] font-medium text-bloomsy-black">
                    {name}
                  </p>
                  {/* EDITAR: rol del integrante */}
                  <p className="text-[12px] text-black/45 mt-1">{role}</p>
                  {/* EDITAR: Instagram handle (dejar vacío para ocultar) */}
                  {instagram && (
                    <p className="text-[11px] tracking-wide text-black/35 mt-1.5">
                      {instagram}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECCIÓN 5 — GALERÍA DE LA MARCA
          ══════════════════════════════════════════════════════════ */}
      <section className="bg-bloomsy-cream py-16 md:py-24">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          {/* EDITAR: título de la galería */}
          <h2 className="font-display text-[40px] md:text-[48px] font-light text-center mb-10 md:mb-12">
            Bloomsy en imágenes
          </h2>

          {/* EDITAR: reemplazar estas imágenes por fotos reales de la marca */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
            {GALLERY_IMAGES.map(({ id, alt }) => (
              <div
                key={id}
                className="group relative aspect-[3/4] overflow-hidden bg-bloomsy-black"
              >
                <Image
                  src={img(id)}
                  alt={alt}
                  fill
                  className="object-cover transition-opacity duration-400 group-hover:opacity-75"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
                {/* Overlay hover suave */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-400" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECCIÓN 6 — CTA FINAL
          ══════════════════════════════════════════════════════════ */}
      <section className="bg-bloomsy-black text-bloomsy-cream min-h-[300px] flex items-center">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-16 w-full text-center">
          {/* EDITAR: título del CTA final */}
          <h2 className="font-display text-[40px] md:text-[56px] font-light mb-4 leading-tight">
            ¿Lista para encontrar tu estilo?
          </h2>

          {/* EDITAR: subtítulo del CTA final */}
          <p className="text-[14px] text-bloomsy-cream/55 mb-10 tracking-wide">
            Descubre la nueva colección. Tallas S a 4XL.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* Botón primario */}
            <Link
              href="/shop"
              className="bg-bloomsy-cream text-bloomsy-black text-[11px] tracking-widest uppercase px-10 py-3.5 hover:bg-white transition-colors"
            >
              Ver colección
            </Link>

            {/* Botón outline — EDITAR: número de WhatsApp */}
            <Link
              href="https://wa.me/56992723158"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-bloomsy-cream text-bloomsy-cream text-[11px] tracking-widest uppercase px-10 py-3.5 hover:bg-bloomsy-cream hover:text-bloomsy-black transition-colors"
            >
              Escríbenos
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
