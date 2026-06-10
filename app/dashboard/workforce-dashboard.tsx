"use client";

import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Check,
  Flame,
  Sparkles,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { CSSProperties, useEffect, useRef, useState } from "react";
import { Gauge } from "@/components/ui/gauge";
import styles from "./workforce-dashboard.module.css";

type Tone = "high" | "mid" | "low";
type Severity = "hot" | "warm" | "cool";

type Risk = {
  rank: string;
  title: string;
  why: string;
  sev: Severity;
  spark: number[];
  dir: "up" | "down";
};

type Signal = {
  id?: number;
  title: string;
  meta: string;
  sev: Severity;
  bornSec?: number;
  time?: string;
};

type ActionItem = {
  title: string;
  meta: string;
  impact: string;
  done: boolean;
};

type Data = {
  healthScore: number;
  healthDelta: number;
  pillars: { name: string; val: number; tone: Tone }[];
  healthTrend: number[];
  topRisks: Risk[];
  attrition: {
    high: number;
    moderate: number;
    stable: number;
    mostAffected: string;
  };
  heatTeams: { team: string; row: number[]; level: "High" | "Medium" | "Low" }[];
  managers: { name: string; team: string; effect: number; delta: number }[];
  engagement: {
    months: string[];
    company: number[];
    team: number[];
    benchmark: number[];
  };
  leaderboard: { team: string; score: number; trend: "up" | "down" | "flat" }[];
  signalPool: Signal[];
  actions: ActionItem[];
  forecast: {
    actual: number[];
    projected: number[];
    bandHi: number[];
    bandLo: number[];
    stats: { label: string; value: string; tone: Severity }[];
  };
};

const D: Data = {
  healthScore: 82,
  healthDelta: 6,
  pillars: [
    { name: "Engagement", val: 84, tone: "high" },
    { name: "Burnout", val: 72, tone: "mid" },
    { name: "Manager quality", val: 88, tone: "high" },
    { name: "Retention", val: 79, tone: "high" },
    { name: "Survey signal", val: 69, tone: "mid" },
  ],
  healthTrend: [66, 69, 71, 70, 73, 75, 74, 77, 79, 80, 81, 82],
  topRisks: [
    {
      rank: "01",
      title: "Support burnout rising",
      why: "Late-week load and after-hours pings are compounding.",
      sev: "hot",
      spark: [28, 31, 30, 36, 40, 43, 49, 54],
      dir: "up",
    },
    {
      rank: "02",
      title: "Product attrition cluster",
      why: "High performers show lower belonging and manager trust.",
      sev: "hot",
      spark: [18, 22, 24, 23, 28, 34, 36, 39],
      dir: "up",
    },
    {
      rank: "03",
      title: "Engineering meeting load",
      why: "Focus blocks dropped 14 percent across two squads.",
      sev: "warm",
      spark: [44, 42, 43, 45, 47, 46, 51, 50],
      dir: "up",
    },
  ],
  attrition: {
    high: 18,
    moderate: 34,
    stable: 126,
    mostAffected: "Product",
  },
  heatTeams: [
    { team: "Support", row: [0.39, 0.48, 0.56, 0.62, 0.68, 0.73, 0.82, 0.9], level: "High" },
    { team: "Product", row: [0.32, 0.36, 0.43, 0.51, 0.57, 0.64, 0.7, 0.76], level: "High" },
    { team: "Sales", row: [0.2, 0.22, 0.3, 0.37, 0.4, 0.45, 0.44, 0.48], level: "Medium" },
    { team: "Engineering", row: [0.26, 0.28, 0.31, 0.4, 0.44, 0.5, 0.49, 0.52], level: "Medium" },
    { team: "People", row: [0.14, 0.18, 0.2, 0.19, 0.23, 0.25, 0.24, 0.22], level: "Low" },
    { team: "Finance", row: [0.18, 0.2, 0.21, 0.25, 0.24, 0.27, 0.29, 0.31], level: "Low" },
  ],
  managers: [
    { name: "Maya Iyer", team: "Product", effect: 15, delta: 7 },
    { name: "Daniel Cho", team: "Sales", effect: 11, delta: 5 },
    { name: "Avery Stone", team: "People", effect: 9, delta: 3 },
    { name: "Noah Kim", team: "Engineering", effect: -6, delta: -2 },
    { name: "Rhea Kapoor", team: "Support", effect: -13, delta: -6 },
  ],
  engagement: {
    months: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    company: [68, 69, 70, 71, 70, 72, 73, 74, 75, 76, 76, 77],
    team: [64, 66, 67, 69, 68, 70, 73, 74, 76, 78, 79, 82],
    benchmark: [66, 66, 67, 67, 68, 68, 69, 69, 70, 70, 70, 71],
  },
  leaderboard: [
    { team: "People Ops", score: 91, trend: "up" },
    { team: "Design", score: 87, trend: "up" },
    { team: "Engineering", score: 81, trend: "flat" },
    { team: "Sales", score: 76, trend: "up" },
    { team: "Product", score: 69, trend: "down" },
    { team: "Support", score: 63, trend: "down" },
  ],
  signalPool: [
    { title: "Pulse response spike", meta: "People Ops, +18 responses in 20 min", sev: "cool" },
    { title: "Burnout language detected", meta: "Support comments mention weekend load", sev: "hot" },
    { title: "Manager trust improved", meta: "Design weekly confidence +9 pts", sev: "cool" },
    { title: "Attrition model moved", meta: "Product risk cohort crossed threshold", sev: "hot" },
    { title: "Meeting density alert", meta: "Engineering focus blocks below target", sev: "warm" },
    { title: "Recognition momentum", meta: "Sales peer praise doubled this week", sev: "cool" },
    { title: "Sentiment drift", meta: "Finance comments trending neutral", sev: "warm" },
    { title: "Recovery pattern", meta: "Support PTO planning opened by HRBP", sev: "cool" },
    { title: "Manager nudge queued", meta: "Rhea Kapoor, 3:1 backlog detected", sev: "warm" },
    { title: "Survey anomaly", meta: "Product belonging score down 7 pts", sev: "hot" },
  ],
  actions: [
    {
      title: "Open Support recovery sprint",
      meta: "Reduce weekend coverage and add manager check-ins.",
      impact: "+8 health",
      done: false,
    },
    {
      title: "Schedule Product stay interviews",
      meta: "Prioritize high-performing flight-risk cohort.",
      impact: "-12 risk",
      done: false,
    },
    {
      title: "Protect Engineering focus blocks",
      meta: "Move recurring meetings from Tuesday and Thursday.",
      impact: "+5 focus",
      done: true,
    },
    {
      title: "Amplify Design manager rituals",
      meta: "Copy the 1:1 cadence into Sales pods.",
      impact: "+4 trust",
      done: false,
    },
  ],
  forecast: {
    actual: [82, 81, 80, 79, 78, 77],
    projected: [77, 75, 73, 70, 68],
    bandHi: [79, 78, 77, 75, 73],
    bandLo: [75, 72, 69, 65, 62],
    stats: [
      { label: "Attrition risk", value: "+11%", tone: "hot" },
      { label: "Burnout load", value: "+18%", tone: "hot" },
      { label: "Engagement", value: "-7 pts", tone: "warm" },
    ],
  },
};

const SEV: Record<Severity, { chip: string; rail: string; color: string; bg: string; label: string }> = {
  hot: {
    chip: styles.chipHot,
    rail: styles.riskRailHot,
    color: "var(--hot)",
    bg: "var(--hot-bg)",
    label: "High",
  },
  warm: {
    chip: styles.chipWarm,
    rail: styles.riskRailWarm,
    color: "var(--warm)",
    bg: "var(--warm-bg)",
    label: "Watch",
  },
  cool: {
    chip: styles.chipCool,
    rail: "",
    color: "var(--f-700)",
    bg: "var(--f-100)",
    label: "Good",
  },
};

function lerpColor(a: string, b: string, t: number) {
  const ah = a.match(/\w\w/g)?.map((x) => parseInt(x, 16)) ?? [0, 0, 0];
  const bh = b.match(/\w\w/g)?.map((x) => parseInt(x, 16)) ?? [0, 0, 0];
  const r = ah.map((v, i) => Math.round(v + (bh[i] - v) * t));
  return `rgb(${r[0]},${r[1]},${r[2]})`;
}

function heatColor(v: number) {
  const stops: [number, string][] = [
    [0, "E7F1EA"],
    [0.32, "A9D2B7"],
    [0.5, "E2C77A"],
    [0.7, "D89058"],
    [1, "B6452F"],
  ];
  for (let i = 0; i < stops.length - 1; i += 1) {
    const [s0, c0] = stops[i];
    const [s1, c1] = stops[i + 1];
    if (v <= s1) return lerpColor(c0, c1, (v - s0) / (s1 - s0));
  }
  return `#${stops[stops.length - 1][1]}`;
}

function fp(n: number) {
  return Number(n.toFixed(4));
}

function smooth(pts: number[][], k = 0.18) {
  if (pts.length < 2) return "";
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i += 1) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    const c1x = p1[0] + (p2[0] - p0[0]) * k;
    const c1y = p1[1] + (p2[1] - p0[1]) * k;
    const c2x = p2[0] - (p3[0] - p1[0]) * k;
    const c2y = p2[1] - (p3[1] - p1[1]) * k;
    d += ` C ${c1x} ${c1y} ${c2x} ${c2y} ${p2[0]} ${p2[1]}`;
  }
  return d;
}

function scaleLin(v: number, dmin: number, dmax: number, rmin: number, rmax: number) {
  if (dmax === dmin) return fp((rmin + rmax) / 2);
  return fp(rmin + ((v - dmin) / (dmax - dmin)) * (rmax - rmin));
}

function GaugeIcon({ name, size = 14, stroke = 2.2 }: { name: string; size?: number; stroke?: number }) {
  const props = { size, strokeWidth: stroke, "aria-hidden": true };
  if (name === "trendUp") return <TrendingUp {...props} />;
  if (name === "trendDown") return <TrendingDown {...props} />;
  if (name === "warning") return <AlertTriangle {...props} />;
  if (name === "flame") return <Flame {...props} />;
  if (name === "check") return <Check {...props} />;
  if (name === "sparkles") return <Sparkles {...props} />;
  if (name === "arrow") return <ArrowRight {...props} />;
  return <Activity {...props} />;
}

export default function WorkforceDashboard() {
  const seed = D.signalPool.slice(0, 6).map((s, i) => ({ ...s, id: i, bornSec: -(i * 47 + 8) }));
  const [signals, setSignals] = useState(seed);
  const [sec, setSec] = useState(0);
  const idRef = useRef(seed.length);
  const poolRef = useRef(6);

  useEffect(() => {
    const iv = window.setInterval(() => {
      setSec((s) => {
        const ns = s + 1;
        if (ns % 6 === 0) {
          const next = D.signalPool[poolRef.current % D.signalPool.length];
          poolRef.current += 1;
          setSignals((prev) => [{ ...next, id: idRef.current++, bornSec: ns }, ...prev].slice(0, 8));
        }
        return ns;
      });
    }, 1000);
    return () => window.clearInterval(iv);
  }, []);

  const fmt = (age: number) => {
    if (age < 5) return "now";
    if (age < 60) return `${age}s ago`;
    return `${Math.floor(age / 60)}m ago`;
  };

  const feed = signals.map((s) => ({ ...s, time: fmt(sec - (s.bornSec ?? 0)) }));

  const [actions, setActions] = useState(D.actions);
  const toggle = (i: number) => {
    setActions((a) => a.map((x, j) => (j === i ? { ...x, done: !x.done } : x)));
  };

  return (
    <section className={styles.dashboard}>
      <TopBar />
      <div className={styles.grid}>
        <HealthScore d={D} />
        <TopRisks d={D} />
        <AttritionRisk d={D} />
        <BurnoutHeatmap d={D} />
        <ManagerEffectiveness d={D} />
        <EngagementTrend d={D} />
        <Leaderboard d={D} />
        <SignalFeed signals={feed} />
        <RecommendedActions actions={actions} onToggle={toggle} />
        <WorkforceForecast d={D} />
      </div>
    </section>
  );
}

function TopBar() {
  return (
    <header className={styles.topbar}>
      <div>
        <div className={styles.eyebrow}>Organisation-wide insights</div>
        <h1>Workforce command center</h1>
        <p>Live people health, retention risk, manager effect, and recommended actions.</p>
      </div>
      <div className={styles.topbarActions}>
        <button className={styles.secondaryButton} type="button">Export</button>
        <button className={styles.primaryButton} type="button">Generate AI view</button>
      </div>
    </header>
  );
}

function HealthScore({ d }: { d: Data }) {
  const toneColor: Record<Tone, string> = { high: "var(--f-700)", mid: "var(--warm)", low: "var(--hot)" };
  return (
    <div className={`${styles.card} ${styles.col7} ${styles.scoreCard}`}>
      <div className={styles.cardHead}>
        <div>
          <div className={styles.cardKicker}>Workforce Health</div>
          <h2 className={styles.cardTitle}>The company&apos;s health, in one number</h2>
          <p className={styles.cardNote}>Engagement, burnout, manager quality, retention and survey signal, composited live.</p>
        </div>
        <span className={styles.live}><span className={styles.beacon}><i /></span> Live</span>
      </div>

      <div className={styles.scoreBody}>
        <div className={styles.gaugeWrap}>
          <Gauge value={d.healthScore} max={100} size={216} strokeWidth={9} showValue={false} primary="success" />
          <div className={styles.gaugeCenter}>
            <div className={styles.gaugeMain}>
              <div className={styles.gaugeValue}>{d.healthScore}</div>
              <div className={styles.gaugeOutOf}>/ 100</div>
            </div>
            <div><span className={`${styles.delta} ${styles.deltaUp}`}><GaugeIcon name="trendUp" size={12} /> +{d.healthDelta} pts</span></div>
          </div>
        </div>

        <div className={styles.pillars}>
          {d.pillars.map((p, i) => (
            <div className={styles.pillar} key={p.name}>
              <div className={styles.pillarName}>{p.name}</div>
              <div className={styles.pillarTrack}>
                <div
                  className={styles.pillarFill}
                  style={{
                    width: `${p.val}%`,
                    background: toneColor[p.tone],
                    animationDelay: `${i * 0.06}s`,
                  }}
                />
              </div>
              <div className={styles.pillarVal}>{p.val}</div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.divider} />
      <div className={`${styles.flex} ${styles.between} ${styles.center}`} style={{ marginBottom: 10 }}>
        <span className={styles.metricMono}>12-MONTH TREND</span>
        <span className={styles.metricMono}>PEAK - {d.healthScore}</span>
      </div>
      <ArchBars data={d.healthTrend} height={132} highlight={3} />
    </div>
  );
}

function TopRisks({ d }: { d: Data }) {
  return (
    <div className={`${styles.card} ${styles.col5}`}>
      <div className={styles.cardHead}>
        <div>
          <div className={styles.cardKicker} style={{ color: "var(--hot)" }}>Requires attention</div>
          <h2 className={styles.cardTitle}>Top risks right now</h2>
        </div>
        <span className={`${styles.chip} ${styles.chipHot}`}>3 active</span>
      </div>
      <div className={styles.riskList}>
        {d.topRisks.map((r) => {
          const s = SEV[r.sev];
          return (
            <div className={styles.risk} key={r.rank}>
              <div className={`${styles.rail} ${s.rail}`} />
              <div className={styles.riskRank}>{r.rank}</div>
              <div>
                <div className={styles.riskTitle}>{r.title}</div>
                <div className={styles.riskWhy}>{r.why}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <Sparkline data={r.spark} color={s.color} fill />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AttritionRisk({ d }: { d: Data }) {
  const a = d.attrition;
  return (
    <div className={`${styles.card} ${styles.col4}`}>
      <div className={styles.cardHead}>
        <div>
          <div className={styles.cardKicker}>Flight risk</div>
          <h2 className={styles.cardTitle}>Attrition risk</h2>
        </div>
        <span className={`${styles.chip} ${styles.chipGhost}`}>{a.high + a.moderate + a.stable} people</span>
      </div>
      <div className={styles.attrBody}>
        <div className={styles.attrTiers}>
          <div className={styles.attrTier} style={{ borderColor: "#E8C9BE" }}>
            <div className={styles.tierNumber} style={{ color: "var(--hot)" }}>{a.high}</div>
            <div className={styles.tierLabel}>High risk</div>
          </div>
          <div className={styles.attrTier} style={{ borderColor: "#ECD8B0" }}>
            <div className={styles.tierNumber} style={{ color: "var(--warm)" }}>{a.moderate}</div>
            <div className={styles.tierLabel}>Moderate</div>
          </div>
          <div className={styles.attrTier}>
            <div className={styles.tierNumber} style={{ color: "var(--ink-soft)" }}>{a.stable}</div>
            <div className={styles.tierLabel}>Stable</div>
          </div>
        </div>
        <DotCluster high={a.high} moderate={a.moderate} stable={a.stable} cols={24} />
        <div className={`${styles.flex} ${styles.between} ${styles.center} ${styles.mtAuto}`}>
          <div className={styles.legend}>
            <span className={styles.legendItem}><span className={styles.dot} style={{ background: "var(--hot)" }} />High</span>
            <span className={styles.legendItem}><span className={styles.dot} style={{ background: "var(--warm-2)" }} />Moderate</span>
            <span className={styles.legendItem}><span className={styles.dot} style={{ background: "var(--f-200)" }} />Stable</span>
          </div>
          <span className={styles.metricMono} style={{ color: "var(--hot)" }}>UP {a.mostAffected}</span>
        </div>
      </div>
    </div>
  );
}

function BurnoutHeatmap({ d }: { d: Data }) {
  const weeks = d.heatTeams[0].row.length;
  return (
    <div className={`${styles.card} ${styles.col4}`}>
      <div className={styles.cardHead}>
        <div>
          <div className={styles.cardKicker}>Where it&apos;s building</div>
          <h2 className={styles.cardTitle}>Burnout heatmap</h2>
        </div>
        <span className={styles.live}><span className={styles.beacon}><i /></span> 8 wks</span>
      </div>
      <div className={styles.heatRows}>
        {d.heatTeams.map((t) => {
          const sev = t.level === "High" ? styles.chipHot : t.level === "Medium" ? styles.chipWarm : styles.chipCool;
          return (
            <div className={styles.heatRow} key={t.team}>
              <div className={styles.heatRowLabel}>{t.team}</div>
              <div className={styles.heatGrid} style={{ gridTemplateColumns: `repeat(${weeks}, 1fr)` }}>
                {t.row.map((v, j) => (
                  <div key={`${t.team}-${j}`} className={styles.heatCell} title={`${t.team} - wk ${j + 1}`} style={{ background: heatColor(v) }} />
                ))}
              </div>
              <span className={`${styles.chip} ${sev}`} style={{ fontSize: 9 }}>{t.level}</span>
            </div>
          );
        })}
      </div>
      <div className={styles.divider} style={{ margin: "16px 0 10px" }} />
      <div className={`${styles.flex} ${styles.between} ${styles.center}`}>
        <span className={styles.metricMono}>LOW</span>
        <div className={styles.heatLegend} />
        <span className={styles.metricMono}>HIGH</span>
      </div>
    </div>
  );
}

function ManagerEffectiveness({ d }: { d: Data }) {
  const maxAbs = Math.max(...d.managers.map((m) => Math.abs(m.effect)));
  return (
    <div className={`${styles.card} ${styles.col4}`}>
      <div className={styles.cardHead}>
        <div>
          <div className={styles.cardKicker}>Who lifts, who drags</div>
          <h2 className={styles.cardTitle}>Manager effectiveness</h2>
        </div>
        <span className={`${styles.chip} ${styles.chipGhost}`}>Effect on perf.</span>
      </div>
      <div className={styles.managerList}>
        {d.managers.map((m, i) => {
          const pos = m.effect >= 0;
          const w = (Math.abs(m.effect) / maxAbs) * 50;
          return (
            <div className={styles.managerRow} key={m.name}>
              <div className={styles.managerName}>
                <span>{m.name}</span>
                <span className={styles.managerTeam}>{m.team}</span>
              </div>
              <div className={styles.managerTrack}>
                <div className={styles.managerZero} />
                <div
                  className={`${styles.managerBar} ${pos ? styles.managerBarPos : styles.managerBarNeg}`}
                  style={{
                    [pos ? "left" : "right"]: "50%",
                    width: `${w}%`,
                    animationDelay: `${i * 0.05}s`,
                  } as CSSProperties}
                />
              </div>
              <div className={styles.managerDelta} style={{ color: m.delta >= 0 ? "var(--f-700)" : "var(--hot)" }}>
                {m.delta >= 0 ? "+" : ""}{m.delta}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EngagementTrend({ d }: { d: Data }) {
  const e = d.engagement;
  const cur = e.team[e.team.length - 1];
  const prev = e.team[e.team.length - 2];
  return (
    <div className={`${styles.card} ${styles.col8}`}>
      <div className={styles.cardHead}>
        <div>
          <div className={styles.cardKicker}>Morale over time</div>
          <h2 className={styles.cardTitle}>Engagement trend</h2>
          <p className={styles.cardNote}>Last 12 months - your team vs company vs industry benchmark.</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <div className={styles.bigNum} style={{ fontSize: 38, color: "var(--f-800)" }}>{cur}</div>
          <span className={`${styles.delta} ${styles.deltaUp}`} style={{ justifyContent: "flex-end" }}>
            <GaugeIcon name="trendUp" size={13} /> +{cur - prev} vs last mo
          </span>
        </div>
      </div>
      <EngagementChart data={e} />
      <div className={styles.legend} style={{ marginTop: 14 }}>
        <span className={styles.legendItem}><span className={styles.legendLineTeam} />Your team</span>
        <span className={styles.legendItem}><span className={styles.legendLineCompany} />Company avg</span>
        <span className={styles.legendItem}><span className={styles.legendLineBenchmark} />Benchmark</span>
      </div>
    </div>
  );
}

function Leaderboard({ d }: { d: Data }) {
  const barColor = (s: number) => (s >= 85 ? "var(--f-700)" : s >= 75 ? "var(--f-500)" : s >= 68 ? "var(--warm)" : "var(--hot)");
  return (
    <div className={`${styles.card} ${styles.col4}`}>
      <div className={styles.cardHead}>
        <div>
          <div className={styles.cardKicker}>Thriving vs deteriorating</div>
          <h2 className={styles.cardTitle}>Team leaderboard</h2>
        </div>
      </div>
      <div className={styles.leaderboardList}>
        {d.leaderboard.map((t, i) => (
          <div className={styles.lbRow} key={t.team}>
            <div className={styles.lbRank}>{String(i + 1).padStart(2, "0")}</div>
            <div>
              <div className={styles.lbName}>{t.team}</div>
              <div className={styles.lbBarWrap}>
                <div className={styles.lbTrack}>
                  <div
                    className={styles.lbFill}
                    style={{
                      width: `${t.score}%`,
                      background: barColor(t.score),
                      animationDelay: `${i * 0.05}s`,
                    }}
                  />
                </div>
              </div>
            </div>
            <div className={styles.lbScoreWrap}>
              <GaugeIcon name={t.trend === "up" ? "trendUp" : t.trend === "down" ? "trendDown" : "arrow"} size={14} />
              <span className={styles.lbScore} style={{ color: barColor(t.score) }}>{t.score}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SignalFeed({ signals }: { signals: (Signal & { id: number; time: string })[] }) {
  return (
    <div className={`${styles.card} ${styles.col4} ${styles.feedCard}`}>
      <div className={styles.cardHead}>
        <div>
          <div className={styles.cardKicker}>Workforce operations</div>
          <h2 className={styles.cardTitle}>Live signal feed</h2>
        </div>
        <span className={styles.live}><span className={styles.beacon}><i /></span> Streaming</span>
      </div>
      <div className={styles.feedList}>
        {signals.map((s) => {
          const sv = SEV[s.sev];
          return (
            <div className={styles.signal} key={s.id}>
              <div className={styles.sigGlyph} style={{ background: sv.bg, color: sv.color }}>
                <GaugeIcon name={s.sev === "hot" ? "warning" : s.sev === "warm" ? "flame" : "check"} size={15} />
              </div>
              <div>
                <div className={styles.sigTop}>
                  <span className={styles.sigTitle}>{s.title}</span>
                  <span className={styles.sigTime}>{s.time}</span>
                </div>
                <div className={styles.sigMeta}>{s.meta}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RecommendedActions({ actions, onToggle }: { actions: ActionItem[]; onToggle: (index: number) => void }) {
  const doneCount = actions.filter((a) => a.done).length;
  return (
    <div className={`${styles.card} ${styles.col4}`}>
      <div className={styles.cardHead}>
        <div>
          <div className={styles.cardKicker}><GaugeIcon name="sparkles" size={12} /> AI - do next</div>
          <h2 className={styles.cardTitle}>Recommended actions</h2>
        </div>
        <span className={`${styles.chip} ${styles.chipCool}`}>{doneCount}/{actions.length} done</span>
      </div>
      <div className={styles.actionList}>
        {actions.map((a, i) => (
          <button className={`${styles.action} ${a.done ? styles.actionDone : ""}`} key={a.title} onClick={() => onToggle(i)} type="button">
            <span className={styles.actCheck}>{a.done && <GaugeIcon name="check" size={14} stroke={2.6} />}</span>
            <span>
              <span className={styles.actTitle}>{a.title}</span>
              <span className={styles.actMeta}>{a.meta}</span>
            </span>
            <span className={styles.actImpact}>{a.impact}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function WorkforceForecast({ d }: { d: Data }) {
  const toneColor: Record<Severity, string> = { hot: "var(--hot)", warm: "var(--warm)", cool: "var(--f-700)" };
  return (
    <div className={`${styles.card} ${styles.col4}`}>
      <div className={styles.cardHead}>
        <div>
          <div className={styles.cardKicker}>If nothing changes</div>
          <h2 className={styles.cardTitle}>90-day forecast</h2>
          <p className={styles.cardNote}>Projected from current trajectory.</p>
        </div>
        <span className={`${styles.chip} ${styles.chipHot}`}>Predicted</span>
      </div>
      <div className={styles.forecastCone}><ForecastCone fc={d.forecast} /></div>
      <div className={styles.forecastStats}>
        {d.forecast.stats.map((s) => (
          <div className={styles.forecastStat} key={s.label}>
            <span className={styles.forecastLabel}>{s.label}</span>
            <span className={styles.forecastValue} style={{ color: toneColor[s.tone] }}>{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}


function ArchBars({ data, width = 560, height = 150, highlight = 3 }: { data: number[]; width?: number; height?: number; highlight?: number }) {
  const n = data.length;
  const gap = 9;
  const bw = (width - gap * (n - 1)) / n;
  const min = Math.min(...data) - 6;
  const max = Math.max(...data) + 2;
  const colors = ["#D8EBDF", "#C7E0D0", "#BFDDC9", "#A9D2B7", "#8FC3A4", "#74B58F", "#5BA77E", "#449268", "#2A8055", "#1A6840", "#15583A", "#0F3A24"];
  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" style={{ display: "block", width: "100%", height }}>
      {data.map((v, i) => {
        const h = scaleLin(v, min, max, 24, height - 6);
        const x = i * (bw + gap);
        const y = height - h;
        const r = Math.min(bw / 2, h / 2);
        const isHot = i >= n - highlight;
        const col = isHot ? colors[Math.min(colors.length - 1, 8 + (i - (n - highlight)))] : colors[Math.floor(scaleLin(i, 0, n - 1, 0, 7))];
        const d = `M ${x} ${height} L ${x} ${y + r} A ${r} ${r} 0 0 1 ${x + r} ${y} L ${x + bw - r} ${y} A ${r} ${r} 0 0 1 ${x + bw} ${y + r} L ${x + bw} ${height} Z`;
        return <path key={i} d={d} fill={col} className={styles.fadeUp} style={{ animationDelay: `${i * 0.04}s` }} />;
      })}
    </svg>
  );
}

function Sparkline({ data, color = "var(--f-700)", width = 88, height = 36, fill = false }: { data: number[]; color?: string; width?: number; height?: number; fill?: boolean }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const pts = data.map((v, i) => [
    scaleLin(i, 0, data.length - 1, 2, width - 2),
    scaleLin(v, min, max, height - 4, 4),
  ]);
  const d = smooth(pts);
  const last = pts[pts.length - 1];
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: "block", overflow: "visible" }}>
      {fill && <path d={`${d} L ${last[0]} ${height} L ${pts[0][0]} ${height} Z`} fill={color} opacity="0.08" />}
      <path d={d} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={last[0]} cy={last[1]} r="3" fill={color} />
    </svg>
  );
}

function EngagementChart({ data, width = 760, height = 240 }: { data: Data["engagement"]; width?: number; height?: number }) {
  const { months, company, team, benchmark } = data;
  const all = [...company, ...team, ...benchmark];
  const min = Math.min(...all) - 4;
  const max = Math.max(...all) + 4;
  const padL = 8;
  const padR = 8;
  const padT = 14;
  const padB = 26;
  const X = (i: number) => scaleLin(i, 0, months.length - 1, padL, width - padR);
  const Y = (v: number) => scaleLin(v, min, max, height - padB, padT);
  const line = (s: number[]) => smooth(s.map((v, i) => [X(i), Y(v)]));
  const area = (s: number[]) => `${line(s)} L ${X(s.length - 1)} ${height - padB} L ${X(0)} ${height - padB} Z`;
  const lastTeam = [X(team.length - 1), Y(team[team.length - 1])];

  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`} style={{ display: "block", overflow: "visible" }}>
      <defs>
        <linearGradient id="engArea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--f-700)" stopOpacity="0.18" />
          <stop offset="1" stopColor="var(--f-700)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 0.25, 0.5, 0.75, 1].map((g) => {
        const y = padT + g * (height - padB - padT);
        return <line key={g} x1={padL} y1={y} x2={width - padR} y2={y} stroke="var(--line-soft)" strokeWidth="1" />;
      })}
      <path d={line(benchmark)} fill="none" stroke="var(--ink-ghost)" strokeWidth="1.6" strokeDasharray="2 5" strokeLinecap="round" />
      <path d={line(company)} fill="none" stroke="var(--f-300)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d={area(team)} fill="url(#engArea)" />
      <path d={line(team)} fill="none" stroke="var(--f-800)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={lastTeam[0]} cy={lastTeam[1]} r="5" fill="var(--f-800)" stroke="#fff" strokeWidth="2.5" />
      {months.map((m, i) => (
        <text key={m} x={X(i)} y={height - 6} textAnchor="middle" fontFamily="var(--mono)" fontSize="10" fill="var(--ink-faint)">
          {m}
        </text>
      ))}
    </svg>
  );
}

function DotCluster({ high, moderate, stable, cols = 24 }: { high: number; moderate: number; stable: number; cols?: number }) {
  const total = high + moderate + stable;
  const dots: string[] = [];
  for (let i = 0; i < total; i += 1) {
    let tier = "stable";
    if (i < high) tier = "high";
    else if (i < high + moderate) tier = "moderate";
    dots.push(tier);
  }
  const rows = Math.ceil(total / cols);
  const cell = 13;
  const r = 4.2;
  const width = cols * cell;
  const height = rows * cell;
  const color: Record<string, string> = { high: "var(--hot)", moderate: "var(--warm-2)", stable: "var(--f-200)" };
  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`} style={{ display: "block", maxHeight: 150 }}>
      {dots.map((tier, i) => {
        const cx = (i % cols) * cell + cell / 2;
        const cy = Math.floor(i / cols) * cell + cell / 2;
        return <circle key={`${tier}-${i}`} cx={cx} cy={cy} r={r} fill={color[tier]} className={tier === "high" ? styles.dotPulse : undefined} style={{ animationDelay: `${(i % 5) * 0.18}s` }} />;
      })}
    </svg>
  );
}

function ForecastCone({ fc, width = 320, height = 130 }: { fc: Data["forecast"]; width?: number; height?: number }) {
  const actual = fc.actual;
  const proj = fc.projected;
  const hi = fc.bandHi;
  const lo = fc.bandLo;
  const totalLen = actual.length + proj.length - 1;
  const all = [...actual, ...proj, ...hi, ...lo];
  const min = Math.min(...all) - 3;
  const max = Math.max(...all) + 3;
  const padT = 10;
  const padB = 16;
  const X = (i: number) => scaleLin(i, 0, totalLen - 1, 4, width - 4);
  const Y = (v: number) => scaleLin(v, min, max, height - padB, padT);
  const aPts = actual.map((v, i) => [X(i), Y(v)]);
  const base = actual.length - 1;
  const pPts = proj.map((v, i) => [X(base + i), Y(v)]);
  const hiPts = hi.map((v, i) => [X(base + i), Y(v)]);
  const loPts = lo.map((v, i) => [X(base + i), Y(v)]);
  const band = `${smooth(hiPts)} L ${loPts.map((p) => p.join(" ")).reverse().join(" L ")} Z`;
  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" style={{ display: "block", width: "100%", height: "100%" }}>
      <defs>
        <linearGradient id="coneBand" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="var(--hot)" stopOpacity="0.04" />
          <stop offset="1" stopColor="var(--hot)" stopOpacity="0.16" />
        </linearGradient>
      </defs>
      <line x1={X(base)} y1={padT - 2} x2={X(base)} y2={height - padB} stroke="var(--line-strong)" strokeWidth="1" strokeDasharray="2 3" />
      <text x={X(base) + 5} y={padT + 6} fontFamily="var(--mono)" fontSize="8.5" fill="var(--ink-faint)">NOW</text>
      <path d={band} fill="url(#coneBand)" />
      <path d={smooth(aPts)} fill="none" stroke="var(--f-800)" strokeWidth="2.6" strokeLinecap="round" />
      <path d={smooth(pPts)} fill="none" stroke="var(--hot)" strokeWidth="2.4" strokeDasharray="1 5" strokeLinecap="round" />
      <circle cx={pPts[pPts.length - 1][0]} cy={pPts[pPts.length - 1][1]} r="3.5" fill="var(--hot)" />
      <circle cx={aPts[aPts.length - 1][0]} cy={aPts[aPts.length - 1][1]} r="3.5" fill="var(--f-800)" />
    </svg>
  );
}
