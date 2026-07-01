import { supabase } from "./supabase";
import type { DashboardData, OrgIntegration, SurveySignal } from "./types";

export async function getSlackIntegration(orgId: string): Promise<OrgIntegration | null> {
  const { data, error } = await supabase
    .from("org_integrations")
    .select("*")
    .eq("org_id", orgId)
    .eq("type", "slack")
    .eq("status", "active")
    .single();
  if (error || !data) return null;
  return data as OrgIntegration;
}

export async function upsertSlackIntegration(
  orgId: string,
  teamId: string,
  botTokenEnc: string,
  workspaceName: string,
  scopes: string,
): Promise<void> {
  await supabase.from("org_integrations").upsert(
    {
      org_id: orgId,
      type: "slack",
      external_id: teamId,
      bot_token_enc: botTokenEnc,
      status: "active",
      config: { workspace_name: workspaceName, scopes },
    },
    { onConflict: "org_id,type,external_id" },
  );
}

export async function updateSyncedAt(integrationId: string): Promise<void> {
  await supabase
    .from("org_integrations")
    .update({ last_synced_at: new Date().toISOString() })
    .eq("id", integrationId);
}

export async function saveAnalysisRun(params: {
  orgId: string;
  periodStart: string;
  periodEnd: string;
  sourcesJson: Record<string, unknown>;
  aiModel: string;
  aiCostsJson: Record<string, unknown>;
  metricsJson: Record<string, unknown>;
  aiResponseJson: Record<string, unknown>;
  dashboardJson: DashboardData;
  durationMs: number;
}): Promise<string> {
  const { data, error } = await supabase
    .from("analysis_runs")
    .insert({
      org_id: params.orgId,
      period_start: params.periodStart,
      period_end: params.periodEnd,
      sources_json: params.sourcesJson,
      ai_model: params.aiModel,
      ai_costs_json: params.aiCostsJson,
      metrics_json: params.metricsJson,
      ai_response_json: params.aiResponseJson,
      dashboard_json: params.dashboardJson,
      status: "completed",
      duration_ms: params.durationMs,
    })
    .select("id")
    .single();
  if (error || !data) throw new Error(`Failed to save analysis run: ${error?.message}`);
  return data.id as string;
}

export async function getLatestDashboard(orgId: string): Promise<DashboardData | null> {
  const { data, error } = await supabase
    .from("analysis_runs")
    .select("dashboard_json")
    .eq("org_id", orgId)
    .eq("status", "completed")
    .order("ran_at", { ascending: false })
    .limit(1)
    .single();
  if (error || !data) return null;
  return data.dashboard_json as DashboardData;
}

export async function getPreviousHealthScores(orgId: string, limit = 12): Promise<number[]> {
  const { data, error } = await supabase
    .from("analysis_runs")
    .select("dashboard_json->healthScore")
    .eq("org_id", orgId)
    .eq("status", "completed")
    .order("ran_at", { ascending: false })
    .limit(limit);
  if (error || !data) return [];
  return (data as { healthScore: number }[]).map((r) => r.healthScore).reverse();
}

export async function getSurveySignals(orgId: string): Promise<SurveySignal[]> {
  // Fetch last 4 surveys with their questions and averaged responses
  const { data: surveys, error } = await supabase
    .from("surveys")
    .select(`
      id, title, sent_at,
      survey_questions (
        id, text, scale_max,
        survey_responses (
          respondent_name, respondent_department, score, comment
        )
      )
    `)
    .eq("org_id", orgId)
    .order("sent_at", { ascending: false })
    .limit(4);

  if (error || !surveys) return [];

  const signals: SurveySignal[] = [];

  for (const survey of surveys) {
    for (const question of survey.survey_questions as SurveyQuestionWithResponses[]) {
      const responses = question.survey_responses ?? [];
      const scored = responses.filter((r) => r.score !== null);
      if (!scored.length) continue;

      const avg = scored.reduce((s, r) => s + Number(r.score), 0) / scored.length;
      const threshold = question.scale_max <= 5 ? 2.5 : 5;
      const low = responses
        .filter((r) => r.score !== null && Number(r.score) <= threshold && r.comment)
        .map((r) => ({
          respondent: r.respondent_name ?? "Anonymous",
          department: r.respondent_department ?? "Unknown",
          comment: r.comment!,
        }));

      signals.push({
        survey_title: survey.title,
        sent_at: survey.sent_at,
        question: question.text,
        avg_score: Math.round(avg * 10) / 10,
        scale_max: question.scale_max ?? 5,
        low_responses: low.slice(0, 3),
      });
    }
  }

  // Sort by survey date ascending so AI sees trend direction
  return signals.sort((a, b) => new Date(a.sent_at).getTime() - new Date(b.sent_at).getTime());
}

// Local type for the nested query result
type SurveyQuestionWithResponses = {
  id: string;
  text: string;
  scale_max: number;
  survey_responses: {
    respondent_name: string | null;
    respondent_department: string | null;
    score: number | null;
    comment: string | null;
  }[];
};

export async function ensureOrg(orgId: string, name: string): Promise<void> {
  await supabase.from("orgs").upsert({ id: orgId, name }, { onConflict: "id" });
}

// ── Employee identity management ──────────────────────────────────────

export type EmployeeUpsert = {
  slack_user_id: string;
  email: string | null;
  name: string;
  title: string | null;
  avatar_url: string | null;
  status: "active" | "inactive" | "bot";
  employment_type: "employee" | "contractor";
};

export async function upsertEmployees(
  orgId: string,
  employees: EmployeeUpsert[],
): Promise<number> {
  if (employees.length === 0) return 0;

  const rows = employees.map(e => ({
    org_id: orgId,
    slack_user_id: e.slack_user_id,
    email: e.email,
    display_name: e.name,   // DB column is display_name
    title: e.title,
    avatar_url: e.avatar_url,
    status: e.status,
    employment_type: e.employment_type,
    updated_at: new Date().toISOString(),
  }));

  // Upsert by slack_user_id within org (requires unique index on org_id, slack_user_id)
  const { error, count } = await supabase
    .from("employees")
    .upsert(rows, { onConflict: "org_id,slack_user_id", ignoreDuplicates: false });

  if (error) throw new Error(`Failed to upsert employees: ${error.message}`);
  return count ?? employees.length;
}

export async function getEmployees(orgId: string): Promise<{
  id: string;
  slack_user_id: string | null;
  email: string | null;
  display_name: string;
  team_id: string | null;
  manager_id: string | null;
  status: string;
}[]> {
  const { data, error } = await supabase
    .from("employees")
    .select("id, slack_user_id, email, display_name, team_id, manager_id, status")
    .eq("org_id", orgId)
    .eq("status", "active");
  if (error || !data) return [];
  return data as typeof data;
}

// ── Team management ───────────────────────────────────────────────────

export type TeamUpsert = {
  name: string;
  slack_usergroup_id?: string;
  source: "slack_usergroup" | "manual" | "inferred";
};

export async function upsertTeams(
  orgId: string,
  teams: TeamUpsert[],
): Promise<number> {
  if (teams.length === 0) return 0;

  const rows = teams.map(t => ({
    org_id: orgId,
    name: t.name,
    slack_usergroup_id: t.slack_usergroup_id ?? null,
    source: t.source,
    updated_at: new Date().toISOString(),
  }));

  const { error, count } = await supabase
    .from("teams")
    .upsert(rows, { onConflict: "org_id,name", ignoreDuplicates: false });

  if (error) throw new Error(`Failed to upsert teams: ${error.message}`);
  return count ?? teams.length;
}

export async function getTeams(orgId: string): Promise<{
  id: string;
  name: string;
  slack_usergroup_id: string | null;
  source: string;
}[]> {
  const { data, error } = await supabase
    .from("teams")
    .select("id, name, slack_usergroup_id, source")
    .eq("org_id", orgId);
  if (error || !data) return [];
  return data as typeof data;
}

// Links employees to teams via their Slack usergroup membership
export async function linkEmployeeTeams(
  orgId: string,
  slackUsergroupId: string,
  memberSlackIds: string[],
): Promise<number> {
  if (memberSlackIds.length === 0) return 0;

  // Get team ID from usergroup
  const { data: team } = await supabase
    .from("teams")
    .select("id")
    .eq("org_id", orgId)
    .eq("slack_usergroup_id", slackUsergroupId)
    .single();

  if (!team) return 0;

  const { error, count } = await supabase
    .from("employees")
    .update({ team_id: team.id, updated_at: new Date().toISOString() })
    .eq("org_id", orgId)
    .in("slack_user_id", memberSlackIds);

  if (error) console.error("Failed to link employee teams:", error);
  return count ?? 0;
}

// ── Daily Slack metrics ───────────────────────────────────────────────

export type DailyMetrics = {
  date: string;
  total_messages: number;
  after_hours_messages: number;
  after_hours_ratio: number;
  reaction_count: number;
  reaction_rate: number;
  active_users: number;
  participation_gini: number;
  vader_positive_pct: number;
  vader_negative_pct: number;
  vader_neutral_pct: number;
};

export async function saveDailyMetrics(
  orgId: string,
  metrics: DailyMetrics[],
): Promise<void> {
  if (metrics.length === 0) return;

  const rows = metrics.map(m => ({ org_id: orgId, ...m }));

  const { error } = await supabase
    .from("slack_daily_metrics")
    .upsert(rows, { onConflict: "org_id,date", ignoreDuplicates: false });

  if (error) console.error("Failed to save daily metrics:", error);
}

export async function getRecentDailyMetrics(orgId: string, days = 7): Promise<DailyMetrics[]> {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const { data, error } = await supabase
    .from("slack_daily_metrics")
    .select("*")
    .eq("org_id", orgId)
    .gte("date", since.toISOString().slice(0, 10))
    .order("date", { ascending: true });

  if (error || !data) return [];
  return data as DailyMetrics[];
}
