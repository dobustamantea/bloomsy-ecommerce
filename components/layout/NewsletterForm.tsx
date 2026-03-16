"use client";

import type { FormEvent } from "react";
import { useState, useTransition } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback("");
    setError("");

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
          setError(result.error ?? "No fue posible suscribirte.");
          return;
        }

        setFeedback(result.message ?? "Te suscribiste correctamente.");
        setEmail("");
      })();
    });
  }

  return (
    <div className="w-full md:w-auto">
      <form className="flex w-full md:w-auto gap-0" onSubmit={handleSubmit}>
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="tu@email.com"
          className="flex-1 md:w-64 bg-white/10 border border-white/20 px-4 py-3 text-sm placeholder:text-white/30 focus:outline-none focus:border-white/60 transition-colors"
        />
        <button
          type="submit"
          disabled={isPending}
          className="bg-bloomsy-cream text-bloomsy-black text-xs tracking-widest uppercase font-medium px-5 py-3 hover:bg-white transition-colors shrink-0 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isPending ? "Enviando..." : "Suscribirme"}
        </button>
      </form>

      {error ? (
        <p className="mt-2 text-xs text-red-200">{error}</p>
      ) : null}

      {feedback ? (
        <p className="mt-2 text-xs text-white/80">{feedback}</p>
      ) : null}
    </div>
  );
}
