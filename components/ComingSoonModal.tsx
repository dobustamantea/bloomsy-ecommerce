"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Instagram, Mail } from "lucide-react";

const LS_KEY = "bloomsy_modal_seen";

export default function ComingSoonModal() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  /* Mostrar solo si nunca se ha visto antes (localStorage) */
  useEffect(() => {
    if (!localStorage.getItem(LS_KEY)) setOpen(true);
  }, []);

  function dismiss() {
    localStorage.setItem(LS_KEY, "1");
    setOpen(false);
  }

  function validateEmail(value: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateEmail(email)) {
      setEmailError("Ingresa un email válido.");
      return;
    }
    setEmailError("");
    setSubmitted(true);
    /* TODO Fase 2: enviar a Resend */
    setTimeout(() => dismiss(), 2000);
  }

  return (
    <AnimatePresence>
      {open && (
        /* ── Overlay ─────────────────────────────────────────── */
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
          /* No cierra al hacer clic fuera */
          aria-modal="true"
          role="dialog"
          aria-labelledby="csm-title"
        >
          {/* ── Panel ─────────────────────────────────────────── */}
          <motion.div
            key="panel"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-full max-w-[520px] bg-bloomsy-cream rounded-[4px] px-7 py-10 md:px-10 md:py-12 flex flex-col items-center text-center overflow-y-auto max-h-[90vh]"
          >
            {/* Wordmark */}
            <p className="font-display text-[22px] md:text-[24px] tracking-[0.18em] uppercase text-bloomsy-black select-none">
              Bloomsy
            </p>

            {/* Separador */}
            <div className="w-10 h-px bg-bloomsy-black mt-4 mb-5" />

            {/* Eyebrow */}
            <p className="text-[11px] tracking-[0.4em] uppercase text-bloomsy-black mb-4">
              Muy pronto
            </p>

            {/* Título */}
            <h2
              id="csm-title"
              className="font-display text-[32px] md:text-[42px] font-light leading-[1.1] text-bloomsy-black mb-4"
            >
              Estamos preparando
              <br />
              algo especial
            </h2>

            {/* Subtítulo */}
            <p className="text-[13px] md:text-[14px] text-black/55 leading-relaxed mb-8 max-w-[360px]">
              La nueva colección Bloomsy llega pronto. Suscríbete y sé la
              primera en descubrirla — con{" "}
              <strong className="text-bloomsy-black font-medium">
                10% off
              </strong>{" "}
              en tu primera compra.
            </p>

            {/* Formulario */}
            {submitted ? (
              <div className="w-full flex items-center justify-center gap-2 border border-bloomsy-black px-4 py-3 mb-6 text-[13px] text-bloomsy-black">
                <span>✓</span>
                <span>¡Listo! Te avisaremos pronto.</span>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                className="w-full mb-2"
              >
                <div className="flex items-stretch w-full">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError("");
                    }}
                    placeholder="tu@email.com"
                    aria-label="Tu email"
                    className="flex-1 min-w-0 bg-white border border-bloomsy-black border-r-0 px-3 py-3 text-[13px] text-bloomsy-black placeholder:text-black/30 outline-none focus:ring-1 focus:ring-bloomsy-black"
                  />
                  <button
                    type="submit"
                    className="flex-shrink-0 bg-bloomsy-black text-bloomsy-cream text-[11px] tracking-widest uppercase px-5 py-3 hover:bg-bloomsy-gray transition-colors whitespace-nowrap"
                  >
                    Suscribirme →
                  </button>
                </div>
                {emailError && (
                  <p className="text-[11px] text-red-600 text-left mt-1.5 pl-0.5">
                    {emailError}
                  </p>
                )}
              </form>
            )}

            {/* Skip link */}
            <button
              onClick={dismiss}
              className="text-[13px] text-bloomsy-black underline underline-offset-2 decoration-black/30 hover:decoration-black transition-colors mt-3 mb-8"
            >
              Ya conozco la tienda, quiero explorar →
            </button>

            {/* Íconos sociales */}
            <div className="flex items-center gap-5">
              <a
                href="https://instagram.com/bloomsy.cl"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram @bloomsy.cl"
                className="text-black/30 hover:text-bloomsy-black transition-colors"
              >
                <Instagram size={17} strokeWidth={1.5} />
              </a>
              <a
                href="mailto:info@bloomsy.cl"
                aria-label="Email info@bloomsy.cl"
                className="text-black/30 hover:text-bloomsy-black transition-colors"
              >
                <Mail size={17} strokeWidth={1.5} />
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
