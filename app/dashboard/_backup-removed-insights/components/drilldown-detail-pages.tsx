"use client";

"use client";

import { Fragment, useMemo, useState } from "react";
import Link from "next/link";
import DashboardIcon from "./dashboard-icon";
import BehaviouralSignalsCard from "./behavioural-signals-card";
import {
  getTeamHrefBySlug,
  type PillarDetailData,
  type RecommendationCard,
  type ScoreDetailData,
  type TeamDetailData,
} from "./drilldown-data";
import styles from "../dashboard.module.css";

function DetailShell({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <section
      className={`${styles.detailSection} rounded-[1.5rem] bg-white p-6 md:p-8 ${styles.ambientShadow} ${className}`.trim()}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </section>
  );
}

function DetailTopBar({
  href,
  label,
  breadcrumbTail,
}: {
  href: string;
  label: string;
  breadcrumbTail?: string;
}) {
  return (
    <div className="mb-6 flex items-center gap-3 text-sm text-[#3e4941]">
      <Link
        href={href}
        className="inline-flex items-center gap-2 rounded-full bg-[#f6f3f2] px-4 py-2 font-semibold transition-colors hover:bg-[#ebe7e7]"
      >
        <DashboardIcon name="arrow_back" className="text-[18px]" />
        <span>{label}</span>
      </Link>
      {breadcrumbTail ? (
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#6f7a73]">
          &gt; {breadcrumbTail}
        </span>
      ) : null}
    </div>
  );
}

function DetailHero({
  title,
  score,
  trendLabel,
  trendPositive,
}: {
  title: string;
  score: string | number;
  trendLabel: string;
  trendPositive: boolean;
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tighter text-[#1c1b1b] md:text-4xl">
          {title}
          <span className="ml-3 text-[#006841]">{score}</span>
        </h1>
      </div>
      <span
        className={`inline-flex rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] ${
          trendPositive
            ? "bg-[#dcfce7] text-[#166534]"
            : "bg-[#fff3cd] text-[#9a6c00]"
        }`}
      >
        {trendLabel}
      </span>
    </div>
  );
}

function AreaTrendChart({
  labels,
  values,
  min = 60,
  max = 100,
}: {
  labels: string[];
  values: number[];
  min?: number;
  max?: number;
}) {
  const width = 960;
  const height = 280;
  const padding = { top: 16, right: 18, bottom: 44, left: 44 };
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  const points = values.map((value, index) => {
    const x = padding.left + (index / (values.length - 1)) * innerWidth;
    const y = padding.top + innerHeight - ((value - min) / (max - min)) * innerHeight;
    return { x, y, value, label: labels[index] };
  });

  const line = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`)
    .join(" ");
  const area =
    `${line} L ${points[points.length - 1].x.toFixed(1)} ${(padding.top + innerHeight).toFixed(1)} ` +
    `L ${points[0].x.toFixed(1)} ${(padding.top + innerHeight).toFixed(1)} Z`;
  const yTicks = [60, 70, 80, 90, 100];

  return (
    <div className="rounded-[1.25rem] bg-[#f6f3f2] p-4 md:p-6">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-[280px] w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="score-area-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#006841" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#006841" stopOpacity="0" />
          </linearGradient>
        </defs>
        {yTicks.map((tick) => {
          const y =
            padding.top + innerHeight - ((tick - min) / (max - min)) * innerHeight;
          return (
            <g key={tick}>
              <line
                x1={padding.left}
                x2={width - padding.right}
                y1={y}
                y2={y}
                stroke="rgba(0,104,65,0.08)"
                strokeDasharray="4 6"
              />
              <text
                x={padding.left - 12}
                y={y + 4}
                textAnchor="end"
                fontSize="11"
                fill="#6f7a73"
                fontWeight="700"
              >
                {tick}
              </text>
            </g>
          );
        })}
        <path d={area} fill="url(#score-area-fill)" />
        <path d={line} fill="none" stroke="#006841" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((point) => (
          <g key={point.label}>
            <circle cx={point.x} cy={point.y} r="5" fill="#006841" />
            <circle cx={point.x} cy={point.y} r="10" fill="transparent">
              <title>
                {point.label}: {point.value}
              </title>
            </circle>
          </g>
        ))}
        {points.map((point) => (
          <text
            key={`${point.label}-x`}
            x={point.x}
            y={height - 14}
            textAnchor="middle"
            fontSize="11"
            fill="#6f7a73"
            fontWeight="700"
          >
            {point.label}
          </text>
        ))}
      </svg>
    </div>
  );
}

function ComparisonCards({ items }: { items: ScoreDetailData["comparisonStats"] }) {
  return (
    <div className="mt-6 grid gap-4 md:grid-cols-3">
      {items.map((item) => (
        <div key={item.label} className="rounded-[1.25rem] bg-[#f6f3f2] p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#6f7a73]">
            {item.label}
          </p>
          <p className="mt-3 text-3xl font-black text-[#006841]">{item.value}</p>
          <p className="mt-2 text-sm leading-relaxed text-[#3e4941]">{item.note}</p>
        </div>
      ))}
    </div>
  );
}

function DriverBreakdown({
  title,
  drivers,
}: {
  title: string;
  drivers: ScoreDetailData["drivers"];
}) {
  const colors = ["#006841", "#0b7a4f", "#1d8c62", "#43a87e", "#77c59f"];
  const trendSymbol = { up: "↑", down: "↓", flat: "→" } as const;
  const trendClass = {
    up: "text-[#006841]",
    down: "text-[#b45309]",
    flat: "text-[#6f7a73]",
  } as const;

  return (
    <>
      <div className="mb-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#6f7a73]">
          Driver Breakdown
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#1c1b1b]">{title}</h2>
      </div>

      <div className="flex h-5 overflow-hidden rounded-full bg-[#f6f3f2]">
        {drivers.map((driver, index) => (
          <div
            key={driver.name}
            style={{ width: `${driver.contribution}%`, backgroundColor: colors[index] }}
            title={`${driver.name}: ${driver.contribution}% contribution`}
          />
        ))}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {drivers.map((driver, index) => (
          <div key={driver.name} className="rounded-[1.25rem] bg-[#f6f3f2] p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-[#1c1b1b]">{driver.name}</p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#6f7a73]">
                  {driver.contribution}% contribution
                </p>
              </div>
              <span className="text-2xl font-black" style={{ color: ["#006841", "#0b7a4f", "#1d8c62", "#43a87e", "#77c59f"][index] }}>
                {driver.score}
              </span>
            </div>
            <p className={`mt-3 text-sm font-bold ${trendClass[driver.trend]}`}>
              {trendSymbol[driver.trend]}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[#3e4941]">{driver.explanation}</p>
          </div>
        ))}
      </div>
    </>
  );
}

function TeamComparisonChart({
  teams,
  average,
}: {
  teams: ScoreDetailData["teamScores"];
  average: number;
}) {
  return (
    <>
      <div className="mb-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#6f7a73]">
          Team Comparison
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#1c1b1b]">Score by Team</h2>
      </div>

      <div className="space-y-4">
        {teams.map((team) => {
          const positive = team.score >= average;
          return (
            <div key={team.name} className="flex items-center gap-4">
              <Link
                href={getTeamHrefBySlug(team.slug)}
                className="w-40 shrink-0 text-sm font-bold text-[#1c1b1b] transition-colors hover:text-[#006841]"
              >
                {team.name}
              </Link>
              <div className="relative flex-1">
                <div
                  className="absolute top-0 z-10 h-full border-l border-dashed border-[#006841]/45"
                  style={{ left: `${average}%` }}
                />
                <div className="h-9 overflow-hidden rounded-full bg-[#f6f3f2]">
                  <div
                    className={`h-full rounded-full ${positive ? "bg-[#006841]" : "bg-[#e6a817]"}`}
                    style={{ width: `${team.score}%` }}
                  />
                </div>
              </div>
              <span className="w-12 text-right text-sm font-black text-[#1c1b1b]">
                {team.score}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-6 inline-flex items-center gap-3 rounded-full bg-[#f6f3f2] px-4 py-3 text-xs font-semibold text-[#3e4941]">
        <span className="h-px w-8 border-t border-dashed border-[#006841]/55" />
        Org average {average}
      </div>
    </>
  );
}

function AIExplanationCard({ paragraphs }: { paragraphs: string[] }) {
  return (
    <div className="rounded-[1.5rem] bg-[#008454] p-6 text-white md:p-8">
      <div className="mb-5 flex items-center gap-3">
        <DashboardIcon name="auto_awesome" fill className="text-[24px]" />
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#8ff8b4]">
            AI Explanation
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight">Why this score changed</h2>
        </div>
      </div>
      <div className="space-y-4">
        {paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 24)} className="text-sm leading-7 text-white/90 md:text-[15px]">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}

function Heatmap({ data }: { data: PillarDetailData }) {
  const colorForValue = (value: number) => {
    if (value >= 80) return "#006841";
    if (value >= 70) return "#5d9f78";
    if (value >= 60) return "#d9a21b";
    return "#d55d53";
  };

  return (
    <>
      <div className="mb-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#6f7a73]">
          Team Heatmap
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#1c1b1b]">
          {data.title} across teams
        </h2>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[720px]">
          <div className="grid grid-cols-[180px_repeat(6,minmax(0,1fr))] gap-3">
            <div />
            {data.heatmapMonths.map((month) => (
              <p
                key={month}
                className="text-center text-[10px] font-bold uppercase tracking-[0.2em] text-[#6f7a73]"
              >
                {month}
              </p>
            ))}
            {data.heatmapTeams.map((team) => (
              <Fragment key={team.name}>
                <div key={`${team.name}-name`} className="flex items-center text-sm font-bold text-[#1c1b1b]">
                  {team.name}
                </div>
                {team.values.map((value, index) => (
                  <div
                    key={`${team.name}-${index}`}
                    className="rounded-[0.9rem] p-4 text-center text-sm font-black text-white"
                    style={{ backgroundColor: colorForValue(value) }}
                    title={`${team.name} ${data.heatmapMonths[index]}: ${value}`}
                  >
                    {value}
                  </div>
                ))}
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function RecommendationList({ items }: { items: RecommendationCard[] }) {
  return (
    <>
      <div className="mb-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#6f7a73]">
          Related Recommendations
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#1c1b1b]">
          What to do next
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {items.map((item) => (
          <div key={item.title} className="rounded-[1.25rem] bg-[#f6f3f2] p-5">
            <p className="text-lg font-bold tracking-tight text-[#1c1b1b]">{item.title}</p>
            <p className="mt-3 text-sm leading-relaxed text-[#3e4941]">{item.body}</p>
            <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#006841]">
              Owner {item.owner}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}

function TeamSummary({ team }: { team: TeamDetailData }) {
  return (
    <DetailShell delay={100}>
      <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#6f7a73]">
        Team Health Summary
      </p>
      <div className="mt-5 grid gap-4 md:grid-cols-4">
        {team.summary.map((item) => (
          <div key={item.label} className="rounded-[1.25rem] bg-[#f6f3f2] p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6f7a73]">
              {item.label}
            </p>
            <p className="mt-3 text-3xl font-black text-[#006841]">{item.value}</p>
            <p className="mt-2 text-sm leading-relaxed text-[#3e4941]">{item.note}</p>
          </div>
        ))}
      </div>
    </DetailShell>
  );
}

export function ScoreDetailView({ data }: { data: ScoreDetailData }) {
  return (
    <div className="space-y-6">
      <DetailShell delay={0}>
        <DetailTopBar href={`/dashboard/${data.domain}`} label={`Back to ${data.backLabel}`} />
        <DetailHero
          title={data.title}
          score={data.score}
          trendLabel={data.trendLabel}
          trendPositive={data.trendPositive}
        />
      </DetailShell>

      <DetailShell delay={100}>
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#6f7a73]">
          Score Trend
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#1c1b1b]">
          12-month movement
        </h2>
        <div className="mt-6">
          <AreaTrendChart labels={data.months} values={data.trendValues} />
          <ComparisonCards items={data.comparisonStats} />
        </div>
      </DetailShell>

      <DetailShell delay={200}>
        <DriverBreakdown title={data.driversHeading} drivers={data.drivers} />
      </DetailShell>

      <DetailShell delay={300}>
        <TeamComparisonChart teams={data.teamScores} average={data.teamAverage} />
      </DetailShell>

      <div className={`${styles.detailSection}`} style={{ animationDelay: "400ms" }}>
        <AIExplanationCard paragraphs={data.aiExplanation} />
      </div>
    </div>
  );
}

export function PillarDetailView({ data }: { data: PillarDetailData }) {
  return (
    <div className="space-y-6">
      <DetailShell delay={0}>
        <DetailTopBar
          href={`/dashboard/${data.domain}`}
          label={`Back to ${data.parentTitle}`}
          breadcrumbTail={data.title}
        />
        <DetailHero
          title={data.title}
          score={data.status}
          trendLabel={data.trendLabel}
          trendPositive
        />
      </DetailShell>

      <DetailShell delay={100}>
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#6f7a73]">
          Pillar Trend
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#1c1b1b]">
          12-month score trend
        </h2>
        <div className="mt-6">
          <AreaTrendChart labels={data.months} values={data.trendValues} />
        </div>
      </DetailShell>

      <div className={styles.detailSection} style={{ animationDelay: "200ms" }}>
        <BehaviouralSignalsCard
          title="Contributing Signals"
          signals={data.signals}
        />
      </div>

      <DetailShell delay={300}>
        <Heatmap data={data} />
      </DetailShell>

      <DetailShell delay={400}>
        <RecommendationList items={data.recommendations} />
      </DetailShell>
    </div>
  );
}

export function TeamDetailView({ team }: { team: TeamDetailData }) {
  const [activeTab, setActiveTab] = useState<TeamDetailData["tabs"][number]["label"]>("Culture");
  const active = useMemo(
    () => team.tabs.find((tab) => tab.label === activeTab) ?? team.tabs[0],
    [activeTab, team.tabs],
  );

  return (
    <div className="space-y-6">
      <DetailShell delay={0}>
        <DetailTopBar href="/dashboard" label="Back to Dashboard" breadcrumbTail={team.name} />
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tighter text-[#1c1b1b] md:text-4xl">
              {team.name}
            </h1>
            <p className="mt-3 text-sm text-[#3e4941]">
              Team lead {team.lead} · {team.headcount} people
            </p>
          </div>
          <div className="inline-flex rounded-full bg-[#f6f3f2] p-1">
            {team.tabs.map((tab) => (
              <button
                key={tab.label}
                onClick={() => setActiveTab(tab.label)}
                className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                  activeTab === tab.label
                    ? "bg-[#008454] text-white"
                    : "text-[#3e4941]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </DetailShell>

      <TeamSummary team={team} />

      <DetailShell delay={200}>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#6f7a73]">
              {active.label}
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#1c1b1b]">
              {active.scoreLabel}
            </h2>
          </div>
          <div className="text-right">
            <p className="text-4xl font-black text-[#006841]">{active.score}</p>
            <p className="mt-2 text-xs font-bold uppercase tracking-[0.2em] text-[#006841]">
              {active.trendLabel}
            </p>
          </div>
        </div>
        <div className="mt-6">
          <AreaTrendChart labels={active.months} values={active.trendValues} />
        </div>
      </DetailShell>

      <div className={styles.detailSection} style={{ animationDelay: "300ms" }}>
        <BehaviouralSignalsCard
          title={`${active.label} signals`}
          signals={active.signals}
        />
      </div>

      <DetailShell delay={400}>
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#6f7a73]">
          Key Metrics
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#1c1b1b]">
          What matters most in this team
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {active.keyMetrics.map((metric) => (
            <div key={metric.label} className="rounded-[1.25rem] bg-[#f6f3f2] p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6f7a73]">
                {metric.label}
              </p>
              <p className="mt-3 text-3xl font-black text-[#006841]">{metric.value}</p>
              <p className="mt-2 text-sm leading-relaxed text-[#3e4941]">{metric.note}</p>
            </div>
          ))}
        </div>
      </DetailShell>
    </div>
  );
}
