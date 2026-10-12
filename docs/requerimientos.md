# Requerimientos (transcripción del documento original)

> Transcripción literal de `App furgones doc.docx`. No editar este archivo para cambiar el
> alcance: las decisiones y el alcance acordado viven en [`PLAN.md`](../PLAN.md).

## Plataforma web

- Login
- Administración de cuentas de usuario
- Vista por roles
- Definición de roles (Usuario conductores, Usuario apoderados)
- Validación de choferes
- Gestión de datos de los apoderados, estudiantes y conductores
- Seguimiento en tiempo real de ubicación del estudiante
- Creación y sugerencias de ruta en tiempo real para conductores

## Plataforma móvil

- Login
- Administración de cuentas de usuario
- Vista por roles

---

## Requerimientos funcionales

### Gestión de usuarios y acceso

- Registro e inicio de sesión
- Recuperación de contraseña
- Administración de cuentas de usuario
- Vista y permisos por roles
- Definición de roles: apoderado, conductor, auxiliar, administrador
- Validación y aprobación de conductores
- Validación y aprobación de auxiliares
- Asociación entre apoderado y estudiante
- Asociación entre conductor, auxiliar y vehículo
- Edición de perfil de usuario
- Activación y desactivación de cuentas

### Gestión de estudiantes

- Registro de estudiantes
- Edición de datos del estudiante
- Asignación de estudiante a apoderado
- Asignación de estudiante a recorrido
- Registro de domicilio y establecimiento educacional
- Estado del estudiante durante el trayecto
- Historial de viajes del estudiante

### Gestión de transporte

- Registro de vehículos
- Asignación de conductor a vehículo
- Asignación de auxiliar a vehículo
- Capacidad máxima del vehículo
- Gestión de recorridos
- Gestión de paradas
- Asignación de estudiantes a cada recorrido
- Control de asistencia al trayecto (seguimiento y monitoreo)

### Seguimiento y monitoreo

- Seguimiento en tiempo real de la ubicación del vehículo
- Visualización del trayecto en mapa
- Visualización del estado del estudiante
- Confirmación de subida del estudiante al vehículo
- Confirmación de bajada del estudiante en destino
- Registro de hora de subida y bajada
- Historial de ubicación del trayecto
- Estimación de tiempo de llegada

### Rutas

- Creación automática de rutas
- Sugerencias de ruta para conductores
- Recálculo de ruta en tiempo real
- Optimización de ruta según tráfico
- Reordenamiento de paradas
- Visualización de ruta diaria asignada
- Registro de incidencias en ruta

### Notificaciones

- Notificación al apoderado cuando el estudiante sube al vehículo
- Notificación al apoderado cuando el estudiante baja del vehículo
- Notificación de atraso o desvío
- Notificación al chofer por ausencia del estudiante
- Notificaciones al conductor y auxiliar sobre cambios en la ruta
- Alertas por incidentes del trayecto

### Panel administrativo

- Gestión de usuarios
- Gestión de estudiantes
- Gestión de conductores y auxiliares
- Gestión de vehículos
- Gestión de recorridos
- Gestión de validaciones
- Visualización de estado de rutas activas
- Reportes de viajes realizados
- Reportes de asistencia
- Reportes de incidencias
- Auditoría básica de acciones relevantes

---

## Requerimientos no funcionales

### Seguridad

- Autenticación segura
- Control de acceso por rol
- Protección de datos personales de menores
- Cifrado de información sensible
- Registro de accesos y acciones críticas

### Rendimiento

- Actualización de ubicación en tiempo real con baja latencia
- Respuesta rápida de la app
- Disponibilidad del sistema en horarios operativos

### Usabilidad

- Interfaz simple para conductores y auxiliares
- Interfaz intuitiva para apoderados
- Compatibilidad con Android e iOS

### Escalabilidad

- Soporte para aumento de usuarios, estudiantes y rutas
- Capacidad de agregar nuevos recorridos y vehículos sin rediseñar el sistema

### Confiabilidad

- Respaldo de datos
- Tolerancia a fallos de conexión
- Recuperación de sesión y continuidad del servicio
