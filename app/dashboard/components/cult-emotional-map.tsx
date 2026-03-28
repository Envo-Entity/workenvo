import styles from "../dashboard.module.css";

// 30 days of aggregate emotional sentiment (0–100)
const emotionalData = [
  68, 70, 72, 69, 65, 61, 58, 62, 67, 70,
  72, 74, 71, 68, 63, 60, 58, 62, 65, 70,
  73, 71, 69, 65, 62, 58, 55, 60, 65, 68,
];

// Burnout risk heatmap — 5 days (Mon–Fri) × 8 weeks
const heatmap = [
  [20, 25, 30, 28, 22, 35, 40, 38], // Mon
  [30, 35, 42, 40, 35, 45, 50, 48], // Tue
  [45, 50, 65, 70, 62, 75, 80, 72], // Wed
  [50, 55, 68, 72, 65, 78, 82, 75], // Thu
  [25, 30, 35, 32, 28, 38, 42, 35], // Fri
];
const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri"];

function heatColor(v: number): string {
  if (v < 25) return "#d1fae5";
  if (v < 45) return "#fef3c7";
  if (v < 65) return "#fed7aa";
  return "#fecaca";
}

// Area chart geometry
const W = 440;
const H = 130;
const PAD = { top: 32, right: 12, bottom: 12, left: 8 };
const chartW = W - PAD.left - PAD.right;
const chartH = H - PAD.top - PAD.bottom;
const MIN_V = 40;
const MAX_V = 85;

function toSvg(val: number, idx: number): [number, number] {
  const x = PAD.left + (idx / (emotionalData.length - 1)) * chartW;
  const y = PAD.top + chartH - ((val - MIN_V) / (MAX_V - MIN_V)) * chartH;
  return [x, y];
}

function smoothPath(pts: [number, number][]): string {
  if (pts.length < 2) return "";
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const p0 = pts[Math.max(0, i - 2)];
    const p1 = pts[i - 1];
    const p2 = pts[i];
    const p3 = pts[Math.min(pts.length - 1, i + 1)];
    const cp1x = (p1[0] + (p2[0] - p0[0]) / 6).toFixed(1);
    const cp1y = (p1[1] + (p2[1] - p0[1]) / 6).toFixed(1);
    const cp2x = (p2[0] - (p3[0] - p1[0]) / 6).toFixed(1);
    const cp2y = (p2[1] - (p3[1] - p1[1]) / 6).toFixed(1);
    d += ` C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${p2[0]} ${p2[1]}`;
  }
  return d;
}

const pts = emotionalData.map((v, i) => toSvg(v, i) as [number, number]);
const linePath = smoothPath(pts);
const areaPath =
  linePath +
  ` L ${pts[pts.length - 1][0]} ${PAD.top + chartH}` +
  ` L ${pts[0][0]} ${PAD.top + chartH} Z`;

// Sentiment band y positions
function bandY(val: number) {
  return PAD.top + chartH - ((val - MIN_V) / (MAX_V - MIN_V)) * chartH;
}
const bands = [
  { label: "Thriving", from: 75, to: 85, color: "rgba(0,104,65,0.06)" },
  { label: "Steady", from: 57, to: 75, color: "rgba(0,132,84,0.04)" },
  { label: "Strained", from: MIN_V, to: 57, color: "rgba(245,158,11,0.06)" },
];

export default function CultEmotionalMap() {
  return (
    <div className="flex flex-col rounded-[1.5rem] bg-[#f6f3f2] p-6 md:col-span-6 md:p-8">
      <div className="mb-6">
        <h2 className="text-xl font-bold tracking-tight text-[#1c1b1b]">
          Emotional State & Energy Map
        </h2>
        <p className="mt-1 text-sm text-[#3e4941]">
          30-day sentiment trend + burnout risk heatmap
        </p>
      </div>

      {/* Area chart */}
      <div className="rounded-[1rem] bg-white p-4">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#3e4941]">
          Aggregate Emotional State — Last 30 Days
        </p>

        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ overflow: "visible" }}>
          <defs>
            <linearGradient id="emotFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#006841" stopOpacity="0.18" />
              <stop offset="70%" stopColor="#d97706" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#d97706" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Sentiment bands */}
          {bands.map((band) => {
            const y1 = bandY(band.to);
            const y2 = bandY(band.from);
            return (
              <rect
                key={band.label}
                x={PAD.left}
                y={y1}
                width={chartW}
                height={y2 - y1}
                fill={band.color}
              />
            );
          })}

          {/* Band labels */}
          {bands.map((band) => {
            const midY = (bandY(band.from) + bandY(band.to)) / 2;
            return (
              <text
                key={`lbl-${band.label}`}
                x={PAD.left + 4}
                y={midY + 4}
                fontSize="8"
                fill="#b8b3b1"
                fontWeight="600"
              >
                {band.label}
              </text>
            );
          })}

          {/* Area + line */}
          <path d={areaPath} fill="url(#emotFill)" />
          <path d={linePath} fill="none" stroke="#006841" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      {/* Burnout heatmap */}
      <div className="mt-4 rounded-[1rem] bg-white p-4">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#3e4941]">
          Burnout Risk by Day — Last 8 Weeks
        </p>

        <div className="flex gap-2">
          {/* Day labels */}
          <div className="flex flex-col justify-around gap-1.5">
            {dayLabels.map((d) => (
              <span key={d} className="h-6 text-right text-[9px] font-bold text-[#3e4941] leading-6 w-7">
                {d}
              </span>
            ))}
          </div>

          {/* Grid */}
          <div className="flex flex-1 flex-col gap-1.5">
            {heatmap.map((row, ri) => (
              <div key={ri} className="flex flex-1 gap-1.5">
                {row.map((val, ci) => (
                  <div
                    key={ci}
                    className="h-6 flex-1 rounded"
                    style={{ backgroundColor: heatColor(val) }}
                    title={`${dayLabels[ri]}, Week ${ci + 1}: ${val}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-3 flex items-center gap-1.5">
          <span className="text-[9px] font-semibold text-[#3e4941]">Low</span>
          {["#d1fae5", "#fef3c7", "#fed7aa", "#fecaca"].map((c) => (
            <div key={c} className="h-3 w-6 rounded" style={{ backgroundColor: c }} />
          ))}
          <span className="text-[9px] font-semibold text-[#3e4941]">High</span>
          <span className="ml-3 text-[9px] text-[#3e4941]">
            Wed–Thu consistently elevated — systemic mid-week pressure detected
          </span>
        </div>
      </div>
    </div>
  );
}
