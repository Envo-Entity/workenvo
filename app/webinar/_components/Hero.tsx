import { SignalRings } from "./SignalRings";

export function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-svh flex flex-col items-center justify-center text-center px-6 overflow-hidden"
    >
      {/* Radial background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 65% 55% at 50% 50%, rgba(22,133,91,0.08), transparent 70%)",
        }}
      />

      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        aria-hidden="true"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(22,133,91,0.08) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      {/* Animated signal rings */}
      <SignalRings size={720} rings={4} intervalSeconds={4} />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
        {/* Main headline */}
        <h1
          className="font-webinar-heading font-normal text-webinar-ink mb-7"
          style={{ fontSize: "clamp(40px, 5vw, 72px)", lineHeight: 1.05, letterSpacing: "-0.02em" }}
        >
          The Hidden Workforce Problems
          <br />
          AI Is Finally{" "}
          <span className="text-webinar-accent">Exposing</span>
        </h1>

        {/* Subheadline */}
        <p
          className="text-webinar-ink-dim leading-[1.75] max-w-2xl mb-3"
          style={{ fontSize: "clamp(1.05rem, 1.2vw + 0.5rem, 1.25rem)" }}
        >
          Discover the invisible employee signals impacting performance,
          engagement, burnout, retention, and culture &mdash; and how AI is
          helping organisations detect problems before they escalate.
        </p>

        <p
          className="text-webinar-ink-faint leading-[1.8] max-w-xl mb-12"
          style={{ fontSize: "clamp(0.9rem, 0.8vw + 0.4rem, 1rem)" }}
        >
          Most organisations only react when performance drops. But the warning
          signs appear long before the damage becomes visible.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <a
            href="#register"
            className="webinar-cta-btn px-8 py-4 rounded-full font-semibold text-white text-sm tracking-wide [box-shadow:0_0_24px_rgba(22,133,91,0.35)] hover:[box-shadow:0_0_40px_rgba(22,133,91,0.55)] hover:-translate-y-0.5"
          >
            Reserve My Spot
          </a>
          <a
            href="#learn"
            className="px-8 py-4 rounded-full font-semibold text-sm text-webinar-ink-dim border border-webinar-wire hover:border-webinar-accent/40 hover:text-webinar-ink transition-all duration-200"
          >
            Learn More
          </a>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-webinar-scroll-cue">
        <span className="text-[10px] tracking-[0.2em] uppercase text-webinar-ink-faint">
          Scroll
        </span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M8 3v10M4 9l4 4 4-4"
            stroke="#6B7280"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </section>
  );
}
