"use client";

import { usePathname } from "next/navigation";

const STEPS = [
  { label: "Goals", path: "/onboarding/goals" },
  { label: "Strategy", path: "/onboarding/strategy" },
  { label: "Connect", path: "/onboarding/connect" },
  { label: "Launch", path: "/onboarding/welcome" },
];

export default function StepProgress() {
  const pathname = usePathname();
  const current = STEPS.findIndex((s) => pathname.startsWith(s.path));
  const activeIndex = current === -1 ? 0 : current;

  return (
    <div className="flex items-center gap-0" aria-label="Onboarding progress">
      {STEPS.map((step, i) => {
        const done = i < activeIndex;
        const active = i === activeIndex;

        return (
          <div key={step.path} className="flex items-center">
            {/* Connector line (before first step is hidden) */}
            {i > 0 && (
              <div
                style={{
                  width: "40px",
                  height: "2px",
                  background: done ? "#16855B" : "#E5E7EB",
                  transition: "background 0.3s",
                }}
              />
            )}

            {/* Step dot + label */}
            <div className="flex flex-col items-center gap-1.5">
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "11px",
                  fontWeight: 600,
                  fontFamily: "var(--font-sans)",
                  transition: "all 0.3s",
                  background: done
                    ? "#16855B"
                    : active
                      ? "#16855B"
                      : "#F3F4F6",
                  color: done || active ? "#fff" : "#9CA3AF",
                  border: active ? "2px solid #16855B" : "2px solid transparent",
                  boxShadow: active
                    ? "0 0 0 3px rgba(22,133,91,0.15)"
                    : "none",
                }}
              >
                {done ? (
                  <svg viewBox="0 0 12 12" width="12" height="12" fill="none">
                    <path
                      d="M2 6l3 3 5-5"
                      stroke="#fff"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              <span
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "11px",
                  fontWeight: active ? 600 : 400,
                  color: active ? "#16855B" : done ? "#374151" : "#9CA3AF",
                  transition: "color 0.3s",
                  whiteSpace: "nowrap",
                }}
              >
                {step.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
