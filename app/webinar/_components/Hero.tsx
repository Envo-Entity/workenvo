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
            "radial-gradient(ellipse 65% 55% at 50% 50%, oklch(0.56 0.22 264 / 0.13), transparent 70%)",
        }}
      />

      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        aria-hidden="true"
        style={{
          backgroundImage:
            "radial-gradient(circle, oklch(0.97 0.007 264 / 0.06) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      {/* Animated signal rings */}
      <SignalRings size={720} rings={4} intervalSeconds={4} />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
        {/* Live badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-webinar-accent/30 bg-webinar-accent/8 text-[13px] text-webinar-ink-dim font-medium mb-12">
          <span className="size-2 rounded-full bg-webinar-teal animate-webinar-live-dot flex-shrink-0" />
          Live Webinar &mdash; Register to Secure Your Spot
        </div>

        {/* Main headline */}
        <h1
          className="font-webinar-heading font-bold tracking-tight text-webinar-ink leading-[1.04] mb-7"
          style={{ fontSize: "clamp(2.6rem, 5.5vw + 0.5rem, 5.25rem)" }}
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
            className="px-8 py-4 rounded-full font-semibold text-webinar-ink text-sm tracking-wide transition-all duration-200 [box-shadow:0_0_24px_oklch(0.56_0.22_264_/_0.4)] hover:[box-shadow:0_0_36px_oklch(0.56_0.22_264_/_0.6)] hover:-translate-y-0.5"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.56 0.22 264), oklch(0.52 0.22 295))",
            }}
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
            stroke="oklch(0.42 0.012 264)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </section>
  );
}
