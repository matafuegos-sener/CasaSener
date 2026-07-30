import { NextResponse } from "next/server";
import { getPriceConfig } from "@/lib/priceStore";

export async function GET() {
  const config = await getPriceConfig();
  return NextResponse.json(config, {
    headers: { "Cache-Control": "no-store" },
  });
}
