type SlackMessage = {
  ts: string;
  user?: string;
  text?: string;
  username?: string;
};

type SlackApiResponse<T> = T & { ok: boolean; error?: string };

async function slackGet<T>(
  endpoint: string,
  params: Record<string, string>,
  token: string
): Promise<SlackApiResponse<T>> {
  const url = new URL(`https://slack.com/api/${endpoint}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  return res.json();
}

async function slackPost<T>(
  endpoint: string,
  body: Record<string, string>,
  token: string
): Promise<SlackApiResponse<T>> {
  const res = await fetch(`https://slack.com/api/${endpoint}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  return res.json();
}

async function resolveDisplayName(
  userId: string,
  token: string
): Promise<string> {
  const data = await slackGet<{
    user?: { profile?: { display_name?: string; real_name?: string } };
  }>("users.info", { user: userId }, token);
  if (!data.ok || !data.user) return userId;
  const p = data.user.profile;
  return p?.display_name || p?.real_name || userId;
}

export async function fetchChannelMessages(
  channelName: string,
  token: string,
  daysBack = 7
): Promise<{ username: string; text: string; ts: string }[]> {
  const listData = await slackGet<{
    channels?: { id: string; name: string }[];
  }>("conversations.list", { types: "public_channel", limit: "200" }, token);

  if (!listData.ok || !listData.channels) {
    throw new Error(`conversations.list failed: ${listData.error}`);
  }

  const channel = listData.channels.find((c) => c.name === channelName);
  if (!channel) {
    throw new Error(`Channel #${channelName} not found`);
  }

  // Join the channel so the bot can read its history (no-op if already a member)
  const joinData = await slackPost<{ channel?: { id: string } }>(
    "conversations.join",
    { channel: channel.id },
    token
  );
  if (!joinData.ok) {
    throw new Error(`conversations.join failed: ${joinData.error}`);
  }

  const oldest = String(Math.floor(Date.now() / 1000) - daysBack * 86400);
  const histData = await slackGet<{ messages?: SlackMessage[] }>(
    "conversations.history",
    { channel: channel.id, oldest, limit: "200" },
    token
  );

  if (!histData.ok || !histData.messages) {
    throw new Error(`conversations.history failed: ${histData.error}`);
  }

  const nameCache = new Map<string, string>();

  const messages = await Promise.all(
    histData.messages
      .filter((m) => m.text && m.text.trim())
      .map(async (m) => {
        let username = m.username ?? "";
        if (m.user) {
          if (!nameCache.has(m.user)) {
            nameCache.set(m.user, await resolveDisplayName(m.user, token));
          }
          username = nameCache.get(m.user)!;
        }
        return { username, text: m.text!, ts: m.ts };
      })
  );

  return messages.reverse();
}
