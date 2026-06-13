import AnimateIn from "./AnimateIn";

const faqs = [
  {
    q: "¿Cada cuánto tiempo hay que recargar un matafuego?",
    a: "La normativa argentina establece que los matafuegos de polvo químico seco deben recargarse anualmente o después de cualquier uso. Los de CO₂ cada 5 años. El vencimiento figura en la etiqueta del equipo — si está vencido, el local puede recibir una multa o clausura.",
  },
  {
    q: "¿Qué pasa si mi negocio no tiene los matafuegos al día?",
    a: "En CABA, la Ley 2231 obliga a todo local comercial a mantener los equipos en regla. Las multas por incumplimiento pueden ir desde $100.000 hasta la clausura del local. Regularizar siempre es más barato que la sanción.",
  },
  {
    q: "¿Qué tipo de matafuego necesito para mi local o empresa?",
    a: "Depende del tipo de fuego que puede originarse en tu espacio. Para oficinas y locales en general: polvo químico ABC. Para cocinas con aceite: CO₂ o Clase K. Para tableros eléctricos: CO₂ o Halotron. Te asesoramos sin cargo para determinar el equipo correcto según tu actividad.",
  },
  {
    q: "¿Hacen el servicio a domicilio en CABA?",
    a: "Sí. Atendemos en toda la Ciudad Autónoma de Buenos Aires. Coordinamos el retiro, recarga y devolución de los equipos. Para consorcios y empresas con varios equipos, organizamos una visita única para resolver todo en el día.",
  },
  {
    q: "¿Cuánto tarda el servicio de recarga?",
    a: "La recarga se completa en el mismo día en la gran mayoría de los casos. Para empresas con muchos equipos, coordinamos una fecha y lo resolvemos en una sola visita para no interrumpir tu operación.",
  },
  {
    q: "¿Entregan certificado de inspección?",
    a: "Sí. Emitimos certificado de recarga y control conforme a normativa vigente, válido para presentar ante organismos de habilitación, ART, administraciones de consorcio y cualquier ente que lo requiera.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: f.a,
    },
  })),
};

export default function FAQ() {
  return (
    <section
      id="preguntas"
      className="py-20 bg-[var(--color-bg-warm)]"
      aria-labelledby="faq-heading"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateIn className="text-center mb-12">
          <p className="type-label label-red mb-2">Preguntas frecuentes</p>
          <h2
            id="faq-heading"
            className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-brand-dark)]"
          >
            Todo lo que necesitás saber
          </h2>
        </AnimateIn>

        <div className="flex flex-col gap-4">
          {faqs.map((faq, i) => (
            <AnimateIn key={i} delay={i * 0.07}>
              <details className="group bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden">
                <summary className="flex items-center justify-between gap-4 px-6 py-5 cursor-pointer list-none font-semibold text-[var(--color-brand-dark)] hover:text-[var(--color-brand-red)] transition-colors duration-200">
                  <span>{faq.q}</span>
                  <svg
                    className="w-5 h-5 shrink-0 text-[var(--color-brand-red)] transition-transform duration-200 group-open:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="px-6 pb-5 text-[var(--color-brand-gray)] leading-relaxed text-sm">
                  {faq.a}
                </p>
              </details>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
