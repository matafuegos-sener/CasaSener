"use client";

import { RefreshCw, ClipboardCheck, ShoppingBag, Scale } from "lucide-react";
import ServiceCard from "./ServiceCard";
import AnimateIn from "./AnimateIn";

const services = [
  {
    icon: RefreshCw,
    title: "Recarga de matafuegos",
    description:
      "Recarga bajo normas IRAM con prueba hidráulica, control completo, marbete del año y reemplazo de repuestos si corresponde. Retiro y devolución a domicilio en toda la CABA.",
    detail:
      "Trabajamos con equipos de todos los tipos: ABC, CO₂, HCFC y agua. Durante el proceso te dejamos un matafuego de préstamo para que tu local no quede sin cobertura ni un día.",
    bullets: [
      "Prueba hidráulica incluida cuando corresponde",
      "Préstamo de equipo sustituto sin cargo",
      "Marbete del año y reemplazo de repuestos",
      "Certificado de recarga válido ante GCBA y ART",
    ],
    cta: "quote" as const,
  },
  {
    icon: ClipboardCheck,
    title: "Control y mantenimiento",
    description:
      "Verificamos presión, vencimientos y estado de cada equipo. Emitimos certificado de inspección válido para habilitaciones, ART y administraciones de consorcio.",
    detail:
      "Para empresas y consorcios con varios equipos coordinamos una visita única y lo resolvemos todo en el día, sin interrumpir tu operación. El certificado tiene validez legal inmediata.",
    bullets: [
      "Verificación de presión, funcionamiento y estado físico",
      "Control de vencimientos y etiquetas reglamentarias",
      "Certificado válido ante GCBA, ART y administraciones",
      "Visita única para empresas con múltiples equipos",
    ],
    cta: "quote" as const,
  },
  {
    icon: ShoppingBag,
    title: "Venta de insumos",
    description:
      "Matafuegos nuevos de marcas certificadas (Melisam, Georgia, Fádesa), cartelería obligatoria, luces de emergencia, botiquines y accesorios. Todo en un solo lugar.",
    detail:
      "Solo comercializamos marcas con sello IRAM — no vendemos equipos de procedencia dudosa. Si no sabés qué necesita tu espacio, te asesoramos antes de la compra, sin costo.",
    bullets: [
      "Marcas con sello IRAM: Melisam, Georgia, Fádesa",
      "Cartelería reglamentaria obligatoria",
      "Luces de emergencia y botiquines homologados",
      "Asesoramiento previo a la compra incluido",
    ],
    cta: "chat" as const,
  },
  {
    icon: Scale,
    title: "Asesoramiento normativo",
    description:
      "Visitamos tu espacio sin cargo, evaluamos tus necesidades y determinamos el tipo y cantidad de equipos que exige la normativa vigente. Sin burocracia.",
    detail:
      "Muchos locales tienen equipos incorrectos para su tipo de actividad — y eso también es una infracción. Te decimos exactamente qué necesitás según la Ley 2231 de CABA, antes de que te lo diga una inspección.",
    bullets: [
      "Visita de evaluación sin cargo y sin compromiso",
      "Análisis del riesgo específico de tu actividad",
      "Determinación de tipo y cantidad según normativa CABA",
      "Informe previo a cualquier compra o servicio",
    ],
    cta: "chat" as const,
  },
];

export default function Services() {
  return (
    <section
      id="servicios"
      className="py-20 bg-[var(--color-bg-warm)]"
      aria-labelledby="services-heading"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateIn className="text-center mb-12">
          <p className="type-label label-red mb-2">
            Lo que hacemos
          </p>
          <h2
            id="services-heading"
            className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-brand-dark)]"
          >
            Nuestros servicios
          </h2>
          <p className="mt-4 text-[var(--color-brand-gray)] max-w-md mx-auto">
            Soluciones completas en seguridad contra incendios para todo tipo de
            establecimiento.
          </p>
        </AnimateIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, i) => (
            <AnimateIn key={service.title} delay={i * 0.1} className="h-full">
              <ServiceCard {...service} />
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
