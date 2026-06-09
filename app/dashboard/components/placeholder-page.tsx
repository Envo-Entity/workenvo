import DashboardHeader from "./header";
import DashboardIcon from "./dashboard-icon";

type PlaceholderPageProps = {
  tag: string;
  title: string;
  icon: string;
  description: string;
  cta: string;
};

export default function PlaceholderPage({
  tag,
  title,
  icon,
  description,
  cta,
}: PlaceholderPageProps) {
  return (
    <>
      <DashboardHeader tag={tag} title={title} ctaSecondary="" ctaPrimary="" />

      <div className="flex flex-1 items-center justify-center py-16">
        <div className="mx-auto flex w-full max-w-[480px] flex-col items-center gap-6 rounded-[2rem] bg-white p-10 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(16,137,79,0.10)]">
            <DashboardIcon name={icon} className="text-[32px] text-[var(--dash-primary)]" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold tracking-tight text-[var(--dash-ink)]">
              {title}
            </h2>
            <p className="text-sm leading-relaxed text-[var(--dash-ink-ghost)]">
              Coming soon — this section is under development
            </p>
            <p className="text-sm leading-relaxed text-[var(--dash-ink-faint)]">
              {description}
            </p>
          </div>

          <button className="rounded-full bg-[rgba(16,137,79,0.10)] px-6 py-2.5 text-sm font-semibold text-[var(--dash-primary)] transition-all hover:bg-[rgba(16,137,79,0.15)]">
            {cta}
          </button>
        </div>
      </div>
    </>
  );
}
