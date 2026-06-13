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
        className="object-cover object-[5%_65%] sm:object-center"
        priority
        quality={90}
      />

      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{
          background: 'linear-gradient(to right, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.15) 28%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.65) 100%)'
        }}
      />

      {/* Contenido centrado — sin hijos absolute para evitar colisiones */}
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <p className="text-white/70 font-semibold text-xs sm:text-base uppercase tracking-widest mb-8 sm:mb-4">
          Matafuegos Sener — Insumos Contra Incendio
        </p>

        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight tracking-tight mb-8 sm:mb-6">
          <span className="hero-red-text">
            Servicio integral de matafuegos
          </span>
          <br />
          y seguridad contra incendios
        </h1>

        <p className="text-base sm:text-xl text-white/85 max-w-2xl mx-auto mb-12 sm:mb-10">
          Recargamos, controlamos y asesoramos.{" "}
          <br className="hidden sm:block" />
          Rápido, legal y sin complicaciones.
        </p>

        <div className="flex justify-center items-center">
          <QuoteModal variant="hero" />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none" aria-hidden="true" style={{background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.12))'}} />

      {/* Indicador de scroll — hijo directo de section, nunca cerca del botón */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1" aria-hidden="true">
        <span className="block w-px h-8 bg-gradient-to-b from-transparent to-white/40 animate-pulse" />
        <span className="block w-1.5 h-1.5 rounded-full bg-white/40 animate-pulse" style={{animationDelay:'0.3s'}} />
      </div>
    </section>
  );
}
