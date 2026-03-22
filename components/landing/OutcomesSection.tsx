"use client";

import { motion } from "motion/react";

const topRow = [
  {
    emoji: "🔭",
    label: "Early Visibility",
    quote: "We saw this coming sooner.",
    desc: "Surface risks before they become crises.",
  },
  {
    emoji: "🧠",
    label: "Better Decisions",
    quote: "We knew what to do.",
    desc: "AI-powered recommendations, not just data.",
  },
  {
    emoji: "🤝",
    label: "Leadership Consistency",
    quote: "Managers behave more consistently.",
    desc: "Align behaviour with intent across the org.",
  },
];

const bottomRow = [
  {
    emoji: "🌱",
    label: "Culture Strength",
    quote: "Culture is visible and reinforced.",
    desc: "Make culture measurable, not just aspirational.",
    wide: true,
  },
  {
    emoji: "🌍",
    label: "ESG Impact",
    quote: "We can prove behavioural change.",
    desc: "From commitments to evidence.",
    wide: false,
  },
];

function OutcomeCard({
  emoji,
  label,
  quote,
  desc,
  delay,
}: {
  emoji: string;
  label: string;
  quote: string;
  desc: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      whileHover={{
        y: -5,
        boxShadow: "0 20px 40px rgba(22,133,91,0.12), 0 4px 8px rgba(22,133,91,0.06)",
        transition: { duration: 0.25 },
      }}
      className="rounded-2xl p-8 relative overflow-hidden cursor-default h-full"
      style={{
        background: "#FFFFFF",
        border: "1px solid #E5E7EB",
        boxShadow: "0 1px 3px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.04)",
        minHeight: "200px",
      }}
    >
      {/* Corner accent */}
      <div
        className="absolute top-0 right-0 w-16 h-16 pointer-events-none"
        style={{
          background: "linear-gradient(225deg, rgba(22,133,91,0.06) 0%, transparent 70%)",
        }}
      />

      {/* Emoji with hover bounce */}
      <motion.div
        whileHover={{ rotate: [0, -10, 10, -5, 0], scale: 1.15 }}
        transition={{ duration: 0.5 }}
        className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-5"
        style={{ background: "#ECFDF5" }}
      >
        {emoji}
      </motion.div>

      <p
        className="text-xs font-semibold uppercase tracking-wider mb-3"
        style={{ color: "#16855B", fontFamily: "var(--font-sans)" }}
      >
        {label}
      </p>

      <h3
        className="text-xl lg:text-2xl mb-3 italic leading-snug"
        style={{
          fontFamily: "var(--font-serif)",
          color: "#111827",
          fontWeight: 400,
        }}
      >
        &ldquo;{quote}&rdquo;
      </h3>

      <p className="text-sm" style={{ color: "#6B7280", fontFamily: "var(--font-sans)" }}>
        {desc}
      </p>
    </motion.div>
  );
}

export default function OutcomesSection() {
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
          className="mb-16"
        >
          <p
            className="text-xs font-semibold tracking-widest uppercase mb-4"
            style={{ color: "#16855B", fontFamily: "var(--font-sans)" }}
          >
            Value & Outcomes
          </p>
          <h2
            className="text-4xl lg:text-[48px] leading-tight mb-4"
            style={{
              fontFamily: "var(--font-serif)",
              color: "#111827",
              fontWeight: 400,
            }}
          >
            What Workenvo makes possible
          </h2>
          <p className="text-lg" style={{ color: "#6B7280", fontFamily: "var(--font-sans)" }}>
            Real outcomes for people who shape organisations.
          </p>
        </motion.div>

        {/* Top row — 3 equal cards, stagger first */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {topRow.map((outcome, i) => (
            <OutcomeCard key={outcome.label} {...outcome} delay={i * 0.1} />
          ))}
        </div>

        {/* Bottom row — wide + narrow, stagger after top row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {bottomRow.map((outcome, i) => (
            <div key={outcome.label} className={outcome.wide ? "md:col-span-2" : ""}>
              <OutcomeCard {...outcome} delay={0.4 + i * 0.12} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
