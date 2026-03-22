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

  // Scroll-driven focus: each quote becomes active as user scrolls through
  const q0opacity = useTransform(scrollYProgress, [0, 0.25, 0.45, 0.65], [0.35, 1, 1, 0.3]);
  const q1opacity = useTransform(scrollYProgress, [0.2, 0.4, 0.6, 0.8], [0.3, 1, 1, 0.3]);
  const q2opacity = useTransform(scrollYProgress, [0.45, 0.65, 0.85, 1], [0.3, 1, 1, 1]);

  const opacities = [q0opacity, q1opacity, q2opacity];

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        background: "#FAFDF9",
        minHeight: "100vh",
        paddingTop: "120px",
        paddingBottom: "120px",
      }}
    >
      {/* Subtle noise texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 60%, rgba(22,133,91,0.04) 0%, transparent 55%), radial-gradient(circle at 85% 30%, rgba(22,133,91,0.03) 0%, transparent 55%)",
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
          style={{ color: "#16855B", fontFamily: "var(--font-sans)" }}
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
            color: "#111827",
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
          style={{ color: "#6B7280", fontFamily: "var(--font-sans)", maxWidth: "480px" }}
        >
          There&apos;s uncertainty that data doesn&apos;t capture — and
          conversations that happen before the reports.
        </motion.p>

        {/* Floating quotes — scroll-focus driven */}
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
                className="h-full rounded-2xl p-7 relative overflow-hidden bg-white"
                style={{
                  borderLeft: "3px solid #16855B",
                  border: "1px solid #E5E7EB",
                  borderLeftWidth: "3px",
                  borderLeftColor: "#16855B",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)",
                }}
              >
                {/* Quote mark */}
                <div
                  className="text-5xl leading-none mb-4 font-serif"
                  style={{ color: "rgba(22,133,91,0.2)", fontFamily: "Georgia, serif" }}
                >
                  &ldquo;
                </div>

                <p
                  className="text-lg leading-relaxed mb-6"
                  style={{
                    color: "#374151",
                    fontFamily: "var(--font-serif)",
                    fontStyle: "italic",
                    fontWeight: 400,
                  }}
                >
                  {quote.text}
                </p>

                <p
                  className="text-xs"
                  style={{ color: "#9CA3AF", fontFamily: "var(--font-sans)" }}
                >
                  — {quote.role}
                </p>

                {/* Subtle green glow bottom-right */}
                <div
                  className="absolute bottom-0 right-0 w-24 h-24 rounded-full pointer-events-none"
                  style={{
                    background: "radial-gradient(circle, rgba(22,133,91,0.06) 0%, transparent 70%)",
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
          className="text-center mt-16 text-sm font-medium"
          style={{ color: "#16855B", fontFamily: "var(--font-sans)" }}
        >
          The cost of not knowing shows up too late.
        </motion.p>
      </div>
    </section>
  );
}
