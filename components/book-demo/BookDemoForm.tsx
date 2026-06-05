"use client";

import { useState } from "react";

type FormState = {
  name: string;
  email: string;
  company: string;
  role: string;
  teamSize: string;
  message: string;
};

const INITIAL: FormState = {
  name: "",
  email: "",
  company: "",
  role: "",
  teamSize: "",
  message: "",
};

const TEAM_SIZES = ["1–10", "11–50", "51–200", "200+"];

export default function BookDemoForm() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    // Map display value back to API enum
    const teamSizeMap: Record<string, string> = {
      "1–10": "1-10",
      "11–50": "11-50",
      "51–200": "51-200",
      "200+": "200+",
    };

    try {
      const res = await fetch("/api/book-demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          company: form.company.trim(),
          role: form.role.trim() || undefined,
          teamSize: form.teamSize ? teamSizeMap[form.teamSize] : undefined,
          message: form.message.trim() || undefined,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        setErrorMsg(json.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setStatus("success");
    } catch {
      setErrorMsg("Network error. Please check your connection and try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        className="rounded-2xl p-10 text-center"
        style={{ background: "#ffffff", border: "1px solid #E5E7EB", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}
      >
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: "#ECFDF5" }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16855B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3
          className="text-2xl mb-3"
          style={{ fontFamily: "var(--font-serif)", color: "#111827", fontWeight: 400 }}
        >
          Request received
        </h3>
        <p style={{ color: "#6B7280", fontSize: "15px", lineHeight: "1.7", fontFamily: "var(--font-sans)" }}>
          Thanks for reaching out. Someone from our team will be in touch within one business day to schedule a time.
        </p>
      </div>
    );
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 14px",
    borderRadius: "10px",
    border: "1px solid #E5E7EB",
    fontSize: "14px",
    color: "#111827",
    background: "#ffffff",
    outline: "none",
    fontFamily: "var(--font-sans)",
    transition: "border-color 0.15s",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "13px",
    fontWeight: 600,
    color: "#374151",
    marginBottom: "6px",
    fontFamily: "var(--font-sans)",
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl p-8 sm:p-10"
      style={{ background: "#ffffff", border: "1px solid #E5E7EB", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}
    >
      <h2
        className="mb-1"
        style={{ fontFamily: "var(--font-serif)", fontSize: "26px", color: "#111827", fontWeight: 400 }}
      >
        Book a demo
      </h2>
      <p className="mb-8" style={{ fontSize: "14px", color: "#6B7280", fontFamily: "var(--font-sans)" }}>
        We&apos;ll be in touch within one business day.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Full name */}
        <div className="sm:col-span-2">
          <label htmlFor="name" style={labelStyle}>
            Full name <span style={{ color: "#16855B" }}>*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            placeholder="Alex Johnson"
            value={form.name}
            onChange={handleChange}
            style={inputStyle}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#16855B")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#E5E7EB")}
          />
        </div>

        {/* Work email */}
        <div className="sm:col-span-2">
          <label htmlFor="email" style={labelStyle}>
            Work email <span style={{ color: "#16855B" }}>*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="work email"
            required
            placeholder="alex@company.com"
            value={form.email}
            onChange={handleChange}
            style={inputStyle}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#16855B")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#E5E7EB")}
          />
        </div>

        {/* Company */}
        <div>
          <label htmlFor="company" style={labelStyle}>
            Company <span style={{ color: "#16855B" }}>*</span>
          </label>
          <input
            id="company"
            name="company"
            type="text"
            autoComplete="organization"
            required
            placeholder="Acme Corp"
            value={form.company}
            onChange={handleChange}
            style={inputStyle}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#16855B")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#E5E7EB")}
          />
        </div>

        {/* Role */}
        <div>
          <label htmlFor="role" style={labelStyle}>
            Your role
          </label>
          <input
            id="role"
            name="role"
            type="text"
            autoComplete="organization-title"
            placeholder="Head of People"
            value={form.role}
            onChange={handleChange}
            style={inputStyle}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#16855B")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#E5E7EB")}
          />
        </div>

        {/* Team size */}
        <div className="sm:col-span-2">
          <label htmlFor="teamSize" style={labelStyle}>
            Team size
          </label>
          <select
            id="teamSize"
            name="teamSize"
            value={form.teamSize}
            onChange={handleChange}
            style={{ ...inputStyle, cursor: "pointer", appearance: "auto" }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#16855B")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#E5E7EB")}
          >
            <option value="">Select team size</option>
            {TEAM_SIZES.map((s) => (
              <option key={s} value={s}>{s} employees</option>
            ))}
          </select>
        </div>

        {/* Message */}
        <div className="sm:col-span-2">
          <label htmlFor="message" style={labelStyle}>
            What are you hoping to solve?
          </label>
          <textarea
            id="message"
            name="message"
            rows={3}
            placeholder="Tell us about your current challenges..."
            value={form.message}
            onChange={handleChange}
            style={{ ...inputStyle, resize: "vertical", minHeight: "80px" }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#16855B")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#E5E7EB")}
          />
        </div>
      </div>

      {status === "error" && (
        <p
          className="mt-4 text-sm rounded-lg px-4 py-3"
          style={{ color: "#991B1B", background: "#FEF2F2", border: "1px solid #FECACA" }}
        >
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="mt-6 w-full btn-primary rounded-xl py-3 text-sm font-medium"
        style={{
          fontFamily: "var(--font-sans)",
          opacity: status === "loading" ? 0.7 : 1,
          cursor: status === "loading" ? "not-allowed" : "pointer",
        }}
      >
        {status === "loading" ? "Sending…" : "Request a demo"}
      </button>

      <p className="mt-4 text-center text-xs" style={{ color: "#9CA3AF", fontFamily: "var(--font-sans)" }}>
        No credit card required · We respond within one business day
      </p>
    </form>
  );
}
