import DashboardIcon from "./dashboard-icon";

const signals = [
  {
    title: "Burnout Risk: Engineering",
    description: "High frequency of after-hours communication",
    icon: "warning",
    iconWrapClass: "bg-[#ffdad6]/30 text-[#ba1a1a]",
    badgeClass: "bg-[#ffdad6] text-[#93000a]",
    badge: "ACTION REQUIRED",
  },
  {
    title: "Engagement Drops: Sales",
    description: "Meeting participation rates down 22%",
    icon: "trending_down",
    iconWrapClass: "bg-[#006841]/10 text-[#006841]",
    badgeClass: "bg-[#e5e2e1] text-[#3e4941]",
    badge: "MONITORING",
  },
];

export default function BehaviouralSignalsCard() {
  return (
    <div className="space-y-6 rounded-[1.5rem] bg-[#f6f3f2] p-6 md:col-span-7">
      <h2 className="text-xl font-bold tracking-tight text-[#1c1b1b]">
        Real-time Behavioural Signals
      </h2>

      <div className="space-y-4">
        {signals.map((signal) => (
          <div
            key={signal.title}
            className="flex items-center justify-between rounded-[1rem] bg-[#ffffff] p-5"
          >
            <div className="flex items-center gap-4">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full ${signal.iconWrapClass}`}
              >
                <DashboardIcon name={signal.icon} className="text-[24px]" />
              </div>
              <div>
                <p className="font-bold text-[#1c1b1b]">{signal.title}</p>
                <p className="text-xs text-[#3e4941]">{signal.description}</p>
              </div>
            </div>
            <span
              className={`rounded-full px-4 py-2 text-[10px] font-bold ${signal.badgeClass}`}
            >
              {signal.badge}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
