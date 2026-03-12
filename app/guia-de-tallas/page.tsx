import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Guía de tallas — Bloomsy",
  description:
    "Encuentra tu talla perfecta en Bloomsy. Tabla completa S–4XL con medidas de busto, cintura y cadera en centímetros.",
};

/* ── Tabla de tallas ─────────────────────────────────────────────── */
const TALLAS = [
  { talla: "S",   busto: "82–86",   cintura: "62–66",   cadera: "88–92"   },
  { talla: "M",   busto: "87–91",   cintura: "67–71",   cadera: "93–97"   },
  { talla: "L",   busto: "92–97",   cintura: "72–77",   cadera: "98–103"  },
  { talla: "XL",  busto: "98–103",  cintura: "78–83",   cadera: "104–109" },
  { talla: "XXL", busto: "104–110", cintura: "84–90",   cadera: "110–116" },
  { talla: "0XL", busto: "111–117", cintura: "91–97",   cadera: "117–123" },
  { talla: "1XL", busto: "118–124", cintura: "98–104",  cadera: "124–130" },
  { talla: "2XL", busto: "125–132", cintura: "105–112", cadera: "131–138" },
  { talla: "3XL", busto: "133–140", cintura: "113–120", cadera: "139–146" },
  { talla: "4XL", busto: "141–150", cintura: "121–130", cadera: "147–156" },
];

/* ── Medición steps ──────────────────────────────────────────────── */
const MEDIDAS = [
  {
    label: "Busto",
    instruccion:
      "Mide alrededor de la parte más ancha del pecho, manteniendo la cinta horizontal.",
    /* SVG: arco simple que representa el pecho */
    svg: (
      <svg viewBox="0 0 64 64" fill="none" className="w-14 h-14" aria-hidden="true">
        <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M14 32 Q24 20 32 20 Q40 20 50 32"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
        <line x1="8" y1="32" x2="56" y2="32" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
      </svg>
    ),
  },
  {
    label: "Cintura",
    instruccion:
      "Mide en la parte más estrecha del torso, generalmente sobre el ombligo.",
    svg: (
      <svg viewBox="0 0 64 64" fill="none" className="w-14 h-14" aria-hidden="true">
        <ellipse cx="32" cy="32" rx="18" ry="26" stroke="currentColor" strokeWidth="1.5" />
        <ellipse cx="32" cy="32" rx="12" ry="4" stroke="currentColor" strokeWidth="1.5" />
        <line x1="8" y1="32" x2="20" y2="32" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
        <line x1="44" y1="32" x2="56" y2="32" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
      </svg>
    ),
  },
  {
    label: "Cadera",
    instruccion:
      "Mide alrededor de la parte más ancha de las caderas y glúteos.",
    svg: (
      <svg viewBox="0 0 64 64" fill="none" className="w-14 h-14" aria-hidden="true">
        <path
          d="M20 14 Q10 32 12 48 Q20 58 32 58 Q44 58 52 48 Q54 32 44 14"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
        <line x1="8" y1="42" x2="56" y2="42" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
      </svg>
    ),
  },
];

/* ── Tips ────────────────────────────────────────────────────────── */
const TIPS: Array<{ text: React.ReactNode }> = [
  {
    text: "Si estás entre dos tallas, te recomendamos elegir la más grande.",
  },
  {
    text: "Para prendas ajustadas como bodys, considera subir una talla.",
  },
  {
    text: (
      <>
        ¿Tienes dudas?{" "}
        <Link
          href="https://wa.me/56992723158"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-bloomsy-black transition-colors"
        >
          Escríbenos por WhatsApp
        </Link>{" "}
        y te asesoramos.
      </>
    ),
  },
];

/* ══════════════════════════════════════════════════════════════════ */
export default function GuiaDeTallasPage() {
  return (
    <main className="bg-bloomsy-cream min-h-screen">
      <div className="max-w-[1000px] mx-auto px-4 md:px-8 py-14 md:py-20">

        {/* ── Header ───────────────────────────────────────────────── */}
        <div className="mb-12 md:mb-16">
          <p className="text-[10px] tracking-[0.35em] uppercase text-black/35 mb-4">
            Ayuda
          </p>
          <h1 className="font-display text-[48px] md:text-[64px] font-light leading-[1] mb-4">
            Guía de tallas
          </h1>
          <p className="text-[15px] text-black/50 max-w-xl">
            Encuentra tu talla perfecta. Todas nuestras medidas están en
            centímetros.
          </p>
        </div>

        {/* ══════════════════════════════════════════════════════════
            SECCIÓN 1 — CÓMO MEDIRSE
            ══════════════════════════════════════════════════════════ */}
        <section className="mb-14 md:mb-18">
          <h2 className="font-display text-[32px] md:text-[40px] font-light mb-8">
            Cómo medirse
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {MEDIDAS.map(({ label, instruccion, svg }) => (
              <div
                key={label}
                className="flex flex-col items-center text-center gap-4 border border-black/10 bg-white/40 px-6 py-8"
              >
                <div className="text-bloomsy-black/70">{svg}</div>
                <div>
                  <p className="text-[13px] tracking-widest uppercase text-bloomsy-black mb-2">
                    {label}
                  </p>
                  <p className="text-[13px] text-black/55 leading-relaxed">
                    {instruccion}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            SECCIÓN 2 — TABLA DE TALLAS
            ══════════════════════════════════════════════════════════ */}
        <section className="mb-14 md:mb-18">
          <h2 className="font-display text-[32px] md:text-[40px] font-light mb-8">
            Tabla de tallas general
          </h2>

          {/* overflow-x-auto para scroll horizontal en mobile */}
          <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
            <table className="w-full min-w-[420px] border-collapse text-[13px] md:text-[14px]">
              <thead>
                <tr className="bg-bloomsy-black text-bloomsy-cream">
                  <th className="py-3.5 px-5 text-left text-[10px] tracking-[0.2em] uppercase font-normal">
                    Talla
                  </th>
                  <th className="py-3.5 px-5 text-center text-[10px] tracking-[0.2em] uppercase font-normal">
                    Busto (cm)
                  </th>
                  <th className="py-3.5 px-5 text-center text-[10px] tracking-[0.2em] uppercase font-normal">
                    Cintura (cm)
                  </th>
                  <th className="py-3.5 px-5 text-center text-[10px] tracking-[0.2em] uppercase font-normal">
                    Cadera (cm)
                  </th>
                </tr>
              </thead>
              <tbody>
                {TALLAS.map(({ talla, busto, cintura, cadera }, i) => (
                  <tr
                    key={talla}
                    className={
                      i % 2 === 0
                        ? "bg-bloomsy-cream"
                        : "bg-white"
                    }
                  >
                    <td className="py-3 px-5 font-medium text-bloomsy-black border-b border-black/8">
                      {talla}
                    </td>
                    <td className="py-3 px-5 text-center text-black/65 border-b border-black/8">
                      {busto}
                    </td>
                    <td className="py-3 px-5 text-center text-black/65 border-b border-black/8">
                      {cintura}
                    </td>
                    <td className="py-3 px-5 text-center text-black/65 border-b border-black/8">
                      {cadera}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            SECCIÓN 3 — TALLA ÚNICA
            ══════════════════════════════════════════════════════════ */}
        <section className="mb-14 md:mb-18">
          <div className="border border-bloomsy-black bg-bloomsy-cream px-6 py-7 md:px-8 md:py-8 flex flex-col gap-2">
            <p className="text-[11px] tracking-[0.3em] uppercase text-black/40">
              Talla especial
            </p>
            <h2 className="font-display text-[28px] md:text-[36px] font-light text-bloomsy-black">
              Talla Única
            </h2>
            <p className="text-[14px] text-black/60 leading-relaxed max-w-lg">
              Nuestras prendas Talla Única están diseñadas para tallar desde la{" "}
              <strong className="font-medium text-bloomsy-black">S</strong>{" "}
              hasta la{" "}
              <strong className="font-medium text-bloomsy-black">L</strong>{" "}
              aproximadamente.
            </p>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            SECCIÓN 4 — CONSEJOS
            ══════════════════════════════════════════════════════════ */}
        <section>
          <h2 className="font-display text-[32px] md:text-[40px] font-light mb-8">
            Consejos útiles
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {TIPS.map(({ text }, i) => (
              <div
                key={i}
                className="border border-black/10 bg-white/50 px-5 py-6 flex items-start gap-4"
              >
                {/* Número */}
                <span className="font-display text-[28px] font-light text-black/15 leading-none flex-shrink-0 mt-0.5 select-none">
                  {i + 1}
                </span>
                <p className="text-[13px] text-black/60 leading-relaxed">
                  {text}
                </p>
              </div>
            ))}
          </div>

          {/* WhatsApp CTA secundario */}
          <div className="mt-8 flex items-center gap-3">
            <Link
              href="https://wa.me/56992723158"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-bloomsy-black text-bloomsy-black text-[11px] tracking-widest uppercase px-6 py-3 hover:bg-bloomsy-black hover:text-bloomsy-cream transition-colors"
            >
              <MessageCircle size={14} strokeWidth={1.5} />
              Consultar por WhatsApp
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
