import type { RichSignal } from "./behavioural-signals-card";

export type DomainKey =
  | "envo-culture"
  | "envo-performance"
  | "envo-sustainability";

export type TeamSlug =
  | "engineering"
  | "design"
  | "product"
  | "finance"
  | "customer-success"
  | "operations"
  | "sales"
  | "marketing"
  | "hr"
  | "human-resources";

type ComparisonStat = {
  label: string;
  value: string;
  note: string;
};

type Driver = {
  name: string;
  contribution: number;
  score: number;
  trend: "up" | "down" | "flat";
  explanation: string;
};

type TeamScore = {
  name: string;
  slug: TeamSlug;
  score: number;
};

export type RecommendationCard = {
  title: string;
  body: string;
  owner: string;
};

export type ScoreDetailData = {
  domain: DomainKey;
  backLabel: string;
  title: string;
  score: string;
  trendLabel: string;
  trendPositive: boolean;
  months: string[];
  trendValues: number[];
  comparisonStats: ComparisonStat[];
  driversHeading: string;
  drivers: Driver[];
  teamAverage: number;
  teamScores: TeamScore[];
  aiExplanation: string[];
};

export type PillarDetailData = {
  domain: DomainKey;
  parentTitle: string;
  title: string;
  status: string;
  score: number;
  trendLabel: string;
  months: string[];
  trendValues: number[];
  signals: RichSignal[];
  heatmapMonths: string[];
  heatmapTeams: { name: string; values: number[] }[];
  recommendations: RecommendationCard[];
};

type TeamDomainTab = {
  label: "Culture" | "Performance" | "Sustainability";
  scoreLabel: string;
  score: number;
  trendLabel: string;
  months: string[];
  trendValues: number[];
  keyMetrics: { label: string; value: string; note: string }[];
  signals: RichSignal[];
};

export type TeamDetailData = {
  slug: TeamSlug;
  name: string;
  lead: string;
  headcount: number;
  summary: { label: string; value: string; note: string }[];
  tabs: TeamDomainTab[];
};

const months12 = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
const months6 = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];

function makeSignal(config: {
  id: string;
  title: string;
  description: string;
  team: string;
  period: string;
  severity: RichSignal["severity"];
  confidence: RichSignal["confidence"];
  trendData: number[];
  trendLabel: string;
  trendUp: boolean | null;
  triggers: string[];
  contributingFactors: string[];
  suggestedAction: string;
  actionCta: string;
  lifecycleStep: RichSignal["lifecycleStep"];
  openedAt: string;
  tone?: "warning" | "positive" | "neutral";
}): RichSignal {
  const tone = config.tone ?? "neutral";

  const toneMap = {
    warning: {
      icon: "warning",
      iconWrapClass: "bg-[#ffdad6]/30 text-[#ba1a1a]",
      badgeClass: "bg-[#ffdad6] text-[#93000a]",
      badge: "ACTION REQUIRED",
    },
    positive: {
      icon: "verified",
      iconWrapClass: "bg-[#006841]/10 text-[#006841]",
      badgeClass: "bg-[#dcfce7] text-[#166534]",
      badge: "ON TRACK",
    },
    neutral: {
      icon: "trending_down",
      iconWrapClass: "bg-[#E6A817]/15 text-[#B07E10]",
      badgeClass: "bg-[#e5e2e1] text-[#3e4941]",
      badge: "MONITORING",
    },
  } as const;

  return {
    ...config,
    ...toneMap[tone],
    chartData: config.trendData,
    chartLabels: months12,
  };
}

export const scoreDetails: Record<DomainKey, ScoreDetailData> = {
  "envo-culture": {
    domain: "envo-culture",
    backLabel: "Culture",
    title: "Culture Health Score",
    score: "81.3",
    trendLabel: "+6% vs last month",
    trendPositive: true,
    months: months12,
    trendValues: [72, 73, 74, 75, 76, 77, 78, 77, 79, 80, 80, 81.3],
    comparisonStats: [
      { label: "vs Last Month", value: "+6%", note: "Belonging lifted overall morale" },
      { label: "vs Last Quarter", value: "+3%", note: "Trust recovered after manager reset" },
      { label: "vs Company Average", value: "+8%", note: "Above org baseline across 4 of 5 drivers" },
    ],
    driversHeading: "What's driving this score",
    drivers: [
      { name: "Belonging", contribution: 28, score: 84, trend: "up", explanation: "Peer connection activities increased 12% this quarter." },
      { name: "Psychological Safety", contribution: 24, score: 80, trend: "up", explanation: "Managers closed feedback loops faster after the January listening sprint." },
      { name: "Recognition", contribution: 18, score: 68, trend: "down", explanation: "Peer recognition volume dropped 35% in the Design team." },
      { name: "Feedback Culture", contribution: 14, score: 77, trend: "flat", explanation: "Response quality improved, but completion cadence stayed flat month over month." },
      { name: "Trust", contribution: 16, score: 79, trend: "up", explanation: "Leadership comms consistency improved after the Q1 planning reset." },
    ],
    teamAverage: 73,
    teamScores: [
      { name: "Engineering", slug: "engineering", score: 86 },
      { name: "Customer Success", slug: "customer-success", score: 82 },
      { name: "HR", slug: "hr", score: 80 },
      { name: "Product", slug: "product", score: 77 },
      { name: "Finance", slug: "finance", score: 74 },
      { name: "Operations", slug: "operations", score: 71 },
      { name: "Marketing", slug: "marketing", score: 69 },
      { name: "Design", slug: "design", score: 66 },
    ],
    aiExplanation: [
      "Your Culture Health Score rose this month primarily because belonging initiatives in Engineering and Customer Success translated into noticeably better connection behaviour. Peer introductions, mentoring circles, and weekly recognition prompts all created small but consistent lifts in how supported people reported feeling.",
      "The strongest improvement came from belonging. That driver is now contributing 28% of the overall score and is outperforming the company average by a wide margin. Psychological safety also improved after managers shortened the gap between collecting feedback and acting on it, which made people more willing to speak up.",
      "Recognition remains the clearest drag on the composite. Design is the main reason: recognition volume in that team has fallen sharply, and the effect is visible both in the driver breakdown and in the team comparison. If recognition in Design returns to its Q1 baseline, the composite score would likely move into the mid-80s next month.",
      "The practical takeaway is straightforward: keep reinforcing the belonging routines that are already working, but redirect manager attention toward recognition systems in the weakest teams. That is the single fastest lever available if you want Culture Health to improve again next cycle.",
    ],
  },
  "envo-performance": {
    domain: "envo-performance",
    backLabel: "Performance",
    title: "Performance Index",
    score: "78.4",
    trendLabel: "-3% vs last month",
    trendPositive: false,
    months: months12,
    trendValues: [81, 82, 83, 82, 84, 85, 84, 83, 82, 81, 79, 78.4],
    comparisonStats: [
      { label: "vs Last Month", value: "-3%", note: "Sprint spillover increased in Product and Marketing" },
      { label: "vs Last Quarter", value: "+1%", note: "Output quality stayed ahead of Q4 baseline" },
      { label: "vs Company Average", value: "+4% above", note: "Still outperforming org median despite delivery drag" },
    ],
    driversHeading: "What's driving this score",
    drivers: [
      { name: "Goal Completion", contribution: 31, score: 79, trend: "down", explanation: "Three Product milestones slipped beyond their planned sprint window." },
      { name: "Output Quality", contribution: 23, score: 83, trend: "up", explanation: "Defect escape rate fell after QA coverage expanded in Engineering." },
      { name: "Responsiveness", contribution: 17, score: 76, trend: "flat", explanation: "Cycle time stayed stable, but review bottlenecks remain in Product." },
      { name: "Capability Growth", contribution: 16, score: 81, trend: "up", explanation: "Data Engineering certifications lifted capability readiness this month." },
      { name: "Focus Efficiency", contribution: 13, score: 72, trend: "down", explanation: "Context switching increased after two urgent roadmap changes." },
    ],
    teamAverage: 75,
    teamScores: [
      { name: "Engineering", slug: "engineering", score: 84 },
      { name: "Finance", slug: "finance", score: 82 },
      { name: "HR", slug: "hr", score: 80 },
      { name: "Customer Success", slug: "customer-success", score: 78 },
      { name: "Product", slug: "product", score: 74 },
      { name: "Operations", slug: "operations", score: 71 },
      { name: "Sales", slug: "sales", score: 69 },
      { name: "Marketing", slug: "marketing", score: 63 },
    ],
    aiExplanation: [
      "Performance softened this month because execution consistency dipped in a small number of high-impact teams. The biggest effect came from Product, where milestone delays and changing priorities pulled goal completion down enough to outweigh stronger output quality elsewhere.",
      "This is not a broad productivity collapse. Engineering and Finance are still operating above the company average, and output quality has actually improved. The problem is concentration: missed commitments in a few teams are creating enough drag to move the headline score.",
      "Focus efficiency is the most fragile driver right now. Teams are spending more time on unplanned work and context switching, especially where roadmap changes were made late in the cycle. If that pattern continues, the score could keep sliding even if quality remains stable.",
      "The fastest recovery path is to stabilize planning. Reduce scope churn in Product, protect uninterrupted delivery time in Marketing, and keep capability investments going in Data Engineering. If those changes land in the next two sprints, the index should move back above 80.",
    ],
  },
  "envo-sustainability": {
    domain: "envo-sustainability",
    backLabel: "ESG",
    title: "ESG Health Score",
    score: "88.6",
    trendLabel: "+4% vs last quarter",
    trendPositive: true,
    months: months12,
    trendValues: [79, 80, 81, 82, 83, 84, 85, 86, 87, 87, 88, 88.6],
    comparisonStats: [
      { label: "vs Last Month", value: "+2%", note: "Waste diversion and governance reporting both improved" },
      { label: "vs Last Quarter", value: "+4%", note: "Environmental progress accelerated across 3 teams" },
      { label: "vs Company Average", value: "+11% above", note: "Top-tier governance and participation lift the score" },
    ],
    driversHeading: "What's driving this score",
    drivers: [
      { name: "Environmental", contribution: 34, score: 90, trend: "up", explanation: "Waste diversion gains in Berlin lifted the environmental baseline." },
      { name: "Social", contribution: 23, score: 82, trend: "flat", explanation: "Participation is steady, but wellbeing-related adoption is uneven by team." },
      { name: "Governance", contribution: 21, score: 93, trend: "up", explanation: "Board reporting cadence and policy completion remain best-in-class." },
      { name: "Reporting", contribution: 12, score: 88, trend: "up", explanation: "Manual reporting gaps narrowed after the February controls update." },
      { name: "Behaviour Adoption", contribution: 10, score: 75, trend: "down", explanation: "Commute emissions rose in Dublin after the attendance policy shift." },
    ],
    teamAverage: 78,
    teamScores: [
      { name: "Engineering", slug: "engineering", score: 91 },
      { name: "Product", slug: "product", score: 87 },
      { name: "Human Resources", slug: "human-resources", score: 85 },
      { name: "Operations", slug: "operations", score: 81 },
      { name: "Marketing", slug: "marketing", score: 74 },
      { name: "Sales", slug: "sales", score: 69 },
    ],
    aiExplanation: [
      "The ESG Health Score is rising because the organisation is executing well on the most structurally important parts of the programme. Governance remains exceptionally strong, reporting quality improved again this quarter, and environmental practices are now producing repeatable gains rather than one-off wins.",
      "Berlin is doing a lot of the heavy lifting on the environmental side. Its waste diversion programme created a visible uplift in the driver mix, and that improvement is large enough to move the overall score. Engineering and Product are also sustaining higher adoption rates than the rest of the company, which protects the top-line number.",
      "The main pressure point is behaviour adoption in teams most affected by attendance changes. Commute emissions in Dublin rose after the policy reset, and that is now limiting how quickly the environmental dimension can improve. If similar patterns spread, they will start to erode the headline score.",
      "In practical terms, the ESG programme is working, but it now needs targeted operational follow-through. Preserve the governance discipline, export Berlin's playbook, and intervene in the teams where commuting patterns are reversing earlier gains. That combination is what gets the score into the 90s sustainably.",
    ],
  },
};

export const pillarDetails: Record<DomainKey, Record<string, PillarDetailData>> = {
  "envo-culture": {
    belonging: {
      domain: "envo-culture",
      parentTitle: "Culture",
      title: "Belonging",
      status: "Strong",
      score: 84,
      trendLabel: "+5 points over 12 months",
      months: months12,
      trendValues: [71, 72, 73, 74, 75, 76, 77, 79, 80, 81, 83, 84],
      signals: [
        makeSignal({
          id: "belonging-eng-1",
          title: "Peer connection momentum: Engineering",
          description: "Mentor circle participation rose 18% in six weeks",
          team: "Engineering",
          period: "Last 6 weeks",
          severity: "Low",
          confidence: "Validated",
          trendData: [68, 70, 73, 76, 80, 84, 86, 88, 89, 90, 91, 92],
          trendLabel: "↑ Participation rising steadily",
          trendUp: true,
          triggers: [
            "Engineering's optional mentor circles are now attracting 64% of the team, up from 46% at the start of the quarter.",
            "Peer introductions for new joiners are being completed within the first two weeks, compared with a prior average of 24 days.",
            "Belonging survey comments in Engineering increasingly reference team support, visibility, and shared rituals.",
          ],
          contributingFactors: ["Mentor circles", "New joiner buddy coverage", "Weekly recognition ritual"],
          suggestedAction: "Document Engineering's connection routines and roll them out to Product and Marketing managers during the next people leadership forum.",
          actionCta: "Share Practice",
          lifecycleStep: "Resolved",
          openedAt: "Feb 22, 2026",
          tone: "positive",
        }),
        makeSignal({
          id: "belonging-design-1",
          title: "Belonging risk: Design",
          description: "Recognition and team rituals both declined this month",
          team: "Design",
          period: "Last 4 weeks",
          severity: "Material",
          confidence: "Corroborated",
          trendData: [84, 82, 79, 75, 70, 66, 63, 61, 60, 59, 58, 57],
          trendLabel: "↓ Team belonging sentiment softening",
          trendUp: false,
          triggers: [
            "Design's pulse responses show a drop in statements related to feeling seen and supported by peers.",
            "Peer recognition fell sharply after the team lead went on leave, and no substitute ritual was introduced.",
            "Cross-functional design reviews were cancelled twice this month, removing one of the team's strongest connection routines.",
          ],
          contributingFactors: ["Recognition drop", "Leadership gap", "Cancelled review rituals"],
          suggestedAction: "Reinstate weekly design reviews and assign an interim recognition lead before the next pulse cycle closes.",
          actionCta: "Stabilize Rituals",
          lifecycleStep: "Open",
          openedAt: "Mar 12, 2026",
          tone: "warning",
        }),
      ],
      heatmapMonths: months6,
      heatmapTeams: [
        { name: "Engineering", values: [76, 78, 80, 82, 84, 86] },
        { name: "Customer Success", values: [72, 74, 76, 78, 80, 82] },
        { name: "HR", values: [74, 74, 76, 78, 79, 80] },
        { name: "Product", values: [69, 70, 71, 73, 75, 77] },
        { name: "Finance", values: [67, 69, 70, 71, 73, 74] },
        { name: "Design", values: [72, 70, 67, 64, 62, 60] },
      ],
      recommendations: [
        { title: "Rebuild Design recognition rituals", body: "Reintroduce a weekly peer-shoutout block in Design standups and assign an interim recognition owner while the team lead is away.", owner: "People Ops" },
        { title: "Scale mentor circles", body: "Expand Engineering's mentor circle format to Product and Marketing to replicate its belonging gains without adding new survey overhead.", owner: "Culture PM" },
        { title: "Track new joiner buddy coverage", body: "Make buddy assignment completion visible in the onboarding dashboard so belonging risk is surfaced earlier for new hires.", owner: "Talent" },
      ],
    },
    "psychological-safety": {
      domain: "envo-culture",
      parentTitle: "Culture",
      title: "Psychological Safety",
      status: "Growing",
      score: 80,
      trendLabel: "+4 points over 12 months",
      months: months12,
      trendValues: [68, 69, 70, 71, 72, 73, 74, 75, 77, 78, 79, 80],
      signals: [
        makeSignal({
          id: "safety-prod-1",
          title: "Escalation comfort improving: Product",
          description: "More blockers are being raised before sprint end",
          team: "Product",
          period: "Last 8 weeks",
          severity: "Low",
          confidence: "Validated",
          trendData: [55, 58, 60, 64, 66, 70, 73, 75, 77, 79, 80, 82],
          trendLabel: "↑ Earlier escalation behavior",
          trendUp: true,
          triggers: [
            "Product teams are raising delivery blockers earlier in the sprint rather than waiting until review meetings.",
            "Managers are closing action items within the same cycle more consistently, reinforcing that speaking up changes outcomes.",
            "Anonymous pulse comments show reduced fear of negative consequences after raising concerns.",
          ],
          contributingFactors: ["Earlier blocker escalation", "Faster manager follow-through", "Improved retro structure"],
          suggestedAction: "Keep the current retro cadence in place and export the escalation template to Operations and Sales.",
          actionCta: "Export Template",
          lifecycleStep: "Resolved",
          openedAt: "Feb 10, 2026",
          tone: "positive",
        }),
      ],
      heatmapMonths: months6,
      heatmapTeams: [
        { name: "Engineering", values: [74, 76, 77, 78, 80, 81] },
        { name: "Product", values: [68, 69, 71, 73, 77, 79] },
        { name: "Finance", values: [72, 72, 73, 74, 75, 76] },
        { name: "Operations", values: [64, 65, 66, 68, 69, 70] },
        { name: "Sales", values: [61, 63, 64, 65, 66, 67] },
        { name: "Marketing", values: [60, 61, 62, 64, 65, 66] },
      ],
      recommendations: [
        { title: "Roll out escalation playbooks", body: "Adopt Product's blocker-raising format in lower-trust teams so issues surface earlier and more consistently.", owner: "Ops Excellence" },
        { title: "Coach meeting leaders", body: "Train managers to explicitly close the loop on raised concerns during the same week to keep safety gains visible.", owner: "L&D" },
      ],
    },
    recognition: {
      domain: "envo-culture",
      parentTitle: "Culture",
      title: "Recognition",
      status: "Steady",
      score: 68,
      trendLabel: "-6 points over 12 months",
      months: months12,
      trendValues: [74, 74, 73, 73, 72, 71, 70, 70, 69, 69, 68, 68],
      signals: [
        makeSignal({
          id: "recognition-design-1",
          title: "Recognition gap: Design",
          description: "Peer recognition volume fell from 28 to 4 this month",
          team: "Design",
          period: "Current month",
          severity: "Critical",
          confidence: "Corroborated",
          trendData: [90, 86, 81, 77, 72, 64, 58, 47, 35, 28, 20, 18],
          trendLabel: "↓ Sharp recognition collapse",
          trendUp: false,
          triggers: [
            "Recognition submissions in Design are at their lowest point in 18 months.",
            "The drop started immediately after the previous team lead went on leave and has not self-corrected.",
            "Open-ended comments now reference invisible work and low appreciation more frequently than any other team.",
          ],
          contributingFactors: ["Leadership absence", "No replacement ritual", "Project crunch"],
          suggestedAction: "Run a two-week recognition recovery sprint in Design and track daily submissions to confirm the routine restarts.",
          actionCta: "Recover Recognition",
          lifecycleStep: "Open",
          openedAt: "Mar 14, 2026",
          tone: "warning",
        }),
      ],
      heatmapMonths: months6,
      heatmapTeams: [
        { name: "Engineering", values: [70, 72, 74, 76, 77, 79] },
        { name: "HR", values: [67, 68, 70, 71, 73, 74] },
        { name: "Customer Success", values: [66, 68, 69, 70, 71, 72] },
        { name: "Marketing", values: [63, 62, 61, 60, 59, 58] },
        { name: "Product", values: [64, 65, 65, 66, 67, 67] },
        { name: "Design", values: [72, 68, 62, 55, 48, 44] },
      ],
      recommendations: [
        { title: "Appoint recognition champions", body: "Assign one person in each team to maintain weekly peer-recognition rituals so activity does not depend on one manager.", owner: "People Ops" },
        { title: "Reinstate public wins", body: "Bring back cross-team shoutouts in the Friday wrap-up so invisible work is seen outside the immediate team.", owner: "Internal Comms" },
      ],
    },
    "feedback-culture": {
      domain: "envo-culture",
      parentTitle: "Culture",
      title: "Feedback Culture",
      status: "Emerging",
      score: 77,
      trendLabel: "+3 points over 12 months",
      months: months12,
      trendValues: [70, 70, 71, 72, 73, 73, 74, 75, 75, 76, 76, 77],
      signals: [
        makeSignal({
          id: "feedback-eng-1",
          title: "Feedback loops healthy: Engineering",
          description: "89% of requested feedback completed on time",
          team: "Engineering",
          period: "Last 8 weeks",
          severity: "Low",
          confidence: "Validated",
          trendData: [72, 74, 77, 79, 82, 84, 86, 87, 88, 89, 89, 89],
          trendLabel: "↑ Stable at high completion",
          trendUp: true,
          triggers: [
            "Engineering's feedback completion rate has remained above 85% for two months.",
            "Managers are now reviewing overdue requests every Monday, which reduced aging items to zero.",
          ],
          contributingFactors: ["Manager review ritual", "Clear SLAs", "Feedback prompt templates"],
          suggestedAction: "Use Engineering's cadence as the template for teams with low completion rates.",
          actionCta: "Reuse Playbook",
          lifecycleStep: "Resolved",
          openedAt: "Feb 3, 2026",
          tone: "positive",
        }),
      ],
      heatmapMonths: months6,
      heatmapTeams: [
        { name: "Engineering", values: [81, 82, 84, 86, 88, 89] },
        { name: "Finance", values: [72, 73, 74, 75, 77, 78] },
        { name: "Product", values: [68, 70, 71, 72, 73, 74] },
        { name: "Customer Success", values: [66, 68, 69, 70, 72, 73] },
        { name: "Marketing", values: [61, 62, 63, 64, 65, 66] },
        { name: "Sales", values: [59, 60, 61, 62, 63, 64] },
      ],
      recommendations: [
        { title: "Set feedback SLAs", body: "Make response expectations explicit so teams know feedback is a real workflow rather than optional admin.", owner: "People Systems" },
      ],
    },
  },
  "envo-performance": {
    "goal-completion": {
      domain: "envo-performance",
      parentTitle: "Performance",
      title: "Goal Completion",
      status: "82%",
      score: 82,
      trendLabel: "-4 points over 12 months",
      months: months12,
      trendValues: [86, 86, 85, 85, 84, 84, 83, 83, 82, 82, 81, 82],
      signals: [
        makeSignal({
          id: "goals-product-1",
          title: "Goal slippage: Product",
          description: "Three milestones slipped over two sprints",
          team: "Product",
          period: "Last 2 sprints",
          severity: "Critical",
          confidence: "Corroborated",
          trendData: [88, 87, 86, 84, 82, 80, 77, 74, 70, 69, 68, 67],
          trendLabel: "↓ Milestone confidence falling",
          trendUp: false,
          triggers: [
            "Authentication, billing, and onboarding milestones all slipped within the same release window.",
            "Review bottlenecks added 4-5 days to delivery in each case.",
            "The team is currently carrying too many parallel initiatives for the available senior review capacity.",
          ],
          contributingFactors: ["Review bottlenecks", "Parallel priorities", "Scope creep"],
          suggestedAction: "Reduce Product's active milestone load by one major stream and move billing polish items into the next increment.",
          actionCta: "Rebalance Scope",
          lifecycleStep: "Open",
          openedAt: "Mar 18, 2026",
          tone: "warning",
        }),
      ],
      heatmapMonths: months6,
      heatmapTeams: [
        { name: "Finance", values: [84, 85, 86, 86, 87, 88] },
        { name: "Engineering", values: [82, 83, 84, 84, 85, 84] },
        { name: "HR", values: [80, 80, 81, 82, 82, 83] },
        { name: "Customer Success", values: [79, 80, 80, 79, 78, 78] },
        { name: "Product", values: [84, 82, 79, 76, 74, 74] },
        { name: "Marketing", values: [70, 68, 66, 64, 62, 63] },
      ],
      recommendations: [
        { title: "Protect review bandwidth", body: "Reserve senior reviewer capacity at the start of the cycle instead of borrowing it from adjacent roadmap work.", owner: "Product Ops" },
        { title: "Reduce parallel work", body: "Limit each Product pod to fewer active milestone streams so confidence recovers before the next release checkpoint.", owner: "Product Leadership" },
      ],
    },
    "output-quality": {
      domain: "envo-performance",
      parentTitle: "Performance",
      title: "Output Quality",
      status: "High",
      score: 83,
      trendLabel: "+5 points over 12 months",
      months: months12,
      trendValues: [74, 75, 76, 77, 78, 79, 80, 80, 81, 82, 83, 83],
      signals: [
        makeSignal({
          id: "quality-eng-1",
          title: "Quality uplift: Engineering",
          description: "Defect escape rate down 22% after QA expansion",
          team: "Engineering",
          period: "Last quarter",
          severity: "Low",
          confidence: "Validated",
          trendData: [62, 64, 66, 69, 72, 75, 78, 80, 82, 84, 85, 86],
          trendLabel: "↑ Quality trending upward",
          trendUp: true,
          triggers: [
            "Additional automated test coverage reduced regression issues in the checkout and authentication flows.",
            "Design-review signoff was moved earlier in the sprint, preventing late-stage rework.",
          ],
          contributingFactors: ["QA automation", "Earlier design signoff", "Definition of done refresh"],
          suggestedAction: "Extend the same QA and design review sequence to Product's highest-risk release streams.",
          actionCta: "Replicate Process",
          lifecycleStep: "Resolved",
          openedAt: "Jan 30, 2026",
          tone: "positive",
        }),
      ],
      heatmapMonths: months6,
      heatmapTeams: [
        { name: "Engineering", values: [78, 80, 81, 82, 84, 86] },
        { name: "Finance", values: [77, 78, 79, 80, 81, 82] },
        { name: "Product", values: [73, 74, 74, 75, 76, 77] },
        { name: "Customer Success", values: [70, 71, 72, 72, 73, 74] },
        { name: "Sales", values: [66, 66, 67, 68, 68, 69] },
        { name: "Marketing", values: [65, 65, 66, 66, 67, 67] },
      ],
      recommendations: [
        { title: "Shift review left", body: "Move design and QA signoff earlier in the cycle to preserve the quality gains already visible in Engineering.", owner: "Delivery Excellence" },
      ],
    },
    responsiveness: {
      domain: "envo-performance",
      parentTitle: "Performance",
      title: "Responsiveness",
      status: "Stable",
      score: 76,
      trendLabel: "+1 point over 12 months",
      months: months12,
      trendValues: [74, 74, 75, 74, 75, 75, 76, 76, 76, 76, 76, 76],
      signals: [
        makeSignal({
          id: "responsive-cs-1",
          title: "Service responsiveness steady: Customer Success",
          description: "First response time holding within SLA",
          team: "Customer Success",
          period: "Current quarter",
          severity: "Low",
          confidence: "Validated",
          trendData: [72, 72, 73, 74, 74, 75, 76, 76, 77, 76, 76, 76],
          trendLabel: "→ Stable service cadence",
          trendUp: null,
          triggers: [
            "Customer Success has stayed within its response SLA despite increased ticket complexity.",
            "Response time consistency is good, but throughput is nearing the point where one absence could create backlog risk.",
          ],
          contributingFactors: ["Stable staffing", "Queue triage", "Template library"],
          suggestedAction: "Cross-train two adjacent team members so responsiveness remains stable during leave periods.",
          actionCta: "Cross-train Team",
          lifecycleStep: "Actioned",
          openedAt: "Feb 14, 2026",
          tone: "neutral",
        }),
      ],
      heatmapMonths: months6,
      heatmapTeams: [
        { name: "Customer Success", values: [74, 75, 75, 76, 76, 76] },
        { name: "Finance", values: [73, 73, 74, 75, 75, 76] },
        { name: "Operations", values: [70, 70, 71, 72, 72, 72] },
        { name: "Product", values: [69, 70, 71, 71, 72, 72] },
        { name: "Sales", values: [68, 68, 69, 69, 70, 70] },
        { name: "Marketing", values: [66, 66, 67, 67, 68, 68] },
      ],
      recommendations: [
        { title: "Build surge coverage", body: "Create adjacent-team coverage for the most time-sensitive workflows so responsiveness is not dependent on one queue owner.", owner: "Operations" },
      ],
    },
    "growth-velocity": {
      domain: "envo-performance",
      parentTitle: "Performance",
      title: "Growth Velocity",
      status: "Accelerating",
      score: 81,
      trendLabel: "+8 points over 12 months",
      months: months12,
      trendValues: [68, 69, 70, 72, 73, 74, 76, 77, 78, 79, 80, 81],
      signals: [
        makeSignal({
          id: "growth-dataeng-1",
          title: "Capability growth returning: Data Engineering",
          description: "Structured learning plan raised readiness 9 points",
          team: "Engineering",
          period: "Last quarter",
          severity: "Low",
          confidence: "Validated",
          trendData: [58, 60, 62, 64, 66, 69, 72, 74, 76, 78, 80, 81],
          trendLabel: "↑ Capability readiness improving",
          trendUp: true,
          triggers: [
            "Three team members completed stream-processing coursework aligned to upcoming roadmap needs.",
            "Weekly knowledge-sharing sessions are reducing the gap between trained and untrained team members.",
          ],
          contributingFactors: ["Focused learning plan", "Mentored practice", "Capability reviews"],
          suggestedAction: "Continue the current learning cadence and add one applied project milestone to lock in the skill gains.",
          actionCta: "Extend Program",
          lifecycleStep: "Resolved",
          openedAt: "Jan 12, 2026",
          tone: "positive",
        }),
      ],
      heatmapMonths: months6,
      heatmapTeams: [
        { name: "Engineering", values: [70, 72, 74, 77, 79, 81] },
        { name: "Product", values: [68, 69, 70, 72, 74, 76] },
        { name: "Finance", values: [66, 67, 68, 70, 72, 73] },
        { name: "HR", values: [64, 65, 67, 68, 70, 72] },
        { name: "Operations", values: [61, 62, 63, 64, 66, 67] },
        { name: "Sales", values: [59, 60, 61, 62, 63, 64] },
      ],
      recommendations: [
        { title: "Tie learning to roadmap", body: "Convert growth gains into delivery outcomes by linking each learning track to one concrete project milestone.", owner: "L&D" },
      ],
    },
  },
  "envo-sustainability": {
    environmental: {
      domain: "envo-sustainability",
      parentTitle: "ESG",
      title: "Environmental",
      status: "Strong",
      score: 90,
      trendLabel: "+7 points over 12 months",
      months: months12,
      trendValues: [76, 77, 78, 79, 80, 82, 84, 85, 86, 88, 89, 90],
      signals: [
        makeSignal({
          id: "env-berlin-1",
          title: "Zero-waste milestone: Berlin",
          description: "Waste diversion held above 95% for 12 weeks",
          team: "Operations",
          period: "Last 3 months",
          severity: "Low",
          confidence: "Validated",
          trendData: [72, 76, 80, 84, 87, 90, 92, 94, 95, 95, 95, 96],
          trendLabel: "↑ Waste diversion sustained",
          trendUp: true,
          triggers: [
            "Berlin's composting and packaging reduction programme is now producing stable results rather than one-off spikes.",
            "Participation stayed high even after initial launch enthusiasm faded, indicating the behaviour is sticking.",
          ],
          contributingFactors: ["Composting", "Packaging reduction", "Site lead sponsorship"],
          suggestedAction: "Replicate Berlin's operating model in the next two lowest-performing sites with the same playbook and rollout sequence.",
          actionCta: "Scale Playbook",
          lifecycleStep: "Resolved",
          openedAt: "Dec 10, 2025",
          tone: "positive",
        }),
        makeSignal({
          id: "env-dublin-1",
          title: "Commute emissions rising: Dublin",
          description: "Commuting footprint up 18% after attendance reset",
          team: "Operations",
          period: "Last 8 weeks",
          severity: "Material",
          confidence: "Corroborated",
          trendData: [68, 69, 70, 72, 74, 77, 80, 83, 86, 89, 92, 95],
          trendLabel: "↓ Carbon trend worsening",
          trendUp: false,
          triggers: [
            "Required in-office attendance reduced remote working days and increased commute emissions materially.",
            "Public transport uptake has not increased enough to offset the policy change.",
          ],
          contributingFactors: ["Attendance policy shift", "Low transit adoption", "No commute incentive"],
          suggestedAction: "Pilot a transit subsidy and cycle-to-work incentive in Dublin before expanding attendance expectations further.",
          actionCta: "Launch Incentive",
          lifecycleStep: "Open",
          openedAt: "Mar 20, 2026",
          tone: "warning",
        }),
      ],
      heatmapMonths: months6,
      heatmapTeams: [
        { name: "Engineering", values: [82, 84, 85, 87, 89, 91] },
        { name: "Product", values: [79, 80, 82, 84, 85, 87] },
        { name: "Human Resources", values: [76, 77, 78, 80, 82, 85] },
        { name: "Operations", values: [74, 75, 77, 79, 80, 81] },
        { name: "Marketing", values: [69, 70, 71, 72, 73, 74] },
        { name: "Sales", values: [64, 65, 66, 67, 68, 69] },
      ],
      recommendations: [
        { title: "Copy Berlin's site playbook", body: "Use the same operational sequence Berlin used so environmental gains come from routine, not one-off campaigns.", owner: "ESG Program" },
        { title: "Correct commute regression", body: "Counter the Dublin emissions spike with transport incentives before the policy change creates a new baseline.", owner: "Site Ops" },
      ],
    },
    social: {
      domain: "envo-sustainability",
      parentTitle: "ESG",
      title: "Social",
      status: "Growing",
      score: 82,
      trendLabel: "+3 points over 12 months",
      months: months12,
      trendValues: [76, 76, 77, 77, 78, 78, 79, 80, 80, 81, 81, 82],
      signals: [
        makeSignal({
          id: "social-hr-1",
          title: "Inclusive participation expanding",
          description: "Wellbeing and inclusion programme reach widened this quarter",
          team: "Human Resources",
          period: "Current quarter",
          severity: "Low",
          confidence: "Validated",
          trendData: [70, 71, 72, 73, 75, 76, 77, 78, 79, 80, 81, 82],
          trendLabel: "↑ Broader participation",
          trendUp: true,
          triggers: [
            "Programme participation is expanding beyond HQ-heavy teams into field and operations groups.",
            "Completion rates are strongest where managers actively schedule time for the programmes.",
          ],
          contributingFactors: ["Manager sponsorship", "Better scheduling", "Clearer communications"],
          suggestedAction: "Protect manager-sponsored participation windows in lower-uptake teams before attention shifts back to delivery pressure.",
          actionCta: "Protect Participation",
          lifecycleStep: "Actioned",
          openedAt: "Feb 4, 2026",
          tone: "positive",
        }),
      ],
      heatmapMonths: months6,
      heatmapTeams: [
        { name: "Human Resources", values: [80, 80, 81, 82, 83, 85] },
        { name: "Engineering", values: [76, 77, 78, 79, 80, 81] },
        { name: "Product", values: [75, 76, 77, 78, 79, 80] },
        { name: "Operations", values: [72, 73, 73, 74, 75, 76] },
        { name: "Marketing", values: [69, 70, 71, 72, 72, 73] },
        { name: "Sales", values: [66, 67, 67, 68, 69, 70] },
      ],
      recommendations: [
        { title: "Lock in manager sponsorship", body: "Social performance improves where team leads explicitly create time for participation. Make that behaviour a requirement, not an exception.", owner: "People & ESG" },
      ],
    },
    governance: {
      domain: "envo-sustainability",
      parentTitle: "ESG",
      title: "Governance",
      status: "Peak",
      score: 93,
      trendLabel: "+6 points over 12 months",
      months: months12,
      trendValues: [84, 85, 86, 87, 88, 88, 89, 90, 91, 92, 92, 93],
      signals: [
        makeSignal({
          id: "gov-finance-1",
          title: "Reporting control strength high",
          description: "Quarter-end governance reviews closed with no critical gaps",
          team: "Finance",
          period: "Last quarter",
          severity: "Low",
          confidence: "Validated",
          trendData: [82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93],
          trendLabel: "↑ Control maturity rising",
          trendUp: true,
          triggers: [
            "The latest governance review cycle closed with all critical actions completed on time.",
            "Data lineage and signoff ownership are now clearer, reducing reporting ambiguity.",
          ],
          contributingFactors: ["Board review cadence", "Clear ownership", "Documented controls"],
          suggestedAction: "Keep the same governance cadence and add one stress test to the next reporting cycle to confirm resilience under time pressure.",
          actionCta: "Run Stress Test",
          lifecycleStep: "Resolved",
          openedAt: "Jan 18, 2026",
          tone: "positive",
        }),
      ],
      heatmapMonths: months6,
      heatmapTeams: [
        { name: "Finance", values: [88, 89, 90, 91, 92, 93] },
        { name: "Human Resources", values: [84, 85, 86, 87, 88, 89] },
        { name: "Engineering", values: [82, 83, 84, 85, 86, 87] },
        { name: "Operations", values: [79, 80, 81, 82, 83, 84] },
        { name: "Product", values: [77, 78, 79, 80, 81, 82] },
        { name: "Sales", values: [72, 73, 74, 75, 76, 77] },
      ],
      recommendations: [
        { title: "Maintain control discipline", body: "Governance is strongest where ownership is explicit. Protect that clarity as reporting scope grows.", owner: "Finance" },
      ],
    },
    reporting: {
      domain: "envo-sustainability",
      parentTitle: "ESG",
      title: "Reporting",
      status: "Compliant",
      score: 88,
      trendLabel: "+5 points over 12 months",
      months: months12,
      trendValues: [76, 77, 78, 79, 80, 82, 83, 84, 85, 86, 87, 88],
      signals: [
        makeSignal({
          id: "reporting-fin-1",
          title: "Manual reporting gaps narrowing",
          description: "Two manual reconciliations were automated this quarter",
          team: "Finance",
          period: "Current quarter",
          severity: "Low",
          confidence: "Validated",
          trendData: [70, 72, 74, 76, 78, 79, 81, 83, 84, 86, 87, 88],
          trendLabel: "↑ Reporting reliability improving",
          trendUp: true,
          triggers: [
            "Automation reduced manual reconciliation effort and removed two recurring month-end delays.",
            "Audit readiness improved because control evidence is now easier to retrieve.",
          ],
          contributingFactors: ["Automation", "Cleaner ownership", "Better evidence trails"],
          suggestedAction: "Automate the remaining high-friction reconciliation and retire the old spreadsheet-only workflow before Q3 reporting begins.",
          actionCta: "Automate Workflow",
          lifecycleStep: "Actioned",
          openedAt: "Feb 9, 2026",
          tone: "positive",
        }),
      ],
      heatmapMonths: months6,
      heatmapTeams: [
        { name: "Finance", values: [82, 83, 84, 85, 87, 88] },
        { name: "Operations", values: [76, 77, 78, 80, 81, 82] },
        { name: "Human Resources", values: [75, 76, 77, 78, 79, 80] },
        { name: "Engineering", values: [73, 74, 75, 76, 77, 78] },
        { name: "Product", values: [70, 71, 72, 73, 74, 75] },
        { name: "Sales", values: [66, 67, 68, 69, 70, 71] },
      ],
      recommendations: [
        { title: "Finish the automation path", body: "The remaining reporting friction is operational, not strategic. Remove the last manual step and compliance risk falls again.", owner: "Reporting Ops" },
      ],
    },
  },
};

function teamSignals(name: string, label: "Culture" | "Performance" | "Sustainability"): RichSignal[] {
  if (label === "Culture") {
    return [
      makeSignal({
        id: `${name}-culture-signal`,
        title: `${name} connection rhythm`,
        description: "Team rituals are shaping belonging and trust patterns",
        team: name,
        period: "Last 6 weeks",
        severity: "Material",
        confidence: "Indicative",
        trendData: [68, 69, 70, 72, 73, 74, 74, 75, 76, 77, 78, 79],
        trendLabel: "↑ Culture signals improving",
        trendUp: true,
        triggers: [
          `${name} has increased participation in regular team rituals and peer feedback moments over the last six weeks.`,
          "Belonging-related pulse comments are more positive where managers are closing the loop on actions visibly.",
        ],
        contributingFactors: ["Ritual consistency", "Manager follow-through", "Peer recognition"],
        suggestedAction: `Keep the visible rituals in ${name} consistent and reinforce them with a short manager playbook.`,
        actionCta: "Codify Routine",
        lifecycleStep: "Actioned",
        openedAt: "Mar 1, 2026",
        tone: "neutral",
      }),
    ];
  }

  if (label === "Performance") {
    return [
      makeSignal({
        id: `${name}-performance-signal`,
        title: `${name} execution pattern`,
        description: "Delivery stability is the main driver of current team performance",
        team: name,
        period: "Current quarter",
        severity: "Material",
        confidence: "Corroborated",
        trendData: [74, 75, 76, 76, 77, 78, 79, 79, 80, 80, 81, 81],
        trendLabel: "→ Performance stable with some pressure",
        trendUp: null,
        triggers: [
          `${name} is meeting most commitments, but the team's score is sensitive to review bottlenecks and scope churn.`,
          "Where planning is stable, output quality holds. Where priorities move late, the score softens quickly.",
        ],
        contributingFactors: ["Planning stability", "Review throughput", "Focus time"],
        suggestedAction: `Protect focus time in ${name} and reduce last-minute priority changes before the next reporting cycle.`,
        actionCta: "Protect Focus",
        lifecycleStep: "Open",
        openedAt: "Mar 7, 2026",
        tone: "neutral",
      }),
    ];
  }

  return [
    makeSignal({
      id: `${name}-sustainability-signal`,
      title: `${name} behaviour adoption`,
      description: "ESG outcomes are tracking closely to day-to-day team habits",
      team: name,
      period: "Current quarter",
      severity: "Low",
      confidence: "Validated",
      trendData: [70, 71, 73, 74, 76, 77, 78, 79, 80, 81, 82, 83],
      trendLabel: "↑ Adoption trend strengthening",
      trendUp: true,
      triggers: [
        `${name} shows stronger ESG outcomes where team routines make low-carbon and compliant choices easier by default.`,
        "The biggest swings still come from commute and reporting behaviours rather than formal policy gaps.",
      ],
      contributingFactors: ["Routine adoption", "Local leadership", "Operational defaults"],
      suggestedAction: `Make the highest-performing ESG habit in ${name} visible and repeatable so it becomes a team norm.`,
      actionCta: "Scale Habit",
      lifecycleStep: "Actioned",
      openedAt: "Feb 28, 2026",
      tone: "positive",
    }),
  ];
}

function createTeamDetail(
  slug: TeamSlug,
  name: string,
  lead: string,
  headcount: number,
  scores: {
    culture: number;
    performance: number;
    sustainability: number;
  },
): TeamDetailData {
  return {
    slug,
    name,
    lead,
    headcount,
    summary: [
      { label: "Engagement", value: `${Math.round((scores.culture + 4) * 10) / 10}%`, note: "Pulse + participation composite" },
      { label: "Delivery Health", value: `${Math.round((scores.performance + 1) * 10) / 10}%`, note: "Commitment confidence" },
      { label: "ESG Adoption", value: `${Math.round((scores.sustainability - 2) * 10) / 10}%`, note: "Behaviour change index" },
      { label: "Headcount Stability", value: "96%", note: "Retention over last 2 quarters" },
    ],
    tabs: [
      {
        label: "Culture",
        scoreLabel: "Culture score",
        score: scores.culture,
        trendLabel: "+3 pts in 90 days",
        months: months12,
        trendValues: [scores.culture - 7, scores.culture - 6, scores.culture - 5, scores.culture - 4, scores.culture - 4, scores.culture - 3, scores.culture - 2, scores.culture - 2, scores.culture - 1, scores.culture, scores.culture, scores.culture],
        keyMetrics: [
          { label: "Belonging", value: `${scores.culture}%`, note: "Peer connection is the strongest culture lever" },
          { label: "Recognition", value: `${Math.max(scores.culture - 8, 58)}%`, note: "Recognition remains less consistent than belonging" },
          { label: "Feedback cadence", value: "84%", note: "Most 1:1 follow-ups land within SLA" },
        ],
        signals: teamSignals(name, "Culture"),
      },
      {
        label: "Performance",
        scoreLabel: "Performance score",
        score: scores.performance,
        trendLabel: "Stable over 2 sprints",
        months: months12,
        trendValues: [scores.performance - 5, scores.performance - 4, scores.performance - 4, scores.performance - 3, scores.performance - 2, scores.performance - 2, scores.performance - 1, scores.performance - 1, scores.performance, scores.performance, scores.performance, scores.performance],
        keyMetrics: [
          { label: "Goal completion", value: `${Math.max(scores.performance - 1, 58)}%`, note: "Delivery predictability is the main constraint" },
          { label: "Cycle efficiency", value: `${Math.max(scores.performance - 4, 55)}%`, note: "Late priority changes create avoidable drag" },
          { label: "Quality", value: `${Math.min(scores.performance + 3, 92)}%`, note: "Output quality is holding ahead of throughput" },
        ],
        signals: teamSignals(name, "Performance"),
      },
      {
        label: "Sustainability",
        scoreLabel: "Sustainability score",
        score: scores.sustainability,
        trendLabel: "+2 pts this quarter",
        months: months12,
        trendValues: [scores.sustainability - 6, scores.sustainability - 5, scores.sustainability - 4, scores.sustainability - 4, scores.sustainability - 3, scores.sustainability - 2, scores.sustainability - 2, scores.sustainability - 1, scores.sustainability - 1, scores.sustainability, scores.sustainability, scores.sustainability],
        keyMetrics: [
          { label: "Behaviour adoption", value: `${Math.max(scores.sustainability - 3, 60)}%`, note: "Habits are improving but not fully embedded" },
          { label: "Reporting discipline", value: `${Math.min(scores.sustainability + 5, 95)}%`, note: "Controls and completion remain strong" },
          { label: "Low-carbon routines", value: `${Math.max(scores.sustainability - 6, 58)}%`, note: "Commute and waste habits drive most variance" },
        ],
        signals: teamSignals(name, "Sustainability"),
      },
    ],
  };
}

export const teamDetails: Record<TeamSlug, TeamDetailData> = {
  engineering: createTeamDetail("engineering", "Engineering", "Amina Rahman", 64, { culture: 86, performance: 84, sustainability: 91 }),
  design: createTeamDetail("design", "Design", "Leo Alvarez", 18, { culture: 66, performance: 72, sustainability: 77 }),
  product: createTeamDetail("product", "Product", "Maya Thompson", 31, { culture: 77, performance: 74, sustainability: 87 }),
  finance: createTeamDetail("finance", "Finance", "Priya Menon", 22, { culture: 74, performance: 82, sustainability: 88 }),
  "customer-success": createTeamDetail("customer-success", "Customer Success", "Jordan Kim", 27, { culture: 82, performance: 78, sustainability: 79 }),
  operations: createTeamDetail("operations", "Operations", "Daniel Osei", 24, { culture: 71, performance: 71, sustainability: 81 }),
  sales: createTeamDetail("sales", "Sales", "Rina Patel", 29, { culture: 70, performance: 69, sustainability: 69 }),
  marketing: createTeamDetail("marketing", "Marketing", "Chloe Martin", 21, { culture: 69, performance: 63, sustainability: 74 }),
  hr: createTeamDetail("hr", "HR", "Sonia Kapoor", 16, { culture: 80, performance: 80, sustainability: 85 }),
  "human-resources": createTeamDetail("human-resources", "Human Resources", "Sonia Kapoor", 16, { culture: 80, performance: 80, sustainability: 85 }),
};

export function getTeamHrefBySlug(slug: TeamSlug) {
  return `/dashboard/team/${slug}`;
}

export function getTeamHrefByName(name: string) {
  const mapping: Record<string, TeamSlug> = {
    Engineering: "engineering",
    Design: "design",
    Product: "product",
    Finance: "finance",
    "Customer Success": "customer-success",
    Operations: "operations",
    Sales: "sales",
    Marketing: "marketing",
    HR: "hr",
    "Human Resources": "human-resources",
  };

  const slug = mapping[name];
  return slug ? getTeamHrefBySlug(slug) : null;
}
