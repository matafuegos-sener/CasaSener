export type ServiceType = "recarga" | "venta";
export type ExtinguisherKey = "abc" | "co2" | "hcfc" | "agua";

export type CapacityOption = {
  label: string;
  recarga: number | null;
  venta: number | null;
  activo: boolean;
};

export type ExtinguisherConfig = {
  label: string;
  capacities: CapacityOption[];
};

export type PriceConfig = Record<ExtinguisherKey, ExtinguisherConfig>;

export const DEFAULT_PRICE_CONFIG: PriceConfig = {
  abc: {
    label: "Polvo Químico Seco ABC",
    capacities: [
      { label: "1 kg",           recarga: 22757, venta: 21900,  activo: true },
      { label: "2,5 kg",         recarga: 27529, venta: null,   activo: true },
      { label: "5 kg",           recarga: 36705, venta: 112500, activo: true },
      { label: "10 kg",          recarga: 49552, venta: null,   activo: true },
      { label: "25 kg (rodante)", recarga: 165173, venta: null, activo: true },
    ],
  },
  co2: {
    label: "Dióxido de Carbono (CO₂)",
    capacities: [
      { label: "1 kg",   recarga: null,  venta: null,   activo: true },
      { label: "3,5 kg", recarga: 40376, venta: 452000, activo: true },
      { label: "5 kg",   recarga: 42578, venta: 585700, activo: true },
      { label: "10 kg",  recarga: null,  venta: null,   activo: true },
    ],
  },
  hcfc: {
    label: "HCFC 123",
    capacities: [
      { label: "3 kg",  recarga: 37000, venta: null, activo: true },
      { label: "5 kg",  recarga: 41000, venta: null, activo: true },
      { label: "10 kg", recarga: 52000, venta: null, activo: true },
    ],
  },
  agua: {
    label: "Agua / AFFF",
    capacities: [
      { label: "Agua BP — 10 lt",  recarga: 36705, venta: null, activo: true },
      { label: "Agua AFFF — 6 lt", recarga: 47717, venta: null, activo: true },
    ],
  },
};

type DiscountTier = {
  min: number;
  max: number | null;
  pct: number | null; // null = consultar
};

const VOLUME_TIERS: DiscountTier[] = [
  { min: 1,   max: 9,   pct: 0  },
  { min: 10,  max: 19,  pct: 5  },
  { min: 20,  max: 49,  pct: 10 },
  { min: 50,  max: 99,  pct: 15 },
  { min: 100, max: null, pct: null },
];

export type QuoteResult =
  | { type: "ok"; unitPrice: number; total: number; discountPct: number }
  | { type: "consultar" }
  | { type: "empty" };

export function calculateQuote(
  config: PriceConfig,
  service: ServiceType,
  extKey: ExtinguisherKey,
  capacityIndex: number,
  quantity: number
): QuoteResult {
  if (quantity < 1) return { type: "empty" };

  const capacity = config[extKey]?.capacities[capacityIndex];
  if (!capacity) return { type: "consultar" };

  const basePrice = capacity[service];
  if (basePrice === null) return { type: "consultar" };

  const tier = VOLUME_TIERS.find(
    (t) => quantity >= t.min && (t.max === null || quantity <= t.max)
  );
  if (!tier || tier.pct === null) return { type: "consultar" };

  const unitPrice = Math.round(basePrice * (1 - tier.pct / 100));
  return {
    type: "ok",
    unitPrice,
    total: unitPrice * quantity,
    discountPct: tier.pct,
  };
}
