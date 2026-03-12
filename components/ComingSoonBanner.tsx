"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

const SESSION_KEY = "bloomsy_banner_closed";

export default function ComingSoonBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!sessionStorage.getItem(SESSION_KEY)) setVisible(true);
  }, []);

  function handleClose() {
    sessionStorage.setItem(SESSION_KEY, "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="banner"
      aria-label="Aviso: tienda en construcción"
      className="relative z-50 bg-bloomsy-black text-bloomsy-cream"
    >
      <div className="max-w-[1400px] mx-auto px-4 flex items-center justify-between min-h-[44px] py-2 gap-3">
        {/* Spacer izquierdo — espeja el X para centrar el texto */}
        <div className="w-6 flex-shrink-0" aria-hidden="true" />

        <p className="text-[12px] md:text-[13px] tracking-wide text-center">
          <span aria-hidden="true">🌸</span>{" "}
          Estamos terminando los últimos detalles — ¡muy pronto!
        </p>

        <button
          onClick={handleClose}
          aria-label="Cerrar aviso"
          className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-bloomsy-cream/50 hover:text-bloomsy-cream transition-colors"
        >
          <X size={14} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
