import { cookies } from "next/headers";
import SlackTestClient from "./SlackTestClient";

async function runAuthTest(token: string) {
  const res = await fetch("https://slack.com/api/auth.test", {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  return res.json();
}

export default async function SlackTestPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;

  let testResult: Record<string, unknown> | null = null;
  if (params.test === "1") {
    const cookieStore = await cookies();
    const token = cookieStore.get("slack_test_token")?.value;
    if (token) {
      testResult = await runAuthTest(decodeURIComponent(token));
    } else {
      testResult = { ok: false, error: "no_token — reconnect Slack first" };
    }
  }

  return (
    <SlackTestClient
      connected={params.connected === "true"}
      workspace={params.workspace}
      teamId={params.team_id}
      botUserId={params.bot_user_id}
      scope={params.scope}
      error={params.error}
      testResult={testResult}
    />
  );
}
