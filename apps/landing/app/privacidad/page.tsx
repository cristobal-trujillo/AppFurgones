import type { Metadata } from "next";
import { LegalLayout } from "@/components/legal-layout";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description:
    "Cómo tratamos los datos personales de apoderados, estudiantes, conductores y auxiliares en AppFurgones.",
  robots: { index: true, follow: true },
};

export default function PrivacidadPage() {
  return (
    <LegalLayout
      titulo="Política de privacidad"
      bajada="Qué datos tratamos, para qué los usamos y qué derechos tienes sobre ellos. Nos importa especialmente la información de los estudiantes, porque son menores de edad."
    >
      <h2>1. Quiénes somos</h2>
      <p>
        {site.name} es una plataforma de gestión y seguimiento de transporte
        escolar operada por {site.razonSocial}, RUT {site.rut}, con domicilio en{" "}
        {site.ciudad}. Para cualquier consulta sobre esta política puedes
        escribir a <a href={`mailto:${site.email}`}>{site.email}</a>.
      </p>

      <h2>2. Qué datos tratamos</h2>

      <h3>Del apoderado</h3>
      <ul>
        <li>Nombre, RUT, correo electrónico y teléfono.</li>
        <li>Dirección asociada al retiro del estudiante.</li>
        <li>Preferencias de notificación.</li>
      </ul>

      <h3>Del estudiante</h3>
      <ul>
        <li>Nombre, RUT, fecha de nacimiento y curso.</li>
        <li>Dirección de retiro y establecimiento educacional.</li>
        <li>
          Estado durante el trayecto (pendiente, a bordo, entregado, ausente) y
          la hora de subida y de bajada.
        </li>
        <li>
          Información médica relevante para el viaje, solo si el apoderado decide
          informarla.
        </li>
      </ul>

      <h3>Del conductor y del auxiliar</h3>
      <ul>
        <li>Nombre, RUT, correo electrónico y teléfono.</li>
        <li>
          Documentos habilitantes: licencia de conducir, certificado de
          antecedentes y los demás que exija la normativa aplicable.
        </li>
        <li>Vehículo asignado y recorridos a su cargo.</li>
      </ul>

      <h3>Del vehículo</h3>
      <ul>
        <li>Patente, características y documentación (revisión técnica, seguro).</li>
        <li>
          Ubicación geográfica <strong>únicamente mientras un viaje está en
          curso</strong>, obtenida del teléfono del conductor o del auxiliar.
        </li>
      </ul>

      <h3>Datos técnicos</h3>
      <ul>
        <li>
          Identificador del dispositivo para enviar notificaciones push, versión
          de la aplicación y sistema operativo.
        </li>
        <li>
          Registros de acceso y de acciones relevantes dentro del sistema, con
          fecha y hora.
        </li>
      </ul>

      <h2>3. Qué no hacemos</h2>
      <ul>
        <li>
          <strong>No rastreamos el dispositivo de ningún menor de edad.</strong> El
          GPS está en el teléfono del conductor o del auxiliar: seguimos al
          vehículo, no al estudiante.
        </li>
        <li>
          <strong>No compartimos la ubicación fuera del viaje.</strong> Cuando se
          confirma la bajada del estudiante, el apoderado deja de recibir la
          posición del vehículo.
        </li>
        <li>No vendemos ni arrendamos datos personales a terceros.</li>
        <li>No usamos los datos de estudiantes para publicidad ni para perfilamiento comercial.</li>
      </ul>

      <h2>4. Para qué usamos los datos</h2>
      <ul>
        <li>Prestar el servicio: armar recorridos, registrar asistencia y mostrar el viaje en curso.</li>
        <li>Notificar al apoderado la subida, la bajada, atrasos, desvíos e incidencias.</li>
        <li>Generar el historial de viajes y los reportes de asistencia e incidencias.</li>
        <li>Validar que los conductores y auxiliares cumplen los requisitos para operar.</li>
        <li>Mantener la seguridad del sistema y auditar accesos.</li>
        <li>Responder consultas y solicitudes de soporte.</li>
      </ul>

      <h2>5. Consentimiento y datos de menores</h2>
      <p>
        El tratamiento de los datos de un estudiante requiere la{" "}
        <strong>autorización expresa de su apoderado o representante legal</strong>,
        que se solicita al momento de registrarlo y queda guardada con la fecha y
        la versión del texto aceptado. El apoderado puede revocar esa
        autorización en cualquier momento, con el efecto de que el estudiante
        deja de poder usar el servicio.
      </p>
      <p>
        Aplicamos el principio de minimización: pedimos solo los datos necesarios
        para que el viaje funcione y para cumplir obligaciones legales.
      </p>

      <h2>6. Con quién compartimos información</h2>
      <p>
        Trabajamos con proveedores de servicios que tratan datos por nuestra
        cuenta y bajo nuestras instrucciones, en las siguientes categorías:
      </p>
      <ul>
        <li>Infraestructura y alojamiento de la base de datos y de la aplicación.</li>
        <li>Servicios de mapas, geocodificación y cálculo de rutas.</li>
        <li>Envío de notificaciones push, correos electrónicos y mensajes de texto.</li>
        <li>Monitoreo de errores y de rendimiento de la aplicación.</li>
      </ul>
      <p>
        Además, compartimos información con el colegio o la empresa de transporte
        a la que pertenece el recorrido, cuando corresponde a su propia
        operación, y con autoridades cuando exista una obligación legal de
        hacerlo.
      </p>
      <p>
        {/* TODO: listar aquí los proveedores concretos una vez cerrada la arquitectura. */}
        El listado específico de proveedores se publicará en esta misma página.
      </p>

      <h2>7. Cuánto tiempo conservamos los datos</h2>
      <ul>
        <li>
          <strong>Recorrido GPS de los viajes:</strong> se conserva por un período
          acotado y luego se elimina o se anonimiza. Sirve para responder
          reclamos y revisar incidentes, no para construir un historial
          permanente de desplazamientos.
        </li>
        <li>
          <strong>Registros de asistencia:</strong> se conservan mientras el
          estudiante use el servicio y por el plazo necesario para cumplir
          obligaciones legales y contractuales.
        </li>
        <li>
          <strong>Datos de cuenta:</strong> se conservan mientras la cuenta esté
          activa. Al cerrarse, se eliminan o se anonimizan, salvo lo que debamos
          conservar por ley.
        </li>
      </ul>

      <h2>8. Seguridad</h2>
      <p>
        Aplicamos medidas técnicas y organizativas para proteger la información:
        cifrado del tráfico, cifrado de los datos sensibles almacenados, control
        de acceso según el rol de cada usuario, validación de permisos en el
        servidor, registro de accesos y respaldos periódicos. Los documentos de
        los conductores se guardan en almacenamiento privado, accesible solo con
        enlaces temporales.
      </p>
      <p>
        Ningún sistema es infalible. Si ocurre un incidente que afecte datos
        personales, lo informaremos a los titulares y a la autoridad competente
        según lo que exija la normativa aplicable.
      </p>

      <h2>9. Tus derechos</h2>
      <p>
        Puedes solicitar en cualquier momento acceder a tus datos, rectificarlos
        si están incorrectos, pedir su eliminación, oponerte a determinados
        tratamientos y solicitar una copia de la información que tenemos sobre ti
        o sobre el estudiante que representas.
      </p>
      <p>
        Para ejercer estos derechos escribe a{" "}
        <a href={`mailto:${site.email}`}>{site.email}</a> indicando tu nombre y
        el derecho que quieres ejercer. Responderemos dentro de los plazos
        legales.
      </p>

      <h2>10. Cookies en este sitio</h2>
      <p>
        Este sitio funciona sin cookies de seguimiento publicitario. Si en el
        futuro incorporamos herramientas de medición, lo informaremos aquí y
        pediremos tu consentimiento cuando corresponda.
      </p>

      <h2>11. Cambios a esta política</h2>
      <p>
        Si modificamos esta política, actualizaremos la fecha del encabezado y, si
        el cambio es relevante, avisaremos por la aplicación o por correo.
      </p>

      <h2>12. Contacto</h2>
      <p>
        Dudas, solicitudes o reclamos sobre el tratamiento de datos personales:{" "}
        <a href={`mailto:${site.email}`}>{site.email}</a>.
      </p>
    </LegalLayout>
  );
}
