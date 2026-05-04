# CasaSener Landing Page — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a production-quality, conversion-optimized landing page for CasaSener (fire extinguisher services, Buenos Aires, Argentina) using Next.js 15 + Tailwind CSS v4 + TypeScript, deployed to Vercel.

**Architecture:** Single-page application with App Router, all sections as server components except ContactForm and WhatsAppButton (client components for interactivity). No backend — all form submissions redirect to WhatsApp via URL encoding. Assets served from `public/`.

**Tech Stack:** Next.js 15 (App Router), Tailwind CSS v4, TypeScript, Lucide React (icons), qrcode.react (QR), next/image (optimized images), Vercel (deploy).

---

## File Map

| File | Responsibility |
|------|---------------|
| `casa-sener/src/app/layout.tsx` | Root layout: fonts, SEO metadata, global wrappers |
| `casa-sener/src/app/page.tsx` | Main page: assembles all section components |
| `casa-sener/src/app/globals.css` | Tailwind v4 import + CSS theme tokens (brand colors) |
| `casa-sener/src/lib/whatsapp.ts` | WhatsApp URL builder utility (pure functions) |
| `casa-sener/src/components/Navbar.tsx` | Fixed top navbar: logo + CTA button |
| `casa-sener/src/components/Hero.tsx` | Full-screen hero: bg image + overlay + CTA |
| `casa-sener/src/components/Services.tsx` | Services section: 4 `ServiceCard` instances |
| `casa-sener/src/components/ServiceCard.tsx` | Single service card: icon, title, description, audience, button |
| `casa-sener/src/components/About.tsx` | About section: placeholder photo + text + tagline |
| `casa-sener/src/components/Contact.tsx` | Contact section: wraps form + info + map + QR |
| `casa-sener/src/components/ContactForm.tsx` | Client component: controlled form → WhatsApp URL |
| `casa-sener/src/components/Footer.tsx` | Footer: logo, section links, copyright |
| `casa-sener/src/components/WhatsAppButton.tsx` | Client component: fixed floating WhatsApp button |
| `casa-sener/public/logo.png` | CasaSener logo (copied from assets) |
| `casa-sener/public/hero.jpg` | Hero background image (copied from assets) |
| `casa-sener/tailwind.config.ts` | Minimal config (v4 uses CSS tokens; kept for IDE support) |
| `casa-sener/next.config.ts` | Next.js config: image domains if needed |

---

## Task 1: Scaffold Next.js Project

**Files:**
- Create: `casa-sener/` (full project scaffold)

- [ ] **Step 1: Run create-next-app**

```powershell
cd C:\Users\yosoy\PROYECTOS\matafuegos
npx create-next-app@latest casa-sener --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --no-turbopack
```

Expected output: `Success! Created casa-sener at ...`

- [ ] **Step 2: Verify dev server starts**

```powershell
cd casa-sener
npm run dev
```

Expected: Server running at `http://localhost:3000`. Open browser, confirm Next.js default page loads. Then `Ctrl+C` to stop.

- [ ] **Step 3: Install additional dependencies**

```powershell
npm install lucide-react qrcode.react
npm install --save-dev @types/qrcode.react
```

Expected: No errors. `package.json` updated.

- [ ] **Step 4: Commit scaffold**

```powershell
git add .
git commit -m "feat: scaffold Next.js 15 project for CasaSener landing page"
```

---

## Task 2: Configure Brand Tokens + Global CSS

**Files:**
- Modify: `casa-sener/src/app/globals.css`
- Modify: `casa-sener/tailwind.config.ts`

- [ ] **Step 1: Replace globals.css with brand configuration**

```css
/* casa-sener/src/app/globals.css */
@import "tailwindcss";

@theme {
  --color-brand-red: #CC2200;
  --color-brand-red-dark: #A81C00;
  --color-brand-dark: #1A1A1A;
  --color-brand-gray: #4A4A4A;
  --color-brand-light: #F5F5F5;

  --font-sans: "Inter", system-ui, sans-serif;
}

html {
  scroll-behavior: smooth;
}

body {
  background-color: #FFFFFF;
  color: #1A1A1A;
}
```

- [ ] **Step 2: Update layout.tsx to import Inter font**

```tsx
// casa-sener/src/app/layout.tsx (font import only — full file written in Task 6)
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
```

- [ ] **Step 3: Verify Tailwind tokens work**

Start dev server (`npm run dev`). In `src/app/page.tsx`, temporarily add:
```tsx
<div className="bg-[var(--color-brand-red)] text-white p-4">Test</div>
```
Confirm red background renders. Remove test div.

- [ ] **Step 4: Commit**

```powershell
git add src/app/globals.css src/app/layout.tsx
git commit -m "feat: configure brand color tokens and Inter font"
```

---

## Task 3: Copy Assets to public/

**Files:**
- Create: `casa-sener/public/logo.png`
- Create: `casa-sener/public/hero.jpg`

- [ ] **Step 1: Copy logo**

```powershell
Copy-Item "C:\Users\yosoy\PROYECTOS\matafuegos\assets\Logo para WHatsapp.png" `
  "C:\Users\yosoy\PROYECTOS\matafuegos\casa-sener\public\logo.png"
```

- [ ] **Step 2: Copy hero image**

```powershell
Copy-Item "C:\Users\yosoy\PROYECTOS\matafuegos\assets\Gemini_Generated_Image_sd4zu5sd4zu5sd4z.png" `
  "C:\Users\yosoy\PROYECTOS\matafuegos\casa-sener\public\hero.jpg"
```

Note: extension changed to `.jpg` for clarity — Next.js handles PNG regardless.

- [ ] **Step 3: Verify files exist**

```powershell
Get-ChildItem "C:\Users\yosoy\PROYECTOS\matafuegos\casa-sener\public"
```

Expected: `logo.png`, `hero.jpg` (plus any Next.js default icons).

- [ ] **Step 4: Commit**

```powershell
git add public/
git commit -m "feat: add brand logo and hero image to public assets"
```

---

## Task 4: WhatsApp Utility (lib/whatsapp.ts)

**Files:**
- Create: `casa-sener/src/lib/whatsapp.ts`

- [ ] **Step 1: Create the utility**

```typescript
// casa-sener/src/lib/whatsapp.ts

export const WA_NUMBER = "5491155550000"; // Placeholder: +54 9 11 5555-0000
export const WA_DEFAULT_MESSAGE =
  "Hola, quiero solicitar un presupuesto de matafuegos.";

export function buildWhatsAppUrl(message: string = WA_DEFAULT_MESSAGE): string {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function buildWhatsAppUrlFromForm(
  nombre: string,
  telefono: string,
  mensaje: string
): string {
  const text = `Hola, soy ${nombre} (tel: ${telefono}). ${mensaje}`;
  return buildWhatsAppUrl(text);
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```powershell
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Commit**

```powershell
git add src/lib/whatsapp.ts
git commit -m "feat: add WhatsApp URL builder utility"
```

---

## Task 5: Navbar Component

**Files:**
- Create: `casa-sener/src/components/Navbar.tsx`

- [ ] **Step 1: Create Navbar**

```tsx
// casa-sener/src/components/Navbar.tsx
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
```

- [ ] **Step 2: Verify TypeScript compiles**

```powershell
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Add Navbar to page.tsx temporarily and verify it renders**

In `src/app/page.tsx`:
```tsx
import Navbar from "@/components/Navbar";
export default function Home() {
  return <main><Navbar /></main>;
}
```

Run `npm run dev`, open `http://localhost:3000`. Confirm dark navbar with logo and red button appear.

- [ ] **Step 4: Commit**

```powershell
git add src/components/Navbar.tsx src/app/page.tsx
git commit -m "feat: add Navbar with logo and WhatsApp CTA"
```

---

## Task 6: Hero Component

**Files:**
- Create: `casa-sener/src/components/Hero.tsx`

- [ ] **Step 1: Create Hero component**

```tsx
// casa-sener/src/components/Hero.tsx
import Image from "next/image";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export default function Hero() {
  const waUrl = buildWhatsAppUrl();

  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center justify-center"
      aria-label="Sección principal"
    >
      {/* Background image */}
      <Image
        src="/hero.jpg"
        alt="Matafuegos en acción"
        fill
        className="object-cover object-center"
        priority
        quality={90}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/65" aria-hidden="true" />

      {/* Content */}
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <p className="text-[var(--color-brand-red)] font-semibold text-sm sm:text-base uppercase tracking-widest mb-4">
          CasaSener — Insumos Contra Incendio
        </p>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
          Servicio integral de matafuegos
          <br />
          <span className="text-[var(--color-brand-red)]">
            y seguridad contra incendios
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-white/85 max-w-2xl mx-auto mb-10">
          Recargamos, controlamos y asesoramos.
          <br className="hidden sm:block" />
          Rápido, legal y sin complicaciones.
        </p>

        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[var(--color-brand-red)] hover:bg-[var(--color-brand-red-dark)] text-white font-bold px-8 py-4 rounded-xl text-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent"
          aria-label="Solicitar presupuesto por WhatsApp"
        >
          Solicitar presupuesto
        </a>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce" aria-hidden="true">
          <svg className="w-6 h-6 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Add to page.tsx and verify**

```tsx
// src/app/page.tsx
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
export default function Home() {
  return <main><Navbar /><Hero /></main>;
}
```

Run `npm run dev`. Confirm full-screen hero with image, overlay, heading, and CTA button renders.

- [ ] **Step 3: Commit**

```powershell
git add src/components/Hero.tsx src/app/page.tsx
git commit -m "feat: add Hero section with full-screen background and CTA"
```

---

## Task 7: ServiceCard Component

**Files:**
- Create: `casa-sener/src/components/ServiceCard.tsx`

- [ ] **Step 1: Create ServiceCard**

```tsx
// casa-sener/src/components/ServiceCard.tsx
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
```

- [ ] **Step 2: Verify TypeScript compiles**

```powershell
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Commit**

```powershell
git add src/components/ServiceCard.tsx
git commit -m "feat: add ServiceCard reusable component"
```

---

## Task 8: Services Section

**Files:**
- Create: `casa-sener/src/components/Services.tsx`

- [ ] **Step 1: Create Services section**

```tsx
// casa-sener/src/components/Services.tsx
import { RefreshCw, ClipboardCheck, ShoppingBag, Scale } from "lucide-react";
import ServiceCard from "./ServiceCard";

const services = [
  {
    icon: RefreshCw,
    title: "Recarga de matafuegos",
    description:
      "Realizamos la recarga conforme a normativas vigentes, garantizando su correcto funcionamiento ante cualquier emergencia. Trabajamos con distintos tipos de equipos con servicio ágil y confiable.",
    audience: "Consorcios, empresas, locales comerciales",
  },
  {
    icon: ClipboardCheck,
    title: "Control y mantenimiento",
    description:
      "Verificamos el estado general de los equipos, su presión, vencimientos y condiciones de uso. Prevenimos fallas y aseguramos que todo esté en regla.",
    audience: "Cualquier establecimiento con equipos existentes",
  },
  {
    icon: ShoppingBag,
    title: "Venta de equipos",
    description:
      "Ofrecemos matafuegos y elementos de seguridad, asesorando según la necesidad de cada cliente y tipo de establecimiento.",
    audience: "Negocios nuevos, ampliaciones, reposición",
  },
  {
    icon: Scale,
    title: "Asesoramiento normativo",
    description:
      "Te ayudamos a cumplir con las exigencias legales vigentes, evitando multas y asegurando que tu espacio esté correctamente equipado.",
    audience: "Empresas, propietarios, administradores de consorcio",
  },
];

export default function Services() {
  return (
    <section
      id="servicios"
      className="py-20 bg-[var(--color-brand-light)]"
      aria-labelledby="services-heading"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-[var(--color-brand-red)] font-semibold text-sm uppercase tracking-widest mb-2">
            Lo que hacemos
          </p>
          <h2
            id="services-heading"
            className="text-3xl sm:text-4xl font-bold text-[var(--color-brand-dark)]"
          >
            Nuestros servicios
          </h2>
          <p className="mt-4 text-[var(--color-brand-gray)] max-w-xl mx-auto">
            Soluciones completas en seguridad contra incendios para todo tipo de
            establecimiento.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <ServiceCard key={service.title} {...service} />
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Add to page.tsx and verify grid renders on all viewports**

```tsx
// src/app/page.tsx
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
export default function Home() {
  return <main><Navbar /><Hero /><Services /></main>;
}
```

Run `npm run dev`. Resize browser: confirm 4 columns on desktop, 2 on tablet, 1 on mobile.

- [ ] **Step 3: Commit**

```powershell
git add src/components/Services.tsx src/app/page.tsx
git commit -m "feat: add Services section with 4 service cards"
```

---

## Task 9: About Section

**Files:**
- Create: `casa-sener/src/components/About.tsx`

- [ ] **Step 1: Create About section**

```tsx
// casa-sener/src/components/About.tsx
import { ShieldCheck } from "lucide-react";

export default function About() {
  return (
    <section
      id="nosotros"
      className="py-20 bg-white"
      aria-labelledby="about-heading"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Photos column */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-4">
            {/* Placeholder: Guido's photo */}
            <div
              className="flex-1 bg-[var(--color-brand-light)] rounded-2xl aspect-[4/3] flex flex-col items-center justify-center gap-3 border-2 border-dashed border-gray-200"
              aria-label="Foto de Guido Senerchia — pendiente"
            >
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                </svg>
              </div>
              <p className="text-xs text-gray-400 font-medium">Foto de Guido — próximamente</p>
            </div>

            {/* Placeholder: installations photo */}
            <div
              className="flex-1 bg-[var(--color-brand-light)] rounded-2xl aspect-[4/3] flex flex-col items-center justify-center gap-3 border-2 border-dashed border-gray-200"
              aria-label="Foto de instalaciones — pendiente"
            >
              <ShieldCheck className="w-10 h-10 text-gray-400" aria-hidden="true" />
              <p className="text-xs text-gray-400 font-medium">Foto de instalaciones — próximamente</p>
            </div>
          </div>

          {/* Text column */}
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-[var(--color-brand-red)] font-semibold text-sm uppercase tracking-widest mb-2">
                Quiénes somos
              </p>
              <h2
                id="about-heading"
                className="text-3xl sm:text-4xl font-bold text-[var(--color-brand-dark)] leading-tight"
              >
                Experiencia y confianza
                <br />
                en cada servicio
              </h2>
            </div>

            <p className="text-[var(--color-brand-gray)] leading-relaxed">
              Empezamos con la idea de que cumplir con las normas de seguridad
              contra incendios no tenía por qué ser complicado ni costoso.
              Guido Senerchia lidera un equipo comprometido con la calidad y la
              rapidez, atendiendo a consorcios, empresas y locales de{" "}
              <strong className="text-[var(--color-brand-dark)]">CABA y GBA</strong>.
            </p>

            <p className="text-[var(--color-brand-gray)] leading-relaxed">
              Cada trabajo se realiza conforme a las normativas vigentes,
              con productos certificados y un servicio de postventa que te
              acompaña. Sin burocracia, sin demoras innecesarias.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 py-6 border-y border-gray-100">
              {[
                { value: "100%", label: "Normativa vigente" },
                { value: "CABA", label: "y GBA" },
                { value: "Rápido", label: "y confiable" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-2xl font-bold text-[var(--color-brand-red)]">{stat.value}</p>
                  <p className="text-xs text-[var(--color-brand-gray)] mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Tagline */}
            <blockquote className="border-l-4 border-[var(--color-brand-red)] pl-4">
              <p className="text-xl font-semibold text-[var(--color-brand-dark)] italic">
                "Nos ocupamos de todo. Vos cumplís sin preocuparte."
              </p>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Add to page.tsx and verify**

```tsx
import About from "@/components/About";
// add <About /> after <Services />
```

Run `npm run dev`. Confirm two-column layout on desktop, stacked on mobile.

- [ ] **Step 3: Commit**

```powershell
git add src/components/About.tsx src/app/page.tsx
git commit -m "feat: add About section with placeholders and tagline"
```

---

## Task 10: ContactForm Component (Client)

**Files:**
- Create: `casa-sener/src/components/ContactForm.tsx`

- [ ] **Step 1: Create ContactForm**

```tsx
// casa-sener/src/components/ContactForm.tsx
"use client";

import { useState, FormEvent } from "react";
import { buildWhatsAppUrlFromForm } from "@/lib/whatsapp";

export default function ContactForm() {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [mensaje, setMensaje] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const url = buildWhatsAppUrlFromForm(nombre, telefono, mensaje);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  const inputClass =
    "w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-[var(--color-brand-dark)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-red)] focus:border-transparent transition-all duration-200";

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4"
      aria-label="Formulario de contacto"
      noValidate
    >
      <div>
        <label htmlFor="nombre" className="block text-sm font-medium text-[var(--color-brand-dark)] mb-1">
          Nombre <span aria-hidden="true" className="text-[var(--color-brand-red)]">*</span>
        </label>
        <input
          id="nombre"
          type="text"
          required
          autoComplete="name"
          placeholder="Tu nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className={inputClass}
          aria-required="true"
        />
      </div>

      <div>
        <label htmlFor="telefono" className="block text-sm font-medium text-[var(--color-brand-dark)] mb-1">
          Teléfono <span aria-hidden="true" className="text-[var(--color-brand-red)]">*</span>
        </label>
        <input
          id="telefono"
          type="tel"
          required
          autoComplete="tel"
          placeholder="+54 11 ..."
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          className={inputClass}
          aria-required="true"
        />
      </div>

      <div>
        <label htmlFor="mensaje" className="block text-sm font-medium text-[var(--color-brand-dark)] mb-1">
          Mensaje <span aria-hidden="true" className="text-[var(--color-brand-red)]">*</span>
        </label>
        <textarea
          id="mensaje"
          required
          rows={4}
          placeholder="Contanos qué necesitás..."
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          className={`${inputClass} resize-none`}
          aria-required="true"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-[var(--color-brand-red)] hover:bg-[var(--color-brand-red-dark)] text-white font-bold py-4 rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-red)] focus:ring-offset-2"
        aria-label="Enviar consulta por WhatsApp"
      >
        Enviar por WhatsApp
      </button>

      <p className="text-xs text-center text-gray-400">
        Al enviar, se abrirá WhatsApp con tu mensaje listo.
      </p>
    </form>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```powershell
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Commit**

```powershell
git add src/components/ContactForm.tsx
git commit -m "feat: add ContactForm client component with WhatsApp submission"
```

---

## Task 11: Contact Section

**Files:**
- Create: `casa-sener/src/components/Contact.tsx`

- [ ] **Step 1: Create Contact section**

```tsx
// casa-sener/src/components/Contact.tsx
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
        <div className="text-center mb-14">
          <p className="text-[var(--color-brand-red)] font-semibold text-sm uppercase tracking-widest mb-2">
            Contacto
          </p>
          <h2
            id="contact-heading"
            className="text-3xl sm:text-4xl font-bold text-[var(--color-brand-dark)]"
          >
            Hablemos
          </h2>
          <p className="mt-4 text-[var(--color-brand-gray)] max-w-xl mx-auto">
            Pedí tu presupuesto sin compromiso. Respondemos rápido.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Left: Form */}
          <div className="bg-white rounded-2xl p-8 shadow-md">
            <ContactForm />
          </div>

          {/* Right: Info + Map + QR */}
          <div className="flex flex-col gap-6">

            {/* Contact info */}
            <div className="bg-white rounded-2xl p-6 shadow-md flex flex-col gap-4">
              <h3 className="font-bold text-[var(--color-brand-dark)] text-lg">Datos de contacto</h3>

              <a
                href="tel:+541145550000"
                className="flex items-center gap-3 text-[var(--color-brand-gray)] hover:text-[var(--color-brand-red)] transition-colors"
                aria-label="Llamar al +54 11 4555-0000"
              >
                <Phone className="w-5 h-5 text-[var(--color-brand-red)] shrink-0" aria-hidden="true" />
                <span>+54 11 4555-0000</span>
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
                title="Ubicación de CasaSener"
                aria-label="Mapa de ubicación de CasaSener en Buenos Aires"
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
```

- [ ] **Step 2: Create QRCodeSection client component**

```tsx
// casa-sener/src/components/QRCodeSection.tsx
"use client";

import { QRCodeSVG } from "qrcode.react";

const SITE_URL = "https://casasener.vercel.app";

export default function QRCodeSection() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-md flex items-center gap-6">
      <div className="shrink-0">
        <QRCodeSVG
          value={SITE_URL}
          size={96}
          bgColor="#ffffff"
          fgColor="#1A1A1A"
          aria-label={`Código QR para ${SITE_URL}`}
        />
      </div>
      <div>
        <p className="font-semibold text-[var(--color-brand-dark)] text-sm">
          Escaneá y compartí
        </p>
        <p className="text-xs text-[var(--color-brand-gray)] mt-1 leading-relaxed">
          Apuntá la cámara para acceder al sitio desde tu celular o compartirlo con clientes.
        </p>
        <p className="text-xs text-[var(--color-brand-red)] mt-2 font-mono">
          {SITE_URL}
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Add to page.tsx and verify**

```tsx
import Contact from "@/components/Contact";
// add <Contact /> after <About />
```

Run `npm run dev`. Verify form renders, map loads, QR code is visible.

- [ ] **Step 4: Commit**

```powershell
git add src/components/Contact.tsx src/components/QRCodeSection.tsx src/app/page.tsx
git commit -m "feat: add Contact section with form, map, contact info and QR code"
```

---

## Task 12: Footer Component

**Files:**
- Create: `casa-sener/src/components/Footer.tsx`

- [ ] **Step 1: Create Footer**

```tsx
// casa-sener/src/components/Footer.tsx
import Image from "next/image";
import Link from "next/link";

const NAV_LINKS = [
  { href: "#inicio", label: "Inicio" },
  { href: "#servicios", label: "Servicios" },
  { href: "#nosotros", label: "Nosotros" },
  { href: "#contacto", label: "Contacto" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[var(--color-brand-dark)] text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-10">

          {/* Brand */}
          <div className="flex flex-col gap-3">
            <Image
              src="/logo.png"
              alt="CasaSener"
              width={64}
              height={64}
              className="rounded-full"
            />
            <p className="text-white/70 text-sm leading-relaxed">
              Insumos y servicios contra incendio.<br />
              CABA y GBA.
            </p>
          </div>

          {/* Navigation */}
          <nav aria-label="Navegación del pie de página">
            <h3 className="font-semibold text-sm uppercase tracking-widest text-[var(--color-brand-red)] mb-4">
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
            <h3 className="font-semibold text-sm uppercase tracking-widest text-[var(--color-brand-red)] mb-4">
              Contacto
            </h3>
            <ul className="flex flex-col gap-2 text-sm text-white/70">
              <li>
                <a href="tel:+541145550000" className="hover:text-white transition-colors">
                  +54 11 4555-0000
                </a>
              </li>
              <li>
                <a href="mailto:contacto@casasener.com.ar" className="hover:text-white transition-colors">
                  contacto@casasener.com.ar
                </a>
              </li>
              <li>Av. Ejemplo 1234, Buenos Aires</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 text-center">
          <p className="text-white/40 text-xs">
            © {year} CasaSener — Insumos Contra Incendio. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Add to page.tsx**

```tsx
import Footer from "@/components/Footer";
// add <Footer /> at end of <main>
```

- [ ] **Step 3: Verify footer renders with smooth-scroll links**

Run `npm run dev`. Click each nav link and verify page scrolls to the correct section.

- [ ] **Step 4: Commit**

```powershell
git add src/components/Footer.tsx src/app/page.tsx
git commit -m "feat: add Footer with navigation, contact info and copyright"
```

---

## Task 13: WhatsApp Floating Button (Client)

**Files:**
- Create: `casa-sener/src/components/WhatsAppButton.tsx`

- [ ] **Step 1: Create floating button**

```tsx
// casa-sener/src/components/WhatsAppButton.tsx
"use client";

import { buildWhatsAppUrl } from "@/lib/whatsapp";

export default function WhatsAppButton() {
  const waUrl = buildWhatsAppUrl();

  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#25D366] hover:bg-[#1DAE55] text-white font-semibold px-4 py-3 rounded-full shadow-2xl hover:shadow-[#25D366]/40 transition-all duration-200 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2 group"
      aria-label="Chatear con CasaSener por WhatsApp"
    >
      {/* WhatsApp SVG icon */}
      <svg
        className="w-6 h-6 shrink-0"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
      <span className="text-sm">Hablá con nosotros</span>
    </a>
  );
}
```

- [ ] **Step 2: Add to layout.tsx (so it appears on all pages)**

```tsx
// In src/app/layout.tsx, import and add inside <body>:
import WhatsAppButton from "@/components/WhatsAppButton";
// <WhatsAppButton /> after {children}
```

- [ ] **Step 3: Verify button is visible on all sections**

Run `npm run dev`. Scroll through the full page. Confirm green button stays fixed at bottom-right on desktop and mobile.

- [ ] **Step 4: Commit**

```powershell
git add src/components/WhatsAppButton.tsx src/app/layout.tsx
git commit -m "feat: add floating WhatsApp button fixed to all pages"
```

---

## Task 14: Root Layout + SEO Metadata

**Files:**
- Modify: `casa-sener/src/app/layout.tsx` (complete final version)

- [ ] **Step 1: Write complete layout.tsx**

```tsx
// casa-sener/src/app/layout.tsx
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
```

- [ ] **Step 2: Write complete final page.tsx**

```tsx
// casa-sener/src/app/page.tsx
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Services />
      <About />
      <Contact />
      <Footer />
    </main>
  );
}
```

- [ ] **Step 3: Production build check**

```powershell
npm run build
```

Expected: `✓ Compiled successfully` with no TypeScript or lint errors.

- [ ] **Step 4: Commit**

```powershell
git add src/app/layout.tsx src/app/page.tsx
git commit -m "feat: complete layout with SEO metadata and finalized page assembly"
```

---

## Task 15: Deploy to Vercel

**Files:**
- Create: `casa-sener/.vercelignore` (optional)

- [ ] **Step 1: Login to Vercel CLI**

```powershell
npx vercel login
```

Follow prompts (browser opens for authentication).

- [ ] **Step 2: Deploy to production**

```powershell
cd C:\Users\yosoy\PROYECTOS\matafuegos\casa-sener
npx vercel --prod
```

Expected: Deployment URL printed, e.g. `https://casa-sener-xxxx.vercel.app`.

- [ ] **Step 3: Verify production site**

Open the URL in browser. Check:
- [ ] Hero image loads
- [ ] Logo visible in navbar
- [ ] All 4 service cards render
- [ ] Contact form submits to WhatsApp correctly
- [ ] QR code renders and points to correct URL
- [ ] Floating WhatsApp button visible on all sections
- [ ] Mobile layout correct (test with DevTools)

- [ ] **Step 4: Update QR URL if needed**

If the real domain differs from `casasener.vercel.app`, update `SITE_URL` in `src/components/QRCodeSection.tsx` and redeploy.

- [ ] **Step 5: Final commit**

```powershell
git add .
git commit -m "feat: production deployment to Vercel — CasaSener landing page complete"
```

---

## Post-Deployment: Client Data Checklist

When the client provides final data, update these files:

| Data | File | Variable/Line |
|------|------|---------------|
| WhatsApp number | `src/lib/whatsapp.ts` | `WA_NUMBER` |
| Phone number | `src/components/Contact.tsx` + `src/components/Footer.tsx` | `href="tel:..."` and display text |
| Email | `src/components/Contact.tsx` + `src/components/Footer.tsx` | `href="mailto:..."` and display text |
| Address | `src/components/Contact.tsx` + `src/components/Footer.tsx` | Address text |
| Google Maps URL | `src/components/Contact.tsx` | `<iframe src="...">` |
| Years in business | `src/components/About.tsx` | Body text |
| Service area detail | `src/components/About.tsx` | Body text |
| Real domain | `src/components/QRCodeSection.tsx` + `src/app/layout.tsx` | `SITE_URL` + `metadataBase` |
| Guido's photo | `public/guido.jpg` + `src/components/About.tsx` | Replace placeholder div with `<Image>` |
| Installations photo | `public/instalaciones.jpg` + `src/components/About.tsx` | Replace placeholder div with `<Image>` |
| Logo final (rebranding) | `public/logo.png` | Replace file |
