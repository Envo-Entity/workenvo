"use client";

import { useState } from "react";
import ActionImpactLog from "./action-impact-log";
import CapabilityIndexCard from "./capability-index-card";
import AIRecommendationsPanel from "./ai-recommendations-panel";
import BehaviouralSignalsCard from "./behavioural-signals-card";
import { sustainabilityImpacts } from "./dashboard-tab-data";
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
              href="/dashboard/envo-sustainability/score"
              explanation="Your ESG Health Score rose 4% this quarter. Environmental gains in Berlin and stronger governance reporting are lifting the score, but commute emissions in Dublin remain a drag after office attendance increased. That means the programme is working overall, though behaviour adoption is still uneven by site."
              weakestDimensionNote="Environmental behaviour adoption is your weakest pressure point. Commute emissions in Dublin rose 18% over the last 8 weeks after the attendance policy shifted to three in-office days, slowing progress against your 2025 target."
              bars={bars}
              metrics={[
                { label: "Environmental", value: "Strong", href: "/dashboard/envo-sustainability/pillar/environmental" },
                { label: "Social", value: "Growing", href: "/dashboard/envo-sustainability/pillar/social" },
                { label: "Governance", value: "Peak", href: "/dashboard/envo-sustainability/pillar/governance" },
                { label: "Reporting", value: "Compliant", href: "/dashboard/envo-sustainability/pillar/reporting" },
              ]}
            />

            <AIRecommendationsPanel
              insight="Carbon footprint per employee is 12% above your stated 2025 target. Remote work adoption has slowed reduction progress."
              because="Commute-related emissions in Dublin rose 18% after the February attendance policy change reduced remote working days from 2.4 to 1.6 per week."
              recommendation="Introduce a green commute incentive programme and set department-level carbon budgets reviewed quarterly."
              ctaLabel="Launch ESG Nudge"
            />

            <BehaviouralSignalsCard
              title="Real-time ESG Signals"
              signals={[
                {
                  id: "sust-1",
                  title: "Commute Emissions Rising: Dublin Office",
                  description: "Carbon footprint from commuting up 18% over 8 weeks",
                  why: "Remote working days fell from 2.4 to 1.6 per week after the new attendance policy launched in February.",
                  icon: "warning",
                  iconWrapClass: "bg-[#ffdad6]/30 text-[#ba1a1a]",
                  badgeClass: "bg-[#ffdad6] text-[#93000a]",
                  badge: "INVESTIGATE",
                  severity: "Material",
                  confidence: "Corroborated",
                  team: "Dublin Office",
                  period: "Last 8 weeks",
                  trendData: [60, 65, 70, 75, 80, 86, 92, 98],
                  trendLabel: "↑ 18% carbon increase",
                  trendUp: false,
                  triggers: [
                    "Commute-related carbon emissions at the Dublin office have increased 18% over 8 weeks, driven by a 31% drop in remote working days per employee — from an average of 2.4 to 1.6 days per week.",
                    "A new office attendance policy introduced in February requiring three in-person days per week has directly reduced the remote ratio that was previously cutting commute emissions.",
                    "Dublin's commute emissions now represent 34% of the site's total carbon footprint, up from 27% in Q4 2025, putting the annual per-employee emissions target at risk.",
                  ],
                  chartData: [52, 55, 58, 62, 66, 70, 76, 82, 88, 93, 96, 100],
                  chartLabels: ["Wk 1", "Wk 2", "Wk 3", "Wk 4", "Wk 5", "Wk 6", "Wk 7", "Wk 8", "Wk 9", "Wk 10", "Wk 11", "Wk 12"],
                  contributingFactors: ["Reduced remote working days", "New attendance policy", "No green commute incentive", "Public transport low uptake"],
                  suggestedAction: "Introduce a green commute incentive for Dublin employees — subsidised public transport cards and a cycle-to-work bonus scheme. Model the carbon impact of shifting one in-person day back to remote per week. Present findings to the Dublin site lead within 7 days.",
                  actionCta: "Launch Green Commute Initiative",
                  lifecycleStep: "Open",
                  openedAt: "Mar 20, 2026",
                },
                {
                  id: "sust-2",
                  title: "Zero Waste Target Hit: Berlin Office",
                  description: "95% waste diversion rate sustained for 3 months",
                  why: "The composting programme and packaging changes introduced in January stayed active long enough to become a repeatable team habit.",
                  icon: "verified",
                  iconWrapClass: "bg-[#006841]/10 text-[#006841]",
                  badgeClass: "bg-[#dcfce7] text-[#166534]",
                  badge: "MILESTONE",
                  severity: "Low",
                  confidence: "Validated",
                  team: "Berlin Office",
                  period: "Last 3 months",
                  trendData: [78, 82, 86, 90, 92, 94, 95, 95],
                  trendLabel: "↑ 95% diversion rate sustained",
                  trendUp: true,
                  triggers: [
                    "Berlin's waste diversion rate has held at or above 95% for 12 consecutive weeks, achieving the full-year Zero Waste target three months ahead of the December 2026 deadline.",
                    "The outcome was driven by the composting programme launched in January and a team-led initiative to eliminate single-use packaging from all catered events.",
                    "This is the first time any Workenvo office site has hit the 95% diversion threshold. Berlin now leads all global sites by 22 percentage points.",
                  ],
                  chartData: [62, 68, 74, 78, 82, 86, 89, 92, 94, 95, 95, 96],
                  chartLabels: ["Wk 1", "Wk 2", "Wk 3", "Wk 4", "Wk 5", "Wk 6", "Wk 7", "Wk 8", "Wk 9", "Wk 10", "Wk 11", "Wk 12"],
                  contributingFactors: ["Composting programme", "Packaging elimination", "Team-led culture", "Site lead sponsorship"],
                  suggestedAction: "Recognise the Berlin team publicly in the next all-hands. Document their approach into a replicable playbook and share with Dublin, London, and Singapore site leads. Nominate the programme for an internal ESG excellence award.",
                  actionCta: "Share Playbook",
                  lifecycleStep: "Resolved",
                  openedAt: "Dec 10, 2025",
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
                    id: "sust-sec6-1",
                    title: "Commute Emissions Rising: Dublin Office",
                    description: "Average commute carbon up 18% since hybrid policy change",
                    why: "The shift to three required in-office days reduced remote work quickly, but no green commute incentive was launched at the same time.",
                    icon: "warning",
                    iconWrapClass: "bg-amber-100 text-amber-700",
                    badgeClass: "bg-amber-100 text-amber-800",
                    badge: "INVESTIGATE",
                    severity: "Material",
                    confidence: "Corroborated",
                    team: "Dublin Office",
                    period: "Last 8 weeks",
                    trendData: [60, 65, 70, 75, 80, 86, 92, 98],
                    trendLabel: "↑ 18% carbon increase",
                    trendUp: false,
                    triggers: [
                      "Commute-related carbon emissions at the Dublin office have increased 18% over 8 weeks, driven by a 31% drop in remote working days per employee.",
                      "A new office attendance policy introduced in February requiring three in-person days per week has directly reduced the remote ratio.",
                      "Dublin's commute emissions now represent 34% of the site's total carbon footprint, up from 27% in Q4 2025.",
                    ],
                    chartData: [52, 55, 58, 62, 66, 70, 76, 82, 88, 93, 96, 100],
                    chartLabels: ["Wk 1", "Wk 2", "Wk 3", "Wk 4", "Wk 5", "Wk 6", "Wk 7", "Wk 8", "Wk 9", "Wk 10", "Wk 11", "Wk 12"],
                    contributingFactors: ["Reduced remote days", "New attendance policy", "No green commute incentive"],
                    suggestedAction: "Introduce a green commute incentive for Dublin employees — subsidised public transport cards and a cycle-to-work bonus scheme.",
                    actionCta: "Launch Green Commute Initiative",
                    lifecycleStep: "Open",
                    openedAt: "Mar 20, 2026",
                  },
                  {
                    id: "sust-sec6-2",
                    title: "Zero Waste Target Hit: Berlin Office",
                    description: "Waste diversion rate exceeded 95% for 3 consecutive months",
                    why: "Berlin combined composting, packaging elimination, and strong local sponsorship, so the behaviour stuck after launch month.",
                    icon: "verified",
                    iconWrapClass: "bg-[#006841]/10 text-[#006841]",
                    badgeClass: "bg-[#dcfce7] text-[#166534]",
                    badge: "MILESTONE",
                    severity: "Low",
                    confidence: "Validated",
                    team: "Berlin Office",
                    period: "Last 3 months",
                    trendData: [78, 82, 86, 90, 92, 94, 95, 95],
                    trendLabel: "↑ 95% diversion rate sustained",
                    trendUp: true,
                    triggers: [
                      "Berlin's waste diversion rate has held at or above 95% for 12 consecutive weeks, achieving the full-year Zero Waste target three months early.",
                      "The outcome was driven by the composting programme launched in January and a team-led initiative to eliminate single-use packaging from all catered events.",
                    ],
                    chartData: [62, 68, 74, 78, 82, 86, 89, 92, 94, 95, 95, 96],
                    chartLabels: ["Wk 1", "Wk 2", "Wk 3", "Wk 4", "Wk 5", "Wk 6", "Wk 7", "Wk 8", "Wk 9", "Wk 10", "Wk 11", "Wk 12"],
                    contributingFactors: ["Composting programme", "Packaging elimination", "Team-led culture"],
                    suggestedAction: "Recognise the Berlin team and document their approach into a replicable playbook for other office sites.",
                    actionCta: "Share Playbook",
                    lifecycleStep: "Resolved",
                    openedAt: "Dec 10, 2025",
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

          <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
            <ActionImpactLog entries={sustainabilityImpacts} />
          </div>
        </div>
      )}

      {/* Rewards content */}
      {activeTab === "rewards" && <SustRewardsView />}
    </div>
  );
}
