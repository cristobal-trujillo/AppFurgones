import { Section, SectionHeading } from "@/components/ui";

const pasos = [
  {
    titulo: "El furgón inicia el recorrido",
    texto:
      "El conductor abre la app y toca Iniciar viaje. Desde ese momento el vehículo comparte su ubicación con los apoderados del recorrido.",
  },
  {
    titulo: "El auxiliar confirma cada subida",
    texto:
      "En la parada marca quién subió, con un toque por estudiante. El apoderado recibe al instante la notificación con la hora exacta.",
  },
  {
    titulo: "El apoderado sigue el viaje",
    texto:
      "Ve el furgón avanzar en el mapa y la hora estimada de llegada, mientras su hijo va a bordo. Si hay atraso o desvío, le llega un aviso.",
  },
  {
    titulo: "Se confirma la entrega",
    texto:
      "Al dejar al estudiante, el auxiliar lo marca: llega la notificación de bajada con la hora y el seguimiento termina ahí mismo.",
  },
];

export function ComoFunciona() {
  return (
    <Section id="como-funciona">
      <SectionHeading
        eyebrow="Cómo funciona"
        title="Cuatro momentos, cero llamadas"
        lead="El flujo completo de un viaje, desde que el furgón sale hasta que se confirma la entrega de cada estudiante."
      />

      <ol className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {pasos.map((paso, i) => (
          <li key={paso.titulo} className="relative">
            <div className="flex items-center gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-900 text-base font-bold text-accent-400 dark:bg-accent-500 dark:text-brand-950">
                {i + 1}
              </span>
              {/* línea conectora, solo en escritorio */}
              {i < pasos.length - 1 ? (
                <span
                  aria-hidden="true"
                  className="hidden h-px flex-1 bg-gradient-to-r from-line to-transparent lg:block"
                />
              ) : null}
            </div>
            <h3 className="mt-5 text-lg font-bold">{paso.titulo}</h3>
            <p className="mt-2.5 text-[0.95rem] leading-relaxed text-ink-muted">
              {paso.texto}
            </p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
