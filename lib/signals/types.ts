/**
 * Signal Producer pattern — each integration is a producer that outputs
 * a standardized PlatformSignals object. The scoring layer consumes this
 * interface without knowing which platforms contributed.
 *
 * Architecture reference: Microsoft Viva Insights uses the same pattern —
 * Teams, Outlook, and Viva Survey each produce signals; a federation layer
 * merges them before analytics.
 * https://learn.microsoft.com/en-us/viva/insights/advanced/introduction-to-advanced-insights
 */

export type Platform = "slack" | "github" | "calendar" | "jira" | "hris";

// Raw signals from a single platform, organized by JD-R dimension
export type PlatformSignals = {
  platform: Platform;
  // Fraction of employees this platform produced signals for (0–1)
  coverage: number;
  // Per-org aggregate signals (what most of our scoring uses)
  org: {
    // Demands
    after_hours_ratio: number | null;        // 0–1: fraction of messages after hours
    response_time_p50_minutes: number | null; // median thread response time
    participation_gini: number | null;        // 0–1: inequality of participation
    // Resources
    reaction_rate: number | null;             // emoji reactions per message
    cross_team_ratio: number | null;          // fraction of messages in cross-team channels
    // Text sentiment (VADER)
    vader_positive_pct: number | null;
    vader_negative_pct: number | null;
    vader_neutral_pct: number | null;
  };
  // Per-team signals (keyed by team name; populated when team structure exists)
  teams: Record<string, {
    member_count: number;
    after_hours_ratio: number | null;
    response_time_p50_minutes: number | null;
    participation_gini: number | null;
    reaction_rate: number | null;
    vader_positive_pct: number | null;
    vader_negative_pct: number | null;
  }>;
  // Daily time series for the This Week's Signals card
  daily: {
    date: string;  // YYYY-MM-DD
    total_messages: number;
    after_hours_ratio: number;
    reaction_rate: number;
    vader_positive_pct: number;
    vader_negative_pct: number;
  }[];
};

// Federated signals: merged from all active platforms
export type FederatedSignals = {
  // Which platforms contributed
  platforms: Platform[];
  // Merged org-level signals with coverage metadata
  org: {
    after_hours_ratio: number | null;
    response_time_p50_minutes: number | null;
    participation_gini: number | null;
    reaction_rate: number | null;
    cross_team_ratio: number | null;
    vader_positive_pct: number | null;
    vader_negative_pct: number | null;
    vader_neutral_pct: number | null;
  };
  // Coverage per signal (0–1, fraction of employees with data)
  coverage: Record<string, number>;
  // Per-team signals
  teams: Record<string, PlatformSignals["teams"][string]>;
  // Daily time series
  daily: PlatformSignals["daily"];
};

// Survey signals (after Likert aggregation + open-text classification)
export type SurveySignals = {
  // Likert means per construct (1–5 scale)
  engagement_mean: number | null;
  burnout_workload_mean: number | null;
  collaboration_team_mean: number | null;
  clarity_goals_mean: number | null;
  clarity_feedback_mean: number | null;
  growth_mean: number | null;
  psych_safety_mean: number | null;
  // From open-text classification via Gemini
  open_text_topic_distribution: Record<string, number> | null;  // topic → count
  open_text_top_topic: string | null;
  open_text_top_topic_pct: number | null;
  open_text_sentiment_negative_pct: number | null;
  open_text_sentiment_positive_pct: number | null;
  // Response rate
  response_rate: number | null;  // 0–1
  total_respondents: number;
};

// The interface every signal producer must implement
export interface SignalProducer {
  platform: Platform;
  produceSignals(
    orgId: string,
    periodStart: Date,
    periodEnd: Date,
  ): Promise<PlatformSignals>;
}
