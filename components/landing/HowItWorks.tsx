"use client";

import { motion } from "motion/react";
import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const STEPS = [
  {
    number: "01",
    label: "Connect",
    desc: "Plug in one integration. Teams, Slack, or your HRIS. Two minutes, no IT project.",
    color: "#16855B",
  },
  {
    number: "02",
    label: "See",
    desc: "Get your Workforce Health Score, your Top 3 Risks, and your first signals — within the week.",
    color: "#059669",
  },
  {
    number: "03",
    label: "Act",
    desc: "Follow the recommended actions. Catch the problem while it's still small.",
    color: "#0D9488",
  },
  {
    number: "04",
    label: "Expand",
    desc: "As trust builds, add attrition risk, manager effectiveness, performance, and predictive intelligence.",
    color: "#0891B2",
  },
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [activeSteps, setActiveSteps] = useState<number[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (svgRef.current) {
      const paths = svgRef.current.querySelectorAll("path");
      paths.forEach((path) => {
        const len = (path as SVGPathElement).getTotalLength();
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(path, {
          strokeDashoffset: 0,
          duration: 1.6,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 55%",
            once: true,
          },
        });
      });
    }

    STEPS.forEach((_, i) => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: `top ${62 - i * 7}%`,
        once: true,
        onEnter: () => setActiveSteps((prev) => [...prev, i]),
      });
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="relative py-32 px-6 overflow-hidden"
      style={{
        background: "linear-gradient(160deg, #0f2027 0%, #1a3a2a 50%, #16855B20 100%)",
        backgroundColor: "#111827",
      }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 60% 50% at 50% 80%, rgba(22,133,91,0.15) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "#16855B",
              marginBottom: "16px",
            }}
          >
            How it works
          </p>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(36px, 5vw, 60px)",
              fontWeight: 400,
              lineHeight: 1.1,
              color: "#FFFFFF",
              marginBottom: "16px",
            }}
          >
            Start small. See value. Grow into it.
          </h2>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "clamp(15px, 1.6vw, 18px)",
              color: "rgba(255,255,255,0.5)",
              lineHeight: 1.65,
              maxWidth: "480px",
              margin: "0 auto",
            }}
          >
            You don&apos;t have to commit to a platform. You commit to one signal — and
            let the value earn the next step.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* SVG connecting line (desktop) */}
          <div className="hidden lg:block absolute inset-0 pointer-events-none">
            <svg
              ref={svgRef}
              className="w-full h-full"
              style={{ position: "absolute", top: 0, left: 0 }}
              viewBox="0 0 800 120"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="howLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#16855B" />
                  <stop offset="100%" stopColor="#0891B2" />
                </linearGradient>
              </defs>
              <path
                d="M100,60 C200,60 200,60 300,60"
                stroke="url(#howLineGrad)"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M300,60 C400,60 400,60 500,60"
                stroke="url(#howLineGrad)"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M500,60 C600,60 600,60 700,60"
                stroke="url(#howLineGrad)"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
              />
              <path d="M290,55 L302,60 L290,65" stroke="url(#howLineGrad)" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M490,55 L502,60 L490,65" stroke="url(#howLineGrad)" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M690,55 L702,60 L690,65" stroke="url(#howLineGrad)" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
            {STEPS.map((step, i) => {
              const isActive = activeSteps.includes(i);
              return (
                <motion.div
                  key={step.label}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.12 }}
                  className="flex flex-col items-center text-center"
                >
                  {/* Node */}
                  <motion.div
                    animate={
                      isActive
                        ? {
                            boxShadow: `0 0 0 8px ${step.color}30, 0 0 0 16px ${step.color}10`,
                            scale: 1.05,
                          }
                        : { boxShadow: "none", scale: 1 }
                    }
                    transition={{ duration: 0.5 }}
                    className="w-20 h-20 rounded-2xl flex items-center justify-center mb-5 relative"
                    style={{
                      background: isActive ? step.color : "rgba(255,255,255,0.08)",
                      border: `2px solid ${isActive ? step.color : "rgba(255,255,255,0.15)"}`,
                      transition: "background 0.5s ease, border-color 0.5s ease",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "13px",
                        fontWeight: 700,
                        letterSpacing: "0.06em",
                        color: isActive ? "#FFFFFF" : "rgba(255,255,255,0.35)",
                        transition: "color 0.5s ease",
                      }}
                    >
                      {step.number}
                    </span>
                    {isActive && (
                      <motion.div
                        initial={{ scale: 0, opacity: 1 }}
                        animate={{ scale: 2.5, opacity: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="absolute inset-0 rounded-2xl"
                        style={{ background: step.color }}
                      />
                    )}
                  </motion.div>

                  <h3
                    className="text-2xl mb-3 transition-colors duration-500"
                    style={{
                      fontFamily: "var(--font-serif)",
                      color: isActive ? step.color : "rgba(255,255,255,0.4)",
                      fontWeight: 400,
                    }}
                  >
                    {step.label}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{
                      fontFamily: "var(--font-sans)",
                      color: isActive ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.3)",
                      transition: "color 0.5s ease",
                      maxWidth: "200px",
                    }}
                  >
                    {step.desc}
                  </p>

                  {i < STEPS.length - 1 && (
                    <div
                      className="lg:hidden text-lg mt-4"
                      style={{ color: "rgba(255,255,255,0.2)" }}
                    >
                      ↓
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
