import { site } from "@/lib/site";

export function VanIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className} fill="none">
      {/* carrocería */}
      <rect x="3" y="7" width="26" height="14" rx="4.5" fill="currentColor" />
      {/* ventanas */}
      <rect x="6.5" y="10.25" width="7.25" height="5.25" rx="1.6" className="fill-white/90" />
      <rect x="15.75" y="10.25" width="9.75" height="5.25" rx="1.6" className="fill-white/90" />
      {/* ruedas */}
      <circle cx="10" cy="22.5" r="3.25" fill="currentColor" />
      <circle cx="22" cy="22.5" r="3.25" fill="currentColor" />
      <circle cx="10" cy="22.5" r="1.15" className="fill-white/90" />
      <circle cx="22" cy="22.5" r="1.15" className="fill-white/90" />
    </svg>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span className="grid size-9 place-items-center rounded-xl bg-brand-900 text-accent-400 dark:bg-accent-500 dark:text-brand-900">
        <VanIcon className="size-[22px]" />
      </span>
      <span className="text-lg font-bold tracking-tight">{site.name}</span>
    </span>
  );
}
