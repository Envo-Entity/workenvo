import type { Metadata } from "next";
import WorkforceDashboard from "./workforce-dashboard";

export const metadata: Metadata = {
  title: "Workenvo | Dashboard",
};

export default function DashboardPage() {
  return <WorkforceDashboard />;
}
