import Image from "next/image";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export default function Hero() {
  const waUrl = buildWhatsAppUrl();

  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center justify-center"
      aria-label="Sección principal"
    >
      <Image
        src="/hero.jpg"
        alt="Matafuegos en acción"
        fill
        className="object-cover object-center"
        priority
        quality={90}
      />

      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{
          background: 'radial-gradient(ellipse at 64% 50%, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0.42) 50%, rgba(0,0,0,0.72) 100%)'
        }}
      />

      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <p className="text-[var(--color-brand-red)] font-semibold text-sm sm:text-base uppercase tracking-widest mb-4">
          CasaSener — Insumos Contra Incendio
        </p>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
          Servicio integral de matafuegos
          <br />
          <span className="text-[var(--color-brand-red)]">
            y seguridad contra incendios
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-white/85 max-w-2xl mx-auto mb-10">
          Recargamos, controlamos y asesoramos.
          <br className="hidden sm:block" />
          Rápido, legal y sin complicaciones.
        </p>

        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-shimmer inline-flex items-center gap-2 bg-[var(--color-brand-red)] hover:bg-[var(--color-brand-red-dark)] text-white font-bold px-8 py-4 rounded-xl text-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent"
          aria-label="Solicitar presupuesto por WhatsApp"
        >
          Solicitar presupuesto
        </a>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1" aria-hidden="true">
          <span className="block w-px h-8 bg-gradient-to-b from-transparent to-white/40 animate-pulse" />
          <span className="block w-1.5 h-1.5 rounded-full bg-white/40 animate-pulse" style={{animationDelay:'0.3s'}} />
        </div>
      </div>
    </section>
  );
}
