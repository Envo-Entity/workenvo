import type { SlackChannel, SlackMessage } from "./slack-api";
import type { ComputedMetrics, EmployeeSignal, TeamMetrics } from "./types";

// Maps channel names to department names
const DEPT_MAP: Record<string, string> = {
  engineering: "Engineering", eng: "Engineering", dev: "Engineering", backend: "Engineering", frontend: "Engineering",
  product: "Product", design: "Product", ux: "Product",
  sales: "Sales", revenue: "Sales", bizdev: "Sales",
  support: "Support", "customer-success": "Support", cs: "Support", "customer-support": "Support",
  people: "People", hr: "People", culture: "People", "people-ops": "People",
  finance: "Finance", accounting: "Finance",
  marketing: "Marketing", growth: "Marketing",
};

export function inferTeam(channelName: string): string | null {
  const lower = channelName.toLowerCase();
  for (const [key, dept] of Object.entries(DEPT_MAP)) {
    if (lower.includes(key)) return dept;
  }
  return null;
}

// Messages sent outside 8am–8pm UTC Mon–Fri are "after hours"
function isAfterHours(ts: string): boolean {
  const d = new Date(parseFloat(ts) * 1000);
  const day = d.getUTCDay();   // 0=Sun, 6=Sat
  const hour = d.getUTCHours();
  return day === 0 || day === 6 || hour < 8 || hour >= 20;
}

// Get ISO week start (Monday) for a timestamp
function weekStart(ts: string): string {
  const d = new Date(parseFloat(ts) * 1000);
  const day = d.getUTCDay();
  const diff = (day === 0 ? -6 : 1 - day);
  d.setUTCDate(d.getUTCDate() + diff);
  d.setUTCHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}

function communicationTrend(counts: number[]): EmployeeSignal["communication_trend"] {
  if (counts.length < 4) return "stable";
  const recent = counts.slice(-2).reduce((a, b) => a + b, 0);
  const prev = counts.slice(-4, -2).reduce((a, b) => a + b, 0);
  if (recent === 0) return "silent";
  if (prev === 0) return "rising";
  const delta = (recent - prev) / (prev || 1);
  if (delta > 0.2) return "rising";
  if (delta < -0.2) return "declining";
  return "stable";
}

// Simple keyword frequency — extract top themes without storing message text
function extractThemes(messages: { text?: string }[]): string[] {
  const STOP = new Set([
    "the","a","an","and","or","but","is","it","to","of","in","for","on","at","with",
    "this","that","we","you","i","me","my","our","your","be","have","do","get","got",
    "just","also","can","will","would","could","should","not","no","yes","ok","hi","hey",
    "thanks","thank","please","let","know","need","make","see","look","think","time",
    "was","are","were","has","had","been","from","they","he","she","up","out","if","so",
    "all","what","when","how","there","here","any","some","new","one","more","about",
  ]);

  const freq = new Map<string, number>();
  for (const msg of messages) {
    const words = (msg.text ?? "").toLowerCase().replace(/[^a-z\s-]/g, " ").split(/\s+/);
    for (const w of words) {
      if (w.length > 3 && !STOP.has(w)) freq.set(w, (freq.get(w) ?? 0) + 1);
    }
  }
  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([w]) => w);
}

type ChannelData = {
  channel: SlackChannel;
  messages: SlackMessage[];
};

export function computeMetrics(
  channelData: ChannelData[],
  orgName: string,
  periodStart: Date,
  periodEnd: Date,
): ComputedMetrics {
  // Build 8 weekly buckets (most recent 8 weeks)
  const weeks: string[] = [];
  const end = new Date(periodEnd);
  end.setUTCHours(0, 0, 0, 0);
  for (let i = 7; i >= 0; i--) {
    const d = new Date(end);
    d.setUTCDate(d.getUTCDate() - i * 7);
    // Align to Monday
    const day = d.getUTCDay();
    d.setUTCDate(d.getUTCDate() - (day === 0 ? 6 : day - 1));
    weeks.push(d.toISOString().slice(0, 10));
  }

  // Group channels by inferred team
  const teamChannels = new Map<string, ChannelData[]>();
  for (const cd of channelData) {
    const team = inferTeam(cd.channel.name);
    if (!team) continue;
    if (!teamChannels.has(team)) teamChannels.set(team, []);
    teamChannels.get(team)!.push(cd);
  }

  // Per-user message tracking
  const userWeekly = new Map<string, { team: string; counts: Map<string, number>; afterHours: number; total: number }>();

  const teams: TeamMetrics[] = [];

  for (const [teamName, channels] of teamChannels) {
    const weekMsgCounts = new Array(8).fill(0);
    const weekAfterHours = new Array(8).fill(0);
    const weekTotalForAH = new Array(8).fill(0);
    const weekUsers = weeks.map(() => new Set<string>());
    const allMsgs: { text?: string }[] = [];

    for (const { messages } of channels) {
      allMsgs.push(...messages);
      for (const msg of messages) {
        const ws = weekStart(msg.ts);
        const idx = weeks.indexOf(ws);
        if (idx === -1) continue;

        weekMsgCounts[idx]++;
        weekTotalForAH[idx]++;
        if (isAfterHours(msg.ts)) weekAfterHours[idx]++;
        if (msg.user) weekUsers[idx].add(msg.user);

        // Track per-user
        const userId = msg.user ?? "unknown";
        if (!userWeekly.has(userId)) {
          userWeekly.set(userId, { team: teamName, counts: new Map(), afterHours: 0, total: 0 });
        }
        const u = userWeekly.get(userId)!;
        u.team = teamName;
        u.counts.set(ws, (u.counts.get(ws) ?? 0) + 1);
        u.total++;
        if (isAfterHours(msg.ts)) u.afterHours++;
      }
    }

    // Estimate member count from unique active users across all weeks
    const allUsers = new Set<string>();
    weekUsers.forEach((s) => s.forEach((u) => allUsers.add(u)));
    const memberCount = Math.max(allUsers.size, channels[0]?.channel.num_members ?? 0);

    const weekParticipation = weekUsers.map((s) =>
      memberCount > 0 ? Math.round((s.size / memberCount) * 100) / 100 : 0,
    );
    const weekAfterHoursPct = weekTotalForAH.map((total, i) =>
      total > 0 ? Math.round((weekAfterHours[i] / total) * 100) / 100 : 0,
    );

    teams.push({
      name: teamName,
      employee_count: memberCount,
      weekly_message_counts: weekMsgCounts,
      weekly_after_hours_pcts: weekAfterHoursPct,
      weekly_participation_rates: weekParticipation,
      top_themes: extractThemes(allMsgs),
      silent_members: [],    // resolved below after we have display names
      manager_name: null,
    });
  }

  // Build employee signals from per-user data
  const employees: EmployeeSignal[] = [];
  let totalAfterHours = 0;
  let totalMsgs = 0;

  for (const [, u] of userWeekly) {
    const weekCounts = weeks.map((w) => u.counts.get(w) ?? 0);
    const ahPct = u.total > 0 ? u.afterHours / u.total : 0;
    totalAfterHours += u.afterHours;
    totalMsgs += u.total;

    employees.push({
      display_name: "", // resolved by pipeline with Slack API
      team: u.team,
      weekly_message_counts: weekCounts,
      after_hours_pct: Math.round(ahPct * 100) / 100,
      communication_trend: communicationTrend(weekCounts),
      is_potential_manager: false,
    });
  }

  const active30d = employees.filter(
    (e) => e.weekly_message_counts.slice(-4).reduce((a, b) => a + b, 0) > 0,
  ).length;

  return {
    org_name: orgName,
    period_start: periodStart.toISOString().slice(0, 10),
    period_end: periodEnd.toISOString().slice(0, 10),
    total_employees_tracked: userWeekly.size,
    active_last_30d: active30d,
    overall_after_hours_pct:
      totalMsgs > 0 ? Math.round((totalAfterHours / totalMsgs) * 100) / 100 : 0,
    teams,
    employees,
    surveys: [],  // populated by pipeline from DB
  };
}
