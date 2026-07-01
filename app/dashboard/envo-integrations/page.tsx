import type { Metadata } from "next";
import IntegrationsShell from "../components/integrations-shell";
import type { SlackStatus } from "../components/integrations-shell";
import { getSlackIntegration } from "@/lib/db";
import salesforce from "../../salesforce.png";
import workday from "../../workday.png";
import hubspot from "../../hubspot.png";

export const metadata: Metadata = {
  title: "Workenvo | Integrations",
};

const comingSoonIntegrations = [
  {
    name: "HubSpot",
    description:
      "Sync employee data and performance metrics directly from HubSpot.",
    logo: hubspot,
  },
  {
    name: "Salesforce",
    description:
      "Connect Salesforce so revenue momentum can be read alongside culture and productivity signals.",
    logo: salesforce,
  },
  {
    name: "Workday",
    description:
      "Keep org structure, people records, and workforce changes aligned with the intelligence layer in Workenvo.",
    logo: workday,
    logoClassName: "scale-[1.75]",
  },
];

export default async function IntegrationsPage({
  searchParams,
}: {
  searchParams: Promise<{
    connected?: string;
    error?: string;
    workspace?: string;
  }>;
}) {
  const { connected, error } = await searchParams;
  const orgId = process.env.DEV_ORG_ID!;
  const integration = await getSlackIntegration(orgId);

  const slackStatus: SlackStatus = integration
    ? {
        isConnected: true,
        workspaceName:
          (integration.config?.workspace_name as string) ?? "Workspace",
        lastSyncedAt: integration.last_synced_at,
      }
    : { isConnected: false, workspaceName: null, lastSyncedAt: null };

  const initialFlash =
    connected === "true" ? "connected" : error ? `error:${error}` : null;

  return (
    <IntegrationsShell
      integrations={comingSoonIntegrations}
      slackStatus={slackStatus}
      initialFlash={initialFlash}
      orgId={orgId}
      supabaseUrl={process.env.SUPABASE_URL!}
      anonKey={process.env.SUPABASE_ANON_KEY!}
    />
  );
}
