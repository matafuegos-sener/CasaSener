import { put, head } from "@vercel/blob";
import { DEFAULT_PRICE_CONFIG, PriceConfig } from "@/data/prices";

const BLOB_PATHNAME = "config/prices.json";
const LOCAL_PATH = ".data/prices.json";

const hasBlobToken = !!process.env.BLOB_READ_WRITE_TOKEN;

export async function getPriceConfig(): Promise<PriceConfig> {
  if (hasBlobToken) return getFromBlob();
  return getFromLocalFile();
}

export async function savePriceConfig(config: PriceConfig): Promise<void> {
  if (hasBlobToken) return saveToBlob(config);
  return saveToLocalFile(config);
}

async function getFromBlob(): Promise<PriceConfig> {
  try {
    const blob = await head(BLOB_PATHNAME);
    const res = await fetch(blob.url, { cache: "no-store" });
    if (!res.ok) throw new Error(`fetch blob failed: ${res.status}`);
    return (await res.json()) as PriceConfig;
  } catch {
    return DEFAULT_PRICE_CONFIG;
  }
}

async function saveToBlob(config: PriceConfig): Promise<void> {
  await put(BLOB_PATHNAME, JSON.stringify(config, null, 2), {
    access: "public",
    contentType: "application/json",
    allowOverwrite: true,
  });
}

async function getFromLocalFile(): Promise<PriceConfig> {
  const { readFile } = await import("node:fs/promises");
  const path = await import("node:path");
  try {
    const fullPath = path.join(process.cwd(), LOCAL_PATH);
    const raw = await readFile(fullPath, "utf-8");
    return JSON.parse(raw) as PriceConfig;
  } catch {
    return DEFAULT_PRICE_CONFIG;
  }
}

async function saveToLocalFile(config: PriceConfig): Promise<void> {
  const { writeFile, mkdir } = await import("node:fs/promises");
  const path = await import("node:path");
  const fullPath = path.join(process.cwd(), LOCAL_PATH);
  await mkdir(path.dirname(fullPath), { recursive: true });
  await writeFile(fullPath, JSON.stringify(config, null, 2), "utf-8");
}
