"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { X, Calculator, ArrowLeft, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import {
  PRICE_CONFIG,
  calculateQuote,
  ExtinguisherKey,
  ServiceType,
} from "@/data/prices";

interface Props {
  variant?: "hero" | "navbar";
}

const RUBROS = [
  "Local comercial",
  "Edificio",
  "Cochera",
  "Oficina",
  "Hotel",
  "Depósito",
] as const;

type Rubro = (typeof RUBROS)[number];

export default function QuoteModal({ variant = "hero" }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<"quote" | "contact" | "success">("quote");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [showValidation, setShowValidation] = useState(false);

  // Quote state
  const [service, setService] = useState<ServiceType>("recarga");
  const [extKey, setExtKey] = useState<ExtinguisherKey>("abc");
  const [capacityIndex, setCapacityIndex] = useState(0);
  const [quantityStr, setQuantityStr] = useState("1");

  // Contact state
  const [nombre, setNombre] = useState("");
  const [rubro, setRubro] = useState<Rubro>("Local comercial");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [direccion, setDireccion] = useState("");
  const [horarios, setHorarios] = useState("9 a 18");

  useEffect(() => {
    setCapacityIndex(0);
  }, [extKey]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setStep("quote");
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    },
    [handleClose]
  );

  useEffect(() => {
    const handler = () => setIsOpen(true);
    window.addEventListener("sener:open-quote", handler);
    return () => window.removeEventListener("sener:open-quote", handler);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  const config = PRICE_CONFIG[extKey];
  const quantity = Math.max(1, parseInt(quantityStr) || 1);
  const result = calculateQuote(service, extKey, capacityIndex, quantity);

  function buildSummary(): string {
    const serviceLabel = service === "recarga" ? "Recarga" : "Venta nueva";
    const cap = config.capacities[capacityIndex];
    const units = quantity === 1 ? "matafuego" : "matafuegos";
    return `${serviceLabel} · ${quantity} ${units} · ${config.label} · ${cap?.label ?? ""}`;
  }

  const requiredMissing =
    !nombre.trim() || !telefono.trim() || !rubro;

  async function handleSubmit() {
    if (requiredMissing) {
      setShowValidation(true);
      return;
    }
    setIsSubmitting(true);
    setSubmitError("");
    try {
      const serviceLabel = service === "recarga" ? "Recarga" : "Venta nueva";
      const cap = config.capacities[capacityIndex];
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceLabel,
          extLabel: config.label,
          capacityLabel: cap?.label ?? "",
          quantity,
          unitPrice: result.type === "ok" ? result.unitPrice : null,
          total: result.type === "ok" ? result.total : null,
          discountPct: result.type === "ok" ? result.discountPct : 0,
          nombre, rubro, telefono, email, direccion,
          horarios: `Lun a Vie · ${horarios} hs`,
        }),
      });
      if (!res.ok) throw new Error();
      setStep("success");
    } catch {
      setSubmitError("No se pudo enviar el pedido. Intentá de nuevo o comunicate por WhatsApp.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const navbarClass =
    "border border-[var(--color-brand-red)] text-[var(--color-brand-red)] hover:bg-[var(--color-brand-red)] hover:text-white font-semibold px-4 py-2.5 rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-red)] focus:ring-offset-2";

  const heroClass =
    "btn-shimmer inline-flex items-center gap-2 bg-[var(--color-brand-red)] hover:bg-[var(--color-brand-red-dark)] text-white font-semibold px-6 py-3 rounded-lg text-sm transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent";

  const inputClass =
    "flex-1 border border-[var(--color-border)] rounded-lg px-3 py-2.5 text-sm text-[var(--color-brand-dark)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-red)] focus:border-transparent";

  const labelClass = "type-label text-[var(--color-text-muted)] sm:w-40 shrink-0";

  const iconBtnClass =
    "w-8 h-8 flex items-center justify-center rounded-full text-[var(--color-brand-gray)] hover:bg-[var(--color-surface-subtle)] transition-colors shrink-0";

  const ctaClass =
    "w-full text-center bg-[var(--color-brand-red)] hover:bg-[var(--color-brand-red-dark)] text-white font-semibold px-4 py-3 rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-red)] focus:ring-offset-2";

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={variant === "navbar" ? navbarClass : heroClass}
        aria-label="Calcular presupuesto de matafuegos"
      >
        {variant === "hero" && <Calculator className="w-4 h-4" aria-hidden="true" />}
        Calcular presupuesto
      </button>

      {isOpen && createPortal(
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
            aria-hidden="true"
          />

          {/* Scroll container */}
          <div
            className="fixed inset-0 z-[201] overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-labelledby="quote-title"
          >
            <div className="flex min-h-full items-center justify-center px-4 py-8 sm:py-20">
              <div className="relative bg-[var(--color-surface)] rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden my-4">

                {step === "quote" ? (
                  <>
                    {/* Header — logo izq (desktop), título centrado, X der */}
                    <div className="relative flex items-center px-6 py-4 border-b border-[var(--color-border)]">
                      <div className="hidden sm:block shrink-0">
                        <Image
                          src="/logo-nuevo.png"
                          alt="Matafuegos Sener"
                          width={1004}
                          height={355}
                          style={{ height: "32px", width: "auto" }}
                        />
                      </div>
                      <div className="absolute inset-x-0 flex flex-col items-center pointer-events-none px-12 sm:px-24">
                        <h2
                          id="quote-title"
                          className="text-base font-bold text-[var(--color-brand-dark)] text-center"
                        >
                          Calculá tu presupuesto
                        </h2>
                        <p className="text-xs text-[var(--color-text-muted)] text-center">
                          Valores de referencia · precio final por WhatsApp
                        </p>
                      </div>
                      <button onClick={handleClose} className={`ml-auto ${iconBtnClass}`} aria-label="Cerrar">
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Formulario */}
                    <div className="px-6 py-6 flex flex-col gap-4">

                      {/* Servicio */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <span className={labelClass}>Servicio</span>
                        <div className="grid grid-cols-2 gap-2 flex-1">
                          {(["recarga", "venta"] as const).map((s) => (
                            <button
                              key={s}
                              onClick={() => setService(s)}
                              className={`py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                                service === s
                                  ? "bg-[var(--color-brand-red)] text-white"
                                  : "bg-[var(--color-surface-subtle)] text-[var(--color-brand-gray)] hover:text-[var(--color-brand-dark)]"
                              }`}
                            >
                              {s === "recarga" ? "Recarga" : "Venta nueva"}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Tipo */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <label htmlFor="quote-type" className={labelClass}>Tipo</label>
                        <select
                          id="quote-type"
                          value={extKey}
                          onChange={(e) => setExtKey(e.target.value as ExtinguisherKey)}
                          className={inputClass}
                        >
                          {Object.entries(PRICE_CONFIG).map(([key, cfg]) => (
                            <option key={key} value={key}>{cfg.label}</option>
                          ))}
                        </select>
                      </div>

                      {/* Carga */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <label htmlFor="quote-capacity" className={labelClass}>Carga</label>
                        <select
                          id="quote-capacity"
                          value={capacityIndex}
                          onChange={(e) => setCapacityIndex(Number(e.target.value))}
                          className={inputClass}
                        >
                          {config.capacities.map((cap, i) => (
                            <option key={i} value={i}>
                              {cap.label}{cap[service] === null ? " — Consultar" : ""}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Cantidad + Precio unitario */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <label htmlFor="quote-qty" className={labelClass}>Cantidad</label>
                        <div className="flex-1 flex items-center gap-3">
                          <input
                            id="quote-qty"
                            type="number"
                            min={1}
                            value={quantityStr}
                            onChange={(e) => setQuantityStr(e.target.value)}
                            onBlur={() =>
                              setQuantityStr(String(Math.max(1, parseInt(quantityStr) || 1)))
                            }
                            className="w-24 border border-[var(--color-border)] rounded-lg px-3 py-2.5 text-sm text-[var(--color-brand-dark)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-red)] focus:border-transparent"
                          />
                          <span className="ml-auto type-label text-[var(--color-text-muted)] shrink-0">
                            x unidad
                          </span>
                          <div className="w-32 border border-[var(--color-border)] rounded-lg px-3 py-2.5 bg-[var(--color-surface-subtle)] text-sm text-[var(--color-brand-dark)]">
                            {result.type === "ok"
                              ? `$${result.unitPrice.toLocaleString("es-AR")}`
                              : "—"}
                          </div>
                        </div>
                      </div>

                      {/* Resultado */}
                      <div className="rounded-xl bg-[var(--color-surface-subtle)] border border-[var(--color-border)] px-5 py-4">
                        {result.type === "ok" ? (
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-[var(--color-brand-dark)]">
                              Total estimado
                              {result.discountPct > 0 && (
                                <span className="ml-2 text-xs bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-md font-semibold">
                                  −{result.discountPct}% volumen
                                </span>
                              )}
                            </span>
                            <span className="text-2xl font-bold text-[var(--color-brand-red)]">
                              ${result.total.toLocaleString("es-AR")}
                            </span>
                          </div>
                        ) : (
                          <p className="text-sm text-[var(--color-text-muted)] text-center py-1">
                            {result.type === "consultar"
                              ? "Esta combinación requiere cotización especial."
                              : "Completá los campos para ver el estimado."}
                          </p>
                        )}
                      </div>

                      {/* CTA */}
                      <button
                        type="button"
                        onClick={() => setStep("contact")}
                        className={ctaClass}
                      >
                        Confirmar este presupuesto
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Header contacto — flecha izq, título centrado, X der */}
                    <div className="relative flex items-center px-6 py-4 border-b border-[var(--color-border)]">
                      <button
                        onClick={() => setStep("quote")}
                        className={iconBtnClass}
                        aria-label="Volver al presupuesto"
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                      <div className="absolute inset-x-0 flex items-center justify-center pointer-events-none px-16">
                        <h2
                          id="quote-title"
                          className="text-base font-bold text-[var(--color-brand-dark)] text-center"
                        >
                          Completar datos
                        </h2>
                      </div>
                      <button onClick={handleClose} className={`ml-auto ${iconBtnClass}`} aria-label="Cerrar">
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Formulario de contacto */}
                    <div className="px-6 py-6 flex flex-col gap-4">

                      {/* Resumen de la consulta */}
                      <div className="rounded-xl bg-[var(--color-surface-subtle)] border border-[var(--color-border)] px-5 py-3">
                        <p className="type-label text-[var(--color-text-muted)] mb-1">Tu consulta</p>
                        <p className="text-sm font-semibold text-[var(--color-brand-dark)]">
                          {buildSummary()}
                        </p>
                        {result.type === "ok" && (
                          <p className="text-sm text-[var(--color-brand-red)] font-bold mt-0.5">
                            Total estimado: ${result.total.toLocaleString("es-AR")}
                            {result.discountPct > 0 && (
                              <span className="ml-2 text-xs bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-md font-semibold">
                                −{result.discountPct}% volumen
                              </span>
                            )}
                          </p>
                        )}
                      </div>

                      <p className="text-xs text-[var(--color-text-muted)]">
                        Completá tus datos y un agente se comunicará contigo dentro de las próximas 24 hs.
                      </p>

                      {/* Grid de campos — 2 columnas en desktop */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                        {/* Nombre empresa | Rubro */}
                        <div className="flex flex-col gap-1">
                          <label htmlFor="contact-nombre" className="type-label text-[var(--color-text-muted)]">
                            Nombre empresa <span className="text-[var(--color-brand-red)]">*</span>
                          </label>
                          <input
                            id="contact-nombre"
                            type="text"
                            value={nombre}
                            onChange={(e) => { setNombre(e.target.value); setShowValidation(false); }}
                            className={`w-full border rounded-lg px-3 py-2.5 text-sm text-[var(--color-brand-dark)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-red)] focus:border-transparent ${showValidation && !nombre.trim() ? "border-red-400 bg-red-50" : "border-[var(--color-border)]"}`}
                            placeholder="Ej: Restaurante El Buen Sabor"
                          />
                        </div>

                        <div className="flex flex-col gap-1">
                          <label htmlFor="contact-rubro" className="type-label text-[var(--color-text-muted)]">
                            Rubro <span className="text-[var(--color-brand-red)]">*</span>
                          </label>
                          <select
                            id="contact-rubro"
                            value={rubro}
                            onChange={(e) => setRubro(e.target.value as Rubro)}
                            className="w-full border border-[var(--color-border)] rounded-lg px-3 py-2.5 text-sm text-[var(--color-brand-dark)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-red)] focus:border-transparent"
                          >
                            {RUBROS.map((r) => (
                              <option key={r} value={r}>{r}</option>
                            ))}
                          </select>
                        </div>

                        {/* Teléfono | Horarios */}
                        <div className="flex flex-col gap-1">
                          <label htmlFor="contact-tel" className="type-label text-[var(--color-text-muted)]">
                            Teléfono <span className="text-[var(--color-brand-red)]">*</span>
                          </label>
                          <input
                            id="contact-tel"
                            type="tel"
                            value={telefono}
                            onChange={(e) => { setTelefono(e.target.value); setShowValidation(false); }}
                            className={`w-full border rounded-lg px-3 py-2.5 text-sm text-[var(--color-brand-dark)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-red)] focus:border-transparent ${showValidation && !telefono.trim() ? "border-red-400 bg-red-50" : "border-[var(--color-border)]"}`}
                            placeholder="Ej: 11 5318-0515"
                          />
                        </div>

                        <div className="flex flex-col gap-1">
                          <label htmlFor="contact-horarios" className="type-label text-[var(--color-text-muted)]">
                            Horarios
                          </label>
                          <div className="flex gap-1.5">
                            <div className="border border-[var(--color-border)] rounded-lg px-3 py-2.5 text-sm text-[var(--color-brand-gray)] bg-[var(--color-surface-subtle)] shrink-0 select-none">
                              Lun a Vie
                            </div>
                            <select
                              id="contact-horarios"
                              value={horarios}
                              onChange={(e) => setHorarios(e.target.value)}
                              className="flex-1 min-w-0 border border-[var(--color-border)] rounded-lg px-3 py-2.5 text-sm text-[var(--color-brand-dark)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-red)] focus:border-transparent"
                            >
                              <option value="9 a 18">9 a 18 hs</option>
                              <option value="9 a 12">9 a 12 hs</option>
                              <option value="12 a 18">12 a 18 hs</option>
                            </select>
                          </div>
                        </div>

                        {/* Email — ancho completo */}
                        <div className="sm:col-span-2 flex flex-col gap-1">
                          <label htmlFor="contact-email" className="type-label text-[var(--color-text-muted)]">
                            Email
                          </label>
                          <input
                            id="contact-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border border-[var(--color-border)] rounded-lg px-3 py-2.5 text-sm text-[var(--color-brand-dark)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-red)] focus:border-transparent"
                            placeholder="Ej: contacto@empresa.com"
                          />
                        </div>

                        {/* Dirección — ancho completo */}
                        <div className="sm:col-span-2 flex flex-col gap-1">
                          <label htmlFor="contact-dir" className="type-label text-[var(--color-text-muted)]">
                            Dirección
                          </label>
                          <input
                            id="contact-dir"
                            type="text"
                            value={direccion}
                            onChange={(e) => setDireccion(e.target.value)}
                            className="w-full border border-[var(--color-border)] rounded-lg px-3 py-2.5 text-sm text-[var(--color-brand-dark)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-red)] focus:border-transparent"
                            placeholder="Ej: Av. Corrientes 1234, CABA"
                          />
                        </div>

                      </div>

                      {/* Errores */}
                      {showValidation && requiredMissing && (
                        <p className="text-xs text-red-600 text-center">
                          Completá nombre empresa y teléfono para continuar.
                        </p>
                      )}
                      {submitError && (
                        <p className="text-xs text-red-600 text-center">{submitError}</p>
                      )}

                      {/* CTA */}
                      <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className={`${ctaClass} disabled:opacity-60 disabled:cursor-not-allowed`}
                      >
                        {isSubmitting ? "Enviando…" : "Realizar pedido"}
                      </button>
                    </div>
                  </>
                )}

                {step === "success" && (
                  <>
                    {/* Header éxito */}
                    <div className="relative flex items-center justify-center px-6 py-4 border-b border-[var(--color-border)]">
                      <h2 className="text-base font-bold text-[var(--color-brand-dark)]">
                        Pedido recibido
                      </h2>
                      <button onClick={handleClose} className={`absolute right-6 ${iconBtnClass}`} aria-label="Cerrar">
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Cuerpo éxito */}
                    <div className="px-6 py-8 flex flex-col items-center gap-5 text-center">
                      <CheckCircle2
                        className="w-14 h-14 text-emerald-500"
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />

                      <div className="flex flex-col gap-2">
                        <p className="text-lg font-bold text-[var(--color-brand-dark)]">
                          ¡Tu solicitud fue enviada!
                        </p>
                        <p className="text-sm text-[var(--color-brand-gray)] max-w-sm leading-relaxed">
                          En las próximas 24 horas un agente de Matafuegos Sener
                          se va a comunicar con vos por WhatsApp para confirmar
                          los detalles y coordinar el servicio.
                        </p>
                      </div>

                      <div className="w-full rounded-xl bg-[var(--color-surface-subtle)] border border-[var(--color-border)] px-5 py-3 text-left">
                        <p className="type-label text-[var(--color-text-muted)] mb-1">Tu consulta</p>
                        <p className="text-sm font-semibold text-[var(--color-brand-dark)]">
                          {buildSummary()}
                        </p>
                        {result.type === "ok" && (
                          <p className="text-sm text-[var(--color-brand-red)] font-bold mt-0.5">
                            Total estimado: ${result.total.toLocaleString("es-AR")}
                          </p>
                        )}
                      </div>

                      <button type="button" onClick={handleClose} className={ctaClass}>
                        Cerrar
                      </button>
                    </div>
                  </>
                )}

              </div>
            </div>
          </div>
        </>,
        document.body
      )}
    </>
  );
}
