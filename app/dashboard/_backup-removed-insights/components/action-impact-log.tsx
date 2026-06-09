import DashboardIcon from "./dashboard-icon";
import styles from "../dashboard.module.css";

export type ImpactOutcome = "Improved" | "No Change" | "Needs Follow-up";

export type ImpactEntry = {
  action: string;
  triggeredBy: string;
  date: string;
  result: string;
  before: string;
  after: string;
  outcome: ImpactOutcome;
};

const OUTCOME_STYLES: Record<ImpactOutcome, string> = {
  Improved: "bg-[#dcfce7] text-[#166534]",
  "No Change": "bg-[#e5e7eb] text-[#4b5563]",
  "Needs Follow-up": "bg-[#fef3c7] text-[#9a6c00]",
};

const DOT_STYLES: Record<ImpactOutcome, string> = {
  Improved: "bg-[#006841]",
  "No Change": "bg-[#9ca3af]",
  "Needs Follow-up": "bg-[#d97706]",
};

const AFTER_STYLES: Record<ImpactOutcome, string> = {
  Improved: "text-[#006841]",
  "No Change": "text-[#6b7280]",
  "Needs Follow-up": "text-[#b07e10]",
};

export function ImpactBadge({ outcome }: { outcome: ImpactOutcome }) {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] ${OUTCOME_STYLES[outcome]}`}>
      {outcome}
    </span>
  );
}

export function ImpactComparison({
  before,
  after,
  outcome,
}: {
  before: string;
  after: string;
  outcome: ImpactOutcome;
}) {
  return (
    <p className="text-sm font-semibold">
      <span className="text-[#8a948e]">{before}</span>
      <span className="mx-2 text-[#8a948e]">→</span>
      <span className={AFTER_STYLES[outcome]}>{after}</span>
    </p>
  );
}

export default function ActionImpactLog({
  entries,
}: {
  entries: ImpactEntry[];
}) {
  return (
    <div className={`rounded-[1.5rem] bg-white p-6 md:col-span-12 md:p-8 ${styles.ambientShadow}`}>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#6f7a73]">
            Action Tracking
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#1c1b1b]">
            Action &amp; Impact Log
          </h2>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#006841]/10 text-[#006841]">
          <DashboardIcon name="task_alt" className="text-[22px]" />
        </div>
      </div>

      <div className="max-h-[520px] space-y-3 overflow-y-auto pr-1">
        {entries.map((entry) => (
          <div
            key={`${entry.action}-${entry.date}`}
            className="grid gap-4 rounded-[1.15rem] bg-[#f6f3f2] px-5 py-4 md:grid-cols-[12px_minmax(0,1.5fr)_minmax(0,1fr)_auto]"
          >
            <div className={`mt-2 h-3 w-3 rounded-full ${DOT_STYLES[entry.outcome]}`} />

            <div>
              <p className="text-sm font-bold text-[#1c1b1b]">{entry.action}</p>
              <p className="mt-1 text-[13px] leading-relaxed text-[#3e4941]/80">
                {entry.date} · Triggered by {entry.triggeredBy}
              </p>
              <p className="mt-2 text-[13px] leading-relaxed text-[#3e4941]/80">
                {entry.result}
              </p>
            </div>

            <div className="self-center">
              <ImpactComparison before={entry.before} after={entry.after} outcome={entry.outcome} />
            </div>

            <div className="self-start md:self-center">
              <ImpactBadge outcome={entry.outcome} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5">
        <a href="#" className="text-sm font-bold text-[#006841] transition-colors hover:text-[#008454]">
          View Full History →
        </a>
      </div>
    </div>
  );
}
