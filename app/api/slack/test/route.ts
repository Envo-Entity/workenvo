import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("slack_test_token")?.value;

  if (!token) {
    return Response.json({ ok: false, error: "no_token" }, { status: 401 });
  }

  const res = await fetch("https://slack.com/api/auth.test", {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  return Response.json(data);
}
