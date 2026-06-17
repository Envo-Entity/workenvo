import { notFound } from "next/navigation";
import { ScoreDetailView } from "@/app/dashboard/_backup-removed-insights/components/drilldown-detail-pages";
import { scoreDetails, type DomainKey } from "@/app/dashboard/_backup-removed-insights/components/drilldown-data";

export default async function LegacyScoreDetailPage({
  params,
}: {
  params: Promise<{ domain: DomainKey }>;
}) {
  const { domain } = await params;
  const data = scoreDetails[domain];

  if (!data) {
    notFound();
  }

  return <ScoreDetailView data={data} />;
}
