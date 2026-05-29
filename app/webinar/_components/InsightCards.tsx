"use client";

import { useEffect, useState } from "react";

function Spark({ values, color }: { values: number[]; color: string }) {
  const W = 52, H = 18;
  const mn = Math.min(...values), mx = Math.max(...values);
  const rng = mx - mn || 1;
  const pts = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * W;
      const y = H - ((v - mn) / rng) * (H - 2) - 1;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type CardDef = {
  id: string;
  title: string;
  value: string;
  sub: string;
  spark?: number[];
  sparkColor?: string;
  statusLabel: string;
  statusColor: string;
  style: React.CSSProperties;
  delay: number;
  floatDuration: string;
  floatDelay: string;
};

const cards: CardDef[] = [
  {
    id: "engagement",
    title: "Engagement Index",
    value: "−14%",
    sub: "vs. last quarter",
    spark: [82, 78, 74, 70, 65, 59, 54, 50],
    sparkColor: "#D97706",
    statusLabel: "Declining",
    statusColor: "#D97706",
    style: { top: "16%", left: "2%" },
    delay: 900,
    floatDuration: "7s",
    floatDelay: "0s",
  },
  {
    id: "burnout",
    title: "Burnout Risk",
    value: "Elevated",
    sub: "2 teams flagged",
    statusLabel: "High",
    statusColor: "#EF4444",
    style: { top: "38%", right: "2%" },
    delay: 1200,
    floatDuration: "8.5s",
    floatDelay: "-2s",
  },
  {
    id: "disengagers",
    title: "Silent Disengagers",
    value: "4 identified",
    sub: "this month",
    spark: [18, 22, 26, 31, 36, 40, 44, 47],
    sparkColor: "#EF4444",
    statusLabel: "Rising",
    statusColor: "#EF4444",
    style: { bottom: "24%", left: "2%" },
    delay: 1600,
    floatDuration: "6.5s",
    floatDelay: "-1s",
  },
  {
    id: "signals",
    title: "AI Signals",
    value: "12 new",
    sub: "detected this week",
    statusLabel: "Active",
    statusColor: "#16855B",
    style: { bottom: "20%", right: "2%" },
    delay: 2000,
    floatDuration: "9s",
    floatDelay: "-3.5s",
  },
];

export function InsightCards() {
  const [visible, setVisible] = useState<Set<string>>(new Set());

  useEffect(() => {
    const timers = cards.map(({ id, delay }) =>
      setTimeout(() => setVisible((v) => new Set([...v, id])), delay)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <>
      {cards.map((card) => {
        const show = visible.has(card.id);
        return (
          <div
            key={card.id}
            className="absolute hidden xl:flex flex-col gap-2.5 p-4 rounded-2xl border border-webinar-wire/70 bg-white/85 backdrop-blur-[6px] shadow-[0_2px_16px_rgba(0,0,0,0.06)] min-w-[170px] max-w-[200px]"
            style={{
              ...card.style,
              zIndex: 3,
              opacity: show ? 1 : 0,
              transform: show ? "translateY(0px)" : "translateY(12px)",
              transition: "opacity 0.8s ease, transform 0.8s ease",
              animation: show
                ? `webinar-float ${card.floatDuration} ease-in-out ${card.floatDelay} infinite`
                : "none",
            }}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-[9px] font-semibold tracking-[0.14em] uppercase text-webinar-ink-faint leading-tight">
                {card.title}
              </span>
              <span
                className="shrink-0 text-[8px] font-bold tracking-[0.1em] uppercase rounded-full px-2 py-0.5"
                style={{
                  color: card.statusColor,
                  backgroundColor: `${card.statusColor}18`,
                }}
              >
                {card.statusLabel}
              </span>
            </div>
            <div className="flex items-end justify-between gap-3">
              <div>
                <div
                  className="font-webinar-heading font-semibold text-webinar-ink"
                  style={{ fontSize: "1.05rem", lineHeight: 1.15 }}
                >
                  {card.value}
                </div>
                <div className="text-[10px] text-webinar-ink-faint mt-0.5 leading-tight">
                  {card.sub}
                </div>
              </div>
              {card.spark && card.sparkColor && (
                <Spark values={card.spark} color={card.sparkColor} />
              )}
            </div>
          </div>
        );
      })}
    </>
  );
}
