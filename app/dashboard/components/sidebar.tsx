"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import BrandLogo from "@/components/BrandLogo";
import DashboardIcon from "./dashboard-icon";
import styles from "../dashboard.module.css";
import { signOut } from "@/app/auth/actions";

const ROLE_LABELS: Record<string, string> = {
  super_admin: "Super Admin",
  org_admin: "Admin",
  hr: "HR Manager",
  manager: "Manager",
};

const navGroups = [
  {
    label: "INSIGHTS",
    items: [
      { label: "Dashboard", icon: "dashboard", href: "/dashboard" },
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

interface UserProfile {
  fullName: string | null;
  email: string;
  avatarUrl: string | null;
  role: string;
}

export default function Sidebar({ userProfile }: { userProfile: UserProfile }) {
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
                  const isActive =
                    item.href === "/dashboard"
                      ? pathname === item.href
                      : pathname.startsWith(item.href);
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

          <button
            className="flex w-full items-center justify-center gap-2 rounded-[1.25rem] border border-[var(--dash-line)] bg-[var(--dash-surface)] px-4 py-3 text-sm font-medium text-[var(--dash-primary-deep)] transition-colors hover:border-[rgba(11,107,65,0.30)] hover:bg-[var(--dash-surface-muted)]"
            title="Export Insights"
          >
            <DashboardIcon name="download" className="text-[20px]" />
            <span className={`${showLabelsClass} min-w-0 truncate`}>Export Insights</span>
          </button>

          <div className={`flex items-center gap-3 rounded-[1.25rem] bg-[var(--dash-surface)] p-4 ${isExpanded ? "" : "md:justify-center md:p-3 xl:justify-start xl:p-4"} ${styles.glassNav}`}>
            {/* Avatar */}
            <div className="relative h-10 w-10 shrink-0">
              {userProfile.avatarUrl ? (
                <img
                  alt={userProfile.fullName ?? userProfile.email}
                  className="h-full w-full rounded-full object-cover"
                  src={userProfile.avatarUrl}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-full bg-[var(--dash-primary-deep)] text-[13px] font-bold text-white">
                  {(userProfile.fullName ?? userProfile.email).charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Name + role */}
            <div className={`${showLabelsClass} min-w-0 flex-1`}>
              <p className="truncate text-xs font-bold text-[var(--dash-ink)]">
                {userProfile.fullName ?? userProfile.email.split("@")[0]}
              </p>
              <p className="truncate text-[10px] text-[var(--dash-ink-soft)]">
                {ROLE_LABELS[userProfile.role] ?? userProfile.role}
              </p>
            </div>

            {/* Logout */}
            <form action={signOut} className={`${showLabelsClass} shrink-0`}>
              <button
                type="submit"
                title="Log out"
                className="flex h-7 w-7 items-center justify-center rounded-full text-[var(--dash-ink-soft)] transition-colors hover:bg-[var(--dash-surface-muted)] hover:text-red-500"
              >
                <svg viewBox="0 0 20 20" width="16" height="16" fill="none">
                  <path
                    d="M7 3H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h3M13 14l3-4-3-4M16 10H7"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    </aside>
  );
}
