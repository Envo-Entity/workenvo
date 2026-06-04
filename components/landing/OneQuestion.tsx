"use client";

import { motion } from "motion/react";

export default function OneQuestion() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "#FFFFFF" }}
    >
      <div
        className="grid grid-cols-1 lg:grid-cols-2"
        style={{ minHeight: "700px" }}
      >
        {/* LEFT — text content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "clamp(64px, 8vw, 120px) clamp(24px, 6vw, 80px)",
          }}
        >
          {/* Label */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "#16855B",
              marginBottom: "20px",
            }}
          >
            The Solution
          </motion.p>

          {/* H2 */}
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.08 }}
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(34px, 4vw, 54px)",
              fontWeight: 400,
              lineHeight: 1.1,
              color: "#111827",
              marginBottom: "32px",
            }}
          >
            One dashboard.
            <br />
            One question answered.
          </motion.h2>

          {/* The big question */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.16 }}
            style={{
              background: "#F5F9F7",
              borderRadius: "16px",
              padding: "24px 28px",
              marginBottom: "32px",
              border: "1px solid rgba(22,133,91,0.14)",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(22px, 3vw, 36px)",
                fontWeight: 400,
                color: "#111827",
                lineHeight: 1.15,
                marginBottom: "8px",
              }}
            >
              What needs attention today?
            </p>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "13px",
                color: "#9CA3AF",
                fontStyle: "italic",
              }}
            >
              The only question that matters every morning.
            </p>
          </motion.div>

          {/* Body */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.24 }}
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "clamp(14px, 1.4vw, 16px)",
              color: "rgba(17,24,39,0.55)",
              lineHeight: 1.7,
              marginBottom: "10px",
              maxWidth: "440px",
            }}
          >
            Workenvo connects to the tools your organisation already runs on, reads
            the signals across them, and answers the only question that matters
            every morning.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "clamp(13px, 1.2vw, 15px)",
              color: "rgba(17,24,39,0.35)",
              lineHeight: 1.65,
              maxWidth: "420px",
            }}
          >
            No setup marathon. No data science team. No 40-tab analytics suite.
            One screen that tells you where to look — and what to do about it.
          </motion.p>
        </div>

        {/* RIGHT — person image */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.1 }}
          style={{
            position: "relative",
            overflow: "hidden",
            minHeight: "520px",
          }}
          className="hidden lg:block"
        >
          <img
            src="/images/one-question-calm-hr-morning.webp"
            alt="HR director calmly reviewing data on her laptop in the morning"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
            }}
          />

          {/* Left-edge fade */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "80px",
              height: "100%",
              background: "linear-gradient(to left, transparent, #FFFFFF)",
              pointerEvents: "none",
            }}
          />
        </motion.div>
      </div>
    </section>
  );
}
