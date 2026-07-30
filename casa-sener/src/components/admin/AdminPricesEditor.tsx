"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Save, CheckCircle2 } from "lucide-react";
import { ExtinguisherKey, PriceConfig } from "@/data/prices";

interface Props {
  initialConfig: PriceConfig;
}

const EXTINGUISHER_KEYS: ExtinguisherKey[] = ["abc", "co2", "hcfc", "agua"];

const inputClass =
  "w-28 border border-[var(--color-border)] rounded-lg px-2.5 py-1.5 text-sm text-[var(--color-brand-dark)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-red)] focus:border-transparent";

function parsePrice(raw: string): number | null {
  const trimmed = raw.trim();
  if (trimmed === "") return null;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : null;
}

export default function AdminPricesEditor({ initialConfig }: Props) {
  const router = useRouter();
  const [config, setConfig] = useState<PriceConfig>(initialConfig);
  const [isSaving, setIsSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [error, setError] = useState("");

  function updateCapacity(
    extKey: ExtinguisherKey,
    index: number,
    patch: Partial<{ recarga: number | null; venta: number | null; activo: boolean }>
  ) {
    setConfig((prev) => {
      const capacities = prev[extKey].capacities.map((cap, i) =>
        i === index ? { ...cap, ...patch } : cap
      );
      return { ...prev, [extKey]: { ...prev[extKey], capacities } };
    });
    setSavedAt(null);
  }

  async function handleSave() {
    setIsSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/prices", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "No se pudo guardar");
      }
      setSavedAt(Date.now());
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo guardar");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[var(--color-brand-dark)]">Precios de matafuegos</h1>
          <p className="text-sm text-[var(--color-text-muted)]">
            Estos valores impactan directo en la calculadora del sitio.
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-sm text-[var(--color-brand-gray)] hover:text-[var(--color-brand-dark)] transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Salir
        </button>
      </div>

      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--color-surface-subtle)] border-b border-[var(--color-border)]">
                <th className="text-left px-4 py-3 type-label text-[var(--color-text-muted)]">Equipo</th>
                <th className="text-left px-4 py-3 type-label text-[var(--color-text-muted)]">Recarga</th>
                <th className="text-left px-4 py-3 type-label text-[var(--color-text-muted)]">Venta</th>
                <th className="text-center px-4 py-3 type-label text-[var(--color-text-muted)]">Activo</th>
              </tr>
            </thead>
            <tbody>
              {EXTINGUISHER_KEYS.map((extKey) => (
                <FragmentRows
                  key={extKey}
                  extKey={extKey}
                  config={config}
                  onChange={updateCapacity}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-[var(--color-brand-red)] hover:bg-[var(--color-brand-red-dark)] text-white font-semibold px-6 py-3 rounded-lg text-sm transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4" />
          {isSaving ? "Guardando…" : "Guardar cambios"}
        </button>
        {savedAt && (
          <span className="flex items-center gap-1.5 text-sm text-emerald-600 font-medium">
            <CheckCircle2 className="w-4 h-4" />
            Guardado
          </span>
        )}
        {error && <span className="text-sm text-red-600">{error}</span>}
      </div>
    </div>
  );
}

function FragmentRows({
  extKey,
  config,
  onChange,
}: {
  extKey: ExtinguisherKey;
  config: PriceConfig;
  onChange: (
    extKey: ExtinguisherKey,
    index: number,
    patch: Partial<{ recarga: number | null; venta: number | null; activo: boolean }>
  ) => void;
}) {
  const ext = config[extKey];
  return (
    <>
      <tr className="border-b border-[var(--color-border-subtle)]">
        <td colSpan={4} className="px-4 pt-4 pb-1 text-xs font-bold uppercase tracking-wide text-[var(--color-brand-red)]">
          {ext.label}
        </td>
      </tr>
      {ext.capacities.map((cap, i) => (
        <tr key={i} className="border-b border-[var(--color-border-subtle)] last:border-0">
          <td className="px-4 py-2 text-[var(--color-brand-dark)]">{cap.label}</td>
          <td className="px-4 py-2">
            <input
              type="number"
              className={inputClass}
              placeholder="Consultar"
              value={cap.recarga ?? ""}
              onChange={(e) => onChange(extKey, i, { recarga: parsePrice(e.target.value) })}
            />
          </td>
          <td className="px-4 py-2">
            <input
              type="number"
              className={inputClass}
              placeholder="Consultar"
              value={cap.venta ?? ""}
              onChange={(e) => onChange(extKey, i, { venta: parsePrice(e.target.value) })}
            />
          </td>
          <td className="px-4 py-2 text-center">
            <input
              type="checkbox"
              checked={cap.activo}
              onChange={(e) => onChange(extKey, i, { activo: e.target.checked })}
              className="w-4 h-4 accent-[var(--color-brand-red)]"
            />
          </td>
        </tr>
      ))}
    </>
  );
}
