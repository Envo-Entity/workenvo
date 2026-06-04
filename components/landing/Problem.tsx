"use client";

import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "motion/react";

const CARDS = [
  {
    number: "01",
    statusLabel: "CRITICAL",
    title: "The resignation you never saw coming",
    description:
      "High performers don't quit overnight. The signals were there for months — ignored, missed, or buried under busier priorities.",
    stat: "68% of resignations are only flagged at the exit interview",
    bg: "#B91C1C",
    image: {
      filename: "card-grievance.webp",
      alt: "An unattended resignation letter on a dark office desk.",
    },
  },
  {
    number: "02",
    statusLabel: "HIGH RISK",
    title: "The manager nobody warned you about",
    description:
      "One corrosive manager can hollow out a whole team over months. By the time the second resignation lands on your desk, the damage is already done.",
    stat: "Manager quality is the #1 driver of voluntary attrition",
    bg: "#92400E",
    image: {
      filename: "card-manager.webp",
      alt: "A tense conference room with a standing manager and disengaged team members.",
    },
  },
  {
    number: "03",
    statusLabel: "SILENT RISK",
    title: "The grievance already in motion",
    description:
      "Conflict and toxic behaviour build in silence before they explode publicly. Most formal cases had detectable early sentiment shifts that were never acted on.",
    stat: "85% of employees won't raise an issue until it's already serious",
    bg: "#3730A3",
    image: {
      filename: "card-resignation.webp",
      alt: "Two coworkers at adjacent desks in a strained after-hours office moment.",
    },
  },
];

function CardImage({
  filename,
  alt,
  bg,
}: {
  filename: string;
  alt: string;
  bg: string;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: `color-mix(in srgb, ${bg} 25%, #111827 75%)`,
        border: `1px solid color-mix(in srgb, ${bg} 42%, rgba(255,255,255,0.18) 58%)`,
        borderRadius: "22px",
        position: "relative",
        overflow: "hidden",
        boxShadow:
          "0 28px 80px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.04) inset",
      }}
    >
      <Image
        src={`/images/${filename}`}
        alt={alt}
        fill
        sizes="(max-width: 767px) calc(100vw - 64px), (max-width: 1200px) 48vw, 560px"
        quality={88}
        style={{
          objectFit: "cover",
          transform: "scale(1.015)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(6,6,6,0.04) 0%, rgba(6,6,6,0.1) 48%, rgba(6,6,6,0.38) 100%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 18% 12%, color-mix(in srgb, ${bg} 24%, transparent 76%), transparent 38%)`,
          mixBlendMode: "screen",
          opacity: 0.75,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: "1px",
          borderRadius: "21px",
          boxShadow:
            "0 0 0 1px rgba(255,255,255,0.12) inset, 0 -80px 120px rgba(0,0,0,0.2) inset",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

export default function Problem() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [viewW, setViewW] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [activeCard, setActiveCard] = useState(0);

  useEffect(() => {
    const update = () => {
      setViewW(window.innerWidth);
      setIsMobile(window.innerWidth < 768);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const trackX = useTransform(
    scrollYProgress,
    [0, 1],
    [0, -(CARDS.length - 1) * (viewW || 1440)],
  );

  const scrollHintOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const idx = Math.round(v * (CARDS.length - 1));
    setActiveCard(Math.min(Math.max(idx, 0), CARDS.length - 1));
  });

  return (
    <section
      ref={sectionRef}
      style={{
        minHeight: isMobile ? "auto" : "400vh",
        background: "#111827",
        position: "relative",
      }}
    >
      {/* ── DESKTOP: sticky scroll-jacked horizontal carousel ── */}
      {!isMobile && (
        <div
          style={{
            position: "sticky",
            top: 0,
            height: "100vh",
            overflow: "hidden",
          }}
        >
          {/* Top-left section label */}
          <div
            style={{
              position: "absolute",
              top: "36px",
              left: "48px",
              zIndex: 10,
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <div
              style={{
                width: "5px",
                height: "5px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.25)",
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.22em",
                textTransform: "uppercase" as const,
                color: "rgba(255,255,255,0.3)",
              }}
            >
              The visibility gap
            </span>
          </div>

          {/* Bottom-left progress dots */}
          <div
            style={{
              position: "absolute",
              bottom: "36px",
              left: "48px",
              zIndex: 10,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            {CARDS.map((_, i) => (
              <div
                key={i}
                style={{
                  height: "4px",
                  borderRadius: "2px",
                  background:
                    i === activeCard ? "#fff" : "rgba(255,255,255,0.2)",
                  width: i === activeCard ? "28px" : "6px",
                  transition:
                    "width 350ms cubic-bezier(0.23,1,0.32,1), background 350ms ease",
                }}
              />
            ))}
            <span
              style={{
                marginLeft: "6px",
                fontFamily: "'Courier New', monospace",
                fontSize: "11px",
                color: "rgba(255,255,255,0.3)",
                fontWeight: 600,
                letterSpacing: "0.05em",
              }}
            >
              {String(activeCard + 1).padStart(2, "0")} /{" "}
              {String(CARDS.length).padStart(2, "0")}
            </span>
          </div>

          {/* Bottom-right scroll hint */}
          <motion.div
            style={{
              position: "absolute",
              bottom: "36px",
              right: "48px",
              zIndex: 10,
              display: "flex",
              alignItems: "center",
              gap: "8px",
              opacity: scrollHintOpacity,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "11px",
                color: "rgba(255,255,255,0.25)",
                fontWeight: 500,
              }}
            >
              scroll to explore
            </span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M7 2v10M7 12l-3-3M7 12l3-3"
                stroke="rgba(255,255,255,0.25)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>

          {/* Horizontal card track */}
          <motion.div
            style={{
              display: "flex",
              flexDirection: "row",
              width: `${CARDS.length * (viewW || 1440)}px`,
              height: "100vh",
              x: trackX,
              willChange: "transform",
            }}
          >
            {CARDS.map((card) => (
              <div
                key={card.number}
                style={{
                  width: `${viewW || 1440}px`,
                  height: "100vh",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "80px 64px",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    maxWidth: "1160px",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "56px",
                    alignItems: "center",
                  }}
                >
                  {/* Left: image */}
                  <div
                    style={{
                      height: "min(520px, calc(100vh - 220px))",
                      minHeight: "280px",
                      aspectRatio: "1 / 1",
                    }}
                  >
                    <CardImage
                      filename={card.image.filename}
                      alt={card.image.alt}
                      bg={card.bg}
                    />
                  </div>

                  {/* Right: content */}
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "36px",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "'Courier New', monospace",
                          fontSize: "12px",
                          fontWeight: 700,
                          letterSpacing: "0.08em",
                          color: "rgba(255,255,255,0.22)",
                        }}
                      >
                        {card.number}
                      </span>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "7px",
                          padding: "5px 13px",
                          borderRadius: "100px",
                          border: "1px solid rgba(255,255,255,0.15)",
                          background: "rgba(255,255,255,0.05)",
                        }}
                      >
                        <span
                          style={{
                            width: "5px",
                            height: "5px",
                            borderRadius: "50%",
                            background: "#fff",
                            boxShadow: "0 0 7px 2px rgba(255,255,255,0.35)",
                          }}
                        />
                        <span
                          style={{
                            fontFamily: "var(--font-sans)",
                            fontSize: "9px",
                            fontWeight: 800,
                            letterSpacing: "0.2em",
                            textTransform: "uppercase" as const,
                            color: "#fff",
                          }}
                        >
                          {card.statusLabel}
                        </span>
                      </div>
                    </div>

                    <h2
                      style={{
                        fontFamily: "var(--font-serif)",
                        fontSize: "clamp(36px, 3.2vw, 54px)",
                        lineHeight: 1.07,
                        fontWeight: 700,
                        color: "#FFFFFF",
                        marginBottom: "22px",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {card.title}
                    </h2>

                    <p
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "16px",
                        lineHeight: 1.65,
                        color: "rgba(255,255,255,0.5)",
                        fontWeight: 400,
                        marginBottom: "44px",
                        maxWidth: "420px",
                      }}
                    >
                      {card.description}
                    </p>

                    <div
                      style={{
                        paddingTop: "24px",
                        borderTop: "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      <p
                        style={{
                          fontFamily: "var(--font-sans)",
                          fontSize: "14px",
                          lineHeight: 1.55,
                          color: "rgba(255,255,255,0.35)",
                          fontStyle: "italic",
                          fontWeight: 400,
                        }}
                      >
                        {card.stat}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      )}

      {/* ── MOBILE: simple vertical stack ── */}
      {isMobile && (
        <div
          style={{
            padding: "56px 16px 72px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "32px",
            }}
          >
            <div
              style={{
                width: "4px",
                height: "4px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.25)",
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.22em",
                textTransform: "uppercase" as const,
                color: "rgba(255,255,255,0.3)",
              }}
            >
              The visibility gap
            </span>
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "48px" }}
          >
            {CARDS.map((card) => (
              <div
                key={card.number}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "24px",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    aspectRatio: "1 / 1",
                    maxHeight: "360px",
                  }}
                >
                  <CardImage
                    filename={card.image.filename}
                    alt={card.image.alt}
                    bg={card.bg}
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "22px",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Courier New', monospace",
                        fontSize: "12px",
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        color: "rgba(255,255,255,0.22)",
                      }}
                    >
                      {card.number}
                    </span>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "7px",
                        padding: "5px 13px",
                        borderRadius: "100px",
                        border: "1px solid rgba(255,255,255,0.15)",
                        background: "rgba(255,255,255,0.05)",
                      }}
                    >
                      <span
                        style={{
                          width: "5px",
                          height: "5px",
                          borderRadius: "50%",
                          background: "#fff",
                          boxShadow: "0 0 7px 2px rgba(255,255,255,0.35)",
                        }}
                      />
                      <span
                        style={{
                          fontFamily: "var(--font-sans)",
                          fontSize: "9px",
                          fontWeight: 800,
                          letterSpacing: "0.2em",
                          textTransform: "uppercase" as const,
                          color: "#fff",
                        }}
                      >
                        {card.statusLabel}
                      </span>
                    </div>
                  </div>

                  <h2
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "clamp(32px, 10vw, 42px)",
                      lineHeight: 1.08,
                      fontWeight: 700,
                      color: "#FFFFFF",
                      marginBottom: "16px",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {card.title}
                  </h2>

                  <p
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "14px",
                      lineHeight: 1.65,
                      color: "rgba(255,255,255,0.5)",
                      fontWeight: 400,
                      marginBottom: "28px",
                    }}
                  >
                    {card.description}
                  </p>

                  <div
                    style={{
                      borderTop: "1px solid rgba(255,255,255,0.08)",
                      paddingTop: "18px",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "14px",
                        lineHeight: 1.55,
                        color: "rgba(255,255,255,0.35)",
                        fontStyle: "italic",
                      }}
                    >
                      {card.stat}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
