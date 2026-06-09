import { notFound } from "next/navigation";
import { PillarDetailView } from "../../../components/drilldown-detail-pages";
import { pillarDetails, type DomainKey } from "../../../components/drilldown-data";

export default async function PillarDetailPage({
  params,
}: {
  params: Promise<{ domain: DomainKey; pillar: string }>;
}) {
  const { domain, pillar } = await params;
  const domainPillars = pillarDetails[domain];
  const data = domainPillars?.[pillar];

  if (!data) {
    notFound();
  }

  return <PillarDetailView data={data} />;
}
