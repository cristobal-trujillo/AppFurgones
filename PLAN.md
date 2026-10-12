# AppFurgones — Plan de ejecución

Plataforma de seguimiento y gestión de transporte escolar (furgones): app móvil para
apoderados, conductores y auxiliares; panel administrativo web; y landing page pública.

> Fuente de requerimientos: `App furgones doc.docx` (ver transcripción en `docs/requerimientos.md`).
> Este documento es la propuesta de ejecución: decisiones, arquitectura, stack, fases y riesgos.

---

## 1. Resumen ejecutivo

| | |
|---|---|
| **Qué se construye** | 1 app móvil (3 roles), 1 panel web admin, 1 landing page, 1 backend |
| **Stack central** | TypeScript de punta a punta: React Native (Expo) + React + NestJS + PostgreSQL/PostGIS |
| **Duración estimada** | 20–24 semanas a MVP en producción con piloto real (equipo de 3–4 personas) |
| **MVP demostrable** | semana 12 (fases 0–3: identidad, recorridos y viaje en vivo) |
| **Riesgo #1** | Tracking GPS en background en Android/iOS + aprobación en Google Play de `ACCESS_BACKGROUND_LOCATION` |
| **Riesgo #2** | Datos personales de menores de edad (Ley 21.719) y revisión de las tiendas |
| **Estado actual** | Fase W en curso: sitio web público (`apps/landing`). Decisiones 2.1–2.3 cerradas; 2.4–2.8 en estudio |

El corazón del producto no es el CRUD, es el **viaje en vivo**: un conductor manejando con
el celular en el bolsillo o en soporte, enviando posición de forma confiable con mala señal,
mientras 15 apoderados miran el mapa y esperan una notificación correcta. Todo el plan está
ordenado alrededor de eso. El CRUD existe para alimentar ese momento.

---

## 2. Decisiones de producto

Estas definiciones cambian la arquitectura. Estado al 12 de octubre de 2026:

| # | Decisión | Estado |
|---|---|---|
| 2.1 | Qué se rastrea: vehículo, no el menor | ✅ **Resuelta** |
| 2.2 | Quién marca subida y bajada: el auxiliar | ✅ **Resuelta** |
| 2.3 | Generación de la ruta desde domicilio + establecimiento | ✅ **Resuelta** |
| 2.4 | Ida y vuelta como recorridos distintos | 🔍 En estudio |
| 2.5 | Cliente: furgón independiente (B2C) o empresa/colegio (B2B) | 🔍 En estudio |
| 2.6 | Alcance del rol administrador | 🔍 En estudio |
| 2.7 | Estrategia de tracking GPS en background (móvil) | 🔍 En estudio |
| 2.8 | Arquitectura de ingesta de ubicación (camino caliente / frío) | 🔍 En estudio |

Ninguna de las cinco en estudio bloquea el desarrollo del sitio web, que es el frente en
curso. **2.5 sí debe resolverse antes de la Fase 1**, porque define si `organizacion_id` es
una entidad real o un campo testimonial. **2.7 y 2.8 deben resolverse antes de la Fase 3.**

### 2.1 ✅ Se rastrea el vehículo, no el estudiante

El documento pide *"Seguimiento en tiempo real de ubicación del estudiante"*. Se implementa
así:

- El GPS vive en el celular del conductor o del auxiliar. **No se rastrea a ningún menor** ni se instala nada en un dispositivo del estudiante.
- La "ubicación del estudiante" es una derivación de su estado: si está `a_bordo`, está donde está el furgón.
- **El seguimiento se corta al entregar al estudiante.** Cuando el auxiliar marca la bajada, el apoderado deja de ver la posición del vehículo: su hijo ya no va a bordo, así que no hay nada que seguir. El apoderado recibe la notificación de bajada y el viaje queda cerrado para él.

Esto además resuelve un problema de privacidad de forma elegante: un apoderado nunca puede
seguir el furgón mientras este lleva a los hijos de otros.

**Regla de visibilidad para el apoderado** (implementar en el gateway de WebSocket, no solo
en la UI):

| Estado del estudiante | ¿El apoderado ve la posición del furgón? |
|---|---|
| `pendiente` (el furgón viene en camino) | Sí |
| `a_bordo` | Sí |
| `entregado` | **No** — se corta el stream |
| `ausente` / `no_presentado` | No |
| Sin viaje en curso | No |

### 2.2 ✅ El auxiliar marca la subida y la bajada

El auxiliar es el dueño de la asistencia: su app es una lista con los nombres de la parada y
un botón grande por estudiante. Al marcar, el apoderado recibe la notificación
correspondiente, tanto al recoger como al dejar al estudiante. El conductor solo navega.

Pendiente de definir como caso secundario: **qué pasa cuando el furgón sale sin auxiliar.**
La respuesta por defecto es que el conductor marca con el vehículo detenido, con la
interacción bloqueada sobre 5 km/h y un botón "marcar todos los de esta parada". Se resuelve
en la Fase 3, no bloquea nada antes.

### 2.3 ✅ La ruta se genera desde el domicilio del estudiante y su establecimiento

Cada estudiante tiene dos datos geográficos obligatorios: **dirección de retiro** y
**establecimiento educacional** (su destino por defecto). La ruta se deriva de ahí:

```
nomina del recorrido (N estudiantes)
   -> domicilio de cada uno, ya geocodificado a lat/lng
   -> establecimiento como origen o destino comun
   -> Routes API con optimizeWaypointOrder
   -> orden sugerido de paradas + polyline + tiempos
```

Consecuencias de diseño que esto confirma:

- El domicilio se geocodifica **una sola vez**, al dar de alta al estudiante, con corrección manual del pin en el mapa. No se geocodifica en cada viaje.
- Las paradas no se ingresan a mano: se generan desde los domicilios. El admin solo corrige el orden o agrupa varios estudiantes de la misma cuadra en una parada compartida.
- Si dos estudiantes viven a menos de ~80 m, se sugiere unificarlos en una sola parada. Son menos detenciones y un trayecto más corto.
- Un cambio de domicilio o de colegio invalida el orden cacheado del recorrido y dispara un recálculo.

### 2.4 🔍 En estudio — Ida y vuelta como recorridos distintos

Un furgón hace *ida al colegio* (casas → establecimiento) y *vuelta a casa*
(establecimiento → casas), con orden inverso y a veces con distinta nómina de estudiantes
(no todos los niños vuelven en furgón, y no todos salen a la misma hora).

**Propuesta:** modelar `recorrido` con un campo `sentido` (`ida` | `vuelta`) y nóminas
independientes, y no intentar invertir una ruta automáticamente. La ida se optimiza para
llegar al colegio antes de una hora límite; la vuelta parte del colegio a una hora de salida.
Son problemas distintos aunque usen los mismos domicilios.

**Qué falta decidir:** si en el MVP basta con un solo sentido, y cómo se maneja un colegio
con varios horarios de salida (jornada completa vs. media jornada), que en la práctica obliga
a más de un recorrido de vuelta por furgón.

### 2.5 🔍 En estudio — Quién es el cliente: el furgón o el colegio

- **Modelo B2C (furgón independiente):** cada conductor-dueño se registra y administra sus propios estudiantes. Más simple, sin multi-tenant real.
- **Modelo B2B (empresa de transporte o colegio):** requiere `organizacion` como entidad raíz y aislamiento de datos por organización desde el día 1.

**Recomendación mientras se decide:** incluir `organizacion_id` en el esquema desde el
inicio, aunque el MVP tenga una sola organización por usuario. Cuesta casi nada ahora y
agregarlo después implica migrar todas las tablas. **Esta decisión debe cerrarse antes de la
Fase 1**: también define el discurso de la landing (¿se le vende al conductor dueño de su
furgón o al colegio?).

### 2.6 🔍 En estudio — Alcance del rol "administrador"

¿Es el administrador de la plataforma (ustedes) o el administrador de un furgón/empresa
(el cliente)? Probablemente ambos: `super_admin` (plataforma, valida conductores) y
`admin_org` (cliente, gestiona sus rutas). Depende directamente de 2.5, y afecta el
requerimiento "Validación y aprobación de conductores": si el que valida al conductor es la
plataforma, eso es un servicio con costo operativo; si es el colegio, es una función del
producto.

### 2.7 🔍 En estudio — Estrategia de tracking GPS en background

Es el riesgo técnico número uno del proyecto (ver riesgo #1 en la sección 14). Android mata
procesos en background de forma agresiva, especialmente en marcas como Xiaomi, Huawei y
Samsung, y sin tracking confiable el producto no existe.

**Opciones sobre la mesa:**

| Opción | Costo | Confiabilidad |
|---|---|---|
| `expo-location` + `expo-task-manager` | gratis | Suficiente para demo; pierde puntos en Android de gama baja con optimización de batería activa |
| `react-native-background-geolocation` (Transistorsoft) | licencia pagada, del orden de USD 300–400 (verificar) | Es el estándar del ecosistema RN para esto; maneja los casos borde de ambas plataformas |
| Flutter + `flutter_background_geolocation` | implica cambiar el stack móvil completo | Muy sólida, pero descarta el TypeScript unificado |

**Cómo se resuelve:** con el spike de 3 días descrito en la sección 17, punto 2. Una app
mínima que trackee 45 minutos con la pantalla apagada en un Android de gama baja real. La
decisión se toma con datos medidos, no con documentación. Mientras no se resuelva, se asume
el peor caso para el presupuesto: licencia pagada incluida.

### 2.8 🔍 En estudio — Arquitectura de ingesta de ubicación

La propuesta de la sección 3 (camino caliente por Redis + WebSocket, camino frío
submuestreado a PostGIS) es la que recomiendo, pero está sujeta a validación. Lo que hay que
confirmar antes de la Fase 3:

- **Frecuencia de muestreo:** cada 10 s y/o cada 50 m es un punto de partida, no un dato duro. Depende del consumo de batería y de datos medido en el spike de 2.7.
- **Submuestreo del historial:** cuánta resolución se necesita realmente para un replay útil y para responder una reclamación. Guardar un punto cada 30 s puede ser suficiente, o no.
- **Si se adopta Supabase** (sección 4.2), su Realtime podría reemplazar a Redis + Socket.IO para el camino caliente, simplificando la infraestructura a cambio de menos control sobre el fan-out.
- **Retención:** cuántos meses se conservan los tracks antes de anonimizar. Es una decisión mitad técnica (costo) y mitad legal (sección 9.2).

Hasta que esto se cierre, el requerimiento no funcional de latencia (p95 < 2 s) es un
objetivo declarado, no una promesa validada.

---

## 3. Arquitectura propuesta

```
                   +------------------------+
                   |   Landing page (SEO)   |  Next.js (SSG) -> Vercel
                   |   appfurgones.cl       |
                   +------------------------+

  +----------------------+        +--------------------------+
  |   App Movil (Expo)   |        |  Panel Admin (React SPA) |
  |  apoderado/conductor |        |   admin.appfurgones.cl   |
  |      /auxiliar       |        +--------------------------+
  +----------------------+                    |
        |         |                           |
        | REST    | WebSocket                 | REST + WebSocket
        v         v                           v
  +--------------------------------------------------------------+
  |                      API  (NestJS / Node)                    |
  |  +---------+ +----------+ +-----------+ +------------------+  |
  |  |  Auth   | | Dominio  | | Gateway   | |  Workers (Bull)  |  |
  |  |  RBAC   | |  CRUD    | | Realtime  | | notif / ETA /    |  |
  |  |         | |          | | (Socket)  | | geofence / rutas |  |
  |  +---------+ +----------+ +-----------+ +------------------+  |
  +--------------------------------------------------------------+
       |              |                 |                |
       v              v                 v                v
  +----------+  +-----------+   +--------------+   +--------------+
  | Postgres |  |   Redis   |   | Google Maps  |   |     FCM      |
  | +PostGIS |  | posicion  |   | Routes /     |   | (push iOS +  |
  | historico|  | actual +  |   | Geocoding /  |   |   Android)   |
  | negocio  |  | pub/sub + |   | Distance Mx  |   +--------------+
  +----------+  | colas     |   +--------------+
                +-----------+          +------------------+
  +----------+                         | S3 / R2          |
  | Sentry   |                         | docs: licencias, |
  | + logs   |                         | antecedentes     |
  +----------+                         +------------------+
```

**Principio clave — dos caminos para la ubicación** (propuesta en estudio, ver 2.8):

1. **Camino caliente (tiempo real):** posición → API → Redis (`SET` última posición + `PUBLISH` al room del viaje) → WebSocket → apoderados. Latencia objetivo < 2 s. Nunca toca Postgres.
2. **Camino frío (historial):** un worker toma las posiciones acumuladas y persiste un track *submuestreado* (1 punto cada 15–30 s) como `LINESTRING` en PostGIS al cerrar el viaje. Mantiene la base chica y el historial consultable.

Escribir cada ping GPS directo a Postgres es el error clásico que mata el rendimiento de
este tipo de sistema.

**Volumen real (dimensionamiento):** 50 furgones × 2 viajes/día × 45 min × 1 punto cada 10 s
≈ 27.000 posiciones/día. Es poco. Esta arquitectura aguanta 500+ furgones sin cambios
estructurales.

---

## 4. Stack tecnológico

### 4.1 Decisiones principales

| Componente | Decisión | Por qué | Alternativa considerada |
|---|---|---|---|
| **App móvil** | **React Native + Expo** (con *dev client*, no managed puro) | Un código para Android+iOS; mismo lenguaje (TS) que backend y web, clave para un equipo chico; EAS Build evita necesitar un Mac para compilar iOS; OTA updates para corregir sin pasar por revisión de tienda | **Flutter**: mejor rendimiento de UI y `flutter_background_geolocation` es muy sólido. Elegir Flutter solo si el equipo ya sabe Dart. |
| **Mapas en móvil** | `react-native-maps` (Google Maps) | Mejor cobertura y datos de tráfico en Chile; nativo en ambas plataformas | Mapbox (mejor estilizado y offline), MapLibre (gratis) |
| **GPS en background** | `react-native-background-geolocation` (Transistorsoft, **licencia pagada**) | Es la única librería del ecosistema RN que sobrevive de forma confiable a las optimizaciones de batería de Android y al ciclo de vida de iOS. Resuelve el riesgo #1 del proyecto | `expo-location` + `expo-task-manager` (gratis, suficiente para MVP/demo, con pérdida de puntos en Android agresivos). **Plan: partir con Expo gratis en Fase 3, validar en terreno, comprar la licencia si hay pérdida de datos.** |
| **Panel admin web** | **React + Vite + TypeScript**, TanStack Query, React Hook Form + Zod, Tailwind + shadcn/ui, TanStack Table | Una SPA interna no necesita SSR ni SEO; Vite da el ciclo de desarrollo más rápido; shadcn/ui entrega tablas, formularios y modales listos (ahorra semanas de UI) | Next.js (innecesario para una SPA detrás de login), Refine / React-Admin (más rápido aún, menos control) |
| **Mapas en admin** | Google Maps JS API con `@vis.gl/react-google-maps` | Consistencia con la app; dibujo y arrastre de paradas | MapLibre con tiles propios |
| **Landing page** | **Next.js (App Router), SSG** | SEO real (este negocio se vende por búsqueda local), Lighthouse alto, deploy gratis en Vercel, y es donde viven la Política de Privacidad y los Términos (**obligatorios** para publicar en las tiendas) | Astro (aún más liviano y perfecto para esto), HTML estático |
| **Backend** | **NestJS** (TypeScript) — REST + WebSocket Gateway | Estructura opinada (módulos, DI, guards, pipes) que mantiene ordenado un dominio con muchas reglas de permisos; validación con `class-validator`; Swagger automático; WebSockets integrados | **Supabase** (ver 4.2), Fastify puro (más rápido de arrancar, menos estructura), Django/Laravel (rompe el TS unificado) |
| **ORM** | **Prisma** + migraciones versionadas | Tipos generados que se comparten con el front; migraciones reproducibles | TypeORM (nativo en Nest, DX inferior), Drizzle |
| **Base de datos** | **PostgreSQL 16 + PostGIS** | El dominio es fuertemente relacional (estudiantes↔apoderados↔recorridos↔paradas↔vehículos): Postgres es la respuesta correcta. PostGIS da geofences, distancias y tracks reales en SQL | Firestore (**descartado**: este modelo relacional en NoSQL se vuelve ingobernable y los reportes son un dolor) |
| **Caché / realtime / colas** | **Redis** (+ BullMQ) | Última posición por vehículo, pub/sub de WebSocket, colas de notificaciones y de recálculo de rutas, rate limiting | Postgres LISTEN/NOTIFY (sirve, no escala igual) |
| **Push notifications** | **FCM** (Android + iOS vía APNs) desde el backend | Un solo proveedor para ambas plataformas, gratis | Expo Push (más simple, un intermediario más), OneSignal |
| **Rutas y optimización** | **Google Maps Platform**: Routes API (`optimizeWaypointOrder`), Distance Matrix (ETA), Geocoding (domicilios), Roads (snap-to-road) | Mejores datos de tráfico en Chile; `optimizeWaypointOrder` resuelve "reordenamiento de paradas" sin implementar un TSP a mano | **OSRM + VROOM** autohospedado: gratis e ilimitado, pero sin tráfico en vivo. Buen híbrido: VROOM para el orden base, Google solo para ETA y recálculo. |
| **Autenticación** | JWT access (15 min) + refresh rotativo en almacenamiento seguro del dispositivo; Argon2id para contraseñas; OTP por SMS opcional para conductores | Control total sobre el RBAC complejo del proyecto | Auth0/Clerk (más rápido, costo por usuario activo), Supabase Auth |
| **Archivos** | Cloudflare R2 o S3, con URLs prefirmadas de corta vida | Documentos sensibles (licencia, certificado de antecedentes, foto del estudiante) nunca públicos | — |
| **Monorepo** | pnpm workspaces + Turborepo | Tipos, esquemas Zod y reglas de dominio compartidos entre móvil, admin y API: una sola fuente de verdad | Repos separados (duplicación de tipos garantizada) |
| **Infraestructura** | Docker. MVP en **Railway / Render / Fly.io**; producción en **GCP** (región Santiago `southamerica-west1`) o AWS `sa-east-1` (São Paulo) | Partir con PaaS para no gastar semanas en infra. GCP tiene región en Chile, lo que baja la latencia del tiempo real. **Verificar precios y disponibilidad actual antes de comprometerse** | Kubernetes (sobredimensionado para esta etapa) |
| **Observabilidad** | Sentry (móvil + web + API), `pino` con logs estructurados, uptime externo | Sin Sentry en la app móvil, los errores de los conductores en terreno son invisibles | Grafana/Prometheus (más adelante) |
| **CI/CD** | GitHub Actions + EAS Build/Submit | Lint, test y build por PR; builds y subida a tiendas automatizadas | — |

### 4.2 Alternativa a evaluar en Fase 0: Supabase en lugar de NestJS

Vale la pena considerarla en serio si el plazo es agresivo o el equipo es de 1–2 personas:

- **A favor:** Postgres administrado + Auth + Realtime + Storage + Row Level Security listos de fábrica. Elimina unas 3 semanas de trabajo de infraestructura y autenticación. RLS calza bien con el modelo por roles.
- **En contra:** la lógica compleja (orquestación de notificaciones, evaluación de geofences, llamadas a Routes API, reportes, auditoría) termina repartida entre Edge Functions y políticas RLS, que es más difícil de testear y depurar que un servicio NestJS. Las políticas RLS para un grafo de permisos como "un apoderado ve solo los viajes de los recorridos donde está asignado su estudiante" se vuelven densas.

**Recomendación:** NestJS si el equipo es de 3+ personas y el proyecto debe sostenerse en el
tiempo. Supabase si hay que mostrar algo funcionando en 6 semanas. **Híbrido viable y
pragmático:** Supabase como Postgres administrado + Storage, y NestJS como la única capa de
lógica y API (sin usar RLS ni PostgREST). Lo mejor de ambos.

---

## 5. Modelo de datos

### 5.1 Entidades núcleo

```
organizacion
  id, nombre, rut, plan, activa

usuario
  id, organizacion_id, email, telefono, password_hash, rol,
  estado (pendiente|activo|suspendido), email_verificado, ultimo_acceso

  perfil_apoderado   -> usuario_id, nombre, rut, direccion, contacto_emergencia
  perfil_conductor   -> usuario_id, nombre, rut, licencia_clase, licencia_vence,
                        estado_validacion (pendiente|aprobado|rechazado),
                        validado_por, validado_en, motivo_rechazo
  perfil_auxiliar    -> usuario_id, nombre, rut, estado_validacion, ...

documento_validacion
  id, usuario_id, tipo (licencia|antecedentes|cedula|curso), url_s3,
  vence_en, estado, revisado_por         // soporta "validacion y aprobacion"

estudiante
  id, organizacion_id, nombre, rut, fecha_nacimiento, curso,
  establecimiento_id, direccion_texto, ubicacion GEOGRAPHY(Point),
  notas_medicas (cifrado), foto_url, activo

apoderado_estudiante           // N:N -- un nino puede tener 2 apoderados
  apoderado_id, estudiante_id, parentesco, es_contacto_principal,
  puede_autorizar_retiro

establecimiento
  id, nombre, direccion, ubicacion GEOGRAPHY(Point)

vehiculo
  id, organizacion_id, patente, marca, modelo, anio, capacidad_maxima,
  revision_tecnica_vence, seguro_vence, activo

asignacion_vehiculo            // historial, no un FK suelto
  vehiculo_id, usuario_id, tipo (conductor|auxiliar), desde, hasta

recorrido                      // PLANTILLA
  id, organizacion_id, nombre, sentido (ida|vuelta), vehiculo_id,
  establecimiento_id, dias_semana[], hora_inicio_prevista, activo

parada
  id, recorrido_id, orden, tipo (domicilio|establecimiento|punto),
  direccion_texto, ubicacion GEOGRAPHY(Point), ventana_minutos

nomina                         // estudiante asignado a un recorrido
  recorrido_id, estudiante_id, parada_id, vigente_desde, vigente_hasta

--------------------------- EJECUCION ---------------------------

viaje                          // INSTANCIA del recorrido en una fecha
  id, recorrido_id, fecha, vehiculo_id, conductor_id, auxiliar_id,
  estado (programado|en_curso|finalizado|cancelado),
  iniciado_en, finalizado_en, track GEOGRAPHY(LineString), distancia_km

viaje_estudiante               // estado por nino en ese viaje
  viaje_id, estudiante_id, parada_id,
  estado (pendiente|a_bordo|entregado|ausente|no_presentado),
  subida_en, subida_ubicacion, bajada_en, bajada_ubicacion,
  marcado_por, nota

evento_viaje                   // APPEND-ONLY, fuente de verdad
  id, viaje_id, estudiante_id?, tipo, payload jsonb, ocurrido_en,
  registrado_en, usuario_id, idempotency_key UNIQUE

posicion                       // historial submuestreado
  viaje_id, ubicacion GEOGRAPHY(Point), velocidad, rumbo, precision,
  capturado_en                 // indice BRIN por fecha; particionar por mes

incidencia
  id, viaje_id, tipo (panne|accidente|atraso|desvio|otro), severidad,
  descripcion, fotos[], reportado_por, resuelta_en

notificacion
  id, usuario_id, tipo, titulo, cuerpo, data jsonb,
  estado (encolada|enviada|fallida|leida), enviada_en

auditoria
  id, usuario_id, accion, entidad, entidad_id, antes jsonb, despues jsonb,
  ip, user_agent, creado_en
```

### 5.2 Las dos decisiones de modelado que importan

**a) `recorrido` (plantilla) ≠ `viaje` (instancia).** Es el error más común en este tipo de
sistema. Si el estado del día se guarda en la ruta, es imposible responder "¿a qué hora se
subió Pedro el martes pasado?" ni manejar un reemplazo de conductor sin corromper el
historial. Los `viaje` se generan cada mañana con un job programado, a partir de los
`recorrido` activos de ese día de la semana.

**b) Eventos append-only como fuente de verdad.** `viaje_estudiante.estado` es una
*proyección* de `evento_viaje`. Esto da gratis: historial completo, auditoría, reconstrucción
de estado, e **idempotencia** para la sincronización offline (el mismo evento reenviado tres
veces con el mismo `idempotency_key` se aplica una sola vez).

### 5.3 Máquina de estados del estudiante en el viaje

```
                 (apoderado avisa ausencia)
      pendiente --------------------------> ausente
         |
         | check-in del auxiliar/conductor
         v
      a_bordo
         |
         | check-out en destino
         v
      entregado

      pendiente --> no_presentado    (el furgon pasa la parada sin el nino;
                                      notifica al apoderado Y al chofer)
```

Las transiciones inválidas se rechazan en el backend, no solo se esconden en la UI: un
`entregado` no puede volver a `a_bordo`.

---

## 6. El flujo crítico: viaje en vivo

Este es el detalle de la Fase 3, donde se concentran el valor y el riesgo.

### 6.1 Secuencia

```
1. 06:00  Job genera los `viaje` del dia desde los `recorrido` activos.

2. 07:10  Conductor abre la app -> ve "Ida Colegio San Jose - 12 estudiantes"
          -> [INICIAR VIAJE]

3.        App pide permiso de ubicacion "siempre" (si falta) y levanta el
          servicio en primer plano (Android: notificacion persistente obligatoria).

4.        Tracking: envia posicion cada 10 s O cada 50 m, lo que ocurra primero.
          Si no hay red, acumula en SQLite local y reenvia por lote.

5.        API: valida -> Redis SET vehiculo:{id}:pos -> PUBLISH viaje:{id}
          -> WebSocket a los apoderados suscritos a ese viaje.

6.        Worker de geofence evalua cada posicion:
            - entro al radio de 300 m de la proxima parada  -> push "va llegando"
            - ETA de la parada < 5 min                      -> push "5 minutos"
            - desvio > 500 m de la ruta por > 3 min         -> push "desvio"
            - atraso > 10 min respecto de lo previsto       -> push "atraso"

7. 07:25  Auxiliar en la parada: lista con los nombres de esa parada
          -> toca [SUBIO] en Pedro
          -> POST evento (idempotency_key = uuid local, offline-first)
          -> push al apoderado: "Pedro subio al furgon - 07:25"

8.        Si el nino no esta: [NO SE PRESENTO] -> push al apoderado y el
          conductor continua sin esperar.

9. 07:55  Llegada al establecimiento -> [BAJARON TODOS] en un toque
          -> N eventos de bajada -> push a los N apoderados.

10.       [FINALIZAR VIAJE] -> worker consolida el track en PostGIS,
          calcula km y duracion, cierra el viaje, libera el room de WebSocket.
```

### 6.2 Reglas no negociables de esta fase

- **Offline-first en el cliente.** Cada acción del auxiliar se escribe primero en SQLite local con su `idempotency_key` y luego se sincroniza. La app jamás debe quedar bloqueada esperando red: un furgón pasa por zonas sin señal todos los días.
- **Servicio en primer plano en Android,** con notificación persistente visible. Sin esto, Android mata el tracking en minutos. Es también un requisito de transparencia de Google Play.
- **Permiso de ubicación en dos pasos.** Pedir primero "mientras se usa la app", explicar en una pantalla propia *por qué* se necesita "siempre", y solo después pedir el permiso de background. Pedirlo de golpe tiene una tasa de rechazo altísima.
- **Pantalla del conductor a prueba de distracciones.** Botones de 64 px mínimo, alto contraste, interacción bloqueada sobre 5 km/h, `keep-awake` activo mientras el viaje está en curso.
- **El apoderado ve solo lo que corresponde.** La posición del vehículo se entrega solo mientras su estudiante está `pendiente` o `a_bordo`, según la tabla de visibilidad de la sección 2.1. **Al marcarse la bajada, el stream se corta.** No existe un mapa "siempre encendido" del furgón, y un apoderado nunca puede seguirlo mientras lleva a los hijos de otros. Esto se aplica en el gateway de WebSocket, no en la UI.

---

## 7. Rutas y optimización

Mapeo directo de los requerimientos a implementación:

| Requerimiento | Implementación |
|---|---|
| Creación automática de rutas | Decisión 2.3: se deriva del domicilio de cada estudiante de la nómina (geocodificado una vez al darlo de alta) más su establecimiento como punto común → Routes API con `optimizeWaypointOrder: true` → orden sugerido de paradas. Las paradas no se ingresan a mano |
| Sugerencias de ruta para conductores | Polyline e instrucciones de la Routes API, con opción de abrir en Google Maps o Waze para la navegación con voz. **No reimplementar un navegador paso a paso:** son meses de trabajo para igualar algo que ya existe |
| Recálculo en tiempo real | Se dispara solo por eventos: desvío > 500 m sostenido, un `no_presentado` que permite saltarse una parada, o una incidencia. **Nunca** en un timer fijo: eso quema la cuota de API |
| Optimización según tráfico | `departureTime: now` + `trafficModel` en la Routes API |
| Reordenamiento de paradas | Drag & drop manual en el panel admin, con el orden sugerido como punto de partida. El conductor conoce su barrio mejor que el algoritmo: la sugerencia es sugerencia |
| Visualización de ruta diaria | Mapa del viaje del día con paradas numeradas y el estado de cada una |
| Registro de incidencias | Formulario rápido en la app (tipo + foto + nota); notifica a admin y a los apoderados afectados |
| Estimación de tiempo de llegada | Distance Matrix desde la posición actual a la próxima parada, recalculado cada 60 s mientras el viaje está en curso. Cachear y suavizar el valor para no mostrar un ETA que salta |

**Control del costo de la API de mapas** (esto se puede ir de las manos):

1. Geocodificar cada domicilio **una vez** y guardar las coordenadas. No geocodificar en cada viaje.
2. Cachear el resultado de la optimización por `recorrido`; recalcular solo si cambia la nómina.
3. ETA por lote: una sola llamada a Distance Matrix por vehículo, no una por apoderado conectado.
4. Evaluar **OSRM + VROOM** autohospedado para el orden base de paradas, dejando Google solo para tráfico y ETA. Puede reducir el costo en más del 80%.
5. Alertas de presupuesto desde el día 1. **Las tarifas y los tramos gratuitos de Google Maps Platform cambian: modelar el costo con la calculadora oficial antes de cerrar la decisión.**

---

## 8. Notificaciones

| Evento | Destinatario | Canal |
|---|---|---|
| Estudiante subió al vehículo | Apoderados del estudiante | Push + registro en app |
| Estudiante bajó en destino | Apoderados del estudiante | Push |
| Furgón va llegando (300 m / 5 min) | Apoderados de la próxima parada | Push |
| Estudiante no se presentó | Apoderados + admin | Push |
| Ausencia avisada por el apoderado | Conductor y auxiliar | Push |
| Atraso o desvío | Apoderados del viaje + admin | Push |
| Cambio en la ruta del día | Conductor y auxiliar | Push |
| Incidencia o emergencia | Todos los afectados + admin | Push + SMS (fallback) |
| Documento por vencer (licencia, revisión técnica) | Conductor + admin | Push + email |

**Diseño:**

- Toda notificación pasa por una cola (BullMQ) con reintentos y backoff. Nunca se envía desde el request HTTP.
- Se persiste en `notificacion` **antes** de intentar el envío: la app tiene un historial consultable aunque el push se pierda. Los push no son confiables, y acá perder un "su hijo bajó del furgón" es grave.
- **Antispam:** agrupar, aplicar cooldown por tipo y respetar preferencias por usuario. Un apoderado que recibe 12 notificaciones por viaje desinstala la app. Dejar que elija: solo subida y bajada, o todo.
- SMS (Twilio) solo para emergencias: tiene costo por mensaje.

---

## 9. Seguridad y cumplimiento

Este proyecto maneja **ubicación y datos de identidad de menores de edad**. Es la parte del
plan que no se puede tratar como un detalle de última hora.

### 9.1 Técnico

- Contraseñas con Argon2id. Nunca MD5/SHA ni cifrado reversible.
- JWT de acceso corto (15 min) + refresh rotativo con detección de reuso, almacenados en Keychain (iOS) y EncryptedSharedPreferences (Android). **Nunca** en `AsyncStorage` plano.
- TLS 1.3 obligatorio en todo el tráfico; HSTS en los dominios web.
- RBAC verificado **en el backend** en cada endpoint (Guards de Nest). Ocultar un botón en la UI no es control de acceso.
- Autorización a nivel de fila: un apoderado solo accede a datos de *sus* estudiantes; un conductor solo a los viajes que tiene asignados. Testear esto explícitamente: es la vulnerabilidad típica (IDOR) de este tipo de app.
- Cifrado en reposo de columnas sensibles (RUT, notas médicas, dirección) con `pgcrypto` o cifrado a nivel de aplicación.
- Documentos de validación en bucket privado, accesibles solo con URL prefirmada de minutos.
- Rate limiting por IP y por usuario; protección de fuerza bruta en login y en recuperación de contraseña.
- Auditoría de acciones críticas: login, cambios de permisos, aprobación de conductores, acceso a datos de estudiantes, exportaciones.
- Retención de datos: borrar o anonimizar tracks de posición después de N meses (sugerido: 6). Definir la política y automatizarla.
- Dependencias: Dependabot y `npm audit` en CI. Secretos en el gestor del proveedor, nunca en el repo.

### 9.2 Legal (Chile) — verificar con asesoría

- **Ley 21.719** de protección de datos personales (reemplaza a la Ley 19.628) introduce obligaciones considerablemente más fuertes: base de legitimidad para el tratamiento, derechos del titular, notificación de brechas, y datos de menores con tratamiento reforzado. **Confirmar la fecha de entrada en vigencia y los deberes exactos con un abogado antes de lanzar.**
- Consentimiento informado y explícito del apoderado para el tratamiento de datos del estudiante, registrado con fecha, versión del texto aceptado y evidencia. No es un checkbox suelto.
- **Normativa de transporte escolar (MTT):** los servicios de transporte escolar en Chile están sujetos a registro e inspección, y los conductores a requisitos de licencia, antecedentes y capacitación. La función "validación y aprobación de conductores" debería alinearse con esos requisitos reales — **verificar la normativa vigente con el Ministerio de Transportes**, porque define qué documentos se piden y además es un diferenciador del producto.
- Política de Privacidad y Términos de Servicio publicados en la landing: **requisito bloqueante** para publicar en App Store y Google Play.
- Minimización: no recolectar lo que no se usa. Cada campo del formulario de estudiante debe justificar su existencia.

### 9.3 Requisitos de las tiendas (planificar con anticipación)

- **Google Play:** usar `ACCESS_BACKGROUND_LOCATION` exige completar una declaración de permiso con justificación y **un video demostrando el flujo dentro de la app**. La revisión puede tardar varias semanas y puede ser rechazada. **Iniciar este trámite en la Fase 3, no al final.** Además: formulario de Data Safety y, por tratarse de público familiar, posible aplicación de las políticas de Families.
- **App Store:** justificar los modos en background en `Info.plist` con textos de uso claros. Apple es estricta con apps que manejan datos de menores (Guideline 5.1.4). El texto del permiso debe decir exactamente para qué se usa.
- Crear las cuentas de desarrollador **en la Fase 0**: Apple Developer (USD 99/año) y Google Play (USD 25, pago único) tienen trámites de verificación de identidad u organización que toman días o semanas.

---

## 10. Cómo se cumple cada requerimiento no funcional

| Requerimiento | Implementación concreta | Cómo se verifica |
|---|---|---|
| Autenticación segura | Argon2id, JWT corto + refresh rotativo, bloqueo por intentos | Pruebas de seguridad, revisión OWASP ASVS nivel 2 |
| Control de acceso por rol | Guards por endpoint + autorización por fila | Suite de tests de autorización: cada rol contra cada endpoint |
| Protección de datos de menores | Minimización, cifrado de columnas, consentimiento registrado, retención limitada, sin rastreo del menor | Revisión legal + checklist de privacidad |
| Cifrado de información sensible | TLS 1.3 en tránsito; `pgcrypto` en reposo; almacenamiento seguro del dispositivo | Revisión de esquema y de tráfico |
| Registro de accesos y acciones críticas | Tabla `auditoria` + logs estructurados retenidos | Revisión manual de la bitácora |
| Ubicación en tiempo real con baja latencia | Redis + WebSocket, sin tocar Postgres en el camino caliente | **Objetivo: p95 < 2 s** entre el ping del dispositivo y el render en el apoderado, medido con instrumentación |
| Respuesta rápida de la app | **p95 de la API < 300 ms**; TTI móvil < 2 s; listas virtualizadas; caché con TanStack Query | k6/Artillery en CI; Sentry Performance |
| Disponibilidad en horarios operativos | Las ventanas críticas son 06:30–09:00 y 12:00–19:00. **Prohibido desplegar en esas franjas.** Health checks, auto-restart, réplica de DB | Uptime externo; objetivo 99,9% en ventana operativa |
| Interfaz simple para conductor y auxiliar | Un botón primario por pantalla, targets ≥ 64 px, alto contraste, sin menús anidados, cero texto innecesario | **Pruebas con 3 conductores reales antes de cerrar la Fase 3.** No negociable |
| Interfaz intuitiva para apoderados | Una pantalla: mapa + estado del hijo + ETA. Todo lo demás es secundario | Pruebas de usabilidad con 5 apoderados |
| Compatibilidad Android e iOS | React Native; **matriz de prueba con Android de gama baja real** (los conductores no usan celulares caros) | Dispositivos físicos + Firebase Test Lab |
| Escalabilidad | API stateless (escala horizontal), Redis para estado efímero, pool de conexiones, tabla `posicion` particionada, índices GiST en columnas geográficas | Prueba de carga con 500 vehículos simultáneos emitiendo posición |
| Agregar recorridos y vehículos sin rediseñar | Todo es dato, nada hardcodeado: recorridos, paradas, horarios y reglas de notificación son configurables desde el admin | Alta de un recorrido nuevo sin necesidad de deploy |
| Respaldo de datos | Backup automático diario con PITR (point-in-time recovery), retención 30 días, **restauración probada trimestralmente** | Simulacro de restauración documentado |
| Tolerancia a fallos de conexión | Cola offline en SQLite con eventos idempotentes, reintentos con backoff, indicador visible de estado de sincronización | Prueba en modo avión durante un viaje completo |
| Recuperación de sesión y continuidad | Refresh token persistente, rehidratación del viaje en curso al reabrir la app, reconexión automática de WebSocket | Prueba de cierre forzado de la app en medio de un viaje |

---

## 11. Estructura del repositorio

```
AppFurgones/
├── apps/
│   ├── mobile/              # React Native + Expo (3 roles en una sola app)
│   │   ├── src/features/    # auth, viaje-activo, asistencia, mapa, perfil
│   │   ├── src/roles/       # apoderado/ conductor/ auxiliar/ (navegacion por rol)
│   │   └── src/offline/     # SQLite, cola de eventos, sincronizacion
│   ├── admin/               # React + Vite (panel administrativo)
│   ├── landing/             # Next.js SSG (publico, SEO, legales)
│   └── api/                 # NestJS
│       └── src/modules/     # auth, usuarios, estudiantes, vehiculos, recorridos,
│                            # viajes, tracking, rutas, notificaciones, reportes,
│                            # auditoria
├── packages/
│   ├── shared/              # tipos, esquemas Zod, constantes, maquinas de estado
│   ├── api-client/          # cliente tipado, usado por mobile y admin
│   └── ui/                  # tokens de diseno compartidos
├── infra/
│   ├── docker-compose.yml   # postgres+postgis, redis, api (desarrollo local)
│   └── migrations/
├── docs/
│   ├── requerimientos.md    # transcripcion del .docx original
│   ├── arquitectura.md
│   ├── modelo-datos.md
│   └── adr/                 # una decision de arquitectura por archivo
└── PLAN.md                  # este documento
```

Lo valioso de `packages/shared`: el esquema Zod que valida el formulario de estudiante en el
admin es **el mismo** que valida el request en la API y el mismo que tipa la pantalla móvil.
Un cambio en el modelo rompe la compilación en los tres lados, en lugar de fallar en
producción.

---

## 12. Plan de ejecución por fases

Sprints de 2 semanas. Supone un equipo de 3–4 personas (ver sección 16).

> **Ajuste al orden original (12 de octubre de 2026):** el sitio web público se adelanta y es
> el frente en curso, antes de la Fase 0. Es trabajo aislado — no depende del backend, del
> modelo de datos ni de ninguna de las decisiones en estudio — así que sirve para tener algo
> presentable y las páginas legales listas mientras se cierran 2.5, 2.7 y 2.8. La Fase 7
> queda sin la parte de landing, solo con su revisión final.

### Fase W — Sitio web público · 1–2 semanas · **EN CURSO**

- Proyecto `apps/landing` en Next.js con SSG y TypeScript
- Landing de una página: propuesta de valor, cómo funciona, características por rol (apoderado / conductor / administrador), seguridad y privacidad, preguntas frecuentes, formulario de contacto
- **Páginas legales:** Política de Privacidad y Términos de Servicio. Son requisito bloqueante para publicar en App Store y Google Play, y conviene tenerlas redactadas y revisadas desde temprano, no la semana del envío
- Responsive y accesible; metadatos para SEO y para compartir en redes
- Deploy en Vercel con dominio propio

**Criterio de salida:** el sitio está publicado, se ve bien en celular, y las URLs de
privacidad y términos ya existen para usarlas en las fichas de las tiendas.

**Nota:** el discurso de la landing depende de la decisión 2.5 (¿se le vende al conductor
dueño de su furgón o al colegio?). Mientras esté en estudio, el texto se escribe para hablar
a ambos, con los bloques separados para poder afinarlos después sin rehacer el sitio.

### Fase 0 — Descubrimiento y cimientos · 2 semanas

| Entregable | Detalle |
|---|---|
| Decisiones de producto cerradas | Las 5 de la sección 2, por escrito |
| Alcance MVP congelado | Lista explícita de qué entra y qué no (sección 13) |
| Modelo de datos v1 | Diagrama ER + migración inicial corriendo |
| Monorepo operativo | pnpm + Turborepo, las 4 apps arrancando en vacío, docker-compose local |
| CI verde | Lint + typecheck + test en cada PR |
| Entornos | `dev`, `staging`, `prod` con secretos separados |
| Diseño UX | Wireframes de los 12 flujos críticos; sistema de diseño base |
| Cuentas y trámites | Apple Developer, Google Play, Google Cloud con facturación, Firebase, Sentry |
| Legal iniciado | Borrador de Política de Privacidad y de consentimiento; consulta legal agendada |
| **Spike de tracking** | Ver sección 17, punto 2. Valida o descarta el stack móvil |

**Criterio de salida:** cualquier integrante clona el repo y tiene el stack completo
corriendo en menos de 15 minutos.

### Fase 1 — Identidad y datos maestros · 3 semanas

- Registro, login, recuperación de contraseña, verificación de email
- RBAC completo (apoderado, conductor, auxiliar, admin_org, super_admin) con guards y tests de autorización
- CRUD de usuarios, estudiantes, establecimientos y vehículos
- Asociaciones: apoderado↔estudiante (N:N), conductor/auxiliar↔vehículo
- Carga de documentos y flujo de **validación y aprobación** de conductores y auxiliares, con bandeja de revisión en el admin
- Activación y desactivación de cuentas; edición de perfil
- Panel admin con layout, navegación por rol, tablas y formularios
- App móvil: login, navegación por rol, perfil

**Criterio de salida:** un super_admin aprueba un conductor; ese conductor entra a la app y
ve su perfil; un apoderado entra y ve a su estudiante.

### Fase 2 — Recorridos, paradas y nóminas · 2 semanas

- CRUD de recorridos (con `sentido`, días de la semana, vehículo, establecimiento)
- Geocodificación de domicilios **con corrección manual del pin en el mapa**: la geocodificación en Chile falla seguido, siempre hay que poder ajustar a mano
- Gestión de paradas con orden y drag & drop sobre el mapa del admin
- Asignación de estudiantes a recorrido y parada, con validación contra `capacidad_maxima`
- Generación automática del orden sugerido de paradas (Routes API)
- Vista de la ruta diaria asignada en la app del conductor
- Job de generación nocturna de los `viaje` del día

**Criterio de salida:** un recorrido completo con 10 estudiantes queda configurado y el
conductor lo ve en su app a la mañana siguiente.

### Fase 3 — Viaje en vivo · 4 semanas · **FASE CRÍTICA**

- Tracking en background en Android e iOS: permisos en dos pasos, foreground service, batching, cola offline
- Ingestión de posiciones: API → Redis → WebSocket, con el camino frío a PostGIS
- Iniciar y finalizar viaje
- UI de asistencia del auxiliar: check-in, check-out, "no se presentó", "bajaron todos"
- UI del conductor: próxima parada, navegación delegada a Google Maps/Waze, bloqueo por velocidad
- Mapa en vivo del apoderado: posición del furgón, estado del hijo, ETA
- Cálculo y suavizado del ETA
- Historial de viajes del estudiante y del vehículo; replay del track
- Sincronización offline completa con eventos idempotentes

**Criterio de salida — se prueba en la calle, no en el escritorio:** un viaje real de 45
minutos en un furgón, con el celular en el bolsillo, pantalla apagada, pasando por zonas sin
cobertura. Cero pérdida de eventos de asistencia, menos de 5% de pérdida de puntos GPS, y la
batería no baja más de 15% en el trayecto.

> Si en esta fase `expo-location` pierde datos en Android de gama baja, comprar la licencia de
> `react-native-background-geolocation`. Dejarlo presupuestado desde ya.
>
> En paralelo: **iniciar la declaración de permiso de background location en Google Play.**

### Fase 4 — Notificaciones e incidencias · 2 semanas

- Integración con FCM; registro y rotación de device tokens
- Cola de notificaciones con reintentos; persistencia previa al envío
- Las 9 reglas de la sección 8, configurables
- Workers de geofence: va llegando, atraso, desvío
- Centro de notificaciones y preferencias por usuario en la app
- Reporte de incidencias con fotos; alerta a admin y a los apoderados afectados
- Aviso de ausencia por el apoderado, que notifica al conductor

**Criterio de salida:** en un viaje real, cada apoderado recibe exactamente las
notificaciones correctas, en el momento correcto, y ninguna de más.

### Fase 5 — Rutas inteligentes · 2 semanas

- Recálculo de ruta por desvío, ausencia o incidencia
- Optimización con tráfico en vivo
- Reordenamiento manual con sugerencia algorítmica
- Caché y control de cuota de la API de mapas, con alertas de presupuesto
- Evaluación de OSRM/VROOM si el costo lo amerita

**Criterio de salida:** una ausencia avisada a las 07:00 reordena la ruta del día y el
conductor ve el cambio antes de salir.

### Fase 6 — Panel administrativo completo y reportes · 2 semanas

- Dashboard de estado de rutas activas: todos los furgones en un mapa, en vivo
- Reportes de viajes realizados, asistencia por estudiante y por recorrido, incidencias y puntualidad
- Exportación a Excel y PDF
- Bitácora de auditoría consultable
- Alertas de documentos por vencer: licencias, revisión técnica, seguros

**Criterio de salida:** un administrador responde "¿cuántas veces faltó Pedro este mes y a
qué hora llegó el furgón cada día?" en menos de 30 segundos.

### Fase 7 — Endurecimiento y publicación · 3 semanas

- Revisión final del sitio web ya construido en la Fase W: actualizar capturas reales de la app, afinar el discurso según la decisión 2.5, y validar que los textos legales reflejen lo que el sistema efectivamente hace
- Pruebas de carga (500 vehículos concurrentes) y optimización de los cuellos detectados
- Revisión de seguridad: OWASP Top 10, OWASP Mobile Top 10, tests de autorización por fila
- Accesibilidad básica y soporte de texto grande: hay apoderados y conductores mayores
- Builds de producción, store listings, capturas, declaraciones de privacidad
- Envío a App Store y Google Play
- Simulacro de restauración de backup
- Runbook de operación y documentación de soporte

**Criterio de salida:** ambas apps aprobadas y publicadas; informes de carga y de seguridad
cerrados.

### Fase 8 — Piloto en producción · 4 semanas

- Piloto con 2–3 furgones reales, ~30 estudiantes y sus apoderados
- Soporte en terreno y canal directo de feedback
- Métricas: tasa de entrega de notificaciones, uptime en ventana operativa, puntos GPS perdidos, crash-free sessions, uso diario del auxiliar
- Correcciones iterativas, usando OTA para lo que no requiera revisión de tienda
- Decisión go/no-go para apertura comercial

**Criterio de salida:** 4 semanas consecutivas sin incidentes graves, y apoderados que
declaran que usarían la app a diario.

### Resumen de cronograma

```
Sem:  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24
FW   [====]                                       <- en curso: sitio web
F0   [====]
F1         [=========]
F2                    [=====]
F3                          [============]        <- fase critica
F4                                       [=====]
F5                                             [=====]
F6                                                   [=====]
F7                                                         [========]
F8                                                                  [==========]
                                       ^                       ^         ^
                                 MVP demo (s12)        Apps enviadas  Piloto cerrado
```

Rango realista: **20 semanas en el escenario optimista, 24–28 con los imprevistos
habituales.** Lo que más se dilata es la revisión de las tiendas y las pruebas en terreno.

---

## 13. MVP mínimo vs. alcance completo

Si hay que mostrar algo funcionando pronto (demo, defensa de proyecto, primer cliente), este
es el corte. **Entra** lo que hace que el producto tenga sentido; **no entra** lo que se puede
agregar después sin rediseñar.

| | MVP (fases 0–4, ~semana 14) | Después |
|---|---|---|
| Roles | apoderado, conductor, admin | auxiliar como rol separado, super_admin |
| Auth | email + contraseña, recuperación | OTP por SMS, 2FA, login social |
| Estudiantes | CRUD, 1 apoderado, domicilio | múltiples apoderados, notas médicas, foto |
| Recorridos | manuales, un sentido por recorrido | plantillas, recorridos compartidos, suplencias |
| Tracking | posición en vivo + track del viaje | replay avanzado, heatmaps |
| Asistencia | subida, bajada, no presentado | firma del apoderado, QR por estudiante, foto de entrega |
| Rutas | orden sugerido + navegación delegada | recálculo con tráfico, optimización multivehículo |
| Notificaciones | subida, bajada, va llegando, atraso | preferencias finas, SMS, email, resumen diario |
| Admin | CRUD + mapa en vivo | reportes avanzados, exportaciones, auditoría completa |
| Landing | 1 página + legales | blog, SEO local, onboarding self-service, pagos |

Lo que **no** se puede dejar para después sin pagar un rediseño: `organizacion_id` en el
esquema, los eventos append-only con idempotencia, la separación `recorrido`/`viaje`, y el
RBAC con autorización por fila.

---

## 14. Riesgos y mitigaciones

| # | Riesgo | Prob. | Impacto | Mitigación |
|---|---|---|---|---|
| 1 | **El tracking en background se corta** en Android por optimización de batería (Xiaomi, Huawei y Samsung son agresivos) | Alta | Crítico | Foreground service con notificación persistente; pedir exención de optimización de batería con pantalla explicativa; probar en gama baja real desde la Fase 3; presupuestar la librería paga; buffer local para que no se pierdan eventos aunque se pierdan puntos |
| 2 | **Google Play rechaza o demora** el permiso de background location | Media | Alto | Iniciar el trámite en la Fase 3; video de demostración prolijo; justificación explícita de por qué el servicio no funciona sin background; plan B: distribución interna o empresarial para el piloto |
| 3 | **El costo de la API de mapas** se descontrola | Media | Medio | Caché agresivo, recálculo por evento y no por timer, alertas de presupuesto, OSRM/VROOM como plan B, modelar el costo en Fase 0 |
| 4 | **Incumplimiento legal** en datos de menores | Media | Crítico | Asesoría legal en Fase 0, no en Fase 7; no rastrear al menor, solo al vehículo; minimización; consentimiento versionado y registrado |
| 5 | **Los conductores no adoptan la app** | Media | Crítico | Co-diseño con 3 conductores reales desde la Fase 0; un botón por pantalla; capacitación presencial en el piloto. Si al conductor le cuesta usarla, el producto no existe |
| 6 | **Apple rechaza** por manejo de datos de menores o por el uso de background | Media | Alto | Textos de permiso explícitos, política de privacidad clara, video de revisión, respuesta rápida; presupuestar 2–3 iteraciones de revisión |
| 7 | Notificaciones que no llegan o llegan tarde | Media | Alto | Persistir antes de enviar, cola con reintentos, historial en la app, y usar la tasa de entrega como métrica de producto |
| 8 | Geocodificación incorrecta de domicilios chilenos | Alta | Bajo | Ajuste manual del pin obligatorio en el alta; validar con el apoderado en el onboarding |
| 9 | Alcance creciente: el documento tiene ~70 requerimientos | Alta | Alto | MVP congelado por escrito en Fase 0; todo lo nuevo entra al backlog, no al sprint |
| 10 | La batería del conductor se agota en el trayecto | Media | Medio | Posición por distancia y no solo por tiempo, batching de envíos, sin wake locks innecesarios; recomendar cargador en el vehículo, que ya es práctica común |
| 11 | Equipo sin experiencia previa en React Native o en datos geoespaciales | Media | Medio | Spike técnico de tracking en background en la Fase 0 (3 días, antes de comprometer el stack). Es el punto donde conviene equivocarse temprano |

---

## 15. Costos estimados

Órdenes de magnitud mensuales para un piloto de ~20 furgones. **Todos los precios deben
verificarse: cambian seguido.**

| Ítem | MVP / piloto | Producción (100 furgones) |
|---|---|---|
| Hosting API + workers | USD 20–50 (Railway/Render) | USD 150–400 |
| PostgreSQL administrado | USD 15–30 | USD 100–300 |
| Redis | USD 10–20 | USD 50–100 |
| Google Maps Platform | USD 0–100 (con caché agresivo) | USD 300–1.500 (depende de los recálculos) |
| FCM | gratis | gratis |
| Almacenamiento de documentos | < USD 5 | USD 10–30 |
| Sentry | gratis (tier dev) | USD 26+ |
| Expo EAS | gratis o USD 19 | USD 99 |
| SMS (solo emergencias) | USD 0–20 | USD 50–200 |
| Dominio | USD 1–3 | igual |
| **Subtotal mensual** | **≈ USD 70–250** | **≈ USD 800–2.600** |

Costos únicos: Apple Developer USD 99/año, Google Play USD 25, licencia de
`react-native-background-geolocation` del orden de USD 300–400 (verificar: puede ser por
plataforma o por bundle), y la asesoría legal para privacidad y términos.

---

## 16. Equipo y estrategia de pruebas

### Equipo sugerido (3–4 personas)

| Rol | Dedicación | Responsabilidad |
|---|---|---|
| Full-stack / tech lead | 100% | Backend, modelo de datos, arquitectura, realtime |
| Mobile developer | 100% | App móvil, tracking en background, offline |
| Frontend | 50–100% | Panel admin y landing |
| UX / QA | 50% | Wireframes, pruebas con usuarios reales, QA en dispositivos |

Con 2 personas el cronograma se estira a unos 9–10 meses. Con 1 persona, recortar al MVP de
la sección 13 y evaluar seriamente Supabase para eliminar trabajo de backend.

### Pruebas

| Nivel | Qué se prueba | Herramientas |
|---|---|---|
| Unitarias | Máquinas de estado, cálculo de ETA, reglas de notificación, geofences | Jest / Vitest |
| Integración | Endpoints con base real; autorización por rol y por fila | Jest + Testcontainers |
| E2E web | Alta de recorrido, aprobación de conductor | Playwright |
| E2E móvil | Login, iniciar viaje, check-in, finalizar | Maestro o Detox |
| Carga | 500 vehículos emitiendo posición, 2.000 apoderados conectados | k6 / Artillery |
| Offline | Viaje completo en modo avión, cierre forzado de la app, reconexión | Manual, con checklist |
| Campo | Viaje real con conductor real, celular en el bolsillo | **No reemplazable por nada** |
| Usabilidad | 3 conductores y 5 apoderados, sin ayuda | Observación directa |
| Seguridad | OWASP Top 10 y Mobile Top 10; IDOR entre cuentas | Manual + ZAP |

La prueba que define el éxito del proyecto es la de campo. Todo lo demás es necesario, pero
no suficiente.

---

## 17. Próximos pasos inmediatos

1. **Responder las 5 decisiones de producto** de la sección 2, sobre todo 2.1 y 2.4: cambian el esquema de datos.
2. **Spike técnico de 3 días:** una app mínima en Expo que trackee en background en un Android de gama baja durante 45 minutos con la pantalla apagada. Valida o descarta el stack móvil antes de construir sobre él. Es el mejor uso posible de los primeros días del proyecto.
3. **Crear las cuentas de desarrollador** de Apple y Google hoy: los trámites de verificación tardan.
4. **Agendar la asesoría legal** sobre datos de menores.
5. **Conseguir un furgón aliado** para el piloto: un conductor dispuesto a probar desde la Fase 3. Sin un usuario real temprano, se construye a ciegas.
6. Inicializar el monorepo, el `docker-compose` local y el CI.

---

### Apéndice — Trazabilidad de requerimientos

Todos los requerimientos del documento original quedan cubiertos. Mapeo rápido:

| Bloque del documento | Fase |
|---|---|
| Gestión de usuarios y acceso (11 ítems) | F1 |
| Gestión de estudiantes (7 ítems) | F1 (datos) + F3 (estado y historial) |
| Gestión de transporte (8 ítems) | F1 (vehículos) + F2 (recorridos y paradas) |
| Seguimiento y monitoreo (8 ítems) | F3 |
| Rutas (7 ítems) | F2 (creación) + F5 (optimización y recálculo) |
| Notificaciones (6 ítems) | F4 |
| Panel administrativo (11 ítems) | F1 (gestión) + F6 (reportes y auditoría) |
| No funcionales (todos) | Transversal, verificado en F7 — ver sección 10 |
