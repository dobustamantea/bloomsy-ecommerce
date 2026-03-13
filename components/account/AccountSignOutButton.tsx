"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { Loader2, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccountSignOutButtonProps {
  className?: string;
  label?: string;
  onComplete?: () => void;
}

export default function AccountSignOutButton({
  className,
  label = "Cerrar sesion",
  onComplete,
}: AccountSignOutButtonProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSignOut() {
    setError("");

    startTransition(() => {
      void (async () => {
        const result = await signOut({
          redirect: false,
          redirectTo: "/account",
        });

        if (result?.url) {
          onComplete?.();
          router.push(result.url);
          router.refresh();
          return;
        }

        setError("No fue posible cerrar la sesion.");
      })();
    });
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleSignOut}
        disabled={isPending}
        className={cn(
          "inline-flex items-center justify-center gap-2 border border-black/15 px-4 py-2.5 text-[10px] tracking-[0.24em] uppercase transition-colors hover:border-black hover:bg-black hover:text-bloomsy-cream disabled:cursor-not-allowed disabled:opacity-60",
          className
        )}
      >
        {isPending ? (
          <>
            <Loader2 size={14} className="animate-spin" />
            Saliendo...
          </>
        ) : (
          <>
            <LogOut size={14} />
            {label}
          </>
        )}
      </button>

      {error ? <p className="text-xs text-red-500">{error}</p> : null}
    </div>
  );
}
