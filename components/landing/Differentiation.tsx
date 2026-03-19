import { Fragment } from "react";
import ScrollReveal from "./ScrollReveal";

const comparisons = [
  { traditional: "Dashboards", workenvo: "Behavioural signals" },
  { traditional: "Surveys", workenvo: "Real-time insights" },
  { traditional: "Reports", workenvo: "Action + capability building" },
  { traditional: "Past data", workenvo: "What's changing now" },
  { traditional: "Reactive", workenvo: "Predictive" },
  { traditional: "Siloed tools", workenvo: "Connected intelligence" },
];

export default function Differentiation() {
  return (
    <section
      className="relative py-28 px-6 overflow-hidden section-divider"
      style={{ background: "#FFFFFF" }}
    >
      <div className="max-w-7xl mx-auto relative z-10">
        <ScrollReveal>
          <h2
            className="text-4xl lg:text-[48px] leading-tight mb-4 max-w-3xl"
            style={{
              fontFamily: "var(--font-serif)",
              color: "#111827",
              fontWeight: 400,
            }}
          >
            A new category:{" "}
            <span style={{ color: "#16855B" }}>Behaviour Intelligence</span>
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={100}>
          <p
            className="text-lg mb-16 max-w-2xl"
            style={{ color: "#6B7280", fontFamily: "var(--font-sans)" }}
          >
            Workenvo is not HR software. It is a system for understanding,
            influencing, and scaling organisational behaviour.
          </p>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-0 max-w-4xl mx-auto rounded-2xl overflow-hidden soft-card">
          {/* Traditional header */}
          <ScrollReveal>
            <div
              className="p-6"
              style={{
                background: "#F9FAFB",
                borderBottom: "1px solid #F3F4F6",
                borderRight: "1px solid #F3F4F6",
              }}
            >
              <p
                className="text-sm font-semibold uppercase tracking-wider"
                style={{ color: "#9CA3AF", fontFamily: "var(--font-sans)" }}
              >
                Traditional Tools
              </p>
            </div>
          </ScrollReveal>

          {/* Workenvo header */}
          <ScrollReveal delay={50}>
            <div
              className="p-6"
              style={{
                background: "#ECFDF5",
                borderBottom: "1px solid #D1FAE5",
              }}
            >
              <p
                className="text-sm font-semibold uppercase tracking-wider"
                style={{ color: "#065F46", fontFamily: "var(--font-sans)" }}
              >
                ✦ Workenvo
              </p>
            </div>
          </ScrollReveal>

          {/* Comparison rows */}
          {comparisons.map((row, i) => (
            <Fragment key={i}>
              <ScrollReveal delay={i * 60}>
                <div
                  className="p-5 flex items-center"
                  style={{
                    background: i % 2 === 0 ? "#FFFFFF" : "#FAFAFA",
                    borderBottom: "1px solid #F3F4F6",
                    borderRight: "1px solid #F3F4F6",
                  }}
                >
                  <span
                    className="text-base line-through"
                    style={{ color: "#9CA3AF", fontFamily: "var(--font-sans)" }}
                  >
                    {row.traditional}
                  </span>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={i * 60 + 30}>
                <div
                  className="p-5 flex items-center gap-3"
                  style={{
                    background: i % 2 === 0 ? "#F5FBF8" : "#F0F9F5",
                    borderBottom: "1px solid #D1FAE5",
                  }}
                >
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0"
                    style={{ background: "#16855B", color: "#FFFFFF" }}
                  >
                    ✓
                  </span>
                  <span
                    className="text-base font-medium"
                    style={{ color: "#111827", fontFamily: "var(--font-sans)" }}
                  >
                    {row.workenvo}
                  </span>
                </div>
              </ScrollReveal>
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
