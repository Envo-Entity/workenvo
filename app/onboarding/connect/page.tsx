import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { adminClient } from "@/lib/supabase/admin";
import { getSlackIntegration } from "@/lib/db";
import ConnectShell from "./_components/ConnectShell";

export default async function ConnectPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: membership } = await adminClient
    .from("org_members")
    .select("org_id")
    .eq("user_id", user.id)
    .limit(1)
    .single();

  if (!membership) redirect("/login");
  const orgId = membership.org_id as string;

  const integration = await getSlackIntegration(orgId);
  const isConnected = !!integration;

  return <ConnectShell isConnected={isConnected} orgId={orgId} />;
}
