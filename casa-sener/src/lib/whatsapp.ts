export const WA_NUMBER = "5491153180515";

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
