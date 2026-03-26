"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";

type Particle = {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
};

const lightRays = [
  { left: "18%", delay: 0, duration: 4.5 },
  { left: "33%", delay: 1.2, duration: 5.2 },
  { left: "50%", delay: 0.6, duration: 4.8 },
  { left: "65%", delay: 1.8, duration: 5.5 },
  { left: "80%", delay: 0.3, duration: 4.2 },
];

export default function FinalCTA() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 16 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: 40 + Math.random() * 60,
        size: Math.random() * 2.5 + 1,
        duration: Math.random() * 7 + 5,
        delay: Math.random() * 4,
      }))
    );
  }, []);

  return (
    <section
      className="relative overflow-hidden flex items-center justify-center"
      style={{
        background: "linear-gradient(160deg, #1a1a2e 0%, #16213e 40%, #2d6a4f 100%)",
        minHeight: "90vh",
        padding: "120px 24px",
      }}
    >
      {/* Ambient glow at bottom */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: "700px",
          height: "260px",
          background:
            "radial-gradient(ellipse at bottom, rgba(45,106,79,0.3) 0%, transparent 70%)",
          filter: "blur(30px)",
        }}
      />

      {/* Light rays moving upward */}
      {lightRays.map((ray, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none"
          style={{
            left: ray.left,
            bottom: 0,
            width: "1px",
            height: "180px",
            background:
              "linear-gradient(to top, rgba(255,255,255,0.15), rgba(255,255,255,0.04), transparent)",
          }}
          animate={{ y: [0, -220], opacity: [0, 0.5, 0] }}
          transition={{
            duration: ray.duration,
            delay: ray.delay,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}

      {/* Floating particles */}
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
                ? "rgba(255,255,255,0.3)"
                : p.id % 3 === 1
                ? "rgba(255,255,255,0.18)"
                : "rgba(255,255,255,0.1)",
          }}
          animate={{ y: [0, -35, 0], opacity: [0, 0.6, 0] }}
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
        className="absolute left-[12%] top-[25%] w-72 h-72 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(45,106,79,0.2) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="absolute right-[8%] bottom-[20%] w-56 h-56 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)",
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
            background: "rgba(255,255,255,0.1)",
            color: "rgba(255,255,255,0.75)",
            border: "1px solid rgba(255,255,255,0.2)",
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
          transition={{ duration: 0.9, delay: 0.15 }}
          className="leading-tight mb-8"
          style={{
            fontFamily: "var(--font-serif)",
            color: "#ffffff",
            fontWeight: 400,
            fontSize: "clamp(44px, 7vw, 88px)",
          }}
        >
          Stop reacting.
          <br />
          <span style={{ color: "rgba(255,255,255,0.55)" }}>Start seeing behaviour.</span>
        </motion.h2>

        {/* Sub copy */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-xl leading-relaxed mb-12 mx-auto"
          style={{
            color: "rgba(255,255,255,0.55)",
            fontFamily: "var(--font-sans)",
            maxWidth: "520px",
          }}
        >
          Understand what&apos;s changing across your organisation — before it becomes a problem. Act early. Build the capability you&apos;ll need next.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.a
            href="#"
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 px-10 py-4 rounded-xl text-lg font-medium"
            style={{
              background: "#ffffff",
              color: "#1a1a2e",
              fontFamily: "var(--font-sans)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
              textDecoration: "none",
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
              background: "rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.85)",
              fontFamily: "var(--font-sans)",
              border: "1.5px solid rgba(255,255,255,0.2)",
              textDecoration: "none",
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
          transition={{ duration: 0.6, delay: 0.65 }}
          className="mt-10 text-sm"
          style={{ color: "rgba(255,255,255,0.35)", fontFamily: "var(--font-sans)" }}
        >
          No credit card required · Free 30-day trial
        </motion.p>
      </div>
    </section>
  );
}
