import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const {
      serviceLabel, extLabel, capacityLabel, quantity,
      unitPrice, total, discountPct,
      nombre, rubro, telefono, email, direccion, horarios,
    } = await req.json();

    const totalFmt = total != null ? `$${Number(total).toLocaleString("es-AR")}` : "—";
    const unitFmt  = unitPrice != null ? `$${Number(unitPrice).toLocaleString("es-AR")}` : "—";
    const discount = discountPct > 0 ? ` · −${discountPct}% volumen` : "";

    await resend.emails.send({
      from: process.env.QUOTE_EMAIL_FROM ?? "Sener Web <onboarding@resend.dev>",
      to:   process.env.QUOTE_EMAIL_TO   ?? "ventas@placeholder.com",
      subject: `Nuevo pedido — ${nombre} · ${serviceLabel.toLowerCase()} ${quantity}× ${extLabel} ${capacityLabel}`,
      html: buildHtml({
        serviceLabel, extLabel, capacityLabel, quantity,
        unitFmt, totalFmt, discount,
        nombre, rubro, telefono, email, direccion, horarios,
      }),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[quote] email error:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

function buildHtml(d: {
  serviceLabel: string; extLabel: string; capacityLabel: string; quantity: number;
  unitFmt: string; totalFmt: string; discount: string;
  nombre: string; rubro: string; telefono: string; email: string;
  direccion: string; horarios: string;
}) {
  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f3f1ed;font-family:system-ui,-apple-system,sans-serif;color:#1a1a1a;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f1ed;padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

        <!-- Header -->
        <tr><td style="background:#c0392b;border-radius:12px 12px 0 0;padding:24px 32px;">
          <p style="margin:0;color:#fff;font-size:11px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;opacity:.8;">Matafuegos Sener</p>
          <h1 style="margin:6px 0 0;color:#fff;font-size:22px;font-weight:700;">Nuevo pedido de servicio</h1>
        </td></tr>

        <!-- Presupuesto -->
        <tr><td style="background:#fff;padding:28px 32px 0;">
          <p style="margin:0 0 14px;font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#888;">Presupuesto solicitado</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e8e5e0;border-radius:8px;overflow:hidden;">
            ${row("Servicio", d.serviceLabel)}
            ${row("Tipo", d.extLabel)}
            ${row("Carga", d.capacityLabel)}
            ${row("Cantidad", String(d.quantity))}
            ${row("Precio unitario", d.unitFmt)}
            ${row("Total estimado", `<strong style="color:#c0392b;font-size:16px;">${d.totalFmt}${d.discount}</strong>`, true)}
          </table>
        </td></tr>

        <!-- Datos del cliente -->
        <tr><td style="background:#fff;padding:28px 32px 0;">
          <p style="margin:0 0 14px;font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#888;">Datos del cliente</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e8e5e0;border-radius:8px;overflow:hidden;">
            ${row("Empresa", d.nombre)}
            ${row("Rubro", d.rubro)}
            ${row("Teléfono", `<a href="tel:${d.telefono}" style="color:#c0392b;">${d.telefono}</a>`)}
            ${row("Email", `<a href="mailto:${d.email}" style="color:#c0392b;">${d.email}</a>`)}
            ${row("Dirección", d.direccion)}
            ${row("Horarios", d.horarios, true)}
          </table>
        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#fff;border-radius:0 0 12px 12px;padding:24px 32px 28px;">
          <p style="margin:0;font-size:13px;color:#666;border-top:1px solid #f0ede8;padding-top:20px;">
            Responder directamente al cliente: <a href="mailto:${d.email}" style="color:#c0392b;">${d.email}</a>
            &nbsp;·&nbsp; Tel: <a href="tel:${d.telefono}" style="color:#c0392b;">${d.telefono}</a>
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function row(label: string, value: string, last = false) {
  const border = last ? "" : "border-bottom:1px solid #f0ede8;";
  return `<tr>
    <td style="${border}padding:10px 16px;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:#888;width:38%;vertical-align:top;">${label}</td>
    <td style="${border}padding:10px 16px;font-size:14px;color:#1a1a1a;vertical-align:top;">${value}</td>
  </tr>`;
}
