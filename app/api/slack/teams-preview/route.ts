import { supabase } from "@/lib/supabase";
import { decrypt } from "@/lib/crypto";
import { inferTeam } from "@/lib/metrics";

export async function GET() {
  const orgId = process.env.DEV_ORG_ID!;

  const { data: integration, error } = await supabase
    .from("org_integrations")
    .select("bot_token_enc")
    .eq("org_id", orgId)
    .eq("type", "slack")
    .eq("status", "active")
    .single();

  if (error || !integration?.bot_token_enc) {
    return Response.json({ error: "No active Slack integration" }, { status: 404 });
  }

  let botToken: string;
  try {
    botToken = decrypt(integration.bot_token_enc as string);
  } catch {
    return Response.json({ error: "Failed to decrypt token" }, { status: 500 });
  }

  const channels: { id: string; name: string; num_members?: number }[] = [];
  let cursor: string | undefined;

  do {
    const params = new URLSearchParams({
      types: "public_channel,private_channel",
      limit: "200",
      exclude_archived: "true",
    });
    if (cursor) params.set("cursor", cursor);

    const res = await fetch(`https://slack.com/api/conversations.list?${params}`, {
      headers: { Authorization: `Bearer ${botToken}` },
    });
    const data = (await res.json()) as {
      ok: boolean;
      channels?: { id: string; name: string; num_members?: number }[];
      response_metadata?: { next_cursor?: string };
    };

    if (!data.ok) break;
    channels.push(...(data.channels ?? []));
    cursor = data.response_metadata?.next_cursor || undefined;
  } while (cursor);

  // Group channels by inferred team
  const teamMap = new Map<string, { channels: string[]; member_count: number }>();
  for (const ch of channels) {
    const team = inferTeam(ch.name);
    if (!team) continue;
    if (!teamMap.has(team)) teamMap.set(team, { channels: [], member_count: 0 });
    const entry = teamMap.get(team)!;
    entry.channels.push(ch.name);
    entry.member_count = Math.max(entry.member_count, ch.num_members ?? 0);
  }

  const teams = [...teamMap.entries()]
    .map(([name, data]) => ({ name, channels: data.channels, member_count: data.member_count }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return Response.json({ teams, total_channels: channels.length });
}
