import ScrollReveal from "./ScrollReveal";

export default function ProofCard() {
  return (
    <section
      className="relative py-28 px-6 overflow-hidden section-divider"
      style={{ background: "#F5F9F7" }}
    >
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Copy */}
          <div>
            <ScrollReveal>
              <h2
                className="text-4xl lg:text-[48px] leading-tight mb-6"
                style={{
                  fontFamily: "var(--font-serif)",
                  color: "#111827",
                  fontWeight: 400,
                }}
              >
                From conversation to clarity
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <p
                className="text-lg leading-relaxed"
                style={{ color: "#6B7280", fontFamily: "var(--font-sans)" }}
              >
                Every interaction becomes structured insight: objectives,
                performance gaps, sentiment, and actions. Workenvo transforms
                unstructured signals into decisions you can act on today.
              </p>
            </ScrollReveal>
          </div>

          {/* Right: Insight Card (friendly, not terminal) */}
          <ScrollReveal delay={200}>
            <div
              className="elevated-card rounded-2xl overflow-hidden"
            >
              {/* Card header */}
              <div
                className="flex items-center justify-between px-6 py-4"
                style={{
                  background: "#ECFDF5",
                  borderBottom: "1px solid #D1FAE5",
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                    style={{ background: "#16855B", color: "#FFFFFF" }}
                  >
                    👤
                  </div>
                  <div>
                    <p
                      className="text-sm font-semibold"
                      style={{ color: "#111827" }}
                    >
                      Employee Profile
                    </p>
                    <p className="text-xs" style={{ color: "#6B7280" }}>
                      Insight summary · Updated just now
                    </p>
                  </div>
                </div>
                <span
                  className="tag-green px-3 py-1 rounded-full text-xs font-semibold"
                >
                  High potential
                </span>
              </div>

              {/* Card body */}
              <div className="p-6 space-y-4" style={{ background: "#FFFFFF" }}>
                {/* Signal */}
                <div
                  className="rounded-xl p-4"
                  style={{ background: "#FEF9EC", border: "1px solid #FDE68A" }}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-lg mt-0.5">⚠️</span>
                    <div>
                      <p
                        className="text-sm font-semibold mb-1"
                        style={{ color: "#92400E" }}
                      >
                        Signal detected
                      </p>
                      <p className="text-sm" style={{ color: "#78350F" }}>
                        Declining motivation — perceived unfair lead
                        distribution
                      </p>
                    </div>
                  </div>
                </div>

                {/* Trend */}
                <div className="flex items-center gap-4">
                  <div
                    className="rounded-xl p-3 flex items-center gap-2 flex-1"
                    style={{ background: "#FEF2F2", border: "1px solid #FECACA" }}
                  >
                    <span className="text-base">📉</span>
                    <div>
                      <p className="text-xs font-medium" style={{ color: "#991B1B" }}>
                        Activity trend
                      </p>
                      <p className="text-sm font-bold" style={{ color: "#7F1D1D" }}>
                        −34% over 6 weeks
                      </p>
                    </div>
                  </div>
                  <div
                    className="rounded-xl p-3 flex items-center gap-2 flex-1"
                    style={{ background: "#ECFDF5", border: "1px solid #A7F3D0" }}
                  >
                    <span className="text-base">✅</span>
                    <div>
                      <p className="text-xs font-medium" style={{ color: "#065F46" }}>
                        Confidence
                      </p>
                      <p className="text-sm font-bold" style={{ color: "#064E3B" }}>
                        91% · High priority
                      </p>
                    </div>
                  </div>
                </div>

                {/* Recommended action */}
                <div
                  className="rounded-xl p-4"
                  style={{ background: "#F5F9F7", border: "1px solid #D1FAE5" }}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-lg mt-0.5">💡</span>
                    <div>
                      <p
                        className="text-sm font-semibold mb-1"
                        style={{ color: "#16855B" }}
                      >
                        Recommended action
                      </p>
                      <p className="text-sm" style={{ color: "#374151" }}>
                        Manager review + rebalancing of lead assignments
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
