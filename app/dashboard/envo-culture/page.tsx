import type { Metadata } from "next";
import DashboardHeader from "../components/header";
import CapabilityIndexCard from "../components/capability-index-card";
import AIRecommendationsPanel from "../components/ai-recommendations-panel";
import BehaviouralSignalsCard from "../components/behavioural-signals-card";
import ESGMetricsCard from "../components/esg-metrics-card";

export const metadata: Metadata = {
  title: "Workenvo | Culture",
};

const bars = [
  "h-[45%] bg-[#006841]/10",
  "h-[55%] bg-[#006841]/20",
  "h-[60%] bg-[#006841]/25",
  "h-[65%] bg-[#006841]/35",
  "h-[70%] bg-[#006841]/45",
  "h-[72%] bg-[#006841]/50",
  "h-[78%] bg-[#006841]/60",
  "h-[85%] bg-[#008454]",
  "h-[83%] bg-[#008454]",
  "h-[80%] bg-[#006841]/70",
];

export default function CulturePage() {
  return (
    <>
      <DashboardHeader
        tag="Culture Intelligence"
        title="Culture Health Score"
        ctaSecondary="Download Report"
        ctaPrimary="Generate AI View"
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        <CapabilityIndexCard
          title="Culture Health Score"
          subtitle="Real-time pulse of your team's cultural health"
          score="81.3"
          trend="+6% vs last month"
          trendPositive
          bars={bars}
          metrics={[
            { label: "Belonging", value: "Strong" },
            { label: "Psych. Safety", value: "Growing" },
            { label: "Recognition", value: "Steady" },
            { label: "Feedback Culture", value: "Emerging" },
          ]}
        />

        <AIRecommendationsPanel
          insight="Recognition frequency has dropped 35% this quarter. Teams with low recognition show 2.3x higher attrition risk."
          recommendation="Launch a peer recognition prompt this week. Teams that increased recognition by even 10% saw engagement recover within 3 weeks."
          ctaLabel="Activate Nudge"
        />

        <BehaviouralSignalsCard
          title="Real-time Cultural Signals"
          signals={[
            {
              title: "Recognition Gap: Design Team",
              description: "No peer recognition logged in 4 weeks",
              icon: "warning",
              iconWrapClass: "bg-[#ffdad6]/30 text-[#ba1a1a]",
              badgeClass: "bg-[#ffdad6] text-[#93000a]",
              badge: "ACTION REQUIRED",
            },
            {
              title: "Feedback Loop Healthy: Engineering",
              description: "89% of feedback requests completed on time",
              icon: "verified",
              iconWrapClass: "bg-[#006841]/10 text-[#006841]",
              badgeClass: "bg-[#dcfce7] text-[#166534]",
              badge: "ON TRACK",
            },
          ]}
        />

        <ESGMetricsCard
          title="Culture Behaviours"
          icon="groups"
          metrics={[
            { label: "Belonging Score", value: "76%", width: "w-[76%]", barClass: "bg-[#006841]" },
            { label: "Peer Recognition Sent", value: "12 this month", width: "w-[60%]", barClass: "bg-[#008454]" },
            { label: "Feedback Completion Rate", value: "84%", width: "w-[84%]", barClass: "bg-[#006d3e]" },
          ]}
          callout="Your team's belonging score is 18% higher than the company median."
        />
      </div>
    </>
  );
}
