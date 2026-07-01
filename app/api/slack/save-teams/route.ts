import { upsertTeams } from "@/lib/db";

export async function POST(req: Request) {
  const orgId = process.env.DEV_ORG_ID!;

  const body = (await req.json().catch(() => ({}))) as { teams?: { name: string }[] };
  if (!body.teams || !Array.isArray(body.teams) || body.teams.length === 0) {
    return Response.json({ error: "teams array required" }, { status: 400 });
  }

  const teamsToSave = body.teams
    .map(t => t.name?.trim())
    .filter(Boolean)
    .map(name => ({ name, source: "inferred" as const }));

  if (teamsToSave.length === 0) {
    return Response.json({ error: "No valid team names" }, { status: 400 });
  }

  try {
    const count = await upsertTeams(orgId, teamsToSave);
    return Response.json({ saved: count, teams: teamsToSave.map(t => t.name) });
  } catch (err) {
    return Response.json({ error: (err as Error).message }, { status: 500 });
  }
}
