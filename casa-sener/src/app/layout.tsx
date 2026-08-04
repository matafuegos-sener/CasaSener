import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Matafuegos Sener — Recarga y Servicio de Matafuegos en CABA",
  description:
    "Recarga, control, venta y asesoramiento normativo de matafuegos en toda la Ciudad de Buenos Aires. Tercera generación de familia de bomberos. Certificado incluido.",
  keywords: [
    "matafuegos CABA",
    "recarga matafuegos Buenos Aires",
    "servicio matafuegos Ciudad de Buenos Aires",
    "mantenimiento matafuegos CABA",
    "normativa matafuegos Argentina",
    "certificado matafuego",
    "Matafuegos Sener",
    "Senerchia",
  ],
  authors: [{ name: "Matafuegos Sener" }],
  alternates: {
    canonical: "https://www.matafuegossener.com.ar",
  },
  openGraph: {
    title: "Matafuegos Sener — Recarga y Servicio en CABA",
    description:
      "Tercera generación de familia de bomberos. Recargamos, controlamos y asesoramos en toda la Ciudad de Buenos Aires.",
    url: "https://www.matafuegossener.com.ar",
    siteName: "Matafuegos Sener",
    locale: "es_AR",
    type: "website",
    images: [
      {
        url: "/hero.jpg",
        width: 1200,
        height: 630,
        alt: "Matafuegos Sener — Servicio de matafuegos en CABA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Matafuegos Sener — Recarga y Servicio en CABA",
    description: "Tercera generación de familia de bomberos. Rápido, legal y sin complicaciones.",
    images: ["/hero.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL("https://www.matafuegossener.com.ar"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Matafuegos Sener",
    "alternateName": "Casa Sener",
    "description": "Servicio integral de matafuegos: recarga, control, venta y asesoramiento normativo en toda la Ciudad de Buenos Aires. Tercera generación de familia de bomberos.",
    "url": "https://www.matafuegossener.com.ar",
    "telephone": "+5491153180515",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Ciudad Autónoma de Buenos Aires",
      "addressRegion": "CABA",
      "addressCountry": "AR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -34.6037,
      "longitude": -58.3816
    },
    "areaServed": [
      { "@type": "City", "name": "Ciudad Autónoma de Buenos Aires" },
      { "@type": "State", "name": "Gran Buenos Aires" }
    ],
    "slogan": "Nos ocupamos de todo. Vos cumplís sin preocuparte.",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Servicios de matafuegos",
      "itemListElement": [
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Recarga de matafuegos" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Control y mantenimiento de matafuegos" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Venta de matafuegos y equipos de seguridad" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Asesoramiento normativo contra incendios" } }
      ]
    }
  };

  return (
    <html lang="es" className="scroll-smooth">
      <body className={inter.className}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        {children}
      </body>
    </html>
  );
}
