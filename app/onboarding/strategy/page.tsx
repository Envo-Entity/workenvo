"use client";

import { useState, useTransition } from "react";
import { saveStrategy, skipStrategy } from "../actions";

export default function StrategyPage() {
  const [challenge, setChallenge] = useState("");
  const [success, setSuccess] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isSkipping, startSkipTransition] = useTransition();

  const canSave = challenge.trim().length > 10 && success.trim().length > 10;

  function handleSave() {
    startTransition(() => {
      saveStrategy({ type: "qa", challenge: challenge.trim(), success: success.trim() });
    });
  }

  function handleSkip() {
    startSkipTransition(() => {
      skipStrategy();
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
          Step 2 of 4
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
          Tell us a bit more about your situation
        </h1>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "15px",
            color: "#6B7280",
            lineHeight: 1.6,
          }}
        >
          This helps us tailor your insights from day one. You can always update
          this later.
        </p>
      </div>

      {/* Q&A Card */}
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: "16px",
          border: "1px solid #E5E7EB",
          padding: "32px",
          display: "flex",
          flexDirection: "column",
          gap: "28px",
        }}
      >
        {/* Question 1 */}
        <div>
          <label
            htmlFor="challenge"
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "14px",
              fontWeight: 600,
              color: "#111827",
              display: "block",
              marginBottom: "6px",
            }}
          >
            What's the biggest people challenge you're facing right now?
          </label>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "12px",
              color: "#9CA3AF",
              marginBottom: "12px",
              lineHeight: 1.5,
            }}
          >
            In your own words — there are no wrong answers.
          </p>
          <textarea
            id="challenge"
            value={challenge}
            onChange={(e) => setChallenge(e.target.value)}
            rows={4}
            placeholder="e.g. We're losing senior engineers faster than we can hire, and we're not sure why…"
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "14px",
              color: "#111827",
              width: "100%",
              background: "#F9FAFB",
              border: "1.5px solid #E5E7EB",
              borderRadius: "10px",
              padding: "12px 14px",
              resize: "vertical",
              outline: "none",
              lineHeight: 1.6,
              transition: "border-color 0.15s",
              boxSizing: "border-box",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "#16855B";
              e.currentTarget.style.background = "#FFFFFF";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "#E5E7EB";
              e.currentTarget.style.background = "#F9FAFB";
            }}
          />
        </div>

        {/* Divider */}
        <div style={{ height: "1px", background: "#F3F4F6" }} />

        {/* Question 2 */}
        <div>
          <label
            htmlFor="success"
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "14px",
              fontWeight: 600,
              color: "#111827",
              display: "block",
              marginBottom: "6px",
            }}
          >
            What does success look like for your organisation in 12 months?
          </label>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "12px",
              color: "#9CA3AF",
              marginBottom: "12px",
              lineHeight: 1.5,
            }}
          >
            Think about the outcome, not the activity.
          </p>
          <textarea
            id="success"
            value={success}
            onChange={(e) => setSuccess(e.target.value)}
            rows={4}
            placeholder="e.g. Our voluntary attrition is under 10%, managers are getting consistent positive feedback…"
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "14px",
              color: "#111827",
              width: "100%",
              background: "#F9FAFB",
              border: "1.5px solid #E5E7EB",
              borderRadius: "10px",
              padding: "12px 14px",
              resize: "vertical",
              outline: "none",
              lineHeight: 1.6,
              transition: "border-color 0.15s",
              boxSizing: "border-box",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "#16855B";
              e.currentTarget.style.background = "#FFFFFF";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "#E5E7EB";
              e.currentTarget.style.background = "#F9FAFB";
            }}
          />
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: "32px",
        }}
      >
        <button
          type="button"
          onClick={handleSkip}
          disabled={isSkipping || isPending}
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "14px",
            fontWeight: 400,
            color: "#6B7280",
            background: "transparent",
            border: "none",
            cursor: isSkipping || isPending ? "not-allowed" : "pointer",
            padding: "8px 0",
            opacity: isSkipping || isPending ? 0.5 : 1,
          }}
        >
          {isSkipping ? "Skipping…" : "Skip for now →"}
        </button>

        <button
          type="button"
          onClick={handleSave}
          disabled={!canSave || isPending || isSkipping}
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "15px",
            fontWeight: 600,
            color: "#FFFFFF",
            background: !canSave || isPending || isSkipping ? "#9CA3AF" : "#16855B",
            border: "none",
            borderRadius: "100px",
            padding: "13px 28px",
            cursor: !canSave || isPending || isSkipping ? "not-allowed" : "pointer",
            transition: "background 0.2s",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
          onMouseEnter={(e) => {
            if (canSave && !isPending && !isSkipping)
              e.currentTarget.style.background = "#0f6a49";
          }}
          onMouseLeave={(e) => {
            if (canSave && !isPending && !isSkipping)
              e.currentTarget.style.background = "#16855B";
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
          ) : (
            "Continue →"
          )}
        </button>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
