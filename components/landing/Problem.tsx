"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import type { MotionStyle } from "motion/react";
import type { ElementType } from "react";
import {
  AlertTriangle,
  Clock,
  TrendingDown,
  BarChart2,
  EyeOff,
  UserMinus,
  DollarSign,
  ShieldAlert,
  Users,
} from "lucide-react";

// ── Design canvas for cards ───────────────────────────────────────────────
const CARD_W = 720;
const CARD_H = 370;
// Mobile: smaller card — content top, square image bottom
const CARD_W_MOBILE = 340;
const CARD_H_MOBILE = 580;

/* ── Card data ────────────────────────────────────────────────────────── */

type DataPoint = { Icon: ElementType; text: string };

type CardDef = {
  number: string;
  label: string;
  sub: string;
  bg: string;
  statusLabel: string;
  dataPoints: DataPoint[];
  imageUrl: string;
};

/*
 * AI image prompts (square format, no white background):
 *
 * card-resignation.webp —
 *   A single crisp white envelope and folded resignation letter resting on a
 *   polished dark walnut desk surface. Warm amber desk lamp casts light from
 *   the right, the letter casting a short shadow on the wood grain. In the
 *   background slightly out of focus an empty black office chair is pushed
 *   neatly back from the desk. A half-drunk coffee mug sits to one side.
 *   Viewed from a 40-degree overhead angle. Quiet mood of finality. No text
 *   visible on the letter. Deep red tonal warmth in shadows.
 *
 * card-manager.webp —
 *   A figure in a dark blazer stands at the head of a long conference table
 *   with arms tightly crossed, viewed from slightly behind their left shoulder
 *   so no face is visible. Three seated employees arranged along the table —
 *   one with arms folded staring sideways out the window, one slumped over a
 *   closed laptop with head resting on a hand, one looking down at a notepad
 *   drawing circles. Cold white fluorescent overhead lighting. The standing
 *   figure casts a long hard shadow across the table. Rows of empty chairs
 *   along the far wall. The atmosphere is tense and draining. Amber-brown
 *   tonal palette.
 *
 * card-grievance.webp —
 *   Two office workers sitting at adjacent desks in an open-plan office just
 *   after sunset, room lit primarily by blue monitor glow. Left worker has
 *   turned their head sharply to glare sideways, jaw tight, hand gripping a
 *   pen. Right worker has shoulders raised and hunched, staring rigidly at
 *   their own screen. A single crumpled yellow sticky note sits on the desk
 *   surface between them. Other nearby desks are empty and dark. The narrow
 *   space between the two workers feels charged and uncrossable. Deep indigo
 *   blue shadows throughout.
 */

const CARDS: CardDef[] = [
  {
    number: "01",
    label: "The unexpected resignation",
    sub: "High performers don't leave overnight. The signals were there for months.",
    bg: "#B91C1C",
    statusLabel: "CRITICAL",
    imageUrl: "/images/card-grievance.webp",
    dataPoints: [
      {
        Icon: AlertTriangle,
        text: "68% of resignations are flagged only at the exit interview",
      },
      { Icon: DollarSign, text: "Replacing a key employee costs 6–9 months of salary" },
      { Icon: Clock, text: "Average disengagement-to-resignation window: 4.2 months of missed signals" },
    ],
  },
  {
    number: "02",
    label: "The manager problem",
    sub: "One bad manager quietly drains a whole team before anyone escalates.",
    bg: "#B45309",
    statusLabel: "HIGH RISK",
    imageUrl: "/images/card-manager.webp",
    dataPoints: [
      {
        Icon: EyeOff,
        text: "1 in 3 managers miss early warning signs on their own team",
      },
      { Icon: UserMinus, text: "Manager quality is the #1 driver of voluntary attrition" },
      {
        Icon: Users,
        text: "Most manager issues surface only after the second resignation",
      },
    ],
  },
  {
    number: "03",
    label: "The grievance you didn't see forming",
    sub: "Conflict and toxic behaviour build slowly — then arrive all at once.",
    bg: "#3730A3",
    statusLabel: "SILENT RISK",
    imageUrl: "/images/card-resignation.webp",
    dataPoints: [
      {
        Icon: BarChart2,
        text: "Most formal grievances had detectable early sentiment shifts",
      },
      {
        Icon: ShieldAlert,
        text: "A single WRC case can cost more than a year of platform fees",
      },
      {
        Icon: TrendingDown,
        text: "85% of employees won't raise an issue until it's already serious",
      },
    ],
  },
];

/* ── Stacked card component ───────────────────────────────────────────── */

function CardImage({ src, bg }: { src: string; bg: string }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: `color-mix(in srgb, ${bg} 60%, #000 40%)`,
        overflow: "hidden",
      }}
    >
      <img
        src={src}
        alt=""
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      />
    </div>
  );
}

function ProblemCard({
  card,
  style,
  scale = 1,
  cardW = CARD_W,
  cardH = CARD_H,
  mobile = false,
}: {
  card: CardDef;
  style?: MotionStyle;
  scale?: number;
  cardW?: number;
  cardH?: number;
  mobile?: boolean;
}) {
  const contentNode = (
    <>
      {/* Top row: number + status badge */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: mobile ? "16px" : "20px",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "13px",
            fontWeight: 700,
            letterSpacing: "0.1em",
            color: "rgba(255,255,255,0.45)",
          }}
        >
          ({card.number})
        </span>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "7px",
            padding: "5px 12px",
            borderRadius: "100px",
            background: "rgba(255,255,255,0.15)",
          }}
        >
          <span
            style={{
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              background: "#FFFFFF",
            }}
          />
          <span
            style={{
              fontSize: "10px",
              fontWeight: 800,
              letterSpacing: "0.18em",
              textTransform: "uppercase" as const,
              color: "#FFFFFF",
              fontFamily: "var(--font-sans)",
            }}
          >
            {card.statusLabel}
          </span>
        </div>
      </div>

      {/* Heading + subtitle */}
      <div style={{ marginBottom: mobile ? "18px" : "20px" }}>
        <h3
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: mobile ? "38px" : "32px",
            lineHeight: 1.08,
            fontWeight: 700,
            color: "#FFFFFF",
            marginBottom: "8px",
          }}
        >
          {card.label}
        </h3>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: mobile ? "13px" : "13px",
            color: "rgba(255,255,255,0.6)",
            lineHeight: 1.45,
            fontWeight: 500,
          }}
        >
          {card.sub}
        </p>
      </div>

      {/* Divider */}
      <div
        style={{
          height: "1px",
          background: "rgba(255,255,255,0.15)",
          marginBottom: mobile ? "18px" : "18px",
        }}
      />

      {/* Data points */}
      <div style={{ display: "flex", flexDirection: "column", gap: mobile ? "14px" : "14px" }}>
        {card.dataPoints.map(({ Icon, text }, j) => (
          <div key={j} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                flexShrink: 0,
                width: "30px",
                height: "30px",
                borderRadius: "8px",
                background: "rgba(255,255,255,0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon size={13} color="rgba(255,255,255,0.9)" strokeWidth={2.5} />
            </div>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: mobile ? "13px" : "13px",
                lineHeight: 1.4,
                color: "rgba(255,255,255,0.85)",
                fontWeight: 500,
              }}
            >
              {text}
            </p>
          </div>
        ))}
      </div>
    </>
  );

  return (
    <motion.div
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: "24px",
        overflow: "hidden",
        background: card.bg,
        ...style,
      }}
    >
      {/* Fixed design-space canvas scaled uniformly */}
      <div
        style={{
          width: cardW,
          height: cardH,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          display: "flex",
          flexDirection: mobile ? "column" : "row",
          position: "relative",
        }}
      >
        {/* Desktop: image on left (square = full card height) */}
        {!mobile && (
          <div style={{ width: cardH, height: cardH, flexShrink: 0 }}>
            <CardImage src={card.imageUrl} bg={card.bg} />
          </div>
        )}

        {/* Content column */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            padding: mobile ? "28px 24px 20px" : "32px 26px 32px 24px",
            overflow: "hidden",
          }}
        >
          {contentNode}
        </div>

        {/* Mobile: square image at bottom, centered */}
        {mobile && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              paddingBottom: "24px",
              paddingInline: "24px",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: "160px",
                height: "160px",
                borderRadius: "14px",
                overflow: "hidden",
                flexShrink: 0,
              }}
            >
              <CardImage src={card.imageUrl} bg={card.bg} />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ── Main component ───────────────────────────────────────────────────── */

export default function Problem() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardStackRef = useRef<HTMLDivElement>(null);
  const [cardScale, setCardScale] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const el = cardStackRef.current;
    if (!el) return;
    const cw = isMobile ? CARD_W_MOBILE : CARD_W;
    const ro = new ResizeObserver(([entry]) => {
      setCardScale(entry.contentRect.width / cw);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [isMobile]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // ── Card 0: visible at start, exits during act 1 ──
  const c0Y = useTransform(scrollYProgress, [0, 0.15, 0.35], [0, 0, -1000]);
  const c0Scale = useTransform(scrollYProgress, [0, 0.15, 0.35], [1, 1, 0.95]);
  const c0Opacity = useTransform(scrollYProgress, [0, 0.15, 0.35], [1, 1, 1]);

  // ── Card 1: waits behind c0, enters act 1, exits act 2 ──
  const c1Y = useTransform(
    scrollYProgress,
    [0, 0.15, 0.35, 0.5, 0.7],
    [40, 40, 0, 0, -1000],
  );
  const c1Scale = useTransform(
    scrollYProgress,
    [0, 0.15, 0.35, 0.5, 0.7],
    [0.95, 0.95, 1, 1, 0.95],
  );
  const c1Opacity = useTransform(
    scrollYProgress,
    [0, 0.15, 0.35, 0.5, 0.7],
    [1, 1, 1, 1, 1],
  );

  // ── Card 2: waits behind c1, enters act 2, holds act 3 ──
  const c2Y = useTransform(
    scrollYProgress,
    [0, 0.15, 0.35, 0.5, 0.7, 0.85],
    [80, 80, 40, 40, 0, 0],
  );
  const c2Scale = useTransform(
    scrollYProgress,
    [0, 0.15, 0.35, 0.5, 0.7, 0.85],
    [0.9, 0.9, 0.95, 0.95, 1, 1],
  );
  const c2Opacity = useTransform(
    scrollYProgress,
    [0, 0.15, 0.35, 0.5, 0.7, 0.85],
    [1, 1, 1, 1, 1, 1],
  );

  // Payoff
  const payoffOpacity = useTransform(scrollYProgress, [0.84, 0.96], [0, 1]);
  const payoffY = useTransform(scrollYProgress, [0.84, 0.96], [30, 0]);

  // Heading stays fully visible throughout — cards slide above it

  const cardStyles = [
    { opacity: c0Opacity, scale: c0Scale, y: c0Y, zIndex: 3 },
    { opacity: c1Opacity, scale: c1Scale, y: c1Y, zIndex: 2 },
    { opacity: c2Opacity, scale: c2Scale, y: c2Y, zIndex: 1 },
  ];

  return (
    <section
      ref={sectionRef}
      style={{ minHeight: "350vh", background: "#F8FAF9" }}
      className="relative"
    >
      {/* ── Sticky viewport ─────────────────────────────────────────── */}
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "28px",
        }}
      >
        {/* Ambient background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 60% 50% at 20% 40%, rgba(22,133,91,0.04) 0%, transparent 70%), " +
              "radial-gradient(ellipse 50% 40% at 80% 20%, rgba(99,102,241,0.03) 0%, transparent 70%)",
          }}
        />

        {/* Header area — sits below the card stack in z-order */}
        <div
          style={{
            textAlign: "center",
            zIndex: 1,
            pointerEvents: "none",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.25em",
              textTransform: "uppercase" as const,
              color: "#16855B",
              marginBottom: "10px",
            }}
          >
            The visibility gap
          </p>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(34px, 4vw, 52px)",
              lineHeight: 1.12,
              fontWeight: 400,
              color: "#111827",
              maxWidth: "620px",
              margin: "0 auto",
            }}
          >
            What keeps HR up{" "}
            <span style={{ fontStyle: "italic", color: "#16855B" }}>
              at night
            </span>
          </h2>
        </div>

        {/* ── Card stack — higher z-index so cards fly above the title ── */}
        <div
          ref={cardStackRef}
          style={{
            position: "relative",
            width: isMobile
              ? "min(420px, calc(100vw - 24px))"
              : "min(720px, calc(100vw - 40px))",
            aspectRatio: isMobile
              ? `${CARD_W_MOBILE} / ${CARD_H_MOBILE}`
              : `${CARD_W} / ${CARD_H}`,
            zIndex: 20,
          }}
        >
          {CARDS.map((card, i) => (
            <ProblemCard
              key={card.label}
              card={card}
              scale={cardScale}
              cardW={isMobile ? CARD_W_MOBILE : CARD_W}
              cardH={isMobile ? CARD_H_MOBILE : CARD_H}
              mobile={isMobile}
              style={{
                opacity: cardStyles[i].opacity,
                scale: cardStyles[i].scale,
                y: cardStyles[i].y,
                zIndex: cardStyles[i].zIndex,
                transformOrigin: "top center",
                boxShadow:
                  "0 8px 16px -4px rgba(0,0,0,0.2), 0 24px 56px -12px rgba(0,0,0,0.25)",
              }}
            />
          ))}
        </div>

        {/* Payoff headline */}
        <motion.div
          style={{
            opacity: payoffOpacity,
            y: payoffY,
            position: "absolute",
            bottom: "clamp(32px, 5vh, 56px)",
            left: 0,
            right: 0,
            zIndex: 10,
            textAlign: "center",
            paddingInline: "24px",
            pointerEvents: "none",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(28px, 3.5vw, 46px)",
              lineHeight: 1.2,
              fontWeight: 400,
              color: "#111827",
            }}
          >
            You shouldn&apos;t have to wait for the resignation,{" "}
            <span style={{ color: "#D97706", fontStyle: "italic" }}>
              the grievance, or the CEO&apos;s question.
            </span>
          </h2>
        </motion.div>
      </div>
    </section>
  );
}
