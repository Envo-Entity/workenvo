"use client";

import type { AnalysisResult } from "@/lib/analysis";

type Props = {
  result?: AnalysisResult;
  error?: string;
  messageCount?: number;
  ran: boolean;
};

export default function AnalysisClient({ result, error, messageCount, ran }: Props) {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Workforce Health Analysis</h1>
          <p className="text-sm text-gray-500 mt-1">
            team-marketing · last 7 days · Gemini 3.1 Flash Lite
          </p>
        </div>

        {!ran && (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center space-y-4">
            <p className="text-gray-500 text-sm">
              Fetches Slack messages from #team-marketing and runs an AI analysis.
            </p>
            <a
              href="?run=1"
              className="inline-flex items-center justify-center rounded-lg bg-gray-900 text-white text-sm font-medium px-6 py-3 hover:bg-gray-800 transition-colors"
            >
              Run Analysis
            </a>
          </div>
        )}

        {ran && !result && !error && (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-gray-400 text-sm">
            No result returned.
          </div>
        )}

        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {result && (
          <div className="space-y-4">
            {messageCount !== undefined && (
              <p className="text-xs text-gray-400">{messageCount} messages analysed</p>
            )}

            {/* Health Score */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                Organisation Health Score
              </p>
              <div className="flex items-end gap-3">
                <span className={`text-6xl font-bold ${scoreColor(result.health_score)}`}>
                  {result.health_score}
                </span>
                <span className="text-gray-400 text-lg mb-2">/100</span>
              </div>
              <p className="text-gray-600 text-sm mt-3 leading-relaxed">{result.summary}</p>
            </div>

            {/* Risks */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-4">
                Top Risks
              </p>
              <div className="space-y-4">
                {result.risks.map((risk, i) => (
                  <div key={i} className="flex gap-3">
                    <SeverityBadge severity={risk.severity} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-gray-900">{risk.name}</p>
                        <span className="text-xs text-gray-400">
                          {Math.round(risk.confidence * 100)}% confidence
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                        {risk.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-4">
                Recommended Actions
              </p>
              <div className="space-y-3">
                {result.recommendations.map((rec, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <PriorityBadge priority={rec.priority} />
                    <p className="text-sm text-gray-700 flex-1">{rec.action}</p>
                  </div>
                ))}
              </div>
            </div>

            <a
              href="?run=1"
              className="block text-center text-xs text-gray-400 hover:text-gray-600 py-2"
            >
              Re-run analysis
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

function scoreColor(score: number) {
  if (score >= 70) return "text-green-600";
  if (score >= 45) return "text-yellow-500";
  return "text-red-500";
}

function SeverityBadge({ severity }: { severity: "low" | "medium" | "high" }) {
  const styles = {
    low: "bg-green-50 text-green-700 border-green-200",
    medium: "bg-yellow-50 text-yellow-700 border-yellow-200",
    high: "bg-red-50 text-red-700 border-red-200",
  };
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium capitalize shrink-0 mt-0.5 ${styles[severity]}`}
    >
      {severity}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: "low" | "medium" | "high" }) {
  const styles = {
    low: "bg-gray-100 text-gray-600",
    medium: "bg-blue-50 text-blue-700",
    high: "bg-purple-50 text-purple-700",
  };
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium capitalize shrink-0 mt-0.5 ${styles[priority]}`}
    >
      {priority}
    </span>
  );
}
