import styles from "../dashboard.module.css";

const bands = [
  {
    label: "Exceeds Expectations",
    pct: 18,
    headcount: 43,
    trend: "+2%",
    trendUp: true,
    bg: "bg-[#006841]",
    text: "text-white",
    lightBg: "bg-[#006841]/10",
    lightText: "text-[#006841]",
  },
  {
    label: "Meets Expectations",
    pct: 52,
    headcount: 125,
    trend: "-1%",
    trendUp: false,
    bg: "bg-[#008454]",
    text: "text-white",
    lightBg: "bg-[#008454]/10",
    lightText: "text-[#008454]",
  },
  {
    label: "Needs Improvement",
    pct: 22,
    headcount: 53,
    trend: "+3%",
    trendUp: false,
    bg: "bg-[#d97706]",
    text: "text-white",
    lightBg: "bg-amber-50",
    lightText: "text-amber-700",
  },
  {
    label: "Below Expectations",
    pct: 8,
    headcount: 19,
    trend: "-4%",
    trendUp: true,
    bg: "bg-[#dc2626]",
    text: "text-white",
    lightBg: "bg-red-50",
    lightText: "text-red-700",
  },
];

export default function PerfRatingDistribution() {
  return (
    <div
      className={`rounded-[1.5rem] bg-white p-6 md:col-span-12 md:p-8 ${styles.ambientShadow}`}
    >
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#1c1b1b]">
            Performance Rating Distribution
          </h2>
          <p className="mt-1 text-sm text-[#3e4941]">
            Workforce breakdown by rating band — Q4 2024
          </p>
        </div>
        <span className="rounded-full bg-[#006841]/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#006841]">
          240 Employees
        </span>
      </div>

      {/* Segmented bar */}
      <div className="flex h-12 w-full overflow-hidden rounded-full">
        {bands.map((b) => (
          <div
            key={b.label}
            className={`relative flex items-center justify-center ${b.bg} ${b.text} text-xs font-bold transition-all`}
            style={{ width: `${b.pct}%` }}
          >
            {b.pct >= 12 && <span>{b.pct}%</span>}
          </div>
        ))}
      </div>

      {/* Band detail tiles */}
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {bands.map((b) => (
          <div key={b.label} className={`rounded-[1rem] ${b.lightBg} p-4`}>
            <div className="mb-3 flex items-center justify-between">
              <span
                className={`h-3 w-3 rounded-full ${b.bg}`}
              />
              <span
                className={`text-[10px] font-bold ${b.trendUp ? "text-emerald-600" : "text-red-500"}`}
              >
                {b.trendUp ? "▲" : "▼"} {b.trend} QoQ
              </span>
            </div>
            <p className={`text-2xl font-black ${b.lightText}`}>{b.pct}%</p>
            <p className="mt-1 text-xs font-semibold text-[#1c1b1b]">
              {b.label}
            </p>
            <p className="mt-1 text-[10px] text-[#3e4941]">
              {b.headcount} employees
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
