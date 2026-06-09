const actions = [
  { label: "Cycle to work", count: 342 },
  { label: "Meatless Monday pledge", count: 287 },
  { label: "Reusable cup logged", count: 264 },
  { label: "Energy audit completed", count: 198 },
  { label: "Public transport commute", count: 156 },
];

const MAX_COUNT = actions[0].count;

export default function SustPopularActions() {
  return (
    <div
      className={`flex flex-col rounded-[1.5rem] bg-[#f6f3f2] p-6 md:col-span-6 md:p-8`}
    >
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#1c1b1b]">
            Most Popular Actions
          </h2>
          <p className="mt-1 text-sm text-[#3e4941]">
            Top 5 sustainability behaviours logged
          </p>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-[#006841]/10 px-3 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[#006841]" />
          <span className="text-[10px] font-bold text-[#006841]">Last 30 days</span>
        </div>
      </div>

      <div className="flex-1 space-y-4">
        {actions.map((action, i) => (
          <div key={action.label} className="flex items-center gap-3">
            <span className="w-4 flex-shrink-0 text-[10px] font-black text-[#3e4941]">
              {i + 1}
            </span>
            <div className="flex-1">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-sm font-semibold text-[#1c1b1b]">{action.label}</span>
                <span className="text-xs font-bold text-[#006841]">{action.count}</span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#e5e2e1]">
                <div
                  className="h-full rounded-full bg-[#006841] transition-all"
                  style={{ width: `${(action.count / MAX_COUNT) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-[1rem] bg-[#72dba3]/20 px-4 py-3">
        <p className="text-xs font-semibold text-[#006841]">
          342 employees cycled to work this month — highest participation in org history.
        </p>
      </div>
    </div>
  );
}
