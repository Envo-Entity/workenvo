"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import BrandLogo from "@/components/BrandLogo";
import DashboardIcon from "@/app/dashboard/_backup-removed-insights/components/dashboard-icon";
import styles from "./legacy-dashboard.module.css";

const navGroups = [
  {
    label: "LEGACY INSIGHTS",
    items: [
      { label: "Envo Culture", icon: "groups", href: "/legacy/dashboard/envo-culture" },
      { label: "Envo Performance", icon: "analytics", href: "/legacy/dashboard/envo-performance" },
      { label: "Envo Sustainability", icon: "eco", href: "/legacy/dashboard/envo-sustainability" },
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
      { label: "Integrations", icon: "extension", href: "/dashboard/envo-integrations" },
    ],
  },
];

type NavItem = (typeof navGroups)[number]["items"][number] & {
  fill?: boolean;
};

export default function LegacySidebar() {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);
  const expandedClass = isExpanded ? "md:w-64 md:p-6" : "md:w-20 md:p-4";
  const showLabelsClass = isExpanded ? "md:inline" : "md:hidden xl:inline";

  return (
    <aside className={`sticky top-0 z-30 hidden h-screen shrink-0 flex-col border-r border-[var(--dash-line-soft)] bg-[var(--dash-surface-subtle)] transition-[width,padding] duration-200 md:flex xl:w-64 xl:p-6 ${expandedClass}`}>
      <button
        type="button"
        onClick={() => setIsExpanded((value) => !value)}
        className="absolute -right-3 top-8 z-50 hidden h-7 w-7 items-center justify-center rounded-full border border-[var(--dash-line)] bg-white text-[var(--dash-ink-soft)] transition-colors hover:bg-[var(--dash-surface-muted)] md:flex xl:hidden"
        aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
      >
        <span className="block text-lg font-black leading-none">
          {isExpanded ? "‹" : "›"}
        </span>
      </button>
      <div className={`flex min-h-full min-w-0 flex-col overflow-x-hidden overflow-y-auto ${styles.hideScrollbar}`}>
        <div className={`relative flex items-center ${isExpanded ? "justify-between pr-8" : "justify-center xl:justify-start xl:pr-8"} xl:justify-between`}>
          <div className={isExpanded ? "block" : "hidden xl:block"}>
            <BrandLogo
              logoHeightClassName="h-9"
              textClassName="text-[1.65rem] tracking-[-0.04em]"
            />
          </div>
          <div className={isExpanded ? "hidden" : "flex h-12 w-12 items-center justify-center overflow-hidden rounded-[1rem] bg-white xl:hidden"}>
            <BrandLogo
              className="justify-center gap-0"
              logoHeightClassName="h-7"
              textClassName="hidden"
            />
          </div>
        </div>


        <nav className="mt-6 space-y-6 pb-8">
          {navGroups.map((group) => (
            <div key={group.label}>
              <p className={`mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--dash-ink-ghost)] ${showLabelsClass}`}>
                {group.label}
              </p>
              <div className="flex flex-col gap-1">
                {group.items.map((item: NavItem) => {
                  const isActive = pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      title={item.label}
                      className={
                        isActive
                          ? `flex items-center gap-4 rounded-[1.35rem] bg-[var(--dash-primary-deep)] px-3.5 py-3 text-[15px] font-medium text-white active:scale-95 ${isExpanded ? "" : "md:justify-center xl:justify-start"}`
                          : `flex items-center gap-4 rounded-[1.35rem] px-3.5 py-3 text-[15px] font-medium text-[var(--dash-ink-soft)] transition-colors hover:bg-[var(--dash-surface-muted)] hover:text-[var(--dash-primary-deep)] ${isExpanded ? "" : "md:justify-center xl:justify-start"}`
                      }
                    >
                      <DashboardIcon
                        name={item.icon}
                        fill={item.fill}
                        className="text-[24px]"
                      />
                      <span className={`${showLabelsClass} min-w-0 truncate`}>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="mt-auto space-y-4 pb-2 pt-6">
          <Link
            href="/dashboard/envo-settings"
            className={
              pathname.startsWith("/dashboard/envo-settings")
                ? "flex w-full items-center justify-center gap-2 rounded-[1.25rem] bg-[var(--dash-primary-deep)] px-4 py-3 text-sm font-medium text-white active:scale-95"
                : "flex w-full items-center justify-center gap-2 rounded-[1.25rem] border border-[var(--dash-line)] bg-[var(--dash-surface)] px-4 py-3 text-sm font-medium text-[var(--dash-ink-soft)] transition-colors hover:border-[rgba(11,107,65,0.30)] hover:bg-[var(--dash-surface-muted)] hover:text-[var(--dash-primary-deep)]"
            }
            title="Settings"
          >
            <DashboardIcon name="settings" className="text-[20px]" />
            <span className={`${showLabelsClass} min-w-0 truncate`}>Settings</span>
          </Link>

          <div className={`flex items-center gap-3 rounded-[1.25rem] bg-[var(--dash-surface)] p-4 ${isExpanded ? "" : "md:justify-center md:p-3 xl:justify-start xl:p-4"} ${styles.glassNav}`}>
            <div className="h-10 w-10 rounded-full bg-[var(--dash-line-strong)]">
              <img
                alt="Profile"
                className="h-full w-full rounded-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9A36ue4mTCpIwF7EdZZrM0_LHYoRdRRChk_ZhULg8p_LQBPk8N5D--Vexd0l5LtH-fBKezxK31nuOmOjrwolLhudo-e-EsN0m9NYS4Z528eEQAlPQ41SDwU6IaHwaesVe0o0t1m5Px5kunbVZBWIROzbnLAtX-OaH1sWxhKKy-9fAVAhFaThalGGELAU6jZD6YMRuE2n7riKDjPxvIWyq4rhA3miNogy4maqO7cmk7uDIQA-_Yesc_0nOjwxbWrdB-4nmdViJFg"
              />
            </div>
            <div className={`${showLabelsClass} min-w-0`}>
              <p className="text-xs font-bold text-[var(--dash-ink)]">Alex Mercer</p>
              <p className="truncate text-[10px] text-[var(--dash-ink-soft)]">Chief HR Officer</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
