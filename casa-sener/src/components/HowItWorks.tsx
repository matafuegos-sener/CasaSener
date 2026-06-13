import AnimateIn from "./AnimateIn";

const steps = [
  {
    number: "01",
    title: "Nos contactás",
    description: "Por WhatsApp o teléfono. Nos contás qué necesitás y coordinamos.",
  },
  {
    number: "02",
    title: "Revisión sin costo",
    description: "Evaluamos el estado de tus equipos y necesidades del espacio, sin cargo.",
  },
  {
    number: "03",
    title: "Retiro con préstamo",
    description: "Retiramos los equipos y te dejamos matafuegos de préstamo para que sigas cubierto.",
  },
  {
    number: "04",
    title: "Recarga bajo normas IRAM",
    description: "Prueba hidráulica, control completo, marbete del año y reemplazo de repuestos si corresponde.",
  },
  {
    number: "05",
    title: "Entrega y seguimiento",
    description: "Devolvemos los equipos en 48 hs a 5 días hábiles, certificados y en regla. Te acompañamos con controles periódicos.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="como-funciona"
      className="py-20 bg-[var(--color-bg-mid)]"
      aria-labelledby="how-heading"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateIn className="text-center mb-12">
          <p className="type-label label-red mb-2">El proceso</p>
          <h2
            id="how-heading"
            className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-brand-dark)]"
          >
            Simple, rápido y sin complicaciones
          </h2>
        </AnimateIn>

        <div className="relative">
          {/* Línea conectora — solo desktop */}
          <div
            className="hidden lg:block absolute top-8 left-0 right-0 h-px bg-[var(--color-border)] z-0"
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 relative z-10">
            {steps.map((step, i) => (
              <AnimateIn key={step.number} delay={i * 0.1} className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-[var(--color-surface)] border-2 border-[var(--color-brand-red)] flex items-center justify-center mb-4 shrink-0">
                  <span className="text-sm font-bold text-[var(--color-brand-red)]">{step.number}</span>
                </div>
                <h3 className="font-bold text-[var(--color-brand-dark)] mb-2 text-sm leading-snug">
                  {step.title}
                </h3>
                <p className="text-[var(--color-brand-gray)] text-xs leading-relaxed">
                  {step.description}
                </p>
              </AnimateIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
