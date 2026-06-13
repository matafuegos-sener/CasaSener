"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle, Menu, X as XIcon } from "lucide-react";
import QuoteModal from "./QuoteModal";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

const WA_PATH =
  "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z";

const linkClass =
  "text-sm font-medium text-[var(--color-brand-dark)] hover:text-[var(--color-brand-red)] px-3 py-2 rounded-lg transition-colors duration-200";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const waUrl = buildWhatsAppUrl();

  function closeMobile() {
    setMobileOpen(false);
  }

  return (
    <>
      <header
        className="nav-shimmer fixed top-0 left-0 right-0 z-50 backdrop-blur-sm border-b border-black/8"
        style={{ background: "linear-gradient(to bottom, rgba(228,228,228,0.97), rgba(218,218,218,0.97))" }}
      >
        <nav
          className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between"
          aria-label="Navegación principal"
        >
          <Link href="/" aria-label="Matafuegos Sener — Inicio" className="shrink-0">
            <span className="logo-shimmer rounded-sm">
              <Image
                src="/logo-nuevo.png"
                alt="Matafuegos Sener — Insumos Contra Incendio"
                width={1004}
                height={355}
                style={{ height: "44px", width: "auto" }}
                priority
              />
            </span>
          </Link>

          {/* Centro — desktop only */}
          <div className="hidden lg:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
            <Link href="#servicios" className={linkClass}>Servicios</Link>
            <Link href="#nosotros" className={linkClass}>Quiénes somos</Link>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent("sener:open-chat"))}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-brand-dark)] hover:text-[var(--color-brand-red)] px-3 py-2 rounded-lg transition-colors duration-200"
            >
              <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
              Hacé tu consulta
            </button>
          </div>

          {/* Derecha */}
          <div className="flex items-center gap-2">
            <QuoteModal variant="navbar" />

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-brand-dark)] hover:text-[#25D366] px-3 py-2 rounded-lg transition-colors duration-200"
              aria-label="Contactar por WhatsApp"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d={WA_PATH} />
              </svg>
              WhatsApp
            </a>

            {/* Hamburger — mobile/tablet */}
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg text-[var(--color-brand-dark)] hover:bg-black/5 transition-colors"
              aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen
                ? <XIcon className="w-5 h-5" aria-hidden="true" />
                : <Menu className="w-5 h-5" aria-hidden="true" />
              }
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu — fuera del header para no ser cortado por overflow:hidden del shimmer */}
      {mobileOpen && (
        <div
          className="fixed top-16 left-0 right-0 z-40 lg:hidden border-b border-black/8 backdrop-blur-sm"
          style={{ background: "rgba(228,228,228,0.97)" }}
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-col gap-0.5">
            <Link
              href="#servicios"
              onClick={closeMobile}
              className="text-sm font-medium text-[var(--color-brand-dark)] hover:text-[var(--color-brand-red)] hover:bg-black/5 px-3 py-3 rounded-lg transition-colors"
            >
              Servicios
            </Link>
            <Link
              href="#nosotros"
              onClick={closeMobile}
              className="text-sm font-medium text-[var(--color-brand-dark)] hover:text-[var(--color-brand-red)] hover:bg-black/5 px-3 py-3 rounded-lg transition-colors"
            >
              Quiénes somos
            </Link>
            <button
              type="button"
              onClick={() => {
                closeMobile();
                window.dispatchEvent(new CustomEvent("sener:open-chat"));
              }}
              className="flex items-center gap-2 text-sm font-semibold text-[var(--color-brand-dark)] hover:text-[var(--color-brand-red)] hover:bg-black/5 px-3 py-3 rounded-lg transition-colors text-left w-full"
            >
              <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
              Hacé tu consulta
            </button>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMobile}
              className="flex items-center gap-2 text-sm font-semibold text-[var(--color-brand-dark)] hover:text-[#25D366] hover:bg-black/5 px-3 py-3 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d={WA_PATH} />
              </svg>
              WhatsApp
            </a>
          </div>
        </div>
      )}
    </>
  );
}
