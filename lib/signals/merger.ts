/**
 * Signal Federation Merger — combines PlatformSignals from multiple producers
 * into a single FederatedSignals object. Coverage-weighted: signals with higher
 * coverage (more employees) take precedence in merging.
 */

import type { FederatedSignals, PlatformSignals } from "./types";

function weightedAvg(
  values: (number | null)[],
  weights: number[],
): number | null {
  const valid = values
    .map((v, i) => ({ v, w: weights[i] }))
    .filter(({ v }) => v !== null) as { v: number; w: number }[];
  if (valid.length === 0) return null;
  const totalWeight = valid.reduce((s, { w }) => s + w, 0);
  if (totalWeight === 0) return null;
  return valid.reduce((s, { v, w }) => s + v * w, 0) / totalWeight;
}

export function mergeSignals(platformSignals: PlatformSignals[]): FederatedSignals {
  if (platformSignals.length === 0) {
    return {
      platforms: [],
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
      coverage: {},
      teams: {},
      daily: [],
    };
  }

  const weights = platformSignals.map(p => p.coverage);

  const orgSignalKeys: (keyof PlatformSignals["org"])[] = [
    "after_hours_ratio", "response_time_p50_minutes", "participation_gini",
    "reaction_rate", "cross_team_ratio", "vader_positive_pct",
    "vader_negative_pct", "vader_neutral_pct",
  ];

  const mergedOrg: FederatedSignals["org"] = {} as FederatedSignals["org"];
  const coverage: Record<string, number> = {};

  for (const key of orgSignalKeys) {
    const values = platformSignals.map(p => p.org[key] as number | null);
    const validCount = values.filter(v => v !== null).length;
    mergedOrg[key] = weightedAvg(values, weights) as never;
    coverage[key] = validCount / platformSignals.length;
  }

  // Merge teams: union of all team names, take first non-null signal per team per key
  const allTeamNames = new Set(
    platformSignals.flatMap(p => Object.keys(p.teams)),
  );
  const teams: FederatedSignals["teams"] = {};
  for (const teamName of allTeamNames) {
    const teamData = platformSignals
      .map(p => p.teams[teamName])
      .filter(Boolean);
    if (teamData.length === 0) continue;
    // Use first available (Slack is primary for now)
    teams[teamName] = teamData[0];
  }

  // Use daily from the platform with highest coverage (Slack)
  const primary = platformSignals.sort((a, b) => b.coverage - a.coverage)[0];

  return {
    platforms: platformSignals.map(p => p.platform),
    org: mergedOrg,
    coverage,
    teams,
    daily: primary.daily,
  };
}
