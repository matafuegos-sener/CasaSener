"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import AnimateIn from "./AnimateIn";

const steps = [
  {
    number: "01",
    title: "Nos contactás",
    description: "Por WhatsApp o teléfono. Nos contás qué necesitás y coordinamos.",
  },
  {
    number: "02",
    title: "Revisión sin costo",
    description: "Evaluamos el estado de tus equipos y necesidades del espacio, sin cargo.",
  },
  {
    number: "03",
    title: "Retiro con préstamo",
    description: "Retiramos los equipos y te dejamos matafuegos de préstamo para que sigas cubierto.",
  },
  {
    number: "04",
    title: "Recarga bajo normas IRAM",
    description: "Prueba hidráulica, control completo, marbete del año y reemplazo de repuestos si corresponde.",
  },
  {
    number: "05",
    title: "Entrega y seguimiento",
    description: "Devolvemos los equipos en 48 hs a 5 días hábiles, certificados y en regla. Te acompañamos con controles periódicos.",
  },
];

const INTERVAL_MS = 3500;

export default function HowItWorks() {
  const [current, setCurrent] = useState(0);
  const [tick, setTick] = useState(0);
  const touchStartX = useRef(0);

  // Auto-advance — se reinicia cuando el usuario interactúa (tick cambia)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % steps.length);
    }, INTERVAL_MS);
    return () => clearInterval(timer);
  }, [tick]);

  function goTo(i: number) {
    setCurrent(i);
    setTick((t) => t + 1);
  }

  function goPrev() {
    goTo((current - 1 + steps.length) % steps.length);
  }

  function goNext() {
    goTo((current + 1) % steps.length);
  }

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function onTouchEnd(e: React.TouchEvent) {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      diff > 0 ? goNext() : goPrev();
    }
  }

  return (
    <section
      id="como-funciona"
      className="py-20 bg-[var(--color-bg-mid)]"
      aria-labelledby="how-heading"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateIn className="text-center mb-10">
          <p className="type-label label-red mb-2">El proceso</p>
          <h2
            id="how-heading"
            className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-brand-dark)]"
          >
            Simple, rápido y sin complicaciones
          </h2>
        </AnimateIn>

        {/* ── MOBILE: slider con loop, swipe y auto-advance ── */}
        <div className="sm:hidden">
          <div
            className="overflow-hidden rounded-2xl"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <div
              className="flex transition-transform duration-350 ease-in-out"
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {steps.map((step) => (
                <div key={step.number} className="w-full shrink-0 px-0.5">
                  <div className="bg-[var(--color-surface)] rounded-2xl px-7 py-10 text-center shadow-sm border border-[var(--color-border)] min-h-[260px] flex flex-col items-center justify-center gap-5">
                    <div className="w-16 h-16 rounded-full bg-[var(--color-surface)] border-2 border-[var(--color-brand-red)] flex items-center justify-center shrink-0">
                      <span className="text-base font-bold text-[var(--color-brand-red)]">{step.number}</span>
                    </div>
                    <h3 className="text-xl font-bold text-[var(--color-brand-dark)] leading-snug">
                      {step.title}
                    </h3>
                    <p className="text-base text-[var(--color-brand-gray)] leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Controles */}
          <div className="flex items-center justify-between mt-6 px-1">
            <button
              onClick={goPrev}
              className="w-11 h-11 rounded-full border-2 border-[var(--color-brand-red)] flex items-center justify-center text-[var(--color-brand-red)] transition-opacity hover:opacity-70"
              aria-label="Paso anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              {steps.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`rounded-full transition-all duration-300 ${
                    i === current
                      ? "w-6 h-2.5 bg-[var(--color-brand-red)]"
                      : "w-2.5 h-2.5 bg-[var(--color-border)] hover:bg-[var(--color-brand-red)]/40"
                  }`}
                  aria-label={`Ir al paso ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={goNext}
              className="w-11 h-11 rounded-full border-2 border-[var(--color-brand-red)] flex items-center justify-center text-[var(--color-brand-red)] transition-opacity hover:opacity-70"
              aria-label="Paso siguiente"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <p className="text-center text-xs text-[var(--color-text-muted)] mt-3">
            {current + 1} de {steps.length}
          </p>
        </div>

        {/* ── DESKTOP/TABLET: grid original ── */}
        <div className="hidden sm:block">
          <div className="relative">
            <div
              className="hidden lg:block absolute top-8 left-0 right-0 h-px bg-[var(--color-border)] z-0"
              aria-hidden="true"
            />
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-8 relative z-10">
              {steps.map((step, i) => (
                <AnimateIn key={step.number} delay={i * 0.1} className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-[var(--color-surface)] border-2 border-[var(--color-brand-red)] flex items-center justify-center mb-4 shrink-0">
                    <span className="text-sm font-bold text-[var(--color-brand-red)]">{step.number}</span>
                  </div>
                  <h3 className="font-bold text-[var(--color-brand-dark)] mb-2 text-sm leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-[var(--color-brand-gray)] text-xs leading-relaxed">
                    {step.description}
                  </p>
                </AnimateIn>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
