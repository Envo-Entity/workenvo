/* eslint-disable @next/next/no-img-element */

import DashboardIcon from "./dashboard-icon";
import styles from "../dashboard.module.css";

const navItems = [
  { label: "Dashboard", icon: "dashboard", active: true, fill: true },
  { label: "Insights", icon: "analytics" },
  { label: "Teams", icon: "groups" },
  { label: "ESG Tracking", icon: "verified" },
  { label: "Settings", icon: "settings" },
];

export default function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-72 flex-col gap-8 bg-[#f6f3f2] p-6 md:flex">
      <div className="flex items-center gap-3 px-4 py-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#006841] to-[#008454] text-white">
          <DashboardIcon name="work" fill className="text-[24px]" />
        </div>
        <span className="text-2xl font-bold tracking-tight text-[#006841]">
          Workenvo
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-2">
        <p className="mb-2 px-4 text-[10px] font-bold uppercase tracking-[0.25em] text-[#3e4941]">
          Main Menu
        </p>
        {navItems.map((item) => (
          <a
            key={item.label}
            href="#"
            className={
              item.active
                ? "flex items-center gap-4 rounded-[2rem] bg-[#008454] px-4 py-4 font-semibold text-[#ecfff0] transition-all active:scale-95"
                : "flex items-center gap-4 rounded-[2rem] px-4 py-4 text-stone-600 transition-all hover:text-emerald-600"
            }
          >
            <DashboardIcon
              name={item.icon}
              fill={item.fill}
              className="text-[24px]"
            />
            <span>{item.label}</span>
          </a>
        ))}
      </nav>

      <div className={`flex items-center gap-3 rounded-[2rem] bg-[#e5e2e1] p-4 ${styles.glassNav}`}>
        <div className="h-10 w-10 rounded-full bg-stone-300">
          <img
            alt="Profile"
            className="h-full w-full rounded-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9A36ue4mTCpIwF7EdZZrM0_LHYoRdRRChk_ZhULg8p_LQBPk8N5D--Vexd0l5LtH-fBKezxK31nuOmOjrwolLhudo-e-EsN0m9NYS4Z528eEQAlPQ41SDwU6IaHwaesVe0o0t1m5Px5kunbVZBWIROzbnLAtX-OaH1sWxhKKy-9fAVAhFaThalGGELAU6jZD6YMRuE2n7riKDjPxvIWyq4rhA3miNogy4maqO7cmk7uDIQA-_Yesc_0nOjwxbWrdB-4nmdViJFg"
          />
        </div>
        <div>
          <p className="text-xs font-bold text-[#1c1b1b]">Alex Mercer</p>
          <p className="text-[10px] text-[#3e4941]">Chief HR Officer</p>
        </div>
      </div>
    </aside>
  );
}
