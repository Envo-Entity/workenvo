"use client";

import { useEffect, useRef } from "react";

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.6;
    }
  }, []);

  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      {/* Video */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source
          src="https://nqspbtenbeyfvpyqwigb.supabase.co/storage/v1/object/public/envo-public-assets/testvid.mp4"
          type="video/mp4"
        />
      </video>

      {/* Overlay */}
      <div className="animate-overlay-in absolute inset-0 z-[1] pointer-events-none bg-gradient-to-b from-black/50 via-black/25 to-black/55" />

      <div className="relative z-10 flex items-center justify-center min-h-screen px-6">
        <div className="animate-hero-in liquid-glass rounded-[2.5rem] px-10 py-14 md:px-16 md:py-20 flex flex-col items-center text-center max-w-3xl w-full mx-auto">
          {/* Headline */}
          <h1
            className="text-7xl sm:text-8xl md:text-[100px] leading-[1.05] tracking-tight text-white mb-6"
            style={{ fontFamily: "var(--font-serif)", fontWeight: 400 }}
          >
            Turn{" "}
            <span
              style={{
                textDecoration: "underline",
                textDecorationStyle: "wavy",
                textDecorationColor: "#22c55e",
                textDecorationThickness: "3px",
                textUnderlineOffset: "8px",
              }}
            >
              behaviour
            </span>{" "}
            into{" "}
            <em
              className="not-italic"
              style={{ color: "rgba(255,255,255,0.55)" }}
            >
              capability
            </em>
          </h1>

          {/* One-liner */}
          <p
            className="text-lg sm:text-2xl leading-relaxed max-w-sm mb-10"
            style={{
              color: "rgba(255,255,255,0.6)",
              fontFamily: "var(--font-sans)",
            }}
          >
            Understand what&apos;s really happening. Then shape what comes next.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="#"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.03]"
              style={{
                background: "#16855B",
                boxShadow: "0 4px 24px rgba(22, 133, 91, 0.5)",
                fontFamily: "var(--font-sans)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#0F6E50")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "#16855B")
              }
            >
              Book a demo
            </a>

            <a
              href="#"
              className="liquid-glass-btn inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-medium text-white group"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              See how it works
              <span className="transition-transform duration-200 group-hover:translate-x-1">
                →
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
