import type { Metadata } from "next";
import DashboardHeader from "../components/header";
import styles from "../dashboard.module.css";
import Image from "next/image";
import salesforce from "../../salesforce.png"
import workday from "../../workday.png"
import hubspot from "../../hubspot.png"

export const metadata: Metadata = {
  title: "Workenvo | Settings",
};

const integrations = [
  {
    name: "HubSpot",
    description: "Sync employee data and performance metrics directly from HubSpot.",
    logoUrl: hubspot,
    logoClass: "",
  },
  {
    name: "Salesforce",
    description: "Connect your Salesforce account to correlate sales performance with culture health.",
    logoUrl: salesforce,
    logoClass: "",
  },
  {
    name: "Workday",
    description: "Automate sync of HR data, retention metrics, and organizational hierarchy.",
    logoUrl: workday,
    logoClass: "scale-[1.75]", // Zoomed in workday symbol
  },
];

export default function IntegrationsPage() {
  return (
    <div className="space-y-6">
      <DashboardHeader
        tag="Integrations"
        title="Connect Your Tools"
        ctaSecondary=""
        ctaPrimary=""
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {integrations.map((integration) => (
          <div
            key={integration.name}
            className={`flex flex-col justify-between rounded-[1.5rem] bg-[#ffffff] p-6 ${styles.ambientShadow}`}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f6f3f2]">
                <Image
                  src={integration.logoUrl}
                  alt={`${integration.name} logo`}
                  className={`h-6 w-6 object-contain ${integration.logoClass}`}
                />
              </div>
              <h2 className="text-xl font-bold tracking-tight text-[#1c1b1b]">
                {integration.name}
              </h2>
            </div>

            <p className="mb-6 text-sm text-[#3e4941] flex-1">
              {integration.description}
            </p>

            <button className="flex w-full items-center justify-center gap-2 rounded-full bg-[#008454] px-4 py-3 text-sm font-semibold text-white transition-all hover:scale-105">
              Connect
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
