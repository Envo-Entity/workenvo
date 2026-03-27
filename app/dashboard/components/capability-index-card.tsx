import styles from "../dashboard.module.css";

const bars = [
  "h-[40%] bg-[#006841]/10",
  "h-[55%] bg-[#006841]/20",
  "h-[45%] bg-[#006841]/30",
  "h-[70%] bg-[#006841]/40",
  "h-[65%] bg-[#006841]/50",
  "h-[85%] bg-[#006841]/60",
  "h-[95%] bg-[#008454]",
  "h-[90%] bg-[#008454]",
  "h-[75%] bg-[#006841]/60",
  "h-[60%] bg-[#006841]/40",
];

const metrics = [
  { label: "Tech Stack", value: "High" },
  { label: "Soft Skills", value: "Emerging" },
  { label: "Resilience", value: "Stable" },
  { label: "Agility", value: "Peak" },
];

export default function CapabilityIndexCard() {
  return (
    <div
      className={`flex flex-col justify-between rounded-[1.5rem] bg-[#ffffff] p-6 md:col-span-8 md:p-8 ${styles.ambientShadow}`}
    >
      <div className="mb-12 flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#1c1b1b]">
            Capability Index
          </h2>
          <p className="mt-1 text-sm text-[#3e4941]">
            Real-time aggregate of workforce skill velocity
          </p>
        </div>
        <div className="text-right">
          <span className="text-3xl font-black text-[#006841]">84.2</span>
          <p className="text-[10px] font-bold text-emerald-600">
            +12% vs last month
          </p>
        </div>
      </div>

      <div className="relative flex h-52 w-full items-end gap-2 overflow-hidden rounded-[1rem]">
        {bars.map((bar, index) => (
          <div key={index} className={`flex-1 rounded-t-full ${bar}`} />
        ))}
      </div>

      <div className="mt-8 grid grid-cols-4 border-t border-[#f0edec] pt-8">
        {metrics.map((metric) => (
          <div key={metric.label}>
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#3e4941]">
              {metric.label}
            </p>
            <p className="text-lg font-bold text-[#1c1b1b]">{metric.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
