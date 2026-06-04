"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BrandLogo from "@/components/BrandLogo";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push("/dashboard");
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
        <div className="flex-1 flex flex-col justify-center px-8 pb-16" style={{ maxWidth: "400px", margin: "0 auto", width: "100%" }}>
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
            Welcome back
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
            Sign in to Workenvo
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
            See what needs your attention today.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
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
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                style={{
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
                  boxSizing: "border-box",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#16855B";
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(22,133,91,0.1)";
                  e.currentTarget.style.background = "#FFFFFF";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#E5E7EB";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.background = "#F9FAFB";
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "15px",
                fontWeight: 600,
                color: "#FFFFFF",
                background: "#16855B",
                border: "none",
                borderRadius: "10px",
                padding: "14px 24px",
                cursor: "pointer",
                transition: "background 0.2s, transform 0.1s",
                marginTop: "4px",
                letterSpacing: "0.01em",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#0f6a49")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#16855B")}
              onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.985)")}
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              Continue →
            </button>
          </form>

          {/* Divider */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              margin: "28px 0",
            }}
          >
            <div style={{ flex: 1, height: "1px", background: "#F3F4F6" }} />
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "12px",
                color: "#D1D5DB",
              }}
            >
              or
            </span>
            <div style={{ flex: 1, height: "1px", background: "#F3F4F6" }} />
          </div>

          {/* SSO hint */}
          <button
            onClick={() => router.push("/dashboard")}
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "14px",
              fontWeight: 500,
              color: "#6B7280",
              background: "transparent",
              border: "1px solid #E5E7EB",
              borderRadius: "10px",
              padding: "13px 24px",
              cursor: "pointer",
              transition: "border-color 0.2s, color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#D1D5DB";
              e.currentTarget.style.color = "#374151";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#E5E7EB";
              e.currentTarget.style.color = "#6B7280";
            }}
          >
            Continue with SSO
          </button>

          {/* Footer */}
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "13px",
              color: "#9CA3AF",
              marginTop: "32px",
              textAlign: "center",
            }}
          >
            No account yet?{" "}
            <a
              href="#pricing"
              style={{ color: "#16855B", fontWeight: 500, textDecoration: "none" }}
            >
              Get started free →
            </a>
          </p>
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
        {/* Dark overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(135deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.5) 100%)",
          }}
        />
        {/* Left-edge fade to white */}
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
        {/* Tagline overlay */}
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
