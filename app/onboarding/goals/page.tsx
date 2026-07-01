"use client";

import { useState, useTransition } from "react";
import { saveGoals } from "../actions";

// ── Goal definitions (from the UX plan) ──────────────────────

const CATEGORIES = [
  {
    section: "People",
    name: "Retention & Engagement",
    color: "#0EA5E9",
    goals: [
      { id: "re_leaving", label: "I need to stop good employees leaving." },
      { id: "re_tenure", label: "People don't stay long enough." },
      { id: "re_cost", label: "Our turnover is costing us too much money." },
      { id: "re_disconnect", label: "Employees seem disconnected from the business." },
      { id: "re_minimal", label: "People are doing the bare minimum." },
      { id: "re_morale", label: "We have low morale across teams." },
      { id: "re_recognition", label: "Employees don't feel valued or recognised." },
    ],
  },
  {
    section: "People",
    name: "Culture & Wellbeing",
    color: "#8B5CF6",
    goals: [
      { id: "cw_fragmented", label: "Our culture feels fragmented." },
      { id: "cw_silos", label: "Teams are working in silos." },
      { id: "cw_trust", label: "People don't trust leadership." },
      { id: "cw_overwhelm", label: "People are overwhelmed and exhausted." },
      { id: "cw_burnout", label: "Burnout is becoming a serious problem." },
      { id: "cw_absence", label: "Absenteeism is increasing." },
    ],
  },
  {
    section: "Leadership",
    name: "Manager Effectiveness",
    color: "#F59E0B",
    goals: [
      { id: "me_ineffective", label: "Our managers aren't leading effectively." },
      { id: "me_promoted", label: "We promote great employees but they struggle as managers." },
      { id: "me_difficult", label: "Managers avoid difficult conversations." },
      { id: "me_motivate", label: "Leaders don't know how to motivate their teams." },
      { id: "me_inconsistent", label: "There is inconsistency between managers." },
      { id: "me_skills", label: "We need stronger people management skills." },
      { id: "me_attrition", label: "Employees are leaving because of poor managers." },
    ],
  },
];

// ── Component ─────────────────────────────────────────────────

export default function GoalsPage() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function handleContinue() {
    startTransition(() => {
      saveGoals([...selected]);
    });
  }

  // Group categories by section to render section headers once
  const sections = ["People", "Leadership"];

  return (
    <div style={{ width: "100%", maxWidth: "760px" }}>
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
          Step 1 of 4
        </p>
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(28px, 3.5vw, 38px)",
            fontWeight: 400,
            lineHeight: 1.15,
            color: "#111827",
            marginBottom: "8px",
          }}
        >
          What are you trying to achieve?
        </h1>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "15px",
            color: "#6B7280",
            lineHeight: 1.6,
          }}
        >
          Select everything that resonates. This helps us focus your workspace
          on what matters most.
        </p>
      </div>

      {/* Category groups */}
      <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
        {sections.map((section) => {
          const cats = CATEGORIES.filter((c) => c.section === section);
          return (
            <div key={section}>
              {/* Section label */}
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "#9CA3AF",
                  marginBottom: "16px",
                }}
              >
                {section}
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {cats.map((cat) => (
                  <div key={cat.name}>
                    <p
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "#374151",
                        marginBottom: "10px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          background: cat.color,
                          flexShrink: 0,
                        }}
                      />
                      {cat.name}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "8px",
                      }}
                    >
                      {cat.goals.map((goal) => {
                        const isSelected = selected.has(goal.id);
                        return (
                          <button
                            key={goal.id}
                            type="button"
                            onClick={() => toggle(goal.id)}
                            style={{
                              fontFamily: "var(--font-sans)",
                              fontSize: "13px",
                              fontWeight: isSelected ? 500 : 400,
                              color: isSelected ? "#16855B" : "#374151",
                              background: isSelected
                                ? "rgba(22,133,91,0.08)"
                                : "#FFFFFF",
                              border: isSelected
                                ? "1.5px solid #16855B"
                                : "1.5px solid #E5E7EB",
                              borderRadius: "100px",
                              padding: "8px 16px",
                              cursor: "pointer",
                              transition: "all 0.15s",
                              lineHeight: 1.4,
                              textAlign: "left",
                            }}
                            onMouseEnter={(e) => {
                              if (!isSelected) {
                                e.currentTarget.style.borderColor = "#D1D5DB";
                                e.currentTarget.style.background = "#F9FAFB";
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!isSelected) {
                                e.currentTarget.style.borderColor = "#E5E7EB";
                                e.currentTarget.style.background = "#FFFFFF";
                              }
                            }}
                          >
                            {isSelected && (
                              <span style={{ marginRight: "6px" }}>✓</span>
                            )}
                            {goal.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer CTA */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: "48px",
          paddingTop: "24px",
          borderTop: "1px solid #F3F4F6",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "13px",
            color: "#9CA3AF",
          }}
        >
          {selected.size > 0
            ? `${selected.size} challenge${selected.size === 1 ? "" : "s"} selected`
            : "Select at least one to continue"}
        </p>

        <button
          type="button"
          onClick={handleContinue}
          disabled={selected.size === 0 || isPending}
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "15px",
            fontWeight: 600,
            color: "#FFFFFF",
            background:
              selected.size === 0 || isPending ? "#9CA3AF" : "#16855B",
            border: "none",
            borderRadius: "100px",
            padding: "13px 28px",
            cursor:
              selected.size === 0 || isPending ? "not-allowed" : "pointer",
            transition: "background 0.2s",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
          onMouseEnter={(e) => {
            if (selected.size > 0 && !isPending)
              e.currentTarget.style.background = "#0f6a49";
          }}
          onMouseLeave={(e) => {
            if (selected.size > 0 && !isPending)
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
