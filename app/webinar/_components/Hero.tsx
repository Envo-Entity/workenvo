"use client";

import { useEffect, useRef, useState } from "react";
import { InsightCards } from "./InsightCards";
import { RegisterTrigger } from "./RegisterTrigger";

const DECEL_STEPS: [rate: number, offset: number][] = [
  [0.3, 0],
];
const PAUSE_OFFSET = 100;
const NORMAL_PLAY_MS = 3000;

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const timers: ReturnType<typeof setTimeout>[] = [];

    timers.push(setTimeout(() => setShowContent(true), 1000));

    video.playbackRate = 1;
    video.play().catch(() => setShowContent(true));

    DECEL_STEPS.forEach(([rate, offset]) => {
      timers.push(
        setTimeout(() => { video.playbackRate = rate; }, NORMAL_PLAY_MS + offset)
      );
    });
    timers.push(
      setTimeout(() => { video.pause(); }, NORMAL_PLAY_MS + PAUSE_OFFSET)
    );

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <section
      id="hero"
      className="relative overflow-hidden"
      style={{ minHeight: "100svh", backgroundColor: "#ffffff" }}
    >
      {/* Video — bottom anchored, same as landing hero */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "70%",
          overflow: "hidden",
        }}
      >
        <video
          ref={videoRef}
          muted
          playsInline
          style={{
            width: "100%",
            height: "140%",
            objectFit: "cover",
            objectPosition: "50% 10%",
            display: "block",
          }}
        >
          <source
            src="https://nqspbtenbeyfvpyqwigb.supabase.co/storage/v1/object/public/envo-public-assets/testvid.mp4"
            type="video/mp4"
          />
        </video>
      </div>

      {/* White gradient fade */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 1,
          background: `linear-gradient(
            to bottom,
            rgba(255,255,255,1)   0%,
            rgba(255,255,255,1)   30%,
            rgba(255,255,255,0.97) 38%,
            rgba(255,255,255,0.92) 45%,
            rgba(255,255,255,0.82) 52%,
            rgba(255,255,255,0.65) 60%,
            rgba(255,255,255,0.42) 68%,
            rgba(255,255,255,0.18) 76%,
            rgba(255,255,255,0.05) 84%,
            rgba(255,255,255,0.0)  90%
          )`,
        }}
      />

      {/* Radial background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          zIndex: 1,
          background:
            "radial-gradient(ellipse 65% 55% at 50% 50%, rgba(22,133,91,0.08), transparent 70%)",
        }}
      />

      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        aria-hidden="true"
        style={{
          zIndex: 1,
          backgroundImage:
            "radial-gradient(circle, rgba(22,133,91,0.08) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      {/* Floating insight cards — xl screens only */}
      <InsightCards />

      {/* Content */}
      <div
        className="relative flex flex-col items-center justify-center text-center px-6"
        style={{ minHeight: "100svh", zIndex: 2 }}
      >
        <div className="max-w-5xl mx-auto flex flex-col items-center">
          {/* Main headline */}
          <h1
            className="font-webinar-heading font-normal text-webinar-ink mb-7"
            style={{
              fontSize: "clamp(40px, 5vw, 72px)",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              opacity: showContent ? 1 : 0,
              transform: showContent ? "translateY(0px)" : "translateY(24px)",
              transition: "opacity 0.9s ease, transform 0.9s ease",
            }}
          >
            The Hidden Workforce Problems
            <br />
            AI Is Finally{" "}
            <span className="text-webinar-accent">Exposing</span>
          </h1>

          {/* Subheadline */}
          <p
            className="text-webinar-ink-dim leading-[1.75] max-w-2xl mb-3"
            style={{
              fontSize: "clamp(1.05rem, 1.2vw + 0.5rem, 1.25rem)",
              opacity: showContent ? 1 : 0,
              transform: showContent ? "translateY(0px)" : "translateY(24px)",
              transition: "opacity 0.9s ease 0.12s, transform 0.9s ease 0.12s",
            }}
          >
            Discover the invisible employee signals impacting performance,
            engagement, burnout, retention, and culture &mdash; and how AI is
            helping organisations detect problems before they escalate.
          </p>

          <p
            className="text-webinar-ink-faint leading-[1.8] max-w-xl mb-12"
            style={{
              fontSize: "clamp(0.9rem, 0.8vw + 0.4rem, 1rem)",
              opacity: showContent ? 1 : 0,
              transform: showContent ? "translateY(0px)" : "translateY(24px)",
              transition: "opacity 0.9s ease 0.2s, transform 0.9s ease 0.2s",
            }}
          >
            Most organisations only react when performance drops. But the warning
            signs appear long before the damage becomes visible.
          </p>

          {/* CTAs */}
          <div
            className="flex flex-col sm:flex-row gap-4 items-center"
            style={{
              opacity: showContent ? 1 : 0,
              transform: showContent ? "translateY(0px)" : "translateY(24px)",
              transition: "opacity 0.9s ease 0.3s, transform 0.9s ease 0.3s",
            }}
          >
            <RegisterTrigger className="webinar-cta-btn px-8 py-4 rounded-full font-semibold text-white text-sm tracking-wide [box-shadow:0_0_24px_rgba(22,133,91,0.35)] hover:[box-shadow:0_0_40px_rgba(22,133,91,0.55)] hover:-translate-y-0.5 cursor-pointer">
              Reserve My Spot
            </RegisterTrigger>
            <a
              href="#learn"
              className="px-8 py-4 rounded-full font-semibold text-sm text-webinar-ink-dim border border-webinar-wire hover:border-webinar-accent/40 hover:text-webinar-ink transition-all duration-200"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-webinar-scroll-cue"
        style={{ zIndex: 2 }}
      >
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
