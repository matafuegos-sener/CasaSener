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
    <article className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col gap-4 border border-gray-100">
      <div
        className="w-12 h-12 bg-[var(--color-brand-red)]/10 rounded-xl flex items-center justify-center"
        aria-hidden="true"
      >
        <Icon className="w-6 h-6 text-[var(--color-brand-red)]" />
      </div>

      <div className="flex-1">
        <h3 className="text-lg font-bold text-[var(--color-brand-dark)] mb-2">
          {title}
        </h3>
        <p className="text-[var(--color-brand-gray)] text-sm leading-relaxed mb-3">
          {description}
        </p>
        <p className="text-xs text-[var(--color-brand-gray)]/70 font-medium uppercase tracking-wide">
          Para: {audience}
        </p>
      </div>

      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto text-center border border-[var(--color-brand-red)] text-[var(--color-brand-red)] hover:bg-[var(--color-brand-red)] hover:text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-red)] focus:ring-offset-2"
        aria-label={`Consultar sobre ${title} por WhatsApp`}
      >
        Consultar
      </a>
    </article>
  );
}
