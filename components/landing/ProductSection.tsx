"use client";

import { useState } from "react";

import { motion, AnimatePresence } from "motion/react";

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
    pills: [
      "Log behaviours",
      "Earn rewards",
      "Participate in surveys",
      "Receive AI nudges",
    ],
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
    pills: [
      "Real-time alerts",
      "Behaviour insights",
      "Recommended actions",
      "Performance tracking",
    ],
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
    pills: [
      "Org-wide insights",
      "Capability tracking",
      "ESG metrics",
      "Risk detection",
    ],
  },
];

export default function ProductSection() {
  const [activeIdx, setActiveIdx] = useState(1);
  const persona = personas[activeIdx];

  return (
    <section
      className="relative py-32 px-6 overflow-hidden"
      style={{ background: "#FFFFFF" }}
    >
      <div className="max-w-6xl mx-auto">
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
            Product Experience
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
            Built for everyone who shapes performance
          </h2>
          <p
            className="text-lg mx-auto"
            style={{
              color: "#6B7280",
              fontFamily: "var(--font-sans)",
              maxWidth: "480px",
            }}
          >
            One platform. Three different lenses.
          </p>
        </motion.div>

        {/* Persona tabs */}
        <div className="flex justify-center gap-2 mb-10">
          {personas.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setActiveIdx(i)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300"
              style={{
                background: activeIdx === i ? "#16855B" : "#F9FAFB",
                color: activeIdx === i ? "#FFFFFF" : "#6B7280",
                border: activeIdx === i ? "none" : "1px solid #E5E7EB",
                boxShadow:
                  activeIdx === i ? "0 4px 12px rgba(22,133,91,0.3)" : "none",
                fontFamily: "var(--font-sans)",
              }}
            >
              <span>{p.emoji}</span>
              <span>{p.label}</span>
            </button>
          ))}
        </div>

        {/* Device mockup */}
        <div className="flex flex-col items-center">
          {/* Laptop frame */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative w-full max-w-2xl"
          >
            {/* Screen body */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: "#1E293B",
                border: "8px solid #334155",
                boxShadow:
                  "0 40px 80px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.05)",
              }}
            >
              {/* Browser bar */}
              <div
                className="flex items-center gap-2 px-4 py-3"
                style={{
                  background: "#0F172A",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div className="w-3 h-3 rounded-full bg-red-500 opacity-70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500 opacity-70" />
                <div className="w-3 h-3 rounded-full bg-green-500 opacity-70" />
                <div
                  className="flex-1 mx-4 h-6 rounded-md flex items-center px-3"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                >
                  <span
                    className="text-xs"
                    style={{ color: "rgba(255,255,255,0.3)" }}
                  >
                    app.workenvo.com/dashboard
                  </span>
                </div>
              </div>

              {/* Screen content */}
              <div className="p-6" style={{ minHeight: "280px" }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={persona.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.35 }}
                  >
                    {/* Screen header */}
                    <div className="flex items-center justify-between mb-5">
                      <div>
                        <h3
                          className="text-base font-semibold"
                          style={{
                            color: "#F1F5F9",
                            fontFamily: "var(--font-sans)",
                          }}
                        >
                          {persona.screen.title}
                        </h3>
                        <p
                          className="text-xs mt-0.5"
                          style={{
                            color: "#64748B",
                            fontFamily: "var(--font-sans)",
                          }}
                        >
                          {persona.screen.subtitle}
                        </p>
                      </div>
                      <div
                        className="px-3 py-1 rounded-full text-xs font-medium"
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

                    {/* Items */}
                    <div className="space-y-3">
                      {persona.screen.items.map((item, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: i * 0.07 }}
                          className="flex items-center gap-3 rounded-xl px-4 py-3"
                          style={{
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.06)",
                          }}
                        >
                          <span className="text-base">{item.icon}</span>
                          <span
                            className="text-sm"
                            style={{
                              color: "#CBD5E1",
                              fontFamily: "var(--font-sans)",
                            }}
                          >
                            {item.label}
                          </span>
                          <div
                            className="ml-auto w-2 h-2 rounded-full flex-shrink-0"
                            style={{ background: item.color, opacity: 0.7 }}
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
              className="mx-auto h-3 rounded-b-lg"
              style={{
                width: "80%",
                background: "#475569",
                boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
              }}
            />
            <div
              className="mx-auto h-1.5 rounded-b-xl"
              style={{ width: "90%", background: "#334155" }}
            />
          </motion.div>

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-2 mt-8">
            <AnimatePresence>
              {persona.pills.map((pill, i) => (
                <motion.span
                  key={`${persona.id}-${pill}`}
                  initial={{ opacity: 0, y: 12, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: i * 0.06 }}
                  className="tag-green px-4 py-2 rounded-full text-sm font-medium"
                >
                  {pill}
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
