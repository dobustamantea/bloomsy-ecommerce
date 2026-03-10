"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

const SIZE_GUIDE = [
  { size: "S",   chest: "84–88",  waist: "66–70",  hip: "90–94"  },
  { size: "M",   chest: "89–93",  waist: "71–75",  hip: "95–99"  },
  { size: "L",   chest: "94–98",  waist: "76–80",  hip: "100–104"},
  { size: "XL",  chest: "99–103", waist: "81–85",  hip: "105–109"},
  { size: "0XL", chest: "104–110",waist: "86–92",  hip: "110–116"},
  { size: "1XL", chest: "111–117",waist: "93–99",  hip: "117–123"},
  { size: "2XL", chest: "118–124",waist: "100–106",hip: "124–130"},
  { size: "3XL", chest: "125–131",waist: "107–113",hip: "131–137"},
  { size: "4XL", chest: "132–138",waist: "114–120",hip: "138–144"},
];

export default function SizeGuideModal() {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="text-[11px] text-black/50 underline underline-offset-2 hover:text-black transition-colors">
          Guía de tallas
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-bloomsy-cream w-full max-w-lg max-h-[90dvh] overflow-y-auto p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <Dialog.Title className="font-display text-2xl font-light">
              Guía de tallas
            </Dialog.Title>
            <Dialog.Close asChild>
              <button aria-label="Cerrar" className="text-black/40 hover:text-black transition-colors">
                <X size={18} />
              </button>
            </Dialog.Close>
          </div>

          <p className="text-xs text-black/50 mb-5 leading-relaxed">
            Medidas en centímetros. Si estás entre dos tallas, elige la mayor para mayor comodidad.
          </p>

          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-black/10">
                <th className="text-left text-[10px] tracking-widest uppercase text-black/40 py-2 pr-4">Talla</th>
                <th className="text-left text-[10px] tracking-widest uppercase text-black/40 py-2 pr-4">Busto</th>
                <th className="text-left text-[10px] tracking-widest uppercase text-black/40 py-2 pr-4">Cintura</th>
                <th className="text-left text-[10px] tracking-widest uppercase text-black/40 py-2">Cadera</th>
              </tr>
            </thead>
            <tbody>
              {SIZE_GUIDE.map((row) => (
                <tr key={row.size} className="border-b border-black/5">
                  <td className="py-2.5 pr-4 font-medium">{row.size}</td>
                  <td className="py-2.5 pr-4 text-black/70">{row.chest}</td>
                  <td className="py-2.5 pr-4 text-black/70">{row.waist}</td>
                  <td className="py-2.5 text-black/70">{row.hip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
