"use client";

import { useState } from "react";
import { Container, Eyebrow } from "@/components/ui";
import { site } from "@/lib/site";

type Estado =
  | { tipo: "inicial" }
  | { tipo: "enviando" }
  | { tipo: "ok" }
  | { tipo: "error"; mensaje: string };

const perfiles = [
  "Conductor o dueño de furgón",
  "Colegio o empresa de transporte",
  "Apoderado",
  "Otro",
];

const inputClass =
  "w-full rounded-xl border border-line bg-surface px-4 py-3 text-base text-ink placeholder:text-ink-muted/70 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/25";

export function Contacto() {
  const [estado, setEstado] = useState<Estado>({ tipo: "inicial" });

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setEstado({ tipo: "enviando" });

    const datos = Object.fromEntries(new FormData(event.currentTarget));

    try {
      const res = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      });

      const cuerpo = (await res.json().catch(() => null)) as
        | { error?: string }
        | null;

      if (!res.ok) {
        setEstado({
          tipo: "error",
          mensaje:
            cuerpo?.error ??
            "No pudimos enviar el mensaje. Intenta de nuevo en un momento.",
        });
        return;
      }

      setEstado({ tipo: "ok" });
    } catch {
      setEstado({
        tipo: "error",
        mensaje: "No pudimos conectar con el servidor. Revisa tu conexión.",
      });
    }
  }

  return (
    <section id="contacto" className="py-20 sm:py-28">
      <Container>
        <div className="overflow-hidden rounded-3xl border border-line bg-brand-900 text-white dark:bg-brand-950">
          <div className="grid gap-10 p-8 sm:p-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <Eyebrow>Conversemos</Eyebrow>
              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                ¿Quieres probarlo en tu furgón?
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-brand-200">
                Estamos construyendo {site.name} y buscamos furgones y colegios
                para el piloto. Si te interesa participar, o quieres que te
                avisemos cuando esté disponible, déjanos tus datos.
              </p>

              <p className="mt-8 text-sm text-brand-300">
                También puedes escribirnos directo a{" "}
                <a
                  href={`mailto:${site.email}`}
                  className="font-semibold text-accent-400 underline decoration-accent-400/40 underline-offset-4 hover:decoration-accent-400"
                >
                  {site.email}
                </a>
              </p>
            </div>

            <div className="rounded-2xl bg-surface p-6 text-ink sm:p-8">
              {estado.tipo === "ok" ? (
                <div className="flex h-full flex-col items-start justify-center gap-4 py-6">
                  <span className="grid size-12 place-items-center rounded-full bg-brand-100 text-brand-700 dark:bg-brand-800 dark:text-accent-400">
                    <svg viewBox="0 0 24 24" className="size-7" fill="none" aria-hidden="true">
                      <path
                        d="m5 12.5 4.5 4.5L19 7.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <h3 className="text-xl font-bold">Mensaje recibido</h3>
                  <p className="text-[0.95rem] leading-relaxed text-ink-muted">
                    Gracias por escribirnos. Te vamos a contactar al correo que
                    nos dejaste.
                  </p>
                </div>
              ) : (
                <form onSubmit={onSubmit} className="space-y-4" noValidate={false}>
                  <div>
                    <label htmlFor="nombre" className="mb-1.5 block text-sm font-semibold">
                      Nombre
                    </label>
                    <input
                      id="nombre"
                      name="nombre"
                      type="text"
                      required
                      autoComplete="name"
                      maxLength={120}
                      placeholder="Nombre y apellido"
                      className={inputClass}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="email" className="mb-1.5 block text-sm font-semibold">
                        Correo
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        maxLength={160}
                        placeholder="tu@correo.cl"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="telefono" className="mb-1.5 block text-sm font-semibold">
                        Teléfono <span className="font-normal text-ink-muted">(opcional)</span>
                      </label>
                      <input
                        id="telefono"
                        name="telefono"
                        type="tel"
                        autoComplete="tel"
                        maxLength={40}
                        placeholder="+56 9 ..."
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="perfil" className="mb-1.5 block text-sm font-semibold">
                      Soy
                    </label>
                    <select id="perfil" name="perfil" required className={inputClass} defaultValue="">
                      <option value="" disabled>
                        Selecciona una opción
                      </option>
                      {perfiles.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="mensaje" className="mb-1.5 block text-sm font-semibold">
                      Mensaje <span className="font-normal text-ink-muted">(opcional)</span>
                    </label>
                    <textarea
                      id="mensaje"
                      name="mensaje"
                      rows={3}
                      maxLength={2000}
                      placeholder="Cuéntanos cuántos vehículos y estudiantes manejas."
                      className={`${inputClass} resize-y`}
                    />
                  </div>

                  {estado.tipo === "error" ? (
                    <p
                      role="alert"
                      className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-200"
                    >
                      {estado.mensaje}
                    </p>
                  ) : null}

                  <button
                    type="submit"
                    disabled={estado.tipo === "enviando"}
                    className="w-full rounded-xl bg-brand-900 px-5 py-3.5 text-base font-semibold text-white transition-colors hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-accent-500 dark:text-brand-950 dark:hover:bg-accent-400"
                  >
                    {estado.tipo === "enviando" ? "Enviando…" : "Enviar"}
                  </button>

                  <p className="text-xs leading-relaxed text-ink-muted">
                    Usamos tus datos solo para responderte. Puedes revisar la{" "}
                    <a
                      href="/privacidad"
                      className="underline underline-offset-2 hover:text-ink"
                    >
                      política de privacidad
                    </a>
                    .
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
