"use client";

import { useTransition } from "react";
import { completeConnect } from "../../actions";

interface Props {
  isConnected: boolean;
  orgId: string;
}

// ── Slack logo SVG ────────────────────────────────────────────

function SlackLogo({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      {/* Slack brand colors */}
      <path d="M15 5C15 3.34 13.66 2 12 2s-3 1.34-3 3v8c0 1.66 1.34 3 3 3s3-1.34 3-3V5z" fill="#E01E5A" />
      <path d="M25 5c0-1.66-1.34-3-3-3s-3 1.34-3 3v8c0 1.66 1.34 3 3 3s3-1.34 3-3V5z" fill="#36C5F0" />
      <path d="M35 15c0-1.66-1.34-3-3-3H24c-1.66 0-3 1.34-3 3s1.34 3 3 3h8c1.66 0 3-1.34 3-3z" fill="#2EB67D" />
      <path d="M35 25c0-1.66-1.34-3-3-3H24c-1.66 0-3 1.34-3 3s1.34 3 3 3h8c1.66 0 3-1.34 3-3z" fill="#ECB22E" />
      <path d="M15 24c0-1.66-1.34-3-3-3H4c-1.66 0-3 1.34-3 3s1.34 3 3 3h8c1.66 0 3-1.34 3-3z" fill="#E01E5A" />
      <path d="M25 24c0-1.66-1.34-3-3-3s-3 1.34-3 3v8c0 1.66 1.34 3 3 3s3-1.34 3-3v-8z" fill="#2EB67D" />
      <path d="M15 14c0-1.66-1.34-3-3-3H4c-1.66 0-3 1.34-3 3s1.34 3 3 3h8c1.66 0 3-1.34 3-3z" fill="#36C5F0" />
      <path d="M15 34c0-1.66-1.34-3-3-3s-3 1.34-3 3v-8c0-1.66-1.34-3-3-3s-3 1.34-3 3v8c0 1.66 1.34 3 3 3s3-1.34 3-3z" fill="#ECB22E" />
    </svg>
  );
}

export default function ConnectShell({ isConnected }: Props) {
  const [isPending, startTransition] = useTransition();

  function handleContinue() {
    startTransition(() => {
      completeConnect();
    });
  }

  return (
    <div style={{ width: "100%", maxWidth: "640px" }}>
      {/* Heading */}
      <div style={{ marginBottom: "40px" }}>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#16855B",
            marginBottom: "10px",
          }}
        >
          Step 3 of 4
        </p>
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(26px, 3.2vw, 36px)",
            fontWeight: 400,
            lineHeight: 1.15,
            color: "#111827",
            marginBottom: "8px",
          }}
        >
          Connect your data sources
        </h1>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "15px",
            color: "#6B7280",
            lineHeight: 1.6,
          }}
        >
          Workenvo reads signals from the tools your team already uses. Start
          with Slack — it's where most of your culture actually lives.
        </p>
      </div>

      {/* Slack card */}
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: "16px",
          border: isConnected ? "1.5px solid #16855B" : "1px solid #E5E7EB",
          padding: "28px",
          display: "flex",
          alignItems: "center",
          gap: "20px",
          marginBottom: "16px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {isConnected && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "3px",
              background: "linear-gradient(90deg, #16855B, #22c55e)",
            }}
          />
        )}

        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "14px",
            background: "#F8F9FA",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <SlackLogo size={34} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "16px",
              fontWeight: 600,
              color: "#111827",
              marginBottom: "4px",
            }}
          >
            Slack
          </p>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "13px",
              color: "#6B7280",
              lineHeight: 1.5,
            }}
          >
            {isConnected
              ? "Your Slack workspace is connected. Workenvo is reading anonymised signals."
              : "Analyse collaboration patterns, team health, and communication signals."}
          </p>
        </div>

        {isConnected ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#16855B",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "13px",
                fontWeight: 600,
                color: "#16855B",
              }}
            >
              Connected
            </span>
          </div>
        ) : (
          <a
            href="/api/slack/install"
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "14px",
              fontWeight: 600,
              color: "#FFFFFF",
              background: "#16855B",
              border: "none",
              borderRadius: "100px",
              padding: "10px 20px",
              textDecoration: "none",
              flexShrink: 0,
              display: "inline-block",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = "#0f6a49";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = "#16855B";
            }}
          >
            Connect Slack
          </a>
        )}
      </div>

      {/* Coming soon integrations */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "12px",
          marginBottom: "40px",
        }}
      >
        {[
          { name: "HubSpot", desc: "CRM & revenue data" },
          { name: "Workday", desc: "HR & org structure" },
          { name: "Salesforce", desc: "Sales performance" },
          { name: "HRIS", desc: "People records" },
        ].map((item) => (
          <div
            key={item.name}
            style={{
              background: "#F9FAFB",
              border: "1px solid #F3F4F6",
              borderRadius: "12px",
              padding: "16px 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#9CA3AF",
                  marginBottom: "2px",
                }}
              >
                {item.name}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "12px",
                  color: "#D1D5DB",
                }}
              >
                {item.desc}
              </p>
            </div>
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "10px",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#D1D5DB",
                background: "#F3F4F6",
                borderRadius: "100px",
                padding: "3px 8px",
              }}
            >
              Soon
            </span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          paddingTop: "16px",
          borderTop: "1px solid #F3F4F6",
        }}
      >
        <button
          type="button"
          onClick={handleContinue}
          disabled={isPending}
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "15px",
            fontWeight: 600,
            color: "#FFFFFF",
            background: isPending ? "#9CA3AF" : "#16855B",
            border: "none",
            borderRadius: "100px",
            padding: "13px 28px",
            cursor: isPending ? "not-allowed" : "pointer",
            transition: "background 0.2s",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
          onMouseEnter={(e) => {
            if (!isPending) e.currentTarget.style.background = "#0f6a49";
          }}
          onMouseLeave={(e) => {
            if (!isPending) e.currentTarget.style.background = "#16855B";
          }}
        >
          {isPending ? (
            <>
              <span
                style={{
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  border: "2px solid rgba(255,255,255,0.35)",
                  borderTopColor: "#fff",
                  display: "inline-block",
                  animation: "spin 0.7s linear infinite",
                }}
              />
              Saving…
            </>
          ) : isConnected ? (
            "Continue →"
          ) : (
            "Skip for now →"
          )}
        </button>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
