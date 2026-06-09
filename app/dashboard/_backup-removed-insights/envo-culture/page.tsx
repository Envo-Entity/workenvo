import type { Metadata } from "next";
import DashboardHeader from "../components/header";
import ActionImpactLog from "../components/action-impact-log";
import CapabilityIndexCard from "../components/capability-index-card";
import AIRecommendationsPanel from "../components/ai-recommendations-panel";
import BehaviouralSignalsCard from "../components/behavioural-signals-card";
import { cultureImpacts } from "../components/dashboard-tab-data";
import ESGMetricsCard from "../components/esg-metrics-card";
import CultOrgHealthPulse from "../components/cult-org-health-pulse";
import CultEmotionalMap from "../components/cult-emotional-map";
import CultMotivationIndex from "../components/cult-motivation-index";
import CultEngagementOverview from "../components/cult-engagement-overview";
import CultSatisfactionDeepdive from "../components/cult-satisfaction-deepdive";
import CultLeadershipTrust from "../components/cult-leadership-trust";
import CultAlertsPatterns from "../components/cult-alerts-patterns";

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
        {/* ── Sections 1–4 (existing) ── */}
        <CapabilityIndexCard
          title="Culture Health Score"
          subtitle="Real-time pulse of your team's cultural health"
          score="81.3"
          trend="+6% vs last month"
          trendPositive
          href="/dashboard/envo-culture/score"
          explanation="Your Culture Health Score rose 6% this month. The primary driver is a 12% increase in peer connection activities in Engineering, while recognition remains a drag because Design team's recognition volume dropped 35% over the last 4 weeks. That means belonging is improving, but the score still depends on recognition recovering in weaker teams."
          weakestDimensionNote="Recognition is your weakest pillar. Peer feedback submissions in Design fell from 28 to 4 over the last 4 weeks after the team lead went on extended leave, and that drop is now pulling the composite score down."
          bars={bars}
          metrics={[
            { label: "Belonging", value: "Strong", href: "/dashboard/envo-culture/pillar/belonging" },
            { label: "Psych. Safety", value: "Growing", href: "/dashboard/envo-culture/pillar/psychological-safety" },
            { label: "Recognition", value: "Steady", href: "/dashboard/envo-culture/pillar/recognition" },
            { label: "Feedback Culture", value: "Emerging", href: "/dashboard/envo-culture/pillar/feedback-culture" },
          ]}
        />

        <AIRecommendationsPanel
          insight="Recognition frequency has dropped 35% this quarter. Teams with low recognition show 2.3x higher attrition risk."
          because="Peer recognition in Design dropped 35% when the team lead went on leave, and no backup process was put in place to keep the ritual running."
          recommendation="Launch a peer recognition prompt this week. Teams that increased recognition by even 10% saw engagement recover within 3 weeks."
          ctaLabel="Activate Nudge"
        />

        <BehaviouralSignalsCard
          title="Real-time Cultural Signals"
          signals={[
            {
              id: "culture-1",
              title: "Recognition Gap: Design Team",
              description: "No peer recognition logged in 4 weeks",
              why: "Meeting participation dropped after the Design lead went on leave in late February, and recognition rituals stopped with them.",
              icon: "warning",
              iconWrapClass: "bg-[#ffdad6]/30 text-[#ba1a1a]",
              badgeClass: "bg-[#ffdad6] text-[#93000a]",
              badge: "ACTION REQUIRED",
              severity: "Material",
              confidence: "Corroborated",
              team: "Design",
              period: "Last 4 weeks",
              trendData: [95, 88, 78, 65, 50, 38, 25, 18],
              trendLabel: "↓ 35% recognition activity",
              trendUp: false,
              triggers: [
                "Peer recognition submissions dropped from 28 to 4 within the Design team over the past 4 weeks — the sharpest four-week decline in 18 months.",
                "No new recognition badges have been awarded in the team since March 2nd, 2026. The previous monthly average was 11 badges.",
                "The pattern correlates with the team lead being on extended leave since February 28th and no interim recognition champion being assigned.",
              ],
              chartData: [100, 96, 90, 82, 72, 58, 42, 30, 22, 18, 16, 18],
              chartLabels: ["Wk 1", "Wk 2", "Wk 3", "Wk 4", "Wk 5", "Wk 6", "Wk 7", "Wk 8", "Wk 9", "Wk 10", "Wk 11", "Wk 12"],
              contributingFactors: ["Team lead on leave", "No pulse responses", "Review cycle gap", "Low 1:1 cadence"],
              suggestedAction: "Send a targeted recognition prompt to all Design team members this week. Assign an interim recognition champion from within the team. Teams that restored recognition within two weeks saw belonging scores recover within 30 days.",
              actionCta: "Send Recognition Prompt",
              lifecycleStep: "Open",
              openedAt: "Mar 14, 2026",
            },
            {
              id: "culture-2",
              title: "Feedback Loop Healthy: Engineering",
              description: "89% of feedback requests completed on time",
              why: "Structured bi-weekly prompts and manager accountability checks kept overdue feedback items at zero for eight straight weeks.",
              icon: "verified",
              iconWrapClass: "bg-[#006841]/10 text-[#006841]",
              badgeClass: "bg-[#dcfce7] text-[#166534]",
              badge: "ON TRACK",
              severity: "Low",
              confidence: "Validated",
              team: "Engineering",
              period: "Last 2 weeks",
              trendData: [80, 82, 84, 85, 87, 86, 89, 89],
              trendLabel: "↑ Stable at 89%",
              trendUp: true,
              triggers: [
                "Engineering's feedback completion rate has held above 85% for eight consecutive weeks — the strongest consistent performance across all teams.",
                "The introduction of structured bi-weekly feedback prompts in January directly correlates with the improvement from a previous baseline of 71%.",
                "Zero overdue feedback items as of this reporting period. All 14 open items were resolved within their 48-hour SLA.",
              ],
              chartData: [71, 74, 77, 80, 82, 84, 85, 87, 86, 88, 89, 89],
              chartLabels: ["Wk 1", "Wk 2", "Wk 3", "Wk 4", "Wk 5", "Wk 6", "Wk 7", "Wk 8", "Wk 9", "Wk 10", "Wk 11", "Wk 12"],
              contributingFactors: ["Structured bi-weekly prompts", "High 1:1 cadence", "Manager accountability"],
              suggestedAction: "No action required. Share this result with Engineering leadership to reinforce the practice. Consider using Engineering's feedback structure as a template for teams with lower completion rates.",
              actionCta: "View Full Report",
              lifecycleStep: "Resolved",
              openedAt: "Feb 3, 2026",
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

        {/* ── Section 5 — Org Health Pulse ── */}
        <CultOrgHealthPulse />

        {/* ── Sections 6 + 7 — Emotional Map + Motivation Index ── */}
        <CultEmotionalMap />
        <CultMotivationIndex />

        {/* ── Section 8 — Engagement Overview ── */}
        <CultEngagementOverview />

        {/* ── Sections 9 + 10 — Satisfaction + Leadership Trust ── */}
        <CultSatisfactionDeepdive />
        <CultLeadershipTrust />

        {/* ── Section 11 — Culture Alerts ── */}
        <CultAlertsPatterns />

        <ActionImpactLog entries={cultureImpacts} />
      </div>
    </>
  );
}
