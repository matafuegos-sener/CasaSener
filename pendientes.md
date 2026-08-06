# Pendientes — Matafuegos Sener

- [x] 1. Comprar dominio — `www.matafuegossener.com.ar` comprado, DNS en nic.ar dirigido a Vercel
- [x] 2. Casilla `contacto@matafuegossener.com.ar` — envío vía Resend verificado, recepción vía ImprovMX activa (`active: true`)
- [x] 3. Alias de recepción — ImprovMX reenvía cualquier dirección `@matafuegossener.com.ar` (wildcard) a `Matafuegossener@gmail.com`, incluye `contacto@`
- [x] 4. Datos hardcodeados del sitio actualizados: email (`contacto@matafuegossener.com.ar` en Contact.tsx y Footer.tsx) y URLs SEO (`www.matafuegossener.com.ar` en layout.tsx, sitemap.ts, robots.ts) — pusheado a `main`, en build en Vercel
- [ ] 5. Crear el usuario en Google Negocios
- [ ] 6. Hacer un segmento de la página linkeado a Google Negocios
- [x] 7. Trackear contactos nuevos — contactos fríos ya trackeados, listos para trabajar
- [x] 8. CRM, Envío de mails y WhatsApp construidos — build/lint/tsc en verde, probado con Playwright. Una sola base de contactos, todos arrancan "Frío" y la categoría se mueve sola con cada interacción (llamada/mail/whatsapp/reunión) o envío real — no se edita a mano. Migración `0005_crm_unificado.sql` ya aplicada en Supabase, panel andando con datos reales (confirmado 2026-08-05).
  - [ ] Ritmo automático de envío de mail — pendiente de analizar con cuidado antes de tocar nada, para no arruinar la reputación del dominio nuevo.
- [ ] 9. Menú BASES: agregar sub-item "Crear base" (debajo de "Base Tracking") — hoy crear o importar una base nueva se hace a mano con scripts desde la terminal, tiene que poder hacerse desde el panel. Pedido 2026-08-05, sigue sin arrancar.
- [x] 10. **La base entera tiene que ser uniforme, aunque queden campos vacíos.** Resuelto 2026-08-05: migración `0006_uniformar_base.sql` aplicada en Supabase, confirmado.

## AGENDA — pedido 2026-08-05, construida el mismo día (`AgendaView.tsx`, `/api/admin/agenda`)

- [x] Calendario día/semana/mes con el día de hoy siempre marcado.
- [x] Las acciones que se cargan desde el CRM aparecen acá agrupadas por fecha, junto con actividades cargadas a mano ("+ Nueva actividad": llamada, reunión, tarea, recordatorio) — mezcladas en una sola lista por rango de fechas.
- [x] Lo que está pasando en vivo se ve arriba de todo ("Envíos en curso", usa el mismo panel de Envíos activos).

## ENVÍOS (mail + WhatsApp) — pedido 2026-08-05, revisado 2026-08-05 (auditoría de estado real)

Root cause original: ni mail ni WhatsApp guardaban la tanda como bloque. Resuelto con la migración `0007_agenda_y_tandas.sql` (tablas `tandas_envio` / `tandas_envio_items`, aplicada y confirmada en Supabase) — el mail escribe progreso en vivo dentro de su mismo loop síncrono, y cada checkbox "Enviado"/"Sin WhatsApp" en `/whatsapp-tanda` actualiza su item y recalcula la tanda (`/api/admin/crm/contactos/[id]/estado`).

- [x] 1. Que un envío de 100 contactos no se "olvide" de por dónde iba — resuelto con `tandas_envio`/`tandas_envio_items`.
- [x] 2. Módulo "Envíos activos" con dos categorías (Mails / WhatsApp) — construido 2026-08-05, con contador de "en curso" por canal en el menú.
- [x] 3. Envío real (mail y WhatsApp) conectado para anotar progreso en la tanda, no solo en el contacto suelto.
- [ ] 4. Enterarnos cuando un mail rebota — sigue sin ninguna implementación (no hay webhook de Resend ni chequeo pasivo). Guardado para más tarde, confirmado por Baltasar 2026-08-05.
- [x] 5. Resuelto 2026-08-05: se separaron los dos ejes que se pisaban en un solo campo `categoria` — canal de contacto frío (mail/WhatsApp/llamada, sigue en `categoria`, sin cambios) vs. seguimiento comercial del CRM (llamar luego, presupuesto pedido/enviado, pedido entregado, problema — nuevo campo `estado_crm`, columna aparte). Un envío masivo ahora solo puede tocar `categoria`, nunca `estado_crm` — no hay forma de que se vuelvan a pisar. Los dos se muestran juntos (badge + columna) en vez de uno tapando al otro, y "Estado CRM" ya es un filtro más en CRM.
- [x] 6. Pedido 2026-08-05: "las categorías tienen que tener fecha — si se mandó un mail, saber cuándo." Se agregaron `categoria_actualizada_en` y `estado_crm_actualizado_en`, escritos por los tres lugares que tocan cada campo (interacción manual, envío masivo de mail, marcar WhatsApp enviado) — antes esa fecha existía a medias (`mail_enviado_en`/`whatsapp_enviado_en` en la tabla, pero nunca se mostraban en ningún lado del panel) o no existía (llamada/reunión no tenían fecha propia fuera del historial). Ahora se ve al lado de cada badge y en la tabla del CRM.

- [x] 7. Pedido 2026-08-05: "activo debería ser automático al percibir que se vendió — el matafuego dura 1 año, y conviene un recontacto a los 11 meses." Al registrar la interacción "Pedido entregado": el contacto pasa a `activo` solo (nunca a mano) y queda con `vigencia_hasta` = fecha de venta + 1 año; se agenda sola una acción "Recontactar por vencimiento — ofrecer recarga" a los 11 meses, que ya aparece en "Pendiente con este contacto" y en la Agenda sin nada nuevo que conectar. El filtro Activo/Inactivo del CRM ahora compara contra `vigencia_hasta` en cada consulta (no hay cron en este proyecto que apague el flag solo al año, así que la fecha manda, no un booleano que se puede quedar viejo).

**Falta un paso manual tuyo, un solo pegado para las tres migraciones nuevas de hoy** (`0008_estado_crm.sql`, `0009_fecha_categoria.sql`, `0010_vigencia_activo.sql`) en el SQL Editor de Supabase, mismo lugar de siempre. Sin esto, registrar interacciones sigue funcionando, pero estado/fecha/vigencia nuevos no se guardan hasta que existan las columnas.

## Filtro Activo/Inactivo (CRM) — bug encontrado y resuelto 2026-08-05

Reportado por Baltasar: "Solo activos" traía todos los contactos, "Solo inactivos" no traía ninguno. Causa: `src/app/api/admin/crm/lote/route.ts` tenía código de antes de la migración 0006 que directamente no aplicaba el filtro `activo` a `leads_base` (en ese momento la columna no existía ahí). Ya no es así desde 0006, pero nadie había actualizado este endpoint. Fix: el filtro ahora se aplica igual a las dos tablas — "Solo activos" = `activo = true` estricto, "Solo inactivos" = `activo = false` **o sin dato** (confirmado con Baltasar: mientras no se marque nada a mano, un contacto sin dato es inactivo en la práctica — hoy los 9.541 contactos de `leads_base` están así, es esperable en esta etapa). No necesita ningún paso manual, ya funciona con la migración 0006 que ya estaba aplicada.

## Encontrado en la auditoría de funcionamiento del 2026-08-05 (no reportado antes)

- [ ] Bug de `build-log.md` (entrada 2026-08-05, "MensajesPredefinidosView") sigue sin arreglar: cuando el fetch falla (401 por sesión vencida, 500, etc.) la pantalla muestra "Todavía sin catálogo armado" igual que si estuviera realmente vacío — no se distingue error de "sin datos". El mismo patrón (`Array.isArray(data) ? data : []` sin manejar el error) se repite en 5 vistas: `MensajesPredefinidosView.tsx`, `AgendaView.tsx`, `BaseTrackingView.tsx`, `EnviosMailView.tsx` y `WhatsappView.tsx` (plantillas). Si se ataca, conviene resolverlo una sola vez para las 5, no vista por vista.
- [ ] Ritmo automático de envío de mail sigue siendo solo una estimación en pantalla ("al ritmo de X/día, terminás en Y días") — no hay ningún cron ni escalado automático corriendo todavía. Sigue pendiente de analizar con cuidado antes de tocar nada (reputación del dominio nuevo).

Estado general verificado hoy: `tsc` y `eslint` en verde sobre el código actual, deploy de producción responde 200, las tres tablas nuevas de la migración 0007 existen y responden en Supabase (confirmado con query directa).
