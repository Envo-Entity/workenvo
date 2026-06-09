import styles from "../dashboard.module.css";

type DashboardHeaderProps = {
  tag?: string;
  title?: string;
  ctaSecondary?: string;
  ctaPrimary?: string;
};

export default function DashboardHeader({
  tag = "Organisation-wide insights",
  title = "Capability tracking",
  ctaSecondary = "Download Report",
  ctaPrimary = "Generate AI View",
}: DashboardHeaderProps) {
  return (
    <header className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-[rgba(16,137,79,0.10)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--dash-primary)]">
            {tag}
          </span>
        </div>
        <h1 className="text-3xl font-bold tracking-tighter text-[var(--dash-ink)] md:text-4xl">
          {title}
        </h1>
      </div>

      {(ctaSecondary || ctaPrimary) && (
        <div className="flex gap-4">
          {ctaSecondary && (
            <button className="rounded-full bg-[var(--dash-surface-muted)] px-6 py-3 text-sm font-semibold transition-all hover:bg-[var(--dash-line-strong)]">
              {ctaSecondary}
            </button>
          )}
          {ctaPrimary && (
            <button
              className={`rounded-full bg-[var(--dash-primary-deep)] px-6 py-3 text-sm font-semibold text-white transition-all hover:scale-105 ${styles.ambientShadow}`}
            >
              {ctaPrimary}
            </button>
          )}
        </div>
      )}
    </header>
  );
}
