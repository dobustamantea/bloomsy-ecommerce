"use client";

export default function NewsletterForm() {
  return (
    <form
      className="flex w-full md:w-auto gap-0"
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        type="email"
        required
        placeholder="tu@email.com"
        className="flex-1 md:w-64 bg-white/10 border border-white/20 px-4 py-3 text-sm placeholder:text-white/30 focus:outline-none focus:border-white/60 transition-colors"
      />
      <button
        type="submit"
        className="bg-bloomsy-cream text-bloomsy-black text-xs tracking-widest uppercase font-medium px-5 py-3 hover:bg-white transition-colors shrink-0"
      >
        Suscribirme
      </button>
    </form>
  );
}
