"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductAccordionsProps {
  description: string;
  care: string[];
}

export default function ProductAccordions({ description, care }: ProductAccordionsProps) {
  return (
    <Accordion.Root type="multiple" defaultValue={["description"]} className="border-t border-black/10">
      {/* Description */}
      <Accordion.Item value="description" className="border-b border-black/10">
        <Accordion.Header>
          <Accordion.Trigger className="group flex w-full items-center justify-between py-4 text-[11px] tracking-widest uppercase text-black/60 hover:text-black transition-colors">
            Descripción
            <ChevronDown
              size={14}
              className="transition-transform group-data-[state=open]:rotate-180"
            />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
          <p className="text-sm text-black/70 leading-relaxed pb-5">{description}</p>
        </Accordion.Content>
      </Accordion.Item>

      {/* Care */}
      <Accordion.Item value="care" className="border-b border-black/10">
        <Accordion.Header>
          <Accordion.Trigger className="group flex w-full items-center justify-between py-4 text-[11px] tracking-widest uppercase text-black/60 hover:text-black transition-colors">
            Instrucciones de cuidado
            <ChevronDown
              size={14}
              className="transition-transform group-data-[state=open]:rotate-180"
            />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
          <ul className="pb-5 space-y-1.5">
            {care.map((instruction, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-black/70">
                <span className="w-1 h-1 rounded-full bg-black/30 mt-2 flex-shrink-0" />
                {instruction}
              </li>
            ))}
          </ul>
        </Accordion.Content>
      </Accordion.Item>

      {/* Shipping */}
      <Accordion.Item value="shipping" className="border-b border-black/10">
        <Accordion.Header>
          <Accordion.Trigger className="group flex w-full items-center justify-between py-4 text-[11px] tracking-widest uppercase text-black/60 hover:text-black transition-colors">
            Envíos y devoluciones
            <ChevronDown
              size={14}
              className="transition-transform group-data-[state=open]:rotate-180"
            />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
          <div className="pb-5 text-sm text-black/70 space-y-2 leading-relaxed">
            <p>Envíos a todo Chile vía Starken. Costo $3.990, gratis en compras sobre $50.000.</p>
            <p>Tiempo de entrega: 3–5 días hábiles desde confirmación del pago.</p>
            <p>Cambios y devoluciones hasta 10 días después de recibir el pedido. El producto debe estar sin uso, con etiquetas originales.</p>
          </div>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}
