import type { Metadata } from "next";
import DashboardHeader from "../components/header";
import ActionImpactLog from "../components/action-impact-log";
import CapabilityIndexCard from "../components/capability-index-card";
import AIRecommendationsPanel from "../components/ai-recommendations-panel";
import BehaviouralSignalsCard from "../components/behavioural-signals-card";
import { performanceImpacts } from "../components/dashboard-tab-data";
import ESGMetricsCard from "../components/esg-metrics-card";
import PerfRatingDistribution from "../components/perf-rating-distribution";
import PerfGoalAchievement from "../components/perf-goal-achievement";
import PerfTrendsQuarterly from "../components/perf-trends-quarterly";
import PerfRecognitionActivity from "../components/perf-recognition-activity";
import PerfAppraisalTracker from "../components/perf-appraisal-tracker";
import PerfGoalTracking from "../components/perf-goal-tracking";
import PerfRewardLeaderboard from "../components/perf-reward-leaderboard";

export const metadata: Metadata = {
  title: "Workenvo | Performance",
};

const bars = [
  "h-[72%] bg-[#006841]/40",
  "h-[80%] bg-[#006841]/50",
  "h-[85%] bg-[#008454]",
  "h-[82%] bg-[#008454]",
  "h-[75%] bg-[#006841]/55",
  "h-[70%] bg-[#006841]/45",
  "h-[68%] bg-[#006841]/35",
  "h-[65%] bg-[#006841]/30",
  "h-[72%] bg-[#006841]/40",
  "h-[74%] bg-[#006841]/45",
];

export default function PerformancePage() {
  return (
    <>
      <DashboardHeader
        tag="Performance Intelligence"
        title="Performance Index"
        ctaSecondary="Download Report"
        ctaPrimary="Generate AI View"
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        {/* ── Sections 1–4 ── */}
        <CapabilityIndexCard
          title="Performance Index"
          subtitle="Real-time aggregate of team goal completion and output velocity"
          score="78.4"
          trend="-3% vs last month"
          trendPositive={false}
          href="/dashboard/envo-performance/score"
          explanation="Your Performance Index fell 3% this month. The main driver is an 11% decline in goal completion over the last 3 sprints, concentrated in Product where milestone slippage and unplanned infrastructure work reduced sprint velocity. That means the score is still recoverable, but only if planning stability improves quickly."
          weakestDimensionNote="Goal Completion is your weakest pillar. Three Product milestones slipped in the last 3 sprints after two senior engineers were pulled into unplanned infrastructure work, and the delivery drag is now visible in the headline score."
          bars={bars}
          metrics={[
            { label: "Goal Completion", value: "82%", href: "/dashboard/envo-performance/pillar/goal-completion" },
            { label: "Output Quality", value: "High", href: "/dashboard/envo-performance/pillar/output-quality" },
            { label: "Responsiveness", value: "Stable", href: "/dashboard/envo-performance/pillar/responsiveness" },
            { label: "Growth Velocity", value: "Accelerating", href: "/dashboard/envo-performance/pillar/growth-velocity" },
          ]}
        />

        <AIRecommendationsPanel
          insight="Two team members have missed consecutive sprint commitments. Goal completion rate has declined 11% over 3 sprints."
          because="Product sprint velocity dropped 22% after two senior engineers were redirected to urgent infrastructure work, leaving key launch milestones under-resourced."
          recommendation="Revisit workload distribution in your next planning session. Consider reducing Marcus's active project count from 4 to 2."
          ctaLabel="Review Workload"
        />

        <BehaviouralSignalsCard
          title="Real-time Performance Signals"
          signals={[
            {
              id: "perf-1",
              title: "Deadline Risk: Q2 Product Launch",
              description: "3 of 8 milestones behind schedule",
              why: "Two senior engineers were pulled into urgent infrastructure work in March, which cut sprint velocity and pushed review queues past SLA.",
              icon: "warning",
              iconWrapClass: "bg-[#ffdad6]/30 text-[#ba1a1a]",
              badgeClass: "bg-[#ffdad6] text-[#93000a]",
              badge: "AT RISK",
              severity: "Critical",
              confidence: "Corroborated",
              team: "Product",
              period: "Last 3 sprints",
              trendData: [100, 96, 92, 86, 80, 72, 65, 58],
              trendLabel: "↓ 3 of 8 milestones behind",
              trendUp: false,
              triggers: [
                "Three of the eight Q2 milestones — Authentication Overhaul, API Gateway v2, and Payment Integration — have slipped past their committed dates, with a combined delay of 11 business days.",
                "Sprint velocity in the Product team dropped 22% between Sprint 14 and Sprint 16, driven primarily by two senior engineers being pulled into an unplanned infrastructure project.",
                "The current trajectory puts the April 30th launch date at risk. If the pattern continues for one more sprint, recovery will require scope reduction or additional resource allocation.",
              ],
              chartData: [100, 99, 97, 96, 94, 92, 90, 86, 82, 75, 68, 58],
              chartLabels: ["Wk 1", "Wk 2", "Wk 3", "Wk 4", "Wk 5", "Wk 6", "Wk 7", "Wk 8", "Wk 9", "Wk 10", "Wk 11", "Wk 12"],
              contributingFactors: ["Unplanned infrastructure work", "Reduced sprint velocity", "Scope creep in Auth module", "Senior engineer redeployment"],
              suggestedAction: "Convene an immediate scope-and-resource review with Product and Engineering leads. Identify which two milestones can be deferred to a v1.1 release without affecting the launch narrative. Reassign the two engineers back to Q2 delivery tracks by end of week.",
              actionCta: "Schedule Review",
              lifecycleStep: "Open",
              openedAt: "Mar 18, 2026",
            },
            {
              id: "perf-2",
              title: "Skill Gap Detected: Data Engineering",
              description: "Team capability below threshold for upcoming project needs",
              why: "Three team members reported low confidence in stream processing while two roadmap projects still depend on Kafka and Spark expertise this quarter.",
              icon: "trending_down",
              iconWrapClass: "bg-[#E6A817]/15 text-[#B07E10]",
              badgeClass: "bg-[#e5e2e1] text-[#3e4941]",
              badge: "MONITORING",
              severity: "Material",
              confidence: "Indicative",
              team: "Data Engineering",
              period: "Current quarter",
              trendData: [75, 73, 72, 70, 69, 67, 64, 61],
              trendLabel: "→ Below threshold",
              trendUp: null,
              triggers: [
                "The Data Engineering team's assessed capability score for real-time stream processing has been below the 70-point threshold for three consecutive months, falling to 61 this quarter.",
                "Two upcoming projects — the ML Feature Store build and the Customer Data Platform migration — both require advanced Kafka and Spark expertise that the team currently lacks.",
                "Three team members self-reported low confidence in stream processing during the Q1 skill survey. No structured development plan has been created for this area yet.",
              ],
              chartData: [80, 78, 77, 75, 74, 72, 71, 70, 68, 65, 63, 61],
              chartLabels: ["Wk 1", "Wk 2", "Wk 3", "Wk 4", "Wk 5", "Wk 6", "Wk 7", "Wk 8", "Wk 9", "Wk 10", "Wk 11", "Wk 12"],
              contributingFactors: ["No stream processing training", "Two seniors hired externally", "Q1 skill survey gaps", "Upcoming project requirements"],
              suggestedAction: "Create a 6-week focused development track for stream processing skills. Partner with an external Kafka/Spark instructor for two workshops. In parallel, evaluate whether the ML Feature Store timeline can be pushed by 3 weeks to allow capability catch-up.",
              actionCta: "Create Development Plan",
              lifecycleStep: "Open",
              openedAt: "Mar 10, 2026",
            },
          ]}
        />

        <ESGMetricsCard
          title="Performance Metrics"
          icon="analytics"
          metrics={[
            { label: "Goal Completion Rate", value: "78%", width: "w-[78%]", barClass: "bg-[#006841]" },
            { label: "Review Cycles Completed", value: "6 / 8", width: "w-[75%]", barClass: "bg-[#008454]" },
            { label: "Capability Growth", value: "+14% YoY", width: "w-[71%]", barClass: "bg-[#006d3e]" },
          ]}
          callout="Your team's goal completion is 8% above the engineering department average."
        />

        {/* ── Section 5 — Rating Distribution ── */}
        <PerfRatingDistribution />

        {/* ── Sections 6 + 7 — Goal Achievement + Trends ── */}
        <PerfGoalAchievement />
        <PerfTrendsQuarterly />

        {/* ── Section 8 — Recognition Activity ── */}
        <PerfRecognitionActivity />

        {/* ── Sections 9 + 10 — Appraisal Tracker + Goal Tracking ── */}
        <PerfAppraisalTracker />
        <PerfGoalTracking />

        {/* ── Section 11 — Reward Leaderboard ── */}
        <PerfRewardLeaderboard />

        <ActionImpactLog entries={performanceImpacts} />
      </div>
    </>
  );
}
