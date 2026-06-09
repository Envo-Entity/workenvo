import { notFound } from "next/navigation";
import { TeamDetailView } from "../../components/drilldown-detail-pages";
import { teamDetails, type TeamSlug } from "../../components/drilldown-data";

export default async function TeamDetailPage({
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
