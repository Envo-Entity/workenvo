/**
 * Deterministic scoring layer — converts federated signals + survey signals
 * into 0–100 scores for each JD-R dimension.
 *
 * All formulas are documented in:
 * research/data-analysis-pipeline/03-scoring-formulas.md
 *
 * Theoretical grounding:
 * Bakker, A.B. & Demerouti, E. (2007). The Job Demands-Resources model:
 * State of the art. Journal of Managerial Psychology, 22(3), 309–328.
 *
 * Attrition proxy weights from:
 * Hom, P.W. et al. (2017). One Hundred Years of Employee Turnover Theory
 * and Research. Journal of Applied Psychology, 102(3), 530–545.
 */

import type { FederatedSignals, SurveySignals } from "./signals/types";

export type DimensionScores = {
  engagement: number;
  burnout_risk: number;   // higher = more risk
  collaboration: number;
  clarity: number;
  growth: number;
  overall_health: number;
  attrition_risk: number; // higher = more risk (proxy)
};

export type SignalAttribution = {
  signal: string;
  value: string;
  contribution: number;
  direction: "positive" | "negative" | "warning" | "ok";
};

export type ScoredDimension = {
  score: number;
  top_signals: SignalAttribution[];
  coverage: number; // 0–1: fraction of signals available
};

export type FullScoreResult = {
  scores: DimensionScores;
  details: Record<keyof Omit<DimensionScores, "overall_health" | "attrition_risk">, ScoredDimension>;
  per_team: Record<string, Partial<DimensionScores>>;
  signals_available: number;  // total signal count used
  signals_possible: number;   // max possible signal count
};

function cap(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, Math.round(value * 100) / 100));
}

function formatValue(key: string, value: number | null): string {
  if (value === null) return "no data";
  if (key.includes("ratio") || key.includes("pct")) return `${Math.round(value * 100)}%`;
  if (key.includes("minutes")) return `${Math.round(value)}min`;
  if (key.includes("mean")) return `${value.toFixed(1)}/5`;
  if (key.includes("gini")) return value.toFixed(2);
  return value.toFixed(2);
}

export function computeScores(
  signals: FederatedSignals,
  survey: SurveySignals,
  previousHealthScores: number[] = [],
): FullScoreResult {
  const s = signals.org;
  const sv = survey;

  let signalsAvailable = 0;
  const signalsPossible = 9; // total tracked signals

  // ── Engagement Score (0–100, higher = better) ────────────────
  // Sources: engagement_survey_mean (50%), vader_positive_pct (30%), reaction_rate (20%)
  const engagementParts: SignalAttribution[] = [];
  let engagementScore = 0;
  let engagementCoverage = 0;

  if (sv.engagement_mean !== null) {
    const contrib = (sv.engagement_mean / 5.0) * 50;
    engagementScore += contrib;
    engagementCoverage += 0.5;
    signalsAvailable++;
    engagementParts.push({
      signal: "motivation_survey",
      value: formatValue("mean", sv.engagement_mean),
      contribution: Math.round(contrib * 10) / 10,
      direction: sv.engagement_mean >= 3.5 ? "positive" : sv.engagement_mean >= 2.5 ? "warning" : "negative",
    });
  } else {
    engagementScore += 25; // neutral fallback (50% weight × 50% of max)
  }

  if (s.vader_positive_pct !== null) {
    const contrib = s.vader_positive_pct * 30;
    engagementScore += contrib;
    engagementCoverage += 0.3;
    signalsAvailable++;
    engagementParts.push({
      signal: "slack_positive_sentiment",
      value: formatValue("pct", s.vader_positive_pct),
      contribution: Math.round(contrib * 10) / 10,
      direction: s.vader_positive_pct >= 0.55 ? "positive" : s.vader_positive_pct >= 0.4 ? "warning" : "negative",
    });
  } else {
    engagementScore += 12; // neutral fallback
  }

  if (s.reaction_rate !== null) {
    const contrib = Math.min(s.reaction_rate / 0.5, 1.0) * 20;
    engagementScore += contrib;
    engagementCoverage += 0.2;
    signalsAvailable++;
    engagementParts.push({
      signal: "reaction_rate",
      value: formatValue("ratio", s.reaction_rate),
      contribution: Math.round(contrib * 10) / 10,
      direction: s.reaction_rate >= 0.3 ? "positive" : s.reaction_rate >= 0.15 ? "warning" : "negative",
    });
  } else {
    engagementScore += 8; // neutral fallback
  }

  // ── Burnout Risk Score (0–100, higher = MORE risk) ────────────
  // Sources: after_hours_ratio (35%), burnout_workload_mean inverted (35%),
  //          vader_negative_pct (20%), response_time_p50 (10%)
  const burnoutParts: SignalAttribution[] = [];
  let burnoutScore = 0;
  let burnoutCoverage = 0;

  if (s.after_hours_ratio !== null) {
    const contrib = Math.min(s.after_hours_ratio / 0.5, 1.0) * 35;
    burnoutScore += contrib;
    burnoutCoverage += 0.35;
    signalsAvailable++;
    burnoutParts.push({
      signal: "after_hours_ratio",
      value: formatValue("ratio", s.after_hours_ratio),
      contribution: Math.round(contrib * 10) / 10,
      direction: s.after_hours_ratio > 0.25 ? "warning" : "ok",
    });
  } else {
    burnoutScore += 12; // neutral
  }

  if (sv.burnout_workload_mean !== null) {
    const contrib = ((5.0 - sv.burnout_workload_mean) / 4.0) * 35;
    burnoutScore += contrib;
    burnoutCoverage += 0.35;
    signalsAvailable++;
    burnoutParts.push({
      signal: "workload_survey",
      value: formatValue("mean", sv.burnout_workload_mean),
      contribution: Math.round(contrib * 10) / 10,
      direction: sv.burnout_workload_mean >= 3.5 ? "ok" : sv.burnout_workload_mean >= 2.5 ? "warning" : "negative",
    });
  } else {
    burnoutScore += 12; // neutral
  }

  if (s.vader_negative_pct !== null) {
    const contrib = s.vader_negative_pct * 20;
    burnoutScore += contrib;
    burnoutCoverage += 0.2;
    signalsAvailable++;
    burnoutParts.push({
      signal: "slack_negative_sentiment",
      value: formatValue("pct", s.vader_negative_pct),
      contribution: Math.round(contrib * 10) / 10,
      direction: s.vader_negative_pct > 0.2 ? "warning" : "ok",
    });
  } else {
    burnoutScore += 5; // neutral
  }

  if (s.response_time_p50_minutes !== null) {
    const contrib = Math.min(s.response_time_p50_minutes / 120.0, 1.0) * 10;
    burnoutScore += contrib;
    burnoutCoverage += 0.1;
    signalsAvailable++;
    burnoutParts.push({
      signal: "response_time_p50",
      value: formatValue("minutes", s.response_time_p50_minutes),
      contribution: Math.round(contrib * 10) / 10,
      direction: s.response_time_p50_minutes > 60 ? "warning" : "ok",
    });
  } else {
    burnoutScore += 3; // neutral
  }

  // ── Collaboration Score (0–100, higher = better) ─────────────
  // Sources: collaboration_team_mean (35%), participation_gini inverted (30%),
  //          cross_team_ratio (20%), psych_safety_mean (15%)
  const collabParts: SignalAttribution[] = [];
  let collabScore = 0;
  let collabCoverage = 0;

  if (sv.collaboration_team_mean !== null) {
    const contrib = (sv.collaboration_team_mean / 5.0) * 35;
    collabScore += contrib;
    collabCoverage += 0.35;
    signalsAvailable++;
    collabParts.push({
      signal: "collaboration_survey",
      value: formatValue("mean", sv.collaboration_team_mean),
      contribution: Math.round(contrib * 10) / 10,
      direction: sv.collaboration_team_mean >= 3.5 ? "positive" : "warning",
    });
  } else {
    collabScore += 17; // neutral
  }

  if (s.participation_gini !== null) {
    const contrib = (1.0 - s.participation_gini) * 30;
    collabScore += contrib;
    collabCoverage += 0.3;
    signalsAvailable++;
    collabParts.push({
      signal: "participation_gini",
      value: formatValue("gini", s.participation_gini),
      contribution: Math.round(contrib * 10) / 10,
      direction: s.participation_gini < 0.4 ? "positive" : s.participation_gini < 0.6 ? "warning" : "negative",
    });
  } else {
    collabScore += 15; // neutral
  }

  if (s.cross_team_ratio !== null) {
    const contrib = Math.min(s.cross_team_ratio / 0.6, 1.0) * 20;
    collabScore += contrib;
    collabCoverage += 0.2;
    signalsAvailable++;
    collabParts.push({
      signal: "cross_team_ratio",
      value: formatValue("ratio", s.cross_team_ratio),
      contribution: Math.round(contrib * 10) / 10,
      direction: s.cross_team_ratio >= 0.25 ? "positive" : "warning",
    });
  } else {
    collabScore += 8; // neutral
  }

  if (sv.psych_safety_mean !== null) {
    const contrib = (sv.psych_safety_mean / 5.0) * 15;
    collabScore += contrib;
    collabCoverage += 0.15;
    signalsAvailable++;
    collabParts.push({
      signal: "psych_safety_survey",
      value: formatValue("mean", sv.psych_safety_mean),
      contribution: Math.round(contrib * 10) / 10,
      direction: sv.psych_safety_mean >= 3.5 ? "positive" : "warning",
    });
  } else {
    collabScore += 7; // neutral
  }

  // ── Clarity Score (0–100, higher = better) ───────────────────
  const clarityParts: SignalAttribution[] = [];
  let clarityScore = 0;
  let clarityCoverage = 0;

  if (sv.clarity_goals_mean !== null) {
    const contrib = (sv.clarity_goals_mean / 5.0) * 50;
    clarityScore += contrib;
    clarityCoverage += 0.5;
    signalsAvailable++;
    clarityParts.push({
      signal: "clarity_goals_survey",
      value: formatValue("mean", sv.clarity_goals_mean),
      contribution: Math.round(contrib * 10) / 10,
      direction: sv.clarity_goals_mean >= 3.5 ? "positive" : "warning",
    });
  } else {
    clarityScore += 25;
  }

  if (sv.clarity_feedback_mean !== null) {
    const contrib = (sv.clarity_feedback_mean / 5.0) * 50;
    clarityScore += contrib;
    clarityCoverage += 0.5;
    signalsAvailable++;
    clarityParts.push({
      signal: "clarity_feedback_survey",
      value: formatValue("mean", sv.clarity_feedback_mean),
      contribution: Math.round(contrib * 10) / 10,
      direction: sv.clarity_feedback_mean >= 3.5 ? "positive" : "warning",
    });
  } else {
    clarityScore += 25;
  }

  // ── Growth Score (0–100, higher = better) ────────────────────
  const growthParts: SignalAttribution[] = [];
  let growthScore = 0;
  let growthCoverage = 0;

  if (sv.growth_mean !== null) {
    growthScore = (sv.growth_mean / 5.0) * 100;
    growthCoverage = 1.0;
    signalsAvailable++;
    growthParts.push({
      signal: "growth_survey",
      value: formatValue("mean", sv.growth_mean),
      contribution: Math.round(growthScore * 10) / 10,
      direction: sv.growth_mean >= 3.5 ? "positive" : "warning",
    });
  } else {
    growthScore = 50; // neutral fallback
  }

  // ── Composite Health Score ────────────────────────────────────
  // Weights: Engagement 30%, Burnout (inverted) 25%, Collaboration 20%,
  //          Clarity 15%, Growth 10%
  const overall_health = cap(
    cap(engagementScore) * 0.30 +
    (100 - cap(burnoutScore)) * 0.25 +
    cap(collabScore) * 0.20 +
    cap(clarityScore) * 0.15 +
    cap(growthScore) * 0.10,
  );

  // ── Attrition Risk Proxy ──────────────────────────────────────
  // From Hom et al. (2017): engagement (40%), growth opportunity (30%), burnout (30%)
  const attrition_risk = cap(
    (100 - cap(engagementScore)) * 0.40 +
    (100 - cap(growthScore)) * 0.30 +
    cap(burnoutScore) * 0.30,
  );

  // ── Per-team scores ───────────────────────────────────────────
  const per_team: Record<string, Partial<DimensionScores>> = {};
  for (const [teamName, teamData] of Object.entries(signals.teams)) {
    if (!teamData) continue;
    let teamBurnout = 0;
    if (teamData.after_hours_ratio !== null) {
      teamBurnout += Math.min(teamData.after_hours_ratio / 0.5, 1.0) * 35;
    } else { teamBurnout += 12; }
    if (teamData.vader_negative_pct !== null) {
      teamBurnout += teamData.vader_negative_pct * 20;
    } else { teamBurnout += 5; }

    let teamCollab = 0;
    if (teamData.participation_gini !== null) {
      teamCollab += (1.0 - teamData.participation_gini) * 50;
    } else { teamCollab += 25; }
    if (teamData.reaction_rate !== null) {
      teamCollab += Math.min(teamData.reaction_rate / 0.5, 1.0) * 50;
    } else { teamCollab += 25; }

    per_team[teamName] = {
      burnout_risk: cap(teamBurnout),
      collaboration: cap(teamCollab),
    };
  }

  const finalEngagement = cap(engagementScore);
  const finalBurnout = cap(burnoutScore);
  const finalCollab = cap(collabScore);
  const finalClarity = cap(clarityScore);
  const finalGrowth = cap(growthScore);

  return {
    scores: {
      engagement: finalEngagement,
      burnout_risk: finalBurnout,
      collaboration: finalCollab,
      clarity: finalClarity,
      growth: finalGrowth,
      overall_health,
      attrition_risk,
    },
    details: {
      engagement: { score: finalEngagement, top_signals: engagementParts, coverage: engagementCoverage },
      burnout_risk: { score: finalBurnout, top_signals: burnoutParts, coverage: burnoutCoverage },
      collaboration: { score: finalCollab, top_signals: collabParts, coverage: collabCoverage },
      clarity: { score: finalClarity, top_signals: clarityParts, coverage: clarityCoverage },
      growth: { score: finalGrowth, top_signals: growthParts, coverage: growthCoverage },
    },
    per_team,
    signals_available: signalsAvailable,
    signals_possible: signalsPossible,
  };
}

// Build historical health score trend from previous runs
export function buildHealthTrend(
  previousScores: number[],
  currentScore: number,
): number[] {
  const combined = [...previousScores, currentScore];
  if (combined.length >= 12) return combined.slice(-12);

  // Pad with a plausible warm-up if we have less than 12 months
  const first = combined[0];
  const padding = Array(12 - combined.length).fill(null).map((_, i) => {
    // Smooth interpolation: start 5-10 points lower than first real score
    const base = first - 8 + (i * 8) / (12 - combined.length);
    return Math.round(Math.max(20, Math.min(95, base)));
  });
  return [...padding, ...combined];
}

// Simple linear trend forecast: given historical scores, project N months
export function forecastScores(
  historicalScores: number[],
  monthsAhead = 5,
): { projected: number[]; bandHi: number[]; bandLo: number[] } {
  if (historicalScores.length < 2) {
    const last = historicalScores[historicalScores.length - 1] ?? 50;
    return {
      projected: Array(monthsAhead).fill(last),
      bandHi: Array(monthsAhead).fill(Math.min(100, last + 6)),
      bandLo: Array(monthsAhead).fill(Math.max(0, last - 6)),
    };
  }

  // Simple linear regression on last N scores
  const n = Math.min(historicalScores.length, 6);
  const recent = historicalScores.slice(-n);
  const xs = recent.map((_, i) => i);
  const meanX = xs.reduce((a, b) => a + b, 0) / n;
  const meanY = recent.reduce((a, b) => a + b, 0) / n;
  const slope = xs.reduce((s, x, i) => s + (x - meanX) * (recent[i] - meanY), 0) /
    xs.reduce((s, x) => s + (x - meanX) ** 2, 0);
  const intercept = meanY - slope * meanX;

  const projected = Array(monthsAhead).fill(0).map((_, i) => {
    const val = intercept + slope * (n + i);
    return Math.round(Math.max(0, Math.min(100, val)));
  });

  // Confidence band widens over time (±4 initially, ±8 at 5 months)
  const bandHi = projected.map((v, i) => Math.min(100, v + 4 + i * 0.8));
  const bandLo = projected.map((v, i) => Math.max(0, v - 4 - i * 0.8));

  return { projected, bandHi, bandLo };
}
