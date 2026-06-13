import { Phone, Mail, MapPin } from "lucide-react";
import ContactForm from "./ContactForm";
import QRCodeSection from "./QRCodeSection";

export default function Contact() {
  return (
    <section
      id="contacto"
      className="py-20 bg-[var(--color-brand-light)]"
      aria-labelledby="contact-heading"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="type-label label-red mb-2">
            Contacto
          </p>
          <h2
            id="contact-heading"
            className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-brand-dark)]"
          >
            Hablemos
          </h2>
          <p className="mt-4 text-[var(--color-brand-gray)] max-w-xl mx-auto">
            Pedí tu presupuesto sin compromiso. Respondemos rápido.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Left: Form */}
          <div className="bg-[var(--color-surface)] rounded-2xl p-6 sm:p-8 shadow-md">
            <ContactForm />
          </div>

          {/* Right: Info + Map + QR */}
          <div className="flex flex-col gap-6">

            {/* Contact info */}
            <div className="bg-[var(--color-surface)] rounded-2xl p-6 shadow-md flex flex-col gap-4">
              <h3 className="font-bold text-[var(--color-brand-dark)] text-lg">Datos de contacto</h3>

              <a
                href="tel:+5491153180515"
                className="flex items-center gap-3 text-[var(--color-brand-gray)] hover:text-[var(--color-brand-red)] transition-colors"
                aria-label="Llamar al 11 5318-0515"
              >
                <Phone className="w-5 h-5 text-[var(--color-brand-red)] shrink-0" aria-hidden="true" />
                <span>11 5318-0515</span>
              </a>

              <a
                href="mailto:contacto@casasener.com.ar"
                className="flex items-center gap-3 text-[var(--color-brand-gray)] hover:text-[var(--color-brand-red)] transition-colors"
                aria-label="Enviar email a contacto@casasener.com.ar"
              >
                <Mail className="w-5 h-5 text-[var(--color-brand-red)] shrink-0" aria-hidden="true" />
                <span>contacto@casasener.com.ar</span>
              </a>

              <div className="flex items-start gap-3 text-[var(--color-brand-gray)]">
                <MapPin className="w-5 h-5 text-[var(--color-brand-red)] shrink-0 mt-0.5" aria-hidden="true" />
                <span>Av. Ejemplo 1234, Buenos Aires</span>
              </div>
            </div>

            {/* Google Maps embed */}
            <div className="rounded-2xl overflow-hidden shadow-md h-48">
              <iframe
                src="https://maps.google.com/maps?q=Buenos+Aires,+Argentina&output=embed"
                width="100%"
                height="100%"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación de Matafuegos Sener"
                aria-label="Mapa de ubicación de Matafuegos Sener en Buenos Aires"
              />
            </div>

            {/* QR Code */}
            <QRCodeSection />
          </div>
        </div>
      </div>
    </section>
  );
}
