"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

const quotes = [
  {
    text: "Something feels off — but I can't prove it yet.",
    role: "People Manager, Series B",
    depth: -20,
    delay: 0,
    x: -40,
  },
  {
    text: "We're always reacting instead of leading.",
    role: "HR Director, 800 employees",
    depth: 0,
    delay: 0.15,
    x: 60,
  },
  {
    text: "Leadership expects answers I don't have.",
    role: "VP People, Scale-up",
    depth: 20,
    delay: 0.3,
    x: -20,
  },
];

export default function EmotionalReality() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Scroll-driven focus: each quote sharpens in turn
  const q0opacity = useTransform(scrollYProgress, [0, 0.25, 0.45, 0.65], [0.35, 1, 1, 0.3]);
  const q1opacity = useTransform(scrollYProgress, [0.2, 0.4, 0.6, 0.8], [0.3, 1, 1, 0.3]);
  const q2opacity = useTransform(scrollYProgress, [0.45, 0.65, 0.85, 1], [0.3, 1, 1, 1]);
  const opacities = [q0opacity, q1opacity, q2opacity];

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        background: "#0f172a",
        minHeight: "100vh",
        paddingTop: "120px",
        paddingBottom: "120px",
      }}
    >
      {/* Faint blurred dashboard screenshot hint */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='1200' height='700' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='1200' height='700' fill='%230F172A'/%3E%3Crect x='60' y='60' width='320' height='180' rx='12' fill='%231E293B'/%3E%3Crect x='400' y='60' width='320' height='180' rx='12' fill='%231E293B'/%3E%3Crect x='740' y='60' width='400' height='180' rx='12' fill='%231E293B'/%3E%3Crect x='60' y='270' width='720' height='300' rx='12' fill='%231E293B'/%3E%3Crect x='800' y='270' width='340' height='300' rx='12' fill='%231E293B'/%3E%3Crect x='80' y='90' width='120' height='10' rx='5' fill='%2316855B' opacity='0.5'/%3E%3Crect x='80' y='110' width='180' height='8' rx='4' fill='%23334155' opacity='0.7'/%3E%3Crect x='80' y='130' width='140' height='8' rx='4' fill='%23334155' opacity='0.5'/%3E%3Crect x='80' y='300' width='300' height='8' rx='4' fill='%23334155' opacity='0.5'/%3E%3Crect x='80' y='320' width='240' height='8' rx='4' fill='%23334155' opacity='0.4'/%3E%3Crect x='80' y='340' width='280' height='8' rx='4' fill='%23334155' opacity='0.3'/%3E%3Cpath d='M80 430 L180 390 L280 410 L380 370 L480 385 L580 355 L680 360 L760 340' stroke='%2316855B' stroke-width='2' fill='none' opacity='0.5'/%3E%3C/svg%3E\")",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(14px)",
          opacity: 0.09,
        }}
      />

      {/* Atmospheric gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 30% 50%, rgba(22,133,91,0.07) 0%, transparent 55%), radial-gradient(ellipse at 70% 30%, rgba(99,102,241,0.05) 0%, transparent 55%)",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Section label */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-xs font-semibold tracking-widest uppercase mb-6 text-center"
          style={{ color: "#34D399", fontFamily: "var(--font-sans)" }}
        >
          Emotional Reality
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl lg:text-5xl leading-tight text-center mb-6 mx-auto"
          style={{
            fontFamily: "var(--font-serif)",
            color: "#F1F5F9",
            fontWeight: 400,
            maxWidth: "640px",
          }}
        >
          Behind the dashboards
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="text-base text-center mb-24 mx-auto"
          style={{ color: "rgba(148,163,184,0.8)", fontFamily: "var(--font-sans)", maxWidth: "480px" }}
        >
          There&apos;s uncertainty that data doesn&apos;t capture — and
          conversations that happen before the reports.
        </motion.p>

        {/* Floating quotes — glassmorphism */}
        <div className="flex flex-col lg:flex-row items-stretch justify-center gap-6 lg:gap-8">
          {quotes.map((quote, i) => (
            <motion.div
              key={i}
              style={{ opacity: opacities[i] }}
              initial={{ y: 50 + quote.depth, x: quote.x * 0.5 }}
              whileInView={{ y: 0, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.9,
                delay: quote.delay,
                type: "spring",
                stiffness: 60,
                damping: 18,
              }}
              whileHover={{ y: -6, transition: { duration: 0.3 } }}
              className="flex-1 max-w-sm mx-auto lg:mx-0"
            >
              <div
                className="h-full rounded-2xl p-7 relative overflow-hidden transition-all duration-300"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.border = "1px solid rgba(52,211,153,0.3)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "0 20px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08), 0 0 0 1px rgba(52,211,153,0.15)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.border = "1px solid rgba(255,255,255,0.1)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "0 20px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)";
                }}
              >
                {/* Inner top shine */}
                <div
                  className="absolute top-0 left-0 right-0 h-px"
                  style={{
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
                  }}
                />

                {/* Quote mark */}
                <div
                  className="text-5xl leading-none mb-4"
                  style={{ color: "rgba(52,211,153,0.35)", fontFamily: "Georgia, serif" }}
                >
                  &ldquo;
                </div>

                <p
                  className="text-lg leading-relaxed mb-6"
                  style={{
                    color: "#CBD5E1",
                    fontFamily: "var(--font-serif)",
                    fontStyle: "italic",
                    fontWeight: 400,
                  }}
                >
                  {quote.text}
                </p>

                <p className="text-xs" style={{ color: "#64748B", fontFamily: "var(--font-sans)" }}>
                  — {quote.role}
                </p>

                {/* Corner glow */}
                <div
                  className="absolute bottom-0 right-0 w-24 h-24 rounded-full pointer-events-none"
                  style={{
                    background: "radial-gradient(circle, rgba(22,133,91,0.12) 0%, transparent 70%)",
                    filter: "blur(12px)",
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom line */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-16 text-base font-medium"
          style={{ color: "#34D399", fontFamily: "var(--font-sans)" }}
        >
          The cost of not knowing shows up too late.
        </motion.p>
      </div>
    </section>
  );
}
