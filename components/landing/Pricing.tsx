"use client";

import { motion } from "motion/react";

type PricingTier = {
  name: string;
  price: string;
  tagline: string;
  features: string[];
  cta: string;
  ctaHref: string;
  highlighted: boolean;
};

const TIERS: PricingTier[] = [
  {
    name: "Workenvo Start",
    price: "Free",
    tagline: "For HR teams who want to stop being blindsided.",
    features: [
      "1 integration",
      "Weekly Workforce Health Score",
      "Top 3 Risks",
      "Basic sentiment signals",
      "Survey builder (3 questions per employee/month)",
    ],
    cta: "Start free",
    ctaHref: "#",
    highlighted: false,
  },
  {
    name: "Workenvo Pro",
    price: "€99–299/mo",
    tagline: "When you want the full risk picture.",
    features: [
      "Everything in Start",
      "Attrition Risk",
      "Burnout Risk",
      "Manager Effectiveness",
      "Team Health",
      "Pulse Surveys",
      "Sentiment Analysis",
    ],
    cta: "Get Pro",
    ctaHref: "#",
    highlighted: true,
  },
  {
    name: "Workenvo Performance",
    price: "Contact us",
    tagline: "Once you trust the signals, solve the performance side.",
    features: [
      "Everything in Pro",
      "1:1s",
      "Objectives & Goals",
      "Reviews",
      "Coaching",
    ],
    cta: "Book a demo",
    ctaHref: "#",
    highlighted: false,
  },
  {
    name: "Workenvo Intelligence",
    price: "Contact us",
    tagline: "The full system — predictive, benchmarked, AI-assisted.",
    features: [
      "Everything in Performance",
      "Predictive Analytics",
      "Benchmarking",
      "AI HR Assistant",
      "Workforce Planning",
      "Sustainability & ESG",
    ],
    cta: "Book a demo",
    ctaHref: "#",
    highlighted: false,
  },
];

function CheckIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default function Pricing() {
  return (
    <section
      id="pricing"
      className="relative py-32 px-6 overflow-hidden"
      style={{ background: "#F9FAFB" }}
    >
      {/* Ambient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(22,133,91,0.05) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
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
            Pricing
          </p>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(36px, 5vw, 60px)",
              fontWeight: 400,
              lineHeight: 1.1,
              color: "#111827",
              marginBottom: "16px",
            }}
          >
            A product you can start today
          </h2>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "clamp(15px, 1.6vw, 18px)",
              color: "#6B7280",
              lineHeight: 1.65,
              maxWidth: "460px",
              margin: "0 auto 20px",
            }}
          >
            Begin with the early warning system. Expand into the full platform
            when you&apos;re ready. From €1 per employee per month.
          </p>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "#ECFDF5",
              border: "1px solid rgba(22,133,91,0.2)",
              borderRadius: "100px",
              padding: "5px 14px",
              fontFamily: "var(--font-sans)",
              fontSize: "13px",
              fontWeight: 500,
              color: "#16855B",
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Getting started is free
          </span>
        </motion.div>

        {/* Tier cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {TIERS.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 32, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: tier.highlighted ? -6 : -4, scale: tier.highlighted ? 1.02 : 1.01 }}
              whileTap={{ scale: 0.98 }}
              style={{
                background: tier.highlighted ? "#16855B" : "#FFFFFF",
                border: tier.highlighted
                  ? "2px solid #16855B"
                  : "1px solid #E5E7EB",
                borderRadius: "20px",
                padding: "28px 24px",
                display: "flex",
                flexDirection: "column",
                boxShadow: tier.highlighted
                  ? "0 20px 48px rgba(22,133,91,0.25), 0 4px 12px rgba(22,133,91,0.15)"
                  : "0 1px 3px rgba(0,0,0,0.06)",
                position: "relative",
                cursor: "default",
                transition: "box-shadow 200ms cubic-bezier(0.16,1,0.3,1)",
              }}
            >
              {tier.highlighted && (
                <div
                  style={{
                    position: "absolute",
                    top: "-12px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "#D97706",
                    color: "#FFFFFF",
                    fontFamily: "var(--font-sans)",
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    padding: "4px 14px",
                    borderRadius: "100px",
                    whiteSpace: "nowrap",
                  }}
                >
                  Most popular
                </div>
              )}

              {/* Tier name */}
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: tier.highlighted ? "rgba(255,255,255,0.7)" : "#16855B",
                  marginBottom: "8px",
                }}
              >
                {tier.name}
              </p>

              {/* Price */}
              <p
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "clamp(26px, 3vw, 32px)",
                  fontWeight: 400,
                  color: tier.highlighted ? "#FFFFFF" : "#111827",
                  lineHeight: 1.1,
                  marginBottom: "10px",
                }}
              >
                {tier.price}
              </p>

              {/* Tagline */}
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "13px",
                  color: tier.highlighted ? "rgba(255,255,255,0.7)" : "#6B7280",
                  lineHeight: 1.5,
                  marginBottom: "24px",
                  minHeight: "40px",
                }}
              >
                {tier.tagline}
              </p>

              {/* Divider */}
              <div
                style={{
                  height: "1px",
                  background: tier.highlighted ? "rgba(255,255,255,0.2)" : "#E5E7EB",
                  marginBottom: "20px",
                }}
              />

              {/* Features */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  flex: 1,
                  marginBottom: "28px",
                }}
              >
                {tier.features.map((feature) => (
                  <div
                    key={feature}
                    style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}
                  >
                    <span
                      style={{
                        flexShrink: 0,
                        width: "18px",
                        height: "18px",
                        borderRadius: "50%",
                        background: tier.highlighted
                          ? "rgba(255,255,255,0.2)"
                          : "#ECFDF5",
                        color: tier.highlighted ? "#FFFFFF" : "#16855B",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: "1px",
                      }}
                    >
                      <CheckIcon />
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "13px",
                        color: tier.highlighted ? "rgba(255,255,255,0.85)" : "#374151",
                        lineHeight: 1.45,
                      }}
                    >
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <motion.a
                href={tier.ctaHref}
                whileTap={{ scale: 0.96 }}
                style={{
                  display: "block",
                  textAlign: "center",
                  padding: "12px 20px",
                  borderRadius: "12px",
                  fontFamily: "var(--font-sans)",
                  fontSize: "14px",
                  fontWeight: 600,
                  textDecoration: "none",
                  background: tier.highlighted ? "#FFFFFF" : "transparent",
                  color: "#16855B",
                  border: tier.highlighted ? "none" : "1.5px solid rgba(22,133,91,0.4)",
                  transition: "background 160ms cubic-bezier(0.16,1,0.3,1), transform 120ms cubic-bezier(0.16,1,0.3,1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = tier.highlighted
                    ? "rgba(255,255,255,0.88)"
                    : "rgba(22,133,91,0.07)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = tier.highlighted ? "#FFFFFF" : "transparent";
                }}
              >
                {tier.cta}
              </motion.a>
            </motion.div>
          ))}
        </div>

        {/* Supporting line */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center text-base"
          style={{
            fontFamily: "var(--font-sans)",
            color: "#9CA3AF",
            maxWidth: "500px",
            margin: "0 auto 48px",
          }}
        >
          No big bet. No rip-and-replace. Start with one signal — grow into the
          whole platform.
        </motion.p>

        {/* Bottom CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.a
            href="#"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
            className="inline-flex items-center gap-2 rounded-xl font-medium text-white"
            style={{
              background: "#16855B",
              boxShadow: "0 4px 20px rgba(22,133,91,0.3)",
              fontFamily: "var(--font-sans)",
              fontSize: "15px",
              padding: "14px 36px",
              textDecoration: "none",
              transition: "background 160ms cubic-bezier(0.16,1,0.3,1), box-shadow 160ms cubic-bezier(0.16,1,0.3,1)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#0F6E50";
              e.currentTarget.style.boxShadow = "0 6px 28px rgba(22,133,91,0.42)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#16855B";
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(22,133,91,0.3)";
            }}
          >
            Start free
          </motion.a>
          <motion.a
            href="#"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
            className="inline-flex items-center gap-2 rounded-xl font-medium"
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "15px",
              padding: "14px 36px",
              color: "#374151",
              background: "#FFFFFF",
              border: "1.5px solid #E5E7EB",
              textDecoration: "none",
              transition: "border-color 160ms cubic-bezier(0.16,1,0.3,1)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#D1D5DB")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#E5E7EB")}
          >
            Book a demo
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
