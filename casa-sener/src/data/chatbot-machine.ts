import {
  type ServiceType,
  type ExtinguisherKey,
  type QuoteResult,
  type PriceConfig,
  calculateQuote,
} from "./prices";
import {
  type RubroKey,
  type LocalSubtypeKey,
  type RubroContent,
  LOCAL_SUBTYPES,
  RUBRO_CONTENT,
  COCHERA_QUESTIONS,
  DEPOSITO_QUESTIONS,
} from "./chatbot-content";

export type StateKey =
  | "INICIO"
  | "Q_SERVICIO"
  | "Q_TIPO"
  | "Q_CARGA"
  | "Q_CANTIDAD"
  | "Q_RESULTADO"
  | "R_RUBRO"
  | "R_LOCAL_SUBTIPO"
  | "R_COCHERA_GRANDE"
  | "R_COCHERA_SURTIDOR"
  | "R_DEPOSITO_INFLAMABLES"
  | "R_INFO"
  | "C_NOMBRE"
  | "C_RUBRO_NEGOCIO"
  | "C_TELEFONO"
  | "C_EMAIL"
  | "C_DIRECCION"
  | "C_HORARIOS"
  | "C_CONFIRMAR"
  | "FIN_INFO"
  | "FIN";

export type ChatMessage = { role: "bot" | "user"; text: string };

export type ChatContext = {
  // Quote
  service?: ServiceType;
  extKey?: ExtinguisherKey;
  capacityIndex?: number;
  quantity?: number;
  quoteResult?: QuoteResult;
  // Rubro
  rubroKey?: Exclude<RubroKey, "local">;
  localSubtype?: LocalSubtypeKey;
  conditionalYesMessages?: string[];
  // Contact
  nombre?: string;
  contactRubro?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  horarios?: string;
};

export type InputType = "buttons" | "text" | "number" | "none";

export type ButtonOption = { label: string; value: string };

export type StateView = {
  inputType: InputType;
  options?: ButtonOption[];
  placeholder?: string;
};

export type ChatState = {
  stateKey: StateKey;
  context: ChatContext;
  history: ChatMessage[];
};

// ─── Constants ───────────────────────────────────────────────────────────────

const INICIO_GREETING =
  "¡Hola! Soy el asistente de Matafuegos Sener. ¿En qué te puedo ayudar?";

// Fix #5: derive C_RUBRO_NEGOCIO options from the source of truth so labels
// stay in sync with RUBRO_CONTENT (e.g. "Edificio PH" not "Edificio").
const CONTACT_RUBRO_OPTIONS: ButtonOption[] = [
  { label: "Local Comercial", value: "Local Comercial" },
  ...Object.values(RUBRO_CONTENT).map((c) => ({ label: c.label, value: c.label })),
];

// ─── Internal helpers ────────────────────────────────────────────────────────

function getRubroContent(context: ChatContext): RubroContent {
  if (context.localSubtype) return LOCAL_SUBTYPES[context.localSubtype];
  if (context.rubroKey) return RUBRO_CONTENT[context.rubroKey];
  return RUBRO_CONTENT["edificio"];
}

function getServiceLabel(service: ServiceType): string {
  return service === "recarga" ? "Recarga" : "Venta nueva";
}

// Fix #1: single safe resolution point — avoids scattered non-null assertions.
type CapacityOption = PriceConfig[ExtinguisherKey]["capacities"][number];

function resolveCapacity(context: ChatContext, config: PriceConfig): CapacityOption | undefined {
  if (!context.extKey || context.capacityIndex === undefined) return undefined;
  return config[context.extKey].capacities[context.capacityIndex];
}

// Fix #4: derive the rubro label from structured data when available.
function resolveRubroLabel(context: ChatContext): string {
  if (context.localSubtype) return LOCAL_SUBTYPES[context.localSubtype].label;
  if (context.rubroKey) return RUBRO_CONTENT[context.rubroKey].label;
  return context.contactRubro ?? "-";
}

function buildQuoteResultMessages(context: ChatContext, config: PriceConfig): string[] {
  const { quoteResult, quantity } = context;
  if (!quoteResult || quoteResult.type === "empty") return ["No se pudo calcular la cotización."];

  if (quoteResult.type === "consultar") {
    return [
      "Esta combinación requiere cotización especial.",
      "Te contactamos a la brevedad con el precio.",
    ];
  }

  // Fix #1: guard against missing context instead of crashing with !
  const cap = resolveCapacity(context, config);
  if (!cap || !context.extKey) {
    return [
      "Esta combinación requiere cotización especial.",
      "Te contactamos a la brevedad con el precio.",
    ];
  }

  const { total, discountPct } = quoteResult;
  const discountText = discountPct > 0 ? ` (descuento ${discountPct}% por volumen)` : "";
  return [
    "Cotización estimada:",
    `💡 ${quantity}x ${config[context.extKey].label} ${cap.label} — Total: $${total.toLocaleString("es-AR")}${discountText}`,
  ];
}

function buildConfirmSummary(context: ChatContext, config: PriceConfig): string[] {
  const { quoteResult, service, quantity } = context;
  const lines: string[] = ["Resumen de tu pedido:"];

  if (quoteResult?.type === "ok") {
    // Fix #1: guard against missing context instead of crashing with !
    const cap = resolveCapacity(context, config);
    if (cap && context.extKey && service) {
      const { total } = quoteResult;
      lines.push(
        `Servicio: ${getServiceLabel(service)} · ${config[context.extKey].label} · ${cap.label} · ${quantity} unidades · $${total.toLocaleString("es-AR")}`
      );
    } else {
      lines.push("Servicio: requiere cotización especial.");
    }
  } else if (quoteResult?.type === "consultar") {
    lines.push("Servicio: requiere cotización especial.");
  }

  lines.push(
    `Nombre: ${context.nombre}`,
    `Rubro: ${resolveRubroLabel(context)}`,
    `Teléfono: ${context.telefono}`,
    `Email: ${context.email}`,
    `Dirección: ${context.direccion}`,
    `Horarios: ${context.horarios}`,
    "¿Todo correcto?"
  );
  return lines;
}

function getBotMessages(stateKey: StateKey, context: ChatContext, config: PriceConfig): string[] {
  switch (stateKey) {
    case "INICIO":
      return [INICIO_GREETING]; // Fix #6: use shared constant
    case "Q_SERVICIO":
      return ["¿Qué servicio necesitás?"];
    case "Q_TIPO":
      return ["¿Qué tipo de matafuego?"];
    case "Q_CARGA":
      return context.extKey
        ? [`¿Qué carga de ${config[context.extKey].label} necesitás?`]
        : ["¿Qué carga necesitás?"];
    case "Q_CANTIDAD":
      return ["¿Cuántas unidades?"];
    case "Q_RESULTADO":
      return buildQuoteResultMessages(context, config);
    case "R_RUBRO":
      return ["¿Cuál es el rubro de tu negocio?"];
    case "R_LOCAL_SUBTIPO":
      return ["¿Qué tipo de local es?"];
    case "R_COCHERA_GRANDE":
      return [COCHERA_QUESTIONS[0].question];
    case "R_COCHERA_SURTIDOR":
      return [COCHERA_QUESTIONS[1].question];
    case "R_DEPOSITO_INFLAMABLES":
      return [DEPOSITO_QUESTIONS[0].question];
    case "R_INFO": {
      const content = getRubroContent(context);
      return [
        `Esto es lo que necesitás para ${content.label}:`,
        ...content.infoMessages,
        ...(context.conditionalYesMessages ?? []),
        ...(content.alert ? [`⚠️ ${content.alert}`] : []),
        "¿Querés calcular el costo de lo que necesitás?",
      ];
    }
    case "C_NOMBRE":
      return [
        "Para establecer un contacto con ventas, necesito algunos datos. ¿Cuál es el nombre de tu empresa o negocio?",
      ];
    case "C_RUBRO_NEGOCIO":
      return ["¿A qué rubro pertenece?"];
    case "C_TELEFONO":
      return ["¿Cuál es tu número de teléfono?"];
    case "C_EMAIL":
      return ["¿Tu email?"];
    case "C_DIRECCION":
      return ["¿Cuál es la dirección del local?"];
    case "C_HORARIOS":
      return ["¿En qué horarios podemos contactarte o pasar a retirar los matafuegos?"];
    case "C_CONFIRMAR":
      return buildConfirmSummary(context, config);
    case "FIN":
      return ["Un agente se comunicará con vos dentro de las próximas 24 hs."];
    case "FIN_INFO":
      return [
        "¡Perfecto! Si en algún momento necesitás una cotización, volvé cuando quieras.",
        "Podés contactarnos por WhatsApp: 11 5318-0515",
      ];
  }
}

// ─── State view ──────────────────────────────────────────────────────────────

export function getStateView(state: ChatState, config: PriceConfig): StateView {
  const { stateKey, context } = state;

  switch (stateKey) {
    case "INICIO":
      return {
        inputType: "buttons",
        options: [
          { label: "Quiero una cotización", value: "quote" },
          { label: "¿Qué necesito para mi negocio?", value: "rubro" },
        ],
      };

    case "Q_SERVICIO":
      return {
        inputType: "buttons",
        options: [
          { label: "Recarga", value: "recarga" },
          { label: "Venta nueva", value: "venta" },
        ],
      };

    case "Q_TIPO":
      return {
        inputType: "buttons",
        options: (Object.entries(config) as [ExtinguisherKey, PriceConfig[ExtinguisherKey]][])
          .filter(([, cfg]) => cfg.capacities.some((cap) => cap.activo))
          .map(([key, cfg]) => ({ label: cfg.label, value: key })),
      };

    case "Q_CARGA": {
      const cfg = config[context.extKey!];
      const service = context.service!;
      const activeOnly = cfg.capacities
        .map((cap, idx) => ({ cap, idx }))
        .filter(({ cap }) => cap.activo);
      const allOptions = activeOnly.map(({ cap, idx }) => ({
        label: cap.label,
        value: String(idx),
        available: cap[service] !== null,
      }));
      const filtered = allOptions.filter((o) => o.available);
      const toShow = filtered.length > 0 ? filtered : allOptions;
      return {
        inputType: "buttons",
        options: toShow.map(({ label, value }) => ({ label, value })),
      };
    }

    case "Q_CANTIDAD":
      return { inputType: "number", placeholder: "Ej: 5" };

    case "Q_RESULTADO":
      return {
        inputType: "buttons",
        options: [
          { label: "Quiero que me contacten", value: "contact" },
          { label: "Cambiar algo", value: "restart" },
        ],
      };

    case "R_RUBRO": {
      const rubroOrder: Array<{ label: string; value: string }> = [
        { label: "Local Comercial", value: "local" },
        { label: RUBRO_CONTENT.edificio.label, value: "edificio" },
        { label: RUBRO_CONTENT.cochera.label, value: "cochera" },
        { label: RUBRO_CONTENT.oficina.label, value: "oficina" },
        { label: RUBRO_CONTENT.hotel.label, value: "hotel" },
        { label: RUBRO_CONTENT.deposito.label, value: "deposito" },
      ];
      return { inputType: "buttons", options: rubroOrder };
    }

    case "R_LOCAL_SUBTIPO":
      return {
        inputType: "buttons",
        options: (Object.entries(LOCAL_SUBTYPES) as [LocalSubtypeKey, RubroContent][]).map(
          ([key, content]) => ({ label: content.label, value: key })
        ),
      };

    case "R_COCHERA_GRANDE":
    case "R_COCHERA_SURTIDOR":
    case "R_DEPOSITO_INFLAMABLES":
      return {
        inputType: "buttons",
        options: [
          { label: "Sí", value: "si" },
          { label: "No", value: "no" },
        ],
      };

    case "R_INFO":
      return {
        inputType: "buttons",
        options: [
          { label: "Sí, calcular precio", value: "quote" },
          { label: "No, gracias", value: "fin" },
        ],
      };

    case "C_NOMBRE":
      return { inputType: "text", placeholder: "Ej: Restaurante El Buen Sabor" };

    case "C_RUBRO_NEGOCIO":
      // Fix #5: options derived from RUBRO_CONTENT so labels stay in sync
      return { inputType: "buttons", options: CONTACT_RUBRO_OPTIONS };

    case "C_TELEFONO":
      return { inputType: "text", placeholder: "Ej: 11 5318-0515" };

    case "C_EMAIL":
      return { inputType: "text", placeholder: "Ej: contacto@empresa.com" };

    case "C_DIRECCION":
      return { inputType: "text", placeholder: "Ej: Av. Corrientes 1234, CABA" };

    case "C_HORARIOS":
      return { inputType: "text", placeholder: "Ej: Lun-Vie 9-18 hs" };

    case "C_CONFIRMAR":
      return {
        inputType: "buttons",
        options: [
          { label: "Confirmar", value: "enviar" },
          { label: "Corregir algo", value: "corregir" },
        ],
      };

    case "FIN":
    case "FIN_INFO":
      return { inputType: "none" };
  }
}

// ─── Transition ──────────────────────────────────────────────────────────────

export function transition(state: ChatState, userInput: string, config: PriceConfig): ChatState {
  const { stateKey, context, history } = state;

  // Resolve the display label for button inputs
  const view = getStateView(state, config);
  let displayText = userInput;
  if (view.options) {
    const match = view.options.find((o) => o.value === userInput);
    if (match) displayText = match.label;
  }

  const newHistory: ChatMessage[] = [
    ...history,
    { role: "user", text: displayText },
  ];

  let newStateKey: StateKey;
  let newContext: ChatContext = { ...context };

  switch (stateKey) {
    case "INICIO":
      newStateKey = userInput === "quote" ? "Q_SERVICIO" : "R_RUBRO";
      break;

    case "Q_SERVICIO":
      newContext.service = userInput as ServiceType;
      newStateKey = newContext.extKey ? "Q_CARGA" : "Q_TIPO";
      break;

    case "Q_TIPO":
      newContext.extKey = userInput as ExtinguisherKey;
      newContext.capacityIndex = 0;
      newStateKey = "Q_CARGA";
      break;

    case "Q_CARGA":
      newContext.capacityIndex = parseInt(userInput, 10);
      newStateKey = "Q_CANTIDAD";
      break;

    case "Q_CANTIDAD": {
      const qty = parseInt(userInput, 10);

      // Fix #2: reject NaN / zero instead of silently clamping to 1
      if (isNaN(qty) || qty < 1) {
        const botHistory: ChatMessage[] = [
          { role: "bot", text: "Por favor ingresá una cantidad válida (número mayor a 0)." },
        ];
        return {
          stateKey: "Q_CANTIDAD",
          context: newContext,
          history: [...newHistory, ...botHistory],
        };
      }

      newContext.quantity = qty;
      newContext.quoteResult = calculateQuote(
        config,
        newContext.service!,
        newContext.extKey!,
        newContext.capacityIndex!,
        newContext.quantity
      );
      newStateKey = "Q_RESULTADO";
      break;
    }

    case "Q_RESULTADO":
      if (userInput === "contact") {
        newStateKey = "C_NOMBRE";
      } else {
        // restart — clear quote data
        newContext = {
          ...newContext,
          service: undefined,
          extKey: undefined,
          capacityIndex: undefined,
          quantity: undefined,
          quoteResult: undefined,
        };
        newStateKey = "Q_SERVICIO";
      }
      break;

    case "R_RUBRO":
      if (userInput === "local") {
        newStateKey = "R_LOCAL_SUBTIPO";
      } else if (userInput === "cochera") {
        newContext.rubroKey = "cochera";
        newContext.conditionalYesMessages = [];
        newStateKey = "R_COCHERA_GRANDE";
      } else if (userInput === "deposito") {
        newContext.rubroKey = "deposito";
        newContext.conditionalYesMessages = [];
        newStateKey = "R_DEPOSITO_INFLAMABLES";
      } else {
        newContext.rubroKey = userInput as Exclude<RubroKey, "local">;
        newContext.conditionalYesMessages = [];
        newStateKey = "R_INFO";
      }
      break;

    case "R_LOCAL_SUBTIPO":
      newContext.localSubtype = userInput as LocalSubtypeKey;
      newContext.conditionalYesMessages = [];
      newStateKey = "R_INFO";
      break;

    case "R_COCHERA_GRANDE":
      if (userInput === "si") {
        newContext.conditionalYesMessages = [
          ...(newContext.conditionalYesMessages ?? []),
          COCHERA_QUESTIONS[0].yesMessage,
        ];
      }
      newStateKey = "R_COCHERA_SURTIDOR";
      break;

    case "R_COCHERA_SURTIDOR":
      if (userInput === "si") {
        newContext.conditionalYesMessages = [
          ...(newContext.conditionalYesMessages ?? []),
          COCHERA_QUESTIONS[1].yesMessage,
        ];
      }
      newStateKey = "R_INFO";
      break;

    case "R_DEPOSITO_INFLAMABLES":
      if (userInput === "si") {
        newContext.conditionalYesMessages = [
          ...(newContext.conditionalYesMessages ?? []),
          DEPOSITO_QUESTIONS[0].yesMessage,
        ];
      }
      newStateKey = "R_INFO";
      break;

    case "R_INFO":
      if (userInput === "quote") {
        const content = getRubroContent(newContext);
        const hint = content.recommendedExtKeyHint;
        newContext = {
          ...newContext,
          extKey: hint ?? undefined,
        };
        newStateKey = "Q_SERVICIO";
      } else {
        newStateKey = "FIN_INFO";
      }
      break;

    case "C_NOMBRE":
      newContext.nombre = userInput;
      newStateKey = (newContext.rubroKey || newContext.localSubtype) ? "C_TELEFONO" : "C_RUBRO_NEGOCIO";
      break;

    case "C_RUBRO_NEGOCIO":
      newContext.contactRubro = userInput;
      newStateKey = "C_TELEFONO";
      break;

    case "C_TELEFONO":
      newContext.telefono = userInput;
      newStateKey = "C_EMAIL";
      break;

    case "C_EMAIL":
      newContext.email = userInput;
      newStateKey = "C_DIRECCION";
      break;

    case "C_DIRECCION":
      newContext.direccion = userInput;
      newStateKey = "C_HORARIOS";
      break;

    case "C_HORARIOS":
      newContext.horarios = userInput;
      newStateKey = "C_CONFIRMAR";
      break;

    case "C_CONFIRMAR":
      if (userInput === "enviar") {
        newStateKey = "FIN";
      } else {
        // corregir — reset contact fields, keep quote data
        newContext = {
          service: newContext.service,
          extKey: newContext.extKey,
          capacityIndex: newContext.capacityIndex,
          quantity: newContext.quantity,
          quoteResult: newContext.quoteResult,
          rubroKey: newContext.rubroKey,
          localSubtype: newContext.localSubtype,
          conditionalYesMessages: newContext.conditionalYesMessages,
        };
        newStateKey = "C_NOMBRE";
      }
      break;

    // Terminal states — no further transitions expected
    case "FIN":
    case "FIN_INFO":
      newStateKey = stateKey;
      break;
  }

  const botMessages = getBotMessages(newStateKey, newContext, config);
  const botHistory: ChatMessage[] = botMessages.map((text) => ({ role: "bot", text }));

  return {
    stateKey: newStateKey,
    context: newContext,
    history: [...newHistory, ...botHistory],
  };
}

// ─── Initial state ───────────────────────────────────────────────────────────

export const initialState: ChatState = {
  stateKey: "INICIO",
  context: {},
  history: [
    {
      role: "bot",
      text: INICIO_GREETING, // Fix #6: use shared constant
    },
  ],
};

// ─── Quote payload builder (para POST a /api/quote) ─────────────────────────

export function buildQuotePayload(context: ChatContext, config: PriceConfig) {
  const { service, extKey, quantity, quoteResult } = context;
  const cap = resolveCapacity(context, config);
  return {
    serviceLabel:   service ? getServiceLabel(service) : "—",
    extLabel:       extKey ? config[extKey].label : "—",
    capacityLabel:  cap?.label ?? "—",
    quantity:       quantity ?? 0,
    unitPrice:      quoteResult?.type === "ok" ? quoteResult.unitPrice : null,
    total:          quoteResult?.type === "ok" ? quoteResult.total : null,
    discountPct:    quoteResult?.type === "ok" ? quoteResult.discountPct : 0,
    nombre:         context.nombre    ?? "",
    rubro:          resolveRubroLabel(context),
    telefono:       context.telefono  ?? "",
    email:          context.email     ?? "",
    direccion:      context.direccion ?? "",
    horarios:       context.horarios  ?? "",
  };
}

// ─── WhatsApp URL builder (usado por ContactForm y QuoteModal) ────────────────

export function buildWhatsAppUrl(context: ChatContext, config: PriceConfig): string {
  const { quoteResult, service, quantity } = context;

  let quoteLines: string;
  if (quoteResult?.type === "ok") {
    // Fix #1: use resolveCapacity instead of crashing non-null assertions
    const cap = resolveCapacity(context, config);
    if (cap && context.extKey && service) {
      const { total, discountPct } = quoteResult;
      const discountText = discountPct > 0 ? ` (−${discountPct}% volumen)` : "";
      quoteLines =
        `Consulta: ${getServiceLabel(service)} · ${config[context.extKey].label} · ${cap.label} · ${quantity} unidades\n` +
        `Total estimado: $${total.toLocaleString("es-AR")}${discountText}`;
    } else {
      quoteLines = "Consulta: requiere cotización especial.";
    }
  } else if (quoteResult?.type === "consultar") {
    quoteLines = "Consulta: requiere cotización especial.";
  } else {
    quoteLines = "Consulta de información por normativa.";
  }

  const msg = [
    "Hola, me comunico desde el sitio de Matafuegos Sener.",
    "",
    quoteLines,
    "",
    `Nombre: ${context.nombre || "-"}`,
    `Rubro: ${resolveRubroLabel(context)}`, // Fix #4: derive label from structured data
    `Teléfono: ${context.telefono || "-"}`,
    `Email: ${context.email || "-"}`,
    `Dirección: ${context.direccion || "-"}`,
    `Horarios: ${context.horarios || "-"}`,
  ].join("\n");

  return `https://wa.me/5491153180515?text=${encodeURIComponent(msg)}`;
}
