import { RefreshCw, ClipboardCheck, ShoppingBag, Scale } from "lucide-react";
import ServiceCard from "./ServiceCard";
import AnimateIn from "./AnimateIn";

const services = [
  {
    icon: RefreshCw,
    title: "Recarga de matafuegos",
    description:
      "Realizamos la recarga conforme a normativas vigentes, garantizando su correcto funcionamiento ante cualquier emergencia. Trabajamos con distintos tipos de equipos con servicio ágil y confiable.",
    audience: "Consorcios, empresas, locales comerciales",
  },
  {
    icon: ClipboardCheck,
    title: "Control y mantenimiento",
    description:
      "Verificamos el estado general de los equipos, su presión, vencimientos y condiciones de uso. Prevenimos fallas y aseguramos que todo esté en regla.",
    audience: "Cualquier establecimiento con equipos existentes",
  },
  {
    icon: ShoppingBag,
    title: "Venta de equipos",
    description:
      "Ofrecemos matafuegos y elementos de seguridad, asesorando según la necesidad de cada cliente y tipo de establecimiento.",
    audience: "Negocios nuevos, ampliaciones, reposición",
  },
  {
    icon: Scale,
    title: "Asesoramiento normativo",
    description:
      "Te ayudamos a cumplir con las exigencias legales vigentes, evitando multas y asegurando que tu espacio esté correctamente equipado.",
    audience: "Empresas, propietarios, administradores de consorcio",
  },
];

export default function Services() {
  return (
    <section
      id="servicios"
      className="py-20 bg-[var(--color-brand-light)]"
      aria-labelledby="services-heading"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateIn className="text-center mb-14">
          <p className="text-[var(--color-brand-red)] font-semibold text-sm uppercase tracking-widest mb-2">
            Lo que hacemos
          </p>
          <h2
            id="services-heading"
            className="text-3xl sm:text-4xl font-bold text-[var(--color-brand-dark)]"
          >
            Nuestros servicios
          </h2>
          <p className="mt-4 text-[var(--color-brand-gray)] max-w-xl mx-auto">
            Soluciones completas en seguridad contra incendios para todo tipo de
            establecimiento.
          </p>
        </AnimateIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, i) => (
            <AnimateIn key={service.title} delay={i * 0.1}>
              <ServiceCard {...service} />
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
