"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";

type Particle = { id: number; x: number; y: number; size: number; duration: number; delay: number };

export default function FinalCTA() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        duration: Math.random() * 8 + 6,
        delay: Math.random() * 4,
      }))
    );
  }, []);

  return (
    <section
      className="relative overflow-hidden flex items-center justify-center"
      style={{
        background:
          "linear-gradient(180deg, #1A2E3B 0%, #1E3A2F 30%, #16855B20 70%, #F5F9F7 100%)",
        minHeight: "90vh",
        padding: "120px 24px",
      }}
    >
      {/* Light ray effect at bottom */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: "600px",
          height: "300px",
          background:
            "radial-gradient(ellipse at bottom, rgba(22,133,91,0.18) 0%, transparent 70%)",
          filter: "blur(20px)",
        }}
      />

      {/* Particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background:
              p.id % 3 === 0
                ? "rgba(110,231,183,0.5)"
                : p.id % 3 === 1
                ? "rgba(22,133,91,0.4)"
                : "rgba(255,255,255,0.3)",
          }}
          animate={{
            y: [0, -40, 0],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Glow orbs */}
      <div
        className="absolute left-[15%] top-[20%] w-72 h-72 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(22,133,91,0.1) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="absolute right-[10%] bottom-[25%] w-56 h-56 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(110,231,183,0.08) 0%, transparent 70%)",
          filter: "blur(30px)",
        }}
      />

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center rounded-full px-4 py-1.5 mb-10 text-xs font-semibold tracking-wide"
          style={{
            background: "rgba(22,133,91,0.15)",
            color: "#6EE7B7",
            border: "1px solid rgba(22,133,91,0.3)",
            fontFamily: "var(--font-sans)",
          }}
        >
          Ready to get started?
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="leading-tight mb-8"
          style={{
            fontFamily: "var(--font-serif)",
            color: "#FFFFFF",
            fontWeight: 400,
            fontSize: "clamp(44px, 7vw, 88px)",
          }}
        >
          Stop reacting.
          <br />
          <span
            style={{
              background: "linear-gradient(135deg, #6EE7B7, #34D399)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Start seeing.
          </span>
        </motion.h2>

        {/* Sub copy */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="text-xl leading-relaxed mb-12 mx-auto"
          style={{
            color: "rgba(209,250,229,0.7)",
            fontFamily: "var(--font-sans)",
            maxWidth: "520px",
          }}
        >
          Understand what&apos;s changing before it becomes a problem. Build
          the organisation you&apos;ll need in the future.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.a
            href="#"
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 px-10 py-4 rounded-xl text-lg font-medium"
            style={{
              background: "#16855B",
              color: "#FFFFFF",
              fontFamily: "var(--font-sans)",
              boxShadow: "0 4px 20px rgba(22,133,91,0.4)",
              transition: "box-shadow 0.2s ease",
            }}
          >
            Book a demo
          </motion.a>
          <motion.a
            href="#"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 px-10 py-4 rounded-xl text-lg font-medium"
            style={{
              background: "rgba(255,255,255,0.08)",
              color: "#FFFFFF",
              fontFamily: "var(--font-sans)",
              border: "1.5px solid rgba(255,255,255,0.2)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
            }}
          >
            Speak to an expert
          </motion.a>
        </motion.div>

        {/* Fine print */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-10 text-sm"
          style={{ color: "rgba(255,255,255,0.35)", fontFamily: "var(--font-sans)" }}
        >
          No credit card required · Free 30-day trial
        </motion.p>
      </div>
    </section>
  );
}
