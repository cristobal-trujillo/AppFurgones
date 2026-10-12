import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Container } from "@/components/ui";
import { site } from "@/lib/site";

export function LegalLayout({
  titulo,
  bajada,
  children,
}: {
  titulo: string;
  bajada: string;
  children: ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      <main id="contenido" className="py-14 sm:py-20">
        <Container>
          <div className="max-w-3xl">
            <a
              href="/"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted hover:text-ink"
            >
              <svg viewBox="0 0 20 20" className="size-4" fill="none" aria-hidden="true">
                <path
                  d="M11.5 5 6.5 10l5 5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Volver al inicio
            </a>

            <h1 className="mt-6 text-3xl font-bold sm:text-4xl">{titulo}</h1>
            <p className="mt-4 text-lg leading-relaxed text-ink-muted">{bajada}</p>
            <p className="mt-4 text-sm text-ink-muted">
              Última actualización: {site.legalUpdated}
            </p>

            {/*
              Este aviso es para la etapa de desarrollo: deja claro que el texto
              todavía no pasó por revisión legal. Quitarlo antes de publicar el
              sitio y de enviar las apps a las tiendas.
            */}
            <div className="mt-8 rounded-2xl border border-accent-400 bg-accent-200/50 p-5 dark:border-accent-600/50 dark:bg-accent-600/10">
              <p className="text-sm font-semibold">Borrador pendiente de revisión legal</p>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
                Este documento es un borrador de trabajo y no constituye asesoría
                legal. Debe ser revisado por un abogado y ajustado a la normativa
                chilena vigente sobre protección de datos personales antes de
                publicarse.
              </p>
            </div>

            <div className="legal-prose mt-10">{children}</div>
          </div>
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}
