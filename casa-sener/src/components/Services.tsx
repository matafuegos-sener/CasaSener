import { RefreshCw, ClipboardCheck, ShoppingBag, Scale } from "lucide-react";
import ServiceCard from "./ServiceCard";
import AnimateIn from "./AnimateIn";

const services = [
  {
    icon: RefreshCw,
    title: "Recarga de matafuegos",
    description:
      "Recarga bajo normas IRAM con prueba hidráulica, control completo, marbete del año y reemplazo de repuestos si corresponde. Retiro y devolución a domicilio.",
  },
  {
    icon: ClipboardCheck,
    title: "Control y mantenimiento",
    description:
      "Verificamos presión, vencimientos y estado de cada equipo. Emitimos certificado de inspección válido para habilitaciones, ART y administraciones de consorcio.",
  },
  {
    icon: ShoppingBag,
    title: "Venta de insumos",
    description:
      "Matafuegos nuevos de marcas certificadas (Melisam, Georgia, Fádesa), cartelería obligatoria, luces de emergencia, botiquines y accesorios. Todo en un solo lugar.",
  },
  {
    icon: Scale,
    title: "Asesoramiento normativo",
    description:
      "Visitamos tu espacio sin cargo, evaluamos tus necesidades y determinamos el tipo y cantidad de equipos que exige la normativa vigente. Sin burocracia.",
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
