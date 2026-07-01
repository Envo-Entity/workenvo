import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { adminClient } from "@/lib/supabase/admin";
import WelcomeShell from "./_components/WelcomeShell";

const GOAL_LABELS: Record<string, string> = {
  re_leaving: "Stop good employees leaving",
  re_tenure: "Increase average tenure",
  re_cost: "Reduce turnover cost",
  re_disconnect: "Boost employee connectedness",
  re_minimal: "Raise engagement above minimum effort",
  re_morale: "Lift team morale",
  re_recognition: "Improve recognition culture",
  cw_fragmented: "Unify fragmented culture",
  cw_silos: "Break down team silos",
  cw_trust: "Rebuild trust in leadership",
  cw_overwhelm: "Reduce overwhelm and exhaustion",
  cw_burnout: "Address burnout",
  cw_absence: "Lower absenteeism",
  me_ineffective: "Build leadership effectiveness",
  me_promoted: "Support new managers",
  me_difficult: "Enable difficult conversations",
  me_motivate: "Improve motivational leadership",
  me_inconsistent: "Drive consistency between managers",
  me_skills: "Strengthen people management skills",
  me_attrition: "Reduce manager-driven attrition",
};

export default async function WelcomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: membership } = await adminClient
    .from("org_members")
    .select("org_id, orgs(onboarding_data)")
    .eq("user_id", user.id)
    .limit(1)
    .single();

  if (!membership) redirect("/login");

  const orgsData = membership.orgs;
  const orgRow = Array.isArray(orgsData) ? orgsData[0] : orgsData;
  const onboardingData = (orgRow as { onboarding_data: Record<string, unknown> } | null)?.onboarding_data ?? {};
  const goalIds = (onboardingData.goals as string[]) ?? [];
  const goalLabels = goalIds
    .map((id) => GOAL_LABELS[id])
    .filter(Boolean)
    .slice(0, 5);

  const { data: userRow } = await adminClient
    .from("users")
    .select("full_name")
    .eq("id", user.id)
    .single();

  const firstName = userRow?.full_name?.split(" ")[0] ?? user.email?.split("@")[0] ?? "there";

  return <WelcomeShell firstName={firstName} goalLabels={goalLabels} />;
}
