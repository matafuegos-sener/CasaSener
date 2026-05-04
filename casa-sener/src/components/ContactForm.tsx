"use client";

import { useState, FormEvent } from "react";
import { buildWhatsAppUrlFromForm } from "@/lib/whatsapp";

export default function ContactForm() {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [mensaje, setMensaje] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const url = buildWhatsAppUrlFromForm(nombre, telefono, mensaje);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  const inputClass =
    "w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-[var(--color-brand-dark)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-red)] focus:border-transparent transition-all duration-200";

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4"
      aria-label="Formulario de contacto"
      noValidate
    >
      <div>
        <label htmlFor="nombre" className="block text-sm font-medium text-[var(--color-brand-dark)] mb-1">
          Nombre <span aria-hidden="true" className="text-[var(--color-brand-red)]">*</span>
        </label>
        <input
          id="nombre"
          type="text"
          required
          autoComplete="name"
          placeholder="Tu nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className={inputClass}
          aria-required="true"
        />
      </div>

      <div>
        <label htmlFor="telefono" className="block text-sm font-medium text-[var(--color-brand-dark)] mb-1">
          Teléfono <span aria-hidden="true" className="text-[var(--color-brand-red)]">*</span>
        </label>
        <input
          id="telefono"
          type="tel"
          required
          autoComplete="tel"
          placeholder="+54 11 ..."
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          className={inputClass}
          aria-required="true"
        />
      </div>

      <div>
        <label htmlFor="mensaje" className="block text-sm font-medium text-[var(--color-brand-dark)] mb-1">
          Mensaje <span aria-hidden="true" className="text-[var(--color-brand-red)]">*</span>
        </label>
        <textarea
          id="mensaje"
          required
          rows={4}
          placeholder="Contanos qué necesitás..."
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          className={`${inputClass} resize-none`}
          aria-required="true"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-[var(--color-brand-red)] hover:bg-[var(--color-brand-red-dark)] text-white font-bold py-4 rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-red)] focus:ring-offset-2"
        aria-label="Enviar consulta por WhatsApp"
      >
        Enviar por WhatsApp
      </button>

      <p className="text-xs text-center text-gray-400">
        Al enviar, se abrirá WhatsApp con tu mensaje listo.
      </p>
    </form>
  );
}
