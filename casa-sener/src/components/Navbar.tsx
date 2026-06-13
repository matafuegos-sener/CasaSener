import Image from "next/image";
import Link from "next/link";
import QuoteModal from "./QuoteModal";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm border-b border-black/8" style={{background: 'linear-gradient(to bottom, rgba(228,228,228,0.97), rgba(218,218,218,0.97))'}}>
      <nav
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between"
        aria-label="Navegación principal"
      >
        <Link href="/" aria-label="Matafuegos Sener — Inicio">
          <Image
            src="/logo-nuevo.png"
            alt="Matafuegos Sener — Insumos Contra Incendio"
            width={1004}
            height={355}
            style={{ height: '44px', width: 'auto' }}
            priority
          />
        </Link>

        <QuoteModal variant="navbar" />
      </nav>
    </header>
  );
}
