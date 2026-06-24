import { notFound } from "next/navigation";
import { PillarDetailView } from "@/app/dashboard/_backup-removed-insights/components/drilldown-detail-pages";
import { pillarDetails, type DomainKey } from "@/app/dashboard/_backup-removed-insights/components/drilldown-data";

export default async function LegacyPillarDetailPage({
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
