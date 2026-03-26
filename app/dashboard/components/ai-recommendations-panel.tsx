import DashboardIcon from "./dashboard-icon";

export default function AIRecommendationsPanel() {
  return (
    <div className="flex flex-col justify-between space-y-8 rounded-[3rem] bg-[#008454] p-8 text-white md:col-span-4">
      <div>
        <div className="mb-6 flex items-center gap-2">
          <DashboardIcon name="auto_awesome" fill className="text-[24px]" />
          <h2 className="text-xl font-bold tracking-tight">
            What matters and what to do next
          </h2>
        </div>

        <div className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-[#8ff8b4]">
              Primary Insight
            </p>
            <p className="text-sm leading-relaxed">
              Engagement in the Marketing team has dipped by 14%. Potential
              alignment gap detected in Q3 goals.
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-[#8ff8b4]">
              Recommendation
            </p>
            <p className="text-sm leading-relaxed">
              Schedule a &quot;Sync &amp; Soul&quot; session for middle managers
              to recalibrate project ownership.
            </p>
          </div>
        </div>
      </div>

      <button className="w-full rounded-[2rem] bg-white py-4 font-bold text-[#006841] transition-all hover:bg-stone-100 active:scale-95">
        Execute Strategy
      </button>
    </div>
  );
}
