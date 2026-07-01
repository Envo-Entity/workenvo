import type { Metadata } from "next";
import { getLatestDashboard } from "@/lib/db";
import WorkforceDashboard from "./workforce-dashboard";
import { DEMO_DATA } from "./demo-data";

export const metadata: Metadata = { title: "Workenvo | Dashboard" };

export default async function DashboardPage() {
  const orgId = process.env.DEV_ORG_ID!;
  const data = await getLatestDashboard(orgId);
  return <WorkforceDashboard data={data ?? DEMO_DATA} />;
}
