"use client";

import type { ReactNode } from "react";
import AnimateIn from "./AnimateIn";

function openChat() {
  window.dispatchEvent(new CustomEvent("sener:open-chat"));
}

function openQuote() {
  window.dispatchEvent(new CustomEvent("sener:open-quote"));
}

const faqs: { q: string; a: ReactNode; schemaText: string }[] = [
  {
    q: "¿Cada cuánto tiempo hay que recargar un matafuego?",
    a: "La normativa argentina establece que los matafuegos de polvo químico seco deben recargarse anualmente o después de cualquier uso. Los de CO₂ cada 5 años. El vencimiento figura en la etiqueta del equipo — si está vencido, el local puede recibir una multa o clausura.",
    schemaText: "La normativa argentina establece que los matafuegos de polvo químico seco deben recargarse anualmente o después de cualquier uso. Los de CO₂ cada 5 años. El vencimiento figura en la etiqueta del equipo — si está vencido, el local puede recibir una multa o clausura.",
  },
  {
    q: "¿Qué pasa si mi negocio no tiene los matafuegos al día?",
    a: "En CABA, la Ley 2231 obliga a todo local comercial a mantener los equipos en regla. Las multas por incumplimiento pueden ir desde $100.000 hasta la clausura del local. Regularizar siempre es más barato que la sanción.",
    schemaText: "En CABA, la Ley 2231 obliga a todo local comercial a mantener los equipos en regla. Las multas por incumplimiento pueden ir desde $100.000 hasta la clausura del local. Regularizar siempre es más barato que la sanción.",
  },
  {
    q: "¿Qué tipo de matafuego necesito para mi local o empresa?",
    a: (
      <>
        Depende del tipo de fuego que puede originarse en tu espacio. Para oficinas y locales en general: polvo químico ABC. Para cocinas con aceite: CO₂ o Clase K. Para tableros eléctricos: CO₂ o Halotron.{" "}
        <button
          type="button"
          onClick={openChat}
          className="text-[var(--color-brand-red)] underline underline-offset-2 font-semibold hover:opacity-70 transition-opacity"
        >
          Usá nuestro asistente
        </button>{" "}
        para obtener una recomendación directa según tu rubro.
      </>
    ),
    schemaText: "Depende del tipo de fuego que puede originarse en tu espacio. Para oficinas y locales en general: polvo químico ABC. Para cocinas con aceite: CO₂ o Clase K. Para tableros eléctricos: CO₂ o Halotron. Te asesoramos sin cargo para determinar el equipo correcto según tu actividad.",
  },
  {
    q: "¿Hacen el servicio a domicilio en CABA?",
    a: "Sí. Atendemos en toda la Ciudad Autónoma de Buenos Aires. Coordinamos el retiro, recarga y devolución de los equipos. Para consorcios y empresas con varios equipos, organizamos una visita única para resolver todo en el día.",
    schemaText: "Sí. Atendemos en toda la Ciudad Autónoma de Buenos Aires. Coordinamos el retiro, recarga y devolución de los equipos. Para consorcios y empresas con varios equipos, organizamos una visita única para resolver todo en el día.",
  },
  {
    q: "¿Cuánto tarda el servicio de recarga?",
    a: "La recarga se completa en el mismo día en la gran mayoría de los casos. Para empresas con muchos equipos, coordinamos una fecha y lo resolvemos en una sola visita para no interrumpir tu operación.",
    schemaText: "La recarga se completa en el mismo día en la gran mayoría de los casos. Para empresas con muchos equipos, coordinamos una fecha y lo resolvemos en una sola visita para no interrumpir tu operación.",
  },
  {
    q: "¿Entregan certificado de inspección?",
    a: "Sí. Emitimos certificado de recarga y control conforme a normativa vigente, válido para presentar ante organismos de habilitación, ART, administraciones de consorcio y cualquier ente que lo requiera.",
    schemaText: "Sí. Emitimos certificado de recarga y control conforme a normativa vigente, válido para presentar ante organismos de habilitación, ART, administraciones de consorcio y cualquier ente que lo requiera.",
  },
  {
    q: "¿Cuánto cuesta recargar un matafuego en CABA?",
    a: (
      <>
        El precio depende del tipo de equipo (ABC, CO₂, HCFC) y su capacidad en kilogramos. En pedidos de más de 5 unidades aplicamos descuento automático por volumen.{" "}
        <button
          type="button"
          onClick={openQuote}
          className="text-[var(--color-brand-red)] underline underline-offset-2 font-semibold hover:opacity-70 transition-opacity"
        >
          Calculá tu presupuesto online
        </button>{" "}
        en segundos, sin compromiso.
      </>
    ),
    schemaText: "El precio depende del tipo de equipo (ABC, CO₂, HCFC) y su capacidad en kilogramos. En pedidos de más de 5 unidades aplicamos descuento por volumen. Podés calcular un presupuesto de referencia online o consultarnos por WhatsApp para un precio a medida.",
  },
  {
    q: "¿Cuántos matafuegos necesita mi local o negocio?",
    a: "La normativa CABA exige al menos un matafuego cada 200 m² de superficie cubierta y uno por piso en edificios. La cantidad exacta varía según el tipo de actividad y los riesgos específicos del espacio. Hacemos la evaluación sin cargo.",
    schemaText: "La normativa CABA exige al menos un matafuego cada 200 m² de superficie cubierta y uno por piso en edificios. La cantidad exacta varía según el tipo de actividad y los riesgos específicos del espacio.",
  },
  {
    q: "¿Qué es la prueba hidráulica y cuándo hay que hacerla?",
    a: "Es una prueba de presión que verifica la integridad del cilindro del matafuego. La normativa la exige cada 5 años para equipos de polvo ABC y HCFC. Sin ella, el equipo no está apto para uso aunque esté cargado, y el certificado no es válido.",
    schemaText: "Es una prueba de presión que verifica la integridad del cilindro del matafuego. La normativa la exige cada 5 años para equipos de polvo ABC y HCFC. Sin ella, el equipo no está apto para uso aunque esté cargado.",
  },
  {
    q: "¿Qué pasa si el matafuego no tiene etiqueta, está dañado o le faltan las trabas?",
    a: "Cualquiera de esas tres situaciones lo deja fuera de servicio de forma inmediata. Sin etiqueta legible no se puede verificar la fecha de fabricación ni el historial de recarga. Si tiene corrosión, golpes o le falta el precinto o traba de seguridad, ninguna empresa habilitada puede recargarlo. En una inspección de la AGC, ese equipo se considera como si no existiera.",
    schemaText: "Cualquiera de esas tres situaciones lo deja fuera de servicio de forma inmediata. Sin etiqueta legible no se puede verificar la fecha de fabricación ni el historial de recarga. Si tiene corrosión, golpes o le falta el precinto o traba de seguridad, ninguna empresa habilitada puede recargarlo. En una inspección de la AGC, ese equipo se considera como si no existiera.",
  },
  {
    q: "¿Cuánto tiempo dura un matafuego?",
    a: "La mayoría de los equipos (polvo ABC, AFFF, agua) tiene una vida útil máxima de 20 años desde la fecha de fabricación; los de CO₂ llegan hasta 30. Pero si antes de ese plazo vence la prueba hidráulica — obligatoria cada 5 años — el equipo queda fuera de servicio aunque sea casi nuevo.",
    schemaText: "La mayoría de los equipos (polvo ABC, AFFF, agua) tiene una vida útil máxima de 20 años desde la fecha de fabricación; los de CO₂ llegan hasta 30. Pero si antes de ese plazo vence la prueba hidráulica — obligatoria cada 5 años — el equipo queda fuera de servicio aunque sea casi nuevo.",
  },
  {
    q: "¿Una vez vencida la vida útil se puede seguir usando?",
    a: "No. Al alcanzar la vida útil máxima el equipo debe retirarse e inutilizarse de forma definitiva: la normativa exige aplastarlo o cortar la rosca del recipiente para que no pueda volver a usarse como envase a presión. Ninguna empresa habilitada puede recargarlo ni repararlo.",
    schemaText: "No. Al alcanzar la vida útil máxima el equipo debe retirarse e inutilizarse de forma definitiva: la normativa exige aplastarlo o cortar la rosca del recipiente para que no pueda volver a usarse como envase a presión. Ninguna empresa habilitada puede recargarlo ni repararlo.",
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
      text: f.schemaText,
    },
  })),
};

export default function FAQ() {
  return (
    <section
      id="preguntas"
      className="py-12 bg-[var(--color-bg-warm)]"
      aria-labelledby="faq-heading"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateIn className="text-center mb-8">
          <p className="type-label label-red mb-2">Preguntas frecuentes</p>
          <h2
            id="faq-heading"
            className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-brand-dark)]"
          >
            Todo lo que necesitás saber
          </h2>
        </AnimateIn>

        <div className="flex flex-col gap-2">
          {faqs.map((faq, i) => (
            <AnimateIn key={i} delay={i * 0.07}>
              <details className="group bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden">
                <summary className="flex items-center justify-between gap-4 px-5 py-3.5 cursor-pointer list-none font-semibold text-[var(--color-brand-dark)] hover:text-[var(--color-brand-red)] transition-colors duration-200">
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
                <p className="px-5 pb-4 text-[var(--color-brand-gray)] leading-relaxed text-sm">
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
