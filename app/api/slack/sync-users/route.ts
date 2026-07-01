import { type NextRequest, NextResponse } from "next/server";
import { getSlackIntegration } from "@/lib/db";
import { decrypt } from "@/lib/crypto";
import { syncSlackWorkspace } from "@/lib/slack-sync";

/**
 * POST /api/slack/sync-users
 * Manually re-syncs Slack workspace users and teams.
 * Called from the admin UI "Review Your Teams" flow.
 */
export async function POST(request: NextRequest) {
  const orgId = process.env.DEV_ORG_ID;
  if (!orgId) {
    return NextResponse.json({ error: "DEV_ORG_ID not set" }, { status: 500 });
  }

  const integration = await getSlackIntegration(orgId);
  if (!integration?.bot_token_enc) {
    return NextResponse.json({ error: "No active Slack integration" }, { status: 400 });
  }

  let botToken: string;
  try {
    botToken = decrypt(integration.bot_token_enc);
  } catch {
    return NextResponse.json({ error: "Failed to decrypt Slack token" }, { status: 500 });
  }

  try {
    const result = await syncSlackWorkspace(orgId, botToken);
    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    console.error("[sync-users] Failed:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Sync failed" },
      { status: 500 },
    );
  }
}
