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
          <span className="rounded-full bg-[#006841]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-[#006841]">
            {tag}
          </span>
        </div>
        <h1 className="text-3xl font-bold tracking-tighter text-[#1c1b1b] md:text-4xl">
          {title}
        </h1>
      </div>

      <div className="flex gap-4">
        <button className="rounded-full bg-[#ebe7e7] px-6 py-3 text-sm font-semibold transition-all hover:bg-[#e5e2e1]">
          {ctaSecondary}
        </button>
        <button
          className={`rounded-full bg-[#008454] px-6 py-3 text-sm font-semibold text-white transition-all hover:scale-105 ${styles.ambientShadow}`}
        >
          {ctaPrimary}
        </button>
      </div>
    </header>
  );
}
