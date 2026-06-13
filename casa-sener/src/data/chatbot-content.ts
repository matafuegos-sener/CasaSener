export type RubroKey = "edificio" | "cochera" | "oficina" | "hotel" | "deposito" | "local";
export type LocalSubtypeKey = "general" | "inflamables" | "gastronomia" | "musica";
export type ExtinguisherKeyHint = "abc" | "co2" | "hcfc" | "agua" | null;

export type RubroContent = {
  label: string;
  infoMessages: string[];
  alert?: string;
  recommendedExtKeyHint: ExtinguisherKeyHint;
};

export type ConditionalQuestion = {
  key: string;
  question: string;
  yesMessage: string;
};

export const LOCAL_SUBTYPES: Record<LocalSubtypeKey, RubroContent> = {
  general: {
    label: "Local Comercial general",
    infoMessages: [
      "ABC 5 kg cada 200 m².",
      "Si hay depósito o riesgo eléctrico (caja registradora): CO₂ 3,5 kg en esa zona.",
      "Altura máx de colocación: 1,50 m a la manija. Señalización IRAM 10005 obligatoria.",
    ],
    recommendedExtKeyHint: "abc",
  },
  inflamables: {
    label: "Local Comercial con inflamables",
    infoMessages: [
      "ABC 5 kg cada 150 m² + CO₂ 3,5 kg en tablero eléctrico.",
      "Si supera 300 m² o tiene depósito: rodante ABC 25 kg.",
      "Si fracciona inflamables: riesgo alto, habilitación especial + ventilación forzada certificada.",
    ],
    alert: "Si fraccionás inflamables en el local, la habilitación requiere inspección presencial y ventilación forzada certificada.",
    recommendedExtKeyHint: "abc",
  },
  gastronomia: {
    label: "Local Comercial gastronomía",
    infoMessages: [
      "Base igual a local general: ABC 5 kg cada 200 m².",
      "Cocina/freidora/hornallas: extintor Clase K (Acetato de Potasio) o Agua AFFF.",
      "Si hay campana extractora con ductos: puede exigirse sistema fijo de supresión.",
    ],
    alert: "El polvo ABC no es apto en cocinas. Se necesita Clase K (Acetato de Potasio) o Agua AFFF.",
    recommendedExtKeyHint: null,
  },
  musica: {
    label: "Local Comercial música en vivo",
    infoMessages: [
      "Encuadra como local de concurrencia masiva bajo Ley 5920.",
      "ABC cada 150 m² + CO₂ 3,5 kg en cabina de sonido/iluminación.",
      "Plan de Evacuación aprobado + simulacros + capacitación de personal. Habilitación con inspección presencial AGC.",
    ],
    alert: "Bajo Ley 5920 (local de concurrencia masiva): requiere Plan de Evacuación aprobado, simulacros anuales e inspección presencial AGC.",
    recommendedExtKeyHint: "abc",
  },
};

export const RUBRO_CONTENT: Record<Exclude<RubroKey, "local">, RubroContent> = {
  edificio: {
    label: "Edificio PH",
    infoMessages: [
      "ABC 5 kg por planta en zonas comunes (hall, pasillo, sala de máquinas).",
      "Sala de medidores / tableros eléctricos: CO₂ 3,5 kg.",
      "Subsuelo o PB con generador: ABC 5 kg adicional. Departamentos sin obligación, pero se recomienda ABC 1 kg.",
    ],
    recommendedExtKeyHint: "abc",
  },
  cochera: {
    label: "Cochera",
    infoMessages: [
      "ABC 5 kg cada 200 m².",
      "En la cabina de control o casilla del encargado: CO₂ 3,5 kg.",
    ],
    recommendedExtKeyHint: "abc",
  },
  oficina: {
    label: "Oficina",
    infoMessages: [
      "ABC 5 kg cada 200 m².",
      "Sala de servidores / racks / UPS: CO₂ 3,5 kg (el polvo destruye el equipamiento).",
      "Cocina / break room: ABC 2,5 kg adicional. Más de un piso: un matafuego por planta mínimo.",
    ],
    recommendedExtKeyHint: "abc",
  },
  hotel: {
    label: "Hotel",
    infoMessages: [
      "ABC 5 kg por planta en pasillos comunes.",
      "Recepción, sala de máquinas, lavandería, cocina: uno por zona. Cuartos de tableros: CO₂.",
      "Ley 5920 obligatoria: Plan de Evacuación aprobado + dos simulacros anuales.",
    ],
    alert: "Ley 5920 obligatoria: Plan de Evacuación aprobado y dos simulacros anuales.",
    recommendedExtKeyHint: "abc",
  },
  deposito: {
    label: "Depósito",
    infoMessages: [
      "ABC 10 kg cada 200 m² (mayor capacidad por densidad de carga de fuego).",
      "Estanterías > 3 m: cálculo también por volumen, accesos siempre despejados.",
      "La AGC suele inspeccionar con mayor rigurosidad.",
    ],
    recommendedExtKeyHint: "abc",
  },
};

export const COCHERA_QUESTIONS: Array<ConditionalQuestion & { key: "grande" | "surtidor" }> = [
  {
    key: "grande",
    question: "¿La cochera supera los 600 m² o tiene más de un nivel?",
    yesMessage: "En ese caso también se requiere un matafuego rodante de polvo ABC de 50 kg.",
  },
  {
    key: "surtidor",
    question: "¿Tiene surtidor o zona de combustible?",
    yesMessage: "Con surtidor o combustible puede exigirse espuma AFFF. Te recomendamos consultar.",
  },
];

export const DEPOSITO_QUESTIONS: Array<ConditionalQuestion & { key: "inflamables" }> = [
  {
    key: "inflamables",
    question: "¿Almacena materiales inflamables o productos químicos?",
    yesMessage: "En ese caso puede exigirse un matafuego rodante de polvo ABC de 50 kg y señalética especial de materiales peligrosos.",
  },
];
