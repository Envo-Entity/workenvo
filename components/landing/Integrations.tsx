"use client";

import { motion } from "motion/react";

const INTEGRATIONS = [
  { name: "Microsoft Teams", abbr: "Teams" },
  { name: "Slack", abbr: "Slack" },
  { name: "Your HRIS", abbr: "HRIS" },
  { name: "Performance Reviews", abbr: "Reviews" },
  { name: "Pulse Surveys", abbr: "Surveys" },
];

export default function Integrations() {
  return (
    <section
      className="relative py-28 px-6 overflow-hidden"
      style={{ background: "#F5F9F7" }}
    >
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
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
            Integrations
          </p>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(34px, 4.5vw, 56px)",
              fontWeight: 400,
              lineHeight: 1.1,
              color: "#111827",
              marginBottom: "20px",
              maxWidth: "600px",
              margin: "0 auto 20px",
            }}
          >
            It plugs into the tools you already use
          </h2>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "clamp(15px, 1.6vw, 18px)",
              color: "#6B7280",
              lineHeight: 1.65,
              maxWidth: "540px",
              margin: "0 auto",
            }}
          >
            Workenvo doesn&apos;t ask your people to change how they work. It listens
            to the systems already in motion — and turns the noise into early
            warnings.
          </p>
        </motion.div>

        {/* Integration cards */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.12 }}
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
            justifyContent: "center",
            marginBottom: "48px",
          }}
        >
          {INTEGRATIONS.map((integration, i) => (
            <motion.div
              key={integration.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.18 + i * 0.07 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                background: "#FFFFFF",
                border: "1px solid #E5E7EB",
                borderRadius: "14px",
                padding: "14px 20px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                minWidth: "160px",
              }}
            >
              {/* Logo placeholder */}
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "8px",
                  background: "rgba(22,133,91,0.1)",
                  border: "1px dashed rgba(22,133,91,0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "10px",
                    fontWeight: 700,
                    color: "#16855B",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {integration.abbr.slice(0, 2).toUpperCase()}
                </span>
              </div>
              <span
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#374151",
                }}
              >
                {integration.name}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Supporting line */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center text-base"
          style={{
            fontFamily: "var(--font-sans)",
            color: "#16855B",
            fontWeight: 500,
            marginBottom: "48px",
          }}
        >
          Connect one to start. Add more as you grow. The more Workenvo sees, the
          earlier it warns.
        </motion.p>

        {/* People image — full width */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          style={{
            borderRadius: "20px",
            overflow: "hidden",
            position: "relative",
            height: "340px",
            maxWidth: "860px",
            margin: "0 auto",
          }}
        >
          <img
            src="/images/integrations-team-collaboration.webp"
            alt="HR team collaborating around a laptop in a modern office"
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
    </section>
  );
}
