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
  active = true,
}: {
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
  active?: boolean;
}) {
  return (
    <motion.div
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: active ? 0.38 : 0, delay: active ? delay : 0, ease: "easeOut" }}
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
  active = true,
}: {
  text: string;
  style?: React.CSSProperties;
  active?: boolean;
}) {
  // Initialize with the real text so SSR and the first client render match.
  // The scramble animation kicks in after mount via the useEffect below.
  const [displayed, setDisplayed] = useState(text);

  useEffect(() => {
    if (!active) return;
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
  }, [active, text]);

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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function LegacyLeadershipContent() {
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

const commandPillars = [
  { name: "Engagement", value: 84, tone: C.primaryContainer },
  { name: "Burnout", value: 72, tone: "#e58b30" },
  { name: "Manager quality", value: 88, tone: C.primaryContainer },
  { name: "Retention", value: 79, tone: C.primaryContainer },
  { name: "Survey signal", value: 69, tone: "#e58b30" },
];

const commandRisks = [
  {
    rank: "01",
    title: "Support burnout rising",
    why: "Late-week load and after-hours pings are compounding.",
    color: "#ef4b3f",
    spark: [24, 28, 27, 35, 40, 44, 52, 58],
  },
  {
    rank: "02",
    title: "Product attrition cluster",
    why: "High performers show lower belonging and manager trust.",
    color: "#ef4b3f",
    spark: [18, 24, 28, 27, 35, 46, 51, 55],
  },
];

const heatRows = [
  { team: "Support", level: "High", values: [0.32, 0.44, 0.55, 0.62, 0.68, 0.73, 0.84, 0.92] },
  { team: "Product", level: "High", values: [0.22, 0.31, 0.42, 0.5, 0.56, 0.62, 0.69, 0.76] },
  { team: "Sales", level: "Medium", values: [0.16, 0.2, 0.29, 0.34, 0.42, 0.48, 0.44, 0.51] },
  { team: "Engineering", level: "Medium", values: [0.24, 0.27, 0.31, 0.39, 0.45, 0.5, 0.49, 0.54] },
  { team: "People", level: "Low", values: [0.13, 0.17, 0.19, 0.18, 0.23, 0.25, 0.24, 0.22] },
  { team: "Finance", level: "Low", values: [0.18, 0.19, 0.22, 0.24, 0.23, 0.27, 0.28, 0.31] },
];

const managers = [
  { name: "Maya Iyer", team: "Product", value: 15, delta: "+7" },
  { name: "Daniel Cho", team: "Sales", value: 11, delta: "+5" },
  { name: "Avery Stone", team: "People", value: 9, delta: "+3" },
  { name: "Noah Kim", team: "Engineering", value: -6, delta: "-2" },
  { name: "Rhea Kapoor", team: "Support", value: -13, delta: "-6" },
];

function landingHeatColor(value: number) {
  if (value > 0.74) return "#d86b54";
  if (value > 0.56) return "#e2b14f";
  if (value > 0.34) return "#b9c895";
  if (value > 0.22) return "#a9d2b7";
  return "#d8ebdf";
}

function CommandCard({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        background: C.white,
        border: "1px solid rgba(15,23,42,0.10)",
        borderRadius: "0.55rem",
        boxShadow: "0 0.08rem 0.2rem rgba(15,23,42,0.045)",
        minWidth: 0,
        overflow: "hidden",
        padding: "1.18rem",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function CommandKicker({ children, color }: { children: React.ReactNode; color?: string }) {
  return (
    <div
      style={{
        color: color ?? "#8a94a2",
        fontFamily: "SFMono-Regular, Consolas, monospace",
        fontSize: "0.58rem",
        fontWeight: 800,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
      }}
    >
      {children}
    </div>
  );
}

function CommandTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        color: "#0e1726",
        fontFamily: "Inter, sans-serif",
        fontSize: "1.04rem",
        fontWeight: 820,
        lineHeight: 1.13,
        margin: "0.28rem 0 0",
      }}
    >
      {children}
    </h2>
  );
}

function CommandNote({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        color: "#515d6c",
        fontFamily: "Inter, sans-serif",
        fontSize: "0.7rem",
        lineHeight: 1.46,
        margin: "0.45rem 0 0",
      }}
    >
      {children}
    </p>
  );
}

function SparklinePreview({ data, color }: { data: number[]; color: string }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const points = data.map((value, index) => {
    const x = 4 + (index / (data.length - 1)) * 90;
    const y = 36 - ((value - min) / (max - min || 1)) * 28;
    return [x, y];
  });
  const d = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point[0]} ${point[1]}`).join(" ");
  const last = points[points.length - 1];

  return (
    <svg viewBox="0 0 100 42" style={{ display: "block", width: "5.2rem" }}>
      <path d={`${d} L ${last[0]} 40 L 4 40 Z`} fill={color} opacity="0.08" />
      <path d={d} fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" />
      <circle cx={last[0]} cy={last[1]} fill={color} r="2.8" />
    </svg>
  );
}

function HealthGaugePreview({ active }: { active: boolean }) {
  const circumference = 283;
  return (
    <div style={{ display: "grid", height: "12.8rem", placeItems: "center", position: "relative" }}>
      <svg viewBox="0 0 180 180" style={{ height: "100%", overflow: "visible", width: "100%" }}>
        <path d="M 36 126 A 66 66 0 1 1 144 126" fill="none" stroke="#e5e7eb" strokeLinecap="round" strokeWidth="16" />
        <motion.path
          d="M 36 126 A 66 66 0 1 1 144 126"
          fill="none"
          initial={{ strokeDashoffset: circumference }}
          animate={active ? { strokeDashoffset: circumference * 0.18 } : { strokeDashoffset: circumference }}
          stroke="url(#healthGradient)"
          strokeDasharray={circumference}
          strokeLinecap="round"
          strokeWidth="16"
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        />
        <defs>
          <linearGradient id="healthGradient" x1="20" x2="160" y1="120" y2="40">
            <stop stopColor="#72dba3" />
            <stop offset="1" stopColor="#00c86b" />
          </linearGradient>
        </defs>
      </svg>
      <div style={{ alignItems: "center", display: "flex", flexDirection: "column", gap: "0.36rem", left: "50%", position: "absolute", top: "48%", transform: "translate(-50%, -50%)", width: "8.2rem" }}>
        <div style={{ alignItems: "baseline", display: "flex", gap: "0.25rem" }}>
          <span style={{ color: "#0b6b41", fontSize: "3.35rem", fontWeight: 900, lineHeight: 0.9 }}>82</span>
          <span style={{ color: "#8a94a2", fontFamily: "SFMono-Regular, Consolas, monospace", fontSize: "0.58rem", fontWeight: 850 }}>/ 100</span>
        </div>
        <span style={{ color: "#0b6b41", fontSize: "0.7rem", fontWeight: 850 }}>↗ +6 pts</span>
      </div>
    </div>
  );
}

function LeadershipContent({ active = true }: { active?: boolean }) {
  return (
    <>
      <Panel active={active} delay={0.04} style={{ alignItems: "flex-end", display: "flex", justifyContent: "space-between" }}>
        <div>
          <CommandKicker>Organisation-wide insights</CommandKicker>
          <h1
            style={{
              color: "#0e1726",
              fontFamily: "Inter, sans-serif",
              fontSize: "2rem",
              fontWeight: 860,
              lineHeight: 1.02,
              margin: "0.5rem 0 0.45rem",
            }}
          >
            <ScrambleText active={active} text="Workforce command center" />
          </h1>
          <p style={{ color: "#667282", fontFamily: "Inter, sans-serif", fontSize: "0.86rem", margin: 0 }}>
            Live people health, retention risk, manager effect, and recommended actions.
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.62rem" }}>
          <button style={{ background: C.white, border: "1px solid rgba(15,23,42,0.10)", borderRadius: "999px", color: "#515d6c", fontFamily: "Inter, sans-serif", fontSize: "0.8rem", fontWeight: 760, padding: "0.85rem 1.25rem" }}>
            Export
          </button>
          <button style={{ background: "#0b6b41", border: 0, borderRadius: "999px", color: C.white, fontFamily: "Inter, sans-serif", fontSize: "0.8rem", fontWeight: 780, padding: "0.85rem 1.3rem" }}>
            Generate AI view
          </button>
        </div>
      </Panel>

      <div style={{ display: "grid", flex: "0 0 auto", gap: "0.9rem", gridTemplateColumns: "repeat(12, minmax(0, 1fr))", gridTemplateRows: "19.1rem 18.3rem", minHeight: 0, overflow: "hidden" }}>
        <Panel active={active} delay={0.1} style={{ gridColumn: "span 7", minHeight: 0 }}>
          <CommandCard style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <div style={{ alignItems: "flex-start", display: "flex", justifyContent: "space-between" }}>
              <div>
                <CommandKicker>Workforce Health</CommandKicker>
                <CommandTitle>The company&apos;s health, in one number</CommandTitle>
                <CommandNote>Engagement, burnout, manager quality, retention and survey signal, composited live.</CommandNote>
              </div>
              <span style={{ alignItems: "center", background: "#eafbf2", borderRadius: "999px", color: "#0b6b41", display: "inline-flex", fontFamily: "SFMono-Regular, Consolas, monospace", fontSize: "0.58rem", fontWeight: 850, gap: "0.35rem", padding: "0.45rem 0.55rem", textTransform: "uppercase" }}>
                <span style={{ background: "rgba(16,137,79,0.16)", borderRadius: "999px", display: "grid", height: "0.82rem", placeItems: "center", width: "0.82rem" }}>
                  <span style={{ background: "#10894f", borderRadius: "999px", height: "0.35rem", width: "0.35rem" }} />
                </span>
                Live
              </span>
            </div>
            <div style={{ alignItems: "center", display: "grid", flex: 1, gap: "1.6rem", gridTemplateColumns: "30% 1fr", marginTop: "0.9rem", minHeight: 0 }}>
              <HealthGaugePreview active={active} />
              <div style={{ display: "flex", flexDirection: "column", gap: "0.78rem" }}>
                {commandPillars.map((pillar, index) => (
                  <div key={pillar.name} style={{ alignItems: "center", display: "grid", gap: "0.75rem", gridTemplateColumns: "8.2rem 1fr 2rem" }}>
                    <span style={{ color: "#515d6c", fontSize: "0.75rem", fontWeight: 760 }}>{pillar.name}</span>
                    <div style={{ background: "#f2f5f3", borderRadius: "999px", height: "0.52rem", overflow: "hidden" }}>
                      <motion.div
                        initial={{ scaleX: 0 }}
                        animate={active ? { scaleX: 1 } : { scaleX: 0 }}
                        transition={{ duration: 0.8, delay: 0.18 + index * 0.06, ease: [0.22, 1, 0.36, 1] }}
                        style={{ background: pillar.tone, borderRadius: "inherit", height: "100%", transformOrigin: "left center", width: `${pillar.value}%` }}
                      />
                    </div>
                    <span style={{ color: "#0e1726", fontFamily: "SFMono-Regular, Consolas, monospace", fontSize: "0.68rem", fontWeight: 850, textAlign: "right" }}>{pillar.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </CommandCard>
        </Panel>

        <Panel active={active} delay={0.14} style={{ gridColumn: "span 5", minHeight: 0 }}>
          <CommandCard style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <div style={{ alignItems: "flex-start", display: "flex", justifyContent: "space-between" }}>
              <div>
                <CommandKicker color="#ef4b3f">Requires attention</CommandKicker>
                <CommandTitle>Top risks right now</CommandTitle>
              </div>
              <span style={{ background: "#fdede9", borderRadius: "999px", color: "#ef4b3f", fontFamily: "SFMono-Regular, Consolas, monospace", fontSize: "0.58rem", fontWeight: 850, padding: "0.45rem 0.65rem", textTransform: "uppercase" }}>2 active</span>
            </div>
            <div style={{ display: "flex", flex: 1, flexDirection: "column", gap: "0.8rem", justifyContent: "center", minHeight: 0, paddingTop: "0.45rem" }}>
              {commandRisks.map((risk) => (
                <div key={risk.rank} style={{ alignItems: "center", background: "#fbfcfd", border: "1px solid rgba(15,23,42,0.06)", borderRadius: "0.55rem", display: "grid", gap: "0.72rem", gridTemplateColumns: "0.3rem 1.85rem 1fr auto", minHeight: "4.3rem", overflow: "hidden", padding: "0.64rem 0.78rem 0.64rem 0" }}>
                  <span style={{ alignSelf: "stretch", background: risk.color, borderRadius: "999px" }} />
                  <span style={{ color: "#c3cad3", fontFamily: "SFMono-Regular, Consolas, monospace", fontSize: "0.68rem", fontWeight: 900 }}>{risk.rank}</span>
                  <div>
                    <div style={{ color: "#0e1726", fontSize: "0.78rem", fontWeight: 840 }}>{risk.title}</div>
                    <div style={{ color: "#515d6c", fontSize: "0.66rem", lineHeight: 1.38, marginTop: "0.22rem" }}>{risk.why}</div>
                  </div>
                  <SparklinePreview color={risk.color} data={risk.spark} />
                </div>
              ))}
            </div>
          </CommandCard>
        </Panel>

        <Panel active={active} delay={0.18} style={{ gridColumn: "span 4", minHeight: 0 }}>
          <CommandCard style={{ height: "100%" }}>
            <div style={{ alignItems: "flex-start", display: "flex", justifyContent: "space-between" }}>
              <div>
                <CommandKicker>Flight risk</CommandKicker>
                <CommandTitle>Attrition risk</CommandTitle>
              </div>
              <span style={{ background: "#f2f5f3", borderRadius: "999px", color: "#515d6c", fontFamily: "SFMono-Regular, Consolas, monospace", fontSize: "0.58rem", fontWeight: 850, padding: "0.45rem 0.65rem", textTransform: "uppercase" }}>178 people</span>
            </div>
            <div style={{ display: "grid", gap: "0.5rem", gridTemplateColumns: "repeat(3, 1fr)", marginTop: "1rem" }}>
              {[
                ["18", "High risk", "#ef4b3f", "#e8c9be"],
                ["34", "Moderate", "#e58b30", "#ecd8b0"],
                ["126", "Stable", "#515d6c", "rgba(15,23,42,0.10)"],
              ].map(([value, label, color, border]) => (
                <div key={label} style={{ border: `1px solid ${border}`, borderRadius: "0.5rem", padding: "0.65rem" }}>
                  <div style={{ color, fontSize: "1.45rem", fontWeight: 900, lineHeight: 1 }}>{value}</div>
                  <div style={{ color: "#8a94a2", fontSize: "0.58rem", fontWeight: 850, marginTop: "0.3rem", textTransform: "uppercase" }}>{label}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "grid", gap: "0.42rem", gridTemplateColumns: "repeat(24, 1fr)", marginTop: "1rem" }}>
              {Array.from({ length: 144 }).map((_, index) => {
                const color = index < 18 ? "#ef7f72" : index < 52 ? "#e2b14f" : "#d8ebdf";
                return <span key={index} style={{ aspectRatio: "1", background: color, borderRadius: "999px", opacity: index > 105 ? 0.55 : 1 }} />;
              })}
            </div>
          </CommandCard>
        </Panel>

        <Panel active={active} delay={0.22} style={{ gridColumn: "span 4", minHeight: 0 }}>
          <CommandCard style={{ height: "100%" }}>
            <div style={{ alignItems: "flex-start", display: "flex", justifyContent: "space-between" }}>
              <div>
                <CommandKicker>Where it&apos;s building</CommandKicker>
                <CommandTitle>Burnout heatmap</CommandTitle>
              </div>
              <span style={{ background: "#eafbf2", borderRadius: "999px", color: "#0b6b41", fontFamily: "SFMono-Regular, Consolas, monospace", fontSize: "0.58rem", fontWeight: 850, padding: "0.45rem 0.65rem", textTransform: "uppercase" }}>8 wks</span>
            </div>
            <div style={{ display: "grid", gap: "0.48rem", marginTop: "1.35rem" }}>
              {heatRows.map((row) => (
                <div key={row.team} style={{ alignItems: "center", display: "grid", gap: "0.7rem", gridTemplateColumns: "5.8rem 1fr 3.3rem" }}>
                  <span style={{ color: "#515d6c", fontSize: "0.7rem", fontWeight: 800 }}>{row.team}</span>
                  <div style={{ display: "grid", gap: "0.28rem", gridTemplateColumns: "repeat(8, 1fr)" }}>
                    {row.values.map((value, index) => (
                      <span key={index} style={{ background: landingHeatColor(value), borderRadius: "0.22rem", height: "1.02rem" }} />
                    ))}
                  </div>
                  <span style={{ background: row.level === "High" ? "#fdede9" : row.level === "Medium" ? "#fbf2dd" : "#eafbf2", borderRadius: "999px", color: row.level === "High" ? "#ef4b3f" : row.level === "Medium" ? "#d38a2c" : "#0b6b41", fontSize: "0.52rem", fontWeight: 850, padding: "0.38rem 0.45rem", textAlign: "center", textTransform: "uppercase" }}>{row.level}</span>
                </div>
              ))}
            </div>
          </CommandCard>
        </Panel>

        <Panel active={active} delay={0.26} style={{ gridColumn: "span 4", minHeight: 0 }}>
          <CommandCard style={{ height: "100%" }}>
            <div style={{ alignItems: "flex-start", display: "flex", justifyContent: "space-between" }}>
              <div>
                <CommandKicker>Who lifts, who drags</CommandKicker>
                <CommandTitle>Manager effectiveness</CommandTitle>
              </div>
              <span style={{ background: "#f2f5f3", borderRadius: "999px", color: "#515d6c", fontFamily: "SFMono-Regular, Consolas, monospace", fontSize: "0.58rem", fontWeight: 850, padding: "0.45rem 0.65rem", textTransform: "uppercase" }}>Effect on perf.</span>
            </div>
            <div style={{ display: "grid", gap: "0.6rem", marginTop: "2.2rem" }}>
              {managers.map((manager, index) => {
                const positive = manager.value >= 0;
                return (
                  <div key={manager.name} style={{ alignItems: "center", display: "grid", gap: "0.7rem", gridTemplateColumns: "7.4rem 1fr 2.2rem" }}>
                    <div>
                      <div style={{ color: "#0e1726", fontSize: "0.72rem", fontWeight: 840 }}>{manager.name}</div>
                      <div style={{ color: "#8a94a2", fontFamily: "SFMono-Regular, Consolas, monospace", fontSize: "0.55rem", fontWeight: 850, textTransform: "uppercase" }}>{manager.team}</div>
                    </div>
                    <div style={{ height: "1.2rem", position: "relative" }}>
                      <span style={{ background: "rgba(15,23,42,0.15)", bottom: "-0.2rem", left: "50%", position: "absolute", top: "-0.2rem", width: 1 }} />
                      <motion.span
                        initial={{ scaleX: 0 }}
                        animate={active ? { scaleX: 1 } : { scaleX: 0 }}
                        transition={{ duration: 0.7, delay: 0.32 + index * 0.05, ease: [0.22, 1, 0.36, 1] }}
                        style={{
                          background: positive ? "linear-gradient(90deg,#449268,#10894f)" : "linear-gradient(90deg,#d86b54,#ef4b3f)",
                          borderRadius: "0.32rem",
                          height: "0.9rem",
                          left: positive ? "50%" : undefined,
                          position: "absolute",
                          right: positive ? undefined : "50%",
                          top: "0.14rem",
                          transformOrigin: positive ? "left center" : "right center",
                          width: `${Math.abs(manager.value) * 3.2}%`,
                        }}
                      />
                    </div>
                    <span style={{ color: positive ? "#10894f" : "#ef4b3f", fontFamily: "SFMono-Regular, Consolas, monospace", fontSize: "0.72rem", fontWeight: 900, textAlign: "right" }}>{manager.delta}</span>
                  </div>
                );
              })}
            </div>
          </CommandCard>
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
    { label: "Sentiment", icon: "settings" },
    { label: "Signals Setup", icon: "analytics" },
    { label: "Survey Builder", icon: "poll" },
    { label: "Employees", icon: "groups" },
    { label: "Reports", icon: "analytics" },
    { label: "Integrations", icon: "settings" },
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
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setScale(entry.contentRect.width / DW);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.28 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const navItems = NAV_CONFIG[activeTab];
  const user = USER_CONFIG[activeTab];
  const canvasHeight = activeTab === "leadership" ? 760 : DH;
  const leadershipGroups = [
    { label: "Insights", items: navItems.slice(0, 1) },
    { label: "Configure", items: navItems.slice(1, 4) },
    { label: "Manage", items: navItems.slice(4) },
  ];

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        aspectRatio: activeTab === "leadership" ? `${DW} / ${canvasHeight}` : "16/9",
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
          height: canvasHeight,
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
                height: canvasHeight,
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

              {activeTab === "leadership" ? (
                <nav style={{ display: "flex", flexDirection: "column", gap: 22 }}>
                  {leadershipGroups.map((group) => (
                    <div key={group.label}>
                      <div
                        style={{
                          color: "#c3cad3",
                          fontFamily: "Inter, sans-serif",
                          fontSize: 10,
                          fontWeight: 800,
                          letterSpacing: "0.22em",
                          marginBottom: 8,
                          paddingLeft: 12,
                          textTransform: "uppercase",
                        }}
                      >
                        {group.label}
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        {group.items.map((item) => {
                          const active = item.label === "Dashboard";
                          return (
                            <div
                              key={item.label}
                              style={{
                                alignItems: "center",
                                background: active ? "#007a48" : "transparent",
                                borderRadius: 18,
                                color: active ? C.white : "#5d6976",
                                cursor: "default",
                                display: "flex",
                                fontFamily: "Inter, sans-serif",
                                fontSize: 14,
                                fontWeight: 720,
                                gap: 12,
                                height: 46,
                                padding: "0 16px",
                              }}
                            >
                              <Icon name={item.icon} size={19} color={active ? C.white : "#5d6976"} />
                              {item.label}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </nav>
              ) : (
                <>
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
                </>
              )}

              {activeTab === "leadership" && (
                <div style={{ display: "grid", gap: 12, marginTop: "auto" }}>
                  {[
                    { label: "Settings", icon: "settings", color: "#515d6c" },
                    { label: "Export Insights", icon: "analytics", color: C.primary },
                  ].map((item) => (
                    <div
                      key={item.label}
                      style={{
                        alignItems: "center",
                        background: C.white,
                        border: "1px solid rgba(15,23,42,0.10)",
                        borderRadius: 22,
                        color: item.color,
                        display: "flex",
                        fontFamily: "Inter, sans-serif",
                        fontSize: 13,
                        fontWeight: 720,
                        gap: 10,
                        height: 46,
                        justifyContent: "center",
                      }}
                    >
                      <Icon name={item.icon} size={17} color={item.color} />
                      {item.label}
                    </div>
                  ))}
                </div>
              )}

              {/* User profile */}
              <div
                style={{
                  marginTop: activeTab === "leadership" ? 12 : "auto",
                  background: activeTab === "leadership" ? C.white : C.surfaceHighest,
                  border: activeTab === "leadership" ? "1px solid rgba(15,23,42,0.08)" : 0,
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
                    background: activeTab === "leadership" ? "#e69a5d" : C.primaryContainer,
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
              {activeTab === "leadership" && <LeadershipContent active={isInView} key="leadership" />}
            </div>
        </div>
      </div>
    </div>
  );
}
