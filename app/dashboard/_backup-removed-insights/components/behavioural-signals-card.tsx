"use client";

import { useState } from "react";
import DashboardIcon from "./dashboard-icon";
import styles from "../dashboard.module.css";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Severity = "Low" | "Material" | "Critical";
export type Confidence = "Validated" | "Corroborated" | "Indicative";
export type LifecycleStep = "Open" | "Actioned" | "Resolved";

export type RichSignal = {
  id: string;
  title: string;
  description: string;
  why?: string;
  icon: string;
  iconWrapClass: string;
  badge: string;
  badgeClass: string;
  // Metadata
  severity: Severity;
  confidence: Confidence;
  team: string;
  period: string;
  // Inline sparkline (8 points)
  trendData: number[];
  trendLabel: string;
  trendUp: boolean | null; // true = up/good, false = down/bad, null = neutral
  // Drawer — detail
  triggers: string[];
  chartData: number[];   // 8–12 weeks for drawer chart
  chartLabels: string[]; // must match chartData length
  contributingFactors: string[];
  suggestedAction: string;
  actionCta: string;
  lifecycleStep: LifecycleStep;
  openedAt: string;
};

// ─── Colour maps ──────────────────────────────────────────────────────────────

const SEVERITY_STYLE: Record<Severity, string> = {
  Low:      "bg-[#006841]/10 text-[#006841]",
  Material: "bg-[#E6A817]/15 text-[#B07E10]",
  Critical: "bg-[#DC3545]/10 text-[#DC3545]",
};

// ─── Shared mini SVG components ───────────────────────────────────────────────

function Pill({ children, className }: { children: React.ReactNode; className: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold leading-none ${className}`}>
      {children}
    </span>
  );
}

/** Tiny inline sparkline for card rows — 100 × 20 px */
function MiniSparkline({ data, up }: { data: number[]; up: boolean | null }) {
  const W = 100;
  const H = 20;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pts: [number, number][] = data.map((v, i) => [
    (i / (data.length - 1)) * W,
    H - ((v - min) / range) * (H - 3) - 1.5,
  ]);
  const d = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
  const color = up === true ? "#006841" : up === false ? "#DC3545" : "#E6A817";

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow: "visible", flexShrink: 0 }}>
      <path d={d} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Endpoint dot */}
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="2.5" fill={color} />
    </svg>
  );
}

/** Larger drawer chart — full width × 160 px with axis labels */
function DrawerChart({ data, labels, up }: { data: number[]; labels: string[]; up: boolean | null }) {
  const W = 400;
  const H = 160;
  const PADDING = { top: 12, right: 8, bottom: 28, left: 8 };
  const innerW = W - PADDING.left - PADDING.right;
  const innerH = H - PADDING.top - PADDING.bottom;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const pts: [number, number][] = data.map((v, i) => [
    PADDING.left + (i / (data.length - 1)) * innerW,
    PADDING.top + innerH - ((v - min) / range) * innerH,
  ]);

  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
  const area =
    line +
    ` L${pts[pts.length - 1][0].toFixed(1)} ${(PADDING.top + innerH).toFixed(1)} L${pts[0][0].toFixed(1)} ${(PADDING.top + innerH).toFixed(1)} Z`;

  const color = up === true ? "#006841" : up === false ? "#DC3545" : "#E6A817";
  const fillId = `dc-${up ?? "n"}`;

  // Show every other label if crowded
  const step = data.length > 8 ? 2 : 1;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.12" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${fillId})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p, i) => {
        if (i % step !== 0 && i !== data.length - 1) return null;
        return (
          <text
            key={i}
            x={p[0]}
            y={H - 6}
            textAnchor="middle"
            fontSize="9"
            fill="#9ca3af"
            fontFamily="Inter, sans-serif"
          >
            {labels[i]}
          </text>
        );
      })}
    </svg>
  );
}

// ─── Signal item (card row) ───────────────────────────────────────────────────

function SignalItem({ signal, onClick }: { signal: RichSignal; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-[1rem] bg-white p-5 text-left transition-all hover:shadow-md hover:-translate-y-0.5 active:scale-[0.99]"
      style={{ cursor: "pointer" }}
    >
      {/* Row 1: icon + title + pills + status badge */}
      <div className="flex flex-wrap items-center gap-2">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${signal.iconWrapClass}`}>
          <DashboardIcon name={signal.icon} className="text-[20px]" />
        </div>
        <p className="mr-1 font-bold text-[#1c1b1b] text-sm leading-tight">{signal.title}</p>
        <Pill className={SEVERITY_STYLE[signal.severity]}>{signal.severity}</Pill>
        <Pill className="border border-stone-300 text-stone-500">{signal.confidence}</Pill>
        <span className={`ml-auto rounded-full px-3 py-1 text-[10px] font-bold ${signal.badgeClass}`}>
          {signal.badge}
        </span>
      </div>

      {/* Row 2: description + team + period */}
      <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-0.5 pl-12">
        <p className="text-xs text-[#3e4941]">{signal.description}</p>
        <span className="text-[10px] font-semibold text-stone-400">
          {signal.team} · {signal.period}
        </span>
      </div>

      <div className="mt-2 flex items-start gap-2 pl-12">
        <span className="text-[11px] font-semibold text-[#6f7a73]">Why:</span>
        <p className="text-[12px] leading-relaxed text-[#3e4941]/80">
          {signal.why ?? signal.triggers[0]}
        </p>
      </div>

      {/* Row 3: sparkline + trend label */}
      <div className="mt-3 flex items-center gap-3 pl-12">
        <MiniSparkline data={signal.trendData} up={signal.trendUp} />
        <span
          className="text-[11px] font-semibold"
          style={{
            color:
              signal.trendUp === true
                ? "#006841"
                : signal.trendUp === false
                ? "#DC3545"
                : "#B07E10",
          }}
        >
          {signal.trendLabel}
        </span>
      </div>

      {/* Click affordance hint */}
      <p className="mt-2 pl-12 text-[10px] text-stone-300">Tap to view details →</p>
    </button>
  );
}

// ─── Lifecycle indicator ──────────────────────────────────────────────────────

function LifecycleBar({ step, openedAt }: { step: LifecycleStep; openedAt: string }) {
  const steps: LifecycleStep[] = ["Open", "Actioned", "Resolved"];
  const current = steps.indexOf(step);

  return (
    <div>
      <div className="flex items-center gap-0">
        {steps.map((s, i) => {
          const done = i <= current;
          const last = i === steps.length - 1;
          return (
            <div key={s} className="flex items-center">
              <div className="flex flex-col items-center gap-1">
                <div
                  className="flex h-6 w-6 items-center justify-center rounded-full border-2 text-[10px] font-bold transition-all"
                  style={
                    done
                      ? { background: "#1B4332", borderColor: "#1B4332", color: "white" }
                      : { background: "white", borderColor: "#D1D5DB", color: "#9CA3AF" }
                  }
                >
                  {done ? "✓" : i + 1}
                </div>
                <span className="text-[10px] font-semibold" style={{ color: done ? "#1B4332" : "#9CA3AF" }}>
                  {s}
                </span>
              </div>
              {!last && (
                <div
                  className="mb-4 h-0.5 w-16"
                  style={{ background: i < current ? "#1B4332" : "#E5E7EB" }}
                />
              )}
            </div>
          );
        })}
      </div>
      <p className="mt-2 text-[11px] text-stone-400">Opened by System · {openedAt}</p>
    </div>
  );
}

// ─── Detail drawer ────────────────────────────────────────────────────────────

function SignalDrawer({
  signal,
  onClose,
}: {
  signal: RichSignal;
  onClose: () => void;
}) {
  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/30"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 z-50 flex h-full w-full max-w-[480px] flex-col overflow-hidden bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-stone-100 px-6 py-5">
          <div className="space-y-1.5 pr-4">
            <h2 className="text-lg font-bold leading-snug text-[#1c1b1b]">{signal.title}</h2>
            <div className="flex flex-wrap items-center gap-1.5">
              <Pill className={SEVERITY_STYLE[signal.severity]}>{signal.severity}</Pill>
              <Pill className="border border-stone-300 text-stone-500">{signal.confidence}</Pill>
              <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${signal.badgeClass}`}>
                {signal.badge}
              </span>
            </div>
            <p className="text-[11px] text-stone-400">
              {signal.team} · {signal.period}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-stone-400 hover:bg-stone-100 hover:text-stone-600 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-7">

          {/* What triggered this */}
          <section>
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#2D2D2D]/50">
              What triggered this
            </p>
            <div className="rounded-[1rem] bg-[#f6f3f2] p-4 space-y-2.5">
              {signal.triggers.map((t, i) => (
                <div key={i} className="flex gap-2.5">
                  <span className="mt-0.5 shrink-0 text-[#006841]">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="12" cy="12" r="4" />
                    </svg>
                  </span>
                  <p className="text-sm leading-relaxed text-[#1c1b1b]">{t}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Trend chart */}
          <section>
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#2D2D2D]/50">
              Trend — last {signal.chartData.length} weeks
            </p>
            <div className="rounded-[1rem] bg-[#f6f3f2] px-4 py-4">
              <div className="h-[160px]">
                <DrawerChart
                  data={signal.chartData}
                  labels={signal.chartLabels}
                  up={signal.trendUp}
                />
              </div>
              <p
                className="mt-1 text-center text-xs font-semibold"
                style={{
                  color:
                    signal.trendUp === true
                      ? "#006841"
                      : signal.trendUp === false
                      ? "#DC3545"
                      : "#B07E10",
                }}
              >
                {signal.trendLabel}
              </p>
            </div>
          </section>

          {/* Contributing factors */}
          <section>
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#2D2D2D]/50">
              Contributing factors
            </p>
            <div className="flex flex-wrap gap-2">
              {signal.contributingFactors.map((f) => (
                <span
                  key={f}
                  className="rounded-full border border-[#2D2D2D]/15 px-3 py-1.5 text-xs font-semibold text-[#3e4941]"
                >
                  {f}
                </span>
              ))}
            </div>
          </section>

          {/* Suggested action */}
          <section>
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#2D2D2D]/50">
              Suggested action
            </p>
            <div className="rounded-[1rem] bg-[#006841]/8 p-4 space-y-3" style={{ background: "rgba(0,104,65,0.06)" }}>
              <div className="flex items-start gap-2.5">
                <DashboardIcon name="auto_awesome" className="mt-0.5 shrink-0 text-[18px] text-[#006841]" />
                <p className="text-sm leading-relaxed text-[#1c1b1b]">{signal.suggestedAction}</p>
              </div>
              <button
                className={`w-full rounded-full bg-[#1B4332] py-2.5 text-sm font-semibold text-white transition-all hover:scale-[1.02] ${styles.ambientShadow}`}
              >
                {signal.actionCta}
              </button>
            </div>
          </section>

          {/* Signal lifecycle */}
          <section>
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#2D2D2D]/50">
              Signal lifecycle
            </p>
            <LifecycleBar step={signal.lifecycleStep} openedAt={signal.openedAt} />
          </section>

          <div className="h-2" />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-stone-100 px-6 py-4">
          <button className="text-sm font-semibold text-stone-400 transition-colors hover:text-stone-600">
            Dismiss
          </button>
          <div className="flex gap-3">
            <button className="rounded-full border border-[#1B4332]/30 px-5 py-2.5 text-sm font-semibold text-[#1B4332] transition-all hover:bg-[#1B4332]/5">
              Mark as Actioned
            </button>
            <button
              className={`rounded-full bg-[#1B4332] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:scale-105 ${styles.ambientShadow}`}
            >
              Resolve Signal
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Main exported component ──────────────────────────────────────────────────

type BehaviouralSignalsCardProps = {
  title: string;
  signals: RichSignal[];
};

export default function BehaviouralSignalsCard({
  title,
  signals,
}: BehaviouralSignalsCardProps) {
  const [activeSignal, setActiveSignal] = useState<RichSignal | null>(null);

  return (
    <>
      <div className={`space-y-4 rounded-[1.5rem] bg-[#f6f3f2] p-6 md:col-span-7 ${styles.ambientShadow}`}>
        <h2 className="text-xl font-bold tracking-tight text-[#1c1b1b]">{title}</h2>

        <div className="space-y-3">
          {signals.map((signal) => (
            <SignalItem
              key={signal.id}
              signal={signal}
              onClick={() => setActiveSignal(signal)}
            />
          ))}
        </div>
      </div>

      {activeSignal && (
        <div
          className="fixed inset-0 z-40"
          style={{
            animation: "fadeIn 0.2s ease-out",
          }}
        >
          <SignalDrawer
            signal={activeSignal}
            onClose={() => setActiveSignal(null)}
          />
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .fixed.right-0.top-0.z-50 {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
