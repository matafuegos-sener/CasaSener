"use client";

import { QRCodeSVG } from "qrcode.react";

const SITE_URL = "https://www.matafuegossener.com.ar";

export default function QRCodeSection() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-md flex items-center gap-6">
      <div className="shrink-0" role="img" aria-label={`Código QR para ${SITE_URL}`}>
        <QRCodeSVG
          value={SITE_URL}
          size={96}
          bgColor="#ffffff"
          fgColor="#1A1A1A"
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
