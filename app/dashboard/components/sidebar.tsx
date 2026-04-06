"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import BrandLogo from "@/components/BrandLogo";
import DashboardIcon from "./dashboard-icon";
import styles from "../dashboard.module.css";
import { SettingsIcon } from "lucide-react";

const navGroups = [
  {
    label: "INSIGHTS",
    items: [
      { label: "Culture", icon: "groups", fill: true, href: "/dashboard/envo-culture" },
      { label: "Performance", icon: "analytics", href: "/dashboard/envo-performance" },
      { label: "Sustainability", icon: "eco", href: "/dashboard/envo-sustainability" },
    ],
  },
  {
    label: "CONFIGURE",
    items: [
      { label: "Sentiment", icon: "heart", href: "/dashboard/envo-sentiment" },
      { label: "Signals Setup", icon: "tune", href: "/dashboard/envo-signals-setup" },
      { label: "Survey Builder", icon: "assignment", href: "/dashboard/envo-survey-builder" },
    ],
  },
  {
    label: "MANAGE",
    items: [
      { label: "Employees", icon: "person", href: "/dashboard/envo-employees" },
      { label: "Reports", icon: "assessment", href: "/dashboard/envo-reports" },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-64 flex-col bg-[#f6f3f2] p-6 md:flex">
      <div className="flex items-center gap-3 px-4 py-2 mb-4">
        <BrandLogo
          logoHeightClassName="h-9"
          textClassName="text-[1.65rem] tracking-[-0.04em]"
        />
      </div>

      <nav className="flex-1 overflow-y-auto space-y-6 pb-4">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="mb-2 px-4 text-[10px] font-bold uppercase tracking-[0.25em] text-[#2D2D2D]/50">
              {group.label}
            </p>
            <div className="flex flex-col gap-1">
              {group.items.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={
                      isActive
                        ? "flex items-center gap-4 rounded-[2rem] bg-[#1B4332] px-3.5 py-3 font-semibold text-white transition-all active:scale-95"
                        : "flex items-center gap-4 rounded-[2rem] px-3.5 py-3 text-stone-600 transition-all hover:bg-[#1B4332]/10 hover:text-emerald-800"
                    }
                  >
                    <DashboardIcon
                      name={item.icon}
                      fill={item.fill}
                      className="text-[24px]"
                    />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="mt-auto space-y-4">
        <Link 
          href="/dashboard/envo-settings" 
          className={
            pathname.startsWith("/dashboard/envo-settings")
              ? "flex w-full items-center justify-center gap-2 rounded-[2rem] bg-[#1B4332] px-4 py-3 text-sm font-semibold text-white transition-all active:scale-95 shadow-md"
              : "flex w-full items-center justify-center gap-2 rounded-[2rem] bg-[#ffffff] border border-[#e5e2e1] px-4 py-3 text-sm font-semibold text-stone-600 transition-all hover:border-[#1B4332]/30 hover:bg-[#fcfbfb] hover:text-[#1B4332] shadow-sm"
          }
        >
          <SettingsIcon className="text-[20px]" />
          Settings
        </Link>

        <button className="flex w-full items-center justify-center gap-2 rounded-[2rem] bg-[#1B4332]/10 px-4 py-3 text-sm font-semibold text-[#1B4332] transition-all hover:bg-[#1B4332]/15">
          <DashboardIcon name="download" className="text-[20px]" />
          Export Insights
        </button>

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
      </div>
    </aside>
  );
}
