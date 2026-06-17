import { cookies } from "next/headers";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const raw = cookieStore.get("slack_test_token")?.value;
  if (!raw) return Response.json({ error: "no token" }, { status: 400 });

  const token = decodeURIComponent(raw);
  const channelName = request.nextUrl.searchParams.get("channel") ?? "team-marketing";

  // 1. List channels to find the ID
  const listRes = await fetch(
    `https://slack.com/api/conversations.list?types=public_channel&limit=200`,
    { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" }
  );
  const listData = await listRes.json();
  const channel = listData.channels?.find(
    (c: { name: string }) => c.name === channelName
  );

  if (!channel) {
    return Response.json({ error: `#${channelName} not found`, listOk: listData.ok });
  }

  // 2. Try conversations.join
  const joinRes = await fetch("https://slack.com/api/conversations.join", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ channel: channel.id }),
    cache: "no-store",
  });
  const joinData = await joinRes.json();

  // 3. Check auth.test to confirm which bot token is in use
  const authRes = await fetch("https://slack.com/api/auth.test", {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  const authData = await authRes.json();

  return Response.json({
    token_prefix: token.slice(0, 12) + "...",
    auth: { bot_id: authData.bot_id, user: authData.user, team: authData.team },
    channel: { id: channel.id, name: channel.name },
    join: joinData,
  });
}
