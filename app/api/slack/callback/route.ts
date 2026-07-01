import { type NextRequest } from "next/server";
import { encrypt } from "@/lib/crypto";
import { ensureOrg, upsertSlackIntegration } from "@/lib/db";
import { syncSlackWorkspace } from "@/lib/slack-sync";

function getOrigin(request: NextRequest): string {
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto")?.split(",")[0] ?? "https";
  if (forwardedHost) return `${forwardedProto}://${forwardedHost}`;
  const { protocol, host } = new URL(request.url);
  return `${protocol}//${host}`;
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const error = request.nextUrl.searchParams.get("error");
  const state = request.nextUrl.searchParams.get("state");

  // If the install request came from localhost, redirect back there so the
  // user's existing session (scoped to localhost) is still valid.
  const redirectOrigin = (state && /^https?:\/\/localhost/.test(state))
    ? state
    : getOrigin(request);

  if (error || !code) {
    return Response.redirect(`${redirectOrigin}/dashboard/envo-integrations?error=${error ?? "missing_code"}`);
  }

  const tokenRes = await fetch("https://slack.com/api/oauth.v2.access", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.SLACK_CLIENT_ID!,
      client_secret: process.env.SLACK_CLIENT_SECRET!,
      code,
      redirect_uri: process.env.SLACK_REDIRECT_URI!,
    }),
  });

  const data = await tokenRes.json();
  if (!data.ok) {
    return Response.redirect(`${getOrigin(request)}/dashboard/envo-integrations?error=${data.error}`);
  }

  const orgId = process.env.DEV_ORG_ID!;
  const workspaceName: string = data.team?.name ?? "Workspace";
  const teamId: string = data.team?.id ?? "unknown";
  const scopes: string = data.scope ?? "";
  const botToken: string = data.access_token;

  try {
    // Ensure org exists (idempotent)
    await ensureOrg(orgId, workspaceName);

    // Persist encrypted token
    const encryptedToken = encrypt(botToken);
    await upsertSlackIntegration(orgId, teamId, encryptedToken, workspaceName, scopes);

    // Sync workspace users + teams in the background (fire-and-forget, don't block redirect)
    syncSlackWorkspace(orgId, botToken).catch(err =>
      console.error("[slack-sync] Initial workspace sync failed:", err),
    );
  } catch (err) {
    console.error("Failed to save Slack integration:", err);
    return Response.redirect(`${redirectOrigin}/dashboard/envo-integrations?error=db_error`);
  }

  return Response.redirect(
    `${redirectOrigin}/dashboard/envo-integrations?connected=true&workspace=${encodeURIComponent(workspaceName)}`,
  );
}
