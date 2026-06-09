import styles from "../dashboard.module.css";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];

const categories = [
  {
    label: "Regenerative Actions",
    color: "#1B4332",
    data: [8.2, 9.1, 10.3, 11.5, 12.8, 14.2, 15.1, 16.3],
  },
  {
    label: "Waste Reduction",
    color: "#2D6A4F",
    data: [5.1, 5.8, 6.4, 7.2, 7.8, 8.5, 9.2, 9.8],
  },
  {
    label: "Low-Carbon Living",
    color: "#74C69D",
    data: [3.2, 3.8, 4.5, 5.1, 5.8, 6.4, 7.1, 7.8],
  },
];

// SVG geometry
const VW = 520;
const VH = 210;
const PAD = { top: 20, right: 16, bottom: 44, left: 32 };
const chartW = VW - PAD.left - PAD.right;
const chartH = VH - PAD.top - PAD.bottom;
const MAX_VAL = 20;

const N = months.length;
const GROUP_W = chartW / N;
const BAR_W = 10;
const BAR_GAP = 3;
const GROUP_CONTENT = categories.length * BAR_W + (categories.length - 1) * BAR_GAP;
const SIDE_PAD = (GROUP_W - GROUP_CONTENT) / 2;

function barX(monthIdx: number, catIdx: number) {
  return PAD.left + monthIdx * GROUP_W + SIDE_PAD + catIdx * (BAR_W + BAR_GAP);
}

function barY(val: number) {
  return PAD.top + chartH - (val / MAX_VAL) * chartH;
}

function barH(val: number) {
  return (val / MAX_VAL) * chartH;
}

// Reference lines at 5, 10, 15
const refLines = [5, 10, 15];

export default function SustCarbonByCategory() {
  return (
    <div
      className={`flex flex-col rounded-[1.5rem] bg-white p-6 md:col-span-6 md:p-8 ${styles.ambientShadow}`}
    >
      <div className="mb-6">
        <h2 className="text-xl font-bold tracking-tight text-[#1c1b1b]">
          Carbon Emissions Saved
        </h2>
        <p className="mt-1 text-sm text-[#3e4941]">
          Monthly breakdown by action category
        </p>
      </div>

      <svg viewBox={`0 0 ${VW} ${VH}`} className="w-full flex-1" style={{ overflow: "visible" }}>
        {/* Reference lines */}
        {refLines.map((v) => (
          <g key={v}>
            <line
              x1={PAD.left}
              y1={barY(v)}
              x2={PAD.left + chartW}
              y2={barY(v)}
              stroke="#f0edec"
              strokeWidth="1"
            />
            <text x={PAD.left - 4} y={barY(v) + 4} textAnchor="end" fontSize="8" fill="#b8b3b1">
              {v}t
            </text>
          </g>
        ))}

        {/* Bars */}
        {months.map((_, mi) => {
          const groupTotal = categories.reduce((s, c) => s + c.data[mi], 0);
          const totalY = barY(groupTotal) - 6;
          return (
            <g key={mi}>
              {categories.map((cat, ci) => {
                const x = barX(mi, ci);
                const val = cat.data[mi];
                const h = barH(val);
                const y = barY(val);
                return (
                  <rect
                    key={ci}
                    x={x}
                    y={y}
                    width={BAR_W}
                    height={h}
                    fill={cat.color}
                    rx="2"
                  />
                );
              })}
              {/* Total label above group */}
              <text
                x={PAD.left + mi * GROUP_W + GROUP_W / 2}
                y={totalY}
                textAnchor="middle"
                fontSize="8"
                fontWeight="700"
                fill="#3e4941"
              >
                {groupTotal.toFixed(1)}t
              </text>
            </g>
          );
        })}

        {/* X axis labels */}
        {months.map((m, mi) => (
          <text
            key={m}
            x={PAD.left + mi * GROUP_W + GROUP_W / 2}
            y={VH - 4}
            textAnchor="middle"
            fontSize="10"
            fontWeight="600"
            fill="#3e4941"
          >
            {m}
          </text>
        ))}
      </svg>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4">
        {categories.map((cat) => (
          <div key={cat.label} className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
            <span className="text-xs font-semibold text-[#3e4941]">{cat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
