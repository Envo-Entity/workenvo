"use client";

import { useState } from "react";

interface Props {
  onClose: () => void;
}

export function RegisterModal({ onClose }: Props) {
  const [form, setForm] = useState({ name: "", email: "", company: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function update(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/webinar-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setStatus("success");
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "oklch(0.08 0.008 160 / 0.62)", backdropFilter: "blur(8px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative w-full max-w-[420px] rounded-2xl bg-white"
        style={{
          border: "1px solid #E5E7EB",
          boxShadow: "0 4px 6px -1px oklch(0.08 0.008 160 / 0.06), 0 20px 48px -8px oklch(0.08 0.008 160 / 0.18)",
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-5 right-5 w-7 h-7 flex items-center justify-center rounded-full text-webinar-ink-faint hover:text-webinar-ink hover:bg-webinar-surface transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>

        <div className="px-8 pt-8 pb-7">
          {status === "success" ? (
            <div className="flex flex-col items-start">
              <div className="w-10 h-10 rounded-full flex items-center justify-center mb-5" style={{ background: "#ECFDF5" }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M3 9.5l4.5 4.5 7.5-9" stroke="#16855B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-webinar-accent mb-2">You&rsquo;re registered</p>
              <h2 className="font-webinar-heading text-[1.6rem] leading-[1.2] font-normal text-webinar-ink mb-3">
                See you on<br />31 December
              </h2>
              <p className="text-sm text-webinar-ink-faint leading-relaxed mb-7">
                A confirmation and calendar invite are on their way to your inbox. Check spam if you don&rsquo;t see it within a minute.
              </p>
              <button
                onClick={onClose}
                className="text-sm font-semibold text-webinar-ink-dim underline underline-offset-4 decoration-webinar-wire hover:text-webinar-ink hover:decoration-webinar-ink-faint transition-colors"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              {/* Header */}
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-webinar-accent mb-3">
                Workenvo Webinar
              </p>
              <h2 className="font-webinar-heading text-[1.75rem] leading-[1.15] font-normal text-webinar-ink mb-1">
                Reserve Your Spot
              </h2>
              <p className="text-sm text-webinar-ink-faint mb-7">
                31 December 2026 &mdash; 12:00pm GMT
              </p>

              <div className="border-t border-webinar-wire mb-7" />

              <form onSubmit={handleSubmit} className="space-y-5">
                <Field
                  label="Full name"
                  required
                  type="text"
                  value={form.name}
                  onChange={(v) => update("name", v)}
                  placeholder="Jane Smith"
                  autoComplete="name"
                />
                <Field
                  label="Email"
                  required
                  type="email"
                  value={form.email}
                  onChange={(v) => update("email", v)}
                  placeholder="jane@company.com"
                  autoComplete="email"
                />
                <Field
                  label="Company"
                  type="text"
                  value={form.company}
                  onChange={(v) => update("company", v)}
                  placeholder="Optional"
                  autoComplete="organization"
                />

                {status === "error" && (
                  <p className="text-xs text-red-600 bg-red-50 border border-red-100 px-3.5 py-2.5 rounded-lg leading-relaxed">
                    {errorMsg}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full py-3.5 rounded-xl text-sm font-semibold text-white transition-opacity disabled:opacity-60 disabled:cursor-not-allowed mt-1"
                  style={{ background: "#16855B" }}
                >
                  {status === "loading" ? (
                    <span className="flex items-center justify-center gap-2">
                      <Spinner />
                      Registering
                    </span>
                  ) : (
                    "Register for the Webinar"
                  )}
                </button>

                <p className="text-center text-xs text-webinar-ink-faint pt-0.5">
                  Confirmation + calendar invite sent immediately.
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  type,
  value,
  onChange,
  placeholder,
  autoComplete,
}: {
  label: string;
  required?: boolean;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label className="flex items-center gap-1 text-xs font-medium text-webinar-ink-dim mb-1.5">
        {label}
        {required && <span className="text-webinar-accent">*</span>}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="w-full px-3.5 py-2.5 rounded-lg border border-webinar-wire bg-white text-sm text-webinar-ink placeholder-webinar-ink-faint outline-none transition-all focus:border-webinar-accent focus:ring-2 focus:ring-webinar-accent/12"
      />
    </div>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  );
}
