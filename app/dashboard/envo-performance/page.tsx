import type { Metadata } from "next";
import DashboardHeader from "../components/header";
import CapabilityIndexCard from "../components/capability-index-card";
import AIRecommendationsPanel from "../components/ai-recommendations-panel";
import BehaviouralSignalsCard from "../components/behavioural-signals-card";
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
          bars={bars}
          metrics={[
            { label: "Goal Completion", value: "82%" },
            { label: "Output Quality", value: "High" },
            { label: "Responsiveness", value: "Stable" },
            { label: "Growth Velocity", value: "Accelerating" },
          ]}
        />

        <AIRecommendationsPanel
          insight="Two team members have missed consecutive sprint commitments. Goal completion rate has declined 11% over 3 sprints."
          recommendation="Revisit workload distribution in your next planning session. Consider reducing Marcus's active project count from 4 to 2."
          ctaLabel="Review Workload"
        />

        <BehaviouralSignalsCard
          title="Real-time Performance Signals"
          signals={[
            {
              title: "Deadline Risk: Q2 Product Launch",
              description: "3 of 8 milestones behind schedule",
              icon: "warning",
              iconWrapClass: "bg-[#ffdad6]/30 text-[#ba1a1a]",
              badgeClass: "bg-[#ffdad6] text-[#93000a]",
              badge: "AT RISK",
            },
            {
              title: "Skill Gap Detected: Data Engineering",
              description: "Team capability below threshold for upcoming project needs",
              icon: "trending_down",
              iconWrapClass: "bg-[#006841]/10 text-[#006841]",
              badgeClass: "bg-[#e5e2e1] text-[#3e4941]",
              badge: "MONITORING",
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
      </div>
    </>
  );
}
