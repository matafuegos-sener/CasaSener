import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import WhatsAppButton from "@/components/WhatsAppButton";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CasaSener — Insumos Contra Incendio | CABA y GBA",
  description:
    "Servicio integral de matafuegos: recarga, control, venta y asesoramiento normativo. Rápido, legal y sin complicaciones. Atendemos CABA y GBA.",
  keywords: [
    "matafuegos",
    "recarga matafuegos",
    "servicio contra incendio",
    "asesoramiento normativo incendio",
    "Buenos Aires",
    "CABA",
    "GBA",
    "CasaSener",
    "Senerchia",
  ],
  authors: [{ name: "CasaSener" }],
  openGraph: {
    title: "CasaSener — Insumos Contra Incendio",
    description:
      "Recargamos, controlamos y asesoramos. Rápido, legal y sin complicaciones.",
    url: "https://casasener.vercel.app",
    siteName: "CasaSener",
    locale: "es_AR",
    type: "website",
    images: [
      {
        url: "/hero.jpg",
        width: 1200,
        height: 630,
        alt: "CasaSener — Matafuegos en acción",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CasaSener — Insumos Contra Incendio",
    description: "Recargamos, controlamos y asesoramos. Rápido, legal y sin complicaciones.",
    images: ["/hero.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL("https://casasener.vercel.app"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={inter.className}>
        {children}
        <WhatsAppButton />
      </body>
    </html>
  );
}
