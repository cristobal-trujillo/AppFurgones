import { Logo } from "@/components/logo";
import { Container } from "@/components/ui";
import { nav, site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-surface-soft">
      <Container className="py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Logo />
            <p className="mt-4 max-w-sm text-[0.95rem] leading-relaxed text-ink-muted">
              {site.tagline}. Seguimiento del vehículo, confirmación de subida y
              bajada, y rutas optimizadas para el conductor.
            </p>
            <p className="mt-5 text-sm text-ink-muted">
              <a
                href={`mailto:${site.email}`}
                className="font-medium hover:text-ink"
              >
                {site.email}
              </a>
              <span className="mx-2 text-line">·</span>
              {site.ciudad}
            </p>
          </div>

          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider">Producto</h2>
            <ul className="mt-4 space-y-2.5">
              {nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-[0.95rem] text-ink-muted hover:text-ink"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="#contacto"
                  className="text-[0.95rem] text-ink-muted hover:text-ink"
                >
                  Solicitar una demo
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider">Legal</h2>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a
                  href="/privacidad"
                  className="text-[0.95rem] text-ink-muted hover:text-ink"
                >
                  Política de privacidad
                </a>
              </li>
              <li>
                <a
                  href="/terminos"
                  className="text-[0.95rem] text-ink-muted hover:text-ink"
                >
                  Términos de servicio
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-line pt-6 text-sm text-ink-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. Todos los derechos
            reservados.
          </p>
          <p>Hecho en Chile para el transporte escolar.</p>
        </div>
      </Container>
    </footer>
  );
}
