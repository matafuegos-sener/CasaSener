import { LucideIcon } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  audience: string;
}

export default function ServiceCard({
  icon: Icon,
  title,
  description,
  audience,
}: ServiceCardProps) {
  const waUrl = buildWhatsAppUrl(
    `Hola, quiero consultar sobre el servicio: ${title}`
  );

  return (
    <article className="h-full bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center border border-gray-100">
      <div
        className="w-12 h-12 bg-[var(--color-brand-red)]/10 rounded-xl flex items-center justify-center mb-4"
        aria-hidden="true"
      >
        <Icon className="w-6 h-6 text-[var(--color-brand-red)]" />
      </div>

      <h3 className="text-lg font-bold text-[var(--color-brand-dark)] mb-2">
        {title}
      </h3>

      <p className="text-[var(--color-brand-gray)] text-sm leading-relaxed flex-1 mb-4">
        {description}
      </p>

      <p className="text-xs text-[var(--color-brand-gray)]/70 font-medium uppercase tracking-wide mb-4">
        Para: {audience}
      </p>

      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full text-center border border-[var(--color-brand-red)] text-[var(--color-brand-red)] hover:bg-[var(--color-brand-red)] hover:text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-red)] focus:ring-offset-2"
        aria-label={`Consultar sobre ${title} por WhatsApp`}
      >
        Consultar
      </a>
    </article>
  );
}
