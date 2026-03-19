import ScrollReveal from "./ScrollReveal";

const personas = [
  {
    emoji: "🌟",
    title: "Employees",
    features: [
      "Log behaviours, earn rewards",
      "Participate in surveys",
      "Access marketplace",
      "Receive AI nudges",
    ],
    featured: false,
  },
  {
    emoji: "🧭",
    title: "Managers",
    features: [
      "Real-time alerts",
      "Behaviour insights",
      "Recommended actions",
      "Performance tracking",
    ],
    featured: true,
  },
  {
    emoji: "🏢",
    title: "HR & Leadership",
    features: [
      "Organisation-wide insights",
      "Capability tracking",
      "ESG metrics",
      "Risk detection",
    ],
    featured: false,
  },
];

const aiSignals = [
  "Burnout detection",
  "Missed reviews",
  "Engagement drops",
  "Culture drift alerts",
  "Performance signals",
];

export default function ProductSection() {
  return (
    <section
      className="relative py-28 px-6 overflow-hidden section-divider"
      style={{ background: "#FFFFFF" }}
    >
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Headline */}
        <ScrollReveal>
          <h2
            className="text-4xl lg:text-[48px] leading-tight mb-4 max-w-3xl"
            style={{
              fontFamily: "var(--font-serif)",
              color: "#111827",
              fontWeight: 400,
            }}
          >
            Built for everyone who shapes organisational performance
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={80}>
          <p
            className="text-lg mb-16 max-w-2xl"
            style={{ color: "#6B7280", fontFamily: "var(--font-sans)" }}
          >
            Whether you&apos;re an employee, manager, or executive — Workenvo
            meets you where you are.
          </p>
        </ScrollReveal>

        {/* Persona Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {personas.map((persona, i) => (
            <ScrollReveal key={persona.title} delay={i * 100}>
              <div
                className="rounded-2xl p-8 h-full transition-all duration-300"
                style={{
                  background: "#FFFFFF",
                  border: persona.featured
                    ? "2px solid #16855B"
                    : "1px solid #E5E7EB",
                  boxShadow: persona.featured
                    ? "0 8px 24px rgba(22, 133, 91, 0.12)"
                    : "0 1px 3px rgba(0,0,0,0.06)",
                  transform: persona.featured ? "translateY(-6px)" : "none",
                }}
              >
                {persona.featured && (
                  <div className="tag-green rounded-full px-3 py-1 text-xs font-semibold inline-block mb-4">
                    Most popular
                  </div>
                )}

                {/* Icon */}
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-5"
                  style={{
                    background: persona.featured ? "#ECFDF5" : "#F9FAFB",
                  }}
                >
                  {persona.emoji}
                </div>

                <h3
                  className="text-2xl mb-5"
                  style={{
                    fontFamily: "var(--font-serif)",
                    color: "#111827",
                    fontWeight: 400,
                  }}
                >
                  {persona.title}
                </h3>

                <ul className="space-y-3">
                  {persona.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-3 text-sm"
                      style={{ color: "#374151", fontFamily: "var(--font-sans)" }}
                    >
                      <span
                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs"
                        style={{ background: "#ECFDF5", color: "#16855B" }}
                      >
                        ✓
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* AI Layer Banner */}
        <ScrollReveal delay={300}>
          <div
            className="rounded-2xl p-8"
            style={{
              background: "linear-gradient(135deg, #ECFDF5 0%, #F0FDF4 100%)",
              border: "1px solid #A7F3D0",
            }}
          >
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">🤖</span>
                  <h3
                    className="text-2xl"
                    style={{
                      fontFamily: "var(--font-serif)",
                      color: "#111827",
                      fontWeight: 400,
                    }}
                  >
                    From signals to action
                  </h3>
                </div>
                <p
                  className="text-base"
                  style={{ color: "#6B7280", fontFamily: "var(--font-sans)" }}
                >
                  Workenvo doesn&apos;t just show data. It tells you what
                  matters and what to do next.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {aiSignals.map((signal) => (
                  <span
                    key={signal}
                    className="tag-green px-3 py-1.5 rounded-full text-sm font-medium"
                  >
                    {signal}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
