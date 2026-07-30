import { useEffect, useState } from "react";

export const WA_NUMBER = "5491153180515";

export const WA_DEFAULT_MESSAGE =
  "Hola, quiero solicitar un presupuesto de matafuegos.";

function isMobileDevice(): boolean {
  if (typeof navigator === "undefined") return true;
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

// En mobile, wa.me abre la app nativa. En desktop, wa.me pasa por una
// landing intermedia (api.whatsapp.com) que pide "Continuar a WhatsApp Web"
// incluso si Web ya está abierto en otra pestaña. web.whatsapp.com/send
// entra directo a la conversación.
export function buildWhatsAppUrl(message: string = WA_DEFAULT_MESSAGE): string {
  const text = encodeURIComponent(message);
  return isMobileDevice()
    ? `https://wa.me/${WA_NUMBER}?text=${text}`
    : `https://web.whatsapp.com/send?phone=${WA_NUMBER}&text=${text}`;
}

// Para links renderizados en el server (SSR): arranca con el link mobile-safe
// y lo corrige a web.whatsapp.com en desktop una vez montado en el cliente,
// evitando mismatch de hidratación.
export function useWhatsAppUrl(message: string = WA_DEFAULT_MESSAGE): string {
  const [url, setUrl] = useState(
    () => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`
  );

  useEffect(() => {
    setUrl(buildWhatsAppUrl(message));
  }, [message]);

  return url;
}

export function buildWhatsAppUrlFromForm(
  nombre: string,
  telefono: string,
  mensaje: string
): string {
  const text = `Hola, soy ${nombre} (tel: ${telefono}). ${mensaje}`;
  return buildWhatsAppUrl(text);
}
