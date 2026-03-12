import type { Metadata } from "next";
import Link from "next/link";
import { RefreshCw, ListChecks, RotateCcw, XCircle, Mail, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "Cambios y devoluciones — Bloomsy",
  description:
    "Cambios dentro de 10 días corridos. Si algo no está bien con tu pedido, lo solucionamos juntas.",
};

/* ── Condiciones de cambio ───────────────────────────────────────── */
const CONDICIONES_OK = [
  "Sin uso",
  "Con etiquetas originales",
  "Sin manchas, perfume ni alteraciones",
  "En su embalaje original",
];

/* ── Pasos para solicitar cambio ─────────────────────────────────── */
const PASOS = [
  "Escríbenos por WhatsApp o email indicando tu número de pedido.",
  "Te confirmamos si el cambio aplica y te damos instrucciones.",
  "Envías la prenda a nuestra dirección — el costo de envío de retorno es del cliente.",
  "Al recibirla, procesamos el cambio o nota de crédito en 3–5 días hábiles.",
];

/* ── Excepciones ─────────────────────────────────────────────────── */
const EXCEPCIONES = [
  "Prendas usadas o lavadas",
  "Prendas sin etiqueta original",
  "Productos en promoción o liquidación (salvo defecto de fábrica)",
  "Lencería y trajes de baño por higiene",
];

/* ── Section wrapper ─────────────────────────────────────────────── */
function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-black/10 pt-10">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-full bg-bloomsy-black flex items-center justify-center flex-shrink-0">
          <Icon size={15} strokeWidth={1.5} className="text-bloomsy-cream" />
        </div>
        <h2 className="font-display text-[26px] md:text-[32px] font-light leading-none">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════ */
export default function CambiosYDevolucionesPage() {
  return (
    <main className="bg-bloomsy-cream min-h-screen">
      <div className="max-w-[860px] mx-auto px-4 md:px-8 py-14 md:py-20">

        {/* ── Header ───────────────────────────────────────────────── */}
        <div className="mb-14 md:mb-16">
          <p className="text-[10px] tracking-[0.35em] uppercase text-black/35 mb-4">
            Ayuda
          </p>
          <h1 className="font-display text-[44px] md:text-[64px] font-light leading-[1.05] mb-4">
            Cambios y devoluciones
          </h1>
          <p className="text-[15px] text-black/50 max-w-lg leading-relaxed">
            Tu satisfacción es lo más importante. Si algo no está bien, lo
            solucionamos juntas.
          </p>
        </div>

        <div className="flex flex-col gap-12">

          {/* ══════════════════════════════════════════════════════
              SECCIÓN 1 — ¿CUÁNDO PUEDO HACER UN CAMBIO?
              ══════════════════════════════════════════════════════ */}
          <Section icon={RefreshCw} title="¿Cuándo puedo hacer un cambio?">
            <p className="text-[14px] text-black/60 leading-relaxed mb-5">
              Aceptamos cambios dentro de los{" "}
              <strong className="text-bloomsy-black font-medium">
                10 días corridos
              </strong>{" "}
              desde que recibiste tu pedido, siempre que la prenda esté:
            </p>

            <ul className="flex flex-col gap-3">
              {CONDICIONES_OK.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  {/* Check */}
                  <span className="w-5 h-5 rounded-full bg-bloomsy-black flex items-center justify-center flex-shrink-0">
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 12 12"
                      fill="none"
                      aria-hidden="true"
                    >
                      <polyline
                        points="2 6 5 9 10 3"
                        stroke="#EFECDA"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span className="text-[14px] text-black/65">{item}</span>
                </li>
              ))}
            </ul>
          </Section>

          {/* ══════════════════════════════════════════════════════
              SECCIÓN 2 — ¿CÓMO SOLICITO UN CAMBIO?
              ══════════════════════════════════════════════════════ */}
          <Section icon={ListChecks} title="¿Cómo solicito un cambio?">
            <ol className="flex flex-col gap-0 mb-8">
              {PASOS.map((paso, i) => (
                <li key={i} className="flex items-start gap-5">
                  {/* Timeline */}
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className="w-8 h-8 rounded-full border-2 border-bloomsy-black bg-bloomsy-cream flex items-center justify-center">
                      <span className="font-display text-[16px] font-medium text-bloomsy-black leading-none">
                        {i + 1}
                      </span>
                    </div>
                    {i < PASOS.length - 1 && (
                      <div className="w-px flex-1 bg-black/15 my-1 min-h-[20px]" />
                    )}
                  </div>
                  <p
                    className={`text-[14px] text-black/60 leading-relaxed ${
                      i < PASOS.length - 1 ? "pb-5" : ""
                    }`}
                  >
                    {paso}
                  </p>
                </li>
              ))}
            </ol>

            {/* Contacto destacado */}
            <div className="border border-black/10 bg-white/50 p-5 flex flex-col sm:flex-row gap-3">
              <Link
                href="https://wa.me/56992723158"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 flex-1 group"
              >
                <div className="w-8 h-8 rounded-full bg-bloomsy-black flex items-center justify-center flex-shrink-0">
                  <Phone size={13} strokeWidth={1.5} className="text-bloomsy-cream" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] tracking-widest uppercase text-black/35">
                    WhatsApp
                  </span>
                  <span className="text-[13px] text-bloomsy-black group-hover:underline underline-offset-2">
                    +56 9 9272 3158
                  </span>
                </div>
              </Link>

              <div className="hidden sm:block w-px bg-black/10 self-stretch" />

              <Link
                href="mailto:info@bloomsy.cl"
                className="flex items-center gap-3 flex-1 group"
              >
                <div className="w-8 h-8 rounded-full bg-bloomsy-black flex items-center justify-center flex-shrink-0">
                  <Mail size={13} strokeWidth={1.5} className="text-bloomsy-cream" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] tracking-widest uppercase text-black/35">
                    Email
                  </span>
                  <span className="text-[13px] text-bloomsy-black group-hover:underline underline-offset-2">
                    info@bloomsy.cl
                  </span>
                </div>
              </Link>
            </div>
          </Section>

          {/* ══════════════════════════════════════════════════════
              SECCIÓN 3 — DEVOLUCIONES Y REEMBOLSOS
              ══════════════════════════════════════════════════════ */}
          <Section icon={RotateCcw} title="Devoluciones y reembolsos">
            <p className="text-[14px] text-black/60 leading-relaxed mb-4">
              Realizamos devoluciones en los siguientes casos:
            </p>

            <ul className="flex flex-col gap-2 mb-5">
              {["Producto defectuoso o dañado", "Producto incorrecto (distinto al pedido)"].map(
                (item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-bloomsy-black flex items-center justify-center flex-shrink-0">
                      <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                        <polyline
                          points="2 6 5 9 10 3"
                          stroke="#EFECDA"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <span className="text-[14px] text-black/65">{item}</span>
                  </li>
                )
              )}
            </ul>

            <div className="border-l-2 border-bloomsy-black pl-4 text-[14px] text-black/60 leading-relaxed">
              En estos casos cubrimos el costo de envío de retorno y realizamos
              el reembolso dentro de{" "}
              <strong className="text-bloomsy-black font-medium">
                5–10 días hábiles
              </strong>{" "}
              al mismo método de pago utilizado.
            </div>
          </Section>

          {/* ══════════════════════════════════════════════════════
              SECCIÓN 4 — EXCEPCIONES
              ══════════════════════════════════════════════════════ */}
          <Section icon={XCircle} title="Excepciones">
            <p className="text-[14px] text-black/55 leading-relaxed mb-5">
              No aplica cambio ni devolución en los siguientes casos:
            </p>

            <ul className="flex flex-col gap-3">
              {EXCEPCIONES.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  {/* X */}
                  <span className="w-5 h-5 rounded-full bg-black/10 flex items-center justify-center flex-shrink-0">
                    <svg width="8" height="8" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                      <line x1="2" y1="2" x2="8" y2="8" stroke="#000" strokeOpacity="0.4" strokeWidth="1.5" strokeLinecap="round" />
                      <line x1="8" y1="2" x2="2" y2="8" stroke="#000" strokeOpacity="0.4" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </span>
                  <span className="text-[14px] text-black/55">{item}</span>
                </li>
              ))}
            </ul>
          </Section>

        </div>

        {/* ══════════════════════════════════════════════════════
            CTA FINAL
            ══════════════════════════════════════════════════════ */}
        <div className="mt-14 bg-bloomsy-black text-bloomsy-cream px-6 py-10 md:px-10 md:py-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="font-display text-[28px] md:text-[34px] font-light text-center sm:text-left leading-tight">
            ¿Tienes dudas sobre tu cambio?
          </p>
          <Link
            href="https://wa.me/56992723158"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 bg-bloomsy-cream text-bloomsy-black text-[11px] tracking-widest uppercase px-8 py-3.5 hover:bg-white transition-colors whitespace-nowrap"
          >
            Escríbenos por WhatsApp
          </Link>
        </div>

      </div>
    </main>
  );
}
