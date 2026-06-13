export type ServiceType = "recarga" | "venta";
export type ExtinguisherKey = "abc" | "co2" | "hcfc" | "agua";

export type CapacityOption = {
  label: string;
  recarga: number | null;
  venta: number | null;
};

export type ExtinguisherConfig = {
  label: string;
  capacities: CapacityOption[];
};

export const PRICE_CONFIG: Record<ExtinguisherKey, ExtinguisherConfig> = {
  abc: {
    label: "Polvo Químico Seco ABC",
    capacities: [
      { label: "1 kg",           recarga: 14000, venta: 21900  },
      { label: "2,5 kg",         recarga: 26000, venta: 55100  },
      { label: "5 kg",           recarga: 30000, venta: 78700  },
      { label: "10 kg",          recarga: 38000, venta: 135500 },
      { label: "25 kg (rodante)", recarga: 70000, venta: 504200 },
    ],
  },
  co2: {
    label: "Dióxido de Carbono (CO₂)",
    capacities: [
      { label: "1 kg",   recarga: null,  venta: 145400 },
      { label: "3,5 kg", recarga: 31000, venta: 452000 },
      { label: "5 kg",   recarga: 35000, venta: 585700 },
      { label: "10 kg",  recarga: 53000, venta: 972100 },
    ],
  },
  hcfc: {
    label: "HCFC 123",
    capacities: [
      { label: "3 kg",  recarga: 37000, venta: null },
      { label: "5 kg",  recarga: 41000, venta: null },
      { label: "10 kg", recarga: 52000, venta: null },
    ],
  },
  agua: {
    label: "Agua / AFFF",
    capacities: [
      { label: "Agua BP — 10 lt",  recarga: 28000, venta: null },
      { label: "Agua AFFF — 6 lt", recarga: 14500, venta: null },
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
  service: ServiceType,
  extKey: ExtinguisherKey,
  capacityIndex: number,
  quantity: number
): QuoteResult {
  if (quantity < 1) return { type: "empty" };

  const capacity = PRICE_CONFIG[extKey].capacities[capacityIndex];
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
