import styles from "../dashboard.module.css";

type Metric = { label: string; value: string };

type CapabilityIndexCardProps = {
  title: string;
  subtitle: string;
  score: string;
  trend: string;
  trendPositive: boolean;
  bars: string[];
  metrics: Metric[];
};

export default function CapabilityIndexCard({
  title,
  subtitle,
  score,
  trend,
  trendPositive,
  bars,
  metrics,
}: CapabilityIndexCardProps) {
  return (
    <div
      className={`flex flex-col justify-between rounded-[1.5rem] bg-[#ffffff] p-6 md:col-span-8 md:p-8 ${styles.ambientShadow}`}
    >
      <div className="mb-12 flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#1c1b1b]">
            {title}
          </h2>
          <p className="mt-1 text-sm text-[#3e4941]">{subtitle}</p>
        </div>
        <div className="text-right">
          <span className="text-3xl font-black text-[#006841]">{score}</span>
          <p
            className={`text-[10px] font-bold ${trendPositive ? "text-emerald-600" : "text-red-500"}`}
          >
            {trend}
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
