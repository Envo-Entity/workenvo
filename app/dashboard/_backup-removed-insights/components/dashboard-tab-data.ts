import type { ImpactEntry } from "./action-impact-log";

export const cultureImpacts: ImpactEntry[] = [
  {
    action: "Peer recognition prompt sent to Design",
    triggeredBy: "Alex Mercer, CHRO",
    date: "Mar 8, 2026",
    result: "Recognition activity increased 42% over 2 weeks after the prompt reintroduced a visible team ritual.",
    before: "Recognition: 4/week",
    after: "Recognition: 18/week",
    outcome: "Improved",
  },
  {
    action: "Belonging workshop scheduled for Sales",
    triggeredBy: "Sarah Chen",
    date: "Feb 22, 2026",
    result: "Belonging sentiment recovered as workshop participation led to more peer support mentions in pulse comments.",
    before: "Belonging score: 68",
    after: "Belonging score: 72",
    outcome: "Improved",
  },
  {
    action: "1:1 cadence reminder sent to Marketing managers",
    triggeredBy: "System",
    date: "Mar 1, 2026",
    result: "Managers acknowledged the reminder, but feedback completion did not improve in the following cycle.",
    before: "Feedback completion: 71%",
    after: "Feedback completion: 71%",
    outcome: "No Change",
  },
];

export const performanceImpacts: ImpactEntry[] = [
  {
    action: "Workload rebalanced for Marcus (4 projects → 2)",
    triggeredBy: "Alex Mercer",
    date: "Mar 12, 2026",
    result: "Sprint completion rebounded once focus time was protected and review work stopped spilling across projects.",
    before: "Sprint completion: 60%",
    after: "Sprint completion: 85%",
    outcome: "Improved",
  },
  {
    action: "Skill development plan created for Data Engineering",
    triggeredBy: "HR",
    date: "Feb 28, 2026",
    result: "Capability moved slightly, but the team is still below the threshold needed for upcoming delivery commitments.",
    before: "Capability score: 62",
    after: "Capability score: 64",
    outcome: "Needs Follow-up",
  },
  {
    action: "Goal deadline extended for Q2 Product Launch",
    triggeredBy: "Product Lead",
    date: "Mar 15, 2026",
    result: "Milestone completion rose after the team regained enough space to sequence launch-critical work properly.",
    before: "Milestone completion: 38%",
    after: "Milestone completion: 50%",
    outcome: "Improved",
  },
];

export const sustainabilityImpacts: ImpactEntry[] = [
  {
    action: "Green commute incentive launched",
    triggeredBy: "Alex Mercer",
    date: "Mar 1, 2026",
    result: "Commute emissions moved back below baseline as transit uptake increased and one hybrid day was restored.",
    before: "Commute emissions: +18%",
    after: "Commute emissions: -3%",
    outcome: "Improved",
  },
  {
    action: "Waste audit initiated for Dublin office",
    triggeredBy: "Facilities",
    date: "Feb 15, 2026",
    result: "Diversion improved, but contamination remains high enough that the site still trails the stronger offices materially.",
    before: "Diversion rate: 78%",
    after: "Diversion rate: 82%",
    outcome: "Needs Follow-up",
  },
];
