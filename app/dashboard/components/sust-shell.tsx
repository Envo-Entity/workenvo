"use client";

import { useState } from "react";
import CapabilityIndexCard from "./capability-index-card";
import AIRecommendationsPanel from "./ai-recommendations-panel";
import BehaviouralSignalsCard from "./behavioural-signals-card";
import ESGMetricsCard from "./esg-metrics-card";
import SustKpiRow from "./sust-kpi-row";
import SustCarbonByCategory from "./sust-carbon-by-category";
import SustBehaviourAdoption from "./sust-behaviour-adoption";
import SustPopularActions from "./sust-popular-actions";
import SustDeptLeaderboard from "./sust-dept-leaderboard";
import SustRewardsView from "./sust-rewards-view";

type SubTab = "home" | "rewards";

const bars = [
  "h-[50%] bg-[#006841]/10",
  "h-[58%] bg-[#006841]/20",
  "h-[62%] bg-[#006841]/30",
  "h-[70%] bg-[#006841]/40",
  "h-[75%] bg-[#006841]/50",
  "h-[80%] bg-[#006841]/60",
  "h-[88%] bg-[#008454]",
  "h-[92%] bg-[#008454]",
  "h-[89%] bg-[#008454]",
  "h-[85%] bg-[#006841]/70",
];

export default function SustainabilityShell() {
  const [activeTab, setActiveTab] = useState<SubTab>("home");

  return (
    <div className="space-y-8">
      {/* Sub-navigation */}
      <div className="flex gap-8 border-b border-[#f0edec]">
        {(["home", "rewards"] as SubTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-sm font-bold capitalize transition-all ${
              activeTab === tab
                ? "border-b-2 border-[#006841] text-[#006841]"
                : "text-stone-400 hover:text-[#3e4941]"
            }`}
          >
            {tab === "home" ? "Home" : "Rewards"}
          </button>
        ))}
      </div>

      {/* Home content */}
      {activeTab === "home" && (
        <div className="space-y-6">
          {/* ── Sections 1–4 (existing) ── */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
            <CapabilityIndexCard
              title="ESG Health Score"
              subtitle="Real-time aggregate of environmental, social and governance metrics"
              score="88.6"
              trend="+4% vs last quarter"
              trendPositive
              bars={bars}
              metrics={[
                { label: "Environmental", value: "Strong" },
                { label: "Social", value: "Growing" },
                { label: "Governance", value: "Peak" },
                { label: "Reporting", value: "Compliant" },
              ]}
            />

            <AIRecommendationsPanel
              insight="Carbon footprint per employee is 12% above your stated 2025 target. Remote work adoption has slowed reduction progress."
              recommendation="Introduce a green commute incentive programme and set department-level carbon budgets reviewed quarterly."
              ctaLabel="Launch ESG Nudge"
            />

            <BehaviouralSignalsCard
              title="Real-time ESG Signals"
              signals={[
                {
                  title: "Governance Audit: Q4 Filing Due",
                  description: "Annual ESG disclosure deadline in 18 days",
                  icon: "warning",
                  iconWrapClass: "bg-[#ffdad6]/30 text-[#ba1a1a]",
                  badgeClass: "bg-[#ffdad6] text-[#93000a]",
                  badge: "ACTION REQUIRED",
                },
                {
                  title: "D&I Target Achieved: Leadership",
                  description: "40% gender diversity across senior leadership roles",
                  icon: "verified",
                  iconWrapClass: "bg-[#006841]/10 text-[#006841]",
                  badgeClass: "bg-[#dcfce7] text-[#166534]",
                  badge: "MILESTONE HIT",
                },
              ]}
            />

            <ESGMetricsCard
              title="ESG Metrics"
              icon="eco"
              metrics={[
                { label: "Diversity & Inclusion", value: "78%", width: "w-[78%]", barClass: "bg-[#006841]" },
                { label: "Wellness Score", value: "62%", width: "w-[62%]", barClass: "bg-[#008454]" },
                { label: "Ethical Alignment", value: "94%", width: "w-[94%]", barClass: "bg-[#006d3e]" },
              ]}
              callout="Your organisation is in the top 5% for ethical governance in the SaaS sector."
            />
          </div>

          {/* ── Section 5 — Impact KPI Row ── */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
            <SustKpiRow />
          </div>

          {/* ── Section 6 — Carbon by Category + Sustainability Signals ── */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
            <SustCarbonByCategory />
            <div className="md:col-span-6">
              <BehaviouralSignalsCard
                title="Sustainability Signals"
                signals={[
                  {
                    title: "Commute Emissions Rising: Dublin Office",
                    description: "Average commute carbon up 18% since hybrid policy change",
                    icon: "warning",
                    iconWrapClass: "bg-amber-100 text-amber-700",
                    badgeClass: "bg-amber-100 text-amber-800",
                    badge: "INVESTIGATE",
                  },
                  {
                    title: "Zero Waste Target Hit: Berlin Office",
                    description: "Waste diversion rate exceeded 95% for 3 consecutive months",
                    icon: "verified",
                    iconWrapClass: "bg-[#006841]/10 text-[#006841]",
                    badgeClass: "bg-[#dcfce7] text-[#166534]",
                    badge: "MILESTONE",
                  },
                ]}
              />
            </div>
          </div>

          {/* ── Section 7 — Behaviour Adoption + Popular Actions ── */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
            <SustBehaviourAdoption />
            <SustPopularActions />
          </div>

          {/* ── Section 8 — Department Leaderboard ── */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
            <SustDeptLeaderboard />
          </div>
        </div>
      )}

      {/* Rewards content */}
      {activeTab === "rewards" && <SustRewardsView />}
    </div>
  );
}
