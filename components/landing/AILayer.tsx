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

const notificationDefs = [
  {
    id: 1,
    dot: "#EF4444",
    icon: "🔴",
    title: "Burnout risk detected",
    body: "Marketing team — 3 members flagged",
    priority: "high",
  },
  {
    id: 2,
    dot: "#F59E0B",
    icon: "⚠️",
    title: "3 reviews overdue",
    body: "Engineering leads — action required",
    priority: "medium",
  },
  {
    id: 3,
    dot: "#3B82F6",
    icon: "📉",
    title: "Engagement drop detected",
    body: "London office — −22% this week",
    priority: "medium",
  },
  {
    id: 4,
    dot: "#F59E0B",
    icon: "🌊",
    title: "Culture drift signal",
    body: "Finance team — values misalignment",
    priority: "medium",
  },
  {
    id: 5,
    dot: "#16855B",
    icon: "✅",
    title: "Capability milestone reached",
    body: "Product team — collaboration score +14%",
    priority: "positive",
  },
];

export default function AILayer() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(0);
  const [hasEntered, setHasEntered] = useState(false);
  const [timestamps] = useState<string[]>(() => buildTimestamps());

  const notifications = notificationDefs.map((n, i) => ({
    ...n,
    time: timestamps[i] ?? "",
  }));

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasEntered) setHasEntered(true);
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [hasEntered]);

  useEffect(() => {
    if (!hasEntered) return;
    const delays = [0, 350, 700, 1100, 1550];
    const timers = delays.map((d, i) =>
      setTimeout(() => setVisibleCount((p) => Math.max(p, i + 1)), d)
    );
    return () => timers.forEach(clearTimeout);
  }, [hasEntered]);

  return (
    <section
      ref={sectionRef}
      className="relative py-32 px-6 overflow-hidden"
      style={{ background: "#FFFFFF" }}
    >
      {/* Subtle bg glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: "600px",
          height: "300px",
          background:
            "radial-gradient(ellipse at top, rgba(22,133,91,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-4xl mx-auto relative z-10">
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
              maxWidth: "640px",
            }}
          >
            Your organisation, live
          </h2>
          <p
            className="text-lg"
            style={{ color: "#6B7280", fontFamily: "var(--font-sans)" }}
          >
            Surface risks before they escalate. Act before it's too late.
          </p>
        </motion.div>

        {/* Live feed card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="rounded-2xl overflow-hidden max-w-xl mx-auto"
          style={{
            background: "#FFFFFF",
            border: "1px solid #E5E7EB",
            boxShadow:
              "0 20px 60px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.04)",
          }}
        >
          {/* Feed header */}
          <div
            className="flex items-center justify-between px-5 py-4"
            style={{
              background: "#F5F9F7",
              borderBottom: "1px solid #E5E7EB",
            }}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ background: "#16855B" }}
              />
              <span
                className="text-sm font-medium"
                style={{ color: "#374151", fontFamily: "var(--font-sans)" }}
              >
                Workenvo Intelligence Feed
              </span>
            </div>
            <span
              className="text-xs px-2 py-1 rounded-md font-medium"
              style={{
                background: "rgba(22,133,91,0.1)",
                color: "#16855B",
                border: "1px solid rgba(22,133,91,0.2)",
                fontFamily: "var(--font-sans)",
              }}
            >
              Live
            </span>
          </div>

          {/* Notifications */}
          <div className="p-3 space-y-2">
            <AnimatePresence>
              {notifications.slice(0, visibleCount).map((notif, i) => (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0, x: 20, height: 0 }}
                  animate={{ opacity: 1, x: 0, height: "auto" }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="flex items-start gap-3 rounded-xl p-4"
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
                  {/* Pulse dot */}
                  <div className="relative mt-1 flex-shrink-0">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ background: notif.dot }}
                    />
                    {i === 0 && visibleCount <= 2 && (
                      <motion.div
                        className="absolute inset-0 rounded-full"
                        style={{ background: notif.dot }}
                        animate={{ scale: [1, 2.5], opacity: [0.6, 0] }}
                        transition={{ duration: 1.2, repeat: Infinity }}
                      />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p
                        className="text-sm font-medium truncate"
                        style={{ color: "#111827", fontFamily: "var(--font-sans)" }}
                      >
                        {notif.icon} {notif.title}
                      </p>
                      <span
                        className="text-xs flex-shrink-0 font-mono"
                        style={{ color: "#9CA3AF", fontFamily: "var(--font-sans)" }}
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

            {/* Loading placeholder */}
            {visibleCount === 0 && (
              <div className="space-y-2 py-1">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-16 rounded-xl animate-pulse"
                    style={{ background: "#F9FAFB", border: "1px solid #F3F4F6" }}
                  />
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12 text-xl max-w-xl mx-auto"
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
