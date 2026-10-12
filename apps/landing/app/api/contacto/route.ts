import { NextResponse } from "next/server";

/**
 * Recepción de los mensajes del formulario de contacto.
 *
 * ESTADO: sin destino conectado todavía. Define CONTACT_WEBHOOK_URL en las
 * variables de entorno (por ejemplo un webhook de Slack, de Make, o un endpoint
 * propio) y los mensajes se reenviarán ahí. Mientras no exista esa variable, el
 * endpoint responde 503 a propósito: es preferible a decirle a alguien que su
 * mensaje llegó cuando en realidad se perdió.
 *
 * Siguiente paso natural: cuando exista la API del proyecto, reemplazar el
 * webhook por un POST a /prospectos y guardar el mensaje en la base de datos.
 */

type Payload = {
  nombre?: unknown;
  email?: unknown;
  telefono?: unknown;
  perfil?: unknown;
  mensaje?: unknown;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function texto(valor: unknown, max: number): string {
  return typeof valor === "string" ? valor.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  let cuerpo: Payload;

  try {
    cuerpo = (await request.json()) as Payload;
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido." }, { status: 400 });
  }

  const nombre = texto(cuerpo.nombre, 120);
  const email = texto(cuerpo.email, 160);
  const telefono = texto(cuerpo.telefono, 40);
  const perfil = texto(cuerpo.perfil, 80);
  const mensaje = texto(cuerpo.mensaje, 2000);

  if (nombre.length < 2) {
    return NextResponse.json({ error: "Indica tu nombre." }, { status: 400 });
  }

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "Revisa el correo: no parece válido." },
      { status: 400 },
    );
  }

  const destino = process.env.CONTACT_WEBHOOK_URL;

  if (!destino) {
    console.warn(
      "[contacto] CONTACT_WEBHOOK_URL no está configurado. Mensaje no entregado:",
      { nombre, email, telefono, perfil },
    );

    return NextResponse.json(
      {
        error:
          "El formulario todavía no está conectado. Escríbenos directamente por correo mientras lo terminamos.",
      },
      { status: 503 },
    );
  }

  try {
    const res = await fetch(destino, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        origen: "landing",
        recibidoEn: new Date().toISOString(),
        nombre,
        email,
        telefono,
        perfil,
        mensaje,
      }),
    });

    if (!res.ok) {
      console.error("[contacto] el webhook respondió", res.status);
      return NextResponse.json(
        { error: "No pudimos registrar tu mensaje. Intenta de nuevo." },
        { status: 502 },
      );
    }
  } catch (error) {
    console.error("[contacto] falló el envío al webhook", error);
    return NextResponse.json(
      { error: "No pudimos registrar tu mensaje. Intenta de nuevo." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
