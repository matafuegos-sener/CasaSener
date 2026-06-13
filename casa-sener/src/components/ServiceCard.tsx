"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { LucideIcon, X } from "lucide-react";

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  detail: string;
  bullets: string[];
  cta: "quote" | "chat";
}

export default function ServiceCard({ icon: Icon, title, description, detail, bullets, cta }: ServiceCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setIsOpen(false); };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  function handleCta() {
    setIsOpen(false);
    window.dispatchEvent(new CustomEvent(cta === "quote" ? "sener:open-quote" : "sener:open-chat"));
  }

  return (
    <>
      <article className="h-full bg-[var(--color-surface)] rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col items-center text-center border border-[var(--color-border)] border-t-2 border-t-[var(--color-brand-red)]">
        <div className="w-12 h-12 bg-[var(--color-brand-red-subtle)] rounded-xl flex items-center justify-center mb-4" aria-hidden="true">
          <Icon className="w-6 h-6 text-[var(--color-brand-red)]" />
        </div>
        <h3 className="text-lg font-bold leading-snug text-[var(--color-brand-dark)] mb-2">{title}</h3>
        <p className="text-[var(--color-brand-gray)] text-sm leading-relaxed flex-1 mb-4">{description}</p>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="w-full text-center border border-[var(--color-brand-red)] text-[var(--color-brand-red)] hover:bg-[var(--color-brand-red)] hover:text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-red)] focus:ring-offset-2"
        >
          Ver más
        </button>
      </article>

      {isOpen && createPortal(
        <>
          <div
            className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div className="fixed inset-0 z-[201] overflow-y-auto">
            <div className="flex min-h-full items-center justify-center px-4 py-20">
              <div className="relative bg-[var(--color-surface)] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-row">

                {/* Columna izquierda — roja */}
                <div className="bg-[var(--color-brand-red)] w-48 shrink-0 flex flex-col items-start justify-start gap-4 px-7 py-8">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center" aria-hidden="true">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-lg font-bold text-white leading-snug">{title}</h2>
                </div>

                {/* Columna derecha — contenido */}
                <div className="flex flex-col flex-1 min-w-0 px-7 pt-10 pb-7">

                  {/* X — posición fija sin invadir el texto */}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full text-[var(--color-brand-gray)] hover:bg-[var(--color-surface-subtle)] transition-colors"
                    aria-label="Cerrar"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  {/* Texto */}
                  <p className="text-[var(--color-brand-dark)] text-sm leading-relaxed mb-2">{description}</p>
                  <p className="text-[var(--color-brand-gray)] text-sm leading-relaxed mb-5">{detail}</p>

                  {/* Bullets */}
                  <ul className="grid grid-cols-2 gap-x-5 gap-y-2.5 mb-7">
                    {bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-sm text-[var(--color-brand-dark)]">
                        <span className="mt-[5px] w-1.5 h-1.5 rounded-full bg-[var(--color-brand-red)] shrink-0" aria-hidden="true" />
                        {b}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <button
                    type="button"
                    onClick={handleCta}
                    className="w-full bg-[var(--color-brand-red)] hover:bg-[var(--color-brand-red-dark)] text-white font-semibold py-3 rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-red)] focus:ring-offset-2"
                  >
                    {cta === "quote" ? "Calcular presupuesto" : "Hacé tu consulta"}
                  </button>

                </div>
              </div>
            </div>
          </div>
        </>,
        document.body
      )}
    </>
  );
}
