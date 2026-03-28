import DashboardIcon from "./dashboard-icon";

type AIRecommendationsPanelProps = {
  insight: string;
  recommendation: string;
  ctaLabel: string;
};

export default function AIRecommendationsPanel({
  insight,
  recommendation,
  ctaLabel,
}: AIRecommendationsPanelProps) {
  return (
    <div className="flex flex-col justify-between space-y-8 rounded-[1.5rem] bg-[#008454] p-6 text-white md:col-span-4">
      <div>
        <div className="mb-6 flex items-center gap-2">
          <DashboardIcon name="auto_awesome" fill className="text-[24px]" />
          <h2 className="text-xl font-bold tracking-tight">
            What matters and what to do next
          </h2>
        </div>

        <div className="space-y-6">
          <div className="rounded-[1rem] border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-[#8ff8b4]">
              Primary Insight
            </p>
            <p className="text-sm leading-relaxed">{insight}</p>
          </div>

          <div className="rounded-[1rem] border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-[#8ff8b4]">
              Recommendation
            </p>
            <p className="text-sm leading-relaxed">{recommendation}</p>
          </div>
        </div>
      </div>

      <button className="w-full rounded-full bg-white py-3 font-bold text-[#006841] transition-all hover:bg-stone-100 active:scale-95">
        {ctaLabel}
      </button>
    </div>
  );
}
