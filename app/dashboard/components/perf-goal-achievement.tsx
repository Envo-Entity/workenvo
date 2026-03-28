import styles from "../dashboard.module.css";

const departments = [
  { name: "HR", pct: 92 },
  { name: "Finance", pct: 88 },
  { name: "Engineering", pct: 84 },
  { name: "Customer Success", pct: 83 },
  { name: "Product", pct: 79 },
  { name: "Operations", pct: 67 },
  { name: "Sales", pct: 71 },
  { name: "Marketing", pct: 58 },
];

const ORG_AVG = 78;

function barColor(pct: number) {
  if (pct >= 80) return "bg-[#006841]";
  if (pct >= 60) return "bg-[#008454]";
  return "bg-amber-500";
}

// Sort descending for readability
const sorted = [...departments].sort((a, b) => b.pct - a.pct);

export default function PerfGoalAchievement() {
  return (
    <div
      className={`flex flex-col rounded-[1.5rem] bg-white p-6 md:col-span-6 md:p-8 ${styles.ambientShadow}`}
    >
      <div className="mb-8">
        <h2 className="text-xl font-bold tracking-tight text-[#1c1b1b]">
          Goal Achievement by Department
        </h2>
        <p className="mt-1 text-sm text-[#3e4941]">
          Achievement rate — Q4 2024
        </p>
      </div>

      <div className="relative flex-1 space-y-3">
        {sorted.map((dept) => (
          <div key={dept.name} className="flex items-center gap-3">
            <span className="w-32 flex-shrink-0 text-xs font-semibold text-[#3e4941]">
              {dept.name}
            </span>
            <div className="relative flex-1">
              {/* Avg dashed line */}
              <div
                className="absolute top-0 z-10 h-full w-px border-l border-dashed border-[#006841]/40"
                style={{ left: `${ORG_AVG}%` }}
              />
              <div className="h-7 w-full overflow-hidden rounded-full bg-[#f6f3f2]">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${barColor(dept.pct)}`}
                  style={{ width: `${dept.pct}%` }}
                />
              </div>
            </div>
            <span className="w-10 flex-shrink-0 text-right text-xs font-bold text-[#1c1b1b]">
              {dept.pct}%
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-2 rounded-[1rem] bg-[#f6f3f2] px-4 py-3">
        <div className="h-px w-6 border-t border-dashed border-[#006841]/60" />
        <p className="text-xs font-semibold text-[#3e4941]">
          Org-wide average — {ORG_AVG}%
        </p>
      </div>
    </div>
  );
}
