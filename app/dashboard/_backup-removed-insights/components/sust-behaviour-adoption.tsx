import styles from "../dashboard.module.css";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const adoptionData = [42, 45, 48, 52, 55, 58, 62, 59, 63, 67, 65, 69];
const TARGET = 75;

const VW = 480;
const VH = 190;
const PAD = { top: 20, right: 52, bottom: 32, left: 32 };
const chartW = VW - PAD.left - PAD.right;
const chartH = VH - PAD.top - PAD.bottom;
const MIN_V = 30;
const MAX_V = 100;

function toX(idx: number) {
  return PAD.left + (idx / (adoptionData.length - 1)) * chartW;
}

function toY(val: number) {
  return PAD.top + chartH - ((val - MIN_V) / (MAX_V - MIN_V)) * chartH;
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

const pts = adoptionData.map((v, i) => [toX(i), toY(v)] as [number, number]);
const linePath = smoothPath(pts);
const areaPath = linePath + ` L ${pts[pts.length - 1][0]} ${PAD.top + chartH} L ${pts[0][0]} ${PAD.top + chartH} Z`;

const targetY = toY(TARGET);

// Amber gap polygon: region between current line and target line (all months below target)
const gapPolygon =
  pts.map((p, i) => (i === 0 ? `M ${p[0]} ${targetY}` : `L ${toX(i)} ${targetY}`)).join(" ") +
  " " +
  [...pts].reverse().map((p, i) => (i === 0 ? `L ${p[0]} ${p[1]}` : `L ${p[0]} ${p[1]}`)).join(" ") +
  " Z";

export default function SustBehaviourAdoption() {
  return (
    <div
      className={`flex flex-col rounded-[1.5rem] bg-white p-6 md:col-span-6 md:p-8 ${styles.ambientShadow}`}
    >
      <div className="mb-6">
        <h2 className="text-xl font-bold tracking-tight text-[#1c1b1b]">
          Behaviour Adoption Trends
        </h2>
        <p className="mt-1 text-sm text-[#3e4941]">
          Employees logging at least one sustainability action per month
        </p>
      </div>

      <svg viewBox={`0 0 ${VW} ${VH}`} className="w-full flex-1" style={{ overflow: "visible" }}>
        <defs>
          <linearGradient id="adoptFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#006841" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#006841" stopOpacity="0.01" />
          </linearGradient>
        </defs>

        {/* Amber gap between line and target */}
        <path d={gapPolygon} fill="rgba(217,119,6,0.06)" />

        {/* Green area fill */}
        <path d={areaPath} fill="url(#adoptFill)" />

        {/* Target dashed line */}
        <line
          x1={PAD.left}
          y1={targetY}
          x2={PAD.left + chartW}
          y2={targetY}
          stroke="#d97706"
          strokeWidth="1.5"
          strokeDasharray="5 4"
        />
        <text
          x={PAD.left + chartW + 6}
          y={targetY + 4}
          fontSize="9"
          fontWeight="700"
          fill="#d97706"
        >
          Target
        </text>
        <text
          x={PAD.left + chartW + 6}
          y={targetY + 15}
          fontSize="9"
          fill="#d97706"
        >
          {TARGET}%
        </text>

        {/* Main line */}
        <path d={linePath} fill="none" stroke="#006841" strokeWidth="2.5" strokeLinecap="round" />

        {/* End dot + value */}
        {(() => {
          const [lastX, lastY] = pts[pts.length - 1];
          return (
            <g>
              <circle cx={lastX} cy={lastY} r="4" fill="white" stroke="#006841" strokeWidth="2" />
              <text x={lastX} y={lastY - 10} textAnchor="middle" fontSize="9" fontWeight="800" fill="#006841">
                {adoptionData[adoptionData.length - 1]}%
              </text>
            </g>
          );
        })()}

        {/* Y axis values */}
        {[40, 60, 80].map((v) => (
          <text key={v} x={PAD.left - 4} y={toY(v) + 4} textAnchor="end" fontSize="9" fill="#b8b3b1">
            {v}%
          </text>
        ))}

        {/* X axis labels — every other month */}
        {months.map((m, i) => {
          if (i % 2 !== 0) return null;
          return (
            <text
              key={m}
              x={toX(i)}
              y={VH - 4}
              textAnchor="middle"
              fontSize="10"
              fontWeight="600"
              fill="#3e4941"
            >
              {m}
            </text>
          );
        })}
      </svg>

      <div className="mt-4 flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <div className="h-0.5 w-5 bg-[#006841]" />
          <span className="text-xs font-semibold text-[#3e4941]">Adoption rate</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-px w-5 border-t border-dashed border-amber-500" />
          <span className="text-xs font-semibold text-amber-600">Target (75%)</span>
        </div>
      </div>
    </div>
  );
}
