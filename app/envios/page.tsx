import type { Metadata } from "next";
import Link from "next/link";
import { Truck, MapPin, CheckCircle2, Search, AlertCircle, Mail, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "Política de envíos — Bloomsy",
  description:
    "Enviamos a todo Chile vía StarKen. Costo $3.990, gratis sobre $65.000. Plazo 3–5 días hábiles.",
};

/* ── Pasos del proceso ───────────────────────────────────────────── */
const PASOS = [
  "Realizas tu pedido en bloomsy.cl",
  "Confirmamos y preparamos tu orden (1–2 días hábiles)",
  "StarKen recoge el paquete",
  "Recibes tu pedido en 3–5 días hábiles",
];

/* ── Sección wrapper ─────────────────────────────────────────────── */
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
    <section className="border-t border-black/10 pt-10 pb-2">
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
export default function EnviosPage() {
  return (
    <main className="bg-bloomsy-cream min-h-screen">
      <div className="max-w-[860px] mx-auto px-4 md:px-8 py-14 md:py-20">

        {/* ── Header ───────────────────────────────────────────────── */}
        <div className="mb-14 md:mb-16">
          <p className="text-[10px] tracking-[0.35em] uppercase text-black/35 mb-4">
            Ayuda
          </p>
          <h1 className="font-display text-[48px] md:text-[64px] font-light leading-[1]">
            Política de envíos
          </h1>
        </div>

        <div className="flex flex-col gap-12">

          {/* ══════════════════════════════════════════════════════
              SECCIÓN 1 — OPCIONES DE DESPACHO
              ══════════════════════════════════════════════════════ */}
          <Section icon={Truck} title="Opciones de despacho">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* Card 1 — Despacho a domicilio */}
              <div className="border border-bloomsy-black bg-bloomsy-black text-bloomsy-cream p-6 flex flex-col gap-4">
                <div>
                  <p className="text-[10px] tracking-[0.3em] uppercase text-bloomsy-cream/40 mb-1">
                    Despacho a domicilio
                  </p>
                  <p className="font-display text-[28px] font-light">StarKen</p>
                </div>
                <ul className="flex flex-col gap-2 text-[13px] text-bloomsy-cream/75">
                  <li className="flex items-start gap-2">
                    <span className="text-bloomsy-cream/35 mt-0.5">—</span>
                    Costo: <strong className="text-bloomsy-cream font-medium">$3.990</strong>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-bloomsy-cream/35 mt-0.5">—</span>
                    <span>
                      <strong className="text-bloomsy-cream font-medium">Gratis</strong> en compras sobre $65.000
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-bloomsy-cream/35 mt-0.5">—</span>
                    Plazo: 3–5 días hábiles
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-bloomsy-cream/35 mt-0.5">—</span>
                    Cobertura: Todo Chile
                  </li>
                </ul>
              </div>

              {/* Card 2 — Retiro personal */}
              <div className="border border-black/15 bg-white/40 p-6 flex flex-col gap-4">
                <div>
                  <p className="text-[10px] tracking-[0.3em] uppercase text-black/35 mb-1">
                    Retiro personal
                  </p>
                  <p className="font-display text-[28px] font-light text-bloomsy-black">Gratis</p>
                </div>
                <ul className="flex flex-col gap-2 text-[13px] text-black/60">
                  <li className="flex items-start gap-2">
                    <span className="text-black/25 mt-0.5">—</span>
                    Sin costo adicional
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-black/25 mt-0.5">—</span>
                    <span>
                      Coordinar por{" "}
                      <Link
                        href="https://wa.me/56992723158"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline underline-offset-2 text-bloomsy-black hover:text-black/60 transition-colors"
                      >
                        WhatsApp
                      </Link>
                      : +56 9 9272 3158
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-black/25 mt-0.5">—</span>
                    Disponibilidad: Lunes a viernes
                  </li>
                </ul>
              </div>
            </div>
          </Section>

          {/* ══════════════════════════════════════════════════════
              SECCIÓN 2 — CÓMO FUNCIONA
              ══════════════════════════════════════════════════════ */}
          <Section icon={CheckCircle2} title="¿Cómo funciona?">
            <ol className="flex flex-col gap-0">
              {PASOS.map((paso, i) => (
                <li key={i} className="flex items-start gap-5 group">
                  {/* Línea de tiempo */}
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className="w-8 h-8 rounded-full border-2 border-bloomsy-black bg-bloomsy-cream flex items-center justify-center">
                      <span className="font-display text-[16px] font-medium text-bloomsy-black leading-none">
                        {i + 1}
                      </span>
                    </div>
                    {i < PASOS.length - 1 && (
                      <div className="w-px flex-1 bg-black/15 my-1 min-h-[24px]" />
                    )}
                  </div>
                  {/* Texto */}
                  <p className={`text-[14px] text-black/65 leading-relaxed ${i < PASOS.length - 1 ? "pb-6" : ""}`}>
                    {paso}
                  </p>
                </li>
              ))}
            </ol>
          </Section>

          {/* ══════════════════════════════════════════════════════
              SECCIÓN 3 — SEGUIMIENTO
              ══════════════════════════════════════════════════════ */}
          <Section icon={Search} title="Seguimiento de tu pedido">
            <p className="text-[14px] text-black/60 leading-relaxed mb-3">
              Una vez despachado tu pedido, te enviaremos el número de seguimiento
              de StarKen a tu email para que puedas rastrear tu entrega en tiempo
              real.
            </p>
            <Link
              href="https://www.starken.cl"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[13px] text-bloomsy-black underline underline-offset-2 hover:text-black/50 transition-colors"
            >
              Rastrear en starken.cl →
            </Link>
          </Section>

          {/* ══════════════════════════════════════════════════════
              SECCIÓN 4 — ZONAS ESPECIALES
              ══════════════════════════════════════════════════════ */}
          <Section icon={MapPin} title="Zonas y plazos especiales">
            <div className="border border-black/10 bg-white/40 px-5 py-5 text-[14px] text-black/60 leading-relaxed">
              Para regiones extremas{" "}
              <span className="text-bloomsy-black font-medium">
                (Aysén, Magallanes, Isla de Pascua)
              </span>{" "}
              los plazos pueden extenderse hasta{" "}
              <span className="text-bloomsy-black font-medium">7–10 días hábiles</span>.
              Te avisaremos si tu dirección aplica a este caso al confirmar tu pedido.
            </div>
          </Section>

          {/* ══════════════════════════════════════════════════════
              SECCIÓN 5 — PROBLEMAS CON MI ENVÍO
              ══════════════════════════════════════════════════════ */}
          <Section icon={AlertCircle} title="Problemas con mi envío">
            <p className="text-[14px] text-black/60 leading-relaxed mb-6">
              Si tu pedido no llega en el plazo indicado o llega con daños,
              contáctanos de inmediato. Resolveremos tu caso lo antes posible.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              {/* Email */}
              <Link
                href="mailto:info@bloomsy.cl"
                className="flex items-center gap-3 border border-black/15 bg-white/50 px-5 py-4 hover:border-bloomsy-black transition-colors group"
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

              {/* WhatsApp */}
              <Link
                href="https://wa.me/56992723158"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 border border-black/15 bg-white/50 px-5 py-4 hover:border-bloomsy-black transition-colors group"
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
            </div>
          </Section>

        </div>
      </div>
    </main>
  );
}
