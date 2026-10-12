import type { Metadata } from "next";
import { LegalLayout } from "@/components/legal-layout";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Términos de servicio",
  description:
    "Condiciones de uso de la plataforma AppFurgones para apoderados, conductores, auxiliares y administradores.",
  robots: { index: true, follow: true },
};

export default function TerminosPage() {
  return (
    <LegalLayout
      titulo="Términos de servicio"
      bajada="Las condiciones bajo las que se usa la plataforma. Lo más importante: AppFurgones es una herramienta de información y gestión, no un servicio de transporte."
    >
      <h2>1. Aceptación</h2>
      <p>
        Al crear una cuenta o usar {site.name} aceptas estos términos. Si no
        estás de acuerdo con ellos, no uses la plataforma. El servicio es
        operado por {site.razonSocial}, RUT {site.rut}.
      </p>

      <h2>2. Qué es y qué no es este servicio</h2>
      <p>
        {site.name} es una plataforma de software que permite gestionar
        recorridos de transporte escolar, registrar la subida y bajada de
        estudiantes, mostrar la ubicación del vehículo durante el viaje y enviar
        notificaciones a los apoderados.
      </p>
      <p>
        <strong>No prestamos el servicio de transporte escolar.</strong> El
        traslado de los estudiantes es responsabilidad exclusiva del conductor,
        del dueño del vehículo o de la empresa de transporte, quienes deben
        cumplir toda la normativa aplicable. {site.name} no selecciona, no
        certifica ni supervisa a los transportistas: solo provee las herramientas
        para que registren y comuniquen su operación.
      </p>

      <h2>3. Cuentas y roles</h2>
      <ul>
        <li>
          Cada usuario es responsable de la veracidad de los datos que ingresa y
          de mantener la confidencialidad de su contraseña.
        </li>
        <li>
          Los roles de conductor y auxiliar requieren aprobación previa, con la
          documentación que se solicite en la plataforma.
        </li>
        <li>
          Un apoderado solo puede registrar estudiantes respecto de los cuales
          tenga la calidad de apoderado o representante legal.
        </li>
        <li>
          Podemos suspender una cuenta que entregue información falsa, que use el
          servicio de forma indebida o cuyos documentos habilitantes estén
          vencidos.
        </li>
      </ul>

      <h2>4. Obligaciones del conductor y del auxiliar</h2>
      <ul>
        <li>
          Cumplir la normativa chilena de transporte escolar y de tránsito, y
          mantener vigentes licencia, documentación del vehículo y los
          certificados exigidos.
        </li>
        <li>
          <strong>No manipular el teléfono mientras conduce.</strong> El registro de
          asistencia debe hacerse con el vehículo detenido, o bien por el
          auxiliar.
        </li>
        <li>
          Registrar de forma fiel y oportuna la subida y la bajada de cada
          estudiante, así como las incidencias del trayecto.
        </li>
        <li>
          Mantener activa la aplicación y los permisos de ubicación durante el
          viaje, para que la información que reciben los apoderados sea correcta.
        </li>
      </ul>

      <h2>5. Obligaciones del apoderado</h2>
      <ul>
        <li>Mantener actualizados la dirección de retiro y los datos de contacto.</li>
        <li>Avisar las ausencias con la antelación que permita el recorrido.</li>
        <li>
          Entender que la información que entrega la aplicación es un apoyo y no
          reemplaza la supervisión directa ni la comunicación con el
          transportista.
        </li>
      </ul>

      <h2>6. Disponibilidad y limitaciones técnicas</h2>
      <p>
        El funcionamiento del seguimiento depende de factores que no controlamos:
        la señal GPS, la cobertura de datos móviles, la batería y la
        configuración del teléfono del conductor, y la disponibilidad de los
        servicios de terceros que usamos.
      </p>
      <p>
        Por eso: <strong>la ubicación y las horas estimadas de llegada son
        referenciales.</strong> Pueden presentar desfases, imprecisiones o
        interrupciones. Las horas de subida y bajada corresponden al momento en
        que fueron registradas en la aplicación.
      </p>
      <p>
        Procuramos mantener el servicio disponible durante los horarios de
        operación de los recorridos, pero no garantizamos disponibilidad
        ininterrumpida. Podemos realizar mantenciones programadas, idealmente
        fuera de esos horarios.
      </p>

      <h2>7. Limitación de responsabilidad</h2>
      <p>
        {site.name} no responde por hechos ocurridos durante el transporte, por
        decisiones tomadas en base a la información de la aplicación, ni por
        fallas atribuibles a la conectividad, al dispositivo del usuario o a
        servicios de terceros. Nuestra responsabilidad se limita, en todo caso,
        al monto efectivamente pagado por el servicio en los últimos doce meses.
      </p>
      <p>
        Nada en estos términos limita los derechos que la ley chilena otorga de
        forma irrenunciable a los consumidores.
      </p>

      <h2>8. Propiedad intelectual</h2>
      <p>
        El software, la marca, el diseño y la documentación de {site.name} son de
        nuestra propiedad. El uso de la plataforma no transfiere ningún derecho
        sobre ellos. Los datos que ingresan los usuarios siguen siendo de sus
        titulares, y los tratamos conforme a la{" "}
        <a href="/privacidad">política de privacidad</a>.
      </p>

      <h2>9. Planes y pagos</h2>
      <p>
        {/* TODO: reemplazar cuando existan planes definidos. */}
        Las condiciones comerciales (planes, precios, forma de pago y período de
        facturación) se informarán antes de la contratación y se detallarán en
        esta sección. Durante la etapa de piloto, el uso del servicio se acuerda
        caso a caso.
      </p>

      <h2>10. Suspensión y término</h2>
      <p>
        Puedes dejar de usar el servicio y solicitar el cierre de tu cuenta en
        cualquier momento. Podemos suspender o terminar el acceso en caso de
        incumplimiento de estos términos, de uso fraudulento, o si la operación
        pone en riesgo la seguridad de los estudiantes o de los datos.
      </p>

      <h2>11. Cambios a estos términos</h2>
      <p>
        Podemos actualizar estos términos. Si el cambio es relevante, lo
        avisaremos por la aplicación o por correo con antelación razonable. El
        uso del servicio después de la entrada en vigencia implica su aceptación.
      </p>

      <h2>12. Ley aplicable</h2>
      <p>
        Estos términos se rigen por la ley chilena. Cualquier controversia será
        sometida a los tribunales competentes de {site.ciudad}.
      </p>

      <h2>13. Contacto</h2>
      <p>
        Consultas sobre estos términos:{" "}
        <a href={`mailto:${site.email}`}>{site.email}</a>.
      </p>
    </LegalLayout>
  );
}
