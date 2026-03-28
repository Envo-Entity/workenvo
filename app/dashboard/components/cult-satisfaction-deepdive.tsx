import styles from "../dashboard.module.css";

const metrics = [
  {
    name: "Perceived Fairness",
    score: 71,
    benchmark: "12% above industry median",
    onTarget: true,
  },
  {
    name: "Recognition & Appreciation",
    score: 64,
    benchmark: "8% below your target",
    onTarget: false,
  },
  {
    name: "Growth Opportunities",
    score: 78,
    benchmark: "15% above industry median",
    onTarget: true,
  },
  {
    name: "Work-Life Harmony",
    score: 58,
    benchmark: "5% below your target",
    onTarget: false,
  },
];

// Circular ring geometry
const R = 38;
const CX = 52;
const CY = 52;
const SW = 12;
const C = 2 * Math.PI * R; // ≈ 238.8

function ringDash(score: number) {
  const fill = (score / 100) * C;
  return `${fill.toFixed(1)} ${(C - fill).toFixed(1)}`;
}

export default function CultSatisfactionDeepdive() {
  return (
    <div
      className={`flex flex-col rounded-[1.5rem] bg-[#f6f3f2] p-6 md:col-span-6 md:p-8`}
    >
      <div className="mb-6">
        <h2 className="text-xl font-bold tracking-tight text-[#1c1b1b]">
          Employee Satisfaction
        </h2>
        <p className="mt-1 text-sm text-[#3e4941]">
          Four satisfaction dimensions vs targets &amp; benchmarks
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {metrics.map((m) => (
          <div
            key={m.name}
            className={`flex flex-col items-center rounded-[1.25rem] p-5 ${
              m.onTarget ? "bg-white" : "bg-white ring-1 ring-amber-200"
            } ${styles.ambientShadow}`}
          >
            {/* Ring */}
            <div className="relative">
              <svg
                viewBox={`0 0 ${CX * 2} ${CY * 2}`}
                width={CX * 2}
                height={CY * 2}
              >
                {/* Track */}
                <circle
                  cx={CX}
                  cy={CY}
                  r={R}
                  fill="none"
                  stroke="#ebe7e7"
                  strokeWidth={SW}
                />
                {/* Fill */}
                <circle
                  cx={CX}
                  cy={CY}
                  r={R}
                  fill="none"
                  stroke={m.onTarget ? "#006841" : "#f59e0b"}
                  strokeWidth={SW}
                  strokeDasharray={ringDash(m.score)}
                  strokeLinecap="round"
                  transform={`rotate(-90 ${CX} ${CY})`}
                />
                {/* Score text */}
                <text
                  x={CX}
                  y={CY - 4}
                  textAnchor="middle"
                  fontSize="16"
                  fontWeight="900"
                  fill={m.onTarget ? "#006841" : "#d97706"}
                >
                  {m.score}
                </text>
                <text
                  x={CX}
                  y={CY + 12}
                  textAnchor="middle"
                  fontSize="8"
                  fontWeight="600"
                  fill="#3e4941"
                >
                  / 100
                </text>
              </svg>
            </div>

            {/* Label */}
            <p className="mt-2 text-center text-xs font-bold text-[#1c1b1b]">
              {m.name}
            </p>

            {/* Benchmark */}
            <p
              className={`mt-1 text-center text-[10px] font-semibold ${
                m.onTarget ? "text-emerald-600" : "text-amber-600"
              }`}
            >
              {m.onTarget ? "↑" : "↓"} {m.benchmark}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
