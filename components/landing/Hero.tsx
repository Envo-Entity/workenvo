"use client";

import { useEffect, useRef, useState } from "react";

// Discrete deceleration steps: [playbackRate, ms after decel starts]
// Browsers render stable rates smoothly — rapid continuous changes cause stutter.
const DECEL_STEPS: [rate: number, offset: number][] = [
  [0.3, 0],
];
const PAUSE_OFFSET = 100;
const NORMAL_PLAY_MS = 3000;

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const timers: ReturnType<typeof setTimeout>[] = [];

    timers.push(setTimeout(() => setShowContent(true), 1000));

    video.playbackRate = 1;
    video.play().catch(() => setShowContent(true));

    // After normal play, step down rate at stable intervals then pause
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
      className="relative w-full overflow-hidden"
      style={{ minHeight: "100vh", backgroundColor: "#ffffff" }}
    >
      {/* Video Container — bottom anchored, shifted down so more top is hidden */}
      {/* Container raised 10% (height 70% from bottom), top 10% of video cropped */}
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
            // 50% 10% shifts the framing down → crops top 10%, reveals more bottom
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

      {/* White Gradient Fade — extra-long transition for soft top edge */}
      <div
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

      {/* Text Content — pushed lower for breathing room */}
      <div
        className="pt-[35%] lg:pt-[20%] xl:pt-[13%]"
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: "1200px",
          margin: "0 auto",
          paddingLeft: "24px",
          paddingRight: "24px",
          paddingBottom: "60px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        {/* Headline */}
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontWeight: 400,
            fontSize: "clamp(52px, 8vw, 100px)",
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            color: "#111111",
            marginBottom: "24px",
            opacity: showContent ? 1 : 0,
            transform: showContent ? "translateY(0px)" : "translateY(24px)",
            transition: "opacity 0.9s ease, transform 0.9s ease",
          }}
        >
          Turn{" "}
          <span
            style={{
              textDecoration: "underline",
              textDecorationStyle: "wavy",
              textDecorationColor: "#16855B",
              textDecorationThickness: "3px",
              textUnderlineOffset: "8px",
            }}
          >
            behaviour
          </span>{" "}
          into{" "}
          <em className="not-italic" style={{ color: "rgba(17,17,17,0.38)" }}>
            capability
          </em>
        </h1>

        {/* Subheadline */}
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "clamp(16px, 2vw, 22px)",
            lineHeight: 1.6,
            color: "rgba(17,17,17,0.52)",
            maxWidth: "480px",
            marginBottom: "40px",
            opacity: showContent ? 1 : 0,
            transform: showContent ? "translateY(0px)" : "translateY(24px)",
            transition: "opacity 0.9s ease 0.12s, transform 0.9s ease 0.12s",
          }}
        >
          See how your organisation is really operating today and build the capability you&apos;ll need tomorrow.
        </p>

        {/* CTA Buttons */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            opacity: showContent ? 1 : 0,
            transform: showContent ? "translateY(0px)" : "translateY(24px)",
            transition: "opacity 0.9s ease 0.24s, transform 0.9s ease 0.24s",
          }}
        >
          <a
            href="#"
            className="inline-flex items-center gap-2 rounded-2xl text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.03]"
            style={{
              background: "#16855B",
              boxShadow: "0 4px 24px rgba(22, 133, 91, 0.35)",
              fontFamily: "var(--font-sans)",
              padding: "14px 32px",
              textDecoration: "none",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#0F6E50")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#16855B")}
          >
            Book a demo
          </a>

          <a
            href="#"
            className="inline-flex items-center gap-2 rounded-2xl text-sm font-medium group transition-all duration-200 hover:scale-[1.02]"
            style={{
              fontFamily: "var(--font-sans)",
              padding: "14px 32px",
              color: "#111111",
              background: "rgba(17,17,17,0.06)",
              border: "1px solid rgba(17,17,17,0.1)",
              textDecoration: "none",
            }}
          >
            See how it works
            <span className="transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
