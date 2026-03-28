import styles from "../dashboard.module.css";

const stages = [
  { label: "Not Started", count: 28, color: "bg-[#e5e2e1]", textColor: "text-[#3e4941]", ring: "ring-[#e5e2e1]" },
  { label: "In Progress", count: 63, color: "bg-[#008454]", textColor: "text-white", ring: "ring-[#008454]" },
  { label: "Completed", count: 142, color: "bg-[#006841]", textColor: "text-white", ring: "ring-[#006841]" },
];

const total = 240;
const overdue = 7;
const day = 18;
const cycleLength = 30;
const progressPct = Math.round((day / cycleLength) * 100);

export default function PerfAppraisalTracker() {
  return (
    <div
      className={`flex flex-col rounded-[1.5rem] bg-[#f6f3f2] p-6 md:col-span-6 md:p-8`}
    >
      <div className="mb-8">
        <h2 className="text-xl font-bold tracking-tight text-[#1c1b1b]">
          Appraisal & Review Tracker
        </h2>
        <p className="mt-1 text-sm text-[#3e4941]">
          Current cycle pipeline — {total} reviews total
        </p>
      </div>

      {/* Pipeline */}
      <div className="relative flex items-center justify-between">
        {/* Connecting line */}
        <div className="absolute left-6 right-6 top-6 h-0.5 bg-[#e5e2e1]" />

        {stages.map((stage, i) => (
          <div key={stage.label} className="relative flex flex-col items-center gap-2">
            <div
              className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full ring-4 ${stage.color} ${stage.ring} ${styles.ambientShadow}`}
            >
              <span className={`text-sm font-black ${stage.textColor}`}>
                {stage.count}
              </span>
            </div>
            <span className="text-center text-[10px] font-bold uppercase tracking-[0.15em] text-[#3e4941]">
              {stage.label}
            </span>
          </div>
        ))}

        {/* Overdue node */}
        <div className="relative flex flex-col items-center gap-2">
          <div
            className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-[#ffdad6] ring-4 ring-[#ffdad6] ${styles.ambientShadow}`}
          >
            <span className="text-sm font-black text-[#93000a]">{overdue}</span>
          </div>
          <span className="text-center text-[10px] font-bold uppercase tracking-[0.15em] text-[#93000a]">
            Overdue
          </span>
        </div>
      </div>

      {/* Cycle timeline */}
      <div className="mt-10 space-y-3 rounded-[1rem] bg-white p-5">
        <div className="flex items-center justify-between text-xs font-bold text-[#3e4941]">
          <span className="uppercase tracking-[0.2em]">Review Cycle Progress</span>
          <span className="text-[#006841]">Day {day} of {cycleLength}</span>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#ebe7e7]">
          <div
            className="h-full rounded-full bg-[#006841] transition-all"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-[#3e4941]">
          <span>Oct 1</span>
          <span className="font-semibold text-[#006841]">{progressPct}% of cycle elapsed</span>
          <span>Oct 30</span>
        </div>
      </div>

      {/* Completion rate callout */}
      <div className="mt-4 rounded-[1rem] bg-[#72dba3]/20 px-5 py-4">
        <p className="text-xs font-semibold text-[#006841]">
          59% of reviews completed — on track to close the cycle by deadline.
        </p>
      </div>
    </div>
  );
}
