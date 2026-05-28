import BrandLogo from "@/components/BrandLogo";
import { ScrollReveal } from "./ScrollReveal";

export function Speaker() {
  return (
    <section
      id="speaker"
      className="relative py-32 md:py-40 px-6 bg-webinar-surface overflow-hidden"
    >
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <ScrollReveal>
          <span className="webinar-chapter-label block mb-6">06 &mdash; Your Guide</span>
        </ScrollReveal>

        <ScrollReveal delay={80}>
          <p className="text-webinar-ink-faint text-sm tracking-wide mb-10">Hosted by</p>
        </ScrollReveal>

        {/* Logo / brand name */}
        <ScrollReveal delay={140}>
          <BrandLogo
            className="inline-flex justify-center rounded-full border border-webinar-wire/50 bg-webinar-page/55 px-7 py-4 mb-12 shadow-[0_0_60px_oklch(0.56_0.22_264_/_0.16)]"
            logoHeightClassName="h-12 md:h-16"
            imageClassName="drop-shadow-[0_0_28px_oklch(0.56_0.22_264_/_0.32)]"
            textClassName="!text-webinar-ink text-[clamp(2rem,4vw,3.5rem)] tracking-tight"
          />
        </ScrollReveal>

        <ScrollReveal delay={220}>
          <p
            className="text-webinar-ink-dim leading-[1.85] max-w-2xl mx-auto"
            style={{ fontSize: "clamp(1rem, 0.8vw + 0.5rem, 1.125rem)" }}
          >
            Workenvo helps organisations uncover hidden workforce signals
            impacting culture, engagement, wellbeing, and performance. Using
            AI-driven workforce intelligence, organisations can move from reactive
            people management to proactive organisational performance improvement.
          </p>
        </ScrollReveal>

        {/* Optional links */}
        <ScrollReveal delay={300}>
          <div className="flex items-center justify-center gap-6 mt-10">
            <a
              href="#"
              className="text-sm font-medium text-webinar-ink-faint hover:text-webinar-accent transition-colors duration-200 flex items-center gap-2"
              aria-label="Workenvo LinkedIn"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z" />
              </svg>
              LinkedIn
            </a>
            <span className="text-webinar-wire">·</span>
            <a
              href="mailto:info@workenvo.com"
              className="text-sm font-medium text-webinar-ink-faint hover:text-webinar-accent transition-colors duration-200"
            >
              Contact
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
