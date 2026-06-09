import styles from "../dashboard.module.css";

const pillars = [
  { label: "Purpose Alignment", short: "Purpose", score: 84, prev: 80 },
  { label: "Fairness & Consistency", short: "Fairness", score: 71, prev: 74 },
  { label: "Capability & Readiness", short: "Capability", score: 88, prev: 82 },
  { label: "Integrity & Accountability", short: "Integrity", score: 79, prev: 76 },
  { label: "Sustainable Pressure", short: "Sust. Pressure", score: 68, prev: 72 },
  { label: "Leadership Trust", short: "Leadership Trust", score: 75, prev: 70 },
];

const CX = 200;
const CY = 170;
const MAX_R = 110;

function angle(idx: number) {
  return ((-90 + idx * 60) * Math.PI) / 180;
}

function point(idx: number, score: number): [number, number] {
  const r = (score / 100) * MAX_R;
  return [CX + r * Math.cos(angle(idx)), CY + r * Math.sin(angle(idx))];
}

function axisEnd(idx: number): [number, number] {
  return [CX + MAX_R * Math.cos(angle(idx)), CY + MAX_R * Math.sin(angle(idx))];
}

function labelPos(idx: number): { x: number; y: number; anchor: "middle" | "start" | "end"; dy: number } {
  const LABEL_R = MAX_R + 24;
  const a = angle(idx);
  const x = CX + LABEL_R * Math.cos(a);
  const y = CY + LABEL_R * Math.sin(a);
  const anchor: "middle" | "start" | "end" = idx === 0 || idx === 3 ? "middle" : idx < 3 ? "start" : "end";
  const dy = idx === 3 ? 12 : idx === 0 ? -4 : 4;
  return { x, y, anchor, dy };
}

const currentPoly = pillars
  .map((p, i) => point(i, p.score).join(","))
  .join(" ");
const prevPoly = pillars
  .map((p, i) => point(i, p.prev).join(","))
  .join(" ");

const gridLevels = [20, 40, 60, 80, 100];

function gridPoly(level: number) {
  return pillars
    .map((_, i) => {
      const [ax, ay] = axisEnd(i);
      const r = level / 100;
      return `${(CX + (ax - CX) * r).toFixed(1)},${(CY + (ay - CY) * r).toFixed(1)}`;
    })
    .join(" ");
}

const sorted = [...pillars].sort((a, b) => b.score - a.score);
const weakest = Math.min(...pillars.map((p) => p.score));

export default function CultOrgHealthPulse() {
  return (
    <div
      className={`rounded-[1.5rem] bg-white p-6 md:col-span-12 md:p-8 ${styles.ambientShadow}`}
    >
      <div className="mb-6">
        <h2 className="text-xl font-bold tracking-tight text-[#1c1b1b]">
          Organisational Health Pulse
        </h2>
        <p className="mt-1 text-sm text-[#3e4941]">
          Six cultural pillars — current quarter vs previous
        </p>
      </div>

      <div className="flex flex-col gap-8 md:flex-row md:items-center">
        {/* Radar chart */}
        <div className="flex-shrink-0">
          <svg
            viewBox="0 0 400 340"
            className="w-full max-w-xs md:max-w-sm"
            style={{ overflow: "visible" }}
          >
            {/* Grid rings */}
            {gridLevels.map((level) => (
              <polygon
                key={level}
                points={gridPoly(level)}
                fill="none"
                stroke="#f0edec"
                strokeWidth="1"
              />
            ))}

            {/* Grid level labels */}
            {gridLevels.filter((l) => l < 100).map((level) => {
              const [x, y] = point(0, level);
              return (
                <text key={level} x={x + 4} y={y} fontSize="8" fill="#b8b3b1">
                  {level}
                </text>
              );
            })}

            {/* Axis lines */}
            {pillars.map((_, i) => {
              const [ax, ay] = axisEnd(i);
              return (
                <line
                  key={i}
                  x1={CX}
                  y1={CY}
                  x2={ax}
                  y2={ay}
                  stroke="#ebe7e7"
                  strokeWidth="1"
                />
              );
            })}

            {/* Previous quarter ghost */}
            <polygon
              points={prevPoly}
              fill="rgba(200,200,200,0.08)"
              stroke="#d4d0cf"
              strokeWidth="1.5"
              strokeDasharray="4 3"
            />

            {/* Current quarter fill */}
            <polygon
              points={currentPoly}
              fill="rgba(0,104,65,0.12)"
              stroke="#006841"
              strokeWidth="2"
            />

            {/* Vertex dots + score labels */}
            {pillars.map((p, i) => {
              const [px, py] = point(i, p.score);
              return (
                <g key={i}>
                  <circle cx={px} cy={py} r="4" fill="#006841" />
                  <circle cx={px} cy={py} r="2" fill="white" />
                </g>
              );
            })}

            {/* Axis labels */}
            {pillars.map((p, i) => {
              const lp = labelPos(i);
              return (
                <text
                  key={i}
                  x={lp.x}
                  y={lp.y}
                  textAnchor={lp.anchor}
                  dy={lp.dy}
                  fontSize="10"
                  fontWeight="600"
                  fill="#3e4941"
                >
                  {p.short}
                </text>
              );
            })}

            {/* Score bubbles at vertices */}
            {pillars.map((p, i) => {
              const [px, py] = point(i, p.score);
              const lp = labelPos(i);
              const scoreX =
                i === 0 || i === 3 ? px : i < 3 ? px + 10 : px - 10;
              const scoreY = i === 0 ? py - 12 : i === 3 ? py + 16 : py;
              return (
                <text
                  key={`score-${i}`}
                  x={scoreX}
                  y={scoreY}
                  textAnchor={lp.anchor}
                  fontSize="9"
                  fontWeight="800"
                  fill="#006841"
                >
                  {p.score}
                </text>
              );
            })}

            {/* Legend */}
            <g transform="translate(12, 316)">
              <line x1="0" y1="6" x2="20" y2="6" stroke="#006841" strokeWidth="2" />
              <text x="24" y="10" fontSize="9" fill="#3e4941" fontWeight="600">This quarter</text>
              <line x1="80" y1="6" x2="100" y2="6" stroke="#d4d0cf" strokeWidth="1.5" strokeDasharray="4 3" />
              <text x="104" y="10" fontSize="9" fill="#3e4941" fontWeight="600">Previous quarter</text>
            </g>
          </svg>
        </div>

        {/* Ranked pillar list */}
        <div className="flex-1 space-y-3">
          <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.25em] text-[#3e4941]">
            Pillars — strongest to weakest
          </p>
          {sorted.map((p, rank) => {
            const isWeakest = p.score === weakest;
            const delta = p.score - p.prev;
            return (
              <div
                key={p.label}
                className={`rounded-[1rem] p-4 ${isWeakest ? "bg-amber-50 ring-1 ring-amber-200" : "bg-[#f6f3f2]"}`}
              >
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-4 text-[10px] font-black text-[#3e4941]">
                      {rank + 1}
                    </span>
                    <span
                      className={`text-sm font-bold ${isWeakest ? "text-amber-700" : "text-[#1c1b1b]"}`}
                    >
                      {p.label}
                    </span>
                    {isWeakest && (
                      <span className="rounded-full bg-amber-200 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.15em] text-amber-800">
                        Focus Area
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold ${delta >= 0 ? "text-emerald-600" : "text-red-500"}`}
                    >
                      {delta >= 0 ? "▲" : "▼"} {Math.abs(delta)}
                    </span>
                    <span className="text-base font-black text-[#006841]">
                      {p.score}
                    </span>
                  </div>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-[#e5e2e1]">
                  <div
                    className={`h-full rounded-full ${isWeakest ? "bg-amber-400" : "bg-[#006841]"}`}
                    style={{ width: `${p.score}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
