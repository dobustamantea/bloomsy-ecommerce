import { Truck, RefreshCw, Ruler, Sparkles } from "lucide-react";
import Link from "next/link";

const FEATURES = [
  {
    icon: Truck,
    title: "Envío gratis",
    description: "En compras sobre $65.000 a todo Chile.",
    href: "/envios",
  },
  {
    icon: RefreshCw,
    title: "Cambios sin drama",
    description: "30 días para cambiar tu pedido.",
    href: "/cambios-y-devoluciones",
  },
  {
    icon: Ruler,
    title: "Guía de tallas",
    description: "Tallas S a 4XL. Encuentra tu fit perfecto.",
    href: "/guia-de-tallas",
  },
  {
    icon: Sparkles,
    title: "Diseño chileno",
    description: "Hecho para mujeres reales con estilo.",
    href: "/about",
  },
];

export default function FeatureStrip() {
  return (
    <div className="border-t border-black/8 bg-bloomsy-cream">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        <div className="grid grid-cols-2 divide-x divide-black/8 md:grid-cols-4">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link
                key={feature.title}
                href={feature.href}
                className="group flex flex-col items-center gap-3 px-4 py-8 text-center transition-colors hover:bg-black/[0.02] md:py-10"
              >
                <Icon
                  size={28}
                  strokeWidth={1.25}
                  className="text-bloomsy-black/70 transition-colors group-hover:text-bloomsy-black"
                />
                <div>
                  <p className="font-display text-base font-light underline underline-offset-4 decoration-black/30 group-hover:decoration-black transition-colors">
                    {feature.title}
                  </p>
                  <p className="mt-1 text-xs italic text-black/50 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
