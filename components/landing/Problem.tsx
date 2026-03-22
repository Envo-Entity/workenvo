"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

const problems = [
  {
    label: "Teams burn out",
    sub: "Undetected until it's too late",
    icon: "🔥",
    accent: "#EF4444",
    border: "rgba(239,68,68,0.2)",
    bg: "#FFF5F5",
  },
  {
    label: "Managers underperform",
    sub: "Support is guesswork without signals",
    icon: "📉",
    accent: "#F59E0B",
    border: "rgba(245,158,11,0.2)",
    bg: "#FFFBEB",
  },
  {
    label: "Culture drifts",
    sub: "Values on the wall, not in the workflow",
    icon: "🌊",
    accent: "#6366F1",
    border: "rgba(99,102,241,0.2)",
    bg: "#F5F5FF",
  },
];

export default function Problem() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Card 0 — fans left
  const c0x = useTransform(scrollYProgress, [0.05, 0.45], [0, -300]);
  const c0r = useTransform(scrollYProgress, [0.05, 0.45], [-2, -22]);
  const c0y = useTransform(scrollYProgress, [0.05, 0.45], [0, 60]);
  const c0opacity = useTransform(scrollYProgress, [0.05, 0.2], [0, 1]);

  // Card 1 — stays center
  const c1y = useTransform(scrollYProgress, [0.05, 0.45], [-8, 0]);
  const c1opacity = useTransform(scrollYProgress, [0.05, 0.25], [0, 1]);

  // Card 2 — fans right
  const c2x = useTransform(scrollYProgress, [0.05, 0.45], [0, 300]);
  const c2r = useTransform(scrollYProgress, [0.05, 0.45], [2, 22]);
  const c2y = useTransform(scrollYProgress, [0.05, 0.45], [-16, 60]);
  const c2opacity = useTransform(scrollYProgress, [0.05, 0.3], [0, 1]);

  // Headline reveal
  const hOpacity = useTransform(scrollYProgress, [0.5, 0.7], [0, 1]);
  const hY = useTransform(scrollYProgress, [0.5, 0.7], [40, 0]);

  // Sub copy
  const subOpacity = useTransform(scrollYProgress, [0.62, 0.78], [0, 1]);
  const subY = useTransform(scrollYProgress, [0.62, 0.78], [20, 0]);

  return (
    <section
      ref={sectionRef}
      style={{ minHeight: "320vh", background: "#f8faf9" }}
      className="relative"
    >
      <div
        style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}
        className="flex flex-col items-center justify-center px-6"
      >
        {/* Subtle bg texture */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, rgba(22,133,91,0.03) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(99,102,241,0.03) 0%, transparent 60%)",
          }}
        />

        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative z-10 text-xs font-semibold tracking-widest uppercase mb-16 text-center"
          style={{ color: "#16855B", fontFamily: "var(--font-sans)" }}
        >
          The Visibility Gap
        </motion.p>

        {/* Card stack */}
        <div
          className="relative z-10"
          style={{ width: "360px", height: "260px" }}
        >
          {/* Card 0 */}
          <motion.div
            style={{
              x: c0x,
              rotate: c0r,
              y: c0y,
              opacity: c0opacity,
              position: "absolute",
              inset: 0,
              background: problems[0].bg,
              border: `1px solid ${problems[0].border}`,
              borderTop: `3px solid ${problems[0].accent}`,
              borderRadius: "16px",
              padding: "36px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.07), 0 4px 16px rgba(0,0,0,0.04)",
              zIndex: 1,
            }}
          >
            <div className="text-3xl mb-3">{problems[0].icon}</div>
            <h3
              className="text-2xl mb-2"
              style={{ fontFamily: "var(--font-serif)", color: "#111827", fontWeight: 600 }}
            >
              {problems[0].label}
            </h3>
            <p
              className="text-xs leading-relaxed"
              style={{ color: "#6B7280", fontFamily: "var(--font-sans)" }}
            >
              {problems[0].sub}
            </p>
          </motion.div>

          {/* Card 1 */}
          <motion.div
            style={{
              y: c1y,
              opacity: c1opacity,
              position: "absolute",
              inset: 0,
              background: problems[1].bg,
              border: `1px solid ${problems[1].border}`,
              borderTop: `3px solid ${problems[1].accent}`,
              borderRadius: "16px",
              padding: "36px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.07), 0 4px 16px rgba(0,0,0,0.04)",
              zIndex: 2,
            }}
          >
            <div className="text-3xl mb-3">{problems[1].icon}</div>
            <h3
              className="text-2xl mb-2"
              style={{ fontFamily: "var(--font-serif)", color: "#111827", fontWeight: 400 }}
            >
              {problems[1].label}
            </h3>
            <p
              className="text-xs leading-relaxed"
              style={{ color: "#6B7280", fontFamily: "var(--font-sans)" }}
            >
              {problems[1].sub}
            </p>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            style={{
              x: c2x,
              rotate: c2r,
              y: c2y,
              opacity: c2opacity,
              position: "absolute",
              inset: 0,
              background: problems[2].bg,
              border: `1px solid ${problems[2].border}`,
              borderTop: `3px solid ${problems[2].accent}`,
              borderRadius: "16px",
              padding: "36px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.07), 0 4px 16px rgba(0,0,0,0.04)",
              zIndex: 1,
            }}
          >
            <div className="text-3xl mb-3">{problems[2].icon}</div>
            <h3
              className="text-2xl mb-2"
              style={{ fontFamily: "var(--font-serif)", color: "#111827", fontWeight: 400 }}
            >
              {problems[2].label}
            </h3>
            <p
              className="text-xs leading-relaxed"
              style={{ color: "#6B7280", fontFamily: "var(--font-sans)" }}
            >
              {problems[2].sub}
            </p>
          </motion.div>
        </div>

        {/* Headline */}
        <motion.div
          style={{ opacity: hOpacity, y: hY }}
          className="relative z-10 text-center mt-16 max-w-3xl px-4"
        >
          <h2
            className="text-4xl lg:text-6xl leading-tight mb-5"
            style={{ fontFamily: "var(--font-serif)", color: "#111827", fontWeight: 400 }}
          >
            Why didn&apos;t we see this{" "}
            <span
              style={{
                color: "#D97706",
                display: "inline-block",
                animation: "tremble 0.7s ease-in-out 0.3s both",
              }}
            >
              earlier?
            </span>
          </h2>
        </motion.div>

        {/* Sub copy */}
        <motion.div
          style={{ opacity: subOpacity, y: subY }}
          className="relative z-10 text-center max-w-2xl px-4"
        >
          <p
            className="text-lg leading-relaxed"
            style={{ color: "#6B7280", fontFamily: "var(--font-sans)" }}
          >
            Organisations invest in surveys, performance tools, and ESG
            platforms — but these only show what already happened, not
            what&apos;s changing or what to do next.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
