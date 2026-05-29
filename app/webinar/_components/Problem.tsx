import { ScrollReveal } from "./ScrollReveal";

const signals = [
  "motivation declines",
  "communication breaks down",
  "leadership trust weakens",
  "managers become reactive",
  "high performers quietly disengage",
];

export function Problem() {
  return (
    <section
      id="problem"
      className="relative py-32 md:py-40 px-6 overflow-hidden"
    >
      {/* Ambient glow — amber warning undertone */}
      <div
        className="absolute bottom-0 left-0 w-96 h-96 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse at 0% 100%, oklch(0.76 0.16 68 / 0.06), transparent 60%)",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
        {/* Left: headline block */}
        <div>
          <ScrollReveal>
            <span className="webinar-chapter-label block mb-6">02 &mdash; The Problem</span>
          </ScrollReveal>

          <ScrollReveal delay={80}>
            <h2
              className="font-webinar-heading font-normal text-webinar-ink mb-8"
              style={{ fontSize: "clamp(2rem, 3vw + 0.5rem, 3.25rem)", lineHeight: 1.05, letterSpacing: "-0.02em" }}
            >
              Organisations Are Solving Problems
              <br />
              Too Late
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={160}>
            <div className="space-y-5 text-webinar-ink-dim leading-[1.8]" style={{ fontSize: "clamp(0.95rem, 0.8vw + 0.4rem, 1.05rem)" }}>
              <p>
                Disengagement does not happen overnight. Burnout rarely appears
                suddenly. Performance decline is usually visible long before KPIs
                begin falling.
              </p>
              <p>
                The challenge is that most organisations cannot see the hidden
                behavioural and cultural signals developing underneath the surface.
                Traditional engagement surveys and performance reviews only capture
                fragments of the employee experience.
              </p>
            </div>
          </ScrollReveal>
        </div>

        {/* Right: signal list */}
        <div className="lg:pt-16">
          <ScrollReveal delay={100}>
            <p className="text-xs tracking-[0.18em] uppercase font-semibold text-webinar-ink-faint mb-8">
              Meanwhile, inside your organisation
            </p>
          </ScrollReveal>

          <ul className="space-y-1" role="list">
            {signals.map((signal, i) => (
              <ScrollReveal key={signal} delay={180 + i * 130}>
                <li className="group flex items-center gap-5 py-4 border-b border-webinar-wire/30 last:border-none">
                  <span className="size-2 rounded-full bg-webinar-gold flex-shrink-0 opacity-70 group-hover:opacity-100 transition-opacity duration-200" />
                  <span
                    className="text-webinar-ink-dim font-medium group-hover:text-webinar-ink transition-colors duration-200"
                    style={{ fontSize: "clamp(1rem, 1vw + 0.4rem, 1.15rem)" }}
                  >
                    {signal}
                  </span>
                </li>
              </ScrollReveal>
            ))}
          </ul>

          {/* Closing statement */}
          <ScrollReveal delay={180 + signals.length * 130 + 100}>
            <p
              className="mt-10 font-webinar-heading font-normal text-webinar-accent"
              style={{ fontSize: "clamp(1.25rem, 1.5vw + 0.5rem, 1.75rem)", letterSpacing: "-0.02em" }}
            >
              AI is changing that.
            </p>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
