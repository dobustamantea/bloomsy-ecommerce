"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

const SESSION_KEY = "bloomsy_coming_soon_dismissed";

export default function ComingSoonBanner() {
  // Empieza oculto hasta que el cliente confirme que no fue cerrado
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem(SESSION_KEY);
    if (!dismissed) setVisible(true);
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

        {/* Spacer izquierdo (espeja el botón X para centrar el texto) */}
        <div className="w-6 flex-shrink-0" aria-hidden="true" />

        {/* Contenido central */}
        <p className="text-[12px] md:text-[13px] leading-snug text-center flex flex-wrap items-center justify-center gap-x-1.5">
          <span aria-hidden="true">🌸</span>
          <span>Estamos terminando los últimos detalles. ¡Muy pronto podrás comprar!</span>
          {/* Separador — oculto en mobile muy pequeño */}
          <span className="hidden sm:inline text-bloomsy-cream/30">·</span>
          <a
            href="#newsletter"
            onClick={handleClose}
            className="underline underline-offset-2 decoration-bloomsy-cream/50 hover:decoration-bloomsy-cream whitespace-nowrap transition-colors"
          >
            Suscríbete para ser la primera en enterarte
          </a>
        </p>

        {/* Botón cerrar */}
        <button
          onClick={handleClose}
          aria-label="Cerrar aviso"
          className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-bloomsy-cream/60 hover:text-bloomsy-cream transition-colors"
        >
          <X size={14} strokeWidth={2} />
        </button>

      </div>
    </div>
  );
}
