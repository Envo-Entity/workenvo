import { cookies } from "next/headers";
import { fetchChannelMessages } from "@/lib/slack-api";
import { analyzeTeam, type AnalysisResult } from "@/lib/analysis";
import AnalysisClient from "./AnalysisClient";

const TEAM_NAME = "team-marketing";

async function runAnalysis(token: string): Promise<{
  result?: AnalysisResult;
  error?: string;
  messageCount?: number;
}> {
  try {
    const messages = await fetchChannelMessages(TEAM_NAME, token);
    const result = await analyzeTeam(TEAM_NAME, messages);
    return { result, messageCount: messages.length };
  } catch (err) {
    return { error: err instanceof Error ? err.message : String(err) };
  }
}

export default async function AnalysisPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;

  let result: AnalysisResult | undefined;
  let error: string | undefined;
  let messageCount: number | undefined;

  if (params.run === "1") {
    const cookieStore = await cookies();
    const raw = cookieStore.get("slack_test_token")?.value;
    if (!raw) {
      error = "No Slack token — connect Slack first at /slack-test";
    } else {
      const analysis = await runAnalysis(decodeURIComponent(raw));
      result = analysis.result;
      error = analysis.error;
      messageCount = analysis.messageCount;
    }
  }

  return (
    <AnalysisClient
      result={result}
      error={error}
      messageCount={messageCount}
      ran={params.run === "1"}
    />
  );
}
