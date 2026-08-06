# Build Log — Matafuegos Sener

Registro obligatorio de todo bug que requiera más de 5 minutos de diagnóstico, y de decisiones técnicas relevantes tomadas durante el avance del proyecto. Regla completa en el `CLAUDE.md` global. Entradas se acumulan — nunca se borran. Leer este archivo antes de iniciar cualquier sesión de trabajo en este cliente.

Si el mismo `patrón` aparece dos veces: no parchear de nuevo, revisar el diseño.

---

## Plantilla

```
fecha: YYYY-MM-DD
area: [módulo o capa afectada]
síntoma: [comportamiento incorrecto observable]
raíz: [causa real — no el síntoma, sino dónde estaba el error lógico]
fix: [qué se cambió y en qué archivo]
reiterativo: no | sí → ver entrada YYYY-MM-DD
patrón: [etiqueta corta reutilizable — ej: null-vs-undefined, config-hardcodeada]
```

---

## Entradas

```
fecha: 2026-08-03
area: tracking de leads (tools/extractor-caba.mjs) — infraestructura, no código
síntoma: al crear un Google Cloud project nuevo para Sener (cuenta matafuegossener@gmail.com) para tener billing separado de Talaris, Google pide cargar tarjeta y Baltasar no tiene una tarjeta de crédito disponible para eso.
raíz: no es un bug — una cuenta de Google nueva no tiene ningún medio de pago en su perfil de Google Payments, así que Cloud Billing pide cargar uno desde cero. La cuenta principal de Baltasar (la que usa Talaris) sí tiene un medio de pago ya asociado al perfil de Google (de algo no relacionado a Cloud), por eso Places API funciona ahí sin fricción — se verificó en vivo con un curl directo a la API que confirmó billing activo en esa key.
fix: se decidió NO crear cuenta/billing separada para Sener. `MATAFUEGOS SENER/.env` usa la misma GOOGLE_PLACES_API_KEY que Talaris (la de `AGENCIA AI/.env`). Es una decisión explícita de Baltasar, no un default — el volumen de este tracking es insignificante frente al nivel gratis mensual de Google Maps Platform, así que no compite con el uso de Talaris.
reiterativo: no
patrón: billing-cuenta-nueva-sin-medio-de-pago — si se repite con otro cliente, recordar de entrada que una cuenta de Google nueva SIEMPRE va a pedir tarjeta desde cero, no vale la pena intentar evitarlo salvo que el cliente mismo la cargue.
```

```
fecha: 2026-08-03
area: deploy de panel-interno (proyecto nuevo, separado de casa-sener) — Vercel
síntoma: al crear/deployar el proyecto nuevo "panel-interno" con `vercel link` / `vercel deploy --prod` sin `--token`, la CLI usó la sesión ambiente logueada en la máquina (cuenta `praias-do-brasil`, de otro cliente) y creó/deployó ahí un proyecto fantasma — no en `sener1`, la cuenta real de este cliente.
raíz: la CLI de Vercel en esta máquina no tiene sesión propia para `sener1`; cualquier comando sin `--token` explícito cae en la cuenta que esté logueada por default. Ya había pasado antes con `casa-sener` (ver entrada previa referenciada en memoria del agente) y se repitió acá porque el bug no es específico de un proyecto — es "cualquier `vercel` sin token en este working directory".
fix: se borró el proyecto fantasma en `praias-do-brasil`. El token real de la cuenta `sener1` (sin expiración) ya existía de antes; quedó consolidado en `panel-interno/.env.local` como `VERCEL_TOKEN`, junto con un `GITHUB_TOKEN` (PAT fine-grained, resource owner = org `matafuegos-sener`, permiso Contents: Read and write) para crear/pushear repos sin `gh` CLI. Regla desde ahora: todo comando `vercel` acá va con `--token=$VERCEL_TOKEN --scope=sener1` explícito, nunca confiar en la sesión default.
reiterativo: sí → mismo patrón que un incidente previo con `casa-sener` (cuenta equivocada por sesión ambiente de la CLI).
patrón: vercel-cli-cuenta-equivocada — antes de cualquier `vercel` en este proyecto, leer `panel-interno/.env.local` y usar `--token` explícito.
```

```
fecha: 2026-08-03
area: deploy de panel-interno — build de Vercel
síntoma: build de Next.js fallaba en "Collecting page data" con `Error: supabaseUrl is required` en `src/lib/supabaseAdmin.ts`, a pesar de que `NEXT_PUBLIC_SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` ya estaban cargadas en el proyecto de Vercel (confirmado con `vercel env ls`).
raíz: Vercel marca por default las env vars de Production/Preview como "sensitive" (`vercel env add` sin `--no-sensitive`). Las variables sensitive NO están disponibles durante el build (solo en runtime de la función serverless) — y `supabaseAdmin.ts` instancia el cliente de Supabase en el top-level del módulo, que Next.js evalúa durante "Collecting page data" en build time, no en request time.
fix: se re-crearon las 3 env vars (`NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_PASSWORD`) en Production y Development con `vercel env add ... --no-sensitive --force --yes`. Confirmado con "Overrode Environment Variable" en la salida del comando. Preview quedó pendiente (el CLI tiraba un loop pidiendo git branch que no se resolvió en la sesión).
reiterativo: no
patrón: vercel-env-sensitive-bloquea-build — cualquier variable leída en top-level de un módulo (no dentro de un handler) necesita `--no-sensitive` si no, el build truena aunque la var "exista".
```

```
fecha: 2026-08-03
area: deploy de panel-interno — build de Vercel (continuación de la entrada anterior)
síntoma: el log de error que Baltasar pegó al inicio de esta sesión mostraba el mismo `Error: supabaseUrl is required` — parecía un error nuevo sin diagnosticar.
raíz: no era un error nuevo. Ese build fallido tenía 59 minutos de antigüedad (confirmado con `vercel ls`) — corrió ANTES de que se aplicara el fix `--no-sensitive` a Production (aplicado hace 56 min según `vercel env ls`). Era el mismo build fallido de la sesión anterior, no una corrida posterior al fix. Dato adicional: `main` es el Production Branch configurado en este proyecto de Vercel, así que un push a `main` dispara Production directo acá — a diferencia de `talaris-website`, donde está confirmado que push solo dispara Preview. No asumir el mismo comportamiento entre proyectos Vercel distintos sin chequear.
fix: se corrió `vercel deploy --prod --token=... --scope=sener1` de nuevo con las env vars ya corregidas — build y deploy exitosos. URL: https://panel-interno-eosin.vercel.app
reiterativo: no
patrón: log-viejo-parece-error-nuevo — antes de diagnosticar un "error nuevo" en un log pegado, verificar con `vercel ls` la antigüedad del deployment fallido contra la hora del último fix aplicado a env vars/config. Un log puede ser la misma corrida vieja, no una nueva.
```

```
fecha: 2026-08-03
area: deploy de panel-interno — build de Vercel (corrección de la entrada anterior — la raíz real era otra)
síntoma: después del fix de la entrada anterior, Baltasar pegó DOS logs más de builds fallidos nuevos (22:32 y 22:58 hora local) con el mismo `Error: supabaseUrl is required`, en un proyecto que ya debería estar arreglado. El diagnóstico de "log viejo" de la entrada anterior no aplicaba acá — eran builds genuinamente nuevos y seguían fallando.
raíz: hay DOS proyectos de Vercel distintos conectados al mismo repo de GitHub `matafuegos-sener/Panel-Interno` — `panel-interno` (`prj_vCdSTXCWDZo1ddgJ7dabtAbJnW5U`, el que se venía arreglando) y `panel-interno-3rmo` (`prj_xH7bRRjTD9iXEIDRlFf7pGL7ngCq`, duplicado — probablemente creado sin querer al importar el repo dos veces, mismo patrón que el "proyecto fantasma" de una entrada anterior pero esta vez sin cambiar de cuenta). Cada push a `main` dispara un build en los dos, en paralelo. El duplicado nunca tuvo env vars configuradas (`vercel env ls` daba 0 resultados), por eso fallaba siempre con el mismo error sin importar cuántas veces se arreglara el proyecto correcto — Baltasar veía el proyecto duplicado en su browser (confirmado con captura de pantalla: `vercel.com/sener1/panel-interno-3rmo/...`), no el que la CLI/API venían tocando.
fix: se agregaron las mismas 3 env vars (`NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_PASSWORD`, `--no-sensitive`) también a `panel-interno-3rmo`, linkeando temporalmente `.vercel/project.json` local a ese proyecto para poder correr `vercel deploy --prod` con el código real (el link se restauró después al proyecto original). Ambos proyectos responden 200 ahora: `panel-interno-eosin.vercel.app` y `panel-interno-3rmo-flax.vercel.app`. Pendiente de decisión de Baltasar: borrar el proyecto duplicado (no se borra sin confirmación explícita — acción difícil de revertir).
reiterativo: sí → ver entrada anterior (mismo síntoma superficial, raíz distinta: ahí era timing, acá es proyecto duplicado). Antes de asumir "log viejo" de nuevo, primero listar TODOS los proyectos Vercel del team (`GET /v9/projects?teamId=...`) y buscar duplicados con el mismo `link.repo` — no asumir que solo existe un proyecto por repo.
patrón: proyecto-vercel-duplicado-mismo-repo — cuando un fix confirmado por API/CLI no se refleja en lo que el usuario ve en el dashboard, sospechar de raíz que hay dos proyectos distintos antes de re-diagnosticar el mismo error de nuevo.
```

```
fecha: 2026-08-04
area: deploy de panel-interno — limpieza del proyecto duplicado
síntoma: quedaba pendiente de la entrada anterior borrar `panel-interno-3rmo`, el proyecto fantasma duplicado.
raíz: (misma que entrada anterior, esto es el cierre — Baltasar confirmó explícitamente)
fix: `vercel project remove panel-interno-3rmo --token=... --scope=sener1`. Único proyecto activo ahora: `panel-interno` (`prj_vCdSTXCWDZo1ddgJ7dabtAbJnW5U`, `panel-interno-eosin.vercel.app`), que es al que ya apuntaba `panel-interno/.vercel/project.json` local.
reiterativo: no
patrón: proyecto-vercel-duplicado-mismo-repo — cierre de la entrada del 2026-08-03.
```

```
fecha: 2026-08-04
area: panel-interno — BaseTrackingView (columna Teléfono)
síntoma: Baltasar reportó que "no figuran los teléfonos" en la tabla de Base Tracking, a pesar de que el CSV de origen (Google Maps) sí los tiene.
raíz: la columna "whatsapp" del CSV scrapeado por tools/extractor-caba.mjs no es un número de teléfono — es un flag SI/NO/VERIFICAR calculado por tieneWhatsapp() (si el teléfono detectado tiene prefijo celular argentino 549). La celda de la tabla hacía `r.whatsapp || r.telefono`, y como el flag casi siempre viene cargado cuando hay teléfono, terminaba mostrando "SI"/"NO" en vez del número real. Los datos en la tabla `leads_base` estaban bien importados — el bug era de visualización en `BaseTrackingView.tsx`, no del import.
fix: la celda ahora muestra siempre `r.telefono`, con un badge "WA" aparte cuando `whatsapp === "SI"`. El panel de detalle traduce el flag a texto ("Sí"/"No"/"A verificar") en vez de mostrarlo crudo. Archivo: `panel-interno/src/components/views/BaseTrackingView.tsx`.
reiterativo: no
patrón: campo-flag-tratado-como-dato-de-contacto — cuando un CSV externo tiene dos columnas con nombres parecidos (telefono/whatsapp), verificar el script que las generó antes de asumir que ambas son números.
```

```
fecha: 2026-08-04
area: panel-interno — API /api/admin/leads-base
síntoma: en Base Tracking solo aparecían 4 de los 10 rubros de la base (cancha-fútbol, cancha-pádel, clínica-médica, consorcios) — Baltasar preguntó si solo se había trackeado esos rubros, cuando en realidad los 10 estaban en `leads/` y se habían importado los 9.541 a Supabase (confirmado con conteo directo a la tabla).
raíz: Supabase/PostgREST limita cada response a 1000 filas por default (`db.max_rows`). La ruta hacía `.select(...)` sin `.range()`, así que del total solo llegaban las primeras 1000 filas al cliente. Por el orden de inserción del script de import (alfabético de carpetas: cancha-futbol, cancha-padel, clinica-medica, luego consorcios con sus 8.667 filas), el bloque de consorcios se comía el resto de las 1000 filas disponibles y todo lo que venía después en el orden (coworking, geriátricos, gimnasio, institutos, salones, talleres) nunca llegaba al frontend.
fix: la ruta ahora pagina con `.range()` en un loop hasta traer la tabla completa antes de devolver la respuesta. Archivo: `panel-interno/src/app/api/admin/leads-base/route.ts`. Verificado con query directa a Supabase: los 10 rubros y 9.541 filas llegan completos.
reiterativo: no
patrón: postgrest-corta-en-1000-filas — cualquier `.select()` sobre una tabla que puede superar 1000 filas necesita `.range()` explícito, si no PostgREST trunca en silencio sin error.
```

```
fecha: 2026-08-04
area: panel-interno — CRM unificado, Envío de mails, WhatsApp (cierra pendientes.md punto 8)
síntoma: (no es un bug — decisión técnica) Baltasar pidió que el panel deje de tratar `contactos` y `leads_base` como cosas separadas: en la UI todo es "contacto" (sin distinción lead/contacto), con un filtro de Base (todas / Base 1 — Cartera / Base 2 — Tracker), Rubro multiselect con checkboxes, Tier, Provincia fija en CABA (toda la base actual es CABA, se hardcodea a propósito) y Activo — tomando las opciones dinámicamente de la data real. Además pidió construir Envío de mails y WhatsApp replicando el sistema real de Electroning (`clientes/ELECTRONING/src/views/envios.js`, `whatsapp.js`, `whatsapp-tanda.js`), dejando el mail conectado de punta a punta contra Resend pero sin disparar campañas reales todavía.
raíz: `contactos` y `leads_base` tenían esquemas distintos (`leads_base` no tenía `tier` en `contactos`, ninguna de las dos trackeaba envío de WhatsApp/mail) y `interacciones`/`acciones` tenían FK estricta a `contactos(id)`, así que no había forma de abrir el mismo panel de historial para una fila de `leads_base` sin cambiar el modelo.
fix:
  - Migración `panel-interno/supabase/migrations/0005_crm_unificado.sql`: agrega `tier` a `contactos`; agrega tracking (`whatsapp_enviado`, `whatsapp_enviado_en`, `whatsapp_sin_wa`, `mail_enviado`, `mail_enviado_en`) a `contactos` y `leads_base`; saca la FK de `interacciones`/`acciones` y agrega columna `base` (la integridad queda a cargo de las API routes, únicas que escriben ahí).
  - `src/data/crmUnificado.ts` + `src/lib/useContactosUnificados.ts`: forma común `ContactoUnificado` y hook que trae+mergea las dos bases (reusa los endpoints ya existentes `/api/admin/crm/contactos` y `/api/admin/leads-base`, no se duplicó la paginación de PostgREST).
  - `src/components/FiltrosContactos.tsx`: bloque de filtros compartido (multiselect de rubro construido a mano, sin librería — no había ninguna en el proyecto) usado por CRM, Envío de mails y WhatsApp.
  - `CrmView.tsx` reescrito: lote mergeado de las dos bases, panel de contacto único (edición de "persona de contacto" solo en base=contactos, que es la única con esa columna).
  - `EnviosMailView.tsx` (nueva) + `src/lib/resend.ts` + rutas `/api/admin/mail/{test,enviar,verificar}`: envío real vía Resend (`MAIL_FROM=contacto@matafuegossener.com.ar`, dominio ya verificado), tanda acotada a 25 por click en vez del cálculo de "días estimados" de Electroning (ese cálculo asumía un cron de warm-up que acá no existe todavía).
  - `WhatsappView.tsx` + `WhatsappTandaView.tsx` (`/whatsapp-tanda`, ruta nueva porque la tanda se abre en pestaña aparte y necesita URL propia — AdminShell no usa router, solo estado en memoria) + `/api/admin/crm/tanda`: mismo patrón que `whatsapp-tanda.js` de Electroning (abrir `web.whatsapp.com/send` con el mensaje precargado, marcar Enviado/Sin WhatsApp a mano).
  - Logo: se copió `casa-sener/public/logo-nuevo.png` a `panel-interno/public/logo-sener.png`, agregado arriba del sidebar en `AdminShell.tsx`.
  - `RESEND_API_KEY` faltaba en Vercel (solo estaba en `.env.local`) — se agregó a Production y Development con `--no-sensitive` (mismo patrón que las entradas anteriores de este log, para no repetir el bug de "sensitive bloquea build/runtime").
  - Verificación técnica sin enviar nada: `GET https://api.resend.com/domains` con la API key confirma key válida + `matafuegossener.com.ar` con `status: verified` y `sending: enabled`.
  - No hay CLI/psql configurado en esta máquina para este proyecto — la migración 0005 quedó escrita pero **no aplicada**, hay que pegarla a mano en el SQL Editor de Supabase antes de que CRM/Envío de mails/WhatsApp muestren datos reales (hoy muestran "sin resultados" sin crashear, verificado con Playwright headless: sin errores de consola, capturas en la sesión).
reiterativo: no
patrón: base-unificada-sin-fk-cruzada — cuando dos tablas con esquemas distintos necesitan compartir una tabla de historial (interacciones/acciones), no se puede tener una FK que apunte a las dos: se agrega una columna `base`/discriminador y la integridad pasa a la capa de API, nunca al cliente.

```
fecha: 2026-08-04
area: panel-interno — corrección de la entrada anterior (CRM unificado)
síntoma: la primera versión modeló el filtro "Base" copiando literal la estructura de Electroning (dos bases con nombre fijo: "Base 1 — Cartera" = tabla `contactos`, "Base 2 — Tracker" = tabla `leads_base`), y además usó la palabra "lead" en el resumen y en `pendientes.md" ("promover un lead a la cartera") a pesar de que Baltasar ya había pedido explícitamente no usar esa palabra (ver la sesión anterior de este mismo día). Baltasar lo marcó como "copiaste sin criterio": acá no hay dos bases de negocio — hay una sola (`contactos` tiene 0 filas, las 9.541 reales están todas en `leads_base`) — y el filtro debía salir de un campo real de la data, no de una lista fija inventada.
raíz: confundí "hay dos tablas de Supabase" (hecho técnico, real) con "hay dos bases de negocio" (falso — es una sola base de contactos). Copié la forma de Electroning (que sí tiene dos campañas de negocio genuinamente distintas: reactivación de cartera vs. captación fría) sin verificar si esa distinción existía acá. No existía: la columna que sí varía de verdad es `fuente` (gmaps / gcba-oficial-ley941 / manual — confirmado con query directa a Supabase), que ya estaba en `leads_base` desde la migración 0003 y es exactamente lo que pedía el punto 2 original ("tiene que tomar del campo bases las que hay").
fix:
  - `panel-interno/supabase/migrations/0005_crm_unificado.sql` (no aplicada todavía, se pudo editar en el lugar): se sacó el concepto de base fija, se agregó `fuente` a `contactos` (ya estaba en `leads_base`), y la columna que discrimina de qué tabla viene una fila de `interacciones`/`acciones` se renombró de `base` a `tabla_origen` para no colisionar semánticamente con el filtro real "Base".
  - Todo el código (`src/data/crm.ts`, `crmUnificado.ts`, `useContactosUnificados.ts`, `FiltrosContactos.tsx`, `CrmView.tsx`, `EnviosMailView.tsx`, `WhatsappView.tsx`, `WhatsappTandaView.tsx`, y las API routes bajo `/api/admin/crm/` y `/api/admin/mail/enviar`) se revisó para: (a) que el filtro "Base" salga de `uniqueSorted(rows, "fuente")` -- dinámico, no una lista de dos opciones fijas -- con `FUENTE_LABEL` solo como prettificador de valores conocidos, con fallback al valor crudo si aparece uno nuevo; (b) que el discriminador técnico interno (qué tabla de Supabase) se llame `tabla`/`tabla_origen`/`TablaOrigen`, nunca "base"; (c) que no se agregara ninguna palabra "lead" nueva en código, UI, ni comentarios propios (queda `LeadBase`/`leads_base`/`leads-base` únicamente donde ya eran nombres heredados de la migración 0003, ver pregunta abierta en `pendientes.md`).
  - Re-verificado build + lint + tsc en verde, y con Playwright headless contra el dev server: el filtro "Base" ahora es un select vacío dinámico (sin datos todavía porque la migración no está aplicada), sin errores de consola.
  - Quedó una pregunta abierta para Baltasar en `pendientes.md`: si además quiere fusionar `leads_base` dentro de `contactos` a nivel de tabla (retirar la tabla separada de una vez), en vez de solo unificarlas en la capa de API/UI como quedó ahora. No se hizo sin confirmar por ser una migración de datos con más riesgo y porque toca `BaseTrackingView`, que hoy funciona.
reiterativo: no
patrón: copiar-referencia-sin-verificar-el-modelo-de-negocio — cuando se usa un proyecto de referencia (Electroning) como plantilla de código, replicar su estructura de datos (bases, tablas, distinciones) es un error si esa estructura no corresponde a la realidad del proyecto actual. Antes de copiar una distinción del proyecto de referencia (ej. "dos bases", "lead vs contacto"), verificar contra la data real de este proyecto si esa distinción existe acá. Mismo patrón de fondo que la instrucción "no usar la palabra lead" del turno anterior — ambos son casos de imponer un modelo ajeno en vez de mirar qué hay de verdad.

```
fecha: 2026-08-04
area: panel-interno — CRM, categoría real de contacto (segunda corrección del día)
síntoma: la corrección anterior sacó "Base 1/Base 2" pero armó el filtro "Base" a partir de `fuente` (gmaps/gcba-oficial-ley941/manual). Baltasar cuestionó por qué `fuente` era relevante como filtro (es un detalle de cómo se scrapeó, no algo operativo) y señaló que seguía insistiendo con la distinción técnica `contactos`/`leads_base` como si necesitara resolverla — cuando ya le había dicho que eso no importa. Pidió directamente lo que ya había mencionado en la sesión original: una categoría simple por contacto, arrancando en "frío", que cambie sola según se lo vaya tocando con interacciones.
raíz: seguí tratando un detalle técnico (de qué tabla viene una fila) como si fuera una decisión de negocio pendiente, y elegí `fuente` como proxy de "Base" sin que hubiera pedido eso — otra vez modelando en base a lo que había en el schema en vez de lo que Baltasar pidió en la conversación.
fix:
  - `panel-interno/supabase/migrations/0005_crm_unificado.sql`: se agregó `categoria text not null default 'frio'` a `contactos` y `leads_base`.
  - `TIPO_A_CATEGORIA` (`src/data/crm.ts`): mapea tipo de interacción → categoría (llamada/mail/whatsapp/reunión). Se agregó `whatsapp` como tipo de interacción (no existía, otra copia de Electroning sin adaptar).
  - La categoría se actualiza sola en tres puntos: `POST /api/admin/crm/contactos/[id]/interacciones` (según el tipo registrado), `PATCH .../estado` (al marcar whatsapp_enviado o mail_enviado desde la tanda), y `POST /api/admin/mail/enviar` (al mandar mail real). Nunca se edita a mano.
  - El filtro "Base"/fuente se sacó del bloque de filtros — `fuente` queda como dato informativo en el detalle del contacto, no como filtro. El filtro principal ahora es Categoría (`CATEGORIA_LABEL`, dinámico).
  - Se sacó la "pregunta abierta" sobre fusionar `contactos`/`leads_base` en una sola tabla que había quedado en `pendientes.md` — Baltasar dejó claro que esa distinción técnica no es algo que necesite resolver ahora, el panel ya la maneja de forma transparente.
  - Re-verificado build + lint + tsc en verde, Playwright sin errores de consola (los 500 esperados son por la migración todavía sin aplicar).
reiterativo: sí → ver entrada anterior del mismo día (mismo patrón: inventar estructura de negocio a partir del schema técnico en vez de preguntar/escuchar lo que ya se había dicho).
patrón: no-tratar-plomeria-tecnica-como-decision-de-negocio — cuando algo es un detalle de implementación (qué tabla, qué columna de origen), resolverlo en el código sin exponerlo como pregunta ni como concepto de UI. Si Baltasar ya dijo cuál es la categorización real (acá: frío → contactado por canal), implementar eso literal, no una variante inventada.
```

```
fecha: 2026-08-04
area: panel-interno — Base Tracking, CRM, Envío de mails, WhatsApp (performance + deploy)
síntoma: Baltasar reportó 4 problemas juntos: (1) Base Tracking no muestra nada hasta que cargan las opciones de rubro; (2) CRM tarda un rato en cargar y le faltaba el botón para ejecutar el filtro; (3) Envío de mails no mostraba cuántos contactos tocaría el envío ni cuánto tardaría; (4) WhatsApp también sin botón de filtro, y el filtro "Activo — todos" no tenía sentido como frase.
raíz: dos causas distintas mezcladas en el mismo reporte. (a) El botón "Filtrar"/contador de contactos en CRM/Mail/WhatsApp ya estaba escrito en 3 commits locales que nunca se habían pusheado a `Panel-Interno.git` (`git status` marcaba la rama 3 commits adelante de origin) — Baltasar estaba viendo el deploy viejo. (b) Causa real de fondo, en las 4 pantallas: `BaseTrackingView` y `useContactosUnificados` bajaban las tablas COMPLETAS (`leads_base` ~9.420 filas + `contactos`, todas las columnas, sin caché) en cada mount, solo para armar las opciones de los `<select>` y filtrar en memoria del lado del cliente — contradice el propio texto de la UI ("no navegues la base entera"). Por separado: el filtro "Activo" tenía 3 opciones (todos/solo activos/solo inactivos) pero el label del default decía "Activo — todos" mezclando el nombre del filtro con su valor; además la columna `activo` solo existe en `contactos`, que hoy tiene 0 filas (toda la base real vive en `leads_base`), así que "solo inactivos" siempre daba 0 resultados.
fix:
  - Se pusheó lo pendiente (confirmado que ya estaba sincronizado por otra sesión concurrente trabajando en el mismo repo — ver nota abajo).
  - Nuevos endpoints livianos `/api/admin/leads-base/opciones` y `/api/admin/crm/opciones`: traen solo rubro/tier/fuente/categoría deduplicados (no las filas completas), para poblar los `<select>` al instante.
  - `/api/admin/leads-base` (GET) y `/api/admin/crm/lote` (nuevo): ahora filtran en Supabase antes de traer filas — "Cargar"/"Filtrar" piden al servidor ya filtrado, no bajan todo para filtrar después en el browser.
  - `useContactosUnificados` ya no hace fetch eager de las dos tablas; expone `buscarLote(filtro)` bajo demanda, llamado recién al apretar "Filtrar".
  - `/api/admin/crm/contactos/[id]` ahora también devuelve la fila cruda del contacto, así `CrmView` no necesita tener las tablas completas en memoria para mostrar el detalle de uno solo.
  - `FiltrosContactos`: "Activo — todos" pasa a ser "Todos" a secas.
  - `EnviosMailView`: se agregó estimación de días y fecha de fin, calculada con el tamaño de tanda elegido (una tanda por día, sin inventar un escalado automático que el sistema no ejecuta todavía).
  - Verificado con build + lint limpios, y con curl autenticado contra Supabase real (no había navegador disponible en este entorno para un test visual): opciones responde en milisegundos, lotes filtrados en ~1-1.5s incluso en el rubro más grande (consorcio, 8.667 filas), lote sin filtro (`activo=no` sobre `leads_base`, que no trackea esa columna) devuelve `[]` correctamente.
  - Nota aparte: durante esta sesión se detectó que otra sesión/proceso estaba trabajando en paralelo sobre este mismo repo (un commit ajeno "reemplazar [EMPRESA] por el nombre real" apareció y se pusheó solo, sin que esta sesión lo generara) — no se tocó nada de eso, se integró al hacer `git fetch` antes de pushear.
reiterativo: no
patrón: fetch-eager-de-tabla-completa-para-armar-un-select — cuando una pantalla dice "no navegues la base entera" pero el código baja todas las filas al montar solo para poblar dropdowns o filtrar en memoria, el síntoma es "tarda en cargar"/"aparece vacío" aunque los datos estén bien. El fix es separar "opciones livianas" (para los selects) de "lote pedido" (bajo demanda, filtrado en el servidor) — nunca bajar todo para filtrar del lado del cliente.
```

```
fecha: 2026-08-05
area: panel-interno — MensajesPredefinidosView
síntoma: Baltasar reportó que los mensajes predefinidos que había cargado de prueba "se borraron" — la vista mostraba "Todavía sin catálogo armado". Se solucionó solo al apretar F5.
raíz: no hubo pérdida de datos — verificado con query directa a Supabase, las dos filas de prueba seguían en `mensajes_predefinidos` con su `canal` correcto. El bug es de la UI: `MensajesPredefinidosView.tsx` hace `setMensajes(Array.isArray(data) ? data : [])` sobre la respuesta del GET — si el fetch falla por cualquier motivo (sesión vencida a las 12hs según `login/route.ts`, error 500, etc.), la API devuelve `{ error: "..." }`, que no es array, y cae directo a `[]`. Eso es indistinguible en pantalla de "catálogo realmente vacío". El F5 disparó un fetch nuevo que esta vez funcionó, por eso "se solucionó solo".
fix: pendiente — no aplicado todavía, Baltasar priorizó seguir con otra tarea. Cuando se retome: distinguir en `MensajesPredefinidosView.tsx` el estado de error real (mostrar mensaje + opción de reintentar/re-loguear) del estado "catálogo vacío", en vez de colapsar los dos casos al mismo `[]`.
reiterativo: no
patrón: error-de-fetch-tratado-como-lista-vacia — cualquier `setState(Array.isArray(data) ? data : [])` sobre una respuesta de API esconde errores reales (401, 500) detrás del mismo estado visual que "no hay datos". Repetir este chequeo en otras vistas del panel que tengan el mismo patrón (fetch + fallback a array vacío sin distinguir error).
```

```
fecha: 2026-08-05
area: panel-interno — CRM (filtro Activo/Inactivo)
síntoma: Baltasar reportó que en CRM, filtrar por "Solo activos" traía todos los contactos, y "Solo inactivos" no traía ninguno.
raíz: `src/app/api/admin/crm/lote/route.ts` tenía código de antes de la migración `0006_uniformar_base.sql`: en ese momento `leads_base` no tenía columna `activo`, así que el endpoint directamente saltaba el filtro de activo entero para esa tabla (`if (activo !== "no") { ...consulta leads_base sin filtro de activo... }`). La migración 0006 ya había agregado `activo` a `leads_base` (confirmado, aplicada), pero nadie actualizó este endpoint para usarla — quedó código muerto que ignoraba el filtro en la tabla que tiene el 100% de los datos reales (9.541 filas, `contactos` está vacía). Por eso "activos" traía todo (sin filtro) y "inactivos" traía cero (la tabla entera quedaba excluida por el `if`).
fix: se sacó el `if` que saltaba `leads_base` y se aplica `activo` igual que en `contactos`. Además, "Solo inactivos" ahora matchea `activo = false` **o** `activo IS NULL` — confirmado con Baltasar que en esta etapa (sin ninguna acción ejecutada todavía) un contacto sin ese dato cargado es inactivo en la práctica, no un tercer estado aparte. Archivo: `panel-interno/src/app/api/admin/crm/lote/route.ts`.
reiterativo: no
patrón: filtro-no-actualizado-tras-migracion — cuando una migración agrega una columna a una tabla que antes no la tenía, buscar explícitamente los endpoints que tenían un `if`/comentario tipo "esta tabla no tiene esta columna" escrito ANTES de esa migración — quedan filtrando (o salteando) con una premisa que ya no es cierta.
```

```
fecha: 2026-08-05
area: panel-interno — CRM (campo `categoria` se pisaba)
síntoma: Baltasar reportó, más de una vez, que el campo de categoría del contacto "se pisa" — pidió una solución definitiva.
raíz: `categoria` mezclaba dos cosas de negocio distintas en un solo campo: (A) por qué canal se contactó a un contacto frío (mail/WhatsApp/llamada — TIPO_A_CATEGORIA) y (B) el seguimiento comercial del CRM (llamar luego, presupuesto pedido/enviado, pedido entregado, problema). El bug concreto: `PATCH /api/admin/crm/contactos/[id]/estado` (usado al marcar un envío masivo de WhatsApp/mail como enviado) pisaba `categoria` sin condición ninguna (`if (body.whatsapp_enviado) update.categoria = "contactado_whatsapp"`) — si un contacto ya tenía un estado más relevante cargado ahí, un envío masivo posterior lo tapaba sin que hubiera forma de saberlo, porque solo existía un campo y una sola etiqueta visible.
fix: migración `0008_estado_crm.sql` agrega columna `estado_crm` a `contactos` y `leads_base`, independiente de `categoria`. `TIPO_A_CATEGORIA` (eje A) queda igual; `TIPO_A_ESTADO_CRM` (eje B, nuevo, en `src/data/crm.ts`) mapea cotización pedida/enviada, pedido entregado y problema; "llamar_luego" se asigna cuando se carga una próxima acción sin que el tipo de interacción tenga un estado más específico. `POST /api/admin/crm/contactos/[id]/interacciones` actualiza los dos ejes en un solo `update()`, cada uno solo si corresponde. Los endpoints de envío masivo (`estado/route.ts`, `mail/enviar/route.ts`) siguen tocando únicamente `categoria` — nunca fueron tocados para escribir en `estado_crm`, así que estructuralmente no pueden volver a pisarlo. UI: `CrmView.tsx` muestra los dos ejes por separado (columna nueva en la tabla, badge aparte en la ficha) y "Estado CRM" es un filtro más en `FiltrosContactos.tsx`. **Falta un paso manual:** aplicar `0008_estado_crm.sql` en el SQL Editor de Supabase — hasta entonces, cargar una interacción de tipo cotización/pedido/problema sigue guardando la interacción bien, pero el `estado_crm` no se persiste (falla en silencio, no rompe el flujo).
reiterativo: no
patrón: un-solo-campo-para-dos-ejes-de-negocio — cuando dos cosas conceptualmente distintas (acá: canal de contacto vs. seguimiento comercial) comparten una sola columna porque "total es una categoría", cualquier código que actualice una la pisa sin querer. Señal de alarma: un `update` sin condición sobre un campo que también actualiza otro flujo del sistema.
```

```
fecha: 2026-08-05
area: panel-interno — CRM (`categoria`/`estado_crm` sin fecha)
síntoma: (no es un bug -- pedido explícito) Baltasar pidió que las categorías tengan fecha: si un contacto fue contactado por mail durante un mailing en curso, tiene que poder verse en qué fecha se le mandó.
raíz: la fecha existía a medias. `mail_enviado_en`/`whatsapp_enviado_en` (de la migración 0005) sí se guardan en la fila del contacto, pero nunca se muestran en ningún lugar del panel -- ni en la tabla del CRM ni en la ficha del contacto. Para el resto de los caminos que mueven `categoria` (llamada, reunión, registradas a mano desde el CRM) no había ninguna fecha propia guardada en la fila -- solo quedaba en el historial de `interacciones`, una tabla aparte. Y `estado_crm` (recién creado ese mismo día) no tenía fecha en absoluto.
fix: migración `0009_fecha_categoria.sql` agrega `categoria_actualizada_en` y `estado_crm_actualizado_en` a `contactos` y `leads_base` -- una sola fecha por eje, escrita por los tres lugares que tocan cada campo (`POST interacciones`, `PATCH estado`, `POST mail/enviar`), así no importa por qué camino cambió, siempre queda registrado cuándo. Se muestra al lado de cada badge en `CrmView.tsx` (ficha del contacto) y como subtexto en la tabla del lote. No se tocó `mail_enviado_en`/`whatsapp_enviado_en` -- siguen cumpliendo su rol original (evitar reenviar a quien ya se le mandó), la fecha nueva es la que se ve en pantalla.
reiterativo: no
patrón: dato-guardado-pero-nunca-mostrado — antes de asumir que hace falta una columna nueva, revisar si el dato ya existe en la tabla y simplemente no está en ningún componente de la UI (acá `mail_enviado_en`/`whatsapp_enviado_en` ya existían desde 0005 y nunca se habían mostrado).
```
