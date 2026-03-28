import DashboardIcon from "./dashboard-icon";

type Signal = {
  title: string;
  description: string;
  icon: string;
  iconWrapClass: string;
  badgeClass: string;
  badge: string;
};

type BehaviouralSignalsCardProps = {
  title: string;
  signals: Signal[];
};

export default function BehaviouralSignalsCard({
  title,
  signals,
}: BehaviouralSignalsCardProps) {
  return (
    <div className="space-y-6 rounded-[1.5rem] bg-[#f6f3f2] p-6 md:col-span-7">
      <h2 className="text-xl font-bold tracking-tight text-[#1c1b1b]">
        {title}
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
