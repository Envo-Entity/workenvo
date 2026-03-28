import styles from "../dashboard.module.css";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];
const values = [45, 52, 48, 71, 65, 58, 49, 55];
// Ghost line (last year)
const lastYear = [38, 44, 41, 52, 58, 50, 43, 48];

const W = 580;
const H = 160;
const PAD = { top: 20, right: 20, bottom: 28, left: 36 };
const chartW = W - PAD.left - PAD.right;
const chartH = H - PAD.top - PAD.bottom;
const MIN_VAL = 25;
const MAX_VAL = 85;

function toSvg(val: number, idx: number): [number, number] {
  const x = PAD.left + (idx / (values.length - 1)) * chartW;
  const y = PAD.top + chartH - ((val - MIN_VAL) / (MAX_VAL - MIN_VAL)) * chartH;
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

const pts = values.map((v, i) => toSvg(v, i) as [number, number]);
const ghostPts = lastYear.map((v, i) => toSvg(v, i) as [number, number]);

const linePath = smoothPath(pts);
const ghostLinePath = smoothPath(ghostPts);
const areaPath =
  linePath +
  ` L ${pts[pts.length - 1][0]} ${PAD.top + chartH}` +
  ` L ${pts[0][0]} ${PAD.top + chartH} Z`;

// Annotation at Apr (index 3) — spike
const [annX, annY] = pts[3];

// Reference thresholds
const thresholds = [40, 55, 70];

export default function PerfRecognitionActivity() {
  return (
    <div
      className={`rounded-[1.5rem] bg-white p-6 md:col-span-12 md:p-8 ${styles.ambientShadow}`}
    >
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#1c1b1b]">
            Recognition Activity
          </h2>
          <p className="mt-1 text-sm text-[#3e4941]">
            Monthly recognitions given across the org — Jan to Aug
          </p>
        </div>
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2">
            <div className="h-2 w-6 rounded-full bg-[#006841]" />
            <span className="text-xs font-semibold text-[#3e4941]">This year</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-px w-6 bg-stone-300" />
            <span className="text-xs font-semibold text-[#3e4941]">Last year</span>
          </div>
        </div>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ overflow: "visible" }}
      >
        <defs>
          <linearGradient id="recFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#006841" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#006841" stopOpacity="0.01" />
          </linearGradient>
        </defs>

        {/* Threshold reference lines */}
        {thresholds.map((t) => {
          const y = PAD.top + chartH - ((t - MIN_VAL) / (MAX_VAL - MIN_VAL)) * chartH;
          return (
            <g key={t}>
              <line
                x1={PAD.left}
                y1={y}
                x2={PAD.left + chartW}
                y2={y}
                stroke="#f0edec"
                strokeWidth="1"
              />
              <text x={PAD.left - 6} y={y + 4} textAnchor="end" fontSize="9" fill="#3e4941">
                {t}
              </text>
            </g>
          );
        })}

        {/* Area fill */}
        <path d={areaPath} fill="url(#recFill)" />

        {/* Ghost last-year line */}
        <path
          d={ghostLinePath}
          fill="none"
          stroke="#d4d0cf"
          strokeWidth="1.5"
          strokeDasharray="4 3"
          strokeLinecap="round"
        />

        {/* Main line */}
        <path
          d={linePath}
          fill="none"
          stroke="#006841"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Annotation — Apr spike */}
        <circle cx={annX} cy={annY} r="6" fill="#006841" />
        <circle cx={annX} cy={annY} r="3" fill="white" />
        {/* Annotation label */}
        <g transform={`translate(${annX + 10}, ${annY - 16})`}>
          <rect x="0" y="0" width="168" height="22" rx="6" fill="#006841" />
          <text x="8" y="14" fontSize="9" fill="white" fontWeight="600">
            Post-Q1 review cycle — 38% spike
          </text>
        </g>

        {/* X axis labels */}
        {months.map((m, i) => {
          const x = PAD.left + (i / (values.length - 1)) * chartW;
          return (
            <text
              key={m}
              x={x}
              y={H - 2}
              textAnchor="middle"
              fontSize="10"
              fill="#3e4941"
              fontWeight="600"
            >
              {m}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
