"use client";

import { useTransition } from "react";
import { completeOnboarding } from "../../actions";

interface Props {
  firstName: string;
  goalLabels: string[];
}

export default function WelcomeShell({ firstName, goalLabels }: Props) {
  const [isPending, startTransition] = useTransition();

  function handleLaunch() {
    startTransition(() => {
      completeOnboarding();
    });
  }

  return (
    <div style={{ width: "100%", maxWidth: "640px", textAlign: "center" }}>
      {/* Celebration mark */}
      <div
        style={{
          width: "72px",
          height: "72px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #16855B 0%, #22c55e 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 32px",
          boxShadow: "0 8px 24px rgba(22,133,91,0.25)",
        }}
      >
        <svg viewBox="0 0 32 32" width="36" height="36" fill="none">
          <path
            d="M7 16l7 7 11-11"
            stroke="#fff"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Heading */}
      <p
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "11px",
          fontWeight: 700,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "#16855B",
          marginBottom: "14px",
        }}
      >
        You're all set
      </p>

      <h1
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "clamp(28px, 3.5vw, 42px)",
          fontWeight: 400,
          lineHeight: 1.1,
          color: "#111827",
          marginBottom: "16px",
        }}
      >
        Welcome to Workenvo,&nbsp;{firstName}.
      </h1>

      <p
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "16px",
          color: "#6B7280",
          lineHeight: 1.7,
          maxWidth: "480px",
          margin: "0 auto 40px",
        }}
      >
        Your workspace is ready. We'll start building your people intelligence
        picture straight away.
      </p>

      {/* Goal summary card */}
      {goalLabels.length > 0 && (
        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #E5E7EB",
            borderRadius: "16px",
            padding: "28px",
            marginBottom: "40px",
            textAlign: "left",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#9CA3AF",
              marginBottom: "16px",
            }}
          >
            Your focus areas
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {goalLabels.map((label) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <span
                  style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    background: "rgba(22,133,91,0.10)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <svg viewBox="0 0 12 12" width="10" height="10" fill="none">
                    <path
                      d="M2 6l3 3 5-5"
                      stroke="#16855B"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "14px",
                    color: "#374151",
                    lineHeight: 1.4,
                  }}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>

          {goalLabels.length < 5 && (
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "12px",
                color: "#9CA3AF",
                marginTop: "16px",
              }}
            >
              You can update your focus areas anytime from Settings.
            </p>
          )}
        </div>
      )}

      {/* What happens next */}
      <div
        style={{
          background: "#F9FAFB",
          borderRadius: "14px",
          padding: "24px",
          marginBottom: "40px",
          textAlign: "left",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#9CA3AF",
            marginBottom: "14px",
          }}
        >
          What happens next
        </p>
        {[
          "Your first analysis will run tonight and be ready tomorrow morning.",
          "Invite your HR team or line managers to view their team insights.",
          "Connect more data sources as they become available.",
        ].map((line, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              gap: "14px",
              marginBottom: i < 2 ? "12px" : 0,
              alignItems: "flex-start",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "12px",
                fontWeight: 700,
                color: "#D1D5DB",
                minWidth: "20px",
                paddingTop: "1px",
              }}
            >
              {i + 1}.
            </span>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "14px",
                color: "#6B7280",
                lineHeight: 1.55,
              }}
            >
              {line}
            </p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <button
        type="button"
        onClick={handleLaunch}
        disabled={isPending}
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "16px",
          fontWeight: 600,
          color: "#FFFFFF",
          background: isPending
            ? "#9CA3AF"
            : "linear-gradient(135deg, #16855B 0%, #22c55e 100%)",
          border: "none",
          borderRadius: "100px",
          padding: "15px 40px",
          cursor: isPending ? "not-allowed" : "pointer",
          transition: "opacity 0.2s",
          boxShadow: isPending ? "none" : "0 4px 16px rgba(22,133,91,0.3)",
          display: "inline-flex",
          alignItems: "center",
          gap: "10px",
        }}
        onMouseEnter={(e) => {
          if (!isPending) e.currentTarget.style.opacity = "0.9";
        }}
        onMouseLeave={(e) => {
          if (!isPending) e.currentTarget.style.opacity = "1";
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
            Entering workspace…
          </>
        ) : (
          "Open my workspace →"
        )}
      </button>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
