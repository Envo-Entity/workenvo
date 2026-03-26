import DashboardIcon from "./dashboard-icon";
import styles from "../dashboard.module.css";

const metrics = [
  {
    label: "Diversity & Inclusion",
    value: "78%",
    width: "w-[78%]",
    barClass: "bg-[#006841]",
  },
  {
    label: "Wellness Score",
    value: "62%",
    width: "w-[62%]",
    barClass: "bg-[#008454]",
  },
  {
    label: "Ethical Alignment",
    value: "94%",
    width: "w-[94%]",
    barClass: "bg-[#006d3e]",
  },
];

export default function ESGMetricsCard() {
  return (
    <div
      className={`flex flex-col justify-between rounded-[3rem] bg-[#ffffff] p-8 md:col-span-5 ${styles.ambientShadow}`}
    >
      <div className="flex items-start justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-[#1c1b1b]">
          ESG Metrics
        </h2>
        <DashboardIcon name="eco" className="text-[24px] text-[#006841]" />
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

      <div className="rounded-[2rem] border border-[#72dba3]/30 bg-[#72dba3]/20 p-4">
        <p className="text-xs font-semibold text-[#006841]">
          Your organization is in the top 5% for ethical governance in the SaaS
          sector.
        </p>
      </div>
    </div>
  );
}
