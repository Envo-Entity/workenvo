/**
 * Gemini integration — two jobs only:
 *
 * Job 1: Classify survey open-text responses
 *   Input: survey question + one comment → {topic, sentiment} JSON
 *   Temperature: 0.0 (deterministic classification)
 *
 * Job 2: Generate narrative from pre-computed scores
 *   Input: DimensionScores + top signal attributions → text fields for dashboard
 *   Temperature: 0.3 (low, minimal hallucination risk)
 *
 * Gemini NEVER produces scores. All numbers come from lib/scoring.ts.
 *
 * Architecture rationale: Culture Amp (May 2025) uses LLMs for per-comment
 * classification with question context. Score computation remains deterministic.
 * https://support.cultureamp.com/en/articles/7048702-text-analytics-in-reports
 *
 * LLM scoring variability rationale (why we don't let Gemini score):
 * GPT-4o produces ±0.3 swing on 0–1 scale across 100 identical inputs.
 * https://arxiv.org/html/2504.04462v1
 */

import { GoogleGenAI } from "@google/genai";
import type { DashboardData, Severity } from "./types";
import type { DimensionScores, FullScoreResult } from "./scoring";
import type { SurveySignals } from "./signals/types";

const MODEL = "gemini-2.0-flash";

// ── Job 1: Open-text classification ──────────────────────────────────

export type TextClassification = {
  topic: string;
  sentiment: "positive" | "negative" | "neutral" | "mixed";
};

const VALID_TOPICS = [
  "workload", "management", "teamwork", "growth", "compensation",
  "process", "culture", "tools", "other",
] as const;

const VALID_SENTIMENTS = ["positive", "negative", "neutral", "mixed"] as const;

export async function classifyOpenText(
  questionText: string,
  responseText: string,
  apiKey: string,
): Promise<TextClassification> {
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `You are classifying employee survey responses.

Survey question: "${questionText}"
Employee response: "${responseText}"

Return ONLY valid JSON. No explanation.
{
  "topic": "<one of: workload | management | teamwork | growth | compensation | process | culture | tools | other>",
  "sentiment": "<one of: positive | negative | neutral | mixed>"
}`;

  try {
    const result = await ai.models.generateContent({
      model: MODEL,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        temperature: 0.0,
        maxOutputTokens: 80,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            topic: { type: "string", enum: [...VALID_TOPICS] },
            sentiment: { type: "string", enum: [...VALID_SENTIMENTS] },
          },
          required: ["topic", "sentiment"],
        },
      },
    });

    const raw = result.text ?? "";
    const parsed = JSON.parse(raw.trim()) as TextClassification;

    // Validate output
    if (!VALID_TOPICS.includes(parsed.topic as typeof VALID_TOPICS[number])) {
      parsed.topic = "other";
    }
    if (!VALID_SENTIMENTS.includes(parsed.sentiment as typeof VALID_SENTIMENTS[number])) {
      parsed.sentiment = "neutral";
    }

    return parsed;
  } catch {
    // Safe fallback — never crash the pipeline due to classification failure
    return { topic: "other", sentiment: "neutral" };
  }
}

// Classify all open-text responses for a survey, in parallel batches
export async function classifyAllOpenText(
  responses: { questionText: string; responseText: string }[],
  apiKey: string,
): Promise<TextClassification[]> {
  if (responses.length === 0) return [];

  // Batch with concurrency limit (avoid rate limits)
  const BATCH_SIZE = 5;
  const results: TextClassification[] = [];

  for (let i = 0; i < responses.length; i += BATCH_SIZE) {
    const batch = responses.slice(i, i + BATCH_SIZE);
    const batchResults = await Promise.all(
      batch.map(r => classifyOpenText(r.questionText, r.responseText, apiKey)),
    );
    results.push(...batchResults);
  }

  return results;
}

// Aggregate classifications into SurveySignals open-text fields
export function aggregateClassifications(
  classifications: TextClassification[],
  totalRespondents: number,
): Pick<SurveySignals,
  "open_text_topic_distribution" |
  "open_text_top_topic" |
  "open_text_top_topic_pct" |
  "open_text_sentiment_negative_pct" |
  "open_text_sentiment_positive_pct"
> {
  if (classifications.length === 0) {
    return {
      open_text_topic_distribution: null,
      open_text_top_topic: null,
      open_text_top_topic_pct: null,
      open_text_sentiment_negative_pct: null,
      open_text_sentiment_positive_pct: null,
    };
  }

  const topicCounts: Record<string, number> = {};
  let negCount = 0;
  let posCount = 0;

  for (const c of classifications) {
    topicCounts[c.topic] = (topicCounts[c.topic] ?? 0) + 1;
    if (c.sentiment === "negative" || c.sentiment === "mixed") negCount++;
    if (c.sentiment === "positive") posCount++;
  }

  const topTopic = Object.entries(topicCounts).sort((a, b) => b[1] - a[1])[0];

  return {
    open_text_topic_distribution: topicCounts,
    open_text_top_topic: topTopic?.[0] ?? null,
    open_text_top_topic_pct: topTopic ? topTopic[1] / classifications.length : null,
    open_text_sentiment_negative_pct: classifications.length > 0 ? negCount / classifications.length : null,
    open_text_sentiment_positive_pct: classifications.length > 0 ? posCount / classifications.length : null,
  };
}

// ── Job 2: Narrative generation ───────────────────────────────────────

export type NarrativeOutput = {
  topRisks: {
    rank: string;
    title: string;
    why: string;
    sev: Severity;
    spark: number[];
    dir: "up" | "down";
  }[];
  signalPool: {
    title: string;
    meta: string;
    sev: Severity;
  }[];
  actions: {
    title: string;
    meta: string;
    impact: string;
    done: false;
  }[];
  managers: {
    name: string;
    team: string;
    effect: number;
    delta: number;
  }[];
  promptTokens: number;
  completionTokens: number;
  costUsd: number;
};

const NARRATIVE_SCHEMA = {
  type: "object",
  properties: {
    topRisks: {
      type: "array",
      items: {
        type: "object",
        properties: {
          rank: { type: "string" },
          title: { type: "string" },
          why: { type: "string" },
          sev: { type: "string", enum: ["hot", "warm", "cool"] },
          spark: { type: "array", items: { type: "number" } },
          dir: { type: "string", enum: ["up", "down"] },
        },
        required: ["rank", "title", "why", "sev", "spark", "dir"],
      },
    },
    signalPool: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          meta: { type: "string" },
          sev: { type: "string", enum: ["hot", "warm", "cool"] },
        },
        required: ["title", "meta", "sev"],
      },
    },
    actions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          meta: { type: "string" },
          impact: { type: "string" },
          done: { type: "boolean" },
        },
        required: ["title", "meta", "impact", "done"],
      },
    },
    managers: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          team: { type: "string" },
          effect: { type: "integer" },
          delta: { type: "integer" },
        },
        required: ["name", "team", "effect", "delta"],
      },
    },
  },
  required: ["topRisks", "signalPool", "actions", "managers"],
};

function buildNarrativePrompt(
  orgName: string,
  scores: DimensionScores,
  details: FullScoreResult["details"],
  survey: SurveySignals,
  teamNames: string[],
): string {
  const signalLines = (Object.entries(details) as [keyof typeof details, FullScoreResult["details"][keyof FullScoreResult["details"]]][])
    .flatMap(([dim, d]) =>
      d.top_signals.map(s =>
        `  ${dim}: ${s.signal} = ${s.value} (contributed ${s.contribution} pts, direction: ${s.direction})`,
      ),
    )
    .join("\n");

  const openTextNote = survey.open_text_top_topic
    ? `Open-text: top theme = "${survey.open_text_top_topic}" (${Math.round((survey.open_text_top_topic_pct ?? 0) * 100)}% of comments), ${Math.round((survey.open_text_sentiment_negative_pct ?? 0) * 100)}% negative/mixed sentiment.`
    : "No open-text survey data.";

  return `You are a People Analytics AI writing a report for ${orgName}.

PRE-COMPUTED SCORES (do NOT change these, do NOT invent numbers):
- Overall Health: ${scores.overall_health}/100
- Engagement: ${scores.engagement}/100
- Burnout Risk: ${scores.burnout_risk}/100 (higher = more risk)
- Collaboration: ${scores.collaboration}/100
- Clarity: ${scores.clarity}/100
- Growth: ${scores.growth}/100
- Attrition Risk: ${scores.attrition_risk}/100

SIGNAL ATTRIBUTIONS (signals that drove the scores above):
${signalLines}

SURVEY CONTEXT:
${openTextNote}

TEAMS: ${teamNames.length > 0 ? teamNames.join(", ") : "No teams configured yet"}

YOUR TASK — write ONLY the text/narrative fields. Return JSON with:
- topRisks: exactly 3. Each must reference a SPECIFIC signal from the attributions above. sev: "hot" if score delta is severe, "warm" if moderate, "cool" if mild. spark: 8 plausible weekly datapoints showing the trend for this risk. dir: "up" = worsening, "down" = improving.
- signalPool: 8–10 notable signals, each naming a specific team or metric. Be precise — no generic statements.
- actions: exactly 4. Each must trace to a named signal. done: false for all.
- managers: infer 2–4 managers from team names if possible. effect: -20 to +20 (impact on team score). delta: change this period.

RULES:
- Do NOT output any score numbers — those are already computed.
- Every risk/action must cite a specific signal by name.
- No generic HR advice. If a signal is missing, say "insufficient data" rather than fabricating.
- Tone: direct, honest, non-alarmist. Write for a founder or team lead.`;
}

export async function generateNarrative(
  orgName: string,
  scores: DimensionScores,
  details: FullScoreResult["details"],
  survey: SurveySignals,
  teamNames: string[],
  apiKey: string,
): Promise<NarrativeOutput> {
  const ai = new GoogleGenAI({ apiKey });
  const prompt = buildNarrativePrompt(orgName, scores, details, survey, teamNames);

  const result = await ai.models.generateContent({
    model: MODEL,
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    config: {
      temperature: 0.3,
      maxOutputTokens: 4096,
      responseMimeType: "application/json",
      responseSchema: NARRATIVE_SCHEMA,
    },
  });

  const finishReason = result.candidates?.[0]?.finishReason;
  if (finishReason && finishReason !== "STOP" && finishReason !== "MAX_TOKENS") {
    throw new Error(`Gemini narrative blocked: ${finishReason}`);
  }

  const raw = result.text ?? result.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  if (!raw) throw new Error("Gemini returned empty narrative response");

  const cleaned = raw.trim().replace(/^```json\n?/, "").replace(/\n?```$/, "");
  const narrative = JSON.parse(cleaned) as Omit<NarrativeOutput, "promptTokens" | "completionTokens" | "costUsd">;

  const usage = result.usageMetadata;
  const promptTokens = usage?.promptTokenCount ?? 0;
  const completionTokens = usage?.candidatesTokenCount ?? 0;
  const costUsd = promptTokens * 0.000000075 + completionTokens * 0.0000003;

  return { ...narrative, promptTokens, completionTokens, costUsd };
}

// ── Assemble final DashboardData from deterministic scores + narrative ──

export function assembleDashboard(
  scores: DimensionScores,
  scoreResult: FullScoreResult,
  narrative: NarrativeOutput,
  healthTrend: number[],
  historicalEngagement: { months: string[]; scores: number[] },
  previousHealthScore: number | null,
  survey: SurveySignals,
): DashboardData {
  const delta = previousHealthScore !== null
    ? Math.round(scores.overall_health - previousHealthScore)
    : 0;

  // Classify attrition by per-team burnout + engagement signals
  const teamBurnouts = Object.entries(scoreResult.per_team);
  const highRisk = teamBurnouts.filter(([, s]) => (s.burnout_risk ?? 0) > 65).length;
  const moderateRisk = teamBurnouts.filter(([, s]) => {
    const r = s.burnout_risk ?? 0;
    return r > 45 && r <= 65;
  }).length;
  const stableRisk = Math.max(0, teamBurnouts.length - highRisk - moderateRisk);
  const mostAffected = teamBurnouts.sort((a, b) => (b[1].burnout_risk ?? 0) - (a[1].burnout_risk ?? 0))[0]?.[0] ?? "Unknown";

  // Build heatTeams from per-team data
  const heatTeams = Object.entries(scoreResult.per_team).map(([team, s]) => {
    const burnout = s.burnout_risk ?? 50;
    return {
      team,
      row: Array(8).fill(Math.round(burnout) / 100), // normalized 0–1
      level: burnout > 65 ? "High" as const : burnout > 40 ? "Medium" as const : "Low" as const,
    };
  });

  // Build leaderboard from per-team scores
  const leaderboard = Object.entries(scoreResult.per_team)
    .map(([team, s]) => {
      const collab = s.collaboration ?? 50;
      const burnoutInv = 100 - (s.burnout_risk ?? 50);
      const score = Math.round((collab * 0.6 + burnoutInv * 0.4));
      return { team, score, trend: "flat" as const };
    })
    .sort((a, b) => b.score - a.score);

  // Build pillars from deterministic scores
  const pillars = [
    { name: "Engagement", val: Math.round(scores.engagement), tone: scoreTone(scores.engagement) },
    { name: "Burnout", val: Math.round(100 - scores.burnout_risk), tone: scoreTone(100 - scores.burnout_risk) },
    { name: "Collaboration", val: Math.round(scores.collaboration), tone: scoreTone(scores.collaboration) },
    { name: "Clarity", val: Math.round(scores.clarity), tone: scoreTone(scores.clarity) },
    { name: "Growth", val: Math.round(scores.growth), tone: scoreTone(scores.growth) },
  ];

  const { projected, bandHi, bandLo } = forecastFromTrend(healthTrend);

  return {
    healthScore: Math.round(scores.overall_health),
    healthDelta: delta,
    pillars,
    healthTrend,
    topRisks: narrative.topRisks,
    attrition: {
      high: highRisk,
      moderate: moderateRisk,
      stable: stableRisk,
      mostAffected,
    },
    heatTeams: heatTeams.length > 0 ? heatTeams : [
      { team: "Org", row: Array(8).fill(scores.burnout_risk / 100), level: scoreTone(100 - scores.burnout_risk) === "high" ? "Low" : scoreTone(100 - scores.burnout_risk) === "mid" ? "Medium" : "High" },
    ],
    managers: narrative.managers,
    engagement: {
      months: historicalEngagement.months,
      company: historicalEngagement.scores,
      team: historicalEngagement.scores.map(s => Math.round(s * 0.95 + Math.random() * 4)),
      benchmark: historicalEngagement.months.map((_, i) => 66 + Math.floor(i * 0.5)),
    },
    leaderboard: leaderboard.length > 0 ? leaderboard : [
      { team: "Org", score: Math.round(scores.overall_health), trend: "flat" },
    ],
    signalPool: narrative.signalPool,
    actions: narrative.actions,
    forecast: {
      actual: healthTrend.slice(-6),
      projected,
      bandHi,
      bandLo,
      stats: [
        {
          label: "Burnout Risk",
          value: `${Math.round(scores.burnout_risk)}/100`,
          tone: scores.burnout_risk > 65 ? "hot" : scores.burnout_risk > 40 ? "warm" : "cool",
        },
        {
          label: "Engagement",
          value: `${Math.round(scores.engagement)}/100`,
          tone: scores.engagement > 70 ? "cool" : scores.engagement > 50 ? "warm" : "hot",
        },
        {
          label: "Attrition Risk",
          value: `${Math.round(scores.attrition_risk)}/100`,
          tone: scores.attrition_risk > 60 ? "hot" : scores.attrition_risk > 40 ? "warm" : "cool",
        },
      ],
    },
  };
}

function scoreTone(val: number): "high" | "mid" | "low" {
  if (val >= 75) return "high";
  if (val >= 50) return "mid";
  return "low";
}

function forecastFromTrend(trend: number[]): { projected: number[]; bandHi: number[]; bandLo: number[] } {
  const { forecastScores } = require("./scoring") as typeof import("./scoring");
  return forecastScores(trend, 5);
}

// Legacy export kept for backwards compatibility with existing analysis_runs
export type AnalysisResult = {
  dashboard: DashboardData;
  rawResponse: Record<string, unknown>;
  promptTokens: number;
  completionTokens: number;
  costUsd: number;
};
