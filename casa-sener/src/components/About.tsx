import Image from "next/image";
import AnimateIn from "./AnimateIn";

export default function About() {
  return (
    <section
      id="nosotros"
      className="py-20 bg-[var(--color-brand-light)]"
      aria-labelledby="about-heading"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Photos column */}
          <AnimateIn direction="left" className="flex flex-col sm:flex-row lg:flex-col gap-4">
            <div className="flex-1 relative aspect-[4/3] rounded-2xl overflow-hidden">
              <Image
                src="/about-taller.png"
                alt="Técnico recargando matafuegos en el taller de Casa Sener"
                fill
                className="object-cover"
                quality={80}
              />
            </div>
            <div className="flex-1 relative aspect-[4/3] rounded-2xl overflow-hidden">
              <Image
                src="/about-matafuegos.png"
                alt="Matafuegos de distintos tipos listos para inspección en Casa Sener"
                fill
                className="object-cover"
                quality={80}
              />
            </div>
          </AnimateIn>

          {/* Text column */}
          <AnimateIn direction="right" delay={0.15} className="flex flex-col gap-6">
            <div>
              <p className="type-label label-red mb-2">
                Quiénes somos
              </p>
              <h2
                id="about-heading"
                className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-brand-dark)] leading-tight"
              >
                Experiencia y confianza
                <br />
                en cada servicio
              </h2>
            </div>

            <p className="text-[var(--color-brand-gray)] leading-relaxed">
              El abuelo de Guido era bombero. Desde esa experiencia de primera
              mano nació el negocio familiar: vender y mantener matafuegos con
              el criterio de quien sabe lo que está en juego. Hoy somos la{" "}
              <strong className="text-[var(--color-brand-dark)]">tercera generación</strong> en
              el rubro, con el mismo compromiso de siempre.
            </p>

            <p className="text-[var(--color-brand-gray)] leading-relaxed">
              Atendemos consorcios, empresas y locales en{" "}
              <strong className="text-[var(--color-brand-dark)]">CABA y Gran Buenos Aires</strong>.
              Cada trabajo se realiza conforme a normativa vigente, con
              productos certificados y certificado de inspección incluido.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 py-6 border-y border-gray-100">
              {[
                { value: "3ª Gen.", label: "Familia en el rubro" },
                { value: "CABA", label: "y Gran Buenos Aires" },
                { value: "100%", label: "Normativa vigente" },
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
