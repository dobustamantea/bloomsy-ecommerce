import type { Metadata } from "next";
import Link from "next/link";
import { Mail, Phone, Instagram, Truck } from "lucide-react";
import ContactForm from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contacto — Bloomsy",
  description:
    "Escríbenos por email, WhatsApp o Instagram. Estamos para ayudarte de lunes a viernes.",
};

/* ── Info items ──────────────────────────────────────────────────── */
const INFO = [
  {
    Icon: Mail,
    title: "Email",
    content: (
      <Link
        href="mailto:info@bloomsy.cl"
        className="text-[15px] text-black/70 hover:text-bloomsy-black transition-colors underline underline-offset-2"
      >
        info@bloomsy.cl
      </Link>
    ),
  },
  {
    Icon: Phone,
    title: "WhatsApp",
    content: (
      <div className="flex flex-col gap-0.5">
        <Link
          href="https://wa.me/56992723158"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[15px] text-black/70 hover:text-bloomsy-black transition-colors underline underline-offset-2"
        >
          +56 9 9272 3158
        </Link>
        <span className="text-[12px] text-black/40">
          Lunes a viernes 10:00 – 19:00 hrs
        </span>
      </div>
    ),
  },
  {
    Icon: Instagram,
    title: "Instagram",
    content: (
      <Link
        href="https://instagram.com/bloomsy.cl"
        target="_blank"
        rel="noopener noreferrer"
        className="text-[15px] text-black/70 hover:text-bloomsy-black transition-colors underline underline-offset-2"
      >
        @bloomsy.cl
      </Link>
    ),
  },
  {
    Icon: Truck,
    title: "Envíos",
    content: (
      <div className="flex flex-col gap-0.5">
        <span className="text-[15px] text-black/70">
          Despachamos a todo Chile vía Starken
        </span>
        <span className="text-[12px] text-black/40 leading-relaxed">
          $3.990 · Gratis sobre $50.000 · 3–5 días hábiles
        </span>
      </div>
    ),
  },
];

/* ══════════════════════════════════════════════════════════════════ */
export default function ContactoPage() {
  return (
    <main className="bg-bloomsy-cream min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-14 md:py-20">

        {/* ── Page header ─────────────────────────────────────────── */}
        <div className="mb-12 md:mb-16">
          <p className="text-[10px] tracking-[0.35em] uppercase text-black/35 mb-4">
            Contacto
          </p>
          <h1 className="font-display text-[48px] md:text-[64px] font-light leading-[1] mb-3">
            Hablemos
          </h1>
          <p className="text-[15px] text-black/50">
            Estamos para ayudarte. Responderemos a la brevedad.
          </p>
        </div>

        {/* ── 2-column layout ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

          {/* ── Columna izquierda: datos de contacto ──────────────── */}
          <div className="flex flex-col gap-8">
            {INFO.map(({ Icon, title, content }) => (
              <div key={title} className="flex items-start gap-4">
                {/* Ícono */}
                <div className="w-10 h-10 rounded-full bg-bloomsy-black flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon size={16} strokeWidth={1.5} className="text-bloomsy-cream" />
                </div>

                {/* Texto */}
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] tracking-widest uppercase text-black/35">
                    {title}
                  </span>
                  {content}
                </div>
              </div>
            ))}

            {/* Separador decorativo */}
            <div className="border-t border-black/10 pt-8 mt-2">
              <p className="text-[12px] text-black/35 leading-relaxed">
                ¿Prefieres escribirnos directo? Estamos en WhatsApp e Instagram
                todos los días. Solemos responder en menos de una hora durante
                el horario de atención.
              </p>
            </div>
          </div>

          {/* ── Columna derecha: formulario ───────────────────────── */}
          <div className="bg-bloomsy-cream border border-black/10 p-6 md:p-8">
            <p className="text-[11px] tracking-widest uppercase text-black/35 mb-6">
              Envíanos un mensaje
            </p>
            <ContactForm />
          </div>
        </div>
      </div>
    </main>
  );
}
