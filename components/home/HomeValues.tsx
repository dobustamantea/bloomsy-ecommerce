import { Truck, Ruler, MessageCircle } from "lucide-react";

const VALUES = [
  {
    Icon: Truck,
    title: "Envío a todo Chile",
    subtitle: "$3.990 · Gratis sobre $50.000",
  },
  {
    Icon: Ruler,
    title: "Tallas S a 4XL",
    subtitle: "Para mujeres reales con estilo",
  },
  {
    Icon: MessageCircle,
    title: "Cambios fáciles",
    subtitle: "Coordina por WhatsApp",
  },
] as const;

export default function HomeValues() {
  return (
    <section className="bg-bloomsy-black text-bloomsy-cream">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {VALUES.map(({ Icon, title, subtitle }) => (
            <div
              key={title}
              className="flex flex-col items-center md:items-start text-center md:text-left gap-4"
            >
              <Icon
                size={26}
                strokeWidth={1.25}
                className="text-bloomsy-cream/60"
              />
              <div>
                <p className="text-sm font-medium tracking-wide text-bloomsy-cream">
                  {title}
                </p>
                <p className="text-[13px] text-bloomsy-cream/45 mt-1.5 leading-snug">
                  {subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
