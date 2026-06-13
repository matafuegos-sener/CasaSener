import Image from "next/image";
import QuoteModal from "./QuoteModal";

export default function Hero() {
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
        className="object-cover object-[90%_18%] sm:object-center"
        priority
        quality={90}
      />

      {/* Overlay mobile — gradiente vertical para legibilidad con fondo texturado */}
      <div
        className="sm:hidden absolute inset-0"
        aria-hidden="true"
        style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.35) 40%, rgba(0,0,0,0.55) 100%)' }}
      />

      {/* Overlay desktop — gradiente horizontal original */}
      <div
        className="hidden sm:block absolute inset-0"
        aria-hidden="true"
        style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.15) 28%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.65) 100%)' }}
      />

      {/* ── MOBILE: distribución vertical completa ── */}
      <div className="sm:hidden absolute inset-0 z-10 flex flex-col items-center text-center text-white px-5">

        {/* Etiqueta — margen superior con espacio cómodo */}
        <p className="mt-24 text-white/60 font-semibold text-[0.65rem] uppercase tracking-[0.18em]">
          Matafuegos Sener — Insumos Contra Incendio
        </p>

        {/* Título + subtítulo — centro vertical */}
        <div className="flex-1 flex flex-col items-center justify-center gap-5">
          <h1
            className="font-bold text-white w-full"
            style={{ fontSize: 'clamp(1.75rem, 8vw, 2.4rem)', letterSpacing: '-0.03em', lineHeight: 1.08 }}
          >
            <span className="hero-red-text block">Servicio integral</span>
            <span className="hero-red-text block">de matafuegos</span>
            <span className="block">y seguridad</span>
            <span className="block">contra incendios</span>
          </h1>

          <p className="text-xl text-white/85 leading-relaxed max-w-xs">
            Recargamos, controlamos<br />
            y asesoramos.<br />
            Rápido, legal y sin complicaciones.
          </p>
        </div>

        {/* CTA — margen inferior sobre el botón chatbot */}
        <div className="mb-28 flex justify-center">
          <QuoteModal variant="hero" />
        </div>
      </div>

      {/* ── DESKTOP: layout original centrado ── */}
      <div className="hidden sm:block relative z-10 text-center text-white max-w-4xl mx-auto px-6 lg:px-8 pt-16">
        <p className="text-white/70 font-semibold text-base uppercase tracking-widest mb-4">
          Matafuegos Sener — Insumos Contra Incendio
        </p>

        <h1 className="text-5xl lg:text-7xl font-bold leading-tight tracking-tight mb-6">
          <span className="hero-red-text">
            Servicio integral de matafuegos
          </span>
          <br />
          y seguridad contra incendios
        </h1>

        <p className="text-xl text-white/85 max-w-2xl mx-auto mb-10">
          Recargamos, controlamos y asesoramos.{" "}
          <br />
          Rápido, legal y sin complicaciones.
        </p>

        <div className="flex justify-center items-center">
          <QuoteModal variant="hero" />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none" aria-hidden="true"
        style={{ background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.12))' }} />

      {/* Scroll indicator — solo desktop */}
      <div className="hidden sm:flex absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex-col items-center gap-1" aria-hidden="true">
        <span className="block w-px h-8 bg-gradient-to-b from-transparent to-white/40 animate-pulse" />
        <span className="block w-1.5 h-1.5 rounded-full bg-white/40 animate-pulse" style={{ animationDelay: '0.3s' }} />
      </div>
    </section>
  );
}
