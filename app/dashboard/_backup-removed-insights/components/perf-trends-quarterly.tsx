import styles from "../dashboard.module.css";

// Q1–Q4 data
// Performance Score: [74, 76, 79, 78.4]
// Goal Completion:   [71, 75, 82, 78]

const quarters = ["Q1", "Q2", "Q3", "Q4"];

// SVG viewport
const W = 380;
const H = 180;
const PAD = { top: 16, right: 16, bottom: 32, left: 32 };
const chartW = W - PAD.left - PAD.right;
const chartH = H - PAD.top - PAD.bottom;

const perfScores = [74, 76, 79, 78.4];
const goalCompletion = [71, 75, 82, 78];

const MIN_VAL = 60;
const MAX_VAL = 92;

function toSvg(val: number, idx: number): [number, number] {
  const x = PAD.left + (idx / (quarters.length - 1)) * chartW;
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

const perfPts = perfScores.map((v, i) => toSvg(v, i) as [number, number]);
const goalPts = goalCompletion.map((v, i) => toSvg(v, i) as [number, number]);

const perfPath = smoothPath(perfPts);
const goalPath = smoothPath(goalPts);

// Area under goal completion
const areaPath =
  goalPath +
  ` L ${goalPts[goalPts.length - 1][0]} ${PAD.top + chartH}` +
  ` L ${goalPts[0][0]} ${PAD.top + chartH} Z`;

export default function PerfTrendsQuarterly() {
  return (
    <div
      className={`flex flex-col rounded-[1.5rem] bg-white p-6 md:col-span-6 md:p-8 ${styles.ambientShadow}`}
    >
      <div className="mb-6">
        <h2 className="text-xl font-bold tracking-tight text-[#1c1b1b]">
          Performance Trends
        </h2>
        <p className="mt-1 text-sm text-[#3e4941]">
          Avg Performance Score vs Goal Completion — Q1 to Q4
        </p>
      </div>

      {/* Legend */}
      <div className="mb-4 flex gap-6">
        <div className="flex items-center gap-2">
          <div className="h-2 w-6 rounded-full bg-[#006841]" />
          <span className="text-xs font-semibold text-[#3e4941]">
            Goal Completion %
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-6 rounded-full bg-[#72dba3]" />
          <span className="text-xs font-semibold text-[#3e4941]">
            Avg Performance Score
          </span>
        </div>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ overflow: "visible" }}
      >
        <defs>
          <linearGradient id="goalFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#006841" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#006841" stopOpacity="0.01" />
          </linearGradient>
        </defs>

        {/* Area fill */}
        <path d={areaPath} fill="url(#goalFill)" />

        {/* Grid lines (subtle) */}
        {[70, 75, 80, 85].map((val) => {
          const y = PAD.top + chartH - ((val - MIN_VAL) / (MAX_VAL - MIN_VAL)) * chartH;
          return (
            <line
              key={val}
              x1={PAD.left}
              y1={y}
              x2={PAD.left + chartW}
              y2={y}
              stroke="#f0edec"
              strokeWidth="1"
            />
          );
        })}

        {/* Perf score line */}
        <path
          d={perfPath}
          fill="none"
          stroke="#72dba3"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Goal completion line */}
        <path
          d={goalPath}
          fill="none"
          stroke="#006841"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Dots — perf */}
        {perfPts.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="4" fill="white" stroke="#72dba3" strokeWidth="2" />
        ))}

        {/* Dots — goal */}
        {goalPts.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="4" fill="white" stroke="#006841" strokeWidth="2" />
        ))}

        {/* Delta label at Q3 (max divergence) */}
        {(() => {
          const [x, y] = goalPts[2];
          const [, yP] = perfPts[2];
          const midY = (y + yP) / 2;
          return (
            <g>
              <line x1={x + 12} y1={y} x2={x + 12} y2={yP} stroke="#006841" strokeWidth="1" strokeDasharray="3 2" />
              <text x={x + 18} y={midY + 4} fontSize="9" fill="#006841" fontWeight="700">+3pts gap</text>
            </g>
          );
        })()}

        {/* X axis labels */}
        {quarters.map((q, i) => {
          const x = PAD.left + (i / (quarters.length - 1)) * chartW;
          return (
            <text
              key={q}
              x={x}
              y={H - 4}
              textAnchor="middle"
              fontSize="10"
              fill="#3e4941"
              fontWeight="600"
            >
              {q}
            </text>
          );
        })}

        {/* Y axis start/end values */}
        <text x={PAD.left - 6} y={PAD.top + 4} textAnchor="end" fontSize="9" fill="#3e4941">
          {MAX_VAL}
        </text>
        <text x={PAD.left - 6} y={PAD.top + chartH + 4} textAnchor="end" fontSize="9" fill="#3e4941">
          {MIN_VAL}
        </text>
      </svg>
    </div>
  );
}
