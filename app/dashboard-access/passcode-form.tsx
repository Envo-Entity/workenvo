"use client";

import { useState } from "react";
import BrandLogo from "@/components/BrandLogo";

export default function PasscodeForm() {
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/dashboard-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });

      if (!res.ok) {
        setError("Incorrect passcode");
        setLoading(false);
        return;
      }

      const params = new URLSearchParams(window.location.search);
      const next = params.get("next") || "/dashboard";
      window.location.href = next;
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: "#FAFAF9" }}
    >
      <a href="/" className="mb-10">
        <BrandLogo logoHeightClassName="h-8" textClassName="text-xl tracking-[-0.03em]" />
      </a>

      <div
        style={{
          width: "100%",
          maxWidth: "380px",
          background: "#FFFFFF",
          border: "1px solid #E5E7EB",
          borderRadius: "16px",
          padding: "40px 32px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.04)",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#16855B",
            marginBottom: "12px",
          }}
        >
          Restricted
        </p>
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(26px, 4vw, 32px)",
            fontWeight: 400,
            lineHeight: 1.1,
            color: "#111827",
            marginBottom: "8px",
          }}
        >
          Enter passcode
        </h1>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "14px",
            color: "#9CA3AF",
            marginBottom: "28px",
            lineHeight: 1.55,
          }}
        >
          This dashboard is not publicly accessible.
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <input
            type="password"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            placeholder="Passcode"
            autoFocus
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "15px",
              color: "#111827",
              background: "#F9FAFB",
              border: error ? "1px solid #DC2626" : "1px solid #E5E7EB",
              borderRadius: "10px",
              padding: "13px 16px",
              outline: "none",
              transition: "border-color 0.2s, box-shadow 0.2s",
              width: "100%",
              boxSizing: "border-box",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "#16855B";
              e.currentTarget.style.boxShadow = "0 0 0 3px rgba(22,133,91,0.1)";
              e.currentTarget.style.background = "#FFFFFF";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = error ? "#DC2626" : "#E5E7EB";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.background = "#F9FAFB";
            }}
          />

          {error && (
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "13px",
                color: "#DC2626",
                margin: 0,
              }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !passcode}
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "15px",
              fontWeight: 600,
              color: "#FFFFFF",
              background: loading || !passcode ? "#9CA3AF" : "#16855B",
              border: "none",
              borderRadius: "10px",
              padding: "14px 24px",
              cursor: loading || !passcode ? "not-allowed" : "pointer",
              transition: "background 0.2s, transform 0.1s",
              marginTop: "4px",
              letterSpacing: "0.01em",
            }}
          >
            {loading ? "Checking…" : "Continue →"}
          </button>
        </form>
      </div>
    </div>
  );
}
