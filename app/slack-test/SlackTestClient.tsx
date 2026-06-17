"use client";

type Props = {
  connected: boolean;
  workspace?: string;
  teamId?: string;
  botUserId?: string;
  scope?: string;
  error?: string;
  testResult?: Record<string, unknown> | null;
};

export default function SlackTestClient({
  connected,
  workspace,
  teamId,
  botUserId,
  scope,
  error,
  testResult,
}: Props) {
  const testUrl = `?connected=true&workspace=${workspace}&team_id=${teamId}&bot_user_id=${botUserId}&scope=${scope}&test=1`;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 w-full max-w-lg p-8 space-y-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Slack Connection Test
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Dev-only page — verifies the OAuth flow end to end
          </p>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            OAuth error: <span className="font-mono">{error}</span>
          </div>
        )}

        {!connected && !error && (
          <a
            href="/api/slack/install"
            className="flex items-center justify-center gap-2 w-full rounded-lg bg-[#4A154B] text-white text-sm font-medium px-4 py-3 hover:bg-[#3d1040] transition-colors"
          >
            <SlackIcon />
            Connect Slack workspace
          </a>
        )}

        {connected && (
          <div className="space-y-4">
            <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700 font-medium">
              Connected successfully
            </div>

            <dl className="space-y-2 text-sm">
              <Row label="Workspace" value={workspace} />
              <Row label="Team ID" value={teamId} />
              <Row label="Bot User ID" value={botUserId} />
              <Row label="Scopes" value={scope} mono />
            </dl>

            {!testResult ? (
              <a
                href={testUrl}
                className="flex items-center justify-center w-full rounded-lg border border-gray-300 text-gray-700 text-sm font-medium px-4 py-2.5 hover:bg-gray-50 transition-colors"
              >
                Test connection (auth.test)
              </a>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-gray-500 font-medium">
                  auth.test response
                </p>
                <pre className="rounded-lg bg-gray-900 text-green-400 text-xs p-4 overflow-auto">
                  {JSON.stringify(testResult, null, 2)}
                </pre>
              </div>
            )}

            <a
              href="/api/slack/install"
              className="block text-center text-xs text-gray-400 hover:text-gray-600"
            >
              Reconnect with a different workspace
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  mono,
}: {
  label: string;
  value?: string;
  mono?: boolean;
}) {
  if (!value) return null;
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-gray-500">{label}</dt>
      <dd className={`text-gray-900 text-right ${mono ? "font-mono" : ""}`}>
        {value}
      </dd>
    </div>
  );
}

function SlackIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
    </svg>
  );
}
