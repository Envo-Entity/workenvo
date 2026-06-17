import { type NextRequest } from "next/server";

function getOrigin(request: NextRequest): string {
  // When behind ngrok/proxies, x-forwarded-host has the real public domain.
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto =
    request.headers.get("x-forwarded-proto")?.split(",")[0] ?? "https";
  if (forwardedHost) {
    return `${forwardedProto}://${forwardedHost}`;
  }
  const { protocol, host } = new URL(request.url);
  return `${protocol}//${host}`;
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const error = request.nextUrl.searchParams.get("error");

  if (error || !code) {
    const reason = error ?? "missing_code";
    return Response.redirect(
      `${getOrigin(request)}/slack-test?error=${reason}`
    );
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
    return Response.redirect(
      `${getOrigin(request)}/slack-test?error=${data.error}`
    );
  }

  const params = new URLSearchParams({
    connected: "true",
    workspace: data.team.name,
    team_id: data.team.id,
    bot_user_id: data.bot_user_id ?? "",
    scope: data.scope ?? "",
  });

  // cookies().set() doesn't attach to a manually-returned Response in Route Handlers,
  // so we set the Set-Cookie header directly on the redirect response.
  return new Response(null, {
    status: 302,
    headers: {
      Location: `${getOrigin(request)}/slack-test?${params}`,
      "Set-Cookie": `slack_test_token=${encodeURIComponent(data.access_token)}; HttpOnly; Path=/; Max-Age=3600; SameSite=Lax`,
    },
  });
}
