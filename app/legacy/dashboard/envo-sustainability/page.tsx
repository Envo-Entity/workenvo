import type { Metadata } from "next";
import DashboardHeader from "@/app/dashboard/_backup-removed-insights/components/header";
import SustainabilityShell from "@/app/dashboard/_backup-removed-insights/components/sust-shell";

export const metadata: Metadata = {
  title: "Workenvo | Legacy – Sustainability",
};

export default function LegacySustainabilityPage() {
  return (
    <>
      <DashboardHeader
        tag="ESG Intelligence"
        title="Sustainability Index"
        ctaSecondary="Download Report"
        ctaPrimary="Generate AI View"
      />
      <SustainabilityShell />
    </>
  );
}
