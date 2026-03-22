"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const counters = [
  { label: "Behaviours tracked", target: 12847, suffix: "" },
  { label: "CSRD metrics aligned", target: 34, suffix: "" },
  { label: "Impact score", target: 89, suffix: "%" },
];

const metrics = [
  { label: "ESG Commitments", value: 100, color: "#16855B" },
  { label: "Behavioural Adoption", value: 74, color: "#059669" },
  { label: "Measured Impact", value: 61, color: "#D97706" },
  { label: "CSRD Ready", value: 89, color: "#16855B" },
];

function CountUp({ target, suffix }: { target: number; suffix: string }) {
  const [current, setCurrent] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const duration = 1800;
    const startTime = Date.now();
    const raf = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [started, target]);

  return (
    <span ref={ref}>
      {current.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function ESGSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [badgeVisible, setBadgeVisible] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 40%",
      once: true,
      onEnter: () => {
        setTimeout(() => setBadgeVisible(true), 1200);
      },
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-32 px-6 overflow-hidden"
      style={{ background: "#f0fdf4" }}
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
            ESG & CSRD
          </span>
          <h2
            className="text-4xl lg:text-[48px] leading-tight mb-4 mx-auto"
            style={{
              fontFamily: "var(--font-serif)",
              color: "#111827",
              fontWeight: 400,
              maxWidth: "600px",
            }}
          >
            From reporting to real impact
          </h2>
          <p
            className="text-lg mx-auto"
            style={{
              color: "#6B7280",
              fontFamily: "var(--font-sans)",
              maxWidth: "520px",
            }}
          >
            Track sustainability behaviours. Measure adoption and impact.
            Generate CSRD-ready reports aligned to real behavioural change.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Counters */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-6"
          >
            {counters.map((counter, i) => (
              <motion.div
                key={counter.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="rounded-2xl p-6"
                style={{
                  background: "#F5F9F7",
                  border: "1px solid #D1FAE5",
                }}
              >
                <div
                  className="text-4xl font-bold mb-1 tabular-nums"
                  style={{
                    fontFamily: "var(--font-sans)",
                    color: "#16855B",
                  }}
                >
                  <CountUp target={counter.target} suffix={counter.suffix} />
                </div>
                <div
                  className="text-sm"
                  style={{ color: "#6B7280", fontFamily: "var(--font-sans)" }}
                >
                  {counter.label}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Progress card + badge */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div
              className="rounded-2xl p-8 relative overflow-hidden"
              style={{
                background: "#FFFFFF",
                border: "1px solid #E5E7EB",
                boxShadow:
                  "0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -2px rgba(0,0,0,0.05)",
              }}
            >
              <h3
                className="text-sm font-semibold mb-8"
                style={{ color: "#374151", fontFamily: "var(--font-sans)" }}
              >
                ESG Commitments → Behaviours → Measured Impact
              </h3>

              <div className="space-y-5">
                {metrics.map((metric, i) => (
                  <motion.div
                    key={metric.label}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span
                        className="text-sm font-medium"
                        style={{ color: "#374151", fontFamily: "var(--font-sans)" }}
                      >
                        {metric.label}
                      </span>
                      <span
                        className="text-sm font-semibold"
                        style={{ color: "#111827", fontFamily: "var(--font-sans)" }}
                      >
                        {metric.value}%
                      </span>
                    </div>
                    <div
                      className="h-2.5 rounded-full overflow-hidden"
                      style={{ background: "#F3F4F6" }}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${metric.value}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, delay: i * 0.15, ease: "easeOut" }}
                        className="h-full rounded-full"
                        style={{
                          background: `linear-gradient(90deg, ${metric.color}80, ${metric.color})`,
                        }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* CSRD Badge */}
              <motion.div
                className="mt-8 pt-6"
                style={{ borderTop: "1px solid #F3F4F6" }}
              >
                <motion.div
                  animate={
                    badgeVisible
                      ? { scale: [0, 1.15, 1], opacity: [0, 1, 1] }
                      : {}
                  }
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="inline-flex items-center gap-3 rounded-full px-4 py-2"
                  style={{
                    background: "#ECFDF5",
                    border: "1.5px solid #16855B",
                  }}
                >
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0"
                    style={{ background: "#16855B", color: "#FFFFFF" }}
                  >
                    ✓
                  </span>
                  <span
                    className="text-sm font-medium"
                    style={{ color: "#065F46", fontFamily: "var(--font-sans)" }}
                  >
                    CSRD Report Ready · Q1 2026
                  </span>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
