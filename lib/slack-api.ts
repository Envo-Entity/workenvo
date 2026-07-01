export type SlackMessage = {
  ts: string;
  user?: string;
  text?: string;
  reply_count?: number;
  reactions?: { name: string; count: number }[];
};

export type SlackChannel = {
  id: string;
  name: string;
  num_members?: number;
  is_private?: boolean;
};

type ApiResponse<T> = T & { ok: boolean; error?: string };

async function get<T>(endpoint: string, params: Record<string, string>, token: string): Promise<ApiResponse<T>> {
  const url = new URL(`https://slack.com/api/${endpoint}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  return res.json();
}

async function post<T>(endpoint: string, body: Record<string, string>, token: string): Promise<ApiResponse<T>> {
  const res = await fetch(`https://slack.com/api/${endpoint}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  return res.json();
}

export async function getChannels(token: string): Promise<SlackChannel[]> {
  const all: SlackChannel[] = [];
  let cursor: string | undefined;

  do {
    const params: Record<string, string> = {
      types: "public_channel,private_channel",
      limit: "200",
      exclude_archived: "true",
    };
    if (cursor) params.cursor = cursor;

    const data = await get<{
      channels?: SlackChannel[];
      response_metadata?: { next_cursor?: string };
    }>("conversations.list", params, token);

    if (!data.ok) break;
    all.push(...(data.channels ?? []));
    cursor = data.response_metadata?.next_cursor || undefined;
  } while (cursor);

  return all;
}

export async function getChannelMessages(
  channelId: string,
  token: string,
  oldestTs: string,
): Promise<SlackMessage[]> {
  // Ensure bot is in the channel (no-op if already a member; fails silently for private channels)
  await post("conversations.join", { channel: channelId }, token);

  const all: SlackMessage[] = [];
  let cursor: string | undefined;

  do {
    const params: Record<string, string> = {
      channel: channelId,
      oldest: oldestTs,
      limit: "200",
    };
    if (cursor) params.cursor = cursor;

    const data = await get<{
      messages?: SlackMessage[];
      response_metadata?: { next_cursor?: string };
      has_more?: boolean;
    }>("conversations.history", params, token);

    if (!data.ok) break;
    all.push(...(data.messages ?? []).filter((m) => m.text?.trim()));
    cursor = data.response_metadata?.next_cursor || undefined;
  } while (cursor);

  return all;
}

// Cached user display name resolution
const nameCache = new Map<string, string>();

export async function getDisplayName(userId: string, token: string): Promise<string> {
  if (nameCache.has(userId)) return nameCache.get(userId)!;
  const data = await get<{
    user?: { profile?: { display_name?: string; real_name?: string } };
  }>("users.info", { user: userId }, token);
  const name =
    data.user?.profile?.display_name || data.user?.profile?.real_name || userId;
  nameCache.set(userId, name);
  return name;
}

export async function verifyToken(token: string): Promise<{ ok: boolean; team?: string; user?: string }> {
  return get<{ team?: string; user?: string }>("auth.test", {}, token);
}

export type SlackWorkspaceUser = {
  id: string;
  name: string;
  real_name?: string;
  profile?: {
    email?: string;
    real_name?: string;
    display_name?: string;
    title?: string;
    image_72?: string;
  };
  is_bot: boolean;
  deleted: boolean;
};

// Fetches all workspace members including emails (requires users:read.email scope)
export async function getWorkspaceUsers(token: string): Promise<{
  slack_user_id: string;
  email: string | null;
  name: string;
  title: string | null;
  avatar_url: string | null;
  is_bot: boolean;
  is_deleted: boolean;
}[]> {
  const all: SlackWorkspaceUser[] = [];
  let cursor: string | undefined;

  do {
    const params: Record<string, string> = { limit: "200" };
    if (cursor) params.cursor = cursor;

    const data = await get<{
      members?: SlackWorkspaceUser[];
      response_metadata?: { next_cursor?: string };
    }>("users.list", params, token);

    if (!data.ok) break;
    all.push(...(data.members ?? []));
    cursor = data.response_metadata?.next_cursor || undefined;
  } while (cursor);

  return all
    .filter(u => !u.profile?.email?.endsWith("@slack-bots.com"))
    .map(u => ({
      slack_user_id: u.id,
      email: u.profile?.email ?? null,
      name: u.profile?.real_name || u.profile?.display_name || u.real_name || u.name,
      title: u.profile?.title ?? null,
      avatar_url: u.profile?.image_72 ?? null,
      is_bot: u.is_bot,
      is_deleted: u.deleted,
    }));
}

export type SlackUserGroup = {
  id: string;
  name: string;
  handle: string;
  user_count: number;
};

// Fetches all user groups in the workspace (requires usergroups:read scope)
export async function getUserGroups(token: string): Promise<SlackUserGroup[]> {
  const data = await get<{
    usergroups?: SlackUserGroup[];
  }>("usergroups.list", { include_count: "true" }, token);

  if (!data.ok) return [];
  return data.usergroups ?? [];
}

// Fetches member IDs for a specific user group
export async function getUserGroupMembers(token: string, usergroupId: string): Promise<string[]> {
  const data = await get<{
    users?: string[];
  }>("usergroups.users.list", { usergroup: usergroupId }, token);

  if (!data.ok) return [];
  return data.users ?? [];
}
