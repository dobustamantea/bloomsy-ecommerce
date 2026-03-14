import Link from "next/link";
import { Instagram, Mail, Phone } from "lucide-react";
import NewsletterForm from "./NewsletterForm";
import FeatureStrip from "./FeatureStrip";

const SHOP_LINKS = [
  { label: "Ver todo", href: "/shop" },
  { label: "Novedades", href: "/shop?sort=newest" },
  { label: "Poleras", href: "/categoria/poleras" },
  { label: "Abrigos", href: "/categoria/abrigos" },
  { label: "Conjuntos", href: "/categoria/conjuntos" },
];

const HELP_LINKS = [
  { label: "Política de envíos", href: "/envios" },
  { label: "Cambios y devoluciones", href: "/cambios-y-devoluciones" },
  { label: "Guía de tallas", href: "/guia-de-tallas" },
  { label: "Contacto", href: "/contacto" },
  { label: "Sobre Bloomsy", href: "/about" },
];

const LEGAL_LINKS = [
  { label: "Términos y condiciones", href: "/terminos" },
  { label: "Política de privacidad", href: "/privacidad" },
];

export default function Footer() {
  return (
    <footer className="bg-bloomsy-black text-bloomsy-cream mt-auto">
      <FeatureStrip />

      {/* Newsletter band */}
      <div className="border-b border-white/10">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-10 md:py-14 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="max-w-sm">
            <p className="font-display text-2xl md:text-3xl leading-snug">
              Sé la primera en saber
            </p>
            <p className="text-white/50 text-sm mt-1">
              Novedades, lanzamientos y 10% off en tu primera compra.
            </p>
          </div>
          <NewsletterForm />
        </div>
      </div>

      {/* Main footer grid */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        {/* Brand column */}
        <div className="col-span-2 md:col-span-1 space-y-4">
          <Link
            href="/"
            className="font-display text-2xl tracking-[0.18em] uppercase font-light"
          >
            Bloomsy
          </Link>
          <p className="text-white/50 text-xs leading-relaxed">
            High Modern Style. Ropa femenina chilena para mujeres reales con
            estilo. Tallas S a 4XL.
          </p>
          <div className="flex items-center gap-3 pt-1">
            <a
              href="https://instagram.com/bloomsy.cl"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white/60 transition-colors"
              aria-label="Instagram de Bloomsy"
            >
              <Instagram size={18} />
            </a>
            <a
              href="mailto:info@bloomsy.cl"
              className="hover:text-white/60 transition-colors"
              aria-label="Email"
            >
              <Mail size={18} />
            </a>
            <a
              href="https://wa.me/56992723158"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white/60 transition-colors"
              aria-label="WhatsApp"
            >
              <Phone size={18} />
            </a>
          </div>
        </div>

        {/* Shop column */}
        <div>
          <p className="text-[10px] tracking-widest uppercase text-white/40 mb-4">
            Tienda
          </p>
          <ul className="space-y-2.5">
            {SHOP_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Help column */}
        <div>
          <p className="text-[10px] tracking-widest uppercase text-white/40 mb-4">
            Ayuda
          </p>
          <ul className="space-y-2.5">
            {HELP_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact column */}
        <div>
          <p className="text-[10px] tracking-widest uppercase text-white/40 mb-4">
            Contacto
          </p>
          <ul className="space-y-2.5 text-sm text-white/70">
            <li>
              <a
                href="mailto:info@bloomsy.cl"
                className="hover:text-white transition-colors"
              >
                info@bloomsy.cl
              </a>
            </li>
            <li>
              <a
                href="https://wa.me/56992723158"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                +56 9 9272 3158
              </a>
            </li>
            <li>
              <a
                href="https://instagram.com/bloomsy.cl"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                @bloomsy.cl
              </a>
            </li>
          </ul>
          <div className="mt-6">
            <p className="text-[10px] tracking-widest uppercase text-white/40 mb-2">
              Envíos
            </p>
            <p className="text-xs text-white/50 leading-relaxed">
              Todo Chile vía StarKen
              <br />
              $3.990 · Gratis sobre $65.000
              <br />
              3–5 días hábiles
            </p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-white/30">
          <p>© {new Date().getFullYear()} Bloomsy. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4">
            {LEGAL_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-white/60 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
