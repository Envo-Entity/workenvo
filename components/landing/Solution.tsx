import ScrollReveal from "./ScrollReveal";

const pillars = [
  {
    emoji: "🎯",
    label: "Define",
    desc: "Identify the capabilities your organisation needs to succeed",
  },
  {
    emoji: "🔍",
    label: "Detect",
    desc: "Surface behavioural signals and risks in real time",
  },
  {
    emoji: "💡",
    label: "Reinforce",
    desc: "Drive adoption through incentives and targeted engagement",
  },
  {
    emoji: "📊",
    label: "Build & Prove",
    desc: "Turn behaviour into measurable capability and outcomes",
  },
];

export default function Solution() {
  return (
    <section
      className="relative py-28 px-6 overflow-hidden section-divider"
      style={{ background: "#FFFFFF" }}
    >
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Headline + Copy */}
          <div>
            <ScrollReveal>
              <h2
                className="text-4xl lg:text-[52px] leading-tight mb-6"
                style={{
                  fontFamily: "var(--font-serif)",
                  color: "#111827",
                  fontWeight: 400,
                }}
              >
                From behaviour to capability
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <p
                className="text-lg leading-relaxed"
                style={{ color: "#6B7280", fontFamily: "var(--font-sans)" }}
              >
                Workenvo connects what organisations say matters to what
                actually happens every day. Define behaviours, detect gaps,
                reinforce actions, and turn behaviour into measurable capability.
              </p>
            </ScrollReveal>
          </div>

          {/* Right: Pillars */}
          <div className="grid grid-cols-2 gap-4">
            {pillars.map((pillar, i) => (
              <ScrollReveal key={pillar.label} delay={i * 80}>
                <div className="soft-card lift-hover rounded-2xl p-6 h-full">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl mb-4"
                    style={{ background: "#ECFDF5" }}
                  >
                    {pillar.emoji}
                  </div>
                  <h3
                    className="text-lg mb-2 font-medium"
                    style={{
                      fontFamily: "var(--font-serif)",
                      color: "#111827",
                    }}
                  >
                    {pillar.label}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "#6B7280", fontFamily: "var(--font-sans)" }}
                  >
                    {pillar.desc}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
