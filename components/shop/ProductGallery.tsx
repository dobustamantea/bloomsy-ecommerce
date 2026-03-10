"use client";

import { useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: string[];
  name: string;
}

export default function ProductGallery({ images, name }: ProductGalleryProps) {
  const [selected, setSelected] = useState(0);
  const [emblaRef] = useEmblaCarousel({ loop: true });

  return (
    <div className="flex gap-3">
      {/* Thumbnails — desktop only */}
      <div className="hidden md:flex flex-col gap-2 w-16 flex-shrink-0">
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            className={cn(
              "relative aspect-square overflow-hidden border transition-colors",
              selected === i ? "border-bloomsy-black" : "border-transparent hover:border-black/30"
            )}
          >
            <Image
              src={src}
              alt={`${name} miniatura ${i + 1}`}
              fill
              className="object-cover"
              sizes="64px"
            />
          </button>
        ))}
      </div>

      {/* Main image — desktop */}
      <div className="hidden md:block relative flex-1 aspect-[3/4] bg-[#F7F5F0] overflow-hidden">
        <Image
          src={images[selected]}
          alt={name}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 1024px) 50vw, 40vw"
        />
      </div>

      {/* Embla carousel — mobile */}
      <div className="md:hidden w-full overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {images.map((src, i) => (
            <div
              key={i}
              className="relative flex-[0_0_100%] aspect-[3/4] bg-[#F7F5F0]"
            >
              <Image
                src={src}
                alt={`${name} ${i + 1}`}
                fill
                priority={i === 0}
                className="object-cover"
                sizes="100vw"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
