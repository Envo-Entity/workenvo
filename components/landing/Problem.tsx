import ScrollReveal from "./ScrollReveal";

export default function Problem() {
  return (
    <section
      className="relative py-28 px-6 overflow-hidden section-divider"
      style={{ background: "#F5F9F7" }}
    >
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Headline */}
        <ScrollReveal>
          <h2
            className="text-4xl lg:text-[52px] leading-tight mb-12 max-w-3xl"
            style={{
              fontFamily: "var(--font-serif)",
              color: "#111827",
              fontWeight: 400,
            }}
          >
            You don&apos;t have a people problem. You have a{" "}
            <span style={{ color: "#16855B" }}>visibility problem.</span>
          </h2>
        </ScrollReveal>

        {/* Reality Block */}
        <ScrollReveal delay={100}>
          <div className="mb-10">
            <p
              className="text-xl leading-relaxed mb-4 max-w-4xl"
              style={{ color: "#374151", fontFamily: "var(--font-sans)" }}
            >
              Teams burn out. Managers underperform. Culture drifts. ESG
              commitments don&apos;t translate into behaviour. And the same
              question always comes up:{" "}
              <span
                className="px-2 py-0.5 rounded-md font-medium"
                style={{ color: "#92400E", background: "#FEF3C7" }}
              >
                &ldquo;Why didn&apos;t we see this earlier?&rdquo;
              </span>
            </p>
            <p
              className="text-base max-w-3xl"
              style={{ color: "#6B7280", fontFamily: "var(--font-sans)" }}
            >
              Organisations invest in engagement surveys, performance tools, ESG
              platforms, and leadership programmes — but these systems only show
              what already happened, not what&apos;s changing or what to do next.
            </p>
          </div>
        </ScrollReveal>

        {/* Emotional Reality Cards */}
        <ScrollReveal delay={200}>
          <div className="elevated-card rounded-2xl p-10">
            <h3
              className="text-2xl lg:text-3xl mb-8"
              style={{
                fontFamily: "var(--font-serif)",
                color: "#111827",
                fontWeight: 400,
              }}
            >
              Behind the dashboards, there&apos;s uncertainty
            </h3>

            <div className="grid md:grid-cols-3 gap-6 mb-10">
              {[
                "Something feels off — but I can't prove it yet.",
                "We're always reacting instead of leading.",
                "Leadership expects answers I don't have.",
              ].map((quote, i) => (
                <div
                  key={i}
                  className="rounded-xl p-6"
                  style={{
                    background: "#F9FAFB",
                    borderLeft: "3px solid #16855B",
                  }}
                >
                  <p
                    className="text-lg italic leading-relaxed"
                    style={{
                      color: "#374151",
                      fontFamily: "var(--font-serif)",
                    }}
                  >
                    &ldquo;{quote}&rdquo;
                  </p>
                </div>
              ))}
            </div>

            <p
              className="text-base font-medium text-center"
              style={{ color: "#16855B", fontFamily: "var(--font-sans)" }}
            >
              The cost of not knowing is high — and it shows up too late.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
