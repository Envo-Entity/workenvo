import ScrollReveal from "./ScrollReveal";

const outcomes = [
  {
    emoji: "🔭",
    label: "Early Visibility",
    quote: "We saw this coming sooner.",
    desc: "Surface risks before they become crises.",
    wide: false,
  },
  {
    emoji: "🧠",
    label: "Better Decisions",
    quote: "We knew what to do.",
    desc: "AI-powered recommendations, not just data.",
    wide: false,
  },
  {
    emoji: "🤝",
    label: "Leadership Consistency",
    quote: "Managers behave more consistently.",
    desc: "Align behaviour with intent across the org.",
    wide: false,
  },
  {
    emoji: "🌱",
    label: "Culture Strength",
    quote: "Culture is visible and reinforced.",
    desc: "Make culture measurable, not just aspirational.",
    wide: true,
  },
  {
    emoji: "🌍",
    label: "ESG Impact",
    quote: "We can prove behavioural change.",
    desc: "From commitments to evidence.",
    wide: false,
  },
  {
    emoji: "🚀",
    label: "Future Readiness",
    quote: "We are building capability, not just tracking it.",
    desc: "Build organisations that can adapt.",
    wide: false,
  },
];

export default function OutcomesSection() {
  return (
    <section
      className="relative py-28 px-6 overflow-hidden section-divider"
      style={{ background: "#F5F9F7" }}
    >
      <div className="max-w-7xl mx-auto relative z-10">
        <ScrollReveal>
          <h2
            className="text-4xl lg:text-[48px] leading-tight mb-4"
            style={{
              fontFamily: "var(--font-serif)",
              color: "#111827",
              fontWeight: 400,
            }}
          >
            What Workenvo makes possible
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={100}>
          <p
            className="text-lg mb-16"
            style={{ color: "#6B7280", fontFamily: "var(--font-sans)" }}
          >
            Real outcomes for people who shape organisations.
          </p>
        </ScrollReveal>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {outcomes.map((outcome, i) => (
            <ScrollReveal
              key={outcome.label}
              delay={i * 80}
              className={outcome.wide ? "md:col-span-2" : ""}
            >
              <div
                className="soft-card lift-hover rounded-2xl p-8 h-full"
                style={{ minHeight: "200px" }}
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-5"
                  style={{ background: "#ECFDF5" }}
                >
                  {outcome.emoji}
                </div>
                <p
                  className="text-xs font-semibold uppercase tracking-wider mb-3"
                  style={{ color: "#16855B", fontFamily: "var(--font-sans)" }}
                >
                  {outcome.label}
                </p>
                <h3
                  className="text-xl lg:text-2xl mb-3 italic"
                  style={{
                    fontFamily: "var(--font-serif)",
                    color: "#111827",
                    fontWeight: 400,
                  }}
                >
                  &ldquo;{outcome.quote}&rdquo;
                </h3>
                <p
                  className="text-sm"
                  style={{ color: "#6B7280", fontFamily: "var(--font-sans)" }}
                >
                  {outcome.desc}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
