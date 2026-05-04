import Image from "next/image";
import Link from "next/link";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export default function Navbar() {
  const waUrl = buildWhatsAppUrl();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--color-brand-dark)]/95 backdrop-blur-sm border-b border-white/10">
      <nav
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between"
        aria-label="Navegación principal"
      >
        <Link href="/" aria-label="CasaSener — Inicio">
          <Image
            src="/logo.png"
            alt="CasaSener — Insumos Contra Incendio"
            width={56}
            height={56}
            className="rounded-full"
            priority
          />
        </Link>

        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[var(--color-brand-red)] hover:bg-[var(--color-brand-red-dark)] text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-red)] focus:ring-offset-2 focus:ring-offset-[var(--color-brand-dark)]"
          aria-label="Solicitar presupuesto por WhatsApp"
        >
          Solicitar presupuesto
        </a>
      </nav>
    </header>
  );
}
