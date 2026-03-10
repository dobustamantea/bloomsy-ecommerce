import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <p className="text-[10px] tracking-[0.3em] uppercase text-black/40 mb-4">
        Error 404
      </p>
      <h1 className="font-display text-5xl md:text-7xl font-light leading-none tracking-wide mb-6">
        Página no encontrada
      </h1>
      <p className="text-black/60 max-w-xs text-sm leading-relaxed mb-8">
        La página que buscas no existe o fue movida.
      </p>
      <Link
        href="/"
        className="bg-bloomsy-black text-bloomsy-cream text-xs tracking-widest uppercase px-8 py-3 hover:bg-bloomsy-gray transition-colors"
      >
        Volver al inicio
      </Link>
    </section>
  );
}
