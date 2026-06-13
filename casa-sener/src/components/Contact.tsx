"use client";

import { Phone, Mail, MapPin } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

const SITE_URL = "https://casa-sener.vercel.app";

const WA_ICON = (
  <svg className="w-6 h-6 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const cardClass =
  "flex flex-col items-center gap-4 p-6 rounded-2xl bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] hover:border-white/20 transition-all duration-200 group";

export default function Contact() {
  const waUrl = buildWhatsAppUrl();

  return (
    <section
      id="contacto"
      className="py-20 bg-[var(--color-brand-dark)]"
      aria-labelledby="contact-heading"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-12">
          <p className="type-label text-[var(--color-brand-red)] mb-2">Contacto</p>
          <h2
            id="contact-heading"
            className="text-2xl sm:text-3xl font-bold tracking-tight text-white"
          >
            Hablemos
          </h2>
          <p className="mt-4 text-white/50 max-w-xl mx-auto">
            Respondemos rápido por el canal que prefieras.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">

          <a href={waUrl} target="_blank" rel="noopener noreferrer" className={cardClass} aria-label="Contactar por WhatsApp">
            <div className="w-12 h-12 rounded-full bg-[#25D366]/20 flex items-center justify-center">
              {WA_ICON}
            </div>
            <div className="text-center">
              <p className="text-white font-semibold text-sm">WhatsApp</p>
              <p className="text-white/50 text-sm mt-0.5">11 5318-0515</p>
              <p className="text-[#25D366] text-xs mt-3 font-semibold group-hover:underline">Escribinos →</p>
            </div>
          </a>

          <a href="tel:+5491153180515" className={cardClass} aria-label="Llamar al 11 5318-0515">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
              <Phone className="w-5 h-5 text-white/70" aria-hidden="true" />
            </div>
            <div className="text-center">
              <p className="text-white font-semibold text-sm">Teléfono</p>
              <p className="text-white/50 text-sm mt-0.5">11 5318-0515</p>
              <p className="text-white/40 text-xs mt-3 font-semibold">Lunes a Viernes · 9 a 18 hs</p>
            </div>
          </a>

          <a href="mailto:contacto@casasener.com.ar" className={cardClass} aria-label="Enviar email a contacto@casasener.com.ar">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
              <Mail className="w-5 h-5 text-white/70" aria-hidden="true" />
            </div>
            <div className="text-center">
              <p className="text-white font-semibold text-sm">Email</p>
              <p className="text-white/50 text-sm mt-0.5">contacto@casasener.com.ar</p>
              <p className="text-white/40 text-xs mt-3 font-semibold group-hover:text-white/70 transition-colors">Escribir →</p>
            </div>
          </a>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-white/10">
          <div className="flex items-center gap-2 text-white/40 text-sm">
            <MapPin className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Barrio Flores, Ciudad Autónoma de Buenos Aires</span>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <div className="rounded-lg overflow-hidden p-1.5 bg-white" role="img" aria-label={`Código QR para ${SITE_URL}`}>
              <QRCodeSVG value={SITE_URL} size={80} bgColor="#ffffff" fgColor="#1a1a1a" />
            </div>
            <div>
              <p className="text-white/60 text-xs font-semibold">Escaneá para compartir</p>
              <p className="text-white/40 text-xs font-mono mt-0.5">casa-sener.vercel.app</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
