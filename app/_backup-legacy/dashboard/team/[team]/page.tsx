import { notFound } from "next/navigation";
import { TeamDetailView } from "@/app/dashboard/_backup-removed-insights/components/drilldown-detail-pages";
import { teamDetails, type TeamSlug } from "@/app/dashboard/_backup-removed-insights/components/drilldown-data";

export default async function LegacyTeamDetailPage({
  params,
}: {
  params: Promise<{ team: TeamSlug }>;
}) {
  const { team } = await params;
  const data = teamDetails[team];

  if (!data) {
    notFound();
  }

  return <TeamDetailView team={data} />;
}
