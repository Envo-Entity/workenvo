import { ScrollReveal } from "./ScrollReveal";

const speakers = [
  {
    name: "Speaker Name",
    title: "Role, Organisation",
  },
  {
    name: "Speaker Name",
    title: "Role, Organisation",
  },
  {
    name: "Speaker Name",
    title: "Role, Organisation",
  },
];

export function Speakers() {
  return (
    <section
      id="speakers"
      className="relative py-16 md:py-20 px-6 bg-webinar-surface overflow-hidden"
    >
      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <ScrollReveal>
          <span className="webinar-chapter-label block mb-6">02 &mdash; Your Hosts</span>
        </ScrollReveal>

        <ScrollReveal delay={60}>
          <h2
            className="font-webinar-heading font-normal text-webinar-ink mb-5"
            style={{ fontSize: "clamp(2rem, 3.5vw, 3.25rem)", lineHeight: 1.08, letterSpacing: "-0.02em" }}
          >
            Meet the Experts Behind the Insight
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={120}>
          <p
            className="text-webinar-ink-dim leading-[1.75] max-w-2xl mx-auto mb-12"
            style={{ fontSize: "clamp(1rem, 0.8vw + 0.5rem, 1.125rem)" }}
          >
            Workenvo helps organisations uncover hidden workforce signals impacting
            culture, engagement, wellbeing, and performance — moving teams from
            reactive people management to proactive organisational improvement.
          </p>
        </ScrollReveal>

        {/* Three speaker circles */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-12 sm:gap-16 lg:gap-24">
          {speakers.map((speaker, i) => (
            <ScrollReveal key={i} delay={180 + i * 80}>
              <div className="flex flex-col items-center gap-5">
                {/* Circular photo placeholder */}
                <div
                  className="rounded-full border-2 border-webinar-wire bg-webinar-raised flex items-center justify-center shadow-[0_0_48px_rgba(22,133,91,0.08)]"
                  style={{ width: 200, height: 200, flexShrink: 0 }}
                >
                  <svg
                    width="64"
                    height="64"
                    viewBox="0 0 64 64"
                    fill="none"
                    aria-hidden="true"
                  >
                    <circle cx="32" cy="26" r="13" fill="rgba(22,133,91,0.15)" />
                    <ellipse cx="32" cy="56" rx="22" ry="14" fill="rgba(22,133,91,0.1)" />
                  </svg>
                </div>

                {/* Name & title */}
                <div className="text-center">
                  <p
                    className="font-webinar-heading font-normal text-webinar-ink"
                    style={{ fontSize: "clamp(1.1rem, 1.5vw, 1.35rem)", letterSpacing: "-0.01em" }}
                  >
                    {speaker.name}
                  </p>
                  <p className="text-webinar-ink-faint text-sm mt-1 tracking-wide">
                    {speaker.title}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Register CTA */}
        <ScrollReveal delay={500}>
          <div className="mt-12 flex flex-col items-center gap-4">
            <h3
              className="font-webinar-heading font-normal text-webinar-ink"
              style={{ fontSize: "clamp(1.6rem, 2.5vw, 2.4rem)", lineHeight: 1.1, letterSpacing: "-0.02em" }}
            >
              The Hidden Signals Already Exist Inside Your Organisation
            </h3>
            <p className="text-webinar-ink-dim text-base max-w-md mx-auto mt-2 mb-8 leading-[1.7]">
              The question is whether you can see them before they become business problems.
            </p>
            <a
              href="#register"
              className="webinar-cta-btn px-10 py-5 rounded-full font-semibold text-white text-base tracking-wide hover:-translate-y-0.5 [box-shadow:0_0_36px_rgba(22,133,91,0.35)] hover:[box-shadow:0_0_56px_rgba(22,133,91,0.55)]"
            >
              Register For the Webinar
            </a>
            <p className="text-sm text-webinar-ink-faint tracking-wide mt-2">
              Limited places available.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
