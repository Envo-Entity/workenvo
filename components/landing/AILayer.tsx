"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

function buildTimestamps() {
  const now = new Date();
  const fmt = (d: Date) =>
    d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return [
    fmt(now),
    fmt(new Date(now.getTime() - 2 * 60 * 1000)),
    fmt(new Date(now.getTime() - 7 * 60 * 1000)),
    fmt(new Date(now.getTime() - 14 * 60 * 1000)),
    fmt(new Date(now.getTime() - 22 * 60 * 1000)),
  ];
}

// SVG alert icons — no emojis
function IconAlert({ type }: { type: string }) {
  if (type === "critical") {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    );
  }
  if (type === "warning") {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    );
  }
  if (type === "info") {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
      </svg>
    );
  }
  // positive
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

// SVG icons for insight fields — no emojis
function IconSignal() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function IconTrend() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
      <polyline points="17 18 23 18 23 12" />
    </svg>
  );
}

function IconConfidence() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconAction() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

const notificationDefs = [
  {
    id: 1,
    dot: "#EF4444",
    iconType: "critical",
    dotLabel: "#EF4444",
    title: "Burnout risk detected",
    body: "Marketing team — 3 members flagged",
    priority: "high",
  },
  {
    id: 2,
    dot: "#F59E0B",
    iconType: "warning",
    title: "3 reviews overdue",
    body: "Engineering leads — action required",
    priority: "medium",
  },
  {
    id: 3,
    dot: "#3B82F6",
    iconType: "info",
    title: "Engagement drop detected",
    body: "London office — −22% this week",
    priority: "medium",
  },
  {
    id: 4,
    dot: "#F59E0B",
    iconType: "warning",
    title: "Culture drift signal",
    body: "Finance team — values misalignment",
    priority: "medium",
  },
  {
    id: 5,
    dot: "#16855B",
    iconType: "positive",
    title: "Capability milestone reached",
    body: "Product team — collaboration score +14%",
    priority: "positive",
  },
];

const insightFields = [
  {
    label: "Signal detected",
    value: "Declining motivation — perceived unfair lead distribution",
    Icon: IconSignal,
    color: "#F59E0B",
    bg: "#FAFAFA",
    border: "1px solid #F3F4F6",
  },
  {
    label: "Activity trend",
    value: "−34% over 6 weeks",
    Icon: IconTrend,
    color: "#EF4444",
    bg: "rgba(239,68,68,0.04)",
    border: "1px solid rgba(239,68,68,0.12)",
  },
  {
    label: "Confidence",
    value: "91% · High priority",
    Icon: IconConfidence,
    color: "#16855B",
    bg: "rgba(22,133,91,0.04)",
    border: "1px solid rgba(22,133,91,0.12)",
  },
  {
    label: "Recommended action",
    value: "Manager review + rebalancing of lead assignments",
    Icon: IconAction,
    color: "#3B82F6",
    bg: "#FAFAFA",
    border: "1px solid #F3F4F6",
  },
];

// Avatar initials placeholder
function Avatar() {
  return (
    <div
      className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-sm font-semibold"
      style={{ background: "#16855B", color: "#FFFFFF", fontFamily: "var(--font-sans)" }}
    >
      JS
    </div>
  );
}

export default function AILayer() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [feedVisible, setFeedVisible] = useState(0);
  const [cardVisible, setCardVisible] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const [timestamps] = useState<string[]>(() => buildTimestamps());
  const [insightVisible, setInsightVisible] = useState(0);

  const notifications = notificationDefs.map((n, i) => ({
    ...n,
    time: timestamps[i] ?? "",
  }));

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasEntered) setHasEntered(true);
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [hasEntered]);

  useEffect(() => {
    if (!hasEntered) return;
    const delays = [0, 350, 700, 1100, 1550];
    const timers = delays.map((d, i) =>
      setTimeout(() => setFeedVisible((p) => Math.max(p, i + 1)), d)
    );
    // Show the insight card shortly after feed starts
    const cardTimer = setTimeout(() => {
      setCardVisible(true);
      const fieldDelays = [200, 500, 800, 1100];
      fieldDelays.forEach((d, i) =>
        setTimeout(() => setInsightVisible((p) => Math.max(p, i + 1)), d)
      );
    }, 400);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(cardTimer);
    };
  }, [hasEntered]);

  return (
    <section
      ref={sectionRef}
      className="relative py-32 px-6 overflow-hidden"
      style={{ background: "#FAFAFA" }}
    >
      {/* Subtle bg glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: "700px",
          height: "300px",
          background: "radial-gradient(ellipse at top, rgba(22,133,91,0.05) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p
            className="text-xs font-semibold tracking-widest uppercase mb-4"
            style={{ color: "#16855B", fontFamily: "var(--font-sans)" }}
          >
            AI Layer — From Signals to Action
          </p>
          <h2
            className="text-4xl lg:text-[48px] leading-tight mb-4 mx-auto"
            style={{
              fontFamily: "var(--font-serif)",
              color: "#111827",
              fontWeight: 400,
              maxWidth: "680px",
            }}
          >
            Your organisation, live
          </h2>
          <p
            className="text-lg mx-auto"
            style={{ color: "#6B7280", fontFamily: "var(--font-sans)", maxWidth: "560px" }}
          >
            Workenvo doesn&apos;t just show data. It detects what&apos;s changing, explains
            why, and tells you what to do next.
          </p>
        </motion.div>

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left: Intelligence feed */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="rounded-2xl overflow-hidden"
            style={{
              background: "#FFFFFF",
              border: "1px solid #E5E7EB",
              boxShadow: "0 20px 60px rgba(0,0,0,0.07), 0 4px 16px rgba(0,0,0,0.04)",
            }}
          >
            {/* Feed header */}
            <div
              className="flex items-center justify-between px-5 py-4"
              style={{
                height: "76px",
                background: "#F5F9F7",
                borderBottom: "1px solid #E5E7EB",
              }}
            >
              <div className="flex items-center gap-2.5">
                <div className="relative shrink-0">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ background: "#16855B" }}
                  />
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{ background: "#16855B" }}
                    animate={{ scale: [1, 2.2], opacity: [0.5, 0] }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
                  />
                </div>
                <span
                  className="text-sm font-medium"
                  style={{ color: "#374151", fontFamily: "var(--font-sans)" }}
                >
                  Workenvo Intelligence Feed
                </span>
              </div>
              <span
                className="text-xs px-2.5 py-1 rounded-md font-semibold"
                style={{
                  background: "rgba(22,133,91,0.1)",
                  color: "#16855B",
                  border: "1px solid rgba(22,133,91,0.2)",
                  fontFamily: "var(--font-sans)",
                  letterSpacing: "0.04em",
                }}
              >
                LIVE
              </span>
            </div>

            {/* Notifications */}
            <div className="p-3 space-y-2" style={{ height: "320px", overflow: "hidden" }}>
              <AnimatePresence>
                {notifications.slice(0, feedVisible).map((notif, i) => (
                  <motion.div
                    key={notif.id}
                    initial={{ opacity: 0, x: 16, height: 0 }}
                    animate={{ opacity: 1, x: 0, height: "auto" }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="flex items-start rounded-xl p-4"
                    style={{
                      background:
                        notif.priority === "high"
                          ? "rgba(239,68,68,0.04)"
                          : notif.priority === "positive"
                          ? "rgba(22,133,91,0.04)"
                          : "#FAFAFA",
                      border:
                        notif.priority === "high"
                          ? "1px solid rgba(239,68,68,0.12)"
                          : notif.priority === "positive"
                          ? "1px solid rgba(22,133,91,0.12)"
                          : "1px solid #F3F4F6",
                    }}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <span style={{ color: notif.dot }}>
                            <IconAlert type={notif.iconType} />
                          </span>
                          <p
                            className="text-sm font-medium"
                            style={{ color: "#111827", fontFamily: "var(--font-sans)" }}
                          >
                            {notif.title}
                          </p>
                        </div>
                        <span
                          className="text-xs shrink-0 font-mono"
                          style={{ color: "#9CA3AF" }}
                        >
                          {notif.time}
                        </span>
                      </div>
                      <p
                        className="text-xs mt-0.5"
                        style={{ color: "#6B7280", fontFamily: "var(--font-sans)" }}
                      >
                        {notif.body}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Right: Employee insight card */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={cardVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="rounded-2xl overflow-hidden"
            style={{
              background: "#FFFFFF",
              border: "1px solid #E5E7EB",
              boxShadow: "0 20px 60px rgba(0,0,0,0.07), 0 4px 16px rgba(0,0,0,0.04)",
            }}
          >
            {/* Card header */}
            <div
              className="flex items-center justify-between px-5 py-4"
              style={{
                height: "76px",
                background: "#F5F9F7",
                borderBottom: "1px solid #E5E7EB",
              }}
            >
              <div className="flex items-center gap-3">
                <Avatar />
                <div>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "#111827", fontFamily: "var(--font-sans)" }}
                  >
                    Employee Profile
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: "#6B7280", fontFamily: "var(--font-sans)" }}
                  >
                    Insight summary · Updated just now
                  </p>
                </div>
              </div>
              <span className="tag-green px-3 py-1 rounded-full text-xs font-semibold">
                High potential
              </span>
            </div>

            {/* Insight fields */}
            <div className="p-3 space-y-2" style={{ height: "320px", overflow: "hidden" }}>
              <AnimatePresence>
                {insightFields.slice(0, insightVisible).map((field) => {
                  const { Icon } = field;
                  return (
                    <motion.div
                      key={field.label}
                      initial={{ opacity: 0, x: 16, height: 0 }}
                      animate={{ opacity: 1, x: 0, height: "auto" }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                      className="flex items-start rounded-xl p-4"
                      style={{
                        background: field.bg,
                        border: field.border,
                      }}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-1.5">
                            <span style={{ color: field.color }}>
                              <Icon />
                            </span>
                            <p
                              className="text-sm font-medium"
                              style={{ color: "#111827", fontFamily: "var(--font-sans)" }}
                            >
                              {field.label}
                            </p>
                          </div>
                        </div>
                        <p
                          className="text-xs mt-0.5"
                          style={{ color: "#6B7280", fontFamily: "var(--font-sans)" }}
                        >
                          {field.value}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Bottom tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-14 text-xl max-w-xl mx-auto"
          style={{
            color: "#6B7280",
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontWeight: 400,
          }}
        >
          Workenvo doesn&apos;t just show data.{" "}
          <span style={{ color: "#111827" }}>It tells you what to do next.</span>
        </motion.p>
      </div>
    </section>
  );
}
