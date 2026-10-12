import { Section, SectionHeading } from "@/components/ui";

const preguntas = [
  {
    q: "¿Mi hijo necesita un celular?",
    a: "No. El seguimiento se hace desde el teléfono del conductor o del auxiliar. El estudiante no necesita ningún dispositivo, y no se le rastrea de forma individual.",
  },
  {
    q: "¿Puedo ver el furgón en cualquier momento?",
    a: "No. Solo durante el viaje de su estudiante: desde que el furgón sale a buscarlo hasta que se confirma su bajada. Después de eso, la ubicación deja de compartirse.",
  },
  {
    q: "¿Qué pasa si el furgón pasa por una zona sin señal?",
    a: "La app guarda todo en el teléfono y lo sincroniza cuando recupera conexión. Las subidas y bajadas no se pierden: quedan registradas con la hora en que realmente ocurrieron.",
  },
  {
    q: "¿Funciona en iPhone y en Android?",
    a: "Sí, la aplicación está pensada para ambos sistemas. El panel de administración funciona en el navegador, desde cualquier computador.",
  },
  {
    q: "¿Sirve para un furgón independiente o para un colegio?",
    a: "Para los dos. Un conductor dueño de su furgón puede administrar sus propios recorridos y estudiantes, y un colegio o una empresa de transporte puede gestionar varios vehículos a la vez.",
  },
  {
    q: "¿Cómo se valida a un conductor?",
    a: "El conductor carga sus documentos (licencia, certificado de antecedentes) y queda pendiente de aprobación antes de poder operar. El sistema además avisa cuando un documento está por vencer.",
  },
  {
    q: "¿Cuánto cuesta?",
    a: "Estamos definiendo los planes. Escríbenos contándonos cuántos vehículos y estudiantes manejas y lo conversamos.",
  },
];

export function Faq() {
  return (
    <Section id="preguntas" soft>
      <SectionHeading
        eyebrow="Preguntas frecuentes"
        title="Lo que nos preguntan primero"
      />

      <div className="mx-auto mt-14 max-w-3xl divide-y divide-line border-y border-line">
        {preguntas.map((p) => (
          <details key={p.q} className="group py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-base font-semibold [&::-webkit-details-marker]:hidden">
              {p.q}
              <svg
                viewBox="0 0 20 20"
                className="size-5 shrink-0 text-ink-muted transition-transform group-open:rotate-45"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M10 4.5v11M4.5 10h11"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </summary>
            <p className="mt-3 max-w-2xl pr-9 text-[0.95rem] leading-relaxed text-ink-muted">
              {p.a}
            </p>
          </details>
        ))}
      </div>
    </Section>
  );
}
