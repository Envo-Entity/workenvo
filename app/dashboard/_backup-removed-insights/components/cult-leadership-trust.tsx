import styles from "../dashboard.module.css";

// Monthly trust scores — Jan to Jun
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const trustScores = [72, 74, 68, 65, 73, 75];

const events: {
  monthIdx: number;
  label: string;
  labelShort: string;
  causesDip: boolean;
}[] = [
  { monthIdx: 2, label: "Q2 Reorg", labelShort: "Q2 Reorg", causesDip: true },
  { monthIdx: 3, label: "RTO Policy Announced", labelShort: "RTO Policy", causesDip: true },
  { monthIdx: 4, label: "New VP Engineering", labelShort: "New VP Eng", causesDip: false },
];

// SVG geometry
const W = 440;
const H = 200;
const PAD = { top: 20, right: 20, bottom: 56, left: 36 };
const chartW = W - PAD.left - PAD.right;
const chartH = H - PAD.top - PAD.bottom;
const MIN_V = 55;
const MAX_V = 82;

function toSvg(val: number, idx: number): [number, number] {
  const x = PAD.left + (idx / (trustScores.length - 1)) * chartW;
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

const pts = trustScores.map((v, i) => toSvg(v, i) as [number, number]);
const linePath = smoothPath(pts);
const areaPath =
  linePath +
  ` L ${pts[pts.length - 1][0]} ${PAD.top + chartH}` +
  ` L ${pts[0][0]} ${PAD.top + chartH} Z`;

export default function CultLeadershipTrust() {
  return (
    <div
      className={`flex flex-col rounded-[1.5rem] bg-white p-6 md:col-span-6 md:p-8 ${styles.ambientShadow}`}
    >
      <div className="mb-6">
        <h2 className="text-xl font-bold tracking-tight text-[#1c1b1b]">
          Leadership Trust Tracker
        </h2>
        <p className="mt-1 text-sm text-[#3e4941]">
          Trust score over 6 months with key org events
        </p>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full flex-1"
        style={{ overflow: "visible" }}
      >
        <defs>
          <linearGradient id="trustFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#006841" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#006841" stopOpacity="0.01" />
          </linearGradient>
        </defs>

        {/* Subtle y-axis refs */}
        {[60, 65, 70, 75, 80].map((val) => {
          const y = PAD.top + chartH - ((val - MIN_V) / (MAX_V - MIN_V)) * chartH;
          return (
            <g key={val}>
              <line x1={PAD.left} y1={y} x2={PAD.left + chartW} y2={y} stroke="#f0edec" strokeWidth="1" />
              <text x={PAD.left - 4} y={y + 4} textAnchor="end" fontSize="9" fill="#b8b3b1">{val}</text>
            </g>
          );
        })}

        {/* Area fill */}
        <path d={areaPath} fill="url(#trustFill)" />

        {/* Event connectors (dotted lines to dip points) */}
        {events
          .filter((e) => e.causesDip)
          .map((ev) => {
            const [ex, ey] = pts[ev.monthIdx];
            const baseY = PAD.top + chartH;
            return (
              <line
                key={ev.monthIdx}
                x1={ex}
                y1={ey}
                x2={ex}
                y2={baseY}
                stroke="#006841"
                strokeWidth="1"
                strokeDasharray="3 3"
                opacity="0.4"
              />
            );
          })}

        {/* Line */}
        <path d={linePath} fill="none" stroke="#006841" strokeWidth="2.5" strokeLinecap="round" />

        {/* Dots */}
        {pts.map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r="5" fill="white" stroke="#006841" strokeWidth="2" />
            <text x={x} y={y - 10} textAnchor="middle" fontSize="9" fontWeight="800" fill="#006841">
              {trustScores[i]}
            </text>
          </g>
        ))}

        {/* Event markers (diamonds) */}
        {events.map((ev) => {
          const [ex] = pts[ev.monthIdx];
          const baseY = PAD.top + chartH + 10;
          const size = 5;
          return (
            <g key={ev.monthIdx}>
              {/* Diamond */}
              <polygon
                points={`${ex},${baseY - size} ${ex + size},${baseY} ${ex},${baseY + size} ${ex - size},${baseY}`}
                fill={ev.causesDip ? "#d97706" : "#006841"}
              />
              {/* Label */}
              <text
                x={ex}
                y={baseY + size + 14}
                textAnchor="middle"
                fontSize="9"
                fontWeight="700"
                fill={ev.causesDip ? "#92400e" : "#006841"}
              >
                {ev.labelShort}
              </text>
            </g>
          );
        })}

        {/* X axis month labels */}
        {months.map((m, i) => {
          const x = PAD.left + (i / (months.length - 1)) * chartW;
          return (
            <text key={m} x={x} y={PAD.top + chartH + 8} textAnchor="middle" fontSize="10" fontWeight="600" fill="#3e4941">
              {m}
            </text>
          );
        })}
      </svg>

      {/* Callout */}
      <div className="mt-4 rounded-[1rem] bg-amber-50 px-4 py-3 ring-1 ring-amber-100">
        <p className="text-xs font-semibold text-amber-800">
          RTO policy announcement correlated with a 9-point trust drop over 2 months.
          Recovery driven by new VP Engineering appointment in May.
        </p>
      </div>
    </div>
  );
}
