import styles from "../dashboard.module.css";

export default function DashboardHeader() {
  return (
    <header className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-[#006841]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-[#006841]">
            Organisation-wide insights
          </span>
        </div>
        <h1 className="text-4xl font-bold tracking-tighter text-[#1c1b1b] md:text-5xl">
          Capability tracking
        </h1>
      </div>

      <div className="flex gap-4">
        <button className="rounded-full bg-[#ebe7e7] px-6 py-4 text-sm font-semibold transition-all hover:bg-[#e5e2e1]">
          Download Report
        </button>
        <button
          className={`rounded-full bg-[#008454] px-8 py-4 text-sm font-semibold text-white transition-all hover:scale-105 ${styles.ambientShadow}`}
        >
          Generate AI View
        </button>
      </div>
    </header>
  );
}
