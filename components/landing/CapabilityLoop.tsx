"use client";

import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const steps = [
  {
    num: "01",
    name: "Define",
    desc: "Identify the capabilities your organisation needs. Start with strategy, not assumption.",
    emoji: "🎯",
    color: "#16855B",
  },
  {
    num: "02",
    name: "Translate",
    desc: "Map the behaviours that drive those capabilities. Make the intangible concrete.",
    emoji: "🔀",
    color: "#059669",
  },
  {
    num: "03",
    name: "Detect",
    desc: "Surface signals and risks in real time. See what's changing before it becomes a problem.",
    emoji: "👁️",
    color: "#0D9488",
  },
  {
    num: "04",
    name: "Reinforce",
    desc: "Drive adoption through incentives and engagement. Reward the behaviours that matter.",
    emoji: "💪",
    color: "#0891B2",
  },
  {
    num: "05",
    name: "Build & Prove",
    desc: "Turn behaviour into measurable capability. Prove the impact of culture.",
    emoji: "📈",
    color: "#6366F1",
  },
];

// Node positions on a larger circle (r=200, center=260,260), starting from top
const RADIUS = 200;
const CENTER = 260;
const SVG_SIZE = 520;

function nodePos(i: number) {
  const angle = (i / 5) * 2 * Math.PI - Math.PI / 2;
  return {
    x: CENTER + RADIUS * Math.cos(angle),
    y: CENTER + RADIUS * Math.sin(angle),
  };
}

// Label offset — push labels outward from center
function labelOffset(i: number) {
  const angle = (i / 5) * 2 * Math.PI - Math.PI / 2;
  const labelR = RADIUS + 56;
  return {
    x: CENTER + labelR * Math.cos(angle),
    y: CENTER + labelR * Math.sin(angle),
    angle,
  };
}

export default function CapabilityLoop() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [litSteps, setLitSteps] = useState<number[]>([]);
  const [allLit, setAllLit] = useState(false);
  const [activeStep, setActiveStep] = useState<number | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    steps.forEach((_, i) => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: `top ${70 - i * 10}%`,
        once: true,
        onEnter: () => {
          setLitSteps((prev) => {
            const next = [...prev, i];
            if (next.length === steps.length) setAllLit(true);
            return next;
          });
        },
      });
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-32 px-6 overflow-hidden"
      style={{ background: "#F5F9F7" }}
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
          <span className="tag-green inline-block rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide mb-5">
            The Workenvo Capability Loop
          </span>
          <h2
            className="text-4xl lg:text-[48px] leading-tight mb-4 mx-auto"
            style={{
              fontFamily: "var(--font-serif)",
              color: "#111827",
              fontWeight: 400,
              maxWidth: "800px",
            }}
          >
            Strategy doesn&apos;t fail because it&apos;s wrong.
            <br />
            It fails because it doesn&apos;t show up in behaviour.
          </h2>
          <p
            className="text-lg font-medium"
            style={{ color: "#16855B", fontFamily: "var(--font-sans)" }}
          >
            Workenvo closes that gap.
          </p>
        </motion.div>

        {/* Centered orbital diagram */}
        <div className="flex justify-center">
          <div
            className="relative"
            style={{ width: `${SVG_SIZE}px`, height: `${SVG_SIZE}px` }}
          >
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
            >
              {/* Dashed orbital track */}
              <circle
                cx={CENTER}
                cy={CENTER}
                r={RADIUS}
                fill="none"
                stroke="#D1FAE5"
                strokeWidth="1.5"
                strokeDasharray="6 4"
              />

              {/* Slowly rotating connecting lines group */}
              <motion.g
                style={{ transformOrigin: `${CENTER}px ${CENTER}px` }}
                animate={{ rotate: allLit ? 360 : 0 }}
                transition={{ duration: 360, repeat: Infinity, ease: "linear" }}
              >
                {steps.map((_, i) => {
                  const from = nodePos(i);
                  const to = nodePos((i + 1) % steps.length);
                  const isConnected =
                    litSteps.includes(i) && litSteps.includes((i + 1) % steps.length);
                  return (
                    <motion.line
                      key={i}
                      x1={from.x}
                      y1={from.y}
                      x2={to.x}
                      y2={to.y}
                      stroke={isConnected ? steps[i].color : "#E5E7EB"}
                      strokeWidth="1.5"
                      strokeOpacity={isConnected ? 0.45 : 0.3}
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: isConnected ? 1 : 0 }}
                      transition={{ duration: 0.5 }}
                    />
                  );
                })}
              </motion.g>
            </svg>

            {/* Orbiting dot */}
            {allLit && (
              <div
                className="absolute"
                style={{
                  top: "50%",
                  left: "50%",
                  width: "10px",
                  height: "10px",
                  marginTop: "-5px",
                  marginLeft: "-5px",
                  animation: "orbit-dot 4s linear infinite",
                }}
              >
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{
                    background: "#16855B",
                    boxShadow: "0 0 8px rgba(22,133,91,0.8)",
                  }}
                />
              </div>
            )}

            {/* Nodes + floating labels */}
            {steps.map((step, i) => {
              const pos = nodePos(i);
              const lpos = labelOffset(i);
              const isLit = litSteps.includes(i);

              // Determine text-anchor based on horizontal position
              const textAlign =
                lpos.x < CENTER - 20
                  ? "right"
                  : lpos.x > CENTER + 20
                  ? "left"
                  : "center";

              return (
                <div key={i}>
                  {/* Node button */}
                  <motion.button
                    onClick={() => setActiveStep(activeStep === i ? null : i)}
                    className="absolute flex items-center justify-center rounded-2xl cursor-pointer"
                    style={{
                      left: pos.x - 32,
                      top: pos.y - 32,
                      width: "64px",
                      height: "64px",
                      background: isLit ? step.color : "#FFFFFF",
                      border: `2px solid ${isLit ? step.color : "#E5E7EB"}`,
                      boxShadow: isLit
                        ? `0 0 0 8px ${step.color}18, 0 8px 20px rgba(0,0,0,0.1)`
                        : "0 2px 8px rgba(0,0,0,0.08)",
                      transition: "all 0.4s ease",
                      zIndex: 10,
                    }}
                    animate={isLit ? { scale: [1, 1.12, 1] } : { scale: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <span style={{ fontSize: "22px" }}>{step.emoji}</span>
                  </motion.button>

                  {/* Label outside node */}
                  <div
                    className="absolute pointer-events-none"
                    style={{
                      left: lpos.x,
                      top: lpos.y,
                      transform: "translate(-50%, -50%)",
                      textAlign: textAlign as "left" | "right" | "center",
                      zIndex: 5,
                    }}
                  >
                    <p
                      className="text-sm font-semibold whitespace-nowrap transition-colors duration-400"
                      style={{
                        fontFamily: "var(--font-sans)",
                        color: isLit ? step.color : "#9CA3AF",
                      }}
                    >
                      {step.name}
                    </p>
                  </div>
                </div>
              );
            })}

            {/* Center reveal */}
            <AnimatePresence>
              {allLit && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="absolute rounded-full flex items-center justify-center text-center"
                  style={{
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "130px",
                    height: "130px",
                    background: "rgba(22,133,91,0.08)",
                    border: "1px solid rgba(22,133,91,0.15)",
                    backdropFilter: "blur(4px)",
                  }}
                >
                  <p
                    className="text-xs font-medium px-3 leading-snug"
                    style={{
                      color: "#16855B",
                      fontFamily: "var(--font-serif)",
                      fontStyle: "italic",
                    }}
                  >
                    Strategy shows up in behaviour.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Click-expanded step description */}
        <AnimatePresence>
          {activeStep !== null && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.3 }}
              className="mt-8 text-center max-w-md mx-auto"
            >
              <p
                className="text-base leading-relaxed"
                style={{ color: "#6B7280", fontFamily: "var(--font-sans)" }}
              >
                {steps[activeStep].desc}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
