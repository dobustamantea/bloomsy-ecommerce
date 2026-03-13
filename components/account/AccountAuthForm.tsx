"use client";

import { FormEvent, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type AuthTab = "login" | "register";

const tabCopy: Record<
  AuthTab,
  {
    title: string;
    subtitle: string;
    submitLabel: string;
  }
> = {
  login: {
    title: "Inicia sesion",
    subtitle: "Accede a tu cuenta, revisa tus pedidos y administra tu perfil.",
    submitLabel: "Entrar",
  },
  register: {
    title: "Crea tu cuenta",
    subtitle: "Guarda tus datos y manten tu historial de compras siempre a mano.",
    submitLabel: "Crear cuenta",
  },
};

const inputClassName =
  "w-full border border-black/15 bg-white/60 px-4 py-3 text-sm text-bloomsy-black outline-none transition-colors placeholder:text-black/30 focus:border-black";

export default function AccountAuthForm() {
  const router = useRouter();
  const [tab, setTab] = useState<AuthTab>("login");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const copy = tabCopy[tab];

  async function handleGoogleSignIn() {
    setError("");
    await signIn("google", { redirectTo: "/account" });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    startTransition(() => {
      void (async () => {
        if (tab === "register") {
          const registerResponse = await fetch("/api/auth/register", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, email, password }),
          });

          const registerResult = await registerResponse.json();

          if (!registerResponse.ok) {
            setError(registerResult.error ?? "No fue posible crear la cuenta.");
            return;
          }
        }

        const loginResult = await signIn("credentials", {
          email,
          password,
          redirect: false,
          redirectTo: "/account",
        });

        if (!loginResult?.ok) {
          setError(
            loginResult?.error === "CredentialsSignin"
              ? "Email o contrasena incorrectos."
              : "No fue posible iniciar sesion."
          );
          return;
        }

        router.push(loginResult.url ?? "/account");
        router.refresh();
      })();
    });
  }

  return (
    <section className="max-w-[1100px] mx-auto px-4 md:px-8 py-12 md:py-16">
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-stretch">
        <div className="border border-black/10 bg-white/40 p-8 md:p-10">
          <p className="text-[10px] tracking-[0.32em] uppercase text-black/45">
            Mi cuenta
          </p>
          <h1 className="mt-4 font-display text-4xl md:text-5xl font-light leading-none">
            Bienvenida a Bloomsy
          </h1>
          <p className="mt-5 max-w-md text-sm leading-7 text-black/60">
            Inicia sesion para ver tus pedidos o crea una cuenta para guardar
            tus accesos de compra. Tambien puedes entrar con Google.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              "Historial de compras",
              "Acceso rapido desde cualquier dispositivo",
              "Ingreso con Google o email",
            ].map((item) => (
              <div
                key={item}
                className="border border-black/10 bg-bloomsy-cream/70 px-4 py-4 text-xs leading-6 text-black/60"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="border border-black/10 bg-bloomsy-cream p-6 md:p-8">
          <div className="grid grid-cols-2 gap-2 bg-black/5 p-1">
            {(["login", "register"] as AuthTab[]).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  setError("");
                  setTab(option);
                }}
                className={cn(
                  "px-4 py-3 text-[10px] tracking-[0.24em] uppercase transition-colors",
                  tab === option
                    ? "bg-bloomsy-black text-bloomsy-cream"
                    : "text-black/60 hover:text-bloomsy-black"
                )}
              >
                {option === "login" ? "Login" : "Registro"}
              </button>
            ))}
          </div>

          <div className="mt-8">
            <p className="text-[10px] tracking-[0.28em] uppercase text-black/40">
              {tab === "login" ? "Acceso" : "Nuevo perfil"}
            </p>
            <h2 className="mt-3 font-display text-3xl font-light">
              {copy.title}
            </h2>
            <p className="mt-3 text-sm leading-7 text-black/60">
              {copy.subtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="mt-8 flex w-full items-center justify-center gap-2 border border-black/15 bg-white px-4 py-3 text-[11px] tracking-[0.22em] uppercase transition-colors hover:border-black"
          >
            Continuar con Google
          </button>

          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-black/10" />
            <span className="text-[10px] tracking-[0.24em] uppercase text-black/35">
              o con email
            </span>
            <div className="h-px flex-1 bg-black/10" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {tab === "register" ? (
              <div>
                <label
                  htmlFor="name"
                  className="mb-1.5 block text-[10px] tracking-[0.24em] uppercase text-black/45"
                >
                  Nombre
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Maria Gonzalez"
                  className={inputClassName}
                  required
                />
              </div>
            ) : null}

            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-[10px] tracking-[0.24em] uppercase text-black/45"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="tu@email.com"
                className={inputClassName}
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-[10px] tracking-[0.24em] uppercase text-black/45"
              >
                Contrasena
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={tab === "login" ? "current-password" : "new-password"}
                placeholder="Minimo 8 caracteres"
                minLength={8}
                className={inputClassName}
                required
              />
            </div>

            {error ? (
              <p className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isPending}
              className="flex w-full items-center justify-center gap-2 bg-bloomsy-black px-4 py-3 text-[11px] tracking-[0.24em] uppercase text-bloomsy-cream transition-colors hover:bg-bloomsy-gray disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  {copy.submitLabel}
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
