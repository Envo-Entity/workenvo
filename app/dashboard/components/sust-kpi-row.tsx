import styles from "../dashboard.module.css";

type KpiItem = {
  label: string;
  value: string;
  unit: string;
  trend: string;
  trendPositive: boolean;
  sparkData: number[];
};

const kpis: KpiItem[] = [
  {
    label: "Carbon Emissions Saved",
    value: "142.8",
    unit: "tonnes",
    trend: "+23% vs last quarter",
    trendPositive: true,
    sparkData: [62, 78, 95, 108, 124, 143],
  },
  {
    label: "Impact per Employee",
    value: "18.4",
    unit: "kg CO₂e",
    trend: "+12% vs last quarter",
    trendPositive: true,
    sparkData: [12.1, 13.4, 14.8, 15.9, 17.2, 18.4],
  },
  {
    label: "Behaviour Adoption Rate",
    value: "67",
    unit: "%",
    trend: "+8% vs last quarter",
    trendPositive: true,
    sparkData: [48, 52, 57, 61, 64, 67],
  },
];

function Sparkline({ data }: { data: number[] }) {
  const W = 100;
  const H = 36;
  const max = Math.max(...data);
  const min = Math.min(...data) * 0.9;
  const pts: [number, number][] = data.map((v, i) => [
    (i / (data.length - 1)) * W,
    H - ((v - min) / (max - min)) * (H - 4) - 2,
  ]);
  const linePath = pts
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`)
    .join(" ");
  const areaPath =
    linePath +
    ` L ${pts[pts.length - 1][0]} ${H} L ${pts[0][0]} ${H} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="none" style={{ overflow: "hidden" }}>
      <defs>
        <linearGradient id={`spark-fill-${data[0]}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#006841" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#006841" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#spark-fill-${data[0]})`} />
      <path d={linePath} fill="none" stroke="#006841" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function SustKpiRow() {
  return (
    <div className="grid grid-cols-1 gap-6 md:col-span-12 md:grid-cols-3">
      {kpis.map((kpi) => (
        <div
          key={kpi.label}
          className={`flex flex-col justify-between overflow-hidden rounded-[1.5rem] bg-white p-6 ${styles.ambientShadow}`}
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#3e4941]">
            {kpi.label}
          </p>

          <div className="mt-3">
            <div className="flex items-baseline gap-1.5">
              <span className="text-4xl font-black text-[#006841]">{kpi.value}</span>
              <span className="text-sm font-semibold text-[#3e4941]">{kpi.unit}</span>
            </div>
            <p
              className={`mt-1 text-xs font-bold ${kpi.trendPositive ? "text-emerald-600" : "text-red-500"}`}
            >
              {kpi.trendPositive ? "▲" : "▼"} {kpi.trend}
            </p>
          </div>

          <div className="mt-4 h-9">
            <Sparkline data={kpi.sparkData} />
          </div>
        </div>
      ))}
    </div>
  );
}
