import styles from "../dashboard.module.css";

type Leader = {
  rank: number;
  name: string;
  department: string;
  points: number;
  avatarColor: string;
  sparkline: number[]; // last 3 months relative values
  earnedFrom: string;
};

const leaders: Leader[] = [
  {
    rank: 1,
    name: "Priya Sharma",
    department: "Human Resources",
    points: 2840,
    avatarColor: "#006841",
    sparkline: [720, 980, 1140],
    earnedFrom: "Goal completion, Appraisal rating",
  },
  {
    rank: 2,
    name: "Derek Huang",
    department: "Engineering",
    points: 2310,
    avatarColor: "#027a48",
    sparkline: [600, 820, 890],
    earnedFrom: "Peer recognition, Goal completion",
  },
  {
    rank: 3,
    name: "Sofia Martinez",
    department: "Analytics",
    points: 2180,
    avatarColor: "#6941c6",
    sparkline: [680, 740, 760],
    earnedFrom: "Appraisal rating, CPD completion",
  },
  {
    rank: 4,
    name: "Marcus Webb",
    department: "Engineering",
    points: 1950,
    avatarColor: "#4338ca",
    sparkline: [580, 690, 680],
    earnedFrom: "Project milestone, Peer recognition",
  },
  {
    rank: 5,
    name: "James Okafor",
    department: "Sales",
    points: 1820,
    avatarColor: "#c4320a",
    sparkline: [540, 620, 660],
    earnedFrom: "Sales target, Goal completion",
  },
];

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("");
}

function Sparkline({ values, color }: { values: number[]; color: string }) {
  const max = Math.max(...values);
  const min = Math.min(...values) * 0.9;
  const W = 52;
  const H = 20;
  const pts: [number, number][] = values.map((v, i) => [
    (i / (values.length - 1)) * W,
    H - ((v - min) / (max - min)) * H,
  ]);
  const d = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]} ${p[1]}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ overflow: "visible" }}>
      <path d={d} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.5" fill={color} />
      ))}
    </svg>
  );
}

export default function PerfRewardLeaderboard() {
  return (
    <div
      className={`rounded-[1.5rem] bg-white p-6 md:col-span-12 md:p-8 ${styles.ambientShadow}`}
    >
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#1c1b1b]">
            Reward Points Leaderboard
          </h2>
          <p className="mt-1 text-sm text-[#3e4941]">
            Top performers by points earned — Q4 2024
          </p>
        </div>
        <button className="rounded-full bg-[#f6f3f2] px-4 py-2 text-xs font-semibold text-[#006841] transition-all hover:bg-[#ebe7e7]">
          View All
        </button>
      </div>

      <div className="space-y-3">
        {leaders.map((leader) => (
          <div
            key={leader.rank}
            className={`flex items-center gap-4 rounded-[1rem] px-5 py-4 ${
              leader.rank === 1 ? "bg-amber-50 ring-1 ring-amber-200" : "bg-[#f6f3f2]"
            }`}
          >
            {/* Rank */}
            <div
              className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-black ${
                leader.rank === 1
                  ? "bg-amber-400 text-white"
                  : "bg-[#e5e2e1] text-[#3e4941]"
              }`}
            >
              {leader.rank}
            </div>

            {/* Avatar */}
            <div
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-black text-white"
              style={{ backgroundColor: leader.avatarColor }}
            >
              {getInitials(leader.name)}
            </div>

            {/* Name + dept */}
            <div className="flex-1">
              <p className="font-bold text-[#1c1b1b]">{leader.name}</p>
              <p className="text-xs text-[#3e4941]">{leader.department}</p>
            </div>

            {/* Earned from */}
            <div className="hidden flex-1 md:block">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#3e4941]">
                Earned from
              </p>
              <p className="text-xs text-[#1c1b1b]">{leader.earnedFrom}</p>
            </div>

            {/* Sparkline */}
            <div className="hidden md:block">
              <Sparkline values={leader.sparkline} color={leader.avatarColor} />
            </div>

            {/* Points */}
            <div className="text-right">
              <p
                className={`text-xl font-black ${
                  leader.rank === 1 ? "text-amber-600" : "text-[#006841]"
                }`}
              >
                {leader.points.toLocaleString()}
              </p>
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#3e4941]">
                pts
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
