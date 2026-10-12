# AppFurgones

Plataforma de seguimiento y gestion de transporte escolar: app movil para apoderados,
conductores y auxiliares, panel administrativo web y sitio publico.

## Documentacion

- **[PLAN.md](PLAN.md)** — plan de ejecucion: decisiones, arquitectura, stack, fases y riesgos.
- **[docs/requerimientos.md](docs/requerimientos.md)** — transcripcion de los requerimientos originales.

## Estado

| Frente | Estado |
|---|---|
| Sitio web publico (`apps/landing`) | En curso — Fase W |
| Backend (`apps/api`) | No iniciado — Fase 0 |
| Panel admin (`apps/admin`) | No iniciado — Fase 1 |
| App movil (`apps/mobile`) | No iniciado — Fase 0 |

Decisiones de producto 2.1 a 2.3 cerradas; 2.4 a 2.8 en estudio (ver seccion 2 del plan).

## Correr el sitio web

```bash
npm install --prefix apps/landing
npm run dev --prefix apps/landing
```

Mas detalle en [apps/landing/README.md](apps/landing/README.md).
