"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.play().catch(() => {});
    const t = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "#000",
      }}
    >
      <style>{`
        @media (max-width: 768px) {
          .hero-video { object-position: 75% center !important; }
          .hero-glass-aura { display: none !important; }
        }
      `}</style>
      {/* Fullscreen looping video */}
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        className="hero-video"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center center",
        }}
      >
        <source src="/test.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.18)",
          zIndex: 1,
        }}
      />

      {/* Left-aligned text content */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "clamp(24px, 6vw, 96px)",
          paddingTop: "clamp(80px, 10vh, 120px)",
        }}
      >
        {/* Soft glass aura — radial fade, no hard edges */}
        <div
          className="hero-glass-aura"
          style={{
            position: "absolute",
            top: "50%",
            left: 0,
            transform: "translateY(-50%)",
            width: "min(820px, 88vw)",
            height: "min(740px, 90vh)",
            background:
              "radial-gradient(ellipse at 28% 50%, rgba(255,255,255,0.38) 0%, rgba(255,255,255,0.18) 48%, transparent 72%)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
            WebkitMaskImage:
              "radial-gradient(ellipse at 28% 50%, black 0%, black 44%, transparent 70%)",
            maskImage:
              "radial-gradient(ellipse at 28% 50%, black 0%, black 44%, transparent 70%)",
            pointerEvents: "none",
            zIndex: -1,
          }}
        />

        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 28 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: "var(--font-serif)",
            fontWeight: 400,
            fontSize: "clamp(40px, 6vw, 80px)",
            lineHeight: 1.08,
            letterSpacing: "-0.02em",
            color: "#ffffff",
            maxWidth: "560px",
            marginBottom: "32px",
          }}
        >
          See workforce problems before they become{" "}
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
          .
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 28 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "clamp(15px, 1.4vw, 18px)",
            lineHeight: 1.6,
            color: "rgba(255,255,255,0.75)",
            maxWidth: "400px",
            marginBottom: "40px",
          }}
        >
          The early warning system for your workforce — connecting your everyday
          tools to stop burnout, attrition, and risk before they escalate.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 20 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}
        >
          <motion.a
            href="/book-demo"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 420, damping: 22 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "14px 32px",
              borderRadius: "999px",
              background: "rgba(255,255,255,0.92)",
              color: "#111",
              fontFamily: "var(--font-sans)",
              fontSize: "14px",
              fontWeight: 500,
              textDecoration: "none",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
            }}
          >
            Book a Demo
          </motion.a>

          <motion.a
            href="#how-it-works"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 420, damping: 22 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "14px 32px",
              borderRadius: "999px",
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.45)",
              color: "#fff",
              fontFamily: "var(--font-sans)",
              fontSize: "14px",
              fontWeight: 400,
              textDecoration: "none",
            }}
          >
            See how it works →
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
