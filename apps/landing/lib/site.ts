/**
 * Configuración central del sitio.
 *
 * TODO: reemplazar los valores marcados como PLACEHOLDER por los datos reales
 * antes de publicar (dominio, correo, razón social, RUT).
 */
export const site = {
  name: "AppFurgones",
  tagline: "Seguimiento en tiempo real del transporte escolar",
  description:
    "Los apoderados ven dónde viene el furgón y reciben una notificación cuando su hijo sube y cuando llega. El conductor recibe la ruta del día optimizada. Todo en una sola app.",
  url: "https://appfurgones.cl", // PLACEHOLDER
  email: "contacto@appfurgones.cl", // PLACEHOLDER
  razonSocial: "[Razón social por definir]", // PLACEHOLDER
  rut: "[RUT por definir]", // PLACEHOLDER
  ciudad: "Santiago, Chile",
  /** Etapa actual del producto. Quitar la insignia del hero al lanzar. */
  enDesarrollo: true,
  legalUpdated: "12 de octubre de 2026",
} as const;

export const nav = [
  { href: "#como-funciona", label: "Cómo funciona" },
  { href: "#caracteristicas", label: "Características" },
  { href: "#seguridad", label: "Seguridad" },
  { href: "#preguntas", label: "Preguntas" },
] as const;
