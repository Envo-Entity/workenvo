"use client";

import { useState } from "react";
import styles from "../dashboard.module.css";

// ─── Types ────────────────────────────────────────────────────────────────────

type Severity = "Low" | "Material" | "Critical";
type Confidence = "Indicative" | "Corroborated" | "Validated";
type SignalStatus = "Active" | "Paused" | "Archived";

type Signal = {
  id: number;
  name: string;
  description: string;
  pillar: string;
  severity: Severity;
  confidence: Confidence;
  dataSources: string[];
  triggerRule: string;
  notificationTargets: string[];
  autoActions: string[];
  status: SignalStatus;
};

type FormState = Omit<Signal, "id">;
type FormErrors = Partial<Record<keyof FormState, string>>;

// ─── Constants ────────────────────────────────────────────────────────────────

const PILLARS = ["Belonging", "Growth", "Wellbeing", "Trust", "Inclusion", "Accountability", "Leadership"];
const DATA_SOURCES = ["Pulse Survey", "Sentiment Analysis", "Nudge Responses", "Meeting Patterns", "Feedback Data", "Performance Signals"];
const SEVERITIES: Severity[] = ["Low", "Material", "Critical"];
const CONFIDENCES: Confidence[] = ["Indicative", "Corroborated", "Validated"];
const NOTIFICATION_TARGETS = ["HR", "Direct Manager", "Leadership", "Both HR & Manager"];
const AUTO_ACTIONS = ["Send Nudge", "Schedule 1:1", "Flag to Manager", "Open Review", "No Action"];

const SEVERITY_COLOR: Record<Severity, string> = {
  Low: "var(--dash-primary)",
  Material: "var(--dash-warning)",
  Critical: "var(--dash-danger)",
};

const SEVERITY_BG: Record<Severity, string> = {
  Low: "bg-[rgba(16,137,79,0.10)] text-[var(--dash-primary)]",
  Material: "bg-[rgba(211,138,44,0.10)] text-[var(--dash-warning)]",
  Critical: "bg-[rgba(226,75,54,0.10)] text-[var(--dash-danger)]",
};

const STATUS_STYLE: Record<SignalStatus, string> = {
  Active: "bg-[rgba(16,137,79,0.10)] text-[var(--dash-primary)]",
  Paused: "bg-[rgba(211,138,44,0.10)] text-[var(--dash-warning)]",
  Archived: "bg-[var(--dash-line-soft)] text-[var(--dash-ink-faint)]",
};

// ─── Mock data ────────────────────────────────────────────────────────────────

const INITIAL_SIGNALS: Signal[] = [
  {
    id: 1,
    name: "Recognition Drop",
    description: "Detects a sustained decrease in peer-to-peer recognition activity across a team over a rolling two-week window.",
    pillar: "Belonging",
    severity: "Material",
    confidence: "Corroborated",
    dataSources: ["Pulse Survey", "Nudge Responses"],
    triggerRule: "Drop more than 20% over 2 consecutive weeks",
    notificationTargets: ["HR", "Direct Manager"],
    autoActions: ["Send Nudge"],
    status: "Active",
  },
  {
    id: 2,
    name: "Burnout Risk",
    description: "Flags teams showing compounding signals of overwork: sustained after-hours activity, declining sentiment scores, and low recovery between sprints.",
    pillar: "Wellbeing",
    severity: "Critical",
    confidence: "Validated",
    dataSources: ["Sentiment Analysis", "Meeting Patterns", "Performance Signals"],
    triggerRule: "3 or more co-occurring risk indicators over 3 weeks",
    notificationTargets: ["HR", "Leadership"],
    autoActions: ["Schedule 1:1", "Flag to Manager"],
    status: "Active",
  },
  {
    id: 3,
    name: "Low Psychological Safety",
    description: "Identifies environments where employees are less likely to voice concerns, share ideas, or admit mistakes — measured via anonymous feedback patterns.",
    pillar: "Trust",
    severity: "Material",
    confidence: "Indicative",
    dataSources: ["Feedback Data", "Pulse Survey"],
    triggerRule: "Psych safety score below 60 for 2+ consecutive periods",
    notificationTargets: ["HR"],
    autoActions: ["Send Nudge", "Open Review"],
    status: "Active",
  },
  {
    id: 4,
    name: "Feedback Loop Breakdown",
    description: "Detects when the velocity of actionable feedback exchanged between managers and direct reports falls below organisational baseline.",
    pillar: "Accountability",
    severity: "Low",
    confidence: "Corroborated",
    dataSources: ["Nudge Responses", "Feedback Data"],
    triggerRule: "Feedback frequency drops below 1 exchange per week per person",
    notificationTargets: ["Direct Manager"],
    autoActions: ["Send Nudge"],
    status: "Paused",
  },
  {
    id: 5,
    name: "Engagement Decline",
    description: "Tracks composite engagement score trends, surfacing early signals of disengagement before they escalate to attrition risk.",
    pillar: "Belonging",
    severity: "Critical",
    confidence: "Validated",
    dataSources: ["Pulse Survey", "Performance Signals", "Sentiment Analysis"],
    triggerRule: "Composite score drops 15% or more over 4 weeks",
    notificationTargets: ["HR", "Leadership", "Direct Manager"],
    autoActions: ["Schedule 1:1", "Flag to Manager", "Open Review"],
    status: "Active",
  },
];

const EMPTY_FORM: FormState = {
  name: "",
  description: "",
  pillar: "",
  severity: "Low",
  confidence: "Indicative",
  dataSources: [],
  triggerRule: "",
  notificationTargets: [],
  autoActions: [],
  status: "Active",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function Pill({ children, className }: { children: React.ReactNode; className: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold ${className}`}>
      {children}
    </span>
  );
}

function SignalCard({
  signal,
  onEdit,
}: {
  signal: Signal;
  onEdit: (signal: Signal) => void;
}) {
  const borderColor = SEVERITY_COLOR[signal.severity];

  return (
    <div
      className={`flex flex-col gap-4 rounded-[1.5rem] bg-white p-6 sm:flex-row sm:items-start sm:justify-between ${styles.ambientShadow}`}
      style={{ borderLeft: `3px solid ${borderColor}` }}
    >
      {/* Left — 70% */}
      <div className="flex-1 space-y-2.5 min-w-0">
        <p className="text-base font-bold text-[var(--dash-ink)]">{signal.name}</p>
        <p className="text-sm leading-relaxed text-[var(--dash-ink-faint)]">{signal.description}</p>

        <div className="flex flex-wrap gap-2 pt-1">
          <Pill className="border border-[rgba(16,137,79,0.30)] text-[var(--dash-primary)]">{signal.pillar}</Pill>
          <Pill className={SEVERITY_BG[signal.severity]}>{signal.severity}</Pill>
          <Pill className="border border-[var(--dash-line-strong)] text-[var(--dash-ink-faint)]">{signal.confidence}</Pill>
          {signal.dataSources.map((src) => (
            <Pill key={src} className="border border-[rgba(14,23,38,0.20)] text-[var(--dash-ink)]">{src}</Pill>
          ))}
        </div>
      </div>

      {/* Right — 30% */}
      <div className="flex shrink-0 flex-row items-start justify-between gap-4 sm:w-48 sm:flex-col sm:items-end">
        <div className="space-y-1.5 text-right">
          <Pill className={STATUS_STYLE[signal.status]}>{signal.status}</Pill>
          <p className="text-[10px] text-[var(--dash-ink-ghost)]">
            Notifies: {signal.notificationTargets.join(", ")}
          </p>
          <p className="text-[10px] text-[var(--dash-ink-ghost)]">
            Action: {signal.autoActions[0] ?? "None"}
          </p>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(signal)}
            title="Edit signal"
            className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--dash-ink-ghost)] transition-colors hover:bg-[rgba(16,137,79,0.10)] hover:text-[var(--dash-primary)]"
          >
            <PencilIcon />
          </button>
          <button
            title="More options"
            className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--dash-ink-ghost)] transition-colors hover:bg-[var(--dash-surface-muted)]"
          >
            <DotsIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Inline SVG icons ─────────────────────────────────────────────────────────

function PencilIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
    </svg>
  );
}

function DotsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
    </svg>
  );
}

// ─── Form field primitives ────────────────────────────────────────────────────

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[rgba(14,23,38,0.60)] mb-1.5">
      {children}
    </label>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-[11px] text-[var(--dash-danger)]">{message}</p>;
}

function TextInput({
  value,
  onChange,
  placeholder,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
}) {
  return (
    <>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border px-3 py-3 text-sm text-[var(--dash-ink)] placeholder:text-[var(--dash-ink-ghost)] outline-none transition-colors"
        style={{
          borderColor: error ? "var(--dash-danger)" : "var(--dash-line)",
          boxShadow: "none",
        }}
        onFocus={(e) => { e.currentTarget.style.borderColor = error ? "var(--dash-danger)" : "var(--dash-primary-deep)"; }}
        onBlur={(e) => { e.currentTarget.style.borderColor = error ? "var(--dash-danger)" : "var(--dash-line)"; }}
      />
      <FieldError message={error} />
    </>
  );
}

function TextareaInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <textarea
      rows={3}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-lg border border-[var(--dash-line)] px-3 py-3 text-sm text-[var(--dash-ink)] placeholder:text-[var(--dash-ink-ghost)] outline-none resize-none transition-colors"
      onFocus={(e) => { e.currentTarget.style.borderColor = "var(--dash-primary-deep)"; }}
      onBlur={(e) => { e.currentTarget.style.borderColor = "var(--dash-line)"; }}
    />
  );
}

function SelectInput({
  value,
  onChange,
  options,
  placeholder,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
  error?: string;
}) {
  return (
    <>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border px-3 py-3 text-sm text-[var(--dash-ink)] outline-none bg-white appearance-none transition-colors"
        style={{ borderColor: error ? "var(--dash-danger)" : "var(--dash-line)" }}
        onFocus={(e) => { e.currentTarget.style.borderColor = error ? "var(--dash-danger)" : "var(--dash-primary-deep)"; }}
        onBlur={(e) => { e.currentTarget.style.borderColor = error ? "var(--dash-danger)" : "var(--dash-line)"; }}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
      <FieldError message={error} />
    </>
  );
}

function CheckboxGroup({
  options,
  selected,
  onChange,
}: {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
}) {
  const toggle = (opt: string) => {
    onChange(
      selected.includes(opt)
        ? selected.filter((s) => s !== opt)
        : [...selected, opt]
    );
  };

  return (
    <div className="space-y-2">
      {options.map((opt) => (
        <label key={opt} className="flex cursor-pointer items-center gap-2.5">
          <div
            className="flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors"
            style={{
              borderColor: selected.includes(opt) ? "var(--dash-primary-deep)" : "var(--dash-line)",
              background: selected.includes(opt) ? "var(--dash-primary-deep)" : "white",
            }}
            onClick={() => toggle(opt)}
          >
            {selected.includes(opt) && (
              <svg width="10" height="10" viewBox="0 0 12 12" fill="white">
                <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              </svg>
            )}
          </div>
          <span className="text-sm text-[var(--dash-ink)]">{opt}</span>
        </label>
      ))}
    </div>
  );
}

function RadioGroup({
  options,
  selected,
  onChange,
  colorMap,
}: {
  options: string[];
  selected: string;
  onChange: (v: string) => void;
  colorMap?: Record<string, string>;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const isSelected = selected === opt;
        const color = colorMap?.[opt] ?? "var(--dash-primary-deep)";
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className="rounded-full px-4 py-1.5 text-xs font-semibold border transition-all"
            style={
              isSelected
                ? { background: color, color: "white", borderColor: color }
                : { background: "transparent", color: "var(--dash-ink-soft)", borderColor: "var(--dash-line)" }
            }
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function ToggleSwitch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
      style={{ background: checked ? "var(--dash-primary-deep)" : "var(--dash-line)" }}
    >
      <span
        className="inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform"
        style={{ transform: checked ? "translateX(1.375rem)" : "translateX(0.25rem)" }}
      />
    </button>
  );
}

// ─── Drawer ───────────────────────────────────────────────────────────────────

function SignalDrawer({
  open,
  editingSignal,
  onClose,
  onSave,
}: {
  open: boolean;
  editingSignal: Signal | null;
  onClose: () => void;
  onSave: (form: FormState, id?: number) => void;
}) {
  const [form, setForm] = useState<FormState>(
    editingSignal
      ? { ...editingSignal }
      : { ...EMPTY_FORM }
  );
  const [errors, setErrors] = useState<FormErrors>({});

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = (): boolean => {
    const errs: FormErrors = {};
    if (!form.name.trim()) errs.name = "Signal name is required";
    if (!form.pillar) errs.pillar = "Culture pillar is required";
    if (!form.severity) errs.severity = "Severity is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave(form, editingSignal?.id);
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 transition-opacity duration-300"
        style={{
          background: "rgba(15,23,42,0.30)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
        }}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className="fixed right-0 top-0 z-50 flex h-full w-full max-w-[480px] flex-col border-l border-[var(--dash-line-soft)] bg-[var(--dash-surface)] transition-transform duration-300 ease-out"
        style={{
          transform: open ? "translateX(0)" : "translateX(100%)",
          boxShadow: "-12px 0 28px rgba(15, 23, 42, 0.08)",
        }}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between border-b border-[rgba(15,23,42,0.06)] px-6 py-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[rgba(14,23,38,0.50)]">
              {editingSignal ? "Edit Signal" : "Create Signal"}
            </p>
            <h2 className="mt-0.5 text-lg font-bold text-[var(--dash-ink)]">
              {editingSignal ? form.name || editingSignal.name : "New Behavioural Signal"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--dash-ink-ghost)] transition-colors hover:bg-[var(--dash-surface-muted)] hover:text-[var(--dash-ink-soft)]"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Drawer form — scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">

          {/* 1. Signal Name */}
          <div>
            <FieldLabel>Signal Name *</FieldLabel>
            <TextInput
              value={form.name}
              onChange={(v) => set("name", v)}
              placeholder="e.g. Recognition Drop"
              error={errors.name}
            />
          </div>

          {/* 2. Description */}
          <div>
            <FieldLabel>Description</FieldLabel>
            <TextareaInput
              value={form.description}
              onChange={(v) => set("description", v)}
              placeholder="Describe what this signal detects and why it matters…"
            />
          </div>

          {/* 3. Culture Pillar */}
          <div>
            <FieldLabel>Associated Culture Pillar *</FieldLabel>
            <SelectInput
              value={form.pillar}
              onChange={(v) => set("pillar", v)}
              options={PILLARS}
              placeholder="Select a pillar…"
              error={errors.pillar}
            />
          </div>

          {/* 4. Data Sources */}
          <div>
            <FieldLabel>Data Sources</FieldLabel>
            <CheckboxGroup
              options={DATA_SOURCES}
              selected={form.dataSources}
              onChange={(v) => set("dataSources", v)}
            />
          </div>

          {/* 5. Trigger Rule */}
          <div>
            <FieldLabel>Trigger Rule</FieldLabel>
            <TextInput
              value={form.triggerRule}
              onChange={(v) => set("triggerRule", v)}
              placeholder="e.g. Drop more than 20% over 2 weeks"
            />
          </div>

          {/* 6. Severity */}
          <div>
            <FieldLabel>Severity Level *</FieldLabel>
            <RadioGroup
              options={SEVERITIES}
              selected={form.severity}
              onChange={(v) => set("severity", v as Severity)}
              colorMap={SEVERITY_COLOR}
            />
            <FieldError message={errors.severity} />
          </div>

          {/* 7. Confidence */}
          <div>
            <FieldLabel>Confidence Level</FieldLabel>
            <RadioGroup
              options={CONFIDENCES}
              selected={form.confidence}
              onChange={(v) => set("confidence", v as Confidence)}
            />
          </div>

          {/* 8. Notification Target */}
          <div>
            <FieldLabel>Notification Targets</FieldLabel>
            <CheckboxGroup
              options={NOTIFICATION_TARGETS}
              selected={form.notificationTargets}
              onChange={(v) => set("notificationTargets", v)}
            />
          </div>

          {/* 9. Auto-Actions */}
          <div>
            <FieldLabel>Auto-Actions</FieldLabel>
            <CheckboxGroup
              options={AUTO_ACTIONS}
              selected={form.autoActions}
              onChange={(v) => set("autoActions", v)}
            />
          </div>

          {/* 10. Status */}
          <div>
            <FieldLabel>Status *</FieldLabel>
            <div className="flex items-center gap-3">
              <ToggleSwitch
                checked={form.status === "Active"}
                onChange={(on) => set("status", on ? "Active" : "Paused")}
              />
              <span className="text-sm font-semibold text-[var(--dash-ink)]">
                {form.status === "Active" ? "Active" : "Paused"}
              </span>
            </div>
          </div>

          {/* Spacer so last field isn't behind footer */}
          <div className="h-4" />
        </div>

        {/* Drawer footer */}
        <div className="flex items-center justify-end gap-3 border-t border-[rgba(15,23,42,0.06)] px-6 py-4">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-semibold text-[var(--dash-ink-faint)] transition-colors hover:text-[var(--dash-ink)]"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className={`rounded-full bg-[var(--dash-primary-deep)] px-6 py-2.5 text-sm font-semibold text-white transition-all hover:scale-105 ${styles.ambientShadow}`}
          >
            Save Signal
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Main shell ───────────────────────────────────────────────────────────────

export default function SignalsSetupShell() {
  const [signals, setSignals] = useState<Signal[]>(INITIAL_SIGNALS);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingSignal, setEditingSignal] = useState<Signal | null>(null);

  const openCreate = () => {
    setEditingSignal(null);
    setDrawerOpen(true);
  };

  const openEdit = (signal: Signal) => {
    setEditingSignal(signal);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setTimeout(() => setEditingSignal(null), 310);
  };

  const handleSave = (form: FormState, id?: number) => {
    if (id !== undefined) {
      setSignals((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...form } : s))
      );
    } else {
      const newId = Math.max(0, ...signals.map((s) => s.id)) + 1;
      setSignals((prev) => [...prev, { id: newId, ...form }]);
    }
    closeDrawer();
  };

  return (
    <>
      {/* ── Header ─────────────────────────────────────────── */}
      <header className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[rgba(16,137,79,0.10)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--dash-primary)]">
              Signal Configuration
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tighter text-[var(--dash-ink)] md:text-4xl">
            Signals Setup
          </h1>
          <p className="text-sm text-[var(--dash-ink-faint)]">
            Define the behavioural signals your organisation tracks
          </p>
        </div>

        <div className="flex gap-3">
          <button className="rounded-full border border-[rgba(11,107,65,0.30)] px-5 py-2.5 text-sm font-semibold text-[var(--dash-primary-deep)] transition-all hover:bg-[rgba(11,107,65,0.05)]">
            Export Config
          </button>
          <button
            onClick={openCreate}
            className={`rounded-full bg-[var(--dash-primary-deep)] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:scale-105 ${styles.ambientShadow}`}
          >
            + Create Signal
          </button>
        </div>
      </header>

      {/* ── Signal count ────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-[var(--dash-ink-ghost)]">
          {signals.length} signal{signals.length !== 1 ? "s" : ""} configured
        </p>
        <div className="flex gap-2">
          {(["Active", "Paused", "Archived"] as SignalStatus[]).map((status) => {
            const count = signals.filter((s) => s.status === status).length;
            return (
              <span key={status} className={`rounded-full px-3 py-1 text-[10px] font-bold ${STATUS_STYLE[status]}`}>
                {count} {status}
              </span>
            );
          })}
        </div>
      </div>

      {/* ── Signal list ─────────────────────────────────────── */}
      <div className="space-y-4">
        {signals.map((signal) => (
          <SignalCard key={signal.id} signal={signal} onEdit={openEdit} />
        ))}
      </div>

      {/* ── Drawer ──────────────────────────────────────────── */}
      <SignalDrawer
        key={editingSignal?.id ?? "create"}
        open={drawerOpen}
        editingSignal={editingSignal}
        onClose={closeDrawer}
        onSave={handleSave}
      />
    </>
  );
}
