import { type NextRequest } from "next/server";

const SCOPES = [
  "channels:read",
  "channels:history",
  "channels:join",
  "groups:read",
  "groups:history",
  "users:read",
  "users:read.email",
  "reactions:read",
  "team:read",
].join(",");

export async function GET(request: NextRequest) {
  const origin = new URL(request.url).origin;
  const params = new URLSearchParams({
    client_id: process.env.SLACK_CLIENT_ID!,
    scope: SCOPES,
    redirect_uri: process.env.SLACK_REDIRECT_URI!,
    state: origin,
  });

  return Response.redirect(`https://slack.com/oauth/v2/authorize?${params}`);
}
