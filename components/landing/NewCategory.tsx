"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";

const categoryText = "Behaviour Intelligence";

export default function NewCategory() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [showCursor, setShowCursor] = useState(true);
  const [typedChars, setTypedChars] = useState(0);
  const [started, setStarted] = useState(false);

  // Cursor blink
  useEffect(() => {
    const id = setInterval(() => setShowCursor((p) => !p), 530);
    return () => clearInterval(id);
  }, []);

  // Trigger typewriter when section enters viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStarted(true);
      },
      { threshold: 0.35 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Type one character at a time
  useEffect(() => {
    if (!started || typedChars >= categoryText.length) return;
    const delay = 55 + Math.random() * 45;
    const id = setTimeout(() => setTypedChars((p) => p + 1), delay);
    return () => clearTimeout(id);
  }, [started, typedChars]);

  const isDone = typedChars >= categoryText.length;

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden flex items-center justify-center"
      style={{
        background: "linear-gradient(160deg, #F0FDF9 0%, #ECFDF5 45%, #F5FBF7 100%)",
        minHeight: "100vh",
        padding: "120px 24px",
      }}
    >
      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.4]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(22,133,91,0.12) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Ambient orbs */}
      <div
        className="absolute left-[10%] top-[20%] w-80 h-80 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(22,133,91,0.08) 0%, transparent 70%)",
          filter: "blur(50px)",
        }}
      />
      <div
        className="absolute right-[8%] bottom-[20%] w-64 h-64 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(5,150,105,0.07) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      <div className="relative z-10 text-center max-w-5xl mx-auto">
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-sm font-semibold tracking-widest uppercase mb-8"
          style={{ color: "#059669", fontFamily: "var(--font-sans)" }}
        >
          A new category
        </motion.p>

        {/* Pre-line */}
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="block mb-2"
          style={{
            fontFamily: "var(--font-serif)",
            color: "rgba(17,24,39,0.45)",
            fontWeight: 400,
            fontSize: "clamp(22px, 3.5vw, 44px)",
          }}
        >
          A new category:
        </motion.span>

        {/* Typewriter line */}
        <div
          className="leading-tight mb-8"
          style={{
            fontFamily: "var(--font-serif)",
            color: "#16855B",
            fontWeight: 400,
            fontSize: "clamp(40px, 7vw, 96px)",
            minHeight: "1.2em",
          }}
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: started ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {categoryText.slice(0, typedChars)}
          </motion.span>
          <span
            style={{
              display: "inline-block",
              width: "3px",
              height: "0.85em",
              background: "#16855B",
              marginLeft: "3px",
              verticalAlign: "middle",
              opacity: showCursor ? 1 : 0,
              transition: "opacity 0.08s",
            }}
          />
        </div>

        {/* One-liner — fades in after typing completes */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={isDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-xl leading-relaxed mx-auto"
          style={{
            color: "#374151",
            fontFamily: "var(--font-sans)",
            maxWidth: "560px",
          }}
        >
          Not HR software. Not engagement surveys. A system for understanding,
          influencing, and scaling organisational behaviour.
        </motion.p>

        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isDone ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mx-auto mt-12"
          style={{
            width: "80px",
            height: "2px",
            background: "linear-gradient(90deg, transparent, #16855B, transparent)",
            transformOrigin: "center",
          }}
        />
      </div>
    </section>
  );
}
