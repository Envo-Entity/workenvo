import { notFound } from "next/navigation";
import { ScoreDetailView } from "../../components/drilldown-detail-pages";
import { scoreDetails, type DomainKey } from "../../components/drilldown-data";

export default async function ScoreDetailPage({
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
