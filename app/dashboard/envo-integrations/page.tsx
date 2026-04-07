import type { Metadata } from "next";
import IntegrationsShell from "../components/integrations-shell";
import salesforce from "../../salesforce.png";
import workday from "../../workday.png";
import hubspot from "../../hubspot.png";

export const metadata: Metadata = {
  title: "Workenvo | Integrations",
};

const integrations = [
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

export default function IntegrationsPage() {
  return <IntegrationsShell integrations={integrations} />;
}
