import BrandLogo from "@/components/BrandLogo";
import { SignalRings } from "./SignalRings";
import { ScrollReveal } from "./ScrollReveal";

export function RegisterCTA() {
  return (
    <section
      id="register"
      className="relative py-36 md:py-48 px-6 overflow-hidden"
    >
      {/* Intense center glow — the signal converges */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(22,133,91,0.08), transparent 65%)",
        }}
      />

      {/* Signal rings — smaller, more concentrated */}
      <SignalRings size={560} rings={3} intervalSeconds={3} />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <ScrollReveal>
          <BrandLogo
            className="inline-flex justify-center mb-8 rounded-full border border-webinar-wire/45 bg-webinar-surface/45 px-5 py-3"
            logoHeightClassName="h-9"
            imageClassName="drop-shadow-[0_0_18px_rgba(22,133,91,0.2)]"
            textClassName="!text-webinar-ink text-2xl"
          />
        </ScrollReveal>

        <ScrollReveal delay={60}>
          <span className="webinar-chapter-label block mb-8">07 &mdash; Register</span>
        </ScrollReveal>

        <ScrollReveal delay={120}>
          <h2
            className="font-webinar-heading font-normal text-webinar-ink mb-6"
            style={{ fontSize: "clamp(2.2rem, 4vw + 0.5rem, 4rem)", lineHeight: 1.05, letterSpacing: "-0.02em" }}
          >
            The Hidden Signals Already Exist
            <br />
            Inside Your Organisation
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={220}>
          <p
            className="text-webinar-ink-dim leading-[1.75] max-w-xl mx-auto mb-14"
            style={{ fontSize: "clamp(1rem, 0.8vw + 0.5rem, 1.2rem)" }}
          >
            The question is whether you can see them before they become business
            problems.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={300}>
          <a
            href="#"
            className="webinar-cta-btn inline-block px-10 py-5 rounded-full font-webinar-heading font-bold text-white text-lg tracking-wide hover:-translate-y-1 [box-shadow:0_0_36px_rgba(22,133,91,0.4)] hover:[box-shadow:0_0_56px_rgba(22,133,91,0.6)]"
          >
            Register For the Webinar
          </a>
        </ScrollReveal>

        <ScrollReveal delay={380}>
          <p className="mt-6 text-sm text-webinar-ink-faint tracking-wide">
            Limited places available.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
