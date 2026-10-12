import { PhoneMockup } from "@/components/phone-mockup";
import { ButtonLink, Container } from "@/components/ui";
import { site } from "@/lib/site";

const destacados = [
  "Notificación al subir y al bajar",
  "Ruta del día optimizada",
  "Funciona sin señal",
];

export function Hero() {
  return (
    <div className="relative overflow-hidden">
      {/* fondo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[620px] bg-gradient-to-b from-brand-50 to-transparent dark:from-brand-950"
      />

      <Container className="pb-20 pt-12 sm:pt-16 lg:pb-28">
        <div className="grid items-center gap-16 lg:grid-cols-[1fr_auto] lg:gap-10">
          <div className="max-w-xl">
            {site.enDesarrollo ? (
              <p className="inline-flex items-center gap-2 rounded-full border border-accent-300 bg-accent-200/50 px-3 py-1 text-xs font-semibold text-accent-700 dark:border-accent-600/50 dark:bg-accent-600/15 dark:text-accent-300">
                <span className="size-1.5 rounded-full bg-accent-600" />
                En desarrollo · buscando furgones para el piloto
              </p>
            ) : null}

            <h1 className="mt-5 text-4xl font-bold leading-[1.08] sm:text-5xl lg:text-[3.4rem]">
              Saber dónde viene el furgón, y cuándo llegó tu hijo.
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-ink-muted">
              {site.name} conecta al apoderado, al conductor y al auxiliar en una
              sola aplicación: ubicación del vehículo en vivo, confirmación de
              subida y bajada con la hora exacta, y la mejor ruta del día para
              quien maneja.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="#contacto">Solicitar una demo</ButtonLink>
              <ButtonLink href="#como-funciona" variant="secondary">
                Ver cómo funciona
              </ButtonLink>
            </div>

            <p className="mt-6 flex items-start gap-2.5 text-sm text-ink-muted">
              <svg
                viewBox="0 0 20 20"
                className="mt-0.5 size-5 shrink-0 text-brand-600 dark:text-accent-400"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M10 2.5l6 2.5v5c0 3.5-2.4 6.6-6 7.5-3.6-.9-6-4-6-7.5V5z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
                <path
                  d="m7.3 10.1 1.9 1.9 3.5-3.9"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>
                <strong className="font-semibold text-ink">
                  Seguimos al furgón, no al niño.
                </strong>{" "}
                El estudiante no necesita celular ni ningún dispositivo.
              </span>
            </p>

            <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3 border-t border-line pt-6">
              {destacados.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-sm font-medium text-ink-muted"
                >
                  <span className="size-1.5 rounded-full bg-accent-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:pl-8">
            <PhoneMockup />
          </div>
        </div>
      </Container>
    </div>
  );
}
