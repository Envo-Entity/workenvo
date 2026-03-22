"use client";

import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// ── Logo icons (line-art SVG, no emoji) ──────────────────────────────────────

function LogoDefine({ active }: { active: boolean }) {
  const c = active ? "#fff" : "#9CA3AF";
  return (
    <svg width="26" height="26" viewBox="0 0 32 32" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="16" cy="16" r="11" />
      <circle cx="16" cy="16" r="4" />
      <line x1="16" y1="5" x2="16" y2="9" />
      <line x1="16" y1="23" x2="16" y2="27" />
      <line x1="5" y1="16" x2="9" y2="16" />
      <line x1="23" y1="16" x2="27" y2="16" />
    </svg>
  );
}

function LogoTranslate({ active }: { active: boolean }) {
  const c = active ? "#fff" : "#9CA3AF";
  return (
    <svg width="26" height="26" viewBox="0 0 32 32" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 9h14" />
      <path d="M9 9V6" />
      <path d="M5 14s2 3 6 3 6-3 6-3" />
      <path d="M16 20l4 8" />
      <path d="M24 20l-4 8" />
      <path d="M14 28h10" />
      <path d="M19 14v6" />
      <path d="M22 17h6" />
    </svg>
  );
}

function LogoDetect({ active }: { active: boolean }) {
  const c = active ? "#fff" : "#9CA3AF";
  return (
    <svg width="26" height="26" viewBox="0 0 32 32" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 16s5-9 14-9 14 9 14 9-5 9-14 9S2 16 2 16z" />
      <circle cx="16" cy="16" r="4" />
      <circle cx="16" cy="16" r="1.5" fill={c} stroke="none" />
      <path d="M22 10l4-4M26 6h-2v2" />
    </svg>
  );
}

function LogoReinforce({ active }: { active: boolean }) {
  const c = active ? "#fff" : "#9CA3AF";
  return (
    <svg width="26" height="26" viewBox="0 0 32 32" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="2,26 10,16 16,21 26,9" />
      <polyline points="20,9 26,9 26,15" />
    </svg>
  );
}

function LogoBuildProve({ active }: { active: boolean }) {
  const c = active ? "#fff" : "#9CA3AF";
  return (
    <svg width="26" height="26" viewBox="0 0 32 32" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="28" x2="28" y2="28" />
      <rect x="3" y="20" width="6" height="8" rx="1" />
      <rect x="13" y="14" width="6" height="14" rx="1" />
      <rect x="23" y="8" width="6" height="20" rx="1" />
    </svg>
  );
}

// ── Data ──────────────────────────────────────────────────────────────────────

const steps = [
  {
    id: 0,
    num: "01",
    name: "Define",
    title: "Define what good looks like",
    detail:
      "Start with strategy, not assumption. Identify the precise capabilities your organisation needs to execute on its goals — before any measurement begins.",
    Logo: LogoDefine,
    color: "#4ADE80",
    glow: "rgba(74,222,128,0.2)",
  },
  {
    id: 1,
    num: "02",
    name: "Translate",
    title: "Translate strategy into behaviour",
    detail:
      "Map the specific day-to-day behaviours that drive the capabilities you've defined. Make the intangible concrete so every person knows what's expected.",
    Logo: LogoTranslate,
    color: "#22C55E",
    glow: "rgba(34,197,94,0.2)",
  },
  {
    id: 2,
    num: "03",
    name: "Detect",
    title: "Detect signals before they become problems",
    detail:
      "Surface real-time signals and risk indicators across your workforce. See what's changing in behaviour — and what it means — before it escalates.",
    Logo: LogoDetect,
    color: "#16A34A",
    glow: "rgba(22,163,74,0.22)",
  },
  {
    id: 3,
    num: "04",
    name: "Reinforce",
    title: "Reinforce the behaviours that matter",
    detail:
      "Drive adoption through targeted incentives and engagement. Reward the right behaviours consistently so they compound into lasting capability.",
    Logo: LogoReinforce,
    color: "#15803D",
    glow: "rgba(21,128,61,0.22)",
  },
  {
    id: 4,
    num: "05",
    name: "Build & Prove",
    title: "Build capability. Prove the impact.",
    detail:
      "Turn sustained behaviour into measurable capability. Generate board-ready evidence that culture investment delivers real business results.",
    Logo: LogoBuildProve,
    color: "#166534",
    glow: "rgba(22,101,52,0.22)",
  },
];

// ── Geometry ──────────────────────────────────────────────────────────────────

const N = steps.length;
const R = 150; // radius to node centres
const SZ = 380; // SVG viewport size
const CX = SZ / 2;
const CY = SZ / 2;

function nodePos(i: number) {
  const angle = (i / N) * 2 * Math.PI - Math.PI / 2;
  return { x: CX + R * Math.cos(angle), y: CY + R * Math.sin(angle) };
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function CapabilityLoop() {
  const sectionRef = useRef<HTMLDivElement>(null);
  // progress: 0 → 1 across the entire scroll range
  const progressRef = useRef(0);
  const [activeIdx, setActiveIdx] = useState(0);
  const [renderProgress, setRenderProgress] = useState(0);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.6,
      onUpdate: (self) => {
        const p = self.progress;
        progressRef.current = p;
        setRenderProgress(p);
        setActiveIdx(Math.min(N - 1, Math.floor(p * N)));
      },
    });

    return () => st.kill();
  }, []);

  const activeStep = steps[activeIdx];

  // Pentagon progress per segment
  function segProgress(i: number) {
    const segStart = i / N;
    const segEnd = (i + 1) / N;
    return Math.max(0, Math.min(1, (renderProgress - segStart) / (segEnd - segStart)));
  }

  // Moving dot position
  const totalProgress = renderProgress * N;
  const dotSeg = Math.floor(totalProgress) % N;
  const dotT = totalProgress - Math.floor(totalProgress);
  const dotFrom = nodePos(dotSeg);
  const dotTo = nodePos((dotSeg + 1) % N);
  const dotX = dotFrom.x + (dotTo.x - dotFrom.x) * dotT;
  const dotY = dotFrom.y + (dotTo.y - dotFrom.y) * dotT;

  return (
    // Tall section for scroll track — 500vh means 4 "pages" of scroll
    <section
      ref={sectionRef}
      className="relative"
      style={{ height: "500vh", background: "#F5F9F7" }}
    >
      {/* Sticky viewport-height panel */}
      <div
        className="sticky top-0 flex flex-col items-center justify-center overflow-hidden"
        style={{ height: "100vh" }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-8 lg:mb-10 px-6"
        >
          <span
            className="inline-block rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide mb-4"
            style={{ background: "rgba(22,133,91,0.1)", color: "#16855B", fontFamily: "var(--font-sans)" }}
          >
            The Workenvo Capability Loop
          </span>
          <h2
            className="text-2xl lg:text-[38px] leading-snug"
            style={{ fontFamily: "var(--font-serif)", color: "#111827", fontWeight: 400 }}
          >
            Strategy doesn&apos;t fail because it&apos;s wrong.
            <br />
            <em style={{ color: "#16855B", fontStyle: "italic" }}>It fails because it doesn&apos;t show up in behaviour.</em>
          </h2>
        </motion.div>

        {/* Two-column layout */}
        <div className="w-full max-w-6xl px-4 lg:px-10 mx-auto flex flex-col lg:flex-row items-center gap-8 lg:gap-14">

          {/* ── LEFT: Pentagon loop ── */}
          <div className="flex-shrink-0" style={{ width: SZ, height: SZ, maxWidth: "100%" }}>
            <svg
              viewBox={`0 0 ${SZ} ${SZ}`}
              width={SZ}
              height={SZ}
              style={{ width: "100%", height: "auto", maxWidth: SZ, overflow: "visible" }}
            >
              {/* Faint orbital ring */}
              <circle
                cx={CX} cy={CY} r={R}
                fill="none"
                stroke="#D1FAE5"
                strokeWidth="1.5"
                strokeDasharray="5 4"
              />

              {/* Pentagon edges — dim base */}
              {steps.map((_, i) => {
                const a = nodePos(i);
                const b = nodePos((i + 1) % N);
                return (
                  <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                    stroke="#E5E7EB" strokeWidth="1.5" strokeOpacity="0.6" />
                );
              })}

              {/* Pentagon edges — lit progress */}
              {steps.map((step, i) => {
                const a = nodePos(i);
                const b = nodePos((i + 1) % N);
                const sp = segProgress(i);
                if (sp <= 0) return null;
                return (
                  <line key={i}
                    x1={a.x} y1={a.y}
                    x2={a.x + (b.x - a.x) * sp}
                    y2={a.y + (b.y - a.y) * sp}
                    stroke={step.color}
                    strokeWidth="2.5"
                    strokeOpacity="0.8"
                    strokeLinecap="round"
                  />
                );
              })}

              {/* Nodes */}
              {steps.map((step, i) => {
                const pos = nodePos(i);
                const isLit = i <= activeIdx;
                const isActive = i === activeIdx;
                const { Logo } = step;

                return (
                  <g key={i}>
                    {/* Outer glow for active */}
                    {isActive && (
                      <circle cx={pos.x} cy={pos.y} r={34}
                        fill="none"
                        stroke={step.color}
                        strokeWidth="1.5"
                        strokeOpacity="0.3"
                      />
                    )}
                    {/* Node fill */}
                    <circle
                      cx={pos.x} cy={pos.y} r={26}
                      fill={isLit ? step.color : "#FFFFFF"}
                      stroke={isLit ? step.color : "#E5E7EB"}
                      strokeWidth="1.5"
                    />
                    {/* Icon */}
                    <foreignObject x={pos.x - 13} y={pos.y - 13} width="26" height="26">
                      {/* @ts-ignore */}
                      <div xmlns="http://www.w3.org/1999/xhtml"
                        style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 26, height: 26 }}
                      >
                        <Logo active={isLit} />
                      </div>
                    </foreignObject>
                    {/* Name label below node */}
                    <text
                      x={pos.x} y={pos.y + 42}
                      textAnchor="middle"
                      fontSize="10.5"
                      fontWeight="600"
                      fontFamily="var(--font-sans)"
                      fill={isLit ? step.color : "#9CA3AF"}
                    >
                      {step.name}
                    </text>
                  </g>
                );
              })}

              {/* Center label — fades in once past halfway */}
              {renderProgress > 0.55 && (
                <g opacity={Math.min(1, (renderProgress - 0.55) * 5)}>
                  <text x={CX} y={CY - 7} textAnchor="middle" fontSize="10"
                    fontFamily="var(--font-serif)" fill="#16855B" fontStyle="italic">
                    Strategy shows up
                  </text>
                  <text x={CX} y={CY + 9} textAnchor="middle" fontSize="10"
                    fontFamily="var(--font-serif)" fill="#16855B" fontStyle="italic">
                    in behaviour.
                  </text>
                </g>
              )}

              {/* Moving dot along path */}
              {renderProgress > 0 && renderProgress < 0.99 && (
                <circle cx={dotX} cy={dotY} r={4.5}
                  fill={steps[dotSeg]?.color ?? "#16855B"}
                  opacity="0.9"
                />
              )}
            </svg>
          </div>

          {/* ── RIGHT: Step content ── */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIdx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col gap-5"
              >
                {/* Small icon on the left + title */}
                <div className="flex items-start justify-center lg:justify-start gap-4">
                  <div
                    className="flex items-center justify-center rounded-xl shrink-0 mt-1"
                    style={{
                      width: 40,
                      height: 40,
                      background: activeStep.color,
                      boxShadow: `0 0 0 8px ${activeStep.glow}`,
                    }}
                  >
                    <activeStep.Logo active={true} />
                  </div>
                  <h3
                    className="text-2xl lg:text-[34px] leading-snug text-center lg:text-left"
                    style={{ fontFamily: "var(--font-serif)", color: "#111827", fontWeight: 400 }}
                  >
                    {activeStep.title}
                  </h3>
                </div>

                {/* Detail */}
                <p
                  className="text-base lg:text-lg leading-relaxed text-center lg:text-left"
                  style={{ color: "#4B5563", fontFamily: "var(--font-sans)", maxWidth: 460 }}
                >
                  {activeStep.detail}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
