"use client";

import { motion } from "motion/react";
import WorkenvoDashboard from "@/components/landing/WorkenvoDashboard";

const pills = ["Health Score", "Risk detection", "Recommended actions", "Live signals"];

export default function DashboardPreview() {
  return (
    <section
      id="product"
      className="relative py-24 px-6 overflow-hidden"
      style={{ background: "#F9FAFB" }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
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
            One screen
          </p>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(34px, 4.5vw, 56px)",
              fontWeight: 400,
              lineHeight: 1.1,
              color: "#111827",
              marginBottom: "20px",
            }}
          >
            Everything you need to act.{" "}
            <span style={{ color: "rgba(17,24,39,0.4)" }}>Nothing you don&apos;t.</span>
          </h2>

          {/* Feature pills */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {pills.map((pill) => (
              <span
                key={pill}
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "#16855B",
                  background: "rgba(22,133,91,0.08)",
                  border: "1px solid rgba(22,133,91,0.2)",
                  borderRadius: "100px",
                  padding: "5px 14px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                {pill === "Live signals" && (
                  <span
                    className="dot-live"
                    style={{
                      display: "inline-block",
                      width: "7px",
                      height: "7px",
                      borderRadius: "50%",
                      background: "#16855B",
                      flexShrink: 0,
                    }}
                  />
                )}
                {pill}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15 }}
          style={{
            borderRadius: "20px",
            overflow: "hidden",
            boxShadow:
              "0 20px 60px rgba(0,0,0,0.1), 0 4px 16px rgba(0,0,0,0.06)",
            border: "1px solid #E5E7EB",
          }}
        >
          <WorkenvoDashboard activeTab="leadership" />
        </motion.div>

      </div>
    </section>
  );
}
