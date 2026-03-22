"use client";

import { motion } from "motion/react";

// X icon for traditional tools
function IconX() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

// Check icon for Workenvo
function IconCheck() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

const traditional = [
  "Annual surveys, months-old data",
  "Static dashboards and reports",
  "Reactive — problems found too late",
  "Disconnected from strategy",
  "Compliance-only ESG reporting",
  "No behavioural context",
];

const workenvo = [
  "Real-time behavioural signals",
  "AI-driven insights and nudges",
  "Predictive — risks surfaced early",
  "Strategy connected to daily behaviour",
  "Behavioural ESG with measured impact",
  "Full organisational intelligence",
];

export default function Differentiation() {
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
            Differentiation
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
            Traditional tools vs Workenvo
          </h2>
        </motion.div>

        {/* Comparison card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="rounded-2xl overflow-hidden"
          style={{
            border: "1px solid #E5E7EB",
            boxShadow: "0 20px 60px rgba(0,0,0,0.07), 0 4px 16px rgba(0,0,0,0.04)",
          }}
        >
          <div className="grid md:grid-cols-2">
            {/* Left: Traditional */}
            <div
              className="p-8 lg:p-12 relative"
              style={{ background: "#F9FAFB", borderRight: "1px solid #E5E7EB" }}
            >
              {/* Muted header */}
              <div className="mb-8">
                <p
                  className="text-xs font-semibold uppercase tracking-wider mb-2"
                  style={{ color: "#9CA3AF", fontFamily: "var(--font-sans)" }}
                >
                  Traditional tools
                </p>
                <p
                  className="text-sm"
                  style={{ color: "#9CA3AF", fontFamily: "var(--font-sans)" }}
                >
                  The way it&apos;s always been done.
                </p>
              </div>

              <div className="space-y-3.5">
                {traditional.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.07 }}
                    className="flex items-center gap-3"
                  >
                    <span
                      className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
                      style={{ background: "#FEE2E2", color: "#EF4444" }}
                    >
                      <IconX />
                    </span>
                    <span
                      className="text-sm"
                      style={{ color: "#9CA3AF", fontFamily: "var(--font-sans)" }}
                    >
                      {item}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right: Workenvo */}
            <div
              className="p-8 lg:p-12 relative"
              style={{
                background: "linear-gradient(135deg, #F0FDF9 0%, #ECFDF5 100%)",
              }}
            >
              {/* Brand header */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                  <p
                    className="text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "#16855B", fontFamily: "var(--font-sans)" }}
                  >
                    Workenvo
                  </p>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-semibold"
                    style={{
                      background: "rgba(22,133,91,0.12)",
                      color: "#16855B",
                      fontFamily: "var(--font-sans)",
                    }}
                  >
                    New category
                  </span>
                </div>
                <p
                  className="text-sm"
                  style={{ color: "#065F46", fontFamily: "var(--font-sans)" }}
                >
                  Behaviour Intelligence — built for what&apos;s next.
                </p>
              </div>

              <div className="space-y-3.5">
                {workenvo.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.15 + i * 0.07 }}
                    className="flex items-center gap-3"
                  >
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: "#16855B", color: "#FFFFFF" }}
                    >
                      <IconCheck />
                    </span>
                    <span
                      className="text-sm font-medium"
                      style={{ color: "#111827", fontFamily: "var(--font-sans)" }}
                    >
                      {item}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-10 text-lg mx-auto"
          style={{
            color: "#6B7280",
            fontFamily: "var(--font-sans)",
            maxWidth: "560px",
          }}
        >
          Workenvo is not HR software. It is a system for understanding,
          influencing, and scaling organisational behaviour.
        </motion.p>
      </div>
    </section>
  );
}
