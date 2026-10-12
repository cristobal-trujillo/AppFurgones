import { VanIcon } from "@/components/logo";

/**
 * Maqueta de la pantalla del apoderado. Es ilustrativa y hecha con SVG/CSS,
 * sin imágenes: cuando exista la app real, reemplazar por capturas de pantalla.
 */
export function PhoneMockup() {
  return (
    <div className="relative mx-auto w-fit">
      {/* resplandor de fondo */}
      <div
        aria-hidden="true"
        className="absolute -inset-10 -z-10 rounded-full bg-brand-200/40 blur-3xl dark:bg-brand-700/25"
      />

      {/* Teléfono */}
      <div className="relative rounded-[2.75rem] border-[10px] border-brand-950 bg-brand-950 shadow-2xl dark:border-brand-800 dark:bg-brand-800">
        <div className="relative w-[286px] overflow-hidden rounded-[2.1rem] bg-surface">
          {/* barra de estado */}
          <div className="flex items-center justify-between px-5 pb-1 pt-3 text-[11px] font-semibold text-ink-muted">
            <span>07:26</span>
            <span className="h-5 w-20 rounded-full bg-brand-950 dark:bg-brand-900" />
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-ink-muted/60" />
              <span className="h-2 w-2 rounded-full bg-ink-muted/60" />
              <span className="h-2 w-3.5 rounded-sm bg-ink-muted/60" />
            </span>
          </div>

          {/* encabezado */}
          <div className="px-5 pb-3 pt-2">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-500 dark:text-brand-300">
              Viaje en curso
            </p>
            <p className="text-[15px] font-bold">Ida · Colegio San José</p>
          </div>

          {/* mapa */}
          <div className="relative">
            <svg
              viewBox="0 0 286 250"
              className="block h-[250px] w-full"
              role="img"
              aria-label="Mapa con el recorrido del furgón, la parada de origen y el colegio de destino"
            >
              <rect
                width="286"
                height="250"
                className="fill-brand-50 dark:fill-brand-950"
              />

              {/* manzanas */}
              <g className="fill-surface dark:fill-brand-900/70">
                <rect x="14" y="18" width="78" height="62" rx="6" />
                <rect x="108" y="18" width="62" height="62" rx="6" />
                <rect x="186" y="18" width="86" height="62" rx="6" />
                <rect x="14" y="96" width="78" height="54" rx="6" />
                <rect x="108" y="96" width="62" height="54" rx="6" />
                <rect x="186" y="96" width="86" height="54" rx="6" />
                <rect x="14" y="166" width="78" height="68" rx="6" />
                <rect x="108" y="166" width="62" height="68" rx="6" />
                <rect x="186" y="166" width="86" height="68" rx="6" />
              </g>

              {/* el recorrido va 10px más abajo para no quedar bajo la notificación */}
              <g transform="translate(0 10)">
                {/* avenida principal, sobre la calle horizontal superior */}
                <path
                  d="M0 88h286"
                  className="stroke-accent-200 dark:stroke-brand-800"
                  strokeWidth="7"
                />

                {/* trayecto recorrido */}
                <path
                  d="M100 215V158h78"
                  className="stroke-brand-600 dark:stroke-accent-500"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
                {/* trayecto restante */}
                <path
                  d="M178 158V88h62"
                  className="stroke-brand-300 dark:stroke-brand-600"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="2 9"
                  fill="none"
                />

                {/* parada de origen */}
                <circle cx="100" cy="215" r="7" className="fill-surface" />
                <circle
                  cx="100"
                  cy="215"
                  r="7"
                  className="stroke-brand-600 dark:stroke-accent-500"
                  strokeWidth="3"
                  fill="none"
                />

                {/* destino: colegio */}
                <circle cx="240" cy="88" r="13" className="fill-brand-700 dark:fill-brand-600" />
                <path d="M240 80l8 4.5v9.5h-16v-9.5z" className="fill-white" />

                {/* furgón */}
                <circle
                  cx="178"
                  cy="158"
                  r="22"
                  className="animate-pulse fill-accent-400/30"
                />
                <circle cx="178" cy="158" r="15" className="fill-accent-500" />
                <g transform="translate(166 146) scale(0.75)">
                  <rect x="3" y="7" width="26" height="14" rx="4.5" className="fill-brand-950" />
                  <rect x="6.5" y="10.25" width="7.25" height="5.25" rx="1.6" className="fill-accent-200" />
                  <rect x="15.75" y="10.25" width="9.75" height="5.25" rx="1.6" className="fill-accent-200" />
                  <circle cx="10" cy="22.5" r="3.25" className="fill-brand-950" />
                  <circle cx="22" cy="22.5" r="3.25" className="fill-brand-950" />
                </g>
              </g>
            </svg>

            {/* notificación push sobre el mapa */}
            <div className="absolute inset-x-3 top-3 flex items-start gap-2.5 rounded-xl border border-line bg-surface-raised/95 p-2.5 shadow-card backdrop-blur-sm">
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-accent-400 text-brand-900">
                <VanIcon className="size-[18px]" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[13px] font-bold leading-tight">
                  Mateo subió al furgón
                </span>
                <span className="mt-0.5 block text-[11px] text-ink-muted">
                  Parada Los Aromos
                </span>
              </span>
              <span className="shrink-0 text-[11px] font-medium text-ink-muted">
                07:24
              </span>
            </div>

            {/* chip de tiempo estimado */}
            <div className="absolute bottom-3 right-3 rounded-full border border-line bg-surface-raised px-3 py-1.5 text-xs font-semibold shadow-card">
              Llega al colegio · 07:58
            </div>
          </div>

          {/* ficha del estudiante */}
          <div className="space-y-3 px-5 py-4">
            <div className="flex items-center gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-brand-100 text-sm font-bold text-brand-700 dark:bg-brand-800 dark:text-accent-400">
                M
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-bold">Mateo Rojas</span>
                <span className="block text-xs text-ink-muted">4° básico</span>
              </span>
              <span className="shrink-0 rounded-full bg-brand-600 px-2.5 py-1 text-[11px] font-bold text-white dark:bg-accent-500 dark:text-brand-950">
                A bordo
              </span>
            </div>

            <ol className="space-y-2 border-t border-line pt-3">
              {[
                { label: "Subió en Los Aromos", time: "07:24", done: true },
                { label: "Próxima parada", time: "07:31", done: false },
                { label: "Llegada al colegio", time: "07:58", done: false },
              ].map((step) => (
                <li key={step.label} className="flex items-center gap-2.5 text-xs">
                  <span
                    className={`size-2 shrink-0 rounded-full ${
                      step.done
                        ? "bg-brand-600 dark:bg-accent-500"
                        : "bg-line ring-1 ring-inset ring-ink-muted/30"
                    }`}
                  />
                  <span className={step.done ? "font-semibold" : "text-ink-muted"}>
                    {step.label}
                  </span>
                  <span className="ml-auto tabular-nums text-ink-muted">
                    {step.time}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
