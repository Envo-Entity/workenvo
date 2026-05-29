import { ScrollReveal } from "./ScrollReveal";

const audience = [
  "HR Leaders",
  "People & Culture Teams",
  "CEOs & Founders",
  "Team Managers",
  "Operations Leaders",
  "Sales Leaders",
  "Transformation Leaders",
  "Organisations focused on culture and performance",
];

export function Audience() {
  return (
    <section
      id="audience"
      className="relative py-32 md:py-40 px-6 bg-webinar-surface overflow-hidden"
    >
      {/* Green ambient glow */}
      <div
        className="absolute top-0 right-0 w-80 h-80 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse at 100% 0%, rgba(22,133,91,0.05), transparent 60%)",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        {/* Left */}
        <div>
          <ScrollReveal>
            <span className="webinar-chapter-label block mb-6">05 &mdash; Who It&apos;s For</span>
          </ScrollReveal>

          <ScrollReveal delay={80}>
            <h2
              className="font-webinar-heading font-normal text-webinar-ink"
              style={{ fontSize: "clamp(2rem, 3vw + 0.5rem, 3.25rem)", lineHeight: 1.05, letterSpacing: "-0.02em" }}
            >
              Designed For
              <br />
              Forward-Thinking
              <br />
              Leaders
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={180}>
            <p className="mt-8 text-webinar-ink-dim leading-[1.8] max-w-sm" style={{ fontSize: "clamp(0.95rem, 0.8vw + 0.4rem, 1.05rem)" }}>
              This webinar is built for the people shaping how organisations work,
              perform, and retain talent in the age of AI.
            </p>
          </ScrollReveal>
        </div>

        {/* Right: audience roll call */}
        <ul className="space-y-0" role="list">
          {audience.map((person, i) => (
            <ScrollReveal key={person} delay={i * 90}>
              <li className="group flex items-center gap-5 py-5 border-b border-webinar-wire/40 last:border-none cursor-default">
                <span className="size-2 rounded-full bg-webinar-teal/60 flex-shrink-0 group-hover:bg-webinar-teal transition-colors duration-200" />
                <span
                  className="font-semibold text-webinar-ink-dim group-hover:text-webinar-ink transition-colors duration-200"
                  style={{ fontSize: "clamp(1rem, 1.2vw + 0.3rem, 1.25rem)" }}
                >
                  {person}
                </span>
              </li>
            </ScrollReveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
