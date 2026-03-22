"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "motion/react";

const personas = [
  {
    id: "employees",
    label: "Employees",
    emoji: "🌟",
    screen: {
      title: "My Activity",
      subtitle: "Week of March 17–23",
      items: [
        { icon: "✅", label: "3 behaviours logged", color: "#16855B" },
        { icon: "🏆", label: "Leadership badge earned", color: "#D97706" },
        { icon: "📋", label: "Feedback survey due", color: "#6366F1" },
        { icon: "💡", label: "AI nudge: 1-to-1 reminder", color: "#0891B2" },
      ],
    },
    pills: ["Log behaviours", "Earn rewards", "Participate in surveys", "Receive AI nudges"],
  },
  {
    id: "managers",
    label: "Managers",
    emoji: "🧭",
    screen: {
      title: "Team Pulse",
      subtitle: "Marketing · 12 reports",
      items: [
        { icon: "🔴", label: "Burnout risk: 2 team members", color: "#EF4444" },
        { icon: "⚠️", label: "3 reviews overdue", color: "#F59E0B" },
        { icon: "📉", label: "Engagement −18% this week", color: "#EF4444" },
        { icon: "💡", label: "Action: Schedule 1-to-1s", color: "#16855B" },
      ],
    },
    pills: ["Real-time alerts", "Behaviour insights", "Recommended actions", "Performance tracking"],
  },
  {
    id: "leadership",
    label: "HR & Leadership",
    emoji: "🏢",
    screen: {
      title: "Org Overview",
      subtitle: "Q1 2026 · 847 employees",
      items: [
        { icon: "📊", label: "Capability score: 74/100", color: "#16855B" },
        { icon: "🌍", label: "ESG behaviours: 89% tracked", color: "#0891B2" },
        { icon: "⚠️", label: "Culture drift: Finance team", color: "#F59E0B" },
        { icon: "📄", label: "CSRD report ready", color: "#16855B" },
      ],
    },
    pills: ["Org-wide insights", "Capability tracking", "ESG metrics", "Risk detection"],
  },
];

export default function ProductSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Drive tab from scroll position
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (v < 0.33) setActiveIdx(0);
    else if (v < 0.66) setActiveIdx(1);
    else setActiveIdx(2);
  });

  const persona = personas[activeIdx];

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{ minHeight: "300vh", background: "#FFFFFF" }}
    >
      <div
        style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}
        className="flex flex-col items-center justify-center px-6"
      >
        {/* Subtle bg */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 0%, rgba(22,133,91,0.03) 0%, transparent 60%)",
          }}
        />

        <div className="relative z-10 w-full max-w-6xl mx-auto">
          {/* Header — compact for sticky */}
          <div className="text-center mb-6">
            <p
              className="text-xs font-semibold tracking-widest uppercase mb-2"
              style={{ color: "#16855B", fontFamily: "var(--font-sans)" }}
            >
              Product Experience
            </p>
            <h2
              className="text-3xl lg:text-[40px] leading-tight mb-2 mx-auto"
              style={{
                fontFamily: "var(--font-serif)",
                color: "#111827",
                fontWeight: 400,
                maxWidth: "560px",
              }}
            >
              Built for everyone who shapes performance
            </h2>
          </div>

          {/* Persona tabs — show current, scroll drives it */}
          <div className="flex justify-center gap-2 mb-6">
            {personas.map((p, i) => (
              <button
                key={p.id}
                onClick={() => setActiveIdx(i)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-400"
                style={{
                  background: activeIdx === i ? "#16855B" : "#F9FAFB",
                  color: activeIdx === i ? "#FFFFFF" : "#6B7280",
                  border: activeIdx === i ? "none" : "1px solid #E5E7EB",
                  boxShadow: activeIdx === i ? "0 4px 12px rgba(22,133,91,0.25)" : "none",
                  fontFamily: "var(--font-sans)",
                  transform: activeIdx === i ? "scale(1.05)" : "scale(1)",
                }}
              >
                <span>{p.emoji}</span>
                <span>{p.label}</span>
              </button>
            ))}
          </div>

          {/* Scroll progress dots */}
          <div className="flex justify-center gap-1.5 mb-6">
            {personas.map((_, i) => (
              <div
                key={i}
                className="rounded-full transition-all duration-500"
                style={{
                  width: activeIdx === i ? "24px" : "6px",
                  height: "6px",
                  background: activeIdx === i ? "#16855B" : "#D1FAE5",
                }}
              />
            ))}
          </div>

          {/* Layout: device + pills */}
          <div className="flex flex-col items-center">
            {/* Laptop frame */}
            <div className="relative w-full max-w-xl">
              {/* Screen body */}
              <div
                className="rounded-2xl overflow-hidden"
                style={{
                  background: "#1E293B",
                  border: "8px solid #334155",
                  boxShadow: "0 30px 70px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.04)",
                }}
              >
                {/* Browser bar */}
                <div
                  className="flex items-center gap-2 px-4 py-2.5"
                  style={{ background: "#0F172A", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 opacity-70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 opacity-70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 opacity-70" />
                  <div
                    className="flex-1 mx-4 h-5 rounded-md flex items-center px-3"
                    style={{ background: "rgba(255,255,255,0.06)" }}
                  >
                    <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
                      app.workenvo.com/dashboard
                    </span>
                  </div>
                </div>

                {/* Screen content — morphs between tabs */}
                <div className="p-5" style={{ minHeight: "240px" }}>
                  <AnimatePresence mode="sync">
                    <motion.div
                      key={persona.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      {/* Screen header */}
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3
                            className="text-sm font-semibold"
                            style={{ color: "#F1F5F9", fontFamily: "var(--font-sans)" }}
                          >
                            {persona.screen.title}
                          </h3>
                          <p
                            className="text-xs mt-0.5"
                            style={{ color: "#64748B", fontFamily: "var(--font-sans)" }}
                          >
                            {persona.screen.subtitle}
                          </p>
                        </div>
                        <div
                          className="px-2.5 py-1 rounded-full text-xs font-medium"
                          style={{
                            background: "rgba(22,133,91,0.2)",
                            color: "#34D399",
                            border: "1px solid rgba(22,133,91,0.3)",
                            fontFamily: "var(--font-sans)",
                          }}
                        >
                          Live
                        </div>
                      </div>

                      {/* Items — stagger in */}
                      <div className="space-y-2">
                        {persona.screen.items.map((item, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: i * 0.06 }}
                            className="flex items-center gap-3 rounded-lg px-3 py-2.5"
                            style={{
                              background: "rgba(255,255,255,0.04)",
                              border: "1px solid rgba(255,255,255,0.06)",
                            }}
                          >
                            <span className="text-sm">{item.icon}</span>
                            <span
                              className="text-xs flex-1"
                              style={{ color: "#CBD5E1", fontFamily: "var(--font-sans)" }}
                            >
                              {item.label}
                            </span>
                            <div
                              className="w-1.5 h-1.5 rounded-full shrink-0"
                              style={{ background: item.color, opacity: 0.8 }}
                            />
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Laptop base */}
              <div
                className="mx-auto h-2.5 rounded-b-lg"
                style={{ width: "80%", background: "#CBD5E1" }}
              />
              <div
                className="mx-auto h-1.5 rounded-b-xl"
                style={{ width: "90%", background: "#E2E8F0" }}
              />
            </div>

            {/* Feature pills — morph with tab */}
            <div className="flex flex-wrap justify-center gap-2 mt-5">
              <AnimatePresence>
                {persona.pills.map((pill, i) => (
                  <motion.span
                    key={`${persona.id}-${pill}`}
                    initial={{ opacity: 0, y: 10, scale: 0.92 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.92 }}
                    transition={{ duration: 0.25, delay: i * 0.05 }}
                    className="tag-green px-4 py-2 rounded-full text-xs font-medium"
                  >
                    {pill}
                  </motion.span>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Scroll hint — only shows at top */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ color: "#9CA3AF" }}
        >
          <p className="text-xs" style={{ fontFamily: "var(--font-sans)" }}>
            scroll to explore
          </p>
          <div className="w-px h-6" style={{ background: "linear-gradient(to bottom, #9CA3AF, transparent)" }} />
        </motion.div>
      </div>
    </section>
  );
}
