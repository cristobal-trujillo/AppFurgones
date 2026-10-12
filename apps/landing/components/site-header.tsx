"use client";

import { useEffect, useState } from "react";
import { Logo } from "@/components/logo";
import { Container } from "@/components/ui";
import { nav, site } from "@/lib/site";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-colors ${
        scrolled
          ? "border-line bg-surface/85 backdrop-blur-md"
          : "border-transparent bg-transparent"
      }`}
    >
      <Container>
        <div className="flex h-16 items-center justify-between gap-4">
          <a href="/" aria-label={`Ir al inicio de ${site.name}`}>
            <Logo />
          </a>

          <nav className="hidden items-center gap-8 md:flex" aria-label="Principal">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-ink-muted transition-colors hover:text-ink"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:block">
            <a
              href="#contacto"
              className="inline-flex items-center rounded-xl bg-brand-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-800 dark:bg-accent-500 dark:text-brand-950 dark:hover:bg-accent-400"
            >
              Solicitar una demo
            </a>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="menu-movil"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            className="grid size-10 place-items-center rounded-lg border border-line text-ink md:hidden"
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden="true">
              {open ? (
                <path
                  d="m6 6 12 12M18 6 6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </div>
      </Container>

      {open ? (
        <div
          id="menu-movil"
          className="border-t border-line bg-surface md:hidden"
        >
          <Container className="py-4">
            <nav className="flex flex-col gap-1" aria-label="Principal (móvil)">
              {nav.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-2 py-3 text-base font-medium text-ink-muted hover:bg-surface-soft hover:text-ink"
                >
                  {item.label}
                </a>
              ))}
              <a
                href="#contacto"
                onClick={() => setOpen(false)}
                className="mt-2 inline-flex items-center justify-center rounded-xl bg-brand-900 px-4 py-3 text-base font-semibold text-white dark:bg-accent-500 dark:text-brand-950"
              >
                Solicitar una demo
              </a>
            </nav>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
