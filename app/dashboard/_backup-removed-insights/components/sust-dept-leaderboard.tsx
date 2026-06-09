import Link from "next/link";
import styles from "../dashboard.module.css";
import { getTeamHrefByName } from "./drilldown-data";

type DeptRow = {
  rank: number;
  name: string;
  emissionsSaved: number;
  participationRate: number;
  adoptionScore: number;
  sparkline: number[];
  trend: "up" | "flat" | "down";
};

const departments: DeptRow[] = [
  { rank: 1, name: "Engineering", emissionsSaved: 42.3, participationRate: 84, adoptionScore: 91, sparkline: [78, 84, 91], trend: "up" },
  { rank: 2, name: "Product", emissionsSaved: 38.7, participationRate: 79, adoptionScore: 87, sparkline: [74, 80, 87], trend: "up" },
  { rank: 3, name: "Human Resources", emissionsSaved: 31.2, participationRate: 91, adoptionScore: 85, sparkline: [80, 82, 85], trend: "up" },
  { rank: 4, name: "Operations", emissionsSaved: 28.5, participationRate: 73, adoptionScore: 78, sparkline: [76, 78, 78], trend: "flat" },
  { rank: 5, name: "Marketing", emissionsSaved: 22.1, participationRate: 65, adoptionScore: 71, sparkline: [74, 72, 71], trend: "down" },
  { rank: 6, name: "Sales", emissionsSaved: 18.4, participationRate: 58, adoptionScore: 62, sparkline: [68, 64, 62], trend: "down" },
];

function MiniSparkline({ data, trend }: { data: number[]; trend: "up" | "flat" | "down" }) {
  const W = 52;
  const H = 20;
  const max = Math.max(...data) + 2;
  const min = Math.min(...data) - 2;
  const pts: [number, number][] = data.map((v, i) => [
    (i / (data.length - 1)) * W,
    H - ((v - min) / (max - min)) * (H - 4) - 2,
  ]);
  const d = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
  const color = trend === "up" ? "#006841" : trend === "down" ? "#d97706" : "#94a3b8";
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
      <path d={d} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="2" fill={color} />)}
    </svg>
  );
}

const trendIcon = { up: "▲", flat: "→", down: "▼" };
const trendColor = { up: "text-emerald-600", flat: "text-stone-400", down: "text-amber-600" };

export default function SustDeptLeaderboard() {
  return (
    <div
      className={`rounded-[1.5rem] bg-white p-6 md:col-span-12 md:p-8 ${styles.ambientShadow}`}
    >
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#1c1b1b]">
            Department Sustainability Leaderboard
          </h2>
          <p className="mt-1 text-sm text-[#3e4941]">
            Ranked by combined impact and participation
          </p>
        </div>
        <span className="rounded-full bg-[#006841]/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#006841]">
          Q4 2024
        </span>
      </div>

      {/* Column headers */}
      <div className="mb-3 hidden grid-cols-[2.5rem_1fr_7rem_9rem_6rem_4rem] gap-4 px-5 md:grid">
        {["Rank", "Department", "Emissions Saved", "Participation Rate", "Adoption Score", "Trend"].map((h) => (
          <p key={h} className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#3e4941]">
            {h}
          </p>
        ))}
      </div>

      <div className="space-y-3">
        {departments.map((dept) => (
          <div
            key={dept.rank}
            className={`grid grid-cols-[2.5rem_1fr] gap-4 rounded-[1rem] px-5 py-4 md:grid-cols-[2.5rem_1fr_7rem_9rem_6rem_4rem] ${
              dept.rank === 1 ? "bg-amber-50 ring-1 ring-amber-200" : "bg-[#f6f3f2]"
            }`}
          >
            {/* Rank */}
            <div
              className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-black ${
                dept.rank === 1 ? "bg-amber-400 text-white" : "bg-[#e5e2e1] text-[#3e4941]"
              }`}
            >
              {dept.rank}
            </div>

            {/* Name */}
            {getTeamHrefByName(dept.name) ? (
              <Link
                href={getTeamHrefByName(dept.name)!}
                className="self-center font-bold text-[#1c1b1b] transition-colors hover:text-[#006841]"
              >
                {dept.name}
              </Link>
            ) : (
              <p className="self-center font-bold text-[#1c1b1b]">{dept.name}</p>
            )}

            {/* Emissions saved */}
            <p className="hidden self-center text-sm font-bold text-[#006841] md:block">
              {dept.emissionsSaved} t
            </p>

            {/* Participation rate */}
            <div className="hidden self-center md:block">
              <div className="mb-1 flex justify-between text-xs">
                <span className="font-bold text-[#1c1b1b]">{dept.participationRate}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#e5e2e1]">
                <div
                  className="h-full rounded-full bg-[#006841]"
                  style={{ width: `${dept.participationRate}%` }}
                />
              </div>
            </div>

            {/* Adoption score */}
            <p className="hidden self-center text-sm font-bold text-[#1c1b1b] md:block">
              {dept.adoptionScore}
            </p>

            {/* Trend sparkline + arrow */}
            <div className="hidden items-center gap-1.5 md:flex">
              <MiniSparkline data={dept.sparkline} trend={dept.trend} />
              <span className={`text-[10px] font-black ${trendColor[dept.trend]}`}>
                {trendIcon[dept.trend]}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
