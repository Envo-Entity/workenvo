"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import BrandLogo from "@/components/BrandLogo";
import DashboardIcon from "./dashboard-icon";
import styles from "../dashboard.module.css";

const navItems = [
  { label: "Culture", icon: "groups", fill: true, href: "/dashboard/envo-culture" },
  { label: "Performance", icon: "analytics", href: "/dashboard/envo-performance" },
  { label: "Sustainability", icon: "eco", href: "/dashboard/envo-sustainability" },
  { label: "Employees", icon: "person", href: "/dashboard/envo-employees" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-64 flex-col gap-8 bg-[#f6f3f2] p-6 md:flex">
      <div className="flex items-center gap-3 px-4 py-2">
        <BrandLogo
          logoHeightClassName="h-9"
          textClassName="text-[1.65rem] tracking-[-0.04em]"
        />
      </div>

      <nav className="flex flex-1 flex-col gap-2">
        <p className="mb-2 px-4 text-[10px] font-bold uppercase tracking-[0.25em] text-[#3e4941]">
          Main Menu
        </p>
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.label}
              href={item.href}
              className={
                isActive
                  ? "flex items-center gap-4 rounded-[2rem] bg-[#008454] px-3.5 py-3 font-semibold text-[#ecfff0] transition-all active:scale-95"
                  : "flex items-center gap-4 rounded-[2rem] px-3.5 py-3 text-stone-600 transition-all hover:text-emerald-600"
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
