# PROJECT MAP — Matafuegos Sener

Índice de este proyecto cliente (dentro de Agencia AI / Talaris). Consultar esto ANTES de buscar archivos a ciegas. Mantenimiento obligatorio: crear archivo → agregar entrada acá. Mover → actualizar ruta. Borrar → quitar entrada.

---

## 1. Estructura de carpetas

```
clientes/MATAFUEGOS SENER/
  build-log.md                    → historial de bugs/decisiones técnicas (ver plantilla al final del archivo)
  docs/
    PROJECT_MAP.md                 → este archivo
    PROYECTO_ Landing Page — Matafuegos Sener.md   → brief original del sitio (secciones, copy, paleta)
    Legislacion Matafuegos x Rubro.md              → normativa IRAM/matafuegos por tipo de establecimiento (insumo para copy y FAQ)
    PARA BALTASAR - 1correccion Esther.docx.md     → correcciones de copy recibidas del cliente
    lista-precios-matafuegos-2026-07-29.xlsx       → lista de precios del cliente (fuente de PRICE_CONFIG en casa-sener/src/data/prices.ts). Al recibir una lista nueva, guardar acá con fecha y actualizar prices.ts a mano.
    propuestas/                    → propuestas de trabajo nuevas/ampliaciones, una por fecha
    superpowers/plans/             → planes técnicos generados con la skill de planning
  casa-sener/                      → sitio Next.js en producción (proyecto Vercel: "casa-sener")
  entregables_logo/                → assets de marca ya entregados al cliente (logo, ícono WhatsApp)
  assets/                          → imágenes de trabajo / generadas (no necesariamente entregadas)
```

---

## 2. Mapa del sitio (casa-sener — Next.js, one-pager)

Sitio de una sola página (`/`). No hay rutas adicionales de contenido.

```
/ (src/app/page.tsx)
  ├─ Navbar
  ├─ Hero               → título, subtítulo, CTA "Solicitar presupuesto" (WhatsApp)
  ├─ Services           → 4 cards: Recarga / Control y mantenimiento / Venta de equipos / Asesoramiento normativo
  ├─ HowItWorks          → slider/proceso (agregado en redesign mobile, ver commits recientes)
  ├─ About               → historia (3ra generación, empresa familiar), zona de trabajo
  ├─ FAQ                 → preguntas frecuentes (SEO)
  ├─ Contact             → formulario (Nombre, Teléfono, Mensaje) + mapa + QR
  ├─ Footer
  └─ ChatBot             → burbuja de chat flotante

Rutas técnicas / no-contenido:
  /api/quote             → src/app/api/quote/route.ts (envío de presupuesto, backend del form)
  /sitemap.xml            → src/app/sitemap.ts (generado)
  /robots.txt              → src/app/robots.ts (generado)
```

**Componentes fuente:** `casa-sener/src/components/` — un archivo por sección (`Hero.tsx`, `Services.tsx`, `About.tsx`, `FAQ.tsx`, `Contact.tsx`, `ContactForm.tsx`, `HowItWorks.tsx`, `Navbar.tsx`, `Footer.tsx`, `ChatBot.tsx`, `WhatsAppButton.tsx`, `QRCodeSection.tsx`, `QuoteModal.tsx`, `ServiceCard.tsx`, `Testimonials.tsx`, `AnimateIn.tsx`).

**Deploy:** Vercel, proyecto `casa-sener` (ver `casa-sener/.vercel/project.json`). Seguir siempre el protocolo de deploy del CLAUDE.md de Agencia AI (push = preview, `vercel deploy --prod` manual = producción).

---

## 3. Estado de la propuesta actual

_(Actualizar esta sección cuando se cierre o cambie el alcance de una propuesta.)_

- Propuesta activa: pendiente — Baltasar va a pegar el contenido a continuación (2026-07-29). Se va a guardar en `docs/propuestas/`.
- Propuesta/brief anterior: `docs/PROYECTO_ Landing Page — Matafuegos Sener.md` (sitio ya construido y en producción — este documento es el brief original, no la propuesta nueva).

---

## 4. Convención de build log

Este proyecto usa `build-log.md` en la raíz de `clientes/MATAFUEGOS SENER/`, según la regla ya establecida en el `CLAUDE.md` de Agencia AI ("Dentalis y cualquier cliente: `clientes/[slug]/build-log.md`"). No existía hasta ahora — se crea junto con este mapa. Ver plantilla y reglas de uso dentro de ese archivo.
