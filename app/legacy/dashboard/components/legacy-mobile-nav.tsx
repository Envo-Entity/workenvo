"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import DashboardIcon from "@/app/dashboard/_backup-removed-insights/components/dashboard-icon";
import styles from "../legacy-dashboard.module.css";

const items = [
  { label: "Culture", icon: "groups", href: "/legacy/dashboard/envo-culture" },
  { label: "Performance", icon: "analytics", href: "/legacy/dashboard/envo-performance" },
  { label: "Sustainability", icon: "eco", href: "/legacy/dashboard/envo-sustainability" },
  { label: "Employees", icon: "person", href: "/dashboard/envo-employees" },
];

type MobileNavItem = (typeof items)[number] & {
  fill?: boolean;
};

export default function LegacyMobileNav() {
  const pathname = usePathname();

  return (
    <div
      className={`fixed right-0 bottom-0 left-0 z-50 flex items-center justify-around border-t border-[var(--dash-line-soft)] bg-[var(--dash-surface)] px-6 py-4 md:hidden ${styles.glassNav}`}
    >
      {items.map((item: MobileNavItem) => {
        const isActive = pathname.startsWith(item.href);
        return (
          <Link
            key={item.label}
            href={item.href}
            className={`flex flex-col items-center gap-1 ${isActive ? "text-[var(--dash-primary)]" : "text-[var(--dash-ink-ghost)]"}`}
          >
            <DashboardIcon
              name={item.icon}
              fill={item.fill}
              className="text-[24px]"
            />
            <span className="text-[10px] font-bold">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
