"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Schema ─────────────────────────────────────────────────────── */
const ASUNTO_OPTIONS = [
  "Consulta sobre un producto",
  "Estado de mi pedido",
  "Cambios y devoluciones",
  "Otro",
] as const;

const contactSchema = z.object({
  nombre: z.string().min(2, "Ingresa tu nombre completo"),
  email: z.string().email("Ingresa un email válido"),
  asunto: z.enum(ASUNTO_OPTIONS, { required_error: "Elige un asunto" }),
  mensaje: z.string().min(10, "El mensaje debe tener al menos 10 caracteres"),
});

type ContactData = z.infer<typeof contactSchema>;

/* ── Shared input styles ─────────────────────────────────────────── */
const inputBase =
  "w-full border border-black/15 bg-white px-4 py-3 text-[14px] text-bloomsy-black placeholder:text-black/30 outline-none focus:border-bloomsy-black transition-colors";

/* ── Component ───────────────────────────────────────────────────── */
export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactData>({
    resolver: zodResolver(contactSchema),
  });

  async function onSubmit(data: ContactData) {
    // Simulación de envío — Fase 2: integrar con Resend
    await new Promise((r) => setTimeout(r, 900));
    setSubmittedEmail(data.email);
    setSubmitted(true);
  }

  /* Estado de éxito */
  if (submitted) {
    return (
      <div className="flex flex-col items-start gap-3 py-10">
        <div className="w-10 h-10 rounded-full bg-bloomsy-black flex items-center justify-center flex-shrink-0">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-bloomsy-cream"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <div>
          <p className="text-[15px] font-medium text-bloomsy-black mb-1">
            ¡Mensaje enviado!
          </p>
          <p className="text-[14px] text-black/55 leading-relaxed">
            Te responderemos pronto a{" "}
            <span className="text-bloomsy-black font-medium">
              {submittedEmail}
            </span>
            .
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      {/* Nombre */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] tracking-widest uppercase text-black/45">
          Nombre completo
        </label>
        <input
          {...register("nombre")}
          type="text"
          placeholder="Tu nombre"
          className={cn(inputBase, errors.nombre && "border-red-400")}
        />
        {errors.nombre && (
          <p className="text-[12px] text-red-500">{errors.nombre.message}</p>
        )}
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] tracking-widest uppercase text-black/45">
          Email
        </label>
        <input
          {...register("email")}
          type="email"
          placeholder="tu@email.com"
          className={cn(inputBase, errors.email && "border-red-400")}
        />
        {errors.email && (
          <p className="text-[12px] text-red-500">{errors.email.message}</p>
        )}
      </div>

      {/* Asunto */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] tracking-widest uppercase text-black/45">
          Asunto
        </label>
        <select
          {...register("asunto")}
          defaultValue=""
          className={cn(
            inputBase,
            "appearance-none cursor-pointer",
            errors.asunto && "border-red-400"
          )}
        >
          <option value="" disabled>
            Selecciona un asunto
          </option>
          {ASUNTO_OPTIONS.map((op) => (
            <option key={op} value={op}>
              {op}
            </option>
          ))}
        </select>
        {errors.asunto && (
          <p className="text-[12px] text-red-500">{errors.asunto.message}</p>
        )}
      </div>

      {/* Mensaje */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] tracking-widest uppercase text-black/45">
          Mensaje
        </label>
        <textarea
          {...register("mensaje")}
          rows={5}
          placeholder="Cuéntanos en qué podemos ayudarte..."
          className={cn(
            inputBase,
            "resize-none",
            errors.mensaje && "border-red-400"
          )}
        />
        {errors.mensaje && (
          <p className="text-[12px] text-red-500">{errors.mensaje.message}</p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-bloomsy-black text-bloomsy-cream text-[11px] tracking-widest uppercase py-4 flex items-center justify-center gap-2 hover:bg-bloomsy-gray transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <Loader2 size={14} className="animate-spin" />
            Enviando…
          </>
        ) : (
          "Enviar mensaje"
        )}
      </button>
    </form>
  );
}
