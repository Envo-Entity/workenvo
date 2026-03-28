import type { Metadata } from "next";
import DashboardHeader from "../components/header";
import CapabilityIndexCard from "../components/capability-index-card";
import AIRecommendationsPanel from "../components/ai-recommendations-panel";
import BehaviouralSignalsCard from "../components/behavioural-signals-card";
import ESGMetricsCard from "../components/esg-metrics-card";

export const metadata: Metadata = {
  title: "Workenvo | Sustainability",
};

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

export default function SustainabilityPage() {
  return (
    <>
      <DashboardHeader
        tag="ESG Intelligence"
        title="Sustainability Index"
        ctaSecondary="Download Report"
        ctaPrimary="Generate AI View"
      />

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
    </>
  );
}
