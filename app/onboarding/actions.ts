"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { adminClient } from "@/lib/supabase/admin";

// ── Shared helpers ────────────────────────────────────────────

async function getOrgId(): Promise<string> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data } = await adminClient
    .from("org_members")
    .select("org_id")
    .eq("user_id", user.id)
    .limit(1)
    .single();

  if (!data) redirect("/login");
  return data.org_id as string;
}

async function mergeData(
  orgId: string,
  patch: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  const { data } = await adminClient
    .from("orgs")
    .select("onboarding_data")
    .eq("id", orgId)
    .single();
  const current = (data?.onboarding_data as Record<string, unknown>) ?? {};
  return { ...current, ...patch };
}

// ── Step actions ──────────────────────────────────────────────

export async function saveGoals(goals: string[]) {
  const orgId = await getOrgId();
  const merged = await mergeData(orgId, { goals });
  await adminClient
    .from("orgs")
    .update({ onboarding_step: 1, onboarding_data: merged })
    .eq("id", orgId);
  redirect("/onboarding/strategy");
}

export async function saveStrategy(payload: {
  type: "qa";
  challenge: string;
  success: string;
}) {
  const orgId = await getOrgId();
  const merged = await mergeData(orgId, { strategy: payload });
  await adminClient
    .from("orgs")
    .update({ onboarding_step: 2, onboarding_data: merged })
    .eq("id", orgId);
  redirect("/onboarding/connect");
}

export async function skipStrategy() {
  const orgId = await getOrgId();
  await adminClient
    .from("orgs")
    .update({ onboarding_step: 2 })
    .eq("id", orgId);
  redirect("/onboarding/connect");
}

export async function completeConnect() {
  const orgId = await getOrgId();
  await adminClient
    .from("orgs")
    .update({ onboarding_step: 3 })
    .eq("id", orgId);
  redirect("/onboarding/welcome");
}

export async function completeOnboarding() {
  const orgId = await getOrgId();
  await adminClient
    .from("orgs")
    .update({
      onboarding_step: 4,
      onboarding_completed_at: new Date().toISOString(),
    })
    .eq("id", orgId);
  redirect("/dashboard");
}
