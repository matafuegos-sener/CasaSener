import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthed } from "@/lib/adminAuth";
import { getPriceConfig, savePriceConfig } from "@/lib/priceStore";
import { ExtinguisherKey, PriceConfig } from "@/data/prices";

const EXTINGUISHER_KEYS: ExtinguisherKey[] = ["abc", "co2", "hcfc", "agua"];

export async function GET() {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const config = await getPriceConfig();
  return NextResponse.json(config, { headers: { "Cache-Control": "no-store" } });
}

export async function PUT(req: NextRequest) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const error = validate(body);
  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  await savePriceConfig(body as PriceConfig);
  return NextResponse.json({ ok: true });
}

function validate(body: unknown): string | null {
  if (!body || typeof body !== "object") return "Formato inválido";
  const config = body as Record<string, unknown>;

  for (const key of EXTINGUISHER_KEYS) {
    const ext = config[key] as { label?: unknown; capacities?: unknown } | undefined;
    if (!ext || typeof ext.label !== "string" || !Array.isArray(ext.capacities)) {
      return `Falta configuración de "${key}"`;
    }
    for (const cap of ext.capacities) {
      if (
        typeof cap !== "object" ||
        cap === null ||
        typeof cap.label !== "string" ||
        (cap.recarga !== null && typeof cap.recarga !== "number") ||
        (cap.venta !== null && typeof cap.venta !== "number") ||
        typeof cap.activo !== "boolean"
      ) {
        return `Carga inválida en "${key}"`;
      }
    }
  }
  return null;
}
