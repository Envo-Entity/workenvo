"use client";

import { motion } from "motion/react";

export default function PulseSurvey() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "oklch(0.08 0.008 160)" }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 55% 60% at 80% 50%, rgba(22,133,91,0.12) 0%, transparent 70%)",
        }}
      />

      <div
        className="relative z-10 grid grid-cols-1 lg:grid-cols-2 max-w-7xl mx-auto"
      >
        {/* LEFT — text */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "clamp(40px, 5vw, 72px) clamp(24px, 5vw, 72px)",
          }}
        >
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
              marginBottom: "14px",
            }}
          >
            Pulse Surveys
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.08 }}
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(28px, 3.2vw, 44px)",
              fontWeight: 400,
              lineHeight: 1.1,
              color: "oklch(0.96 0.005 160)",
              marginBottom: "16px",
            }}
          >
            Monthly check-ins
            <br />
            employees actually enjoy.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.16 }}
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "clamp(13px, 1.2vw, 15px)",
              color: "oklch(0.55 0.03 160)",
              lineHeight: 1.65,
              marginBottom: "20px",
              maxWidth: "400px",
            }}
          >
            Every month, Envo sends a short, gamified survey through our mobile app.
            Unintrusive. Friendly. Designed so employees feel heard — not interrogated.
          </motion.p>

          {/* Feature pills */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.22 }}
            className="flex flex-wrap gap-2"
            style={{ marginBottom: "24px" }}
          >
            {["Takes 60 seconds", "Gamified & fun", "Anonymous by default", "Monthly cadence"].map(
              (pill) => (
                <span
                  key={pill}
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#16855B",
                    background: "rgba(22,133,91,0.12)",
                    border: "1px solid rgba(22,133,91,0.25)",
                    borderRadius: "100px",
                    padding: "5px 14px",
                    letterSpacing: "0.01em",
                  }}
                >
                  {pill}
                </span>
              )
            )}
          </motion.div>

          {/* PwC stat */}
          <motion.a
            href="https://www.pwc.com/gx/en/issues/workforce/hopes-and-fears.html"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{
              display: "block",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "12px",
              padding: "14px 18px",
              maxWidth: "420px",
              textDecoration: "none",
              cursor: "pointer",
            }}
            className="group"
          >
            <p
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(14px, 1.4vw, 16px)",
                fontWeight: 400,
                color: "oklch(0.88 0.01 160)",
                lineHeight: 1.45,
                marginBottom: "8px",
                fontStyle: "italic",
              }}
            >
              &ldquo;Staff want leadership to be more proactive in addressing their
              career and well-being needs — and to regularly check in.&rdquo;
            </p>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.28)",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              PwC Hopes &amp; Fears 2024
              <span
                style={{
                  display: "inline-block",
                  transition: "transform 0.2s ease",
                }}
                className="group-hover:translate-x-1"
              >
                →
              </span>
            </p>
          </motion.a>
        </div>

        {/* RIGHT — pulse survey image */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.15 }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "clamp(24px, 4vw, 48px) clamp(24px, 4vw, 60px)",
          }}
        >
          <img
            src="/images/pulse-survey.webp"
            alt="Envo pulse survey mobile app"
            style={{
              maxHeight: "72vh",
              maxWidth: "100%",
              width: "auto",
              height: "auto",
              objectFit: "contain",
              display: "block",
            }}
          />
        </motion.div>
      </div>
    </section>
  );
}
