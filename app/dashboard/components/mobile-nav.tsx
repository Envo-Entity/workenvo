"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import DashboardIcon from "./dashboard-icon";
import styles from "../dashboard.module.css";

const items = [
  { label: "Dashboard", icon: "dashboard", href: "/dashboard" },
  { label: "Sentiment", icon: "heart", href: "/dashboard/envo-sentiment" },
  { label: "Builder", icon: "assignment", href: "/dashboard/envo-survey-builder" },
  { label: "Employees", icon: "person", href: "/dashboard/envo-employees" },
];

type MobileNavItem = (typeof items)[number] & {
  fill?: boolean;
};

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <div
      className={`fixed right-0 bottom-0 left-0 z-50 flex items-center justify-around border-t border-stone-100 bg-white/80 px-6 py-4 md:hidden ${styles.glassNav}`}
    >
      {items.map((item: MobileNavItem) => {
        const isActive =
          item.href === "/dashboard"
            ? pathname === item.href
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.label}
            href={item.href}
            className={`flex flex-col items-center gap-1 ${isActive ? "text-[#006841]" : "text-stone-400"}`}
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
