import { redirect } from "next/navigation";

const SCOPES = [
  "channels:read",
  "channels:history",
  "channels:join",
  "users:read",
  "team:read",
].join(",");

export async function GET() {
  const params = new URLSearchParams({
    client_id: process.env.SLACK_CLIENT_ID!,
    scope: SCOPES,
    redirect_uri: process.env.SLACK_REDIRECT_URI!,
  });

  redirect(`https://slack.com/oauth/v2/authorize?${params}`);
}
