"use client";

import type { FormEvent } from "react";
import { useEffect, useState, useTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Instagram, Mail } from "lucide-react";

const LS_KEY = "bloomsy_modal_seen";

export default function ComingSoonModal() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!localStorage.getItem(LS_KEY)) {
      setOpen(true);
    }
  }, []);

  function dismiss() {
    localStorage.setItem(LS_KEY, "1");
    setOpen(false);
  }

  function validateEmail(value: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validateEmail(email)) {
      setEmailError("Ingresa un email valido.");
      return;
    }

    setEmailError("");
    setFeedback("");

    startTransition(() => {
      void (async () => {
        const response = await fetch("/api/newsletter", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });

        const result = await response.json();

        if (!response.ok) {
          setEmailError(result.error ?? "No fue posible suscribirte.");
          return;
        }

        setSubmitted(true);
        setFeedback(result.message ?? "Listo, te avisaremos pronto.");
        setTimeout(() => dismiss(), 2000);
      })();
    });
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
          aria-modal="true"
          role="dialog"
          aria-labelledby="csm-title"
        >
          <motion.div
            key="panel"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex max-h-[90vh] w-full max-w-[520px] flex-col items-center overflow-y-auto rounded-[4px] bg-bloomsy-cream px-7 py-10 text-center md:px-10 md:py-12"
          >
            <p className="select-none font-display text-[22px] uppercase tracking-[0.18em] text-bloomsy-black md:text-[24px]">
              Bloomsy
            </p>

            <div className="mt-4 mb-5 h-px w-10 bg-bloomsy-black" />

            <p className="mb-4 text-[11px] uppercase tracking-[0.4em] text-bloomsy-black">
              Muy pronto
            </p>

            <h2
              id="csm-title"
              className="mb-4 font-display text-[32px] font-light leading-[1.1] text-bloomsy-black md:text-[42px]"
            >
              Estamos preparando
              <br />
              algo especial
            </h2>

            <p className="mb-8 max-w-[360px] text-[13px] leading-relaxed text-black/55 md:text-[14px]">
              La nueva coleccion Bloomsy llega pronto. Suscribete y se la
              primera en descubrirla, con{" "}
              <strong className="font-medium text-bloomsy-black">10% off</strong>{" "}
              en tu primera compra.
            </p>

            {submitted ? (
              <div className="mb-6 flex w-full items-center justify-center gap-2 border border-bloomsy-black px-4 py-3 text-[13px] text-bloomsy-black">
                <span>OK</span>
                <span>{feedback || "Listo, te avisaremos pronto."}</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="mb-2 w-full">
                <div className="flex w-full items-stretch">
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      if (emailError) {
                        setEmailError("");
                      }
                    }}
                    placeholder="tu@email.com"
                    aria-label="Tu email"
                    className="min-w-0 flex-1 border border-r-0 border-bloomsy-black bg-white px-3 py-3 text-[13px] text-bloomsy-black outline-none placeholder:text-black/30 focus:ring-1 focus:ring-bloomsy-black"
                  />
                  <button
                    type="submit"
                    disabled={isPending}
                    className="shrink-0 whitespace-nowrap bg-bloomsy-black px-5 py-3 text-[11px] uppercase tracking-widest text-bloomsy-cream transition-colors hover:bg-bloomsy-gray disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isPending ? "Enviando..." : "Suscribirme ->"}
                  </button>
                </div>
                {emailError ? (
                  <p className="mt-1.5 pl-0.5 text-left text-[11px] text-red-600">
                    {emailError}
                  </p>
                ) : null}
              </form>
            )}

            <button
              onClick={dismiss}
              className="mt-3 mb-8 text-[13px] text-bloomsy-black underline decoration-black/30 underline-offset-2 transition-colors hover:decoration-black"
            >
              Ya conozco la tienda, quiero explorar {"->"}
            </button>

            <div className="flex items-center gap-5">
              <a
                href="https://instagram.com/bloomsy.cl"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram @bloomsy.cl"
                className="text-black/30 transition-colors hover:text-bloomsy-black"
              >
                <Instagram size={17} strokeWidth={1.5} />
              </a>
              <a
                href="mailto:info@bloomsy.cl"
                aria-label="Email info@bloomsy.cl"
                className="text-black/30 transition-colors hover:text-bloomsy-black"
              >
                <Mail size={17} strokeWidth={1.5} />
              </a>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
