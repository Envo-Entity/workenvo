"use client";

import { useState, useCallback } from "react";
import styles from "../dashboard.module.css";

// ─── Types ────────────────────────────────────────────────────────────────────

type QuestionType = "scale" | "multiple_choice" | "yes_no" | "free_text";
type SurveyStatus = "Draft" | "Published" | "Paused";
type Frequency = "Weekly" | "Monthly" | "Quarterly" | "Event-based";
type Trigger = "Scheduled Pulse" | "After Meeting" | "After 1:1" | "After Project Completion";

type Question = {
  id: string;
  text: string;
  type: QuestionType;
  required: boolean;
  options?: string[]; // for multiple_choice
};

type SurveyMeta = {
  title: string;
  description: string;
  frequency: Frequency;
  trigger: Trigger;
  anonymous: boolean;
  status: SurveyStatus;
};

// ─── Initial data ─────────────────────────────────────────────────────────────

const INITIAL_META: SurveyMeta = {
  title: "Q2 Culture Pulse",
  description: "Quarterly check-in on team wellbeing and belonging",
  frequency: "Monthly",
  trigger: "Scheduled Pulse",
  anonymous: true,
  status: "Draft",
};

let idCounter = 10;
const uid = () => String(++idCounter);

const INITIAL_QUESTIONS: Question[] = [
  {
    id: "q1",
    text: "I feel a strong sense of belonging in my team",
    type: "scale",
    required: true,
  },
  {
    id: "q2",
    text: "My manager gives me regular, useful feedback",
    type: "scale",
    required: true,
  },
  {
    id: "q3",
    text: "What would improve your day-to-day work experience?",
    type: "free_text",
    required: false,
  },
  {
    id: "q4",
    text: "Do you feel comfortable raising concerns with your team lead?",
    type: "yes_no",
    required: true,
  },
];

const TEMPLATES = [
  {
    name: "Culture Pulse",
    questions: 8,
    frequency: "Monthly",
    anonymous: true,
    description: "Tracks belonging, psychological safety, and team cohesion.",
  },
  {
    name: "Manager Effectiveness",
    questions: 6,
    frequency: "Quarterly",
    anonymous: false,
    description: "Measures clarity of direction, feedback quality, and trust.",
  },
  {
    name: "Onboarding Check-in",
    questions: 5,
    frequency: "Event-based (30 days)",
    anonymous: true,
    description: "Captures new hire sentiment at the 30-day mark.",
  },
];

// ─── Small primitives ─────────────────────────────────────────────────────────

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-200"
      style={{ background: checked ? "var(--dash-primary-deep)" : "var(--dash-line-strong)" }}
    >
      <span
        className="inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform duration-200"
        style={{ transform: checked ? "translateX(1.125rem)" : "translateX(0.2rem)" }}
      />
    </button>
  );
}

function Select<T extends string>({
  value,
  onChange,
  options,
  className = "",
}: {
  value: T;
  onChange: (v: T) => void;
  options: T[];
  className?: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as T)}
      className={`rounded-lg border border-[var(--dash-line)] bg-white px-3 py-2 text-sm text-[var(--dash-ink)] outline-none transition-colors ${className}`}
      onFocus={(e) => { e.currentTarget.style.borderColor = "var(--dash-primary-deep)"; }}
      onBlur={(e) => { e.currentTarget.style.borderColor = "var(--dash-line)"; }}
    >
      {options.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  );
}

const STATUS_STYLE: Record<SurveyStatus, string> = {
  Draft:     "bg-[var(--dash-surface-muted)] text-[var(--dash-ink-faint)]",
  Published: "bg-[rgba(16,137,79,0.10)] text-[var(--dash-primary)]",
  Paused:    "bg-[var(--dash-warning-soft)] text-[var(--dash-warning)]",
};

// ─── Question type previews ───────────────────────────────────────────────────

function ScalePreview() {
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(null)}
          className="flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold transition-all"
          style={
            hovered !== null && n <= hovered
              ? { borderColor: "var(--dash-primary-deep)", background: "var(--dash-primary-deep)", color: "white" }
              : { borderColor: "var(--dash-line-strong)", background: "white", color: "var(--dash-ink-faint)" }
          }
        >
          {n}
        </button>
      ))}
      <span className="ml-1 self-center text-[10px] text-[var(--dash-ink-ghost)]">Disagree → Agree</span>
    </div>
  );
}

function YesNoPreview() {
  const [sel, setSel] = useState<"Yes" | "No" | null>(null);
  return (
    <div className="flex gap-2">
      {(["Yes", "No"] as const).map((opt) => (
        <button
          key={opt}
          onClick={() => setSel(opt)}
          className="rounded-full border px-5 py-1.5 text-sm font-semibold transition-all"
          style={
            sel === opt
              ? { borderColor: "var(--dash-primary-deep)", background: "var(--dash-primary-deep)", color: "white" }
              : { borderColor: "var(--dash-line-strong)", background: "white", color: "var(--dash-ink-faint)" }
          }
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function FreeTextPreview() {
  return (
    <div className="w-full rounded-lg border border-dashed border-[var(--dash-line-strong)] px-3 py-2 text-sm text-[var(--dash-ink-ghost)]">
      Employee will type here…
    </div>
  );
}

function MultipleChoiceEditor({
  options,
  onChange,
}: {
  options: string[];
  onChange: (opts: string[]) => void;
}) {
  return (
    <div className="space-y-1.5">
      {options.map((opt, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="h-3.5 w-3.5 shrink-0 rounded-full border border-[var(--dash-line-strong)]" />
          <input
            value={opt}
            onChange={(e) => {
              const next = [...options];
              next[i] = e.target.value;
              onChange(next);
            }}
            className="flex-1 rounded border border-[var(--dash-line)] px-2 py-1 text-sm outline-none"
            onFocus={(e) => { e.currentTarget.style.borderColor = "var(--dash-primary-deep)"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "var(--dash-line)"; }}
          />
          {options.length > 2 && (
            <button
              onClick={() => onChange(options.filter((_, j) => j !== i))}
              className="text-[var(--dash-ink-ghost)] hover:text-[var(--dash-danger)] transition-colors"
            >
              <TrashMiniIcon />
            </button>
          )}
        </div>
      ))}
      <button
        onClick={() => onChange([...options, ""])}
        className="mt-1 text-[11px] font-semibold text-[var(--dash-primary)] hover:underline"
      >
        + Add Option
      </button>
    </div>
  );
}

// ─── Inline icons ─────────────────────────────────────────────────────────────

function DragHandle() {
  return (
    <svg width="14" height="20" viewBox="0 0 14 20" fill="var(--dash-line-strong)">
      {[3, 9, 15].map((y) =>
        [3, 9].map((x) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.5" />)
      )}
    </svg>
  );
}

function TrashMiniIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z" />
    </svg>
  );
}

function DuplicateIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
    </svg>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="transition-transform duration-200"
      style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
    >
      <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-1 14l-3-3 1.41-1.41L11 12.17l4.59-4.58L17 9l-6 6z" />
    </svg>
  );
}

function UpArrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
    </svg>
  );
}

function DownArrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
    </svg>
  );
}

// ─── Question card ────────────────────────────────────────────────────────────

function QuestionCard({
  question,
  index,
  total,
  onChange,
  onDelete,
  onDuplicate,
  onMove,
}: {
  question: Question;
  index: number;
  total: number;
  onChange: (q: Question) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onMove: (dir: -1 | 1) => void;
}) {
  const [hovered, setHovered] = useState(false);

  const setField = <K extends keyof Question>(k: K, v: Question[K]) =>
    onChange({ ...question, [k]: v });

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative flex gap-3 rounded-[1rem] border-l-2 bg-white p-5 transition-all"
      style={{
        borderLeftColor: "var(--dash-primary-deep)",
        background: hovered ? "rgba(16,137,79,0.03)" : "white",
        boxShadow: hovered
          ? "0 8px 24px -14px rgba(15,23,42,0.16)"
          : "0 1px 2px rgba(15,23,42,0.045)",
      }}
    >
      {/* Drag handle — visible on hover */}
      <div
        className="mt-1 shrink-0 cursor-grab transition-opacity"
        style={{ opacity: hovered ? 1 : 0 }}
      >
        <DragHandle />
      </div>

      <div className="min-w-0 flex-1 space-y-3">
        {/* Row 1: number + text input + type selector */}
        <div className="flex items-start gap-3">
          <span className="mt-2.5 shrink-0 text-[11px] font-bold text-[var(--dash-primary-deep)]">
            Q{index + 1}
          </span>
          <input
            value={question.text}
            onChange={(e) => setField("text", e.target.value)}
            className="flex-1 rounded-lg border border-[var(--dash-line)] px-3 py-2 text-sm text-[var(--dash-ink)] outline-none transition-colors"
            onFocus={(e) => { e.currentTarget.style.borderColor = "var(--dash-primary-deep)"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "var(--dash-line)"; }}
            placeholder="Enter question…"
          />
          <Select
            value={question.type}
            onChange={(v) => {
              const next: Partial<Question> = { type: v };
              if (v === "multiple_choice" && !question.options) {
                next.options = ["Strongly agree", "Agree", "Disagree"];
              }
              onChange({ ...question, ...next });
            }}
            options={["scale", "multiple_choice", "yes_no", "free_text"]}
            className="w-36 shrink-0 text-xs"
          />
        </div>

        {/* Row 2: type-specific preview/editor */}
        <div className="pl-7">
          {question.type === "scale" && <ScalePreview />}
          {question.type === "yes_no" && <YesNoPreview />}
          {question.type === "free_text" && <FreeTextPreview />}
          {question.type === "multiple_choice" && (
            <MultipleChoiceEditor
              options={question.options ?? ["Option A", "Option B"]}
              onChange={(opts) => setField("options", opts)}
            />
          )}
        </div>

        {/* Row 3: controls */}
        <div className="flex items-center gap-4 border-t border-[var(--dash-line-soft)] pt-2.5 pl-7">
          <label className="flex cursor-pointer items-center gap-2 text-xs text-[var(--dash-ink-faint)]">
            <Toggle
              checked={question.required}
              onChange={(v) => setField("required", v)}
            />
            Required
          </label>

          <div className="ml-auto flex items-center gap-1">
            {/* Move up/down */}
            <button
              onClick={() => onMove(-1)}
              disabled={index === 0}
              className="flex h-7 w-7 items-center justify-center rounded text-[var(--dash-ink-ghost)] transition-colors hover:bg-[var(--dash-surface-muted)] hover:text-[var(--dash-ink-soft)] disabled:opacity-30"
            >
              <UpArrow />
            </button>
            <button
              onClick={() => onMove(1)}
              disabled={index === total - 1}
              className="flex h-7 w-7 items-center justify-center rounded text-[var(--dash-ink-ghost)] transition-colors hover:bg-[var(--dash-surface-muted)] hover:text-[var(--dash-ink-soft)] disabled:opacity-30"
            >
              <DownArrow />
            </button>

            <div className="mx-1 h-4 w-px bg-[var(--dash-line-soft)]" />

            <button
              onClick={onDuplicate}
              className="flex h-7 w-7 items-center justify-center rounded text-[var(--dash-ink-ghost)] transition-colors hover:bg-[var(--dash-surface-muted)] hover:text-[var(--dash-ink-soft)]"
              title="Duplicate"
            >
              <DuplicateIcon />
            </button>
            <button
              onClick={onDelete}
              className="flex h-7 w-7 items-center justify-center rounded text-[var(--dash-ink-ghost)] transition-colors hover:bg-[var(--dash-danger-soft)] hover:text-[var(--dash-danger)]"
              title="Delete"
            >
              <TrashMiniIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Phone preview ────────────────────────────────────────────────────────────

function PhonePreview({
  meta,
  questions,
}: {
  meta: SurveyMeta;
  questions: Question[];
}) {
  return (
    <div className="flex justify-center">
      <div
        className="relative w-[300px] overflow-hidden rounded-[24px] bg-white"
        style={{
          border: "1.5px solid var(--dash-line)",
          boxShadow: "0 8px 24px -12px rgba(15,23,42,0.14), 0 0 0 4px rgba(15,23,42,0.03)",
        }}
      >
        {/* Phone notch */}
        <div className="flex justify-center bg-white pt-3 pb-1">
          <div className="h-1.5 w-12 rounded-full bg-[var(--dash-line-soft)]" />
        </div>

        {/* Survey content */}
        <div className="max-h-[520px] overflow-y-auto px-5 pb-6 pt-3">
          {/* Anonymous badge */}
          {meta.anonymous && (
            <div className="mb-3 flex items-center gap-1.5 rounded-full bg-[rgba(16,137,79,0.08)] px-3 py-1.5">
              <ShieldIcon />
              <span className="text-[10px] font-semibold text-[var(--dash-primary)]">
                Your response is anonymous
              </span>
            </div>
          )}

          {/* Survey title */}
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--dash-ink-ghost)]">
            {meta.frequency} Survey
          </p>
          <h3 className="mb-4 text-base font-bold text-[var(--dash-ink)] leading-snug">
            {meta.title || "Untitled Survey"}
          </h3>

          {/* Questions */}
          <div className="space-y-5">
            {questions.map((q, i) => (
              <div key={q.id} className="space-y-2">
                <p className="text-xs font-semibold text-[var(--dash-ink)] leading-snug">
                  {i + 1}. {q.text || <span className="text-[var(--dash-ink-ghost)] italic">Untitled question</span>}
                  {q.required && <span className="ml-1 text-[var(--dash-danger)]">*</span>}
                </p>

                {q.type === "scale" && (
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <div
                        key={n}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-[var(--dash-line)] text-[10px] text-[var(--dash-ink-ghost)]"
                      >
                        {n}
                      </div>
                    ))}
                  </div>
                )}

                {q.type === "yes_no" && (
                  <div className="flex gap-2">
                    {["Yes", "No"].map((opt) => (
                      <div
                        key={opt}
                        className="rounded-full border border-[var(--dash-line)] px-4 py-1 text-xs text-[var(--dash-ink-ghost)]"
                      >
                        {opt}
                      </div>
                    ))}
                  </div>
                )}

                {q.type === "free_text" && (
                  <div className="w-full rounded-lg border border-dashed border-[var(--dash-line)] px-3 py-2 text-[10px] text-[var(--dash-ink-ghost)]">
                    Type your answer…
                  </div>
                )}

                {q.type === "multiple_choice" && (
                  <div className="space-y-1">
                    {(q.options ?? ["Option A", "Option B"]).map((opt, j) => (
                      <div key={j} className="flex items-center gap-2">
                        <div className="h-3 w-3 shrink-0 rounded-full border border-[var(--dash-line-strong)]" />
                        <span className="text-[10px] text-[var(--dash-ink-faint)]">{opt || "Option"}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Submit */}
          {questions.length > 0 && (
            <button
              disabled
              className="mt-6 w-full rounded-full bg-[var(--dash-primary-deep)] py-2.5 text-xs font-bold text-white opacity-90"
            >
              Submit Response
            </button>
          )}

          {questions.length === 0 && (
            <p className="mt-4 text-center text-[11px] text-[var(--dash-ink-ghost)]">
              Add questions to see preview
            </p>
          )}
        </div>

        {/* Phone home bar */}
        <div className="flex justify-center bg-white py-2">
          <div className="h-1 w-20 rounded-full bg-[var(--dash-line-soft)]" />
        </div>
      </div>
    </div>
  );
}

// ─── Template library ─────────────────────────────────────────────────────────

function TemplateLibrary({ onUse }: { onUse: (name: string) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-[1.5rem] bg-white" style={{ boxShadow: "0 1px 2px rgba(15,23,42,0.045)" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-6 py-4"
      >
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-[var(--dash-ink)]">Templates</span>
          <span className="rounded-full bg-[var(--dash-surface-muted)] px-2 py-0.5 text-[10px] font-bold text-[var(--dash-ink-faint)]">
            {TEMPLATES.length}
          </span>
        </div>
        <span className="text-[var(--dash-ink-ghost)]">
          <ChevronIcon open={open} />
        </span>
      </button>

      {open && (
        <div className="grid grid-cols-1 gap-4 border-t border-[var(--dash-line-soft)] px-6 pb-6 pt-4 sm:grid-cols-3">
          {TEMPLATES.map((t) => (
            <div
              key={t.name}
              className="flex flex-col justify-between gap-3 rounded-[1rem] bg-[var(--dash-surface-muted)] p-4"
            >
              <div className="space-y-1.5">
                <p className="font-bold text-sm text-[var(--dash-ink)]">{t.name}</p>
                <p className="text-xs text-[var(--dash-ink-faint)] leading-relaxed">{t.description}</p>
                <div className="flex flex-wrap gap-1 pt-1">
                  <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold text-[var(--dash-ink-faint)]">
                    {t.questions} questions
                  </span>
                  <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold text-[var(--dash-ink-faint)]">
                    {t.frequency}
                  </span>
                  <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold text-[var(--dash-ink-faint)]">
                    {t.anonymous ? "Anonymous" : "Identified"}
                  </span>
                </div>
              </div>
              <button
                onClick={() => onUse(t.name)}
                className="self-start rounded-full border border-[rgba(11,107,65,0.30)] px-4 py-1.5 text-xs font-semibold text-[var(--dash-primary-deep)] transition-all hover:bg-[rgba(11,107,65,0.05)]"
              >
                Use Template
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main shell ───────────────────────────────────────────────────────────────

export default function SurveyBuilderShell() {
  const [meta, setMeta] = useState<SurveyMeta>(INITIAL_META);
  const [questions, setQuestions] = useState<Question[]>(INITIAL_QUESTIONS);

  const setMetaField = <K extends keyof SurveyMeta>(k: K, v: SurveyMeta[K]) =>
    setMeta((m) => ({ ...m, [k]: v }));

  const updateQuestion = useCallback((id: string, q: Question) => {
    setQuestions((prev) => prev.map((p) => (p.id === id ? q : p)));
  }, []);

  const deleteQuestion = useCallback((id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  }, []);

  const duplicateQuestion = useCallback((q: Question) => {
    const clone: Question = { ...q, id: uid() };
    setQuestions((prev) => {
      const idx = prev.findIndex((p) => p.id === q.id);
      const next = [...prev];
      next.splice(idx + 1, 0, clone);
      return next;
    });
  }, []);

  const moveQuestion = useCallback((id: string, dir: -1 | 1) => {
    setQuestions((prev) => {
      const idx = prev.findIndex((q) => q.id === id);
      const next = idx + dir;
      if (next < 0 || next >= prev.length) return prev;
      const arr = [...prev];
      [arr[idx], arr[next]] = [arr[next], arr[idx]];
      return arr;
    });
  }, []);

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      { id: uid(), text: "", type: "scale", required: false },
    ]);
  };

  const handleUseTemplate = (name: string) => {
    setMetaField("title", `${name} Survey`);
    setMetaField("status", "Draft");
  };

  return (
    <div className="space-y-8">

      {/* ── Page header ──────────────────────────────────────── */}
      <header className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <div className="space-y-2">
          <span className="rounded-full bg-[rgba(16,137,79,0.10)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--dash-primary)]">
            Data Collection
          </span>
          <h1 className="text-3xl font-bold tracking-tighter text-[var(--dash-ink)] md:text-4xl">
            Survey Builder
          </h1>
          <p className="text-sm text-[var(--dash-ink-faint)]">
            Design pulse questions and sentiment capture flows
          </p>
        </div>
        <div className="flex gap-3">
          <button className="rounded-full border border-[rgba(11,107,65,0.30)] px-5 py-2.5 text-sm font-semibold text-[var(--dash-primary-deep)] transition-all hover:bg-[rgba(11,107,65,0.05)]">
            Templates
          </button>
          <button
            onClick={addQuestion}
            className={`rounded-full bg-[var(--dash-primary-deep)] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:scale-105 ${styles.ambientShadow}`}
          >
            + New Survey
          </button>
        </div>
      </header>

      {/* ── Main two-column layout ────────────────────────────── */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">

        {/* ── LEFT — Editor (60%) ──────────────────────────────── */}
        <div className="space-y-5 lg:w-[60%]">

          {/* Survey header card */}
          <div className={`space-y-4 rounded-[1.5rem] bg-white p-6 ${styles.ambientShadow}`}>
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[rgba(14,23,38,0.50)]">
                Survey Settings
              </p>
              <select
                value={meta.status}
                onChange={(e) => setMetaField("status", e.target.value as SurveyStatus)}
                className={`rounded-full border-0 px-3 py-1 text-[10px] font-bold outline-none cursor-pointer ${STATUS_STYLE[meta.status]}`}
              >
                {(["Draft", "Published", "Paused"] as SurveyStatus[]).map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Title */}
            <input
              value={meta.title}
              onChange={(e) => setMetaField("title", e.target.value)}
              placeholder="Survey title…"
              className="w-full rounded-lg border border-[var(--dash-line)] px-4 py-3 text-base font-semibold text-[var(--dash-ink)] outline-none transition-colors placeholder:font-normal placeholder:text-[var(--dash-ink-ghost)]"
              onFocus={(e) => { e.currentTarget.style.borderColor = "var(--dash-primary-deep)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "var(--dash-line)"; }}
            />

            {/* Description */}
            <textarea
              value={meta.description}
              onChange={(e) => setMetaField("description", e.target.value)}
              placeholder="Brief description of this survey's purpose…"
              rows={2}
              className="w-full resize-none rounded-lg border border-[var(--dash-line)] px-4 py-3 text-sm text-[var(--dash-ink)] outline-none transition-colors placeholder:text-[var(--dash-ink-ghost)]"
              onFocus={(e) => { e.currentTarget.style.borderColor = "var(--dash-primary-deep)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "var(--dash-line)"; }}
            />

            {/* Settings row */}
            <div className="flex flex-wrap items-center gap-3">
              <Select
                value={meta.frequency}
                onChange={(v) => setMetaField("frequency", v)}
                options={["Weekly", "Monthly", "Quarterly", "Event-based"]}
              />
              <Select
                value={meta.trigger}
                onChange={(v) => setMetaField("trigger", v)}
                options={["Scheduled Pulse", "After Meeting", "After 1:1", "After Project Completion"]}
              />
              <label className="flex items-center gap-2 text-sm text-[var(--dash-ink-soft)]">
                <Toggle
                  checked={meta.anonymous}
                  onChange={(v) => setMetaField("anonymous", v)}
                />
                Anonymous
              </label>
            </div>
          </div>

          {/* Question count */}
          <div className="flex items-center justify-between px-1">
            <p className="text-xs font-semibold text-[var(--dash-ink-ghost)]">
              {questions.length} question{questions.length !== 1 ? "s" : ""}
            </p>
            <p className="text-xs text-[var(--dash-ink-ghost)]">
              {questions.filter((q) => q.required).length} required
            </p>
          </div>

          {/* Questions list */}
          <div className="space-y-3">
            {questions.map((q, i) => (
              <QuestionCard
                key={q.id}
                question={q}
                index={i}
                total={questions.length}
                onChange={(updated) => updateQuestion(q.id, updated)}
                onDelete={() => deleteQuestion(q.id)}
                onDuplicate={() => duplicateQuestion(q)}
                onMove={(dir) => moveQuestion(q.id, dir)}
              />
            ))}
          </div>

          {/* Add question */}
          <button
            onClick={addQuestion}
            className="flex w-full items-center justify-center gap-2 rounded-[1rem] border border-dashed border-[rgba(11,107,65,0.30)] py-4 text-sm font-semibold text-[var(--dash-primary-deep)] transition-all hover:border-[rgba(11,107,65,0.60)] hover:bg-[rgba(11,107,65,0.04)]"
            style={{ background: "transparent" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(16,137,79,0.04)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-[var(--dash-primary-deep)]">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>
            Add Question
          </button>
        </div>

        {/* ── RIGHT — Preview (40%) ─────────────────────────────── */}
        <div className="lg:sticky lg:top-6 lg:w-[40%]">
          <div className={`rounded-[1.5rem] bg-[var(--dash-surface-muted)] p-6 ${styles.ambientShadow}`}>
            <div className="mb-5">
              <p className="font-bold text-[var(--dash-ink)]">Preview</p>
              <p className="text-xs text-[var(--dash-ink-ghost)]">What employees will see</p>
            </div>
            <PhonePreview meta={meta} questions={questions} />
          </div>
        </div>
      </div>

      {/* ── Template library ─────────────────────────────────── */}
      <TemplateLibrary onUse={handleUseTemplate} />

    </div>
  );
}
