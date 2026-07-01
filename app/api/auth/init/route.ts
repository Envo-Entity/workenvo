import { createClient } from "@/lib/supabase/server";
import { adminClient } from "@/lib/supabase/admin";

// Called once after a successful OTP verify on the client.
// Ensures the user has an org + org_members row, then returns where to redirect.
export async function POST() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Does this user already belong to an org?
  const { data: membership } = await adminClient
    .from("org_members")
    .select("org_id, role, orgs(onboarding_step)")
    .eq("user_id", user.id)
    .limit(1)
    .single();

  if (membership) {
    const orgsData = membership.orgs;
    const orgRow = Array.isArray(orgsData) ? orgsData[0] : orgsData;
    const step = (orgRow as { onboarding_step: number } | null)?.onboarding_step ?? 4;
    return Response.json({
      nextPath: step < 4 ? onboardingPath(step) : "/dashboard",
    });
  }

  // New user — create their org and make them org_admin.
  const orgName = deriveOrgName(user.email ?? "");

  const { data: org, error: orgError } = await adminClient
    .from("orgs")
    .insert({ name: orgName })
    .select("id")
    .single();

  if (orgError || !org) {
    console.error("[auth/init] failed to create org:", orgError?.message);
    return Response.json({ error: "Failed to create organisation" }, { status: 500 });
  }

  const { error: memberError } = await adminClient.from("org_members").insert({
    org_id: org.id,
    user_id: user.id,
    role: "org_admin",
  });

  if (memberError) {
    console.error("[auth/init] failed to create membership:", memberError.message);
    return Response.json({ error: "Failed to create membership" }, { status: 500 });
  }

  return Response.json({ nextPath: "/onboarding/goals" });
}

function onboardingPath(step: number): string {
  const map: Record<number, string> = {
    0: "/onboarding/goals",
    1: "/onboarding/strategy",
    2: "/onboarding/connect",
    3: "/onboarding/welcome",
  };
  return map[step] ?? "/onboarding/goals";
}

function deriveOrgName(email: string): string {
  const domain = email.split("@")[1] ?? "";
  const knownPersonal = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "icloud.com"];
  if (knownPersonal.includes(domain)) return "My Workspace";
  // e.g. acmecorp.com → Acmecorp
  const base = domain.split(".")[0] ?? "My Workspace";
  return base.charAt(0).toUpperCase() + base.slice(1);
}
