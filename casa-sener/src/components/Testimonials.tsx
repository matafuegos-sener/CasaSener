import AnimateIn from "./AnimateIn";

const testimonials = [
  {
    quote:
      "Administramos tres edificios en Palermo y siempre tuvimos problemas para encontrar una empresa seria. Con Sener es diferente: vienen, hacen el trabajo y entregan los certificados el mismo día.",
    name: "María G.",
    role: "Administradora de consorcio",
    stars: 5,
  },
  {
    quote:
      "Me avisaron que me clausuraban si no regularizaba los matafuegos. Llamé a Sener y en 48 horas ya estaba todo en orden. El precio fue justo y sin sorpresas.",
    name: "Carlos M.",
    role: "Dueño de restaurante, Caballito",
    stars: 5,
  },
  {
    quote:
      "Lo que más me gustó es que me explicaron exactamente qué tipo de matafuego necesitaba. No me vendieron de más. Eso genera confianza.",
    name: "Laura P.",
    role: "Encargada de local comercial",
    stars: 5,
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5 mb-3" aria-label={`${count} estrellas`}>
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} className="w-4 h-4 text-[var(--color-brand-red)]" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section
      id="testimonios"
      className="py-20 bg-[var(--color-brand-dark)]"
      aria-labelledby="testimonials-heading"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateIn className="text-center mb-12">
          <p className="type-label text-[var(--color-brand-red)] mb-2">
            Lo que dicen nuestros clientes
          </p>
          <h2
            id="testimonials-heading"
            className="text-2xl sm:text-3xl font-bold tracking-tight text-white"
          >
            Confianza que se construye con cada servicio
          </h2>
        </AnimateIn>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <AnimateIn key={t.name} delay={i * 0.1}>
              <figure className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col h-full">
                <Stars count={t.stars} />
                <blockquote className="flex-1">
                  <p className="text-white/80 leading-relaxed text-sm">
                    "{t.quote}"
                  </p>
                </blockquote>
                <figcaption className="mt-4 pt-4 border-t border-white/10">
                  <p className="font-semibold text-white text-sm">{t.name}</p>
                  <p className="text-white/50 text-xs mt-0.5">{t.role}</p>
                </figcaption>
              </figure>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
