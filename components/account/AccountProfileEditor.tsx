"use client";

import type { FormEvent } from "react";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Loader2, Save } from "lucide-react";

interface AccountProfileEditorProps {
  name: string;
  email: string;
  phone: string | null;
}

const inputClassName =
  "w-full border border-black/15 bg-white/70 px-4 py-3 text-sm text-bloomsy-black outline-none transition-colors placeholder:text-black/30 focus:border-black";

export default function AccountProfileEditor({
  name,
  email,
  phone,
}: AccountProfileEditorProps) {
  const router = useRouter();
  const { update } = useSession();
  const [form, setForm] = useState({
    name,
    phone: phone ?? "",
  });
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function updateField(field: "name" | "phone", value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback("");
    setError("");

    startTransition(() => {
      void (async () => {
        const response = await fetch("/api/account/profile", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        });

        const result = await response.json();

        if (!response.ok) {
          setError(result.error ?? "No fue posible actualizar tus datos.");
          return;
        }

        await update({
          user: {
            name: result.user.name,
          },
        });

        setForm({
          name: result.user.name ?? "",
          phone: result.user.phone ?? "",
        });
        setFeedback("Tus datos fueron actualizados.");
        router.refresh();
      })();
    });
  }

  return (
    <section className="border border-black/10 bg-white/50 p-6 md:p-8">
      <p className="text-[10px] tracking-[0.28em] uppercase text-black/40">
        Perfil
      </p>
      <h2 className="mt-3 font-display text-3xl font-light">
        Tus datos
      </h2>
      <p className="mt-3 text-sm leading-7 text-black/60">
        Actualiza tu nombre y telefono para agilizar futuras compras.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label className="mb-1.5 block text-[10px] tracking-[0.22em] uppercase text-black/45">
            Nombre
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            className={inputClassName}
            placeholder="Tu nombre"
            required
          />
        </div>

        <div>
          <label className="mb-1.5 block text-[10px] tracking-[0.22em] uppercase text-black/45">
            Email
          </label>
          <input
            type="email"
            value={email}
            className={`${inputClassName} cursor-not-allowed bg-black/[0.03] text-black/45`}
            disabled
          />
          <p className="mt-2 text-xs text-black/45">
            Tu email de acceso no se modifica desde esta vista.
          </p>
        </div>

        <div>
          <label className="mb-1.5 block text-[10px] tracking-[0.22em] uppercase text-black/45">
            Telefono
          </label>
          <input
            type="tel"
            value={form.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            className={inputClassName}
            placeholder="+56 9 1234 5678"
          />
        </div>

        {error ? (
          <p className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </p>
        ) : null}

        {feedback ? (
          <p className="border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {feedback}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center gap-2 bg-bloomsy-black px-5 py-3 text-[11px] tracking-[0.22em] uppercase text-bloomsy-cream transition-colors hover:bg-bloomsy-gray disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save size={16} />
              Guardar cambios
            </>
          )}
        </button>
      </form>
    </section>
  );
}
