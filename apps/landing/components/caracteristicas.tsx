import { Card, FeatureList, Section, SectionHeading } from "@/components/ui";

const publicos = [
  {
    rol: "Para apoderados",
    resumen: "Saber qué está pasando, sin tener que preguntar.",
    items: [
      "Mapa en vivo mientras su hijo va a bordo",
      "Notificación de subida y de bajada, con la hora",
      "Hora estimada de llegada al colegio o a la casa",
      "Aviso de atraso o de desvío del recorrido",
      "Avisar una ausencia desde la app, sin llamar",
      "Historial de viajes de cada estudiante",
    ],
    icon: (
      <path
        d="M12 21s-7-4.5-7-10a7 7 0 1 1 14 0c0 5.5-7 10-7 10Z M12 11.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    ),
  },
  {
    rol: "Para conductores y auxiliares",
    resumen: "Una pantalla simple, pensada para usarse en movimiento.",
    items: [
      "Ruta del día con las paradas ya ordenadas",
      "Navegación con voz en Google Maps o Waze",
      "Asistencia en un toque por estudiante",
      "Funciona sin señal y sincroniza al recuperarla",
      "Ausencias avisadas antes de salir",
      "Registro de incidencias con foto",
    ],
    icon: (
      <path
        d="M4 16V9a2 2 0 0 1 2-2h8l4 3.5h.5a1.5 1.5 0 0 1 1.5 1.5v4h-2M4 16h2m10 0H8m-2 0a2 2 0 1 0 4 0m6 0a2 2 0 1 0 4 0"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    rol: "Para colegios y administradores",
    resumen: "Toda la operación en una sola vista.",
    items: [
      "Todos los furgones activos en un mapa",
      "Gestión de estudiantes, vehículos y recorridos",
      "Rutas generadas desde las direcciones de retiro",
      "Reportes de asistencia y de puntualidad",
      "Validación de conductores y de sus documentos",
      "Bitácora de las acciones realizadas",
    ],
    icon: (
      <path
        d="M4 19V7l8-3 8 3v12M4 19h16M9 19v-5h6v5M9.5 10h1m4 0h1"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
];

export function Caracteristicas() {
  return (
    <Section id="caracteristicas" soft>
      <SectionHeading
        eyebrow="Características"
        title="Tres roles, una misma plataforma"
        lead="Cada quien ve exactamente lo que necesita para hacer su parte, y nada más."
      />

      <div className="mt-14 grid gap-6 lg:grid-cols-3">
        {publicos.map((p) => (
          <Card key={p.rol} className="flex flex-col">
            <span className="grid size-12 place-items-center rounded-xl bg-brand-100 text-brand-700 dark:bg-brand-800 dark:text-accent-400">
              <svg viewBox="0 0 24 24" className="size-6" fill="none" aria-hidden="true">
                {p.icon}
              </svg>
            </span>
            <h3 className="mt-5 text-xl font-bold">{p.rol}</h3>
            <p className="mt-2 text-[0.95rem] text-ink-muted">{p.resumen}</p>
            <FeatureList items={p.items} />
          </Card>
        ))}
      </div>
    </Section>
  );
}
