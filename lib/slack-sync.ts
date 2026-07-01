/**
 * Slack workspace sync — resolves identities and infers org structure.
 *
 * Email is the canonical identity key (universal across all platforms).
 * Reference: Microsoft Viva Insights uses Azure AD email as the canonical
 * key for cross-platform identity federation.
 * https://learn.microsoft.com/en-us/viva/insights/advanced/introduction-to-advanced-insights
 *
 * Team inference from Slack user groups:
 * Slack usergroups (e.g. @engineering, @design) are created by workspace
 * admins and directly represent team structure — more reliable than
 * channel membership heuristics.
 */

import { getWorkspaceUsers, getUserGroups, getUserGroupMembers } from "./slack-api";
import { upsertEmployees, upsertTeams, linkEmployeeTeams } from "./db";

export type SlackEmployee = {
  slack_user_id: string;
  email: string | null;
  name: string;
  title: string | null;
  avatar_url: string | null;
  is_bot: boolean;
  is_deleted: boolean;
};

export type InferredTeam = {
  name: string;
  slack_usergroup_id: string;
  member_slack_ids: string[];
  source: "slack_usergroup";
};

export type SyncResult = {
  employees_upserted: number;
  employees_deactivated: number;
  teams_upserted: number;
  identity_links: number;
};

export async function syncSlackWorkspace(
  orgId: string,
  botToken: string,
): Promise<SyncResult> {
  const [slackUsers, userGroups] = await Promise.all([
    getWorkspaceUsers(botToken),
    getUserGroups(botToken),
  ]);

  // ── 1. Sync employees ─────────────────────────────────────────
  const activeUsers = slackUsers.filter(u => !u.is_deleted && !u.is_bot);
  const deletedUsers = slackUsers.filter(u => u.is_deleted && !u.is_bot);

  const employeesToUpsert = activeUsers.map(u => ({
    slack_user_id: u.slack_user_id,
    email: u.email,
    name: u.name,
    title: u.title,
    avatar_url: u.avatar_url,
    status: "active" as const,
    employment_type: "employee" as const,
  }));

  const upserted = await upsertEmployees(orgId, employeesToUpsert);

  // Mark deleted Slack accounts as inactive
  const deactivatedSlackIds = deletedUsers
    .map(u => u.slack_user_id)
    .filter(Boolean);
  const deactivated = deactivatedSlackIds.length > 0
    ? await deactivateEmployees(orgId, deactivatedSlackIds)
    : 0;

  // ── 2. Sync teams from Slack usergroups ───────────────────────
  let teamsUpserted = 0;
  let identityLinks = 0;

  if (userGroups.length > 0) {
    // Fetch members for each usergroup in parallel
    const groupsWithMembers = await Promise.all(
      userGroups.map(async (group) => {
        const members = await getUserGroupMembers(botToken, group.id);
        return { ...group, member_slack_ids: members };
      }),
    );

    // Filter to groups that look like teams (not just random notification groups)
    const teamGroups = groupsWithMembers.filter(g =>
      g.member_slack_ids.length >= 2 &&   // at least 2 members
      g.member_slack_ids.length <= 50 &&  // not org-wide groups
      !g.handle.includes("here") &&       // not @here/@channel style
      !g.handle.includes("channel"),
    );

    const teamsToUpsert = teamGroups.map(g => ({
      name: capitalizeTeamName(g.name || g.handle),
      slack_usergroup_id: g.id,
      source: "slack_usergroup" as const,
    }));

    if (teamsToUpsert.length > 0) {
      teamsUpserted = await upsertTeams(orgId, teamsToUpsert);

      // Link employees to teams via Slack user IDs
      for (const group of teamGroups) {
        identityLinks += await linkEmployeeTeams(
          orgId,
          group.id,
          group.member_slack_ids,
        );
      }
    }
  }

  return {
    employees_upserted: upserted,
    employees_deactivated: deactivated,
    teams_upserted: teamsUpserted,
    identity_links: identityLinks,
  };
}

function capitalizeTeamName(name: string): string {
  return name
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, c => c.toUpperCase())
    .trim();
}

// Deactivate employees whose Slack accounts were deleted
async function deactivateEmployees(
  orgId: string,
  slackUserIds: string[],
): Promise<number> {
  const { supabase } = await import("./supabase");
  const { error, count } = await supabase
    .from("employees")
    .update({ status: "inactive", updated_at: new Date().toISOString() })
    .eq("org_id", orgId)
    .in("slack_user_id", slackUserIds);
  if (error) console.error("Failed to deactivate employees:", error);
  return count ?? 0;
}
