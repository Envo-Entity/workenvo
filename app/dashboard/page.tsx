import type { Metadata } from "next";
import PlaceholderPage from "./components/placeholder-page";

export const metadata: Metadata = {
  title: "Workenvo | Dashboard",
};

export default function DashboardPage() {
  return (
    <PlaceholderPage
      tag="Insights"
      title="Dashboard"
      icon="dashboard"
      description="View the main Workenvo insights workspace from one consolidated dashboard entry."
      cta="Open"
    />
  );
}
