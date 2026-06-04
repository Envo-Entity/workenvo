"use client";

import { motion } from "motion/react";

const LINES = [
  "The employee has already resigned.",
  "The manager has already damaged morale.",
  "The team is already disengaged.",
  "The investigation has already started.",
  "The performance issue has already escalated.",
];

export default function TimingProblem() {
  return (
    <section style={{ background: "#111827" }} className="relative overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr]">
        {/* LEFT — atmospheric image */}
        <div
          className="relative lg:block"
          style={{ aspectRatio: "3/4", overflow: "hidden" }}
        >
          <img
            src="/images/timing-problem-exhausted-hr.webp"
            alt="HR manager working late at her desk"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center top",
            }}
          />
          {/* Desktop: right-edge fade into dark text column */}
          <div
            className="hidden lg:block"
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "140px",
              height: "100%",
              background: "linear-gradient(to right, transparent, #111827)",
              pointerEvents: "none",
            }}
          />
          {/* Mobile: bottom-edge fade into dark text below */}
          <div
            className="lg:hidden"
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "100px",
              background: "linear-gradient(to bottom, transparent, #111827)",
              pointerEvents: "none",
            }}
          />
          {/* Mobile: dark vignette on top-left corner for atmosphere */}
          <div
            className="lg:hidden"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "60px",
              background: "linear-gradient(to bottom, #111827, transparent)",
              pointerEvents: "none",
            }}
          />
        </div>

        {/* RIGHT — text content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "clamp(56px, 8vw, 96px) clamp(24px, 5vw, 72px)",
            position: "relative",
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(ellipse 80% 60% at 20% 50%, rgba(22,133,91,0.07) 0%, transparent 70%)",
            }}
          />

          <div className="relative z-10">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "#16855B",
                marginBottom: "24px",
              }}
            >
              The real HR problem
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.08 }}
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(28px, 4vw, 52px)",
                fontWeight: 400,
                lineHeight: 1.12,
                color: "#FFFFFF",
                marginBottom: "8px",
              }}
            >
              By the time you find out,
            </motion.h2>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.13 }}
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(28px, 4vw, 52px)",
                fontWeight: 400,
                lineHeight: 1.12,
                color: "rgba(255,255,255,0.35)",
                marginBottom: "24px",
              }}
            >
              it&apos;s already happened.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "clamp(14px, 1.4vw, 17px)",
                color: "rgba(255,255,255,0.35)",
                lineHeight: 1.65,
                marginBottom: "40px",
                maxWidth: "420px",
              }}
            >
              HR doesn&apos;t have a data problem. HR has a timing problem.
            </motion.p>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "clamp(12px, 1.8vh, 18px)",
                marginBottom: "40px",
              }}
            >
              {LINES.map((line, i) => (
                <motion.p
                  key={line}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-20px" }}
                  transition={{ duration: 0.45, delay: 0.28 + i * 0.09 }}
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontWeight: 400,
                    fontSize: "clamp(16px, 2.2vw, 26px)",
                    lineHeight: 1.35,
                    color: "rgba(255,255,255,0.78)",
                  }}
                >
                  {line}
                </motion.p>
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
