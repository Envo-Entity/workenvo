// ── Dashboard UI types ────────────────────────────────────────────
export type Tone = "high" | "mid" | "low";
export type Severity = "hot" | "warm" | "cool";

export type Risk = {
  rank: string;
  title: string;
  why: string;
  sev: Severity;
  spark: number[];
  dir: "up" | "down";
};

export type Signal = {
  id?: number;
  title: string;
  meta: string;
  sev: Severity;
  bornSec?: number;
  time?: string;
};

export type ActionItem = {
  title: string;
  meta: string;
  impact: string;
  done: boolean;
};

export type DashboardData = {
  healthScore: number;
  healthDelta: number;
  pillars: { name: string; val: number; tone: Tone }[];
  healthTrend: number[];
  topRisks: Risk[];
  attrition: { high: number; moderate: number; stable: number; mostAffected: string };
  heatTeams: { team: string; row: number[]; level: "High" | "Medium" | "Low" }[];
  managers: { name: string; team: string; effect: number; delta: number }[];
  engagement: { months: string[]; company: number[]; team: number[]; benchmark: number[] };
  leaderboard: { team: string; score: number; trend: "up" | "down" | "flat" }[];
  signalPool: Signal[];
  actions: ActionItem[];
  forecast: {
    actual: number[];
    projected: number[];
    bandHi: number[];
    bandLo: number[];
    stats: { label: string; value: string; tone: Severity }[];
  };
};

// ── Pipeline / DB types ───────────────────────────────────────────
export type OrgIntegration = {
  id: string;
  org_id: string;
  type: string;
  external_id: string;
  bot_token_enc: string | null;
  config: Record<string, unknown>;
  last_synced_at: string | null;
  status: string;
};

export type SurveySignal = {
  survey_title: string;
  sent_at: string;
  question: string;
  avg_score: number;
  scale_max: number;
  low_responses: { respondent: string; department: string; comment: string }[];
};

export type TeamMetrics = {
  name: string;
  employee_count: number;
  weekly_message_counts: number[];
  weekly_after_hours_pcts: number[];
  weekly_participation_rates: number[];
  top_themes: string[];
  silent_members: string[];
  manager_name: string | null;
};

export type EmployeeSignal = {
  display_name: string;
  team: string;
  weekly_message_counts: number[];
  after_hours_pct: number;
  communication_trend: "rising" | "stable" | "declining" | "silent";
  is_potential_manager: boolean;
};

export type ComputedMetrics = {
  org_name: string;
  period_start: string;
  period_end: string;
  total_employees_tracked: number;
  active_last_30d: number;
  overall_after_hours_pct: number;
  teams: TeamMetrics[];
  employees: EmployeeSignal[];
  surveys: SurveySignal[];
};
