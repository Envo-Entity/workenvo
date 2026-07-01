/**
 * Slack Signal Producer — extracts behavioral and text signals from Slack data.
 *
 * Behavioral signals (no NLP needed) are the primary output, following:
 * Müller et al. (2024). Estimating work engagement from online chat tools.
 * EPJ Data Science. https://epjdatascience.springeropen.com/articles/10.1140/epjds/s13688-024-00496-9
 *
 * VADER-like sentiment applied to message text:
 * Hutto & Gilbert (2014). VADER: A Parsimonious Rule-based Model for Sentiment Analysis.
 * ICWSM. (See lib/sentiment.ts)
 */

import { getChannels, getChannelMessages } from "../slack-api";
import { aggregateSentiment } from "../sentiment";
import { inferTeam } from "../metrics";
import type { PlatformSignals, SignalProducer } from "./types";

// Messages outside 9am–9pm local (using UTC as proxy) or on weekends = after hours
function isAfterHours(ts: string): boolean {
  const d = new Date(parseFloat(ts) * 1000);
  const day = d.getUTCDay();
  const hour = d.getUTCHours();
  return day === 0 || day === 6 || hour < 9 || hour >= 21;
}

function weekStart(ts: string): string {
  const d = new Date(parseFloat(ts) * 1000);
  const day = d.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setUTCDate(d.getUTCDate() + diff);
  d.setUTCHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}

function dateKey(ts: string): string {
  return new Date(parseFloat(ts) * 1000).toISOString().slice(0, 10);
}

// Gini coefficient: measures participation inequality (0=equal, 1=one person sends all)
function giniCoefficient(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const n = sorted.length;
  const sum = sorted.reduce((a, b) => a + b, 0);
  if (sum === 0) return 0;
  let numerator = 0;
  for (let i = 0; i < n; i++) {
    numerator += (2 * (i + 1) - n - 1) * sorted[i];
  }
  return Math.round((numerator / (n * sum)) * 10000) / 10000;
}

function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
}

export class SlackSignalProducer implements SignalProducer {
  platform = "slack" as const;

  constructor(private botToken: string) {}

  async produceSignals(
    _orgId: string,
    periodStart: Date,
    periodEnd: Date,
  ): Promise<PlatformSignals> {
    const oldestTs = String(Math.floor(periodStart.getTime() / 1000));
    const channels = await getChannels(this.botToken);

    type MessageWithChannel = {
      ts: string;
      user?: string;
      text?: string;
      reactions?: { name: string; count: number }[];
      channelName: string;
      isSharedChannel: boolean;
      threadParentTs?: string;
    };

    const allMessages: MessageWithChannel[] = [];
    const channelTeamMap = new Map<string, string | null>();

    for (const channel of channels) {
      const messages = await getChannelMessages(channel.id, this.botToken, oldestTs);
      const team = inferTeam(channel.name);
      channelTeamMap.set(channel.id, team);

      // Determine if cross-team (general channels or channels with no specific team)
      const isCrossTeam = !team || channel.name === "general" || channel.name.startsWith("all-");

      for (const msg of messages) {
        if (!msg.user) continue; // skip bots/system messages
        allMessages.push({
          ts: msg.ts,
          user: msg.user,
          text: msg.text,
          reactions: msg.reactions,
          channelName: channel.name,
          isSharedChannel: isCrossTeam,
          threadParentTs: undefined,
        });
      }
    }

    if (allMessages.length === 0) {
      return this.emptySignals();
    }

    // ── Org-level behavioral signals ───────────────────────────────

    const afterHoursCount = allMessages.filter(m => isAfterHours(m.ts)).length;
    const after_hours_ratio = afterHoursCount / allMessages.length;

    const totalReactions = allMessages.reduce(
      (sum, m) => sum + (m.reactions?.reduce((s, r) => s + r.count, 0) ?? 0),
      0,
    );
    const reaction_rate = totalReactions / allMessages.length;

    const crossTeamCount = allMessages.filter(m => m.isSharedChannel).length;
    const cross_team_ratio = crossTeamCount / allMessages.length;

    // Participation Gini: message counts per user
    const userMsgCounts = new Map<string, number>();
    for (const msg of allMessages) {
      if (msg.user) userMsgCounts.set(msg.user, (userMsgCounts.get(msg.user) ?? 0) + 1);
    }
    const participation_gini = giniCoefficient([...userMsgCounts.values()]);

    // Response time p50: for thread replies, measure time from parent to first reply
    // We approximate by looking at messages with the same user in quick succession
    // (full thread data would require conversations.replies API calls — too expensive for now)
    // Using a heuristic: median gap between messages in a channel per day as response pressure
    const responseTimes: number[] = [];
    const channelTimestamps = new Map<string, number[]>();
    for (const msg of allMessages) {
      const key = msg.channelName;
      if (!channelTimestamps.has(key)) channelTimestamps.set(key, []);
      channelTimestamps.get(key)!.push(parseFloat(msg.ts));
    }
    for (const timestamps of channelTimestamps.values()) {
      const sorted = timestamps.sort((a, b) => a - b);
      for (let i = 1; i < sorted.length; i++) {
        const gap = (sorted[i] - sorted[i - 1]) / 60; // minutes
        if (gap > 0 && gap < 480) responseTimes.push(gap); // filter overnight gaps
      }
    }
    const response_time_p50_minutes = responseTimes.length > 0 ? median(responseTimes) : null;

    // ── Sentiment (VADER-like, text processed in memory) ───────────
    const texts = allMessages.map(m => m.text ?? "").filter(t => t.length > 0);
    const sentiment = aggregateSentiment(texts);

    // ── Per-team signals ──────────────────────────────────────────
    const teamMessages = new Map<string, MessageWithChannel[]>();
    for (const msg of allMessages) {
      const team = inferTeam(msg.channelName);
      if (!team) continue;
      if (!teamMessages.has(team)) teamMessages.set(team, []);
      teamMessages.get(team)!.push(msg);
    }

    const teams: PlatformSignals["teams"] = {};
    for (const [teamName, msgs] of teamMessages) {
      const teamUserCounts = new Map<string, number>();
      for (const m of msgs) {
        if (m.user) teamUserCounts.set(m.user, (teamUserCounts.get(m.user) ?? 0) + 1);
      }
      const teamAHCount = msgs.filter(m => isAfterHours(m.ts)).length;
      const teamReactions = msgs.reduce(
        (s, m) => s + (m.reactions?.reduce((rs, r) => rs + r.count, 0) ?? 0),
        0,
      );
      const teamTexts = msgs.map(m => m.text ?? "").filter(t => t.length > 0);
      const teamSentiment = aggregateSentiment(teamTexts);

      teams[teamName] = {
        member_count: teamUserCounts.size,
        after_hours_ratio: msgs.length > 0 ? teamAHCount / msgs.length : null,
        response_time_p50_minutes: null, // per-team response time requires thread API
        participation_gini: giniCoefficient([...teamUserCounts.values()]),
        reaction_rate: msgs.length > 0 ? teamReactions / msgs.length : null,
        vader_positive_pct: teamSentiment.positive_pct,
        vader_negative_pct: teamSentiment.negative_pct,
      };
    }

    // ── Daily time series ─────────────────────────────────────────
    const dailyMap = new Map<string, {
      total: number; afterHours: number; reactions: number; texts: string[];
    }>();

    for (const msg of allMessages) {
      const day = dateKey(msg.ts);
      if (!dailyMap.has(day)) dailyMap.set(day, { total: 0, afterHours: 0, reactions: 0, texts: [] });
      const d = dailyMap.get(day)!;
      d.total++;
      if (isAfterHours(msg.ts)) d.afterHours++;
      d.reactions += msg.reactions?.reduce((s, r) => s + r.count, 0) ?? 0;
      if (msg.text) d.texts.push(msg.text);
    }

    const daily = [...dailyMap.entries()]
      .filter(([date]) => {
        const d = new Date(date);
        return d >= periodStart && d <= periodEnd;
      })
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, d]) => {
        const s = aggregateSentiment(d.texts);
        return {
          date,
          total_messages: d.total,
          after_hours_ratio: d.total > 0 ? d.afterHours / d.total : 0,
          reaction_rate: d.total > 0 ? d.reactions / d.total : 0,
          vader_positive_pct: s.positive_pct,
          vader_negative_pct: s.negative_pct,
        };
      });

    // Coverage: fraction of Slack workspace members we got data for
    const coverage = userMsgCounts.size > 0
      ? Math.min(userMsgCounts.size / Math.max(channels.reduce((s, c) => s + (c.num_members ?? 0), 0) / Math.max(channels.length, 1), 1), 1)
      : 0;

    return {
      platform: "slack",
      coverage,
      org: {
        after_hours_ratio: Math.round(after_hours_ratio * 10000) / 10000,
        response_time_p50_minutes: response_time_p50_minutes !== null
          ? Math.round(response_time_p50_minutes * 100) / 100
          : null,
        participation_gini: Math.round(participation_gini * 10000) / 10000,
        reaction_rate: Math.round(reaction_rate * 10000) / 10000,
        cross_team_ratio: Math.round(cross_team_ratio * 10000) / 10000,
        vader_positive_pct: sentiment.positive_pct,
        vader_negative_pct: sentiment.negative_pct,
        vader_neutral_pct: sentiment.neutral_pct,
      },
      teams,
      daily,
    };
  }

  private emptySignals(): PlatformSignals {
    return {
      platform: "slack",
      coverage: 0,
      org: {
        after_hours_ratio: null,
        response_time_p50_minutes: null,
        participation_gini: null,
        reaction_rate: null,
        cross_team_ratio: null,
        vader_positive_pct: null,
        vader_negative_pct: null,
        vader_neutral_pct: null,
      },
      teams: {},
      daily: [],
    };
  }
}
