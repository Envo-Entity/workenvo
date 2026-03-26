import DashboardIcon from "./dashboard-icon";
import styles from "../dashboard.module.css";

const items = [
  { label: "Home", icon: "dashboard", active: true, fill: true },
  { label: "Insights", icon: "analytics" },
  { label: "Teams", icon: "groups" },
  { label: "Profile", icon: "person" },
];

export default function MobileNav() {
  return (
    <div
      className={`fixed right-0 bottom-0 left-0 z-50 flex items-center justify-around border-t border-stone-100 bg-white/80 px-6 py-4 md:hidden ${styles.glassNav}`}
    >
      {items.map((item) => (
        <button
          key={item.label}
          className={`flex flex-col items-center gap-1 ${item.active ? "text-[#006841]" : "text-stone-400"}`}
        >
          <DashboardIcon
            name={item.icon}
            fill={item.fill}
            className="text-[24px]"
          />
          <span className="text-[10px] font-bold">{item.label}</span>
        </button>
      ))}
    </div>
  );
}
