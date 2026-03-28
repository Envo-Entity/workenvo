import styles from "../dashboard.module.css";

// Donut data
const segments = [
  { label: "Training", pct: 32, color: "#006841" },
  { label: "Sales Target", pct: 28, color: "#008454" },
  { label: "Project Milestone", pct: 24, color: "#72dba3" },
  { label: "CPD", pct: 16, color: "#b7e4c7" },
];

// Donut geometry
const CX = 70;
const CY = 70;
const R = 50;
const STROKE = 16;
const C = 2 * Math.PI * R; // ≈ 314.2

// Accumulate offsets
let accumulated = 0;
const donutSlices = segments.map((seg) => {
  const arc = (seg.pct / 100) * C;
  const offset = -accumulated;
  accumulated += arc;
  return { ...seg, arc, offset };
});

const ACTIVE_GOALS = 847;
const ON_TRACK_PCT = 68;
const AT_RISK = 124;

export default function PerfGoalTracking() {
  return (
    <div
      className={`flex flex-col rounded-[1.5rem] bg-white p-6 md:col-span-6 md:p-8 ${styles.ambientShadow}`}
    >
      <div className="mb-6">
        <h2 className="text-xl font-bold tracking-tight text-[#1c1b1b]">
          Goal Tracking Overview
        </h2>
        <p className="mt-1 text-sm text-[#3e4941]">Aggregated active goals — all departments</p>
      </div>

      {/* Stat badges */}
      <div className="mb-6 grid grid-cols-3 gap-3">
        <div className="rounded-[1rem] bg-[#f6f3f2] p-4 text-center">
          <p className="text-2xl font-black text-[#006841]">{ACTIVE_GOALS}</p>
          <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#3e4941]">
            Active Goals
          </p>
        </div>
        <div className="rounded-[1rem] bg-[#006841]/10 p-4 text-center">
          <p className="text-2xl font-black text-[#006841]">{ON_TRACK_PCT}%</p>
          <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#006841]">
            On Track
          </p>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#006841]/20">
            <div
              className="h-full rounded-full bg-[#006841]"
              style={{ width: `${ON_TRACK_PCT}%` }}
            />
          </div>
        </div>
        <div className="rounded-[1rem] bg-amber-50 p-4 text-center">
          <p className="text-2xl font-black text-amber-600">{AT_RISK}</p>
          <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-600">
            At Risk
          </p>
        </div>
      </div>

      {/* Donut + legend */}
      <div className="flex items-center gap-6">
        <svg viewBox="0 0 140 140" className="w-36 flex-shrink-0">
          {donutSlices.map((seg) => (
            <circle
              key={seg.label}
              cx={CX}
              cy={CY}
              r={R}
              fill="none"
              stroke={seg.color}
              strokeWidth={STROKE}
              strokeDasharray={`${seg.arc.toFixed(2)} ${C.toFixed(2)}`}
              strokeDashoffset={seg.offset.toFixed(2)}
              transform={`rotate(-90 ${CX} ${CY})`}
            />
          ))}
          {/* Center text */}
          <text
            x={CX}
            y={CY - 6}
            textAnchor="middle"
            fontSize="16"
            fontWeight="900"
            fill="#006841"
          >
            {ACTIVE_GOALS}
          </text>
          <text
            x={CX}
            y={CY + 10}
            textAnchor="middle"
            fontSize="8"
            fontWeight="600"
            fill="#3e4941"
          >
            total goals
          </text>
        </svg>

        <div className="flex-1 space-y-3">
          {segments.map((seg) => (
            <div key={seg.label} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
                  style={{ backgroundColor: seg.color }}
                />
                <span className="text-xs font-semibold text-[#3e4941]">
                  {seg.label}
                </span>
              </div>
              <span className="text-xs font-bold text-[#1c1b1b]">{seg.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
