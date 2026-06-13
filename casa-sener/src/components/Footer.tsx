import Image from "next/image";
import Link from "next/link";

const NAV_LINKS = [
  { href: "#inicio", label: "Inicio" },
  { href: "#servicios", label: "Servicios" },
  { href: "#nosotros", label: "Nosotros" },
  { href: "#preguntas", label: "Preguntas frecuentes" },
  { href: "#contacto", label: "Contacto" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[var(--color-brand-dark)] text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">

          {/* Brand */}
          <div className="flex flex-col gap-3">
            <Image
              src="/logo-dark.png"
              alt="Matafuegos Sener"
              width={1004}
              height={355}
              style={{ height: 'auto', width: '100%', maxWidth: '160px' }}
            />
            <p className="text-white/70 text-sm leading-relaxed">
              Insumos y servicios contra incendios.<br />
              CABA y Gran Buenos Aires.
            </p>
            <div className="flex items-center gap-3 mt-1">
              <Image
                src="/sello_iram.png"
                alt="Sello IRAM Conformidad Norma 3610"
                width={552}
                height={196}
                style={{ height: "36px", width: "auto", filter: "invert(1)", opacity: 0.7 }}
              />
              <p className="text-white/50 text-xs font-semibold uppercase tracking-wide leading-tight">
                Trabajamos bajo<br />normas IRAM
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav aria-label="Navegación del pie de página">
            <h3 className="type-label text-[var(--color-brand-red)] mb-4">
              Secciones
            </h3>
            <ul className="flex flex-col gap-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-white text-sm transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact quick info */}
          <div>
            <h3 className="type-label text-[var(--color-brand-red)] mb-4">
              Contacto
            </h3>
            <ul className="flex flex-col gap-2 text-sm text-white/70">
              <li>
                <a href="tel:+5491153180515" className="hover:text-white transition-colors">
                  +54 11 5318-0515
                </a>
              </li>
              <li>
                <a href="mailto:contacto@casasener.com.ar" className="hover:text-white transition-colors">
                  contacto@casasener.com.ar
                </a>
              </li>
              <li>Barrio Flores, Buenos Aires</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row sm:justify-between gap-1 text-center sm:text-left">
          <p className="text-white/40 text-xs">
            © {year} Sener Matafuegos. Todos los derechos reservados.
          </p>
          <p className="text-white/30 text-xs">
            Hab. GCBA DISFC-2024-179-GCABA-DGFYCO – DPS 511 &nbsp;·&nbsp; C.U.I.T. 20-34142827-1
          </p>
        </div>
      </div>
    </footer>
  );
}
