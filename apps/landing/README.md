# apps/landing

Sitio web público de AppFurgones: landing page y páginas legales.

Corresponde a la **Fase W** del [plan de ejecución](../../PLAN.md).

## Stack

- **Next.js 16** (App Router) con generación estática
- **React 19** + **TypeScript**
- **Tailwind CSS 4** (configuración en CSS, dentro de `app/globals.css`)
- Sin dependencias de UI externas: los componentes y los íconos son propios

## Cómo correrlo

```bash
npm install --prefix apps/landing
npm run dev --prefix apps/landing
```

Queda en http://localhost:3000.

Otros comandos: `npm run build` (build de producción), `npm run start` (servir el
build), `npm run typecheck`.

## Estructura

```
app/
  layout.tsx          metadatos, fuente, idioma
  page.tsx            landing (compone las secciones)
  globals.css         paleta, colores semánticos claro/oscuro, estilos legales
  privacidad/         política de privacidad (borrador)
  terminos/           términos de servicio (borrador)
  api/contacto/       recepción del formulario
  robots.ts
  sitemap.ts
components/
  site-header.tsx     navegación, menú móvil
  hero.tsx            encabezado principal
  phone-mockup.tsx    maqueta de la pantalla del apoderado (SVG/CSS, sin imágenes)
  problema.tsx        por qué existe el producto
  como-funciona.tsx   los 4 pasos de un viaje
  caracteristicas.tsx features por rol
  seguridad.tsx       privacidad y datos de menores
  faq.tsx             preguntas frecuentes
  contacto.tsx        formulario
  site-footer.tsx
  legal-layout.tsx    contenedor de las páginas legales
  ui.tsx              Container, Section, Card, botones, listas
lib/
  site.ts             nombre, dominio, correo, textos base
```

## Variables de entorno

| Variable | Para qué | Obligatoria |
|---|---|---|
| `CONTACT_WEBHOOK_URL` | Destino de los mensajes del formulario de contacto | Sí, para que el formulario funcione |

Sin `CONTACT_WEBHOOK_URL`, el endpoint `/api/contacto` responde 503 a propósito y el
formulario muestra un mensaje pidiendo escribir al correo. Es deliberado: es
preferible a decirle a alguien que su mensaje llegó cuando en realidad se perdió.

## Pendientes antes de publicar

- [ ] **Reemplazar los PLACEHOLDER de `lib/site.ts`**: dominio, correo, razón social y RUT.
- [ ] **Revisión legal** de `/privacidad` y `/terminos`, y quitar el aviso de borrador en `components/legal-layout.tsx`.
- [ ] Conectar `CONTACT_WEBHOOK_URL` a un destino real.
- [ ] Definir el discurso según la decisión 2.5 del plan (¿se le vende al conductor dueño de su furgón o al colegio?). Hoy el texto habla a ambos.
- [ ] Reemplazar la maqueta de `phone-mockup.tsx` por capturas reales cuando exista la app.
- [ ] Imagen Open Graph para compartir en redes (`app/opengraph-image.png`).
- [ ] Quitar la insignia "En desarrollo" del hero (`site.enDesarrollo = false`) al lanzar.
- [ ] Agregar ESLint. Se dejó fuera del scaffold inicial a propósito, para no arrastrar una configuración rota.

## Notas de diseño

- La paleta vive en `app/globals.css`: tokens de marca en `@theme` y colores semánticos (`surface`, `ink`, `line`) como variables CSS que cambian con `prefers-color-scheme`. Para ajustar el tema oscuro se toca un solo bloque.
- El modo oscuro es automático según el sistema; no hay selector manual.
- La maqueta del teléfono es SVG y CSS puro: no hay imágenes que mantener ni que optimizar.
