"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

const LINES = [
  "The employee has already resigned.",
  "The manager has already damaged morale.",
  "The team is already disengaged.",
  "The investigation has already started.",
  "The performance issue has already escalated.",
];

function RevealLine({
  text,
  index,
  total,
  scrollYProgress,
}: {
  text: string;
  index: number;
  total: number;
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const start = 0.15 + (index / total) * 0.5;
  const end = start + 0.12;
  const opacity = useTransform(scrollYProgress, [start, end], [0, 1]);
  const x = useTransform(scrollYProgress, [start, end], [-24, 0]);

  return (
    <motion.p
      style={{
        opacity,
        x,
        fontFamily: "var(--font-serif)",
        fontWeight: 400,
        fontSize: "clamp(18px, 2.4vw, 30px)",
        lineHeight: 1.35,
        color: "rgba(255,255,255,0.75)",
      }}
    >
      {text}
    </motion.p>
  );
}

export default function TimingProblem() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const closingOpacity = useTransform(scrollYProgress, [0.82, 0.96], [0, 1]);
  const closingY = useTransform(scrollYProgress, [0.82, 0.96], [20, 0]);

  // Image fades in early and stays
  const imgOpacity = useTransform(scrollYProgress, [0, 0.12], [0.4, 1]);
  const imgScale = useTransform(scrollYProgress, [0, 0.12], [1.04, 1]);

  return (
    <section
      ref={sectionRef}
      style={{ minHeight: "320vh", background: "#111827" }}
      className="relative"
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          display: "grid",
          gridTemplateColumns: "1fr",
        }}
        className="lg:grid-cols-[5fr_7fr]"
      >
        {/* LEFT — atmospheric person image */}
        <motion.div
          style={{
            opacity: imgOpacity,
            scale: imgScale,
            position: "relative",
            overflow: "hidden",
          }}
          className="hidden lg:block"
        >
          <img
            src="/images/timing-problem-exhausted-hr.webp"
            alt="HR manager working late, exhausted at her desk"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center top",
            }}
          />

          {/* Right-edge fade to blend into text column */}
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "120px",
              height: "100%",
              background: "linear-gradient(to right, transparent, #111827)",
              pointerEvents: "none",
            }}
          />
        </motion.div>

        {/* RIGHT — text content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "clamp(40px, 6vw, 80px) clamp(24px, 5vw, 72px)",
            position: "relative",
          }}
        >
          {/* Ambient glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(ellipse 80% 60% at 20% 50%, rgba(22,133,91,0.07) 0%, transparent 70%)",
            }}
          />

          <div className="relative z-10">
            {/* Label */}
            <p
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
            </p>

            {/* Heading */}
            <h2
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(28px, 4vw, 52px)",
                fontWeight: 400,
                lineHeight: 1.12,
                color: "#FFFFFF",
                marginBottom: "10px",
              }}
            >
              By the time you find out,
            </h2>
            <h2
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(28px, 4vw, 52px)",
                fontWeight: 400,
                lineHeight: 1.12,
                color: "rgba(255,255,255,0.38)",
                marginBottom: "20px",
              }}
            >
              it&apos;s already happened.
            </h2>

            {/* Sub */}
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "clamp(14px, 1.4vw, 17px)",
                color: "rgba(255,255,255,0.35)",
                lineHeight: 1.65,
                marginBottom: "48px",
                maxWidth: "420px",
              }}
            >
              HR doesn&apos;t have a data problem. HR has a timing problem.
            </p>

            {/* Revealing lines */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "clamp(14px, 2vh, 22px)",
                marginBottom: "40px",
              }}
            >
              {LINES.map((line, i) => (
                <RevealLine
                  key={line}
                  text={line}
                  index={i}
                  total={LINES.length}
                  scrollYProgress={scrollYProgress}
                />
              ))}
            </div>

            {/* Closing line */}
            <motion.p
              style={{
                opacity: closingOpacity,
                y: closingY,
                fontFamily: "var(--font-sans)",
                fontSize: "clamp(14px, 1.5vw, 17px)",
                fontWeight: 500,
                color: "#16855B",
              }}
            >
              HR spends most of its time reacting. We think it&apos;s time that changed.
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}
