"use client";

import { useEffect, useState } from "react";

const MESSAGES = [
  "Envío gratis en compras sobre $50.000",
  "Tallas S a 4XL — porque el estilo no tiene talla",
  "Paga con Webpay o transferencia bancaria",
  "Despacho a todo Chile con Starken · 3 a 5 días hábiles",
];

export default function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % MESSAGES.length);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="bg-bloomsy-black text-bloomsy-cream text-xs tracking-widest uppercase text-center py-2 px-4 select-none">
      <span key={index} className="animate-in fade-in duration-500">
        {MESSAGES[index]}
      </span>
    </div>
  );
}
