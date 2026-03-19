import ScrollReveal from "./ScrollReveal";

const steps = [
  {
    num: "01",
    name: "Define",
    desc: "Identify the capabilities your organisation needs to succeed. Start with strategy, not assumption.",
    emoji: "🎯",
  },
  {
    num: "02",
    name: "Translate",
    desc: "Map the behaviours that drive those capabilities. Make the intangible concrete.",
    emoji: "🔀",
  },
  {
    num: "03",
    name: "Detect",
    desc: "Surface behavioural signals and risks in real time. See what's changing before it becomes a problem.",
    emoji: "👁️",
  },
  {
    num: "04",
    name: "Reinforce",
    desc: "Drive adoption through incentives and engagement. Reward the behaviours that matter.",
    emoji: "💪",
  },
  {
    num: "05",
    name: "Build & Prove",
    desc: "Turn behaviour into measurable capability and outcomes. Prove the impact of culture.",
    emoji: "📈",
  },
];

export default function CapabilityLoop() {
  return (
    <section
      className="relative py-28 px-6 overflow-hidden section-divider"
      style={{ background: "#F5F9F7" }}
    >
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Eyebrow */}
        <ScrollReveal>
          <div className="text-center mb-6">
            <span className="tag-green inline-block rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide">
              The Workenvo Capability Loop
            </span>
          </div>
        </ScrollReveal>

        {/* Headline */}
        <ScrollReveal delay={100}>
          <h2
            className="text-4xl lg:text-[48px] leading-tight text-center mb-4 mx-auto"
            style={{
              fontFamily: "var(--font-serif)",
              color: "#111827",
              fontWeight: 400,
              maxWidth: "800px",
            }}
          >
            Strategy doesn&apos;t fail because it&apos;s wrong. It fails
            because it doesn&apos;t show up in behaviour.
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={150}>
          <p
            className="text-lg text-center mb-20 font-medium"
            style={{ color: "#16855B", fontFamily: "var(--font-sans)" }}
          >
            Workenvo closes that gap.
          </p>
        </ScrollReveal>

        {/* Steps */}
        <div className="relative max-w-3xl mx-auto">
          {/* Connecting line */}
          <div
            className="absolute left-[27px] top-8 bottom-8 w-0.5 hidden lg:block rounded-full"
            style={{
              background:
                "linear-gradient(to bottom, transparent, #D1FAE5 10%, #A7F3D0 90%, transparent)",
            }}
          />

          <div className="space-y-10">
            {steps.map((step, i) => (
              <ScrollReveal key={step.num} delay={i * 90}>
                <div className="flex gap-8 items-start group">
                  {/* Step badge */}
                  <div className="relative flex-shrink-0">
                    <div
                      className="w-14 h-14 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 soft-card"
                      style={{ background: "#ECFDF5", border: "1.5px solid #A7F3D0" }}
                    >
                      <span className="text-xl leading-none">{step.emoji}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="pt-2">
                    <div className="flex items-center gap-3 mb-1">
                      <span
                        className="text-xs font-semibold"
                        style={{ color: "#16855B" }}
                      >
                        {step.num}
                      </span>
                      <h3
                        className="text-2xl"
                        style={{
                          fontFamily: "var(--font-serif)",
                          color: "#111827",
                          fontWeight: 400,
                        }}
                      >
                        {step.name}
                      </h3>
                    </div>
                    <p
                      className="text-base leading-relaxed"
                      style={{ color: "#6B7280", fontFamily: "var(--font-sans)" }}
                    >
                      {step.desc}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
