import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Workenvo | Legacy Dashboard",
};

export default function LegacyDashboardIndexPage() {
  redirect("/legacy/dashboard/envo-culture");
}
