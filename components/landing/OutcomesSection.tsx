"use client";

import React from "react";
import { motion } from "motion/react";

// Inline SVG icons — consistent minimal line-art style
function IconEye() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function IconLightbulb() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <line x1="9" y1="18" x2="15" y2="18" />
      <line x1="10" y1="22" x2="14" y2="22" />
      <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
    </svg>
  );
}

function IconUsers() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function IconShield() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  );
}

function IconGlobe() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

const topRow = [
  {
    Icon: IconEye,
    label: "Early Visibility",
    quote: "We saw this coming sooner.",
    desc: "Surface risks before they become crises.",
  },
  {
    Icon: IconLightbulb,
    label: "Better Decisions",
    quote: "We knew what to do.",
    desc: "AI-powered recommendations, not just data.",
  },
  {
    Icon: IconUsers,
    label: "Leadership Consistency",
    quote: "Managers behave more consistently.",
    desc: "Align behaviour with intent across the org.",
  },
];

const bottomRow = [
  {
    Icon: IconShield,
    label: "Culture Strength",
    quote: "Culture is visible and reinforced.",
    desc: "Make culture measurable, not just aspirational.",
    wide: true,
  },
  {
    Icon: IconGlobe,
    label: "ESG Impact",
    quote: "We can prove behavioural change.",
    desc: "From commitments to evidence.",
    wide: false,
  },
];

function OutcomeCard({
  Icon,
  label,
  quote,
  desc,
  delay,
}: {
  Icon: () => React.ReactElement;
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

      {/* Icon */}
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
        style={{ background: "#ECFDF5", color: "#16855B" }}
      >
        <Icon />
      </div>

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
      style={{ background: "#F9FAFB" }}
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

        {/* Top row — 3 equal cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {topRow.map((outcome, i) => (
            <OutcomeCard key={outcome.label} {...outcome} delay={i * 0.1} />
          ))}
        </div>

        {/* Bottom row — wide + narrow */}
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
