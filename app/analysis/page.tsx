import { redirect } from "next/navigation";

// This dev-only page is superseded by the pipeline at /api/analyze
// Redirect to the dashboard
export default function AnalysisPage() {
  redirect("/dashboard");
}
