import styles from "../dashboard.module.css";

const departments = [
  { name: "HR", motivated: 81, demotivated: 8 },
  { name: "Cust. Success", motivated: 74, demotivated: 12 },
  { name: "Engineering", motivated: 72, demotivated: 18 },
  { name: "Product", motivated: 69, demotivated: 22 },
  { name: "Finance", motivated: 67, demotivated: 15 },
  { name: "Operations", motivated: 58, demotivated: 25 },
  { name: "Marketing", motivated: 55, demotivated: 28 },
  { name: "Sales", motivated: 48, demotivated: 32 },
];

// Sorted by motivated descending
const sorted = [...departments].sort((a, b) => b.motivated - a.motivated);

// Max value for scaling (cap at 90 so bars don't overflow)
const MAX = 90;

export default function CultMotivationIndex() {
  return (
    <div
      className={`flex flex-col rounded-[1.5rem] bg-white p-6 md:col-span-6 md:p-8 ${styles.ambientShadow}`}
    >
      <div className="mb-8">
        <h2 className="text-xl font-bold tracking-tight text-[#1c1b1b]">
          Motivation & Drive Index
        </h2>
        <p className="mt-1 text-sm text-[#3e4941]">
          Motivated vs demotivated % — by department
        </p>
      </div>

      {/* Legend */}
      <div className="mb-5 flex gap-6">
        <div className="flex items-center gap-2">
          <div className="h-3 w-6 rounded-full bg-[#006841]" />
          <span className="text-xs font-semibold text-[#3e4941]">Motivated</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-6 rounded-full bg-[#fed7aa]" />
          <span className="text-xs font-semibold text-[#3e4941]">Demotivated</span>
        </div>
      </div>

      {/* Diverging bar chart */}
      <div className="space-y-3">
        {sorted.map((dept) => {
          const motivatedW = (dept.motivated / MAX) * 50; // % of half-width
          const demotivatedW = (dept.demotivated / MAX) * 50;
          return (
            <div key={dept.name} className="flex items-center gap-0">
              {/* Dept label */}
              <span className="w-24 flex-shrink-0 text-xs font-semibold text-[#3e4941]">
                {dept.name}
              </span>

              {/* Left side — demotivated (extends left from center) */}
              <div className="relative flex flex-1 items-center">
                {/* Center line */}
                <div className="absolute inset-y-0 left-1/2 w-px bg-[#e5e2e1]" />

                {/* Full left half */}
                <div className="flex h-7 w-1/2 items-center justify-end pr-1">
                  <div
                    className="h-full rounded-l-full bg-[#fed7aa]"
                    style={{ width: `${demotivatedW * 2}%` }}
                  />
                </div>

                {/* Full right half */}
                <div className="flex h-7 w-1/2 items-center pl-1">
                  <div
                    className="h-full rounded-r-full bg-[#006841]"
                    style={{ width: `${motivatedW * 2}%` }}
                  />
                </div>
              </div>

              {/* Values */}
              <div className="ml-2 flex w-20 flex-shrink-0 justify-between text-[10px] font-bold">
                <span className="text-amber-600">{dept.demotivated}%</span>
                <span className="text-[#006841]">{dept.motivated}%</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Insight callout */}
      <div className="mt-6 rounded-[1rem] bg-amber-50 p-4 ring-1 ring-amber-200">
        <p className="text-xs font-semibold text-amber-800">
          Sales shows the highest polarisation — 48% motivated alongside 32% demotivated.
          Signals structural misalignment, not a morale issue.
        </p>
      </div>
    </div>
  );
}
