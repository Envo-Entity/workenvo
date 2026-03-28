"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import DashboardIcon from "./dashboard-icon";
import styles from "../dashboard.module.css";

const items = [
  { label: "Culture", icon: "groups", fill: true, href: "/dashboard/envo-culture" },
  { label: "Performance", icon: "analytics", href: "/dashboard/envo-performance" },
  { label: "Sustain.", icon: "eco", href: "/dashboard/envo-sustainability" },
  { label: "Employees", icon: "person", href: "/dashboard/envo-employees" },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <div
      className={`fixed right-0 bottom-0 left-0 z-50 flex items-center justify-around border-t border-stone-100 bg-white/80 px-6 py-4 md:hidden ${styles.glassNav}`}
    >
      {items.map((item) => {
        const isActive = pathname.startsWith(item.href);
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
