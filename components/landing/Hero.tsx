"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

// Discrete deceleration steps: [playbackRate, ms after decel starts]
// Browsers render stable rates smoothly — rapid continuous changes cause stutter.
const DECEL_STEPS: [rate: number, offset: number][] = [[0.3, 0]];
const PAUSE_OFFSET = 100;
const NORMAL_PLAY_MS = 3000;

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showContent, setShowContent] = useState(false);

  // Spring mouse-tracking parallax
  const rawX = useMotionValue(0.5);
  const rawY = useMotionValue(0.5);
  const rotateY = useSpring(useTransform(rawX, [0, 1], [-4, 4]), {
    stiffness: 60,
    damping: 18,
  });
  const rotateX = useSpring(useTransform(rawY, [0, 1], [3, -3]), {
    stiffness: 60,
    damping: 18,
  });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const r = e.currentTarget.getBoundingClientRect();
      rawX.set((e.clientX - r.left) / r.width);
      rawY.set((e.clientY - r.top) / r.height);
    },
    [rawX, rawY],
  );

  const handleMouseLeave = useCallback(() => {
    rawX.set(0.5);
    rawY.set(0.5);
  }, [rawX, rawY]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const timers: ReturnType<typeof setTimeout>[] = [];

    // Text is in the DOM immediately for crawlers; fade it in after a short delay
    timers.push(setTimeout(() => setShowContent(true), 500));

    video.playbackRate = 1;
    video.play().catch(() => {});

    // After normal play, step down rate at stable intervals then pause
    DECEL_STEPS.forEach(([rate, offset]) => {
      timers.push(
        setTimeout(() => {
          video.playbackRate = rate;
        }, NORMAL_PLAY_MS + offset),
      );
    });
    timers.push(
      setTimeout(() => {
        video.pause();
      }, NORMAL_PLAY_MS + PAUSE_OFFSET),
    );

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <section
      className="relative w-full overflow-hidden flex flex-col justify-center pb-[25vh] sm:pb-[18vh] lg:pb-[15vh] xl:pb-[20vh]"
      style={{
        minHeight: "100vh",
        backgroundColor: "#ffffff",
        perspective: "1200px",
        paddingTop: "clamp(94px, 7vh, 80px)",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
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

      {/* Text Content */}
      <motion.div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: "1200px",
          margin: "0 auto",
          width: "100%",
          paddingLeft: "24px",
          paddingRight: "24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Headline */}
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontWeight: 400,
            fontSize: "clamp(48px, 7.5vw, 96px)",
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            color: "#111111",
            marginBottom: "24px",
            opacity: showContent ? 1 : 0,
            transform: showContent ? "translateY(0px)" : "translateY(24px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
          }}
        >
          See workforce problems{" "}
          <em className="not-italic" style={{ color: "rgba(17,17,17,0.38)" }}>
            before they become{" "}
          </em>
          <span
            style={{
              textDecoration: "underline",
              textDecorationStyle: "wavy",
              textDecorationColor: "#16855B",
              textDecorationThickness: "3px",
              textUnderlineOffset: "8px",
            }}
          >
            HR problems
          </span>
        </h1>

        {/* Subheadline */}
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "clamp(16px, 1.8vw, 20px)",
            lineHeight: 1.65,
            color: "rgba(17,17,17,0.55)",
            maxWidth: "520px",
            marginBottom: "36px",
            opacity: showContent ? 1 : 0,
            transform: showContent ? "translateY(0px)" : "translateY(24px)",
            transition: "opacity 0.5s ease 0.08s, transform 0.5s ease 0.08s",
          }}
        >
          Workenvo is the early warning system for your workforce. One dashboard
          that connects to your everyday tools to stop burnout, attrition, and
          workplace risk before they happen.
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
            transition: "opacity 0.5s ease 0.18s, transform 0.5s ease 0.18s",
          }}
        >
          <motion.a
            href="/book-demo"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 420, damping: 22 }}
            className="inline-flex items-center gap-2 rounded-2xl text-sm font-semibold text-white"
            style={{
              background: "#16855B",
              boxShadow: "0 4px 24px rgba(22,133,91,0.35)",
              fontFamily: "var(--font-sans)",
              padding: "14px 32px",
              textDecoration: "none",
              transition:
                "background 160ms cubic-bezier(0.16,1,0.3,1), box-shadow 160ms cubic-bezier(0.16,1,0.3,1)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#0F6E50";
              e.currentTarget.style.boxShadow =
                "0 6px 32px rgba(22,133,91,0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#16855B";
              e.currentTarget.style.boxShadow =
                "0 4px 24px rgba(22,133,91,0.35)";
            }}
          >
            Book a Demo
          </motion.a>

          <motion.a
            href="#how-it-works"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 420, damping: 22 }}
            className="inline-flex items-center gap-2 rounded-2xl text-sm font-medium group"
            style={{
              fontFamily: "var(--font-sans)",
              padding: "14px 32px",
              color: "#111111",
              background: "rgba(255,255,255,0.55)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              border: "1px solid rgba(255,255,255,0.7)",
              boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
              textDecoration: "none",
              transition: "background 160ms cubic-bezier(0.16,1,0.3,1)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.72)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.55)")
            }
          >
            See how it works
            <motion.span
              animate={{ x: 0 }}
              whileHover={{ x: 3 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              →
            </motion.span>
          </motion.a>
        </div>
      </motion.div>
    </section>
  );
}
