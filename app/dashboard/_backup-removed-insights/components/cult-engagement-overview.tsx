import styles from "../dashboard.module.css";

const dimensions = [
  {
    name: "Peer Relationships",
    score: 88,
    change: "+3%",
    trendUp: true,
    highest: true,
  },
  {
    name: "Manager Relationship",
    score: 82,
    change: "+4%",
    trendUp: true,
  },
  {
    name: "Role Clarity & Expectations",
    score: 79,
    change: "+1%",
    trendUp: true,
  },
  {
    name: "Motivation & Drive",
    score: 74,
    change: "-2%",
    trendUp: false,
  },
  {
    name: "Workload & Balance",
    score: 61,
    change: "-5%",
    trendUp: false,
    lowest: true,
    focusArea: true,
  },
];

export default function CultEngagementOverview() {
  return (
    <div
      className={`rounded-[1.5rem] bg-white p-6 md:col-span-12 md:p-8 ${styles.ambientShadow}`}
    >
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#1c1b1b]">
            Engagement Overview
          </h2>
          <p className="mt-1 text-sm text-[#3e4941]">
            Five engagement dimensions — current score vs last quarter
          </p>
        </div>
        <span className="rounded-full bg-[#006841]/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#006841]">
          Q4 2024
        </span>
      </div>

      <div className="space-y-4">
        {dimensions.map((dim) => (
          <div
            key={dim.name}
            className={`rounded-[1rem] p-5 ${
              dim.highest
                ? "bg-[#006841]/8"
                : dim.lowest
                  ? "bg-amber-50 ring-1 ring-amber-200"
                  : "bg-[#f6f3f2]"
            }`}
            style={dim.highest ? { backgroundColor: "rgba(0,104,65,0.06)" } : undefined}
          >
            <div className="flex items-center gap-4">
              {/* Score */}
              <div className="w-12 flex-shrink-0 text-right">
                <span
                  className={`text-2xl font-black ${
                    dim.highest
                      ? "text-[#006841]"
                      : dim.lowest
                        ? "text-amber-600"
                        : "text-[#1c1b1b]"
                  }`}
                >
                  {dim.score}
                </span>
              </div>

              {/* Bar + label */}
              <div className="flex-1">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#1c1b1b]">
                      {dim.name}
                    </span>
                    {dim.focusArea && (
                      <span className="rounded-full bg-amber-200 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.15em] text-amber-800">
                        Focus Area
                      </span>
                    )}
                    {dim.highest && (
                      <span className="rounded-full bg-[#dcfce7] px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.15em] text-[#166534]">
                        Highest
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-sm font-bold ${
                      dim.trendUp ? "text-emerald-600" : "text-red-500"
                    }`}
                  >
                    {dim.trendUp ? "▲" : "▼"} {dim.change} vs last qtr
                  </span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-[#ebe7e7]">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      dim.highest
                        ? "bg-[#006841]"
                        : dim.lowest
                          ? "bg-amber-400"
                          : "bg-[#008454]"
                    }`}
                    style={{ width: `${dim.score}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* AI insight line */}
      <div className="mt-6 rounded-[1rem] border border-[#72dba3]/30 bg-[#72dba3]/15 px-5 py-4">
        <p className="text-xs font-semibold text-[#006841]">
          <span className="font-black">AI Insight:</span> Workload &amp; Balance has declined for
          3 consecutive quarters — strongest predictor of voluntary attrition in your org.
        </p>
      </div>
    </div>
  );
}
