"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import type { MotionStyle, MotionValue } from "motion/react";
import type { ElementType } from "react";
import {
  TrendingDown,
  AlertTriangle,
  Flame,
  Clock,
  UserMinus,
  BarChart2,
  Heart,
} from "lucide-react";

const CARD_W = 780;
const CARD_H = 390;
const CARD_W_MOBILE = 340;
const CARD_H_MOBILE = 560;

type DataPoint = {
  Icon: ElementType;
  text: string;
};

type SignalCard = {
  number: string;
  label: string;
  sub: string;
  bg: string;
  border: string;
  ink: string;
  iconBg: string;
  iconColor: string;
  statusLabel: string;
  Icon: ElementType;
  image: string;
  dataPoints: DataPoint[];
};

const SIGNAL_CARDS: SignalCard[] = [
  {
    number: "01",
    label: "Sales team engagement dropping",
    sub: "The Monday pipeline still looks fine, but the team energy is quietly thinning.",
    bg: "oklch(0.97 0.014 155)",
    border: "oklch(0.88 0.028 155)",
    ink: "oklch(0.20 0.045 158)",
    iconBg: "oklch(0.92 0.024 155)",
    iconColor: "oklch(0.36 0.11 155)",
    statusLabel: "ENGAGEMENT",
    Icon: TrendingDown,
    image: "/images/card_01_employee-at-desk.webp",
    dataPoints: [
      { Icon: TrendingDown, text: "Participation, tone, and response velocity start moving together." },
      { Icon: Clock, text: "Workenvo flags the drift before it shows up as missed targets." },
    ],
  },
  {
    number: "02",
    label: "A new manager creating negative sentiment",
    sub: "One leadership change can alter how safe a team feels in a matter of weeks.",
    bg: "oklch(0.97 0.012 142)",
    border: "oklch(0.88 0.026 142)",
    ink: "oklch(0.20 0.042 144)",
    iconBg: "oklch(0.92 0.022 142)",
    iconColor: "oklch(0.35 0.1 142)",
    statusLabel: "MANAGER RISK",
    Icon: AlertTriangle,
    image: "/images/card_02_team-meeting.webp",
    dataPoints: [
      { Icon: AlertTriangle, text: "Sentiment drops around one team, one reporting line, or one manager." },
      { Icon: BarChart2, text: "Patterns become visible while coaching is still possible." },
    ],
  },
  {
    number: "03",
    label: "A high performer showing burnout signals",
    sub: "Your strongest people often stay functional right up until they are done.",
    bg: "oklch(0.97 0.015 172)",
    border: "oklch(0.88 0.030 172)",
    ink: "oklch(0.20 0.046 172)",
    iconBg: "oklch(0.92 0.026 172)",
    iconColor: "oklch(0.37 0.12 172)",
    statusLabel: "BURNOUT",
    Icon: Flame,
    image: "/images/card_03_overworked-employee.webp",
    dataPoints: [
      { Icon: Flame, text: "Signals shift from committed to stretched before the person asks for help." },
      { Icon: Heart, text: "HR sees where support is needed without waiting for a crisis." },
    ],
  },
  {
    number: "04",
    label: "Team meetings becoming less productive",
    sub: "A calendar can look full while collaboration is quietly losing its usefulness.",
    bg: "oklch(0.97 0.013 125)",
    border: "oklch(0.88 0.027 125)",
    ink: "oklch(0.20 0.042 127)",
    iconBg: "oklch(0.92 0.023 125)",
    iconColor: "oklch(0.35 0.1 127)",
    statusLabel: "MEETING DRIFT",
    Icon: Clock,
    image: "/images/card_04_hr-manager.webp",
    dataPoints: [
      { Icon: Clock, text: "Frequency, attendance, and follow-through stop matching team outcomes." },
      { Icon: TrendingDown, text: "The signal appears before frustration becomes resignation language." },
    ],
  },
  {
    number: "05",
    label: "An employee at risk of leaving",
    sub: "Attrition has a long shadow. The resignation letter is usually the final symptom.",
    bg: "oklch(0.97 0.013 160)",
    border: "oklch(0.88 0.027 160)",
    ink: "oklch(0.20 0.043 160)",
    iconBg: "oklch(0.92 0.023 160)",
    iconColor: "oklch(0.36 0.11 160)",
    statusLabel: "RETENTION",
    Icon: UserMinus,
    image: "/images/card_05_executive.webp",
    dataPoints: [
      { Icon: UserMinus, text: "Engagement, support, and activity signals combine into a leaving-risk view." },
      { Icon: AlertTriangle, text: "Managers get time to act before an exit interview explains it." },
    ],
  },
  {
    number: "06",
    label: "A sudden drop in performance",
    sub: "Performance issues are easier to resolve when you can see what changed around them.",
    bg: "oklch(0.97 0.014 165)",
    border: "oklch(0.88 0.028 165)",
    ink: "oklch(0.20 0.044 165)",
    iconBg: "oklch(0.92 0.024 165)",
    iconColor: "oklch(0.36 0.11 165)",
    statusLabel: "PERFORMANCE",
    Icon: BarChart2,
    image: "/images/card_06_sales-engagement.webp",
    dataPoints: [
      { Icon: BarChart2, text: "Output dips are connected to workload, team climate, and manager context." },
      { Icon: Clock, text: "The conversation starts earlier, with more useful context." },
    ],
  },
  {
    number: "07",
    label: "An employee feeling unsupported",
    sub: "Support gaps are quiet at first. They become expensive when people stop believing help is coming.",
    bg: "oklch(0.97 0.012 133)",
    border: "oklch(0.88 0.025 133)",
    ink: "oklch(0.20 0.040 133)",
    iconBg: "oklch(0.92 0.022 133)",
    iconColor: "oklch(0.34 0.09 133)",
    statusLabel: "SUPPORT",
    Icon: Heart,
    image: "/images/card_07_new-manager.webp",
    dataPoints: [
      { Icon: Heart, text: "Low support signals surface before the employee disengages from the team." },
      { Icon: AlertTriangle, text: "HR can intervene while the fix is still human and practical." },
    ],
  },
];

function CardImagePanel({ card, mobile }: { card: SignalCard; mobile: boolean }) {
  const size = mobile ? "188px" : `${CARD_H - 44}px`;
  return (
    <div
      style={{
        width: mobile ? "188px" : `${CARD_H - 44}px`,
        height: mobile ? "168px" : `${CARD_H - 44}px`,
        flexShrink: 0,
        borderRadius: mobile ? "22px" : "26px",
        border: `1px solid ${card.border}`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Image
        src={card.image}
        alt={card.label}
        fill
        sizes={`${size}`}
        quality={88}
        style={{ objectFit: "cover" }}
      />
    </div>
  );
}

function SignalProblemCard({
  card,
  style,
  scale = 1,
  cardW = CARD_W,
  cardH = CARD_H,
  mobile = false,
}: {
  card: SignalCard;
  style?: MotionStyle;
  scale?: number;
  cardW?: number;
  cardH?: number;
  mobile?: boolean;
}) {
  return (
    <motion.div
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: "28px",
        overflow: "hidden",
        background: card.bg,
        border: `1px solid ${card.border}`,
        ...style,
      }}
    >
      <div
        style={{
          width: cardW,
          height: cardH,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          display: "flex",
          flexDirection: mobile ? "column" : "row",
          alignItems: mobile ? "center" : "stretch",
          gap: mobile ? "18px" : "26px",
          padding: mobile ? "24px 24px 26px" : "22px",
          position: "relative",
        }}
      >
        {!mobile && <CardImagePanel card={card} mobile={false} />}

        <div
          style={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            padding: mobile ? 0 : "10px 8px 8px 0",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "14px",
              marginBottom: mobile ? "16px" : "20px",
            }}
          >
            <span
              style={{
                fontFamily: "'Courier New', monospace",
                fontSize: "13px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                color: `color-mix(in srgb, ${card.ink} 58%, transparent 42%)`,
              }}
            >
              ({card.number})
            </span>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "7px",
                padding: "6px 12px",
                borderRadius: "100px",
                background: "color-mix(in srgb, white 54%, transparent 46%)",
                border: `1px solid color-mix(in srgb, ${card.border} 72%, transparent 28%)`,
              }}
            >
              <span
                style={{
                  width: "5px",
                  height: "5px",
                  borderRadius: "50%",
                  background: card.iconColor,
                }}
              />
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 800,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase" as const,
                  color: card.ink,
                  fontFamily: "var(--font-sans)",
                  whiteSpace: "nowrap",
                }}
              >
                {card.statusLabel}
              </span>
            </div>
          </div>

          <div style={{ marginBottom: mobile ? "16px" : "18px" }}>
            <h3
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: mobile ? "31px" : "34px",
                lineHeight: 1.06,
                fontWeight: 700,
                color: card.ink,
                marginBottom: "10px",
                letterSpacing: "0",
              }}
            >
              {card.label}
            </h3>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: mobile ? "13px" : "14px",
                color: `color-mix(in srgb, ${card.ink} 70%, transparent 30%)`,
                lineHeight: 1.5,
                fontWeight: 500,
              }}
            >
              {card.sub}
            </p>
          </div>

          <div
            style={{
              height: "1px",
              background: `color-mix(in srgb, ${card.border} 70%, transparent 30%)`,
              marginBottom: mobile ? "16px" : "18px",
            }}
          />

          <div style={{ display: "flex", flexDirection: "column", gap: mobile ? "12px" : "14px" }}>
            {card.dataPoints.map(({ Icon, text }) => (
              <div key={text} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div
                  style={{
                    flexShrink: 0,
                    width: "30px",
                    height: "30px",
                    borderRadius: "9px",
                    background: "color-mix(in srgb, white 56%, transparent 44%)",
                    border: `1px solid color-mix(in srgb, ${card.border} 70%, transparent 30%)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon size={14} color={card.iconColor} strokeWidth={2.35} />
                </div>
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: mobile ? "12.5px" : "13px",
                    lineHeight: 1.4,
                    color: `color-mix(in srgb, ${card.ink} 84%, transparent 16%)`,
                    fontWeight: 600,
                  }}
                >
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {mobile && <CardImagePanel card={card} mobile />}
      </div>
    </motion.div>
  );
}

function useStackedCardMotion(
  scrollYProgress: MotionValue<number>,
  index: number,
  total: number,
): MotionStyle {
  const segment = 0.84 / total;
  const entryStart = index === 0 ? 0 : (index - 1) * segment;
  const entryEnd = index * segment;
  const exitStart = (index + 0.58) * segment;
  const exitEnd = (index + 1.65) * segment;
  const startY = Math.min(index * 28, 96);
  const startScale = 1 - Math.min(index * 0.03, 0.16);
  const isLastCard = index === total - 1;
  const yInput = isLastCard
    ? [0, entryStart, entryEnd, 1]
    : [0, entryStart, entryEnd, exitStart, exitEnd];
  const yOutput = isLastCard
    ? [startY, startY, 0, 0]
    : [startY, startY, 0, 0, -900];
  const scaleInput = yInput;
  const scaleOutput = isLastCard
    ? [startScale, startScale, 1, 1]
    : [startScale, startScale, 1, 1, 0.96];

  const y = useTransform(
    scrollYProgress,
    yInput,
    yOutput,
  );
  const scale = useTransform(
    scrollYProgress,
    scaleInput,
    scaleOutput,
  );

  return {
    y,
    scale,
    zIndex: total - index,
    transformOrigin: "top center",
    boxShadow:
      "0 10px 20px -10px rgba(17,24,39,0.2), 0 28px 70px -28px rgba(17,24,39,0.28)",
  };
}

export default function SignalGrid() {
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
    const cardWidth = isMobile ? CARD_W_MOBILE : CARD_W;
    const resizeObserver = new ResizeObserver(([entry]) => {
      setCardScale(entry.contentRect.width / cardWidth);
    });
    resizeObserver.observe(el);
    return () => resizeObserver.disconnect();
  }, [isMobile]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const cardStyles = [
    useStackedCardMotion(scrollYProgress, 0, SIGNAL_CARDS.length),
    useStackedCardMotion(scrollYProgress, 1, SIGNAL_CARDS.length),
    useStackedCardMotion(scrollYProgress, 2, SIGNAL_CARDS.length),
    useStackedCardMotion(scrollYProgress, 3, SIGNAL_CARDS.length),
    useStackedCardMotion(scrollYProgress, 4, SIGNAL_CARDS.length),
    useStackedCardMotion(scrollYProgress, 5, SIGNAL_CARDS.length),
    useStackedCardMotion(scrollYProgress, 6, SIGNAL_CARDS.length),
  ];

  const payoffOpacity = useTransform(scrollYProgress, [0.82, 0.96], [0, 1]);
  const payoffY = useTransform(scrollYProgress, [0.82, 0.96], [28, 0]);

  return (
    <section
      ref={sectionRef}
      id="signals"
      className="relative"
      style={{ minHeight: "620vh", background: "#F8FAF9" }}
    >
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
          padding: "24px",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 58% 48% at 18% 42%, rgba(22,133,91,0.06) 0%, transparent 70%), " +
              "radial-gradient(ellipse 50% 42% at 84% 22%, rgba(217,119,6,0.045) 0%, transparent 72%), " +
              "radial-gradient(circle at 1px 1px, rgba(22,133,91,0.045) 1px, transparent 0)",
            backgroundSize: "auto, auto, 32px 32px",
          }}
        />

        <div
          style={{
            textAlign: "center",
            zIndex: 1,
            pointerEvents: "none",
            paddingInline: "8px",
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
              marginBottom: "14px",
            }}
          >
            Early Signals
          </p>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(31px, 4.4vw, 52px)",
              fontWeight: 400,
              lineHeight: 1.12,
              color: "#111827",
              maxWidth: "680px",
              margin: "0 auto 16px",
              letterSpacing: "0",
            }}
          >
            The problems you&apos;d rather catch on a Tuesday than at an exit interview
          </h2>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "clamp(14px, 1.45vw, 17px)",
              color: "#6B7280",
              lineHeight: 1.62,
              maxWidth: "520px",
              margin: "0 auto",
            }}
          >
            Workenvo watches for the patterns that precede the problems, and
            surfaces them while you can still do something.
          </p>
        </div>

        <div
          ref={cardStackRef}
          style={{
            position: "relative",
            width: isMobile
              ? "min(390px, calc(100vw - 24px))"
              : "min(780px, calc(100vw - 40px))",
            aspectRatio: isMobile
              ? `${CARD_W_MOBILE} / ${CARD_H_MOBILE}`
              : `${CARD_W} / ${CARD_H}`,
            zIndex: 20,
          }}
        >
          {SIGNAL_CARDS.map((card, i) => (
            <SignalProblemCard
              key={card.label}
              card={card}
              scale={cardScale}
              cardW={isMobile ? CARD_W_MOBILE : CARD_W}
              cardH={isMobile ? CARD_H_MOBILE : CARD_H}
              mobile={isMobile}
              style={cardStyles[i]}
            />
          ))}
        </div>

        <motion.div
          style={{
            opacity: payoffOpacity,
            y: payoffY,
            position: "absolute",
            bottom: "clamp(28px, 5vh, 54px)",
            left: 0,
            right: 0,
            zIndex: 10,
            textAlign: "center",
            paddingInline: "24px",
            pointerEvents: "none",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(27px, 3.7vw, 46px)",
              fontWeight: 400,
              lineHeight: 1.2,
              color: "#111827",
              marginBottom: "8px",
            }}
          >
            Every one of these used to surface{" "}
            <span style={{ color: "#9F5A16", fontStyle: "italic" }}>too late.</span>
          </p>
          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(27px, 3.7vw, 46px)",
              fontWeight: 400,
              lineHeight: 1.2,
              color: "#16855B",
            }}
          >
            Now it surfaces today.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
