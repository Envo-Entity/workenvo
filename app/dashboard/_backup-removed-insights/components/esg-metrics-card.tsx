import DashboardIcon from "./dashboard-icon";
import styles from "../dashboard.module.css";

type Metric = {
  label: string;
  value: string;
  width: string;
  barClass: string;
};

type ESGMetricsCardProps = {
  title: string;
  icon: string;
  metrics: Metric[];
  callout: string;
};

export default function ESGMetricsCard({
  title,
  icon,
  metrics,
  callout,
}: ESGMetricsCardProps) {
  return (
    <div
      className={`flex flex-col justify-between rounded-[1.5rem] bg-[#ffffff] p-6 md:col-span-5 ${styles.ambientShadow}`}
    >
      <div className="flex items-start justify-between">
        <h2 className="text-xl font-bold tracking-tight text-[#1c1b1b]">
          {title}
        </h2>
        <DashboardIcon name={icon} className="text-[24px] text-[#006841]" />
      </div>

      <div className="space-y-6 py-6">
        {metrics.map((metric) => (
          <div key={metric.label} className="space-y-2">
            <div className="flex justify-between text-xs font-bold uppercase tracking-[0.25em] text-[#3e4941]">
              <span>{metric.label}</span>
              <span>{metric.value}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-[#ebe7e7]">
              <div className={`h-full ${metric.width} ${metric.barClass}`} />
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-[1rem] border border-[#72dba3]/30 bg-[#72dba3]/20 p-4">
        <p className="text-xs font-semibold text-[#006841]">{callout}</p>
      </div>
    </div>
  );
}
