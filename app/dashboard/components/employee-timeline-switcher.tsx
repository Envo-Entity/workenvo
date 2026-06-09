"use client";

import { useMemo, useState } from "react";
import styles from "../dashboard.module.css";
import DashboardIcon from "./dashboard-icon";
import type { EmployeeTimelineEvent, TimelineTone } from "./employees-data";

type TimelineType = "all" | "risk" | "reward" | "change" | "review" | "admin";

const typeSwitches: Array<{ key: TimelineType; label: string }> = [
  { key: "all", label: "All" },
  { key: "risk", label: "Risk" },
  { key: "reward", label: "Rewards" },
  { key: "change", label: "Changes" },
  { key: "review", label: "Reviews" },
  { key: "admin", label: "Admin" },
];

const toneStyles: Record<TimelineTone, {
  chip: string;
  dot: string;
  glow: string;
  text: string;
}> = {
  positive: {
    chip: "bg-[var(--dash-primary-soft)] text-[var(--dash-primary)]",
    dot: "bg-[var(--dash-primary)]",
    glow: "shadow-[0_0_0_8px_rgba(16,137,79,0.18)]",
    text: "text-[var(--dash-primary)]",
  },
  watch: {
    chip: "bg-[var(--dash-danger-soft)] text-[var(--dash-warning)]",
    dot: "bg-[var(--dash-warning)]",
    glow: "shadow-[0_0_0_8px_rgba(211,138,44,0.18)]",
    text: "text-[var(--dash-warning)]",
  },
  neutral: {
    chip: "bg-[var(--dash-surface-muted)] text-[var(--dash-ink-soft)]",
    dot: "bg-[var(--dash-ink-ghost)]",
    glow: "shadow-[0_0_0_8px_rgba(195,202,211,0.22)]",
    text: "text-[var(--dash-ink-soft)]",
  },
  reward: {
    chip: "bg-[var(--dash-warning-soft)] text-[var(--dash-warning)]",
    dot: "bg-[var(--dash-warning)]",
    glow: "shadow-[0_0_0_8px_rgba(211,138,44,0.18)]",
    text: "text-[var(--dash-warning)]",
  },
  change: {
    chip: "bg-[var(--dash-surface-muted)] text-[var(--dash-primary-deep)]",
    dot: "bg-[var(--dash-primary-deep)]",
    glow: "shadow-[0_0_0_8px_rgba(11,107,65,0.16)]",
    text: "text-[var(--dash-primary-deep)]",
  },
};

function getTimelineType(event: EmployeeTimelineEvent): TimelineType {
  const title = event.title.toLowerCase();

  if (event.tone === "watch" || title.includes("burnout") || title.includes("risk")) {
    return "risk";
  }

  if (title.includes("review") || title.includes("evaluation")) {
    return "review";
  }

  if (
    title.includes("leave") ||
    title.includes("certification") ||
    title.includes("onboarding") ||
    title.includes("compliance")
  ) {
    return "admin";
  }

  if (event.tone === "change" || title.includes("changed department")) {
    return "change";
  }

  if (event.tone === "reward" || title.includes("raise") || title.includes("achievement")) {
    return "reward";
  }

  return "all";
}

function TimelineCard({
  event,
  index,
  isLatest,
}: {
  event: EmployeeTimelineEvent;
  index: number;
  isLatest: boolean;
}) {
  const tone = isLatest ? toneStyles.positive : toneStyles[event.tone];
  const isLeft = index % 2 === 0;

  return (
    <article
      className={`relative grid gap-3 md:grid-cols-[minmax(0,1fr)_52px_minmax(0,1fr)] md:items-center ${styles.timelineItem}`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className={isLeft ? "md:col-start-1 md:justify-self-end" : "md:col-start-3 md:justify-self-start"}>
        <div className="inline-flex w-full min-w-0 max-w-[28rem] flex-col rounded-[1.25rem] border border-[var(--dash-line)] bg-white px-5 py-4 shadow-[0_8px_24px_-18px_rgba(15,23,42,0.16)]">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${tone.chip}`}>
              <DashboardIcon name={event.icon} className="text-[17px]" />
              {event.title}
            </span>
            {event.metric && (
              <span className="rounded-full bg-[var(--dash-surface-muted)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[var(--dash-ink-soft)]">
                {event.metric}
              </span>
            )}
          </div>
          <p className={`mt-2 text-xs font-bold ${tone.text}`}>{event.date}</p>
          <p className="mt-3 text-sm leading-6 text-[var(--dash-ink-soft)]">{event.body}</p>
        </div>
      </div>

      <div className="relative z-10 ml-0 flex h-8 w-8 items-center justify-center rounded-full bg-white md:col-start-2 md:mx-auto">
        <span className={`h-4 w-4 rounded-full ${tone.dot} ${isLatest ? styles.latestDot : tone.glow}`} />
      </div>
    </article>
  );
}

export default function EmployeeTimelineSwitcher({
  timeline,
}: {
  timeline: EmployeeTimelineEvent[];
}) {
  const [activeType, setActiveType] = useState<TimelineType>("all");
  const [activeYear, setActiveYear] = useState<string>("all");
  const years = useMemo(() => Array.from(new Set(timeline.map((event) => event.year))), [timeline]);
  const filteredTimeline = timeline.filter((event) => {
    const typeMatch = activeType === "all" || getTimelineType(event) === activeType;
    const yearMatch = activeYear === "all" || event.year === activeYear;

    return typeMatch && yearMatch;
  });

  return (
    <div className="px-1 py-2 sm:px-0 sm:py-4">
      <div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--dash-primary)]">
            Four-year timeline
          </p>
          <h2 className={`mt-2 text-4xl leading-none text-[var(--dash-ink)] sm:text-6xl ${styles.displaySerif}`}>
            Signals worth scanning
          </h2>
        </div>
      </div>

      <div className="mt-7 flex flex-wrap gap-2">
        {typeSwitches.map((type) => {
          const isActive = type.key === activeType;

          return (
            <button
              key={type.key}
              type="button"
              onClick={() => setActiveType(type.key)}
              className={
                isActive
                  ? "rounded-full bg-[rgba(16,137,79,0.90)] px-3.5 py-1.5 text-[11px] font-black text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.34)]"
                  : "rounded-full bg-white/80 px-3.5 py-1.5 text-[11px] font-bold text-[var(--dash-ink-soft)] transition-colors hover:bg-[var(--dash-surface-muted)]"
              }
            >
              {type.label}
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActiveYear("all")}
          className={
            activeYear === "all"
              ? "rounded-full bg-[rgba(16,137,79,0.90)] px-3.5 py-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-white"
              : "rounded-full bg-[rgba(16,137,79,0.08)] px-3.5 py-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-[var(--dash-primary)] transition-colors hover:bg-[rgba(16,137,79,0.15)]"
          }
        >
          All
        </button>
        {years.map((year) => {
          const isActive = year === activeYear;

          return (
            <button
              key={year}
              type="button"
              onClick={() => setActiveYear(isActive ? "all" : year)}
              className={
                isActive
                  ? "rounded-full bg-[rgba(16,137,79,0.90)] px-3.5 py-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-white"
                  : "rounded-full bg-[rgba(16,137,79,0.08)] px-3.5 py-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-[var(--dash-primary)] transition-colors hover:bg-[rgba(16,137,79,0.15)]"
              }
            >
              {year}
            </button>
          );
        })}
      </div>

      <div className="relative mt-9 space-y-6 pl-9 md:pl-0">
        <div className="absolute left-3 top-4 bottom-4 w-1 rounded-full bg-[var(--dash-primary-soft)] md:left-1/2 md:-translate-x-1/2" />
        {filteredTimeline.map((event, index) => (
          <TimelineCard
            key={`${event.date}-${event.title}`}
            event={event}
            index={index}
            isLatest={timeline[0] === event}
          />
        ))}
      </div>
    </div>
  );
}
