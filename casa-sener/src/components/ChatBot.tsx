"use client";

import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import {
  initialState,
  getStateView,
  transition,
  buildWhatsAppUrl,
} from "@/data/chatbot-machine";
import type { ChatState } from "@/data/chatbot-machine";

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [state, setState] = useState<ChatState>(initialState);
  const [textInput, setTextInput] = useState("");
  const [whatsAppOpened, setWhatsAppOpened] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [state.history]);

  useEffect(() => {
    if (!isOpen) return;
    inputRef.current?.focus();
  }, [isOpen, state.stateKey]);

  function handleOpen() {
    setIsOpen(true);
  }

  function handleClose() {
    setIsOpen(false);
    setState(initialState);
    setTextInput("");
    setWhatsAppOpened(false);
  }

  function handleOption(value: string) {
    setState((prev) => transition(prev, value));
  }

  function handleTextSubmit() {
    if (!textInput.trim()) return;
    setState((prev) => transition(prev, textInput.trim()));
    setTextInput("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") handleTextSubmit();
  }

  function handleWhatsApp() {
    window.open(buildWhatsAppUrl(state.context), "_blank");
    setWhatsAppOpened(true);
  }

  function handleReset() {
    setState(initialState);
    setTextInput("");
    setWhatsAppOpened(false);
  }

  const view = getStateView(state);
  const { stateKey } = state;

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={isOpen ? handleClose : handleOpen}
        className="fixed bottom-6 right-6 z-[100] flex items-center justify-center w-12 h-12 rounded-full shadow-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-brand-red)]"
        style={{ backgroundColor: "var(--color-brand-red)", color: "white" }}
        aria-label={isOpen ? "Cerrar asistente" : "Abrir asistente"}
      >
        {isOpen ? (
          <X className="w-5 h-5" aria-hidden="true" />
        ) : (
          <MessageCircle className="w-5 h-5" aria-hidden="true" />
        )}
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div
          className="fixed bottom-20 right-6 z-[100] w-80 max-h-[520px] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          style={{ backgroundColor: "var(--color-surface)" }}
          role="dialog"
          aria-label="Asistente Matafuegos Sener"
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
          <div className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-2 min-h-0">
            {state.history.map((msg, i) => (
              <div
                key={i}
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
              <div className="flex flex-wrap gap-2">
                {view.options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleOption(opt.value)}
                    className="px-3 py-1.5 text-sm rounded-full border transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-red)]"
                    style={{
                      borderColor: "var(--color-border)",
                      color: "var(--color-brand-dark)",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                        "var(--color-brand-red)";
                      (e.currentTarget as HTMLButtonElement).style.color = "white";
                      (e.currentTarget as HTMLButtonElement).style.borderColor =
                        "var(--color-brand-red)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor = "";
                      (e.currentTarget as HTMLButtonElement).style.color =
                        "var(--color-brand-dark)";
                      (e.currentTarget as HTMLButtonElement).style.borderColor =
                        "var(--color-border)";
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}

            {(view.inputType === "text" || view.inputType === "number") && (
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type={view.inputType === "number" ? "number" : "text"}
                  min={view.inputType === "number" ? 1 : undefined}
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
              <div className="flex flex-col gap-2">
                <button
                  onClick={handleWhatsApp}
                  className="w-full py-2.5 rounded-lg text-sm font-semibold text-white transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-red)]"
                  style={{ backgroundColor: "var(--color-brand-red)" }}
                >
                  Abrir WhatsApp
                </button>
                {whatsAppOpened && (
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
              </div>
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
