"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

const comparisons = [
  { traditional: "Dashboards", workenvo: "Behavioural signals" },
  { traditional: "Surveys", workenvo: "Real-time insights" },
  { traditional: "Reports", workenvo: "Action + capability building" },
  { traditional: "Past data", workenvo: "What's changing now" },
  { traditional: "Reactive", workenvo: "Predictive" },
  { traditional: "Siloed tools", workenvo: "Connected intelligence" },
];

const tradKeywords = ["Dashboards", "Surveys", "Reports", "Lagging"];
const workenvoKeywords = ["Signals", "Real-time", "Action", "Capability"];

export default function Differentiation() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Divider: starts at 80% (Traditional dominates) → 20% (Workenvo takes over)
  const dividerLeft = useTransform(scrollYProgress, [0.15, 0.85], ["80%", "20%"]);

  // Traditional side fades and blurs out dramatically
  const tradOpacity = useTransform(scrollYProgress, [0.2, 0.85], [0.85, 0.18]);
  const tradBlur = useTransform(scrollYProgress, [0.2, 0.85], [0, 3]);

  // Workenvo side grows from small to dominant
  const workenvoScale = useTransform(scrollYProgress, [0.15, 0.85], [0.95, 1.02]);

  // Blur filter string for traditional side
  const tradFilter = useTransform(tradBlur, (b) => `blur(${b}px)`);

  return (
    <section
      ref={sectionRef}
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
          <p
            className="text-lg mx-auto"
            style={{
              color: "#6B7280",
              fontFamily: "var(--font-sans)",
              maxWidth: "520px",
            }}
          >
            Workenvo is not HR software. It is a system for understanding,
            influencing, and scaling organisational behaviour.
          </p>
        </motion.div>

        {/* Split screen */}
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{ minHeight: "500px" }}
        >
          {/* Traditional side */}
          <motion.div
            style={{ opacity: tradOpacity, filter: tradFilter }}
            className="absolute inset-0"
          >
            <div
              className="absolute inset-0"
              style={{ background: "#F9FAFB" }}
            />
            <div className="absolute inset-0 flex flex-col justify-center p-10 lg:p-16 max-w-[50%]">
              <p
                className="text-xs font-semibold uppercase tracking-wider mb-4"
                style={{ color: "#9CA3AF", fontFamily: "var(--font-sans)" }}
              >
                Traditional Tools
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {tradKeywords.map((kw, i) => (
                  <motion.span
                    key={kw}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="px-3 py-1.5 rounded-full text-sm"
                    style={{
                      background: "#F3F4F6",
                      color: "#9CA3AF",
                      border: "1px solid #E5E7EB",
                      fontFamily: "var(--font-sans)",
                    }}
                  >
                    {kw}
                  </motion.span>
                ))}
              </div>
              <div className="space-y-3">
                {comparisons.map((row, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-center gap-3"
                  >
                    <span
                      className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 text-xs font-bold"
                      style={{ background: "#FEE2E2", color: "#EF4444" }}
                    >
                      ✕
                    </span>
                    <span
                      className="text-sm"
                      style={{ color: "#9CA3AF", fontFamily: "var(--font-sans)" }}
                    >
                      {row.traditional}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Workenvo side — clips from right */}
          <motion.div
            style={{ scale: workenvoScale }}
            className="absolute inset-0"
          >
            {/* Background */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(135deg, #F0FDF9 0%, #ECFDF5 100%)",
              }}
            />

            {/* Content, positioned right half */}
            <div className="absolute inset-0 flex flex-col justify-center p-10 lg:p-16 items-end">
              <div className="max-w-xs w-full">
                <div className="mb-6">
                  <p
                    className="text-xs font-semibold uppercase tracking-wider mb-3"
                    style={{ color: "#16855B", fontFamily: "var(--font-sans)" }}
                  >
                    ✦ Workenvo
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {workenvoKeywords.map((kw, i) => (
                      <motion.span
                        key={kw}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                        className="px-3 py-1.5 rounded-full text-sm font-medium"
                        style={{
                          background: "rgba(22,133,91,0.12)",
                          color: "#065F46",
                          border: "1px solid rgba(22,133,91,0.25)",
                          fontFamily: "var(--font-sans)",
                        }}
                      >
                        {kw}
                      </motion.span>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  {comparisons.map((row, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.08 }}
                      className="flex items-center gap-3"
                    >
                      <span
                        className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 text-xs"
                        style={{ background: "#16855B", color: "#FFFFFF" }}
                      >
                        ✓
                      </span>
                      <span
                        className="text-sm font-medium"
                        style={{ color: "#111827", fontFamily: "var(--font-sans)" }}
                      >
                        {row.workenvo}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Divider line */}
          <motion.div
            ref={dividerRef}
            className="absolute top-0 bottom-0 z-20 pointer-events-none"
            style={{
              left: dividerLeft,
              background:
                "linear-gradient(180deg, transparent 0%, #16855B 20%, #16855B 80%, transparent 100%)",
              width: "2px",
            }}
          >
            {/* Divider dot */}
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full"
              style={{
                background: "#16855B",
                boxShadow: "0 0 12px rgba(22,133,91,0.6)",
              }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
