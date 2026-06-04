"use client";

import { motion } from "motion/react";
import {
  TrendingDown,
  AlertTriangle,
  Flame,
  Clock,
  UserMinus,
  BarChart2,
  Heart,
} from "lucide-react";
import type { ElementType } from "react";

type Signal = {
  Icon: ElementType;
  text: string;
};

const SIGNALS: Signal[] = [
  { Icon: TrendingDown, text: "Sales team engagement dropping" },
  { Icon: AlertTriangle, text: "A new manager creating negative sentiment" },
  { Icon: Flame, text: "A high performer showing burnout signals" },
  { Icon: Clock, text: "Team meetings becoming less productive" },
  { Icon: UserMinus, text: "An employee at risk of leaving" },
  { Icon: BarChart2, text: "A sudden drop in performance" },
  { Icon: Heart, text: "An employee feeling unsupported" },
];

export default function SignalGrid() {
  return (
    <section
      id="signals"
      className="relative py-28 px-6 overflow-hidden"
      style={{ background: "#FFFFFF" }}
    >
      {/* Faint background pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(22,133,91,0.04) 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
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
            Early Signals
          </p>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(32px, 4.5vw, 52px)",
              fontWeight: 400,
              lineHeight: 1.12,
              color: "#111827",
              maxWidth: "640px",
              margin: "0 auto 20px",
            }}
          >
            The problems you&apos;d rather catch on a Tuesday than at an exit interview
          </h2>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "clamp(15px, 1.6vw, 18px)",
              color: "#6B7280",
              lineHeight: 1.65,
              maxWidth: "520px",
              margin: "0 auto",
            }}
          >
            Workenvo watches for the patterns that precede the problems — and
            surfaces them while you can still do something.
          </p>
        </motion.div>

        {/* Signal cards — 4 + 3 layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "12px",
            marginBottom: "48px",
          }}
        >
          {SIGNALS.map((signal, i) => {
            const Icon = signal.Icon;
            // Staggered float: each card bobs at a different phase and speed
            const floatDuration = 3.2 + i * 0.35;
            const floatDelay   = i * 0.45;
            return (
              <motion.div
                key={signal.text}
                initial={{ opacity: 0, y: 20, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.45, delay: i * 0.045, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ scale: 1.03, boxShadow: "0 8px 24px rgba(22,133,91,0.12)", transition: { type: "spring", stiffness: 340, damping: 22 } }}
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #E5E7EB",
                  borderRadius: "14px",
                  padding: "20px",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "14px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                  cursor: "default",
                  animation: `signal-float ${floatDuration}s ease-in-out ${floatDelay}s infinite`,
                }}
              >
                <div
                  style={{
                    flexShrink: 0,
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    background: "#ECFDF5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon size={16} color="#16855B" strokeWidth={2} />
                </div>
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "14px",
                    lineHeight: 1.5,
                    color: "#374151",
                    fontWeight: 500,
                    paddingTop: "2px",
                  }}
                >
                  {signal.text}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom — split: closing line left, people image right */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "32px",
            alignItems: "center",
          }}
          className="lg:grid-cols-2"
        >
          {/* Closing text */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <p
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(26px, 3.5vw, 44px)",
                fontWeight: 400,
                lineHeight: 1.2,
                color: "#111827",
                marginBottom: "16px",
              }}
            >
              Every one of these used to surface{" "}
              <span style={{ color: "#B91C1C", fontStyle: "italic" }}>too late.</span>
            </p>
            <p
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(26px, 3.5vw, 44px)",
                fontWeight: 400,
                lineHeight: 1.2,
                color: "#16855B",
              }}
            >
              Now it surfaces today.
            </p>
          </motion.div>

          {/* People image — 1:1 conversation */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{
              borderRadius: "20px",
              overflow: "hidden",
              position: "relative",
              aspectRatio: "4/3",
            }}
          >
            <img
              src="/images/signal-grid-manager-one-to-one.webp"
              alt="Manager having a focused 1:1 conversation with an employee"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
              }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
