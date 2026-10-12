import { Section, SectionHeading } from "@/components/ui";

const puntos = [
  {
    titulo: "No rastreamos a menores",
    texto:
      "El GPS está en el teléfono del conductor o del auxiliar. Seguimos al vehículo; la ubicación del estudiante se deriva de si va a bordo o no. El niño no lleva ningún dispositivo.",
  },
  {
    titulo: "El seguimiento termina al bajar",
    texto:
      "Cuando el auxiliar confirma la entrega, el apoderado deja de ver la posición del furgón. Nadie puede seguir el vehículo mientras lleva a los hijos de otros.",
  },
  {
    titulo: "Cada apoderado ve solo a su estudiante",
    texto:
      "Los permisos se validan en el servidor en cada consulta, no solo escondiendo opciones en la pantalla.",
  },
  {
    titulo: "Información sensible cifrada",
    texto:
      "Todo el tráfico va cifrado, y los datos sensibles también lo están en la base de datos. Los documentos de los conductores no son públicos.",
  },
  {
    titulo: "Consentimiento del apoderado",
    texto:
      "El tratamiento de los datos del estudiante requiere autorización expresa del apoderado, registrada con fecha y versión del texto aceptado.",
  },
  {
    titulo: "Accesos auditados",
    texto:
      "Las acciones relevantes quedan registradas: quién aprobó a un conductor, quién consultó datos de un estudiante y cuándo.",
  },
];

export function Seguridad() {
  return (
    <Section id="seguridad">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,26rem)_1fr] lg:gap-16">
        <div>
          <SectionHeading
            align="left"
            eyebrow="Seguridad y privacidad"
            title="Datos de niños: el estándar tiene que ser más alto"
            lead="Este producto maneja la ubicación y la identidad de menores de edad. Las decisiones de diseño parten de ahí, no al revés."
          />

          <div className="mt-8 rounded-2xl border border-accent-300 bg-accent-200/40 p-5 dark:border-accent-600/40 dark:bg-accent-600/10">
            <p className="text-[0.95rem] leading-relaxed">
              <strong className="font-semibold">El principio de fondo:</strong>{" "}
              recolectar lo mínimo necesario para que el servicio funcione. Si un
              dato no se usa para cuidar el viaje del estudiante, no se pide.
            </p>
          </div>
        </div>

        <dl className="grid gap-x-8 gap-y-8 sm:grid-cols-2">
          {puntos.map((p) => (
            <div key={p.titulo}>
              <dt className="flex items-start gap-2.5 font-bold">
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
                </svg>
                {p.titulo}
              </dt>
              <dd className="mt-2 pl-[1.9rem] text-[0.95rem] leading-relaxed text-ink-muted">
                {p.texto}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  );
}
