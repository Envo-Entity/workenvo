"use client";

import {
  Bell,
  Check,
  ChevronDown,
  CirclePause,
  Copy,
  FileDown,
  Plus,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import styles from "./configuration-workbench.module.css";

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

const PILLARS = ["Belonging", "Growth", "Wellbeing", "Trust", "Inclusion", "Accountability", "Leadership"];
const DATA_SOURCES = ["Pulse Survey", "Sentiment Analysis", "Nudge Responses", "Meeting Patterns", "Feedback Data", "Performance Signals"];
const SEVERITIES: Severity[] = ["Low", "Material", "Critical"];
const CONFIDENCES: Confidence[] = ["Indicative", "Corroborated", "Validated"];
const NOTIFICATION_TARGETS = ["HR", "Direct Manager", "Leadership", "Both HR & Manager"];
const AUTO_ACTIONS = ["Send Nudge", "Schedule 1:1", "Flag to Manager", "Open Review", "No Action"];
const STATUSES: SignalStatus[] = ["Active", "Paused", "Archived"];

const INITIAL_SIGNALS: Signal[] = [
  {
    id: 1,
    name: "Recognition Drop",
    description: "Detects a sustained decrease in peer recognition across a team over a rolling two-week window.",
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
    description: "Flags compounding overwork signals: after-hours activity, sentiment decline, and low recovery between sprints.",
    pillar: "Wellbeing",
    severity: "Critical",
    confidence: "Validated",
    dataSources: ["Sentiment Analysis", "Meeting Patterns", "Performance Signals"],
    triggerRule: "3 or more co-occurring indicators over 3 weeks",
    notificationTargets: ["HR", "Leadership"],
    autoActions: ["Schedule 1:1", "Flag to Manager"],
    status: "Active",
  },
  {
    id: 3,
    name: "Low Psychological Safety",
    description: "Identifies teams where employees are less likely to voice concerns, share ideas, or admit mistakes.",
    pillar: "Trust",
    severity: "Material",
    confidence: "Indicative",
    dataSources: ["Feedback Data", "Pulse Survey"],
    triggerRule: "Psych safety score below 60 for 2+ periods",
    notificationTargets: ["HR"],
    autoActions: ["Send Nudge", "Open Review"],
    status: "Active",
  },
  {
    id: 4,
    name: "Feedback Loop Breakdown",
    description: "Detects when actionable feedback between managers and reports falls below organisational baseline.",
    pillar: "Accountability",
    severity: "Low",
    confidence: "Corroborated",
    dataSources: ["Nudge Responses", "Feedback Data"],
    triggerRule: "Feedback frequency below 1 exchange per week",
    notificationTargets: ["Direct Manager"],
    autoActions: ["Send Nudge"],
    status: "Paused",
  },
  {
    id: 5,
    name: "Engagement Decline",
    description: "Tracks composite engagement trend shifts before they escalate into attrition risk.",
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

const EMPTY_SIGNAL: Signal = {
  id: 0,
  name: "Untitled Signal",
  description: "",
  pillar: "Belonging",
  severity: "Low",
  confidence: "Indicative",
  dataSources: ["Pulse Survey"],
  triggerRule: "",
  notificationTargets: ["HR"],
  autoActions: ["Send Nudge"],
  status: "Active",
};

const severityClass: Record<Severity, string> = {
  Low: styles.good,
  Material: styles.watch,
  Critical: styles.critical,
};

const statusClass: Record<SignalStatus, string> = {
  Active: styles.good,
  Paused: styles.watch,
  Archived: styles.neutral,
};

export default function SignalsSetupShell() {
  const [signals, setSignals] = useState(INITIAL_SIGNALS);
  const [selectedId, setSelectedId] = useState(INITIAL_SIGNALS[0].id);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<SignalStatus | "All">("All");

  const selected = signals.find((signal) => signal.id === selectedId) ?? signals[0];

  const filteredSignals = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return signals.filter((signal) => {
      const matchesQuery =
        !needle ||
        [signal.name, signal.description, signal.pillar, signal.triggerRule]
          .join(" ")
          .toLowerCase()
          .includes(needle);
      const matchesStatus = statusFilter === "All" || signal.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [query, signals, statusFilter]);

  const updateSelected = (patch: Partial<Signal>) => {
    setSignals((current) =>
      current.map((signal) => (signal.id === selected.id ? { ...signal, ...patch } : signal)),
    );
  };

  const createSignal = () => {
    const nextId = Math.max(0, ...signals.map((signal) => signal.id)) + 1;
    const nextSignal = {
      ...EMPTY_SIGNAL,
      id: nextId,
      name: `New Signal ${nextId}`,
      triggerRule: "Define the threshold and lookback window",
    };
    setSignals((current) => [nextSignal, ...current]);
    setSelectedId(nextId);
    setStatusFilter("All");
  };

  const duplicateSignal = () => {
    if (!selected) return;
    const nextId = Math.max(0, ...signals.map((signal) => signal.id)) + 1;
    const clone = { ...selected, id: nextId, name: `${selected.name} Copy`, status: "Paused" as SignalStatus };
    setSignals((current) => [clone, ...current]);
    setSelectedId(nextId);
  };

  const deleteSignal = () => {
    if (signals.length <= 1) return;
    const nextSignals = signals.filter((signal) => signal.id !== selected.id);
    setSignals(nextSignals);
    setSelectedId(nextSignals[0].id);
  };

  const activeCount = signals.filter((signal) => signal.status === "Active").length;
  const criticalCount = signals.filter((signal) => signal.severity === "Critical").length;
  const validatedCount = signals.filter((signal) => signal.confidence === "Validated").length;

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <div>
          <span className={styles.kicker}>Signal Configuration</span>
          <h1>Signals setup</h1>
          <p>Define what Workenvo watches, when it fires, and who gets nudged.</p>
        </div>
        <div className={styles.actions}>
          <button className={styles.secondaryButton} type="button">
            <FileDown size={16} />
            Export config
          </button>
          <button className={styles.primaryButton} onClick={createSignal} type="button">
            <Plus size={16} />
            Create signal
          </button>
        </div>
      </header>

      <div className={styles.statLine}>
        <Metric label="Active signals" value={activeCount} tone="good" />
        <Metric label="Critical rules" value={criticalCount} tone="critical" />
        <Metric label="Validated confidence" value={validatedCount} tone="good" />
        <Metric label="Data sources" value={DATA_SOURCES.length} tone="neutral" />
      </div>

      <div className={styles.workbench}>
        <section className={styles.ruleList} aria-label="Signal rules">
          <div className={styles.toolbar}>
            <label className={styles.searchBox}>
              <Search size={15} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search signals, pillars, or rules"
              />
            </label>
            <label className={styles.selectBox}>
              <SlidersHorizontal size={15} />
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as SignalStatus | "All")}>
                <option value="All">All statuses</option>
                {STATUSES.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              <ChevronDown size={15} />
            </label>
          </div>

          <div className={styles.tableHeader}>
            <span>Signal</span>
            <span>Pillar</span>
            <span>Trigger</span>
            <span>Status</span>
          </div>

          <div className={styles.rows}>
            {filteredSignals.map((signal) => (
              <button
                className={`${styles.ruleRow} ${signal.id === selected.id ? styles.ruleRowActive : ""}`}
                key={signal.id}
                onClick={() => setSelectedId(signal.id)}
                type="button"
              >
                <span className={styles.ruleName}>
                  <strong>{signal.name}</strong>
                  <small>{signal.description}</small>
                </span>
                <span className={styles.compactCell}>{signal.pillar}</span>
                <span className={styles.triggerCell}>{signal.triggerRule}</span>
                <span className={styles.rowBadges}>
                  <Badge className={severityClass[signal.severity]}>{signal.severity}</Badge>
                  <Badge className={statusClass[signal.status]}>{signal.status}</Badge>
                </span>
              </button>
            ))}
          </div>
        </section>

        <aside className={styles.inspector} aria-label="Selected signal editor">
          <div className={styles.inspectorHead}>
            <div>
              <span className={styles.kicker}>Selected signal</span>
              <h2>{selected.name}</h2>
            </div>
            <div className={styles.iconActions}>
              <button aria-label="Duplicate signal" onClick={duplicateSignal} type="button">
                <Copy size={16} />
              </button>
              <button aria-label="Delete signal" disabled={signals.length <= 1} onClick={deleteSignal} type="button">
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          <div className={styles.editorGrid}>
            <Field label="Signal name">
              <input value={selected.name} onChange={(event) => updateSelected({ name: event.target.value })} />
            </Field>
            <Field label="Culture pillar">
              <select value={selected.pillar} onChange={(event) => updateSelected({ pillar: event.target.value })}>
                {PILLARS.map((pillar) => (
                  <option key={pillar} value={pillar}>{pillar}</option>
                ))}
              </select>
            </Field>
            <Field label="Description" wide>
              <textarea
                rows={3}
                value={selected.description}
                onChange={(event) => updateSelected({ description: event.target.value })}
              />
            </Field>
            <Field label="Trigger rule" wide>
              <input value={selected.triggerRule} onChange={(event) => updateSelected({ triggerRule: event.target.value })} />
            </Field>
          </div>

          <ControlGroup label="Severity">
            <Segmented
              options={SEVERITIES}
              value={selected.severity}
              onChange={(severity) => updateSelected({ severity })}
            />
          </ControlGroup>

          <ControlGroup label="Confidence">
            <Segmented
              options={CONFIDENCES}
              value={selected.confidence}
              onChange={(confidence) => updateSelected({ confidence })}
            />
          </ControlGroup>

          <ControlGroup label="Data sources">
            <TokenPicker
              options={DATA_SOURCES}
              selected={selected.dataSources}
              onChange={(dataSources) => updateSelected({ dataSources })}
            />
          </ControlGroup>

          <ControlGroup label="Notifications">
            <TokenPicker
              options={NOTIFICATION_TARGETS}
              selected={selected.notificationTargets}
              onChange={(notificationTargets) => updateSelected({ notificationTargets })}
              icon={<Bell size={14} />}
            />
          </ControlGroup>

          <ControlGroup label="Auto actions">
            <TokenPicker
              options={AUTO_ACTIONS}
              selected={selected.autoActions}
              onChange={(autoActions) => updateSelected({ autoActions })}
              icon={<ShieldCheck size={14} />}
            />
          </ControlGroup>

          <div className={styles.statusBar}>
            {STATUSES.map((status) => (
              <button
                className={`${styles.statusButton} ${selected.status === status ? styles.statusButtonActive : ""}`}
                key={status}
                onClick={() => updateSelected({ status })}
                type="button"
              >
                {status === "Paused" ? <CirclePause size={15} /> : <Check size={15} />}
                {status}
              </button>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}

function Metric({ label, value, tone }: { label: string; value: number; tone: "good" | "critical" | "neutral" }) {
  return (
    <div className={styles.metric}>
      <span>{label}</span>
      <strong className={styles[tone]}>{value}</strong>
    </div>
  );
}

function Badge({ children, className }: { children: React.ReactNode; className: string }) {
  return <span className={`${styles.badge} ${className}`}>{children}</span>;
}

function Field({ children, label, wide }: { children: React.ReactNode; label: string; wide?: boolean }) {
  return (
    <label className={`${styles.field} ${wide ? styles.wideField : ""}`}>
      <span>{label}</span>
      {children}
    </label>
  );
}

function ControlGroup({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div className={styles.controlGroup}>
      <div className={styles.controlLabel}>{label}</div>
      {children}
    </div>
  );
}

function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className={styles.segmented}>
      {options.map((option) => (
        <button
          className={value === option ? styles.segmentActive : ""}
          key={option}
          onClick={() => onChange(option)}
          type="button"
        >
          {option}
        </button>
      ))}
    </div>
  );
}

function TokenPicker({
  icon,
  onChange,
  options,
  selected,
}: {
  icon?: React.ReactNode;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
}) {
  const toggle = (option: string) => {
    onChange(selected.includes(option) ? selected.filter((item) => item !== option) : [...selected, option]);
  };

  return (
    <div className={styles.tokenPicker}>
      {options.map((option) => {
        const active = selected.includes(option);
        return (
          <button
            className={active ? styles.tokenActive : ""}
            key={option}
            onClick={() => toggle(option)}
            type="button"
          >
            {icon}
            {option}
          </button>
        );
      })}
    </div>
  );
}
