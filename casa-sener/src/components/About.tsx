import { ShieldCheck } from "lucide-react";
import AnimateIn from "./AnimateIn";

export default function About() {
  return (
    <section
      id="nosotros"
      className="py-20 bg-[#F0F0F0]"
      aria-labelledby="about-heading"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Photos column */}
          <AnimateIn direction="left" className="flex flex-col sm:flex-row lg:flex-col gap-4">
            {/* Placeholder: Guido's photo */}
            <div
              className="flex-1 bg-[var(--color-brand-light)] rounded-2xl aspect-[4/3] flex flex-col items-center justify-center gap-3 border-2 border-dashed border-gray-200"
              aria-label="Foto de Guido Senerchia — pendiente"
            >
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                </svg>
              </div>
              <p className="text-xs text-gray-400 font-medium">Foto de Guido — próximamente</p>
            </div>

            {/* Placeholder: installations photo */}
            <div
              className="flex-1 bg-[var(--color-brand-light)] rounded-2xl aspect-[4/3] flex flex-col items-center justify-center gap-3 border-2 border-dashed border-gray-200"
              aria-label="Foto de instalaciones — pendiente"
            >
              <ShieldCheck className="w-10 h-10 text-gray-400" aria-hidden="true" />
              <p className="text-xs text-gray-400 font-medium">Foto de instalaciones — próximamente</p>
            </div>
          </AnimateIn>

          {/* Text column */}
          <AnimateIn direction="right" delay={0.15} className="flex flex-col gap-6">
            <div>
              <p className="text-[var(--color-brand-red)] font-semibold text-sm uppercase tracking-widest mb-2">
                Quiénes somos
              </p>
              <h2
                id="about-heading"
                className="text-3xl sm:text-4xl font-bold text-[var(--color-brand-dark)] leading-tight"
              >
                Experiencia y confianza
                <br />
                en cada servicio
              </h2>
            </div>

            <p className="text-[var(--color-brand-gray)] leading-relaxed">
              Empezamos con la idea de que cumplir con las normas de seguridad
              contra incendios no tenía por qué ser complicado ni costoso.
              Guido Senerchia lidera un equipo comprometido con la calidad y la
              rapidez, atendiendo a consorcios, empresas y locales de{" "}
              <strong className="text-[var(--color-brand-dark)]">CABA y GBA</strong>.
            </p>

            <p className="text-[var(--color-brand-gray)] leading-relaxed">
              Cada trabajo se realiza conforme a las normativas vigentes,
              con productos certificados y un servicio de postventa que te
              acompaña. Sin burocracia, sin demoras innecesarias.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 py-6 border-y border-gray-100">
              {[
                { value: "100%", label: "Normativa vigente" },
                { value: "CABA", label: "y GBA" },
                { value: "Rápido", label: "y confiable" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-2xl font-bold text-[var(--color-brand-red)]">{stat.value}</p>
                  <p className="text-xs text-[var(--color-brand-gray)] mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Tagline */}
            <blockquote className="border-l-4 border-[var(--color-brand-red)] pl-4">
              <p className="text-xl font-semibold text-[var(--color-brand-dark)] italic">
                "Nos ocupamos de todo. Vos cumplís sin preocuparte."
              </p>
            </blockquote>
          </AnimateIn>
        </div>
      </div>
    </section>
  );
}
