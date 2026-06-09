"use client";

import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Check,
  Copy,
  FileText,
  GripVertical,
  ListChecks,
  MessageSquareText,
  MicOff,
  Plus,
  Send,
  ShieldCheck,
  Sparkles,
  Trash2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { CSSProperties } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "./configuration-workbench.module.css";

type QuestionType = "scale" | "multiple_choice" | "yes_no" | "free_text";
type SurveyStatus = "Draft" | "Published" | "Paused";
type Frequency = "Weekly" | "Monthly" | "Quarterly" | "Event-based";
type Trigger = "Scheduled Pulse" | "After Meeting" | "After 1:1" | "After Project Completion";

type Question = {
  id: string;
  text: string;
  type: QuestionType;
  required: boolean;
  options?: string[];
};

type SurveyMeta = {
  title: string;
  description: string;
  frequency: Frequency;
  trigger: Trigger;
  anonymous: boolean;
  status: SurveyStatus;
};

const INITIAL_META: SurveyMeta = {
  title: "Hey Alex, this'll take about 2 minutes.",
  description:
    "This is designed to feel like a live check-in, not a boring form. Your answers feed the culture, performance, and sustainability signals leadership actually uses to act.",
  frequency: "Monthly",
  trigger: "Scheduled Pulse",
  anonymous: true,
  status: "Draft",
};

const INITIAL_QUESTIONS: Question[] = [
  { id: "q1", text: "Do you feel like you truly belong in your team right now?", type: "scale", required: true },
  { id: "q2", text: "How full is your plate this week?", type: "scale", required: true },
  { id: "q3", text: "Does your manager make it easier to do your best work?", type: "multiple_choice", required: true, options: ["Easier", "Neutral", "Mixed", "Harder"] },
  { id: "q4", text: "Do you think our sustainability efforts actually make a real difference?", type: "scale", required: true },
  { id: "q5", text: "What gets in the way of joining sustainability initiatives?", type: "multiple_choice", required: false, options: ["I don't hear about them early enough", "They feel disconnected from my actual work", "My workload leaves no room", "My manager doesn't reinforce them"] },
  { id: "q6", text: "What's one thing we could change to make your week better?", type: "free_text", required: false },
];

const TEMPLATES = [
  {
    name: "Culture Pulse",
    description: "Belonging, safety, and cohesion.",
    frequency: "Monthly" as Frequency,
    questions: [
      "I feel included in team decisions",
      "I can raise concerns without negative consequences",
      "My team has the information it needs to do great work",
    ],
  },
  {
    name: "Manager Effectiveness",
    description: "Clarity, feedback, trust.",
    frequency: "Quarterly" as Frequency,
    questions: [
      "My manager gives me clear priorities",
      "My manager helps remove blockers",
      "I receive useful feedback often enough",
    ],
  },
  {
    name: "Onboarding Check-in",
    description: "New hire readiness after 30 days.",
    frequency: "Event-based" as Frequency,
    questions: [
      "I know what success looks like in my role",
      "I have the context I need to contribute",
      "What support would help you move faster?",
    ],
  },
];

const QUESTION_LABEL: Record<QuestionType, string> = {
  scale: "Scale",
  multiple_choice: "Multiple choice",
  yes_no: "Yes or no",
  free_text: "Free text",
};

const STATUS_OPTIONS: SurveyStatus[] = ["Draft", "Published", "Paused"];
const FREQUENCY_OPTIONS: Frequency[] = ["Weekly", "Monthly", "Quarterly", "Event-based"];
const TRIGGER_OPTIONS: Trigger[] = ["Scheduled Pulse", "After Meeting", "After 1:1", "After Project Completion"];
let idCounter = 10;
const uid = () => `q${++idCounter}`;
type CssVars = CSSProperties & Record<string, string>;

const beliefVideoSrc =
  "https://nqspbtenbeyfvpyqwigb.supabase.co/storage/v1/object/public/envo-public-assets/tree_video.mp4";

const FLAGSHIP_SCREENS = ["welcome", "belonging", "workload", "manager", "belief", "friction", "voice", "done"] as const;
type FlagshipScreen = (typeof FLAGSHIP_SCREENS)[number];

const flagshipFallbackQuestions = INITIAL_QUESTIONS.map((question) => question.text);

const flagshipDescriptions: Record<Exclude<FlagshipScreen, "welcome" | "done">, string> = {
  belonging:
    "The selection should feel emotional, not clinical. We want a quick gut answer here, because belonging is usually felt before it is articulated.",
  workload:
    "This one should feel alive. Instead of asking people to translate pressure into abstract numbers, we let them feel the state in a visual object.",
  manager:
    "This is a calm judgment question. The interaction should still feel beautiful, but the tone should stay composed so the answer feels safe to give.",
  belief:
    "This step should feel unexpectedly tactile. The more conviction rises, the more the visual comes alive, so the answer feels embodied instead of administrative.",
  friction:
    "This is multi-select, but it still needs rhythm. The options should arrive with a soft stagger so the screen feels composed and alive, not dumped onto the page.",
  voice:
    "This is the emotional release valve. The input should feel spacious, supportive, and slightly alive, with voice capture sitting there as a natural option rather than a gimmick.",
};

const flagshipPillars: Record<Exclude<FlagshipScreen, "done">, string> = {
  welcome: "Pulse setup",
  belonging: "Culture - Belonging",
  workload: "Performance - Workload",
  manager: "Performance - Manager Impact",
  belief: "Sustainability - Belief",
  friction: "Sustainability - Friction",
  voice: "Open Signal - Voice",
};

const belongingFaces = [
  { emoji: "😕", label: "Not quite", glow: "#d97706" },
  { emoji: "🙂", label: "Getting there", glow: "#d9a406" },
  { emoji: "😌", label: "Mostly yes", glow: "#0f766e" },
  { emoji: "😊", label: "Very much", glow: "#16a34a" },
  { emoji: "🤝", label: "Totally!", glow: "#22c55e" },
];

const managerCards = [
  { value: "easier", title: "Easier", body: "They clear blockers and help you focus on meaningful work.", icon: "↗", accent: "#0f9f6e" },
  { value: "neutral", title: "Neutral", body: "They are present, but not changing your day-to-day much.", icon: "→", accent: "#8b8b8b" },
  { value: "mixed", title: "Mixed", body: "Support is there, but it isn't consistent when pressure rises.", icon: "≈", accent: "#d97706" },
  { value: "harder", title: "Harder", body: "The way work is managed is making great work tougher to do.", icon: "↘", accent: "#ef4444" },
];

const frictionOptions = [
  "I don't hear about them early enough",
  "They feel disconnected from my actual work",
  "My workload leaves no room",
  "My manager doesn't reinforce them",
  "I actually do participate",
  "It feels unclear what difference they make",
];

export default function SurveyBuilderShell() {
  const [meta, setMeta] = useState(INITIAL_META);
  const [questions, setQuestions] = useState(INITIAL_QUESTIONS);
  const [selectedId, setSelectedId] = useState(INITIAL_QUESTIONS[0].id);

  const selectedQuestion = questions.find((question) => question.id === selectedId) ?? questions[0];
  const requiredCount = useMemo(() => questions.filter((question) => question.required).length, [questions]);

  const setMetaField = <K extends keyof SurveyMeta>(key: K, value: SurveyMeta[K]) => {
    setMeta((current) => ({ ...current, [key]: value }));
  };

  const updateQuestion = useCallback((id: string, patch: Partial<Question>) => {
    setQuestions((current) => current.map((question) => (question.id === id ? { ...question, ...patch } : question)));
  }, []);

  const addQuestion = (type: QuestionType = "scale") => {
    const next: Question = {
      id: uid(),
      text: "",
      type,
      required: false,
      options: type === "multiple_choice" ? ["Strongly agree", "Agree", "Disagree"] : undefined,
    };
    setQuestions((current) => [...current, next]);
    setSelectedId(next.id);
  };

  const duplicateQuestion = (question: Question) => {
    const clone = { ...question, id: uid(), text: `${question.text} Copy` };
    setQuestions((current) => {
      const index = current.findIndex((item) => item.id === question.id);
      const next = [...current];
      next.splice(index + 1, 0, clone);
      return next;
    });
    setSelectedId(clone.id);
  };

  const deleteQuestion = (id: string) => {
    const next = questions.filter((question) => question.id !== id);
    setQuestions(next);
    if (selectedId === id && next.length) setSelectedId(next[0].id);
  };

  const moveQuestion = (id: string, direction: -1 | 1) => {
    setQuestions((current) => {
      const index = current.findIndex((question) => question.id === id);
      const nextIndex = index + direction;
      if (index < 0 || nextIndex < 0 || nextIndex >= current.length) return current;
      const next = [...current];
      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
      return next;
    });
  };

  const applyTemplate = (template: (typeof TEMPLATES)[number]) => {
    const nextQuestions: Question[] = template.questions.map((text, index) => ({
      id: uid(),
      text,
      type: text.startsWith("What") ? "free_text" : "scale",
      required: index < 2,
    }));
    setMeta((current) => ({
      ...current,
      title: `${template.name} Survey`,
      description: template.description,
      frequency: template.frequency,
      status: "Draft",
    }));
    setQuestions(nextQuestions);
    setSelectedId(nextQuestions[0].id);
  };

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <div>
          <span className={styles.kicker}>Data Collection</span>
          <h1>Survey builder</h1>
          <p>Design pulse questions, sampling cadence, and the employee response experience.</p>
        </div>
        <div className={styles.actions}>
          <button className={styles.secondaryButton} type="button">
            <FileText size={16} />
            Save draft
          </button>
          <button className={styles.primaryButton} type="button">
            <Send size={16} />
            Publish survey
          </button>
        </div>
      </header>

      <div className={styles.statLine}>
        <Metric label="Questions" value={questions.length} tone="neutral" />
        <Metric label="Required" value={requiredCount} tone="good" />
        <Metric label="Est. minutes" value={Math.max(1, Math.ceil(questions.length * 0.45))} tone="neutral" />
        <Metric label="Responses target" value={82} tone="good" />
      </div>

      <section className={styles.templateRail} aria-label="Survey templates">
        <div className={styles.railIntro}>
          <Sparkles size={16} />
          <span>Start from a template</span>
        </div>
        {TEMPLATES.map((template) => (
          <button key={template.name} onClick={() => applyTemplate(template)} type="button">
            <strong>{template.name}</strong>
            <span>{template.description}</span>
          </button>
        ))}
      </section>

      <div className={styles.builderLayout}>
        <main className={styles.builderMain}>
          <section className={styles.settingsBand}>
            <label className={`${styles.field} ${styles.wideField}`}>
              <span>Survey title</span>
              <input value={meta.title} onChange={(event) => setMetaField("title", event.target.value)} />
            </label>
            <label className={`${styles.field} ${styles.wideField}`}>
              <span>Description</span>
              <textarea rows={2} value={meta.description} onChange={(event) => setMetaField("description", event.target.value)} />
            </label>
            <label className={styles.field}>
              <span>Status</span>
              <select value={meta.status} onChange={(event) => setMetaField("status", event.target.value as SurveyStatus)}>
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </label>
            <label className={styles.field}>
              <span>Cadence</span>
              <select value={meta.frequency} onChange={(event) => setMetaField("frequency", event.target.value as Frequency)}>
                {FREQUENCY_OPTIONS.map((frequency) => (
                  <option key={frequency} value={frequency}>{frequency}</option>
                ))}
              </select>
            </label>
            <label className={styles.field}>
              <span>Trigger</span>
              <select value={meta.trigger} onChange={(event) => setMetaField("trigger", event.target.value as Trigger)}>
                {TRIGGER_OPTIONS.map((trigger) => (
                  <option key={trigger} value={trigger}>{trigger}</option>
                ))}
              </select>
            </label>
            <div className={styles.inlineSwitch}>
              <Toggle checked={meta.anonymous} onChange={(anonymous) => setMetaField("anonymous", anonymous)} />
              <span>Anonymous responses</span>
            </div>
          </section>

          <section className={styles.questionSurface} aria-label="Survey questions">
            <div className={styles.surfaceHead}>
              <div>
                <span className={styles.kicker}>Question sequence</span>
                <h2>{questions.length} questions</h2>
              </div>
              <div className={styles.addMenu}>
                {(["scale", "multiple_choice", "yes_no", "free_text"] as QuestionType[]).map((type) => (
                  <button key={type} onClick={() => addQuestion(type)} type="button">
                    <Plus size={14} />
                    {QUESTION_LABEL[type]}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.questionRows}>
              {questions.map((question, index) => (
                <QuestionRow
                  index={index}
                  key={question.id}
                  onDelete={() => deleteQuestion(question.id)}
                  onDuplicate={() => duplicateQuestion(question)}
                  onMove={(direction) => moveQuestion(question.id, direction)}
                  onSelect={() => setSelectedId(question.id)}
                  onUpdate={(patch) => updateQuestion(question.id, patch)}
                  question={question}
                  selected={question.id === selectedQuestion.id}
                  total={questions.length}
                />
              ))}
            </div>
          </section>
        </main>

        <aside className={styles.previewPane}>
          <div className={styles.previewHead}>
            <div>
              <span className={styles.kicker}>Employee preview</span>
              <h2>{meta.title || "Untitled survey"}</h2>
            </div>
            {meta.anonymous && (
              <span className={`${styles.badge} ${styles.good}`}>
                <ShieldCheck size={13} />
                Anonymous
              </span>
            )}
          </div>
          <EmployeePreview meta={meta} questions={questions} />
        </aside>
      </div>
    </section>
  );
}

function Metric({ label, value, tone }: { label: string; value: number; tone: "good" | "neutral" }) {
  return (
    <div className={styles.metric}>
      <span>{label}</span>
      <strong className={styles[tone]}>{value}</strong>
    </div>
  );
}

function QuestionRow({
  index,
  onDelete,
  onDuplicate,
  onMove,
  onSelect,
  onUpdate,
  question,
  selected,
  total,
}: {
  index: number;
  onDelete: () => void;
  onDuplicate: () => void;
  onMove: (direction: -1 | 1) => void;
  onSelect: () => void;
  onUpdate: (patch: Partial<Question>) => void;
  question: Question;
  selected: boolean;
  total: number;
}) {
  const setType = (type: QuestionType) => {
    onUpdate({
      type,
      options: type === "multiple_choice" ? question.options ?? ["Strongly agree", "Agree", "Disagree"] : undefined,
    });
  };

  return (
    <article className={`${styles.questionRow} ${selected ? styles.questionRowActive : ""}`} onFocus={onSelect} onMouseDown={onSelect}>
      <div className={styles.questionHandle}>
        <GripVertical size={16} />
        <span>Q{index + 1}</span>
      </div>
      <div className={styles.questionBody}>
        <div className={styles.questionTopline}>
          <input
            value={question.text}
            onChange={(event) => onUpdate({ text: event.target.value })}
            placeholder="Type the question"
          />
          <select value={question.type} onChange={(event) => setType(event.target.value as QuestionType)}>
            {Object.entries(QUESTION_LABEL).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
        <QuestionEditor question={question} onUpdate={onUpdate} />
      </div>
      <div className={styles.questionActions}>
        <button aria-label="Move question up" disabled={index === 0} onClick={() => onMove(-1)} type="button">
          <ArrowUp size={15} />
        </button>
        <button aria-label="Move question down" disabled={index === total - 1} onClick={() => onMove(1)} type="button">
          <ArrowDown size={15} />
        </button>
        <button aria-label="Duplicate question" onClick={onDuplicate} type="button">
          <Copy size={15} />
        </button>
        <button aria-label="Delete question" disabled={total <= 1} onClick={onDelete} type="button">
          <Trash2 size={15} />
        </button>
        <label className={styles.requiredToggle}>
          <Toggle checked={question.required} onChange={(required) => onUpdate({ required })} />
          Required
        </label>
      </div>
    </article>
  );
}

function QuestionEditor({ onUpdate, question }: { onUpdate: (patch: Partial<Question>) => void; question: Question }) {
  if (question.type === "free_text") {
    return (
      <div className={styles.textPreview}>
        <MessageSquareText size={15} />
        Employee writes a short response.
      </div>
    );
  }

  if (question.type === "yes_no") {
    return (
      <div className={styles.optionPreview}>
        <span>Yes</span>
        <span>No</span>
      </div>
    );
  }

  if (question.type === "multiple_choice") {
    const options = question.options ?? ["Strongly agree", "Agree", "Disagree"];
    return (
      <div className={styles.choiceEditor}>
        {options.map((option, index) => (
          <label key={index}>
            <span />
            <input
              value={option}
              onChange={(event) => {
                const next = [...options];
                next[index] = event.target.value;
                onUpdate({ options: next });
              }}
            />
            {options.length > 2 && (
              <button
                aria-label="Remove option"
                onClick={() => onUpdate({ options: options.filter((_, optionIndex) => optionIndex !== index) })}
                type="button"
              >
                <Trash2 size={13} />
              </button>
            )}
          </label>
        ))}
        <button onClick={() => onUpdate({ options: [...options, ""] })} type="button">
          <Plus size={13} />
          Add option
        </button>
      </div>
    );
  }

  return (
    <div className={styles.scaleEditor}>
      <ListChecks size={15} />
      {[1, 2, 3, 4, 5].map((value) => (
        <span key={value}>{value}</span>
      ))}
      <small>Disagree to agree</small>
    </div>
  );
}

function EmployeePreview({ meta, questions }: { meta: SurveyMeta; questions: Question[] }) {
  const [screenIndex, setScreenIndex] = useState(0);
  const screen = FLAGSHIP_SCREENS[screenIndex];
  const progress = (screenIndex / (FLAGSHIP_SCREENS.length - 1)) * 100;
  const questionText = (index: number) => questions[index]?.text || flagshipFallbackQuestions[index];

  const next = () => setScreenIndex((current) => Math.min(current + 1, FLAGSHIP_SCREENS.length - 1));
  const back = () => setScreenIndex((current) => Math.max(current - 1, 0));

  return (
    <div className={styles.phoneStage}>
      <div className={styles.phoneDevice} aria-label="Live mobile survey preview">
        <div className={styles.phoneBezel}>
          <div className={styles.dynamicIsland} aria-hidden="true" />
          <div className={styles.flagshipScreen}>
            <div className={styles.flagshipAmbient} />
            <div className={styles.phoneStatusBar} aria-hidden="true">
              <span>9:41</span>
              <span>5G 100%</span>
            </div>

            <div className={styles.flagshipTop}>
              <div className={styles.flagshipProgress}>
                <motion.span animate={{ width: `${progress}%` }} transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }} />
              </div>
              <span>{screenIndex}/{FLAGSHIP_SCREENS.length - 1}</span>
            </div>

            {screen !== "done" ? (
              <div className={styles.flagshipSignal}>
                <span>{flagshipPillars[screen]}</span>
                {screen === "welcome" ? "A warmer opening improves completion and honesty." : "Live preview from survey builder text."}
              </div>
            ) : null}

            <div className={styles.flagshipViewport}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={screen}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
                  className={styles.flagshipSlide}
                >
                  {screen === "welcome" ? <FlagshipWelcome meta={meta} /> : null}
                  {screen === "belonging" ? <FlagshipBelonging title={questionText(0)} /> : null}
                  {screen === "workload" ? <FlagshipWorkload title={questionText(1)} /> : null}
                  {screen === "manager" ? <FlagshipManager title={questionText(2)} /> : null}
                  {screen === "belief" ? <FlagshipBelief title={questionText(3)} /> : null}
                  {screen === "friction" ? <FlagshipFriction title={questionText(4)} /> : null}
                  {screen === "voice" ? <FlagshipVoice title={questionText(5)} /> : null}
                  {screen === "done" ? <FlagshipDone /> : null}
                </motion.div>
              </AnimatePresence>
            </div>

            {screen !== "done" ? (
              <div className={styles.flagshipNav}>
                <button disabled={screenIndex === 0} onClick={back} type="button">
                  Back
                </button>
                <button onClick={next} type="button">
                  {screen === "welcome" ? "Start the pulse" : "Continue"}
                  <ArrowRight size={13} />
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function FlagshipWelcome({ meta }: { meta: SurveyMeta }) {
  return (
    <div className={styles.flagshipWelcome}>
      <span className={styles.flagshipEyebrow}>Workenvo Monthly Pulse</span>
      <h3>{meta.title || INITIAL_META.title}</h3>
      <p>{meta.description || INITIAL_META.description}</p>
      <div className={styles.flagshipChips}>
        <span>{meta.anonymous ? "Anonymous by default" : "Profile linked"}</span>
        <span>7 screens after this</span>
      </div>
      <div className={styles.flagshipDomains}>
        <span>Culture</span>
        <span>Performance</span>
        <span>Sustainability</span>
      </div>
    </div>
  );
}

function FlagshipQuestionShell({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.flagshipQuestionShell}>
      <span className={styles.flagshipEyebrow}>{eyebrow}</span>
      <h3>{title}</h3>
      <p>{description}</p>
      {children}
    </div>
  );
}

function FlagshipBelonging({ title }: { title: string }) {
  return (
    <FlagshipQuestionShell eyebrow="Culture - Belonging" title={title} description={flagshipDescriptions.belonging}>
      <div className={styles.belongingPanel}>
        <div className={styles.belongingFace}>🙂</div>
        <strong>How does it feel?</strong>
        <span>Choose the face that matches your real feeling today.</span>
      </div>
      <div className={styles.belongingPicker}>
        {belongingFaces.map((face, index) => (
          <button className={index === 2 ? styles.selectedMiniFace : ""} key={face.label} style={{ "--face-glow": face.glow } as CssVars} type="button">
            {face.emoji}
          </button>
        ))}
      </div>
    </FlagshipQuestionShell>
  );
}

function FlagshipWorkload({ title }: { title: string }) {
  return (
    <FlagshipQuestionShell eyebrow="Performance - Workload" title={title} description={flagshipDescriptions.workload}>
      <div className={styles.workloadMini}>
        <div className={styles.workloadVessel}>
          <motion.span animate={{ height: "58%" }} transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }} />
        </div>
        <div className={styles.workloadCopy}>
          <strong>Full but manageable</strong>
          <span>You&apos;re at capacity, but still in control.</span>
          <div className={styles.miniSlider}>
            <span />
          </div>
        </div>
      </div>
    </FlagshipQuestionShell>
  );
}

function FlagshipManager({ title }: { title: string }) {
  return (
    <FlagshipQuestionShell eyebrow="Performance - Manager Impact" title={title} description={flagshipDescriptions.manager}>
      <div className={styles.managerGrid}>
        {managerCards.map((card, index) => (
          <button className={index === 0 ? styles.managerSelected : ""} key={card.value} style={{ "--manager-accent": card.accent } as CssVars} type="button">
            <span>{card.icon}</span>
            <strong>{card.title}</strong>
            <small>{card.body}</small>
          </button>
        ))}
      </div>
    </FlagshipQuestionShell>
  );
}

function FlagshipBelief({ title }: { title: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoaded = () => {
      video.pause();
      if (!Number.isNaN(video.duration)) {
        video.currentTime = video.duration * 0.4;
      }
    };

    if (video.readyState >= 1) {
      handleLoaded();
    } else {
      video.addEventListener("loadedmetadata", handleLoaded, { once: true });
      video.load();
    }

    return () => {
      video.removeEventListener("loadedmetadata", handleLoaded);
    };
  }, []);

  return (
    <FlagshipQuestionShell eyebrow="Sustainability - Belief" title={title} description={flagshipDescriptions.belief}>
      <div className={styles.beliefMini}>
        <div className={styles.plantScene}>
          <video
            ref={videoRef}
            src={beliefVideoSrc}
            preload="auto"
            muted
            playsInline
            crossOrigin="anonymous"
            className={styles.beliefVideoFill}
          />
        </div>
        <div>
          <strong>Open, but unconvinced</strong>
          <span>There is movement here, but it still feels early and uneven.</span>
          <div className={styles.beliefSlider}>
            <span />
          </div>
        </div>
      </div>
    </FlagshipQuestionShell>
  );
}

function FlagshipFriction({ title }: { title: string }) {
  return (
    <FlagshipQuestionShell eyebrow="Sustainability - Friction" title={title} description={flagshipDescriptions.friction}>
      <div className={styles.frictionBar}>
        <span>Select every blocker that feels true.</span>
        <strong>2 selected</strong>
      </div>
      <div className={styles.frictionPills}>
        {frictionOptions.map((option, index) => (
          <button className={index === 1 || index === 2 ? styles.frictionSelected : ""} key={option} type="button">
            {option}
          </button>
        ))}
      </div>
    </FlagshipQuestionShell>
  );
}

function FlagshipVoice({ title }: { title: string }) {
  return (
    <FlagshipQuestionShell eyebrow="Open Signal - Voice" title={title} description={flagshipDescriptions.voice}>
      <div className={styles.voiceBox}>
        <span>Write freely. This is the part people remember.</span>
        <button type="button">
          <MicOff size={12} />
          Voice
        </button>
      </div>
    </FlagshipQuestionShell>
  );
}

function FlagshipDone() {
  return (
    <div className={styles.doneMini}>
      <div className={styles.doneRing}>
        <Check size={24} />
      </div>
      <h3>Your pulse is in.</h3>
      <p>Your answers help Workenvo spot what needs attention before it turns into a bigger people problem.</p>
      <div>
        <span>Culture: steady</span>
        <span>Performance: full but manageable</span>
        <span>Sustainability: open-minded</span>
      </div>
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <button
      aria-pressed={checked}
      className={`${styles.toggle} ${checked ? styles.toggleOn : ""}`}
      onClick={() => onChange(!checked)}
      type="button"
    >
      <span />
    </button>
  );
}
