import type { ReactNode } from "react";

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}

export function Section({
  id,
  children,
  className = "",
  soft = false,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  soft?: boolean;
}) {
  return (
    <section
      id={id}
      className={`py-20 sm:py-28 ${soft ? "bg-surface-soft" : ""} ${className}`}
    >
      <Container>{children}</Container>
    </section>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand-500 dark:text-brand-300">
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "center",
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  align?: "center" | "left";
}) {
  const alignment =
    align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl";

  return (
    <div className={alignment}>
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h2 className="mt-3 text-3xl font-bold sm:text-4xl">{title}</h2>
      {lead ? (
        <p className="mt-4 text-lg leading-relaxed text-ink-muted">{lead}</p>
      ) : null}
    </div>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-line bg-surface-raised p-6 shadow-card ${className}`}
    >
      {children}
    </div>
  );
}

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className = "",
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-base font-semibold transition-colors";
  const styles =
    variant === "primary"
      ? "bg-brand-900 text-white hover:bg-brand-800 dark:bg-accent-500 dark:text-brand-950 dark:hover:bg-accent-400"
      : "border border-line bg-surface text-ink hover:border-brand-300 hover:text-brand-600 dark:hover:text-brand-200";

  return (
    <a href={href} className={`${base} ${styles} ${className}`}>
      {children}
    </a>
  );
}

/** Marca de verificación usada en todas las listas de características. */
export function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      className={`size-5 shrink-0 ${className}`}
      fill="none"
    >
      <circle cx="10" cy="10" r="9" className="fill-brand-100 dark:fill-brand-800" />
      <path
        d="m6 10.4 2.6 2.6L14 7.6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-brand-600 dark:text-accent-400"
      />
    </svg>
  );
}

export function FeatureList({ items }: { items: readonly string[] }) {
  return (
    <ul className="mt-6 space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-[0.95rem] leading-relaxed">
          <CheckIcon className="mt-0.5" />
          <span className="text-ink-muted">{item}</span>
        </li>
      ))}
    </ul>
  );
}
