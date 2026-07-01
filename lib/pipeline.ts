/**
 * Analysis pipeline — deterministic scoring architecture.
 *
 * Sequence:
 *   1. SlackSignalProducer → PlatformSignals
 *   2. mergeSignals → FederatedSignals
 *   3. DB survey data → extractSurveyLikert → Gemini classifyAllOpenText → SurveySignals
 *   4. computeScores(federated, survey) → FullScoreResult   ← all numbers here, Gemini never touches scores
 *   5. generateNarrative(scores, signals) → NarrativeOutput ← Gemini writes text only
 *   6. assembleDashboard → DashboardData
 *   7. saveDailyMetrics + saveAnalysisRun
 */

import { decrypt } from "./crypto";
import {
  getSlackIntegration,
  getPreviousHealthScores,
  getSurveySignals,
  saveAnalysisRun,
  saveDailyMetrics,
  getTeams,
  updateSyncedAt,
} from "./db";
import { SlackSignalProducer } from "./signals/slack-producer";
import { mergeSignals } from "./signals/merger";
import { computeScores, buildHealthTrend } from "./scoring";
import {
  classifyAllOpenText,
  aggregateClassifications,
  generateNarrative,
  assembleDashboard,
} from "./analysis";
import type { SurveySignal } from "./types";
import type { DashboardData } from "./types";
import type { SurveySignals } from "./signals/types";

const DAYS_BACK = 56; // 8 weeks

export type PipelineResult =
  | { success: true; runId: string; dashboard: DashboardData; durationMs: number; costUsd: number }
  | { success: false; error: string };

export async function runAnalysisPipeline(orgId: string, orgName: string): Promise<PipelineResult> {
  const start = Date.now();
  const geminiKey = process.env.GEMINI_API_KEY;
  if (!geminiKey) return { success: false, error: "GEMINI_API_KEY not set." };

  // ── 1. Slack integration ──────────────────────────────────────────
  const integration = await getSlackIntegration(orgId);
  if (!integration?.bot_token_enc) {
    return { success: false, error: "No active Slack integration found for this org." };
  }

  let botToken: string;
  try {
    botToken = decrypt(integration.bot_token_enc);
  } catch {
    return { success: false, error: "Failed to decrypt Slack token." };
  }

  const periodEnd = new Date();
  const periodStart = new Date(periodEnd.getTime() - DAYS_BACK * 86400 * 1000);

  // ── 2. Slack signal extraction ────────────────────────────────────
  const slackProducer = new SlackSignalProducer(botToken);
  const slackSignals = await slackProducer.produceSignals(orgId, periodStart, periodEnd);

  // ── 3. Signal federation (extensible: add GitHub/Calendar producers here) ──
  const federated = mergeSignals([slackSignals]);

  // ── 4. Survey signals ─────────────────────────────────────────────
  const rawSurveySignals = await getSurveySignals(orgId);
  const surveyLikert = extractSurveyLikert(rawSurveySignals);

  // Open-text classification (Gemini Job 1 — temperature 0, per-comment JSON)
  const openTextInputs = rawSurveySignals.flatMap(s =>
    s.low_responses
      .filter(r => r.comment?.trim())
      .map(r => ({ questionText: s.question, responseText: r.comment })),
  );

  const classifications = await classifyAllOpenText(openTextInputs, geminiKey);
  const openTextSignals = aggregateClassifications(classifications, surveyLikert.total_respondents);

  const survey: SurveySignals = { ...surveyLikert, ...openTextSignals };

  // ── 5. Deterministic scoring (JD-R model, all formulas in lib/scoring.ts) ──
  const previousHealthScores = await getPreviousHealthScores(orgId, 11);
  const scoreResult = computeScores(federated, survey, previousHealthScores);
  const healthTrend = buildHealthTrend(previousHealthScores, scoreResult.scores.overall_health);

  // ── 6. Team names for narrative context ───────────────────────────
  const teams = await getTeams(orgId);
  const teamNames = teams.map(t => t.name);

  // ── 7. Gemini narrative (Job 2 — text only, never produces scores) ──
  const narrative = await generateNarrative(
    orgName,
    scoreResult.scores,
    scoreResult.details,
    survey,
    teamNames,
    geminiKey,
  );

  // ── 8. Assemble dashboard ─────────────────────────────────────────
  const previousHealthScore = previousHealthScores.length > 0
    ? previousHealthScores[previousHealthScores.length - 1]
    : null;

  const historicalEngagement = buildEngagementHistory(previousHealthScores, scoreResult.scores.engagement);

  const dashboard = assembleDashboard(
    scoreResult.scores,
    scoreResult,
    narrative,
    healthTrend,
    historicalEngagement,
    previousHealthScore,
    survey,
  );

  // ── 9. Persist ────────────────────────────────────────────────────
  if (slackSignals.daily.length > 0) {
    await saveDailyMetrics(orgId, slackSignals.daily.map(d => ({
      date: d.date,
      total_messages: d.total_messages,
      after_hours_messages: Math.round(d.total_messages * d.after_hours_ratio),
      after_hours_ratio: d.after_hours_ratio,
      reaction_count: Math.round(d.total_messages * d.reaction_rate),
      reaction_rate: d.reaction_rate,
      active_users: 0, // would require per-day user tracking — not blocking
      participation_gini: federated.org.participation_gini ?? 0,
      vader_positive_pct: d.vader_positive_pct,
      vader_negative_pct: d.vader_negative_pct,
      vader_neutral_pct: 1 - d.vader_positive_pct - d.vader_negative_pct,
    })));
  }

  const totalCostUsd = narrative.costUsd;

  const runId = await saveAnalysisRun({
    orgId,
    periodStart: periodStart.toISOString().slice(0, 10),
    periodEnd: periodEnd.toISOString().slice(0, 10),
    sourcesJson: {
      slack: {
        channels_analyzed: slackSignals.daily.length > 0 ? "yes" : "empty",
        coverage: slackSignals.coverage,
        daily_records: slackSignals.daily.length,
      },
      surveys: {
        count: rawSurveySignals.length,
        open_text_classified: openTextInputs.length,
      },
    },
    aiModel: "gemini-2.0-flash",
    aiCostsJson: {
      prompt_tokens: narrative.promptTokens,
      completion_tokens: narrative.completionTokens,
      total_usd: totalCostUsd,
    },
    metricsJson: {
      scores: scoreResult.scores,
      signals_available: scoreResult.signals_available,
      signals_possible: scoreResult.signals_possible,
      coverage: federated.coverage,
    },
    aiResponseJson: {
      topRisks: narrative.topRisks,
      signalPool: narrative.signalPool,
      actions: narrative.actions,
      managers: narrative.managers,
    },
    dashboardJson: dashboard,
    durationMs: Date.now() - start,
  });

  await updateSyncedAt(integration.id);

  return {
    success: true,
    runId,
    dashboard,
    durationMs: Date.now() - start,
    costUsd: totalCostUsd,
  };
}

// ── Survey Likert extraction ──────────────────────────────────────────
//
// Maps survey question text to JD-R dimensions via keyword matching.
// Uses the most recent survey's avg_scores, normalized to 1–5 scale.

type DimensionMeans = Omit<SurveySignals,
  "open_text_topic_distribution" | "open_text_top_topic" | "open_text_top_topic_pct" |
  "open_text_sentiment_negative_pct" | "open_text_sentiment_positive_pct"
>;

const DIMENSION_PATTERNS: Array<{ key: keyof Omit<DimensionMeans, "response_rate" | "total_respondents">; pattern: RegExp }> = [
  { key: "engagement_mean",          pattern: /\b(engag|motivat|enthusiasm|commit|excited|energy|inspir)\b/i },
  { key: "burnout_workload_mean",     pattern: /\b(workload|overwh|burnout|work[\s-]life|stress|exhaust|sustainab|manageabl)\b/i },
  { key: "collaboration_team_mean",   pattern: /\b(team|collaborat|together|support|colleague|cowork|cooperat)\b/i },
  { key: "clarity_goals_mean",        pattern: /\b(goal|direction|priority|clear|role|expect|understand|objective)\b/i },
  { key: "clarity_feedback_mean",     pattern: /\b(feedback|review|evaluat|recogni|acknowledg)\b/i },
  { key: "growth_mean",               pattern: /\b(grow|learn|develop|career|progress|skill|advance|opportunity)\b/i },
  { key: "psych_safety_mean",         pattern: /\b(safe|speak.?up|voice|psychological|opinion|disagree|express|concern)\b/i },
];

function extractSurveyLikert(signals: SurveySignal[]): DimensionMeans {
  const dimensionAccumulators: Record<string, number[]> = {
    engagement_mean: [],
    burnout_workload_mean: [],
    collaboration_team_mean: [],
    clarity_goals_mean: [],
    clarity_feedback_mean: [],
    growth_mean: [],
    psych_safety_mean: [],
  };

  for (const signal of signals) {
    // Normalize avg_score to 1–5 scale
    const normalized = signal.scale_max > 0
      ? (signal.avg_score / signal.scale_max) * 5
      : signal.avg_score;

    const questionText = signal.question.toLowerCase();

    for (const { key, pattern } of DIMENSION_PATTERNS) {
      if (pattern.test(questionText)) {
        dimensionAccumulators[key].push(normalized);
        break; // assign question to first matching dimension only
      }
    }
  }

  function avg(arr: number[]): number | null {
    if (arr.length === 0) return null;
    return Math.round((arr.reduce((a, b) => a + b, 0) / arr.length) * 100) / 100;
  }

  // Rough respondent count: estimate from number of unique questions answered
  const totalRespondents = signals.reduce((max, s) => {
    const count = s.low_responses.length;
    return Math.max(max, count);
  }, 0);

  return {
    engagement_mean:        avg(dimensionAccumulators.engagement_mean),
    burnout_workload_mean:  avg(dimensionAccumulators.burnout_workload_mean),
    collaboration_team_mean: avg(dimensionAccumulators.collaboration_team_mean),
    clarity_goals_mean:     avg(dimensionAccumulators.clarity_goals_mean),
    clarity_feedback_mean:  avg(dimensionAccumulators.clarity_feedback_mean),
    growth_mean:            avg(dimensionAccumulators.growth_mean),
    psych_safety_mean:      avg(dimensionAccumulators.psych_safety_mean),
    response_rate:          null, // requires separate respondent/invited count query
    total_respondents:      totalRespondents,
  };
}

// ── Historical engagement trend ───────────────────────────────────────

function buildEngagementHistory(
  previousHealthScores: number[],
  currentEngagement: number,
): { months: string[]; scores: number[] } {
  // Use health scores as engagement proxy for trend chart (same direction, similar movement)
  // Real engagement history would require per-run dimension score storage — added to roadmap
  const allScores = [...previousHealthScores, currentEngagement].slice(-12);
  const now = new Date();
  const months = allScores.map((_, i) => {
    const d = new Date(now);
    d.setMonth(d.getMonth() - (allScores.length - 1 - i));
    return d.toLocaleString("default", { month: "short" });
  });

  return { months, scores: allScores };
}
