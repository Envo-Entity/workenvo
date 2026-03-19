import ScrollReveal from "./ScrollReveal";

const metrics = [
  { label: "ESG Commitments", value: 100, color: "#16855B" },
  { label: "Behavioural Adoption", value: 74, color: "#1A9A6B" },
  { label: "Measured Impact", value: 61, color: "#D97706" },
  { label: "CSRD Ready", value: 89, color: "#16855B" },
];

export default function ESGSection() {
  return (
    <section
      className="relative py-28 px-6 overflow-hidden section-divider"
      style={{ background: "#FFFFFF" }}
    >
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Copy */}
          <div>
            <ScrollReveal>
              <span className="tag-green rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide inline-block mb-6">
                ESG & CSRD
              </span>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <h2
                className="text-4xl lg:text-[48px] leading-tight mb-6"
                style={{
                  fontFamily: "var(--font-serif)",
                  color: "#111827",
                  fontWeight: 400,
                }}
              >
                From reporting to real impact
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <p
                className="text-lg leading-relaxed"
                style={{ color: "#6B7280", fontFamily: "var(--font-sans)" }}
              >
                Track sustainability, governance, and social behaviours. Measure
                adoption and impact. Generate CSRD-ready reports aligned to real
                behavioural change — not just intentions.
              </p>
            </ScrollReveal>
          </div>

          {/* Right: Progress Card */}
          <ScrollReveal delay={300}>
            <div className="elevated-card rounded-2xl p-8">
              <h3
                className="text-base font-semibold mb-8"
                style={{ color: "#374151", fontFamily: "var(--font-sans)" }}
              >
                ESG Commitments → Behaviours → Measured Impact
              </h3>

              <div className="space-y-6">
                {metrics.map((metric) => (
                  <div key={metric.label}>
                    <div className="flex justify-between items-center mb-2">
                      <span
                        className="text-sm font-medium"
                        style={{ color: "#374151", fontFamily: "var(--font-sans)" }}
                      >
                        {metric.label}
                      </span>
                      <span
                        className="text-sm font-semibold"
                        style={{ color: "#111827", fontFamily: "var(--font-sans)" }}
                      >
                        {metric.value}%
                      </span>
                    </div>
                    <div
                      className="h-2.5 rounded-full overflow-hidden"
                      style={{ background: "#F3F4F6" }}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{
                          width: `${metric.value}%`,
                          background: `linear-gradient(90deg, ${metric.color}80, ${metric.color})`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div
                className="mt-8 pt-6 flex items-center gap-3"
                style={{ borderTop: "1px solid #F3F4F6" }}
              >
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0"
                  style={{ background: "#ECFDF5", color: "#16855B" }}
                >
                  ✓
                </span>
                <span
                  className="text-sm font-medium"
                  style={{ color: "#374151", fontFamily: "var(--font-sans)" }}
                >
                  CSRD Report ready · Last updated: Q1 2026
                </span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
