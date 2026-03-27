"use client";

import BrandLogo from "@/components/BrandLogo";
import { useRef, useEffect, useState } from "react";
import { motion } from "motion/react";

// ─── Design canvas ────────────────────────────────────────────────────────────
const DW = 1600;
const DH = 900;

// ─── Color tokens ─────────────────────────────────────────────────────────────
const C = {
  primary: "#006841",
  primaryContainer: "#008454",
  secondaryFixed: "#8ff8b4",
  primaryFixedDim: "#72dba3",
  surface: "#fcf9f8",
  surfaceLow: "#f6f3f2",
  surfaceContainer: "#f0edec",
  surfaceHigh: "#ebe7e7",
  surfaceHighest: "#e5e2e1",
  white: "#ffffff",
  onSurface: "#1c1b1b",
  onSurfaceVariant: "#3e4941",
  secondary: "#006d3e",
  error: "#ba1a1a",
  errorContainer: "#ffdad6",
  onErrorContainer: "#93000a",
};

const ambientShadow = "0 10px 48px -4px rgba(0,104,65,0.04)";

// ─── SVG Icon paths ────────────────────────────────────────────────────────────
const ICONS: Record<string, string> = {
  dashboard: "M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z",
  emojiEvents:
    "M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z",
  analytics:
    "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z",
  redeem:
    "M20 6h-2.18c.07-.44.18-.88.18-1.35C18 2.51 15.49 0 12.35 0c-1.7 0-3.23.88-4.18 2.14L12 6H3l2 5h14l2-5zm-8 14c-1.1 0-2-.9-2-2h4c0 1.1-.9 2-2 2zm7-4H5v-2h14v2z",
  poll: "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z",
  groups:
    "M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z",
  eco: "M6.05 8.5c.44-4.56 3.91-6.85 10.45-7.48.47-.05.87.35.82.82-.63 6.54-2.92 10.01-7.48 10.45v3.71h3v2H7.16v-2h3v-3.71C7.6 12.64 5.61 11.25 6.05 8.5z",
  settings:
    "M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-1 14l-3-3 1.41-1.41L11 12.17l5.59-5.58L18 8l-7 7z",
  autoAwesome:
    "M19 9l1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25L19 9zm-7.5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12l-5.5-2.5zM19 15l-1.25 2.75L15 19l2.75 1.25L19 23l1.25-2.75L23 19l-2.75-1.25L19 15z",
  warning:
    "M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z",
  trendingDown:
    "M16 18l2.29-2.29-4.88-4.88-4 4L2 7.41 3.41 6l6 6 4-4 6.3 6.29L22 12v6z",
  editNote:
    "M3 10h11v2H3zm0-2h11V6H3zm0 8h7v-2H3zm15.01-3.13l.71-.71c.39-.39 1.02-.39 1.41 0l.71.71c.39.39.39 1.02 0 1.41l-.71.71-2.12-2.12zm-.71.71L12 19.88V22h2.12l5.3-5.3-2.12-2.12z",
  militaryTech:
    "M17 3H7c-1.1 0-2 .9-2 2v1l7 3 7-3V5c0-1.1-.9-2-2-2zM5 8.5V19c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V8.5l-7 3-7-3z",
  description:
    "M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z",
  fire: "M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z",
};

function Icon({
  name,
  size = 20,
  color = "currentColor",
}: {
  name: string;
  size?: number;
  color?: string;
}) {
  const d = ICONS[name];
  if (!d) return null;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      style={{ flexShrink: 0 }}
    >
      <path d={d} />
    </svg>
  );
}

// ─── Panel animation wrapper (bottom-to-up + fade) ───────────────────────────
function Panel({
  children,
  delay = 0,
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, delay, ease: "easeOut" }}
      style={style}
    >
      {children}
    </motion.div>
  );
}

// ─── Scramble text (random chars → real text on mount) ───────────────────────
const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

function ScrambleText({
  text,
  style,
}: {
  text: string;
  style?: React.CSSProperties;
}) {
  // Initialize with the real text so SSR and the first client render match.
  // The scramble animation kicks in after mount via the useEffect below.
  const [displayed, setDisplayed] = useState(text);

  useEffect(() => {
    let frame = 0;
    const totalFrames = 20;
    const id = setInterval(() => {
      frame++;
      if (frame >= totalFrames) {
        setDisplayed(text);
        clearInterval(id);
        return;
      }
      const revealCount = Math.floor((frame / totalFrames) * text.length);
      setDisplayed(
        text
          .split("")
          .map((c, i) => {
            if (i < revealCount) return c;
            if (c === " ") return " ";
            return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
          })
          .join("")
      );
    }, 32);
    return () => clearInterval(id);
  }, [text]);

  return <span style={style}>{displayed}</span>;
}

// ─── Progress bar ─────────────────────────────────────────────────────────────
function ProgressBar({
  label,
  value,
  sublabel,
  color,
}: {
  label: string;
  value: number;
  sublabel?: string;
  color: string;
}) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 6,
        }}
      >
        <span
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: C.onSurface,
            fontFamily: "Inter, sans-serif",
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontSize: 12,
            color: C.onSurfaceVariant,
            fontFamily: "Inter, sans-serif",
          }}
        >
          {sublabel ?? `${value}%`}
        </span>
      </div>
      <div
        style={{
          height: 8,
          background: C.surfaceContainer,
          borderRadius: 99,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${value}%`,
            background: color,
            borderRadius: 99,
          }}
        />
      </div>
    </div>
  );
}

// ─── Employees tab content ────────────────────────────────────────────────────
function EmployeesContent() {
  const barHeights = [50, 45, 70, 65, 80, 75, 85, 95, 80, 70];
  const barColors = [
    "rgba(0,104,65,0.10)",
    "rgba(0,104,65,0.15)",
    "rgba(0,104,65,0.20)",
    "rgba(0,104,65,0.28)",
    "rgba(0,104,65,0.36)",
    "rgba(0,104,65,0.44)",
    "rgba(0,104,65,0.52)",
    "#008454",
    "#008454",
    "rgba(0,104,65,0.44)",
  ];

  return (
    <>
      {/* Header */}
      <Panel
        delay={0.04}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "4px 14px",
              background: "rgba(0,104,65,0.10)",
              borderRadius: 99,
              marginBottom: 10,
            }}
          >
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: C.primary,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                fontFamily: "Inter, sans-serif",
              }}
            >
              My Dashboard
            </span>
          </div>
          <h1
            style={{
              fontSize: 34,
              fontWeight: 700,
              color: C.onSurface,
              letterSpacing: "-0.03em",
              lineHeight: 1,
              fontFamily: "Inter, sans-serif",
            }}
          >
            <ScrambleText text="My Growth" />
          </h1>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button
            style={{
              padding: "12px 24px",
              background: C.primaryContainer,
              color: C.white,
              border: "none",
              borderRadius: 99,
              fontSize: 14,
              fontWeight: 600,
              cursor: "default",
              fontFamily: "Inter, sans-serif",
            }}
          >
            Log Behaviour
          </button>
          <button
            style={{
              padding: "12px 24px",
              background: "transparent",
              color: C.primaryContainer,
              border: `1.5px solid ${C.primaryContainer}`,
              borderRadius: 99,
              fontSize: 14,
              fontWeight: 600,
              cursor: "default",
              fontFamily: "Inter, sans-serif",
            }}
          >
            View Rewards
          </button>
        </div>
      </Panel>

      {/* Bento grid */}
      <div
        style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: "repeat(12, 1fr)",
          gridTemplateRows: "1fr 1fr",
          gap: 20,
          minHeight: 0,
        }}
      >
        {/* Main card — col-span 8 — stays still */}
        <div
          style={{
            gridColumn: "span 8",
            background: C.white,
            borderRadius: 48,
            padding: "20px 28px",
            boxShadow: ambientShadow,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 10,
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: C.onSurface,
                  fontFamily: "Inter, sans-serif",
                  marginBottom: 4,
                }}
              >
                My Capability Score
              </h2>
              <p
                style={{
                  fontSize: 14,
                  color: C.onSurfaceVariant,
                  fontFamily: "Inter, sans-serif",
                }}
              >
                Based on your logged behaviours and feedback
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  fontSize: 42,
                  fontWeight: 700,
                  color: C.primary,
                  fontFamily: "Inter, sans-serif",
                  lineHeight: 1,
                }}
              >
                71.5
              </div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#059669",
                  fontFamily: "Inter, sans-serif",
                  marginTop: 4,
                }}
              >
                +8% this month
              </div>
            </div>
          </div>

          {/* Bar chart */}
          <div
            style={{
              height: 130,
              display: "flex",
              alignItems: "flex-end",
              gap: 8,
              borderRadius: 16,
              overflow: "hidden",
              flex: 1,
            }}
          >
            {barHeights.map((h, i) => (
              <motion.div
                key={i}
                initial={{ height: "0%" }}
                animate={{ height: `${h}%` }}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  flex: 1,
                  background: barColors[i],
                  borderRadius: "48px 48px 0 0",
                  alignSelf: "flex-end",
                }}
              />
            ))}
          </div>

          {/* Stats row */}
          <div
            style={{
              borderTop: `1px solid ${C.surfaceContainer}`,
              paddingTop: 14,
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
            }}
          >
            {[
              { label: "Collaboration", value: "Steady" },
              { label: "Communication", value: "Growing" },
              { label: "Initiative", value: "Strong" },
              { label: "Craft", value: "Expert" },
              { label: "Leadership", value: "Emerging" },
            ].map((s) => (
              <div key={s.label}>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: C.onSurfaceVariant,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    fontFamily: "Inter, sans-serif",
                    marginBottom: 4,
                  }}
                >
                  {s.label}
                </div>
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: C.onSurface,
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  {s.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Panel — col-span 4 */}
        <Panel
          delay={0.12}
          style={{
            gridColumn: "span 4",
            background: C.primaryContainer,
            borderRadius: 48,
            padding: 22,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            {/* Header row */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
                marginBottom: 20,
              }}
            >
              <Icon name="autoAwesome" size={22} color={C.white} />
              <h2
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: C.white,
                  fontFamily: "Inter, sans-serif",
                  lineHeight: 1.3,
                }}
              >
                What matters and what to do next
              </h2>
            </div>

            {/* Cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div
                style={{
                  background: "rgba(255,255,255,0.10)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  borderRadius: 16,
                  padding: 16,
                  backdropFilter: "blur(8px)",
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: C.secondaryFixed,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    fontFamily: "Inter, sans-serif",
                    marginBottom: 6,
                  }}
                >
                  Primary Insight
                </div>
                <p
                  style={{
                    fontSize: 13,
                    lineHeight: 1.6,
                    color: "rgba(255,255,255,0.88)",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  You&apos;ve been consistently strong in Craft but your
                  Collaboration score has dipped. Your peers notice when you
                  contribute to cross-team work.
                </p>
              </div>
              <div
                style={{
                  background: "rgba(255,255,255,0.10)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  borderRadius: 16,
                  padding: 16,
                  backdropFilter: "blur(8px)",
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: C.secondaryFixed,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    fontFamily: "Inter, sans-serif",
                    marginBottom: 6,
                  }}
                >
                  Recommendation
                </div>
                <p
                  style={{
                    fontSize: 13,
                    lineHeight: 1.6,
                    color: "rgba(255,255,255,0.88)",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  Join the design review for the Payments team this Thursday —
                  it&apos;s a quick win for visibility and collaboration.
                </p>
              </div>
            </div>
          </div>

          {/* Button */}
          <button
            style={{
              background: C.white,
              color: C.primary,
              border: "none",
              borderRadius: 16,
              padding: 14,
              fontSize: 14,
              fontWeight: 700,
              width: "100%",
              cursor: "default",
              fontFamily: "Inter, sans-serif",
              marginTop: 20,
            }}
          >
            Accept Nudge
          </button>
        </Panel>

        {/* Left panel — col-span 7 */}
        <Panel
          delay={0.16}
          style={{
            gridColumn: "span 7",
            background: C.surfaceLow,
            borderRadius: 48,
            padding: 22,
          }}
        >
          <h2
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: C.onSurface,
              fontFamily: "Inter, sans-serif",
              marginBottom: 16,
            }}
          >
            My Activity This Week
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Item 1 */}
            <div
              style={{
                background: C.white,
                borderRadius: 16,
                padding: "20px 24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    background: "rgba(0,104,65,0.10)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon name="editNote" size={20} color={C.primary} />
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: C.onSurface,
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    ✅ 3 behaviours logged
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: C.onSurfaceVariant,
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    Documented across Collaboration and Craft
                  </div>
                </div>
              </div>
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "#059669",
                  flexShrink: 0,
                }}
              />
            </div>

            {/* Item 2 */}
            <div
              style={{
                background: C.white,
                borderRadius: 16,
                padding: "20px 24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    background: "#fef3c7",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon name="militaryTech" size={20} color="#d97706" />
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: C.onSurface,
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    🏆 Leadership badge earned
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: C.onSurfaceVariant,
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    Recognized for facilitating the workshop
                  </div>
                </div>
              </div>
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "#d97706",
                  flexShrink: 0,
                }}
              />
            </div>

            {/* Item 3 */}
            <div
              style={{
                background: C.white,
                borderRadius: 16,
                padding: "20px 24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    background: "#dbeafe",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon name="description" size={20} color="#2563eb" />
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: C.onSurface,
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    📋 Feedback survey due
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: C.onSurfaceVariant,
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    Project: Mobile App Redesign
                  </div>
                </div>
              </div>
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "#2563eb",
                  flexShrink: 0,
                }}
              />
            </div>
          </div>
        </Panel>

        {/* Right panel — col-span 5 */}
        <Panel
          delay={0.20}
          style={{
            gridColumn: "span 5",
            background: C.white,
            borderRadius: 48,
            padding: 22,
            boxShadow: ambientShadow,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <h2
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: C.onSurface,
                  fontFamily: "Inter, sans-serif",
                }}
              >
                My Rewards
              </h2>
              <Icon name="redeem" size={20} color={C.onSurfaceVariant} />
            </div>

            <div style={{ marginBottom: 20 }}>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: C.onSurfaceVariant,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  fontFamily: "Inter, sans-serif",
                  marginBottom: 4,
                }}
              >
                Points Balance
              </div>
              <div
                style={{
                  fontSize: 40,
                  fontWeight: 700,
                  color: C.primary,
                  fontFamily: "Inter, sans-serif",
                  lineHeight: 1,
                }}
              >
                340 pts
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 20,
              }}
            >
              <Icon name="fire" size={16} color="#d97706" />
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: C.onSurface,
                  fontFamily: "Inter, sans-serif",
                }}
              >
                Streak — 4 weeks
              </span>
            </div>

            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 6,
                }}
              >
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: C.onSurface,
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  Next Reward: Team Lunch Voucher
                </span>
                <span
                  style={{
                    fontSize: 12,
                    color: C.onSurfaceVariant,
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  50 pts away
                </span>
              </div>
              <div
                style={{
                  height: 8,
                  background: C.surfaceContainer,
                  borderRadius: 99,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: "85%",
                    background: C.primary,
                    borderRadius: 99,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Bottom callout */}
          <div
            style={{
              background: `rgba(114,219,163,0.20)`,
              border: `1px solid rgba(114,219,163,0.30)`,
              borderRadius: 16,
              padding: 16,
            }}
          >
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: C.primary,
                fontFamily: "Inter, sans-serif",
              }}
            >
              Keep it up! You&apos;re in the top 10% of active users this quarter.
            </span>
          </div>
        </Panel>
      </div>
    </>
  );
}

// ─── Managers tab content ─────────────────────────────────────────────────────
function ManagersContent() {
  const barHeights = [55, 85, 45, 75, 65, 90, 80];
  const barColors = [
    "rgba(0,104,65,0.15)",
    "#008454",
    "rgba(0,104,65,0.15)",
    "rgba(0,104,65,0.40)",
    "rgba(0,104,65,0.28)",
    "#008454",
    "rgba(0,104,65,0.52)",
  ];
  const teamMembers = [
    { name: "James", pct: "62%" },
    { name: "Priya", pct: "94%" },
    { name: "Marcus", pct: "58%" },
    { name: "Lena", pct: "88%" },
    { name: "Tom", pct: "72%" },
    { name: "Aisha", pct: "96%" },
    { name: "Dev", pct: "84%" },
  ];

  return (
    <>
      {/* Header */}
      <Panel
        delay={0.04}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "4px 14px",
              background: "rgba(0,104,65,0.10)",
              borderRadius: 99,
              marginBottom: 10,
            }}
          >
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: C.primary,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                fontFamily: "Inter, sans-serif",
              }}
            >
              Team Insights
            </span>
          </div>
          <h1
            style={{
              fontSize: 34,
              fontWeight: 700,
              color: C.onSurface,
              letterSpacing: "-0.03em",
              lineHeight: 1,
              fontFamily: "Inter, sans-serif",
            }}
          >
            <ScrambleText text="Team Performance" />
          </h1>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button
            style={{
              padding: "12px 24px",
              background: C.surfaceHigh,
              color: C.onSurface,
              border: "none",
              borderRadius: 99,
              fontSize: 14,
              fontWeight: 600,
              cursor: "default",
              fontFamily: "Inter, sans-serif",
            }}
          >
            Download Report
          </button>
          <button
            style={{
              padding: "12px 24px",
              background: C.primaryContainer,
              color: C.white,
              border: "none",
              borderRadius: 99,
              fontSize: 14,
              fontWeight: 600,
              cursor: "default",
              fontFamily: "Inter, sans-serif",
            }}
          >
            Generate AI View
          </button>
        </div>
      </Panel>

      {/* Bento grid */}
      <div
        style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: "repeat(12, 1fr)",
          gridTemplateRows: "1fr 1fr",
          gap: 20,
          minHeight: 0,
        }}
      >
        {/* Main card — col-span 8 — stays still */}
        <div
          style={{
            gridColumn: "span 8",
            background: C.white,
            borderRadius: 48,
            padding: "20px 28px",
            boxShadow: ambientShadow,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 16,
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: C.onSurface,
                  fontFamily: "Inter, sans-serif",
                  marginBottom: 4,
                }}
              >
                Team Health Score
              </h2>
              <p
                style={{
                  fontSize: 14,
                  color: C.onSurfaceVariant,
                  fontFamily: "Inter, sans-serif",
                }}
              >
                Real-time pulse of your direct reports
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  fontSize: 42,
                  fontWeight: 700,
                  color: C.primary,
                  fontFamily: "Inter, sans-serif",
                  lineHeight: 1,
                }}
              >
                76.8
              </div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#f97316",
                  fontFamily: "Inter, sans-serif",
                  marginTop: 4,
                }}
              >
                -4% vs last month
              </div>
            </div>
          </div>

          {/* Bar chart */}
          <div
            style={{
              height: 130,
              display: "flex",
              alignItems: "flex-end",
              gap: 8,
              borderRadius: 16,
              overflow: "hidden",
              flex: 1,
            }}
          >
            {barHeights.map((h, i) => (
              <motion.div
                key={i}
                initial={{ height: "0%" }}
                animate={{ height: `${h}%` }}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  flex: 1,
                  background: barColors[i],
                  borderRadius: "48px 48px 0 0",
                  alignSelf: "flex-end",
                }}
              />
            ))}
          </div>

          {/* Stats row */}
          <div
            style={{
              borderTop: `1px solid ${C.surfaceContainer}`,
              paddingTop: 14,
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
            }}
          >
            {teamMembers.map((m) => (
              <div key={m.name}>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: C.onSurfaceVariant,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    fontFamily: "Inter, sans-serif",
                    marginBottom: 4,
                  }}
                >
                  {m.name}
                </div>
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: C.onSurface,
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  {m.pct}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Panel — col-span 4 */}
        <Panel
          delay={0.12}
          style={{
            gridColumn: "span 4",
            background: C.primaryContainer,
            borderRadius: 48,
            padding: 22,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
                marginBottom: 20,
              }}
            >
              <Icon name="autoAwesome" size={22} color={C.white} />
              <h2
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: C.white,
                  fontFamily: "Inter, sans-serif",
                  lineHeight: 1.3,
                }}
              >
                What matters and what to do next
              </h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div
                style={{
                  background: "rgba(255,255,255,0.10)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  borderRadius: 16,
                  padding: 16,
                  backdropFilter: "blur(8px)",
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: C.secondaryFixed,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    fontFamily: "Inter, sans-serif",
                    marginBottom: 6,
                  }}
                >
                  Primary Insight
                </div>
                <p
                  style={{
                    fontSize: 13,
                    lineHeight: 1.6,
                    color: "rgba(255,255,255,0.88)",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  Two team members showing signs of disengagement. Review
                  cadence has dropped 40% this quarter.
                </p>
              </div>
              <div
                style={{
                  background: "rgba(255,255,255,0.10)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  borderRadius: 16,
                  padding: 16,
                  backdropFilter: "blur(8px)",
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: C.secondaryFixed,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    fontFamily: "Inter, sans-serif",
                    marginBottom: 6,
                  }}
                >
                  Recommendation
                </div>
                <p
                  style={{
                    fontSize: 13,
                    lineHeight: 1.6,
                    color: "rgba(255,255,255,0.88)",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  Schedule 1:1s with James and Marcus this week. Focus on
                  growth goals and blockers.
                </p>
              </div>
            </div>
          </div>
          <button
            style={{
              background: C.white,
              color: C.primary,
              border: "none",
              borderRadius: 16,
              padding: 14,
              fontSize: 14,
              fontWeight: 700,
              width: "100%",
              cursor: "default",
              fontFamily: "Inter, sans-serif",
              marginTop: 20,
            }}
          >
            Take Action
          </button>
        </Panel>

        {/* Left panel — col-span 7 */}
        <Panel
          delay={0.16}
          style={{
            gridColumn: "span 7",
            background: C.surfaceLow,
            borderRadius: 48,
            padding: 22,
          }}
        >
          <h2
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: C.onSurface,
              fontFamily: "Inter, sans-serif",
              marginBottom: 16,
            }}
          >
            Real-time Behavioural Signals
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Item 1 */}
            <div
              style={{
                background: C.white,
                borderRadius: 16,
                padding: "20px 24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    background: "#fef3c7",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon name="warning" size={20} color="#d97706" />
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: C.onSurface,
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    Review Overdue: Marcus
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: C.onSurfaceVariant,
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    Last 1:1 was 6 weeks ago
                  </div>
                </div>
              </div>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  color: "#d97706",
                  background: "#fef3c7",
                  padding: "4px 12px",
                  borderRadius: 99,
                  fontFamily: "Inter, sans-serif",
                  whiteSpace: "nowrap",
                }}
              >
                FOLLOW UP
              </span>
            </div>

            {/* Item 2 */}
            <div
              style={{
                background: C.white,
                borderRadius: 16,
                padding: "20px 24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    background: "rgba(0,104,65,0.10)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon name="trendingDown" size={20} color={C.primary} />
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: C.onSurface,
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    Engagement Drops: James
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: C.onSurfaceVariant,
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    Meeting participation rates down 22%
                  </div>
                </div>
              </div>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  color: C.onSurfaceVariant,
                  background: C.surfaceHighest,
                  padding: "4px 12px",
                  borderRadius: 99,
                  fontFamily: "Inter, sans-serif",
                  whiteSpace: "nowrap",
                }}
              >
                MONITORING
              </span>
            </div>
          </div>
        </Panel>

        {/* Right panel — col-span 5 */}
        <Panel
          delay={0.20}
          style={{
            gridColumn: "span 5",
            background: C.white,
            borderRadius: 48,
            padding: 22,
            boxShadow: ambientShadow,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <h2
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: C.onSurface,
                  fontFamily: "Inter, sans-serif",
                }}
              >
                Team Behaviours
              </h2>
              <Icon name="eco" size={20} color={C.onSurfaceVariant} />
            </div>
            <ProgressBar
              label="Collaboration Score"
              value={82}
              color={C.primary}
            />
            <ProgressBar
              label="Feedback Given"
              value={65}
              sublabel="4 this week"
              color={C.primaryContainer}
            />
            <ProgressBar
              label="Recognition Sent"
              value={40}
              sublabel="2 this month"
              color={C.secondary}
            />
          </div>
          <div
            style={{
              background: `rgba(114,219,163,0.20)`,
              border: `1px solid rgba(114,219,163,0.30)`,
              borderRadius: 16,
              padding: 16,
            }}
          >
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: C.primary,
                fontFamily: "Inter, sans-serif",
              }}
            >
              Your team collaboration is 12% higher than the engineering
              department average.
            </span>
          </div>
        </Panel>
      </div>
    </>
  );
}

// ─── Leadership tab content ───────────────────────────────────────────────────
function LeadershipContent() {
  const barHeights = [40, 55, 45, 70, 65, 85, 95, 90, 75, 60];
  const barColors = [
    "rgba(0,104,65,0.10)",
    "rgba(0,104,65,0.18)",
    "rgba(0,104,65,0.15)",
    "rgba(0,104,65,0.30)",
    "rgba(0,104,65,0.28)",
    "rgba(0,104,65,0.52)",
    "#008454",
    "#008454",
    "rgba(0,104,65,0.44)",
    "rgba(0,104,65,0.28)",
  ];

  return (
    <>
      {/* Header */}
      <Panel
        delay={0.04}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "4px 14px",
              background: "rgba(0,104,65,0.10)",
              borderRadius: 99,
              marginBottom: 10,
            }}
          >
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: C.primary,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                fontFamily: "Inter, sans-serif",
              }}
            >
              Organisation-wide insights
            </span>
          </div>
          <h1
            style={{
              fontSize: 34,
              fontWeight: 700,
              color: C.onSurface,
              letterSpacing: "-0.03em",
              lineHeight: 1,
              fontFamily: "Inter, sans-serif",
            }}
          >
            <ScrambleText text="Capability tracking" />
          </h1>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button
            style={{
              padding: "12px 24px",
              background: C.surfaceHigh,
              color: C.onSurface,
              border: "none",
              borderRadius: 99,
              fontSize: 14,
              fontWeight: 600,
              cursor: "default",
              fontFamily: "Inter, sans-serif",
            }}
          >
            Download Report
          </button>
          <button
            style={{
              padding: "12px 24px",
              background: C.primaryContainer,
              color: C.white,
              border: "none",
              borderRadius: 99,
              fontSize: 14,
              fontWeight: 600,
              cursor: "default",
              fontFamily: "Inter, sans-serif",
            }}
          >
            Generate AI View
          </button>
        </div>
      </Panel>

      {/* Bento grid */}
      <div
        style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: "repeat(12, 1fr)",
          gridTemplateRows: "1fr 1fr",
          gap: 20,
          minHeight: 0,
        }}
      >
        {/* Main card — col-span 8 — stays still */}
        <div
          style={{
            gridColumn: "span 8",
            background: C.white,
            borderRadius: 48,
            padding: "20px 28px",
            boxShadow: ambientShadow,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 16,
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: C.onSurface,
                  fontFamily: "Inter, sans-serif",
                  marginBottom: 4,
                }}
              >
                Capability Index
              </h2>
              <p
                style={{
                  fontSize: 14,
                  color: C.onSurfaceVariant,
                  fontFamily: "Inter, sans-serif",
                }}
              >
                Real-time aggregate of workforce skill velocity
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  fontSize: 42,
                  fontWeight: 700,
                  color: C.primary,
                  fontFamily: "Inter, sans-serif",
                  lineHeight: 1,
                }}
              >
                84.2
              </div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#059669",
                  fontFamily: "Inter, sans-serif",
                  marginTop: 4,
                }}
              >
                +12% vs last month
              </div>
            </div>
          </div>

          {/* Bar chart */}
          <div
            style={{
              height: 130,
              display: "flex",
              alignItems: "flex-end",
              gap: 8,
              borderRadius: 16,
              overflow: "hidden",
              flex: 1,
            }}
          >
            {barHeights.map((h, i) => (
              <motion.div
                key={i}
                initial={{ height: "0%" }}
                animate={{ height: `${h}%` }}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  flex: 1,
                  background: barColors[i],
                  borderRadius: "48px 48px 0 0",
                  alignSelf: "flex-end",
                }}
              />
            ))}
          </div>

          {/* Stats row */}
          <div
            style={{
              borderTop: `1px solid ${C.surfaceContainer}`,
              paddingTop: 14,
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
            }}
          >
            {[
              { label: "Tech Stack", value: "High" },
              { label: "Soft Skills", value: "Emerging" },
              { label: "Resilience", value: "Stable" },
              { label: "Agility", value: "Peak" },
            ].map((s) => (
              <div key={s.label}>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: C.onSurfaceVariant,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    fontFamily: "Inter, sans-serif",
                    marginBottom: 4,
                  }}
                >
                  {s.label}
                </div>
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: C.onSurface,
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  {s.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Panel — col-span 4 */}
        <Panel
          delay={0.12}
          style={{
            gridColumn: "span 4",
            background: C.primaryContainer,
            borderRadius: 48,
            padding: 22,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
                marginBottom: 20,
              }}
            >
              <Icon name="autoAwesome" size={22} color={C.white} />
              <h2
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: C.white,
                  fontFamily: "Inter, sans-serif",
                  lineHeight: 1.3,
                }}
              >
                What matters and what to do next
              </h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div
                style={{
                  background: "rgba(255,255,255,0.10)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  borderRadius: 16,
                  padding: 16,
                  backdropFilter: "blur(8px)",
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: C.secondaryFixed,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    fontFamily: "Inter, sans-serif",
                    marginBottom: 6,
                  }}
                >
                  Primary Insight
                </div>
                <p
                  style={{
                    fontSize: 13,
                    lineHeight: 1.6,
                    color: "rgba(255,255,255,0.88)",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  Engagement in the Marketing team has dipped by 14%. Potential
                  alignment gap detected in Q3 goals.
                </p>
              </div>
              <div
                style={{
                  background: "rgba(255,255,255,0.10)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  borderRadius: 16,
                  padding: 16,
                  backdropFilter: "blur(8px)",
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: C.secondaryFixed,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    fontFamily: "Inter, sans-serif",
                    marginBottom: 6,
                  }}
                >
                  Recommendation
                </div>
                <p
                  style={{
                    fontSize: 13,
                    lineHeight: 1.6,
                    color: "rgba(255,255,255,0.88)",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  Schedule a &apos;Sync &amp; Soul&apos; session for middle managers to
                  recalibrate project ownership.
                </p>
              </div>
            </div>
          </div>
          <button
            style={{
              background: C.white,
              color: C.primary,
              border: "none",
              borderRadius: 16,
              padding: 14,
              fontSize: 14,
              fontWeight: 700,
              width: "100%",
              cursor: "default",
              fontFamily: "Inter, sans-serif",
              marginTop: 20,
            }}
          >
            Execute Strategy
          </button>
        </Panel>

        {/* Left panel — col-span 7 */}
        <Panel
          delay={0.16}
          style={{
            gridColumn: "span 7",
            background: C.surfaceLow,
            borderRadius: 48,
            padding: 22,
          }}
        >
          <h2
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: C.onSurface,
              fontFamily: "Inter, sans-serif",
              marginBottom: 16,
            }}
          >
            Real-time Behavioural Signals
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Item 1 */}
            <div
              style={{
                background: C.white,
                borderRadius: 16,
                padding: "20px 24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    background: `rgba(255,218,214,0.30)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon name="warning" size={20} color={C.error} />
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: C.onSurface,
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    Burnout Risk: Engineering
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: C.onSurfaceVariant,
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    High frequency of after-hours communication
                  </div>
                </div>
              </div>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  color: C.onErrorContainer,
                  background: C.errorContainer,
                  padding: "4px 12px",
                  borderRadius: 99,
                  fontFamily: "Inter, sans-serif",
                  whiteSpace: "nowrap",
                }}
              >
                ACTION REQUIRED
              </span>
            </div>

            {/* Item 2 */}
            <div
              style={{
                background: C.white,
                borderRadius: 16,
                padding: "20px 24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    background: "rgba(0,104,65,0.10)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon name="trendingDown" size={20} color={C.primary} />
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: C.onSurface,
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    Engagement Drops: Sales
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: C.onSurfaceVariant,
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    Meeting participation rates down 22%
                  </div>
                </div>
              </div>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  color: C.onSurfaceVariant,
                  background: C.surfaceHighest,
                  padding: "4px 12px",
                  borderRadius: 99,
                  fontFamily: "Inter, sans-serif",
                  whiteSpace: "nowrap",
                }}
              >
                MONITORING
              </span>
            </div>
          </div>
        </Panel>

        {/* Right panel — col-span 5 */}
        <Panel
          delay={0.20}
          style={{
            gridColumn: "span 5",
            background: C.white,
            borderRadius: 48,
            padding: 22,
            boxShadow: ambientShadow,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <h2
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: C.onSurface,
                  fontFamily: "Inter, sans-serif",
                }}
              >
                ESG Metrics
              </h2>
              <Icon name="eco" size={20} color={C.onSurfaceVariant} />
            </div>
            <ProgressBar
              label="Diversity & Inclusion"
              value={78}
              color={C.primary}
            />
            <ProgressBar
              label="Wellness Score"
              value={62}
              color={C.primaryContainer}
            />
            <ProgressBar
              label="Ethical Alignment"
              value={94}
              color={C.secondary}
            />
          </div>
          <div
            style={{
              background: `rgba(114,219,163,0.20)`,
              border: `1px solid rgba(114,219,163,0.30)`,
              borderRadius: 16,
              padding: 16,
            }}
          >
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: C.primary,
                fontFamily: "Inter, sans-serif",
              }}
            >
              Your organization is in the top 5% for ethical governance in the
              SaaS sector.
            </span>
          </div>
        </Panel>
      </div>
    </>
  );
}

// ─── Sidebar nav config ────────────────────────────────────────────────────────
const NAV_CONFIG: Record<
  "employees" | "managers" | "leadership",
  { label: string; icon: string }[]
> = {
  employees: [
    { label: "Dashboard", icon: "dashboard" },
    { label: "My Behaviours", icon: "emojiEvents" },
    { label: "Rewards", icon: "redeem" },
    { label: "Surveys", icon: "poll" },
    { label: "Settings", icon: "settings" },
  ],
  managers: [
    { label: "Dashboard", icon: "dashboard" },
    { label: "Insights", icon: "analytics" },
    { label: "Teams", icon: "groups" },
    { label: "ESG Tracking", icon: "eco" },
    { label: "Settings", icon: "settings" },
  ],
  leadership: [
    { label: "Dashboard", icon: "dashboard" },
    { label: "Insights", icon: "analytics" },
    { label: "Teams", icon: "groups" },
    { label: "ESG Tracking", icon: "eco" },
    { label: "Settings", icon: "settings" },
  ],
};

const USER_CONFIG: Record<
  "employees" | "managers" | "leadership",
  { name: string; role: string; initials: string }
> = {
  employees: { name: "Priya Sharma", role: "Product Designer", initials: "PS" },
  managers: { name: "Sarah Chen", role: "Engineering Lead", initials: "SC" },
  leadership: { name: "Alex Mercer", role: "Chief HR Officer", initials: "AM" },
};

// ─── Main Component ────────────────────────────────────────────────────────────
export default function WorkenvoDashboard({
  activeTab,
}: {
  activeTab: "employees" | "managers" | "leadership";
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setScale(entry.contentRect.width / DW);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const navItems = NAV_CONFIG[activeTab];
  const user = USER_CONFIG[activeTab];

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        aspectRatio: "16/9",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: DW,
          height: DH,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          background: C.surface,
          display: "flex",
          fontFamily: "Inter, sans-serif",
        }}
      >
        <div style={{ display: "flex", width: "100%", height: "100%" }}>
            {/* ── Sidebar — never remounts, no animation ── */}
            <div
              style={{
                width: 280,
                minWidth: 280,
                height: DH,
                background: C.surfaceLow,
                display: "flex",
                flexDirection: "column",
                padding: 24,
                gap: 0,
              }}
            >
              {/* Logo */}
              <div style={{ marginBottom: 20 }}>
                <BrandLogo
                  logoHeightClassName="h-[34px]"
                  textClassName="text-[28px] tracking-[-0.04em]"
                />
              </div>

              {/* Nav label */}
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: C.onSurfaceVariant,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  fontFamily: "Inter, sans-serif",
                  marginBottom: 8,
                }}
              >
                Main Menu
              </div>

              {/* Nav items */}
              <nav
                style={{ display: "flex", flexDirection: "column", gap: 4 }}
              >
                {navItems.map((item, i) => (
                  <div
                    key={item.label}
                    style={{
                      height: 48,
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "0 16px",
                      borderRadius: 16,
                      fontSize: 14,
                      fontWeight: 600,
                      color: i === 0 ? C.white : "#57665e",
                      background:
                        i === 0 ? C.primaryContainer : "transparent",
                      cursor: "default",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    <Icon
                      name={item.icon}
                      size={20}
                      color={i === 0 ? C.white : "#57665e"}
                    />
                    {item.label}
                  </div>
                ))}
              </nav>

              {/* User profile */}
              <div
                style={{
                  marginTop: "auto",
                  background: C.surfaceHighest,
                  borderRadius: 32,
                  padding: "12px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: C.primaryContainer,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: C.white,
                    fontWeight: 700,
                    fontSize: 13,
                    flexShrink: 0,
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  {user.initials}
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: C.onSurface,
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    {user.name}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      color: C.onSurfaceVariant,
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    {user.role}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Main area ── */}
            <div
              style={{
                flex: 1,
                padding: "24px 40px",
                display: "flex",
                flexDirection: "column",
                gap: 16,
                overflow: "hidden",
              }}
            >
              {/* key remounts only this div — sidebar stays mounted, no flash */}
              {activeTab === "employees" && <EmployeesContent key="employees" />}
              {activeTab === "managers" && <ManagersContent key="managers" />}
              {activeTab === "leadership" && <LeadershipContent key="leadership" />}
            </div>
        </div>
      </div>
    </div>
  );
}
