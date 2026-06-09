import type { Metadata } from "next";
import DashboardHeader from "../components/header";
import SustainabilityShell from "../components/sust-shell";

export const metadata: Metadata = {
  title: "Workenvo | Sustainability",
};

export default function SustainabilityPage() {
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
