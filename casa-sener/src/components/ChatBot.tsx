"use client";

import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import {
  initialState,
  getStateView,
  transition,
  buildQuotePayload,
} from "@/data/chatbot-machine";
import type { ChatState } from "@/data/chatbot-machine";
import { DEFAULT_PRICE_CONFIG, PriceConfig } from "@/data/prices";

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [state, setState] = useState<ChatState>(initialState);
  const [priceConfig, setPriceConfig] = useState<PriceConfig>(DEFAULT_PRICE_CONFIG);
  const [textInput, setTextInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/prices")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: PriceConfig | null) => {
        if (data) setPriceConfig(data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [state.history]);

  useEffect(() => {
    if (!isOpen) return;
    inputRef.current?.focus();
  }, [isOpen, state.stateKey]);

  useEffect(() => {
    const handler = () => setIsOpen(true);
    window.addEventListener("sener:open-chat", handler);
    return () => window.removeEventListener("sener:open-chat", handler);
  }, []);

  function handleOpen() {
    setIsOpen(true);
  }

  function handleClose() {
    setIsOpen(false);
    setState(initialState);
    setTextInput("");
    setSubmitError(false);
  }

  async function handleConfirm() {
    setSubmitting(true);
    setSubmitError(false);
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildQuotePayload(state.context, priceConfig)),
      });
      if (!res.ok) throw new Error("error");
      setState((prev) => transition(prev, "enviar", priceConfig));
    } catch {
      setSubmitError(true);
    } finally {
      setSubmitting(false);
    }
  }

  function handleOption(value: string) {
    if (state.stateKey === "C_CONFIRMAR" && value === "enviar") {
      handleConfirm();
      return;
    }
    setState((prev) => transition(prev, value, priceConfig));
  }

  function handleTextSubmit() {
    if (!textInput.trim()) return;
    setState((prev) => transition(prev, textInput.trim(), priceConfig));
    setTextInput("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") handleTextSubmit();
  }

  function handleReset() {
    setState(initialState);
    setTextInput("");
    setSubmitError(false);
  }

  const view = getStateView(state, priceConfig);
  const { stateKey } = state;

  return (
    <>
      {/* Floating trigger button */}
      {/* Mobile: burbuja circular — borde blanco, ícono rojo */}
      <button
        onClick={isOpen ? handleClose : handleOpen}
        className="sm:hidden fixed right-4 z-[100] w-14 h-14 rounded-full flex items-center justify-center border-2 border-white shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
        style={{
          bottom: "max(1.5rem, calc(1rem + env(safe-area-inset-bottom)))",
          backgroundColor: "var(--color-brand-red)",
        }}
        aria-label={isOpen ? "Cerrar asistente" : "Hacé tu consulta"}
      >
        {isOpen
          ? <X className="w-5 h-5 text-white" aria-hidden="true" />
          : <MessageCircle className="w-5 h-5 text-white" aria-hidden="true" />
        }
      </button>

      {/* Desktop: pill con texto — sin cambios */}
      <button
        onClick={isOpen ? handleClose : handleOpen}
        className="hidden sm:flex fixed right-6 z-[100] items-center gap-2 px-4 py-3 rounded-full shadow-lg transition-all duration-200 hover:brightness-110 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-brand-red)]"
        style={{
          backgroundColor: "var(--color-brand-red)",
          color: "white",
          bottom: "1.5rem",
        }}
        aria-label={isOpen ? "Cerrar asistente" : "Hacé tu consulta"}
      >
        {isOpen ? (
          <X className="w-4 h-4 shrink-0" aria-hidden="true" />
        ) : (
          <>
            <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span className="text-sm font-semibold whitespace-nowrap">Hacé tu consulta</span>
          </>
        )}
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div
          className="fixed bottom-20 right-3 sm:right-6 z-[100] w-[calc(100vw-1.5rem)] sm:w-80 max-h-[70dvh] sm:max-h-[520px] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          style={{ backgroundColor: "var(--color-surface)" }}
          role="dialog"
          aria-label="Asistente Matafuegos Sener"
          aria-modal="true"
        >
          {/* Header */}
          <div
            className="px-4 py-3 shrink-0"
            style={{ backgroundColor: "var(--color-brand-red)" }}
          >
            <p className="text-sm font-bold text-white">
              Asistente Matafuegos Sener
            </p>
            <p className="text-xs text-white" style={{ opacity: 0.8 }}>
              Te ayudamos a cumplir con la normativa
            </p>
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-2 min-h-0" aria-live="polite">
            {state.history.map((msg, i) => (
              <div
                key={`${i}-${msg.role}`}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] px-3 py-2 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "rounded-2xl rounded-tr-none text-white"
                      : "rounded-2xl rounded-tl-none text-[var(--color-brand-dark)]"
                  }`}
                  style={
                    msg.role === "user"
                      ? { backgroundColor: "var(--color-brand-red)" }
                      : { backgroundColor: "var(--color-surface-subtle)" }
                  }
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input area */}
          <div
            className="shrink-0 px-3 py-3 border-t"
            style={{ borderColor: "var(--color-border)" }}
          >
            {view.inputType === "buttons" && view.options && (
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap gap-2">
                  {view.options.map((opt) => {
                    const isConfirm = stateKey === "C_CONFIRMAR" && opt.value === "enviar";
                    return (
                      <button
                        key={opt.value}
                        onClick={() => handleOption(opt.value)}
                        disabled={isConfirm && submitting}
                        className="px-3 py-1.5 text-sm rounded-full border transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-red)] hover:bg-[var(--color-brand-red)] hover:text-white hover:border-[var(--color-brand-red)] disabled:opacity-50"
                        style={{
                          borderColor: "var(--color-border)",
                          color: "var(--color-brand-dark)",
                        }}
                      >
                        {isConfirm && submitting ? "Enviando…" : opt.label}
                      </button>
                    );
                  })}
                </div>
                {submitError && (
                  <p className="text-xs" style={{ color: "var(--color-brand-red)" }}>
                    Error al enviar. Intentá de nuevo.
                  </p>
                )}
              </div>
            )}

            {(view.inputType === "text" || view.inputType === "number") && (
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type={view.inputType === "number" ? "number" : "text"}
                  min={view.inputType === "number" ? 1 : undefined}
                  max={view.inputType === "number" ? 9999 : undefined}
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={view.placeholder ?? ""}
                  className="flex-1 text-sm px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-red)]"
                  style={{
                    borderColor: "var(--color-border)",
                    backgroundColor: "var(--color-surface)",
                    color: "var(--color-brand-dark)",
                  }}
                />
                <button
                  onClick={handleTextSubmit}
                  disabled={!textInput.trim()}
                  className="flex items-center justify-center w-9 h-9 rounded-lg transition-colors duration-150 disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-red)]"
                  style={{
                    backgroundColor: "var(--color-brand-red)",
                    color: "white",
                  }}
                  aria-label="Enviar"
                >
                  <Send className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            )}

            {view.inputType === "none" && stateKey === "FIN" && (
              <button
                onClick={handleReset}
                className="w-full py-2 rounded-lg text-sm border transition-colors duration-150 focus:outline-none"
                style={{
                  borderColor: "var(--color-border)",
                  color: "var(--color-brand-gray)",
                }}
              >
                Hacer otra consulta
              </button>
            )}

            {view.inputType === "none" && stateKey === "FIN_INFO" && (
              <button
                onClick={handleClose}
                className="w-full py-2.5 rounded-lg text-sm font-semibold transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-red)]"
                style={{
                  backgroundColor: "var(--color-surface-subtle)",
                  color: "var(--color-brand-dark)",
                }}
              >
                Cerrar
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
