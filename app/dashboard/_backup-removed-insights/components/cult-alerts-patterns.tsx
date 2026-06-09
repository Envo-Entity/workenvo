import styles from "../dashboard.module.css";
import DashboardIcon from "./dashboard-icon";

type Alert = {
  icon: string;
  title: string;
  detail: string;
  tag: string;
  tagStyle: string;
  borderColor: string;
  severity: "red" | "amber" | "green";
};

const alerts: Alert[] = [
  {
    icon: "trending_down",
    title: "Fairness perception declining in Sales team",
    detail:
      "Survey responses on equitable treatment have dropped 18% over 2 review cycles. Correlates with recent promotion decisions.",
    tag: "RISK ESCALATING",
    tagStyle: "bg-[#ffdad6] text-[#93000a]",
    borderColor: "#fca5a5",
    severity: "red",
  },
  {
    icon: "warning",
    title: "Burnout signals — consecutive high-risk Wednesdays",
    detail:
      "Mid-week burnout intensity has exceeded 70/100 for 6 consecutive weeks. Likely driven by recurring sprint review cadence.",
    tag: "PATTERN DETECTED",
    tagStyle: "bg-amber-100 text-amber-800",
    borderColor: "#fcd34d",
    severity: "amber",
  },
  {
    icon: "verified",
    title: "Peer recognition up 22% in Engineering",
    detail:
      "Following the launch of the weekly peer shoutout channel, Engineering logged 47 recognitions this month — highest team on record.",
    tag: "POSITIVE TREND",
    tagStyle: "bg-[#dcfce7] text-[#166534]",
    borderColor: "#86efac",
    severity: "green",
  },
];

export default function CultAlertsPatterns() {
  return (
    <div
      className={`rounded-[1.5rem] bg-white p-6 md:col-span-12 md:p-8 ${styles.ambientShadow}`}
    >
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#1c1b1b]">
            Culture Alerts &amp; Patterns
          </h2>
          <p className="mt-1 text-sm text-[#3e4941]">
            AI-detected cultural signals — ranked by urgency
          </p>
        </div>
        <button className="rounded-full bg-[#f6f3f2] px-4 py-2 text-xs font-semibold text-[#006841] transition-all hover:bg-[#ebe7e7]">
          View all patterns →
        </button>
      </div>

      <div className="space-y-4">
        {alerts.map((alert) => (
          <div
            key={alert.title}
            className="flex gap-4 overflow-hidden rounded-[1rem] bg-[#f6f3f2]"
            style={{ borderLeft: `4px solid ${alert.borderColor}` }}
          >
            {/* Icon */}
            <div className="flex flex-shrink-0 items-start px-4 pt-5">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  alert.severity === "red"
                    ? "bg-[#ffdad6]/50 text-[#ba1a1a]"
                    : alert.severity === "amber"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-[#006841]/10 text-[#006841]"
                }`}
              >
                <DashboardIcon name={alert.icon} className="text-[22px]" />
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col justify-between gap-3 py-5 pr-5">
              <div>
                <p className="font-bold text-[#1c1b1b]">{alert.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-[#3e4941]">
                  {alert.detail}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <span className={`rounded-full px-3 py-1 text-[10px] font-bold ${alert.tagStyle}`}>
                  {alert.tag}
                </span>
                <button className="text-xs font-bold text-[#006841] transition-all hover:underline">
                  Investigate →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
