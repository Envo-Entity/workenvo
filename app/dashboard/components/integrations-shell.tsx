"use client";

import { useEffect, useRef, useState } from "react";
import Image, { type StaticImageData } from "next/image";
import { useRouter } from "next/navigation";
import DashboardHeader from "./header";
import styles from "../dashboard.module.css";

// ── Types ────────────────────────────────────────────────────────────────────

export type SlackStatus = {
  isConnected: boolean;
  workspaceName: string | null;
  lastSyncedAt: string | null;
};

type Integration = {
  name: string;
  description: string;
  logo: StaticImageData;
  logoClassName?: string;
};

type ToastState = {
  id: number;
  title: string;
  message: string;
};

type AnalysisState = "idle" | "loading" | "success" | "error";

type ChannelInfo = {
  id: string;
  name: string;
  num_members?: number;
  is_private?: boolean;
};

type TeamPreview = {
  name: string;
  channels: string[];
  member_count: number;
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatLastSynced(ts: string | null): string {
  if (!ts) return "Never synced";
  const diffMs = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function SlackIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="20" y="38" width="60" height="10" rx="5" fill="#36C5F0" />
      <rect x="20" y="52" width="60" height="10" rx="5" fill="#2EB67D" />
      <rect x="38" y="20" width="10" height="60" rx="5" fill="#ECB22E" />
      <rect x="52" y="20" width="10" height="60" rx="5" fill="#E01E5A" />
    </svg>
  );
}

// ── Component ────────────────────────────────────────────────────────────────

type IntegrationsShellProps = {
  integrations: Integration[];
  slackStatus?: SlackStatus | null;
  initialFlash?: string | null;
  orgId: string;
  supabaseUrl: string;
  anonKey: string;
};

export default function IntegrationsShell({
  integrations,
  slackStatus,
  initialFlash,
  orgId,
  supabaseUrl,
  anonKey,
}: IntegrationsShellProps) {
  const router = useRouter();
  const [connectingTool, setConnectingTool] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [analysisState, setAnalysisState] = useState<AnalysisState>("idle");
  const [analysisMsg, setAnalysisMsg] = useState<string>("");
  const timeoutRef = useRef<number | null>(null);

  // Channels
  const [channelsOpen, setChannelsOpen] = useState(false);
  const [channels, setChannels] = useState<ChannelInfo[] | null>(null);
  const [channelsLoading, setChannelsLoading] = useState(false);

  // Disconnect
  const [confirmDisconnect, setConfirmDisconnect] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);

  // Team mapping
  const [teamsOpen, setTeamsOpen] = useState(false);
  const [teamPreviews, setTeamPreviews] = useState<TeamPreview[] | null>(null);
  const [editedTeamNames, setEditedTeamNames] = useState<Record<number, string>>({});
  const [removedTeams, setRemovedTeams] = useState<Set<number>>(new Set());
  const [teamsLoading, setTeamsLoading] = useState(false);
  const [teamsSaving, setTeamsSaving] = useState(false);
  const [teamsSaved, setTeamsSaved] = useState(false);

  // Show toast from OAuth redirect params once on mount, then clean the URL
  useEffect(() => {
    if (!initialFlash) return;

    if (initialFlash === "connected") {
      showToast("Slack connected", `${slackStatus?.workspaceName ?? "Your workspace"} is now linked to Workenvo.`);
    } else if (initialFlash.startsWith("error:")) {
      const code = initialFlash.slice(6);
      showToast("Connection failed", `Slack returned an error: ${code}. Please try again.`);
    }

    router.replace("/dashboard/envo-integrations");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  function showToast(title: string, message: string) {
    const next: ToastState = { id: Date.now(), title, message };
    setToast(next);
    if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      setToast((t) => (t?.id === next.id ? null : t));
    }, 4000);
  }

  const handleConnect = (toolName: string) => {
    setConnectingTool(toolName);
    window.setTimeout(() => {
      setConnectingTool(null);
      showToast(`${toolName} connected`, `${toolName} is now ready to sync with Workenvo.`);
    }, 900);
  };

  const handleRunAnalysis = async () => {
    setAnalysisState("loading");
    setAnalysisMsg("");
    try {
      const res = await fetch(`${supabaseUrl}/functions/v1/nightly-analysis`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${anonKey}`,
        },
        body: JSON.stringify({
          org_id: orgId,
          org_name: slackStatus?.workspaceName ?? "Workspace",
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (res.status === 202) {
        setAnalysisState("success");
        setAnalysisMsg("Running in background…");
        showToast("Analysis started", "Pipeline is running — dashboard will update in ~1 min.");
      } else {
        setAnalysisState("error");
        setAnalysisMsg(data.error ?? `Error ${res.status}`);
        showToast("Analysis failed", data.error ?? "Something went wrong.");
      }
    } catch {
      setAnalysisState("error");
      setAnalysisMsg("Network error");
      showToast("Analysis failed", "Could not reach the server. Check your connection.");
    }
  };

  const handleToggleChannels = async () => {
    const next = !channelsOpen;
    setChannelsOpen(next);
    if (next && channels === null) {
      setChannelsLoading(true);
      try {
        const res = await fetch("/api/slack/channels");
        const data = (await res.json()) as { channels?: ChannelInfo[]; error?: string };
        setChannels(data.channels ?? []);
      } catch {
        setChannels([]);
      } finally {
        setChannelsLoading(false);
      }
    }
  };

  const handleDisconnect = async () => {
    setDisconnecting(true);
    try {
      await fetch("/api/slack/disconnect", { method: "POST" });
      router.refresh();
    } catch {
      setDisconnecting(false);
      setConfirmDisconnect(false);
      showToast("Disconnect failed", "Could not disconnect. Please try again.");
    }
  };

  const handleToggleTeams = async () => {
    const next = !teamsOpen;
    setTeamsOpen(next);
    if (next && teamPreviews === null) {
      setTeamsLoading(true);
      try {
        const res = await fetch("/api/slack/teams-preview");
        const data = (await res.json()) as { teams?: TeamPreview[]; error?: string };
        setTeamPreviews(data.teams ?? []);
        const initialNames: Record<number, string> = {};
        (data.teams ?? []).forEach((t, i) => { initialNames[i] = t.name; });
        setEditedTeamNames(initialNames);
      } catch {
        setTeamPreviews([]);
      } finally {
        setTeamsLoading(false);
      }
    }
  };

  const handleSaveTeams = async () => {
    if (!teamPreviews) return;
    setTeamsSaving(true);
    const teamsToSave = teamPreviews
      .filter((_, i) => !removedTeams.has(i))
      .map((_, i) => ({ name: editedTeamNames[i] ?? teamPreviews[i].name }))
      .filter(t => t.name.trim());
    try {
      const res = await fetch("/api/slack/save-teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teams: teamsToSave }),
      });
      if (res.ok) {
        setTeamsSaved(true);
        showToast("Teams saved", `${teamsToSave.length} team${teamsToSave.length !== 1 ? "s" : ""} saved to your org.`);
      } else {
        showToast("Save failed", "Could not save teams. Please try again.");
      }
    } catch {
      showToast("Save failed", "Network error. Please try again.");
    } finally {
      setTeamsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <DashboardHeader
        tag="Connected Systems"
        title="Integrations"
        ctaSecondary=""
        ctaPrimary=""
      />

      {/* ── Toast ──────────────────────────────────────────────────────── */}
      {toast ? (
        <div className="sticky top-6 z-30 flex justify-center">
          <div
            className={`w-full max-w-2xl rounded-[1.75rem] bg-white px-5 py-4 ${styles.ambientShadow}`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-[var(--dash-primary-deep)]" />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-[var(--dash-ink)]">
                  {toast.title}
                </p>
                <p className="text-sm text-[var(--dash-ink-soft)]">
                  {toast.message}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* ── Slack (Live Integration) ────────────────────────────────────── */}
      <section className="rounded-[2rem] bg-white p-8 md:p-10">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div className="max-w-xl space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[rgba(16,137,79,0.70)]">
              Live Integration
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-[var(--dash-ink)]">
              Slack
            </h2>
            <p className="text-sm leading-7 text-[var(--dash-ink-soft)]">
              Connect your Slack workspace so Workenvo can read public and
              private channel signals, measure communication health, and surface
              burnout and engagement patterns — without storing any message
              text.
            </p>
          </div>
        </div>

        <div className="rounded-[1.75rem] bg-[var(--dash-surface-muted)] p-6">
          {slackStatus?.isConnected ? (
            /* ── Connected state ─────────────────────────────────────────── */
            <div className="flex flex-col gap-5">
              {/* Top row: workspace info + run button */}
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-[1.1rem] bg-white">
                    <SlackIcon className="h-8 w-8" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold tracking-tight text-[var(--dash-ink)]">
                        {slackStatus.workspaceName}
                      </span>
                      <span className="rounded-full bg-[rgba(16,137,79,0.12)] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-[var(--dash-primary-deep)]">
                        Connected
                      </span>
                    </div>
                    <p className="text-xs text-[var(--dash-ink-soft)]">
                      Last synced: {formatLastSynced(slackStatus.lastSyncedAt)}
                    </p>
                    {analysisMsg ? (
                      <p
                        className={`text-xs font-medium ${analysisState === "error" ? "text-red-500" : "text-[var(--dash-primary-deep)]"}`}
                      >
                        {analysisMsg}
                      </p>
                    ) : null}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRunAnalysis}
                  disabled={analysisState === "loading"}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--dash-primary-deep)] px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.01] disabled:cursor-wait disabled:opacity-80"
                >
                  {analysisState === "loading" ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/35 border-t-white" />
                      Analyzing…
                    </>
                  ) : analysisState === "success" ? (
                    "Run Again"
                  ) : (
                    "Run Analysis Now"
                  )}
                </button>
              </div>

              {/* Channels section */}
              <div className="border-t border-[var(--dash-border,rgba(0,0,0,0.06))] pt-4">
                <button
                  type="button"
                  onClick={handleToggleChannels}
                  className="flex items-center gap-1.5 text-xs font-medium text-[var(--dash-ink-soft)] hover:text-[var(--dash-ink)] transition-colors"
                >
                  <svg
                    viewBox="0 0 16 16"
                    className={`h-3.5 w-3.5 transition-transform ${channelsOpen ? "rotate-90" : ""}`}
                    fill="currentColor"
                  >
                    <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Channels the bot can access
                </button>

                {channelsOpen ? (
                  <div className="mt-3">
                    {channelsLoading ? (
                      <div className="flex items-center gap-2 py-2 text-xs text-[var(--dash-ink-soft)]">
                        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[var(--dash-ink-soft)]/30 border-t-[var(--dash-ink-soft)]" />
                        Loading channels…
                      </div>
                    ) : channels && channels.length > 0 ? (
                      <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
                        {channels.map((ch) => (
                          <div
                            key={ch.id}
                            className="flex items-center gap-2 rounded-xl bg-white px-3 py-2"
                          >
                            <span className="text-xs text-[var(--dash-ink-soft)]">
                              {ch.is_private ? "🔒" : "#"}
                            </span>
                            <span className="flex-1 truncate text-xs font-medium text-[var(--dash-ink)]">
                              {ch.name}
                            </span>
                            {ch.num_members !== undefined ? (
                              <span className="flex-shrink-0 text-[10px] text-[var(--dash-ink-soft)]">
                                {ch.num_members}
                              </span>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="py-2 text-xs text-[var(--dash-ink-soft)]">
                        No channels found. Make sure the bot is added to at least one channel.
                      </p>
                    )}
                  </div>
                ) : null}
              </div>

              {/* Teams section */}
              <div className="border-t border-[var(--dash-border,rgba(0,0,0,0.06))] pt-4">
                <button
                  type="button"
                  onClick={handleToggleTeams}
                  className="flex items-center gap-1.5 text-xs font-medium text-[var(--dash-ink-soft)] hover:text-[var(--dash-ink)] transition-colors"
                >
                  <svg
                    viewBox="0 0 16 16"
                    className={`h-3.5 w-3.5 transition-transform ${teamsOpen ? "rotate-90" : ""}`}
                    fill="currentColor"
                  >
                    <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {teamsSaved ? "Teams configured" : "Review & set up teams"}
                  {teamsSaved ? (
                    <span className="rounded-full bg-[rgba(16,137,79,0.12)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-[var(--dash-primary-deep)]">
                      Done
                    </span>
                  ) : (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-amber-700">
                      Action needed
                    </span>
                  )}
                </button>

                {teamsOpen ? (
                  <div className="mt-3 space-y-3">
                    <p className="text-xs text-[var(--dash-ink-soft)]">
                      Teams are detected from your Slack channel names. Rename or remove any before saving.
                    </p>
                    {teamsLoading ? (
                      <div className="flex items-center gap-2 py-2 text-xs text-[var(--dash-ink-soft)]">
                        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[var(--dash-ink-soft)]/30 border-t-[var(--dash-ink-soft)]" />
                        Detecting teams…
                      </div>
                    ) : teamPreviews && teamPreviews.length > 0 ? (
                      <>
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                          {teamPreviews.map((team, i) => {
                            if (removedTeams.has(i)) return null;
                            return (
                              <div key={i} className="flex items-center gap-2 rounded-xl bg-white px-3 py-2.5">
                                <input
                                  type="text"
                                  value={editedTeamNames[i] ?? team.name}
                                  onChange={(e) => setEditedTeamNames(prev => ({ ...prev, [i]: e.target.value }))}
                                  className="flex-1 min-w-0 bg-transparent text-xs font-medium text-[var(--dash-ink)] outline-none"
                                />
                                <span className="flex-shrink-0 text-[10px] text-[var(--dash-ink-soft)]">
                                  {team.channels.length} ch
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setRemovedTeams(prev => new Set([...prev, i]))}
                                  className="flex-shrink-0 text-[var(--dash-ink-soft)] hover:text-red-400 transition-colors"
                                  aria-label="Remove team"
                                >
                                  <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M4 4l8 8M12 4l-8 8" strokeLinecap="round"/>
                                  </svg>
                                </button>
                              </div>
                            );
                          })}
                        </div>
                        {removedTeams.size < teamPreviews.length && (
                          <button
                            type="button"
                            onClick={handleSaveTeams}
                            disabled={teamsSaving || teamsSaved}
                            className="inline-flex items-center gap-2 rounded-full bg-[var(--dash-primary-deep)] px-5 py-2 text-xs font-semibold text-white transition-transform hover:scale-[1.01] disabled:cursor-wait disabled:opacity-70"
                          >
                            {teamsSaving ? (
                              <>
                                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/35 border-t-white" />
                                Saving…
                              </>
                            ) : teamsSaved ? "Saved ✓" : (
                              `Save ${teamPreviews.length - removedTeams.size} team${teamPreviews.length - removedTeams.size !== 1 ? "s" : ""}`
                            )}
                          </button>
                        )}
                      </>
                    ) : teamPreviews ? (
                      <p className="py-2 text-xs text-[var(--dash-ink-soft)]">
                        No teams could be detected from your channel names. Add channels like <code className="font-mono">#engineering</code> or <code className="font-mono">#sales</code> to enable team-level analysis.
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </div>

              {/* Disconnect row */}
              <div className="flex justify-end border-t border-[var(--dash-border,rgba(0,0,0,0.06))] pt-4">
                {confirmDisconnect ? (
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[var(--dash-ink-soft)]">
                      Remove Envo bot from this workspace?
                    </span>
                    <button
                      type="button"
                      onClick={() => setConfirmDisconnect(false)}
                      disabled={disconnecting}
                      className="text-xs text-[var(--dash-ink-soft)] hover:text-[var(--dash-ink)] transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleDisconnect}
                      disabled={disconnecting}
                      className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 transition-colors disabled:cursor-wait disabled:opacity-60"
                    >
                      {disconnecting ? (
                        <>
                          <span className="h-3 w-3 animate-spin rounded-full border-2 border-red-300 border-t-red-600" />
                          Disconnecting…
                        </>
                      ) : (
                        "Yes, disconnect"
                      )}
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmDisconnect(true)}
                    className="text-xs text-[var(--dash-ink-soft)] hover:text-red-500 transition-colors"
                  >
                    Disconnect
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* ── Disconnected state ──────────────────────────────────────── */
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-[1.1rem] bg-white opacity-60">
                  <SlackIcon className="h-8 w-8" />
                </div>
                <div className="space-y-1">
                  <p className="text-base font-semibold text-[var(--dash-ink)]">
                    Not connected
                  </p>
                  <p className="text-xs text-[var(--dash-ink-soft)]">
                    Add the Workenvo bot to your workspace to start analysing
                    communication signals.
                  </p>
                </div>
              </div>

              <a
                href="/api/slack/install"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--dash-primary-deep)] px-6 py-3 text-sm font-semibold text-white no-underline transition-transform hover:scale-[1.01]"
              >
                Connect Slack
              </a>
            </div>
          )}
        </div>
      </section>

      {/* ── Coming-soon integrations ────────────────────────────────────── */}
      <section className="rounded-[2rem] bg-white p-8 md:p-10">
        <div className="max-w-2xl space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[rgba(16,137,79,0.70)]">
            Coming Soon
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-[var(--dash-ink)]">
            More connectors
          </h2>
          <p className="text-sm leading-7 text-[var(--dash-ink-soft)]">
            Bring your HRIS, CRM, and revenue systems into Workenvo so your
            signals and scorecards reflect the tools your teams already use
            every day.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {integrations.map((integration) => {
            const isConnecting = connectingTool === integration.name;

            return (
              <article
                key={integration.name}
                className="flex min-h-[280px] flex-col justify-between rounded-[1.75rem] bg-[var(--dash-surface-muted)] p-6"
              >
                <div className="space-y-5">
                  <div className="flex h-14 w-14 items-center justify-center rounded-[1.1rem] bg-white">
                    <Image
                      src={integration.logo}
                      alt={`${integration.name} logo`}
                      className={`h-7 w-7 object-contain ${integration.logoClassName ?? ""}`}
                    />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-bold tracking-tight text-[var(--dash-ink)]">
                      {integration.name}
                    </h3>
                    <p className="text-sm leading-7 text-[var(--dash-ink-soft)]">
                      {integration.description}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleConnect(integration.name)}
                  disabled={isConnecting}
                  className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--dash-primary-deep)] px-4 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.01] disabled:cursor-wait disabled:opacity-90"
                >
                  {isConnecting ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/35 border-t-white" />
                      Connecting...
                    </>
                  ) : (
                    "Connect"
                  )}
                </button>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
