"use client";

import { useState } from "react";
import Link from "next/link";
import DashboardIcon from "./dashboard-icon";
import styles from "../dashboard.module.css";

type Metric = { label: string; value: string; href?: string };

type CapabilityIndexCardProps = {
  title: string;
  subtitle: string;
  score: string;
  trend: string;
  trendPositive: boolean;
  bars: string[];
  metrics: Metric[];
  href?: string;
  explanation: string;
  weakestDimensionNote: string;
};

export default function CapabilityIndexCard({
  title,
  subtitle,
  score,
  trend,
  trendPositive,
  bars,
  metrics,
  href,
  explanation,
  weakestDimensionNote,
}: CapabilityIndexCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`self-start flex flex-col justify-between rounded-[1.5rem] bg-[#ffffff] p-6 md:col-span-8 md:p-8 ${styles.ambientShadow}`}
    >
      {href ? (
        <Link
          href={href}
          className="group rounded-[1.25rem] transition-transform hover:-translate-y-0.5"
        >
          <div className="mb-12 flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-[#1c1b1b] group-hover:text-[#006841]">
                {title}
              </h2>
              <p className="mt-1 text-sm text-[#3e4941]">{subtitle}</p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-black text-[#006841]">{score}</span>
              <p
                className={`text-[10px] font-bold ${trendPositive ? "text-emerald-600" : "text-red-500"}`}
              >
                {trend}
              </p>
            </div>
          </div>

          <div className="relative flex h-52 w-full items-end gap-2 overflow-hidden rounded-[1rem]">
            {bars.map((bar, index) => (
              <div key={index} className={`flex-1 rounded-t-full ${bar}`} />
            ))}
          </div>
        </Link>
      ) : (
        <>
          <div className="mb-12 flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-[#1c1b1b]">
                {title}
              </h2>
              <p className="mt-1 text-sm text-[#3e4941]">{subtitle}</p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-black text-[#006841]">{score}</span>
              <p
                className={`text-[10px] font-bold ${trendPositive ? "text-emerald-600" : "text-red-500"}`}
              >
                {trend}
              </p>
            </div>
          </div>

          <div className="relative flex h-52 w-full items-end gap-2 overflow-hidden rounded-[1rem]">
            {bars.map((bar, index) => (
              <div key={index} className={`flex-1 rounded-t-full ${bar}`} />
            ))}
          </div>
        </>
      )}

      <div className="mt-8 grid grid-cols-4 border-t border-[#f0edec] pt-8">
        {metrics.map((metric) => (
          <div key={metric.label}>
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#3e4941]">
              {metric.label}
            </p>
            {metric.href ? (
              <Link
                href={metric.href}
                className="text-lg font-bold text-[#1c1b1b] transition-colors hover:text-[#006841]"
              >
                {metric.value}
              </Link>
            ) : (
              <p className="text-lg font-bold text-[#1c1b1b]">{metric.value}</p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-[1rem] bg-[#f6f3f2] px-4 py-3">
        <div className="flex items-start gap-2">
          <DashboardIcon name="info" className="mt-0.5 text-[16px] text-[#6f7a73]" />
          <p className="text-[13px] leading-relaxed text-[#3e4941]/80">
            {weakestDimensionNote}
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-[1rem] bg-[#f6f3f2] px-4 py-3">
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="flex w-full items-center gap-2 text-left"
        >
          <DashboardIcon name="lightbulb" className="text-[18px] text-[#6f7a73]" />
          <span className="text-[13px] font-semibold text-[#3e4941]/85">
            Why this is happening {expanded ? "↓" : "→"}
          </span>
        </button>
        {expanded ? (
          <p className="mt-3 text-[13px] leading-relaxed text-[#3e4941]/80">
            {explanation}
          </p>
        ) : null}
      </div>
    </div>
  );
}
