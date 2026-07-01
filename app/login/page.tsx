"use client";

import { useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import BrandLogo from "@/components/BrandLogo";
import { createClient } from "@/lib/supabase/browser";

type Step = "email" | "code";

const inputStyle = {
  fontFamily: "var(--font-sans)",
  fontSize: "15px",
  color: "#111827",
  background: "#F9FAFB",
  border: "1px solid #E5E7EB",
  borderRadius: "10px",
  padding: "13px 16px",
  outline: "none",
  transition: "border-color 0.2s, box-shadow 0.2s",
  width: "100%",
  boxSizing: "border-box" as const,
};

const inputFocusStyle = {
  borderColor: "#16855B",
  boxShadow: "0 0 0 3px rgba(22,133,91,0.1)",
  background: "#FFFFFF",
};

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

  const nextPath = searchParams.get("next") ?? "/dashboard";

  // ── Step 1: send OTP code ──────────────────────────────────
  async function handleSendCode(e: React.FormEvent) {
    e.preventDefault();
    const emailVal = (emailInputRef.current?.value.trim() || email).trim();
    if (!emailVal) return;
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithOtp({ email: emailVal });

    setLoading(false);

    if (error) {
      setError("Failed to send code. Please try again.");
      return;
    }

    setEmail(emailVal);
    setStep("code");
    startResendCooldown();
  }

  // ── Step 2: verify OTP code ────────────────────────────────
  async function handleVerifyCode(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.verifyOtp({
      email,
      token: code.trim(),
      type: "email",
    });

    if (error) {
      setLoading(false);
      setError("Invalid or expired code. Check your email or request a new one.");
      return;
    }

    // Session is set. Ask the server where to send this user:
    // new users get routed to onboarding, returning users to dashboard.
    try {
      const res = await fetch("/api/auth/init", { method: "POST" });
      const data = (await res.json()) as { nextPath?: string; error?: string };
      router.push(data.nextPath ?? "/dashboard");
      router.refresh();
    } catch {
      router.push("/dashboard");
      router.refresh();
    }
  }

  async function handleResend() {
    if (resendCooldown > 0) return;
    setError(null);
    await supabase.auth.signInWithOtp({ email });
    startResendCooldown();
  }

  function startResendCooldown() {
    setResendCooldown(60);
    if (cooldownRef.current) clearInterval(cooldownRef.current);
    cooldownRef.current = setInterval(() => {
      setResendCooldown((n) => {
        if (n <= 1) {
          clearInterval(cooldownRef.current!);
          return 0;
        }
        return n - 1;
      });
    }, 1000);
  }

  return (
    <div className="min-h-screen flex">
      {/* LEFT — form panel */}
      <div
        className="relative flex flex-col w-full lg:w-[480px] xl:w-[520px] flex-shrink-0"
        style={{ background: "#FFFFFF" }}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-8 pt-8 pb-6">
          <a href="/">
            <BrandLogo
              logoHeightClassName="h-7"
              textClassName="text-lg tracking-[-0.03em]"
            />
          </a>
          <a
            href="/"
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "13px",
              color: "#9CA3AF",
              fontWeight: 450,
              textDecoration: "none",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#374151")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#9CA3AF")}
          >
            ← Back
          </a>
        </div>

        {/* Form centered */}
        <div
          className="flex-1 flex flex-col justify-center px-8 pb-16"
          style={{ maxWidth: "400px", margin: "0 auto", width: "100%" }}
        >
          {/* Eyebrow */}
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
            {step === "email" ? "Welcome back" : "Check your email"}
          </p>

          {/* Heading */}
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(30px, 4vw, 40px)",
              fontWeight: 400,
              lineHeight: 1.1,
              color: "#111827",
              marginBottom: "8px",
            }}
          >
            {step === "email" ? "Sign in to Workenvo" : "Enter your code"}
          </h1>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "14px",
              color: "#9CA3AF",
              marginBottom: "40px",
              lineHeight: 1.55,
            }}
          >
            {step === "email"
              ? "See what needs your attention today."
              : `We sent a 6-digit code to ${email}`}
          </p>

          {/* Error */}
          {error ? (
            <div
              style={{
                background: "#FFF1F2",
                border: "1px solid #FECDD3",
                borderRadius: "10px",
                padding: "12px 16px",
                marginBottom: "16px",
                fontFamily: "var(--font-sans)",
                fontSize: "13px",
                color: "#BE123C",
              }}
            >
              {error}
            </div>
          ) : null}

          {/* ── Email step ─────────────────────────────────── */}
          {step === "email" ? (
            <form
              onSubmit={handleSendCode}
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label
                  htmlFor="email"
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "#374151",
                  }}
                >
                  Work email
                </label>
                <input
                  ref={emailInputRef}
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                  style={inputStyle}
                  onFocus={(e) => Object.assign(e.currentTarget.style, inputFocusStyle)}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#E5E7EB";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.background = "#F9FAFB";
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "15px",
                  fontWeight: 600,
                  color: "#FFFFFF",
                  background: loading ? "#6BAE96" : "#16855B",
                  border: "none",
                  borderRadius: "10px",
                  padding: "14px 24px",
                  cursor: loading ? "wait" : "pointer",
                  transition: "background 0.2s, transform 0.1s",
                  marginTop: "4px",
                  letterSpacing: "0.01em",
                }}
                onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = "#0f6a49"; }}
                onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = "#16855B"; }}
              >
                {loading ? "Sending…" : "Send code →"}
              </button>
            </form>
          ) : (
            /* ── Code step ──────────────────────────────────── */
            <form
              onSubmit={handleVerifyCode}
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label
                  htmlFor="code"
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "#374151",
                  }}
                >
                  6-digit code
                </label>
                <input
                  id="code"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={code}
                  onChange={(e) =>
                    setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  placeholder="123456"
                  required
                  autoFocus
                  style={{ ...inputStyle, letterSpacing: "0.25em", fontSize: "20px" }}
                  onFocus={(e) => Object.assign(e.currentTarget.style, inputFocusStyle)}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#E5E7EB";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.background = "#F9FAFB";
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading || code.length !== 6}
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "15px",
                  fontWeight: 600,
                  color: "#FFFFFF",
                  background: loading ? "#6BAE96" : "#16855B",
                  border: "none",
                  borderRadius: "10px",
                  padding: "14px 24px",
                  cursor: loading ? "wait" : "pointer",
                  transition: "background 0.2s",
                  letterSpacing: "0.01em",
                  opacity: code.length !== 6 ? 0.6 : 1,
                }}
                onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = "#0f6a49"; }}
                onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = "#16855B"; }}
              >
                {loading ? "Verifying…" : "Sign in →"}
              </button>

              {/* Resend + change email */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: "4px",
                }}
              >
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendCooldown > 0}
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "13px",
                    color: resendCooldown > 0 ? "#D1D5DB" : "#16855B",
                    background: "none",
                    border: "none",
                    cursor: resendCooldown > 0 ? "default" : "pointer",
                    padding: 0,
                  }}
                >
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend code"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStep("email");
                    setCode("");
                    setError(null);
                  }}
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "13px",
                    color: "#9CA3AF",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  Wrong email?
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* RIGHT — full bleed image panel (lg+) */}
      <div className="hidden lg:block relative flex-1 overflow-hidden">
        <img
          src="/images/outcomes-confident-hr-director.webp"
          alt="Confident HR director at her desk"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(135deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.5) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "80px",
            height: "100%",
            background: "linear-gradient(to right, #FFFFFF, transparent)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "48px",
            left: "56px",
            right: "56px",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(22px, 2.5vw, 32px)",
              fontWeight: 400,
              color: "#FFFFFF",
              lineHeight: 1.25,
              marginBottom: "12px",
            }}
          >
            &ldquo;I used to find out about problems
            <br />
            after they had already cost us.&rdquo;
          </p>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "13px",
              color: "rgba(255,255,255,0.6)",
              letterSpacing: "0.04em",
            }}
          >
            — Head of People, Series B tech company
          </p>
        </div>
      </div>
    </div>
  );
}
