import { supabase } from "@/lib/supabase";

export async function POST() {
  const orgId = process.env.DEV_ORG_ID!;

  const { data: integration, error } = await supabase
    .from("org_integrations")
    .select("id")
    .eq("org_id", orgId)
    .eq("type", "slack")
    .eq("status", "active")
    .single();

  if (error || !integration) {
    return Response.json({ error: "No active integration found" }, { status: 404 });
  }

  const { error: updateError } = await supabase
    .from("org_integrations")
    .update({ status: "inactive" })
    .eq("id", integration.id);

  if (updateError) {
    return Response.json({ error: "Failed to disconnect" }, { status: 500 });
  }

  return Response.json({ success: true });
}
