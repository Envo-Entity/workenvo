"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Dot,
  Mic,
  MicOff,
  Sparkles,
} from "lucide-react";
import BrandLogo from "@/components/BrandLogo";

type ScreenId =
  | "welcome"
  | "belonging"
  | "workload"
  | "manager"
  | "belief"
  | "friction"
  | "voice"
  | "done";

type Answers = {
  belonging: number | null;
  workload: number | null;
  manager: "easier" | "neutral" | "harder" | "mixed" | null;
  belief: number | null;
  friction: string[];
  voice: string;
};

type RecognitionCtor = new () => {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
};

type SpeechRecognitionResultLike = {
  0: {
    transcript: string;
  };
  isFinal: boolean;
};

type SpeechRecognitionEventLike = {
  results: ArrayLike<SpeechRecognitionResultLike>;
};

const screens: ScreenId[] = [
  "welcome",
  "belonging",
  "workload",
  "manager",
  "belief",
  "friction",
  "voice",
  "done",
];

const belongingFaces = [
  { emoji: "😕", label: "Not quite", glow: "#d97706" },
  { emoji: "🙂", label: "Getting there", glow: "#d9a406" },
  { emoji: "😌", label: "Mostly yes", glow: "#0f766e" },
  { emoji: "😊", label: "Very much", glow: "#16a34a" },
  { emoji: "🤝", label: "Totally!", glow: "#22c55e" },
];

const workloadStates = [
  {
    label: "Calm and focused",
    description: "You have room to do deep work without thrash.",
    color: "#6bb4ff",
    wave: "low",
  },
  {
    label: "Nicely busy",
    description: "A healthy pace with momentum, not pressure.",
    color: "#38bdf8",
    wave: "steady",
  },
  {
    label: "Full but manageable",
    description: "You're at capacity, but still in control.",
    color: "#14b8a6",
    wave: "balanced",
  },
  {
    label: "Crowded week",
    description: "Trade-offs are starting to show up in your day.",
    color: "#f59e0b",
    wave: "high",
  },
  {
    label: "Overloaded",
    description: "The pace is likely hurting execution quality.",
    color: "#f97316",
    wave: "boiling",
  },
];

const managerCards = [
  {
    value: "easier",
    title: "Easier",
    body: "They clear blockers and help you focus on meaningful work.",
    icon: "↗",
    accent: "#0f9f6e",
  },
  {
    value: "neutral",
    title: "Neutral",
    body: "They are present, but not changing your day-to-day much.",
    icon: "→",
    accent: "#8b8b8b",
  },
  {
    value: "mixed",
    title: "Mixed",
    body: "Support is there, but it isn't consistent when pressure rises.",
    icon: "≈",
    accent: "#d97706",
  },
  {
    value: "harder",
    title: "Harder",
    body: "The way work is managed is making great work tougher to do.",
    icon: "↘",
    accent: "#ef4444",
  },
] as const;

const frictionOptions = [
  "I don't hear about them early enough",
  "They feel disconnected from my actual work",
  "My workload leaves no room",
  "My manager doesn't reinforce them",
  "I actually do participate",
  "It feels unclear what difference they make",
];

const beliefVideoSrc =
  "https://nqspbtenbeyfvpyqwigb.supabase.co/storage/v1/object/public/envo-public-assets/tree_video.mp4";
const surveyPreviewWidth = 414;
const surveyPreviewHeight = 896;

const initialAnswers: Answers = {
  belonging: null,
  workload: null,
  manager: null,
  belief: null,
  friction: [],
  voice: "",
};

const beliefStates = [
  {
    label: "Doubtful, honestly",
    description: "Right now it feels more like messaging than meaningful proof.",
  },
  {
    label: "Not really seeing it",
    description: "There are signs of effort, but not enough substance yet.",
  },
  {
    label: "Open, but unconvinced",
    description: "There is movement here, but it still feels early and uneven.",
  },
  {
    label: "Yes, mostly",
    description: "It feels real in enough places that people can start trusting it.",
  },
  {
    label: "Strongly believe this",
    description: "The work feels visible, embedded, and worth getting behind.",
  },
] as const;

const beliefPlantLeaves = [
  {
    id: "lower-left",
    side: "left" as const,
    threshold: 0.06,
    position: 0.25,
    length: 46,
    height: 26,
    startRotate: -148,
    endRotate: -120,
    scale: 0.78,
  },
  {
    id: "lower-right",
    side: "right" as const,
    threshold: 0.18,
    position: 0.34,
    length: 52,
    height: 30,
    startRotate: -28,
    endRotate: 8,
    scale: 0.84,
  },
  {
    id: "mid-left",
    side: "left" as const,
    threshold: 0.34,
    position: 0.5,
    length: 64,
    height: 36,
    startRotate: -154,
    endRotate: -124,
    scale: 0.98,
  },
  {
    id: "mid-right",
    side: "right" as const,
    threshold: 0.5,
    position: 0.6,
    length: 72,
    height: 42,
    startRotate: -34,
    endRotate: 12,
    scale: 1.06,
  },
  {
    id: "upper-left",
    side: "left" as const,
    threshold: 0.68,
    position: 0.77,
    length: 76,
    height: 44,
    startRotate: -160,
    endRotate: -132,
    scale: 1.1,
  },
];

function getWorkloadStateIndex(value: number | null) {
  if (value === null) {
    return 2;
  }

  if (value <= 20) return 0;
  if (value <= 40) return 1;
  if (value <= 60) return 2;
  if (value <= 80) return 3;
  return 4;
}

function getWorkloadState(value: number | null) {
  return workloadStates[getWorkloadStateIndex(value)];
}

function getBeliefStateIndex(value: number | null) {
  if (value === null) {
    return 2;
  }

  if (value <= 20) return 0;
  if (value <= 40) return 1;
  if (value <= 60) return 2;
  if (value <= 80) return 3;
  return 4;
}

function getBeliefStateMeta(value: number | null) {
  return beliefStates[getBeliefStateIndex(value)];
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function mix(start: number, end: number, progress: number) {
  return start + (end - start) * progress;
}

function createLeafPath(length: number, height: number, direction: 1 | -1) {
  return `M0 0 C ${direction * length * 0.2} ${-height * 0.08} ${
    direction * length * 0.7
  } ${-height * 0.34} ${direction * length} ${-height} C ${
    direction * length * 0.78
  } ${-height * 1.02} ${direction * length * 0.18} ${-height * 0.82} 0 0 Z`;
}

function createLeafVeinPath(length: number, height: number, direction: 1 | -1) {
  return `M1 -1 C ${direction * length * 0.18} ${-height * 0.1} ${
    direction * length * 0.48
  } ${-height * 0.3} ${direction * length * 0.8} ${-height * 0.8}`;
}

// Legacy fallback retained intentionally while the stepped video version is active.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function PlantGrowthIllustration({ value }: { value: number }) {
  const progress = clamp(value / 100, 0, 1);
  const stemBaseX = 160;
  const stemBaseY = 268;
  const stemHeight = mix(62, 162, progress);
  const stemTopX = mix(156, 168, progress);
  const stemTopY = stemBaseY - stemHeight;
  const stemMidX = mix(150, 164, progress);
  const stemMidY = mix(222, 176, progress);
  const crownGrowth = clamp((progress - 0.72) / 0.28, 0, 1);

  const getStemPoint = (position: number) => {
    const y = mix(stemBaseY - 6, stemTopY, position);
    const sway =
      Math.sin(position * Math.PI) * (stemTopX - stemBaseX) * 0.9 +
      Math.sin(position * Math.PI * 1.8) * 4;
    const x = mix(stemBaseX, stemTopX, position) + sway;

    return { x, y };
  };

  const stemPath = `M${stemBaseX} ${stemBaseY} C ${mix(
    153,
    156,
    progress
  )} ${mix(240, 228, progress)}, ${stemMidX} ${stemMidY}, ${stemTopX} ${stemTopY}`;

  return (
    <div className="relative mx-auto flex h-[248px] w-full max-w-[280px] items-end justify-center sm:h-[292px] sm:max-w-[320px] md:h-[330px] md:max-w-[360px]">
      <motion.div
        className="absolute bottom-10 h-40 w-40 rounded-full bg-[#16a34a]/16 blur-[60px] sm:h-48 sm:w-48"
        animate={{
          scale: [mix(0.84, 1.02, progress), mix(0.92, 1.08, progress), mix(0.84, 1.02, progress)],
          opacity: [mix(0.18, 0.24, progress), mix(0.26, 0.42, progress), mix(0.18, 0.24, progress)],
        }}
        transition={{
          duration: 4.2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      <motion.svg
        viewBox="0 0 320 320"
        className="relative h-full w-full overflow-visible"
        animate={{ rotate: [-1.2, 1.4, -1.2] }}
        transition={{
          duration: 6,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        <defs>
          <linearGradient id="beliefStemGradient" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#6ee7b7" />
            <stop offset="100%" stopColor="#bbf7d0" />
          </linearGradient>
          <linearGradient id="beliefLeafGradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#16a34a" />
            <stop offset="58%" stopColor="#4ade80" />
            <stop offset="100%" stopColor="#a7f3d0" />
          </linearGradient>
          <linearGradient id="beliefLeafShadeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.22)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
          <radialGradient id="beliefGroundGlow" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="rgba(34,197,94,0.26)" />
            <stop offset="100%" stopColor="rgba(34,197,94,0)" />
          </radialGradient>
        </defs>

        <ellipse cx="160" cy="272" rx="94" ry="16" fill="rgba(0,0,0,0.16)" />
        <ellipse cx="160" cy="256" rx="108" ry="70" fill="url(#beliefGroundGlow)" />
        <path
          d="M98 276 C 122 260, 198 260, 222 276"
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="26"
          strokeLinecap="round"
        />
        <path
          d="M98 276 C 122 260, 198 260, 222 276"
          fill="none"
          stroke="rgba(6,16,13,0.85)"
          strokeWidth="22"
          strokeLinecap="round"
        />

        <motion.path
          d={stemPath}
          fill="none"
          stroke="rgba(187,247,208,0.16)"
          strokeWidth="14"
          strokeLinecap="round"
          animate={{ d: stemPath }}
          transition={{ duration: 0.38, ease: [0.23, 1, 0.32, 1] }}
        />
        <motion.path
          d={stemPath}
          fill="none"
          stroke="url(#beliefStemGradient)"
          strokeWidth="10"
          strokeLinecap="round"
          animate={{ d: stemPath }}
          transition={{ duration: 0.38, ease: [0.23, 1, 0.32, 1] }}
        />

        {beliefPlantLeaves.map((leaf) => {
          const growth = clamp((progress - leaf.threshold) / 0.18, 0, 1);
          const direction = leaf.side === "left" ? -1 : 1;
          const point = getStemPoint(leaf.position);
          const branchX = point.x + direction * mix(6, 18, growth);
          const branchY = point.y - mix(4, 14, growth);
          const rotate = mix(leaf.startRotate, leaf.endRotate, growth);
          const scale = mix(0.2, leaf.scale, growth);
          const opacity = mix(0.02, 1, growth);
          const branchPath = `M${point.x} ${point.y} Q ${
            point.x + direction * 8
          } ${point.y - mix(6, 12, growth)} ${branchX} ${branchY}`;

          return (
            <g key={leaf.id}>
              <motion.path
                d={branchPath}
                fill="none"
                stroke="rgba(110,231,183,0.62)"
                strokeWidth="3.2"
                strokeLinecap="round"
                animate={{ d: branchPath, opacity: opacity * 0.88 }}
                transition={{ duration: 0.34, ease: [0.23, 1, 0.32, 1] }}
              />
              <g transform={`translate(${branchX} ${branchY})`}>
                <motion.g
                  animate={{
                    opacity,
                    scale,
                    rotate,
                    x: mix(direction * 10, 0, growth),
                    y: mix(10, 0, growth),
                  }}
                  transition={{ duration: 0.34, ease: [0.23, 1, 0.32, 1] }}
                  style={{ transformOrigin: "0px 0px" }}
                >
                  <path
                    d={createLeafPath(leaf.length, leaf.height, direction)}
                    fill="url(#beliefLeafGradient)"
                  />
                  <path
                    d={createLeafPath(leaf.length * 0.8, leaf.height * 0.72, direction)}
                    fill="url(#beliefLeafShadeGradient)"
                    opacity="0.42"
                    transform={`translate(${direction * leaf.length * 0.04} ${-leaf.height * 0.08})`}
                  />
                  <path
                    d={createLeafVeinPath(leaf.length, leaf.height, direction)}
                    fill="none"
                    stroke="rgba(236,253,245,0.34)"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </motion.g>
              </g>
            </g>
          );
        })}

        <g transform={`translate(${stemTopX} ${stemTopY})`}>
          <motion.g
            animate={{
              opacity: mix(0.06, 1, crownGrowth),
              scale: mix(0.34, 1, crownGrowth),
              y: mix(12, 0, crownGrowth),
            }}
            transition={{ duration: 0.34, ease: [0.23, 1, 0.32, 1] }}
            style={{ transformOrigin: "0px 0px" }}
          >
            <g transform="rotate(-136)">
              <path d={createLeafPath(42, 28, 1)} fill="url(#beliefLeafGradient)" />
              <path
                d={createLeafVeinPath(42, 28, 1)}
                fill="none"
                stroke="rgba(236,253,245,0.34)"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </g>
            <g transform="rotate(-26)">
              <path d={createLeafPath(46, 30, 1)} fill="url(#beliefLeafGradient)" />
              <path
                d={createLeafVeinPath(46, 30, 1)}
                fill="none"
                stroke="rgba(236,253,245,0.34)"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </g>
          </motion.g>
        </g>
      </motion.svg>
    </div>
  );
}

function preloadBeliefVideo() {
  if (typeof window === "undefined") {
    return;
  }

  const existing = document.querySelector<HTMLVideoElement>(
    'video[data-belief-preload="true"]'
  );

  if (existing) {
    existing.load();
    return;
  }

  const video = document.createElement("video");
  video.src = beliefVideoSrc;
  video.preload = "auto";
  video.muted = true;
  video.playsInline = true;
  video.crossOrigin = "anonymous";
  video.setAttribute("data-belief-preload", "true");
  video.style.position = "absolute";
  video.style.width = "1px";
  video.style.height = "1px";
  video.style.opacity = "0";
  video.style.pointerEvents = "none";
  video.style.left = "-9999px";
  video.style.top = "-9999px";
  document.body.appendChild(video);
  video.load();
}

function BeliefGrowthVideo({ value }: { value: number | null }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const currentTargetRef = useRef(0);
  const [isReady, setIsReady] = useState(false);
  const beliefStep = getBeliefStateIndex(value);
  const targetProgress = [0, 0.2, 0.4, 0.6, 0.8][beliefStep] ?? 0;

  useEffect(() => {
    preloadBeliefVideo();
  }, []);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    const stopAnimation = () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };

    const settleAtTarget = () => {
      if (!video.duration || Number.isNaN(video.duration)) {
        return;
      }

      stopAnimation();
      const targetTime = video.duration * currentTargetRef.current;
      const direction = targetTime >= video.currentTime ? 1 : -1;

      const tick = () => {
        const distance = targetTime - video.currentTime;

        if (Math.abs(distance) < 0.035) {
          video.pause();
          video.currentTime = targetTime;
          stopAnimation();
          return;
        }

        video.currentTime += distance * 0.16 + direction * 0.012;
        animationFrameRef.current = requestAnimationFrame(tick);
      };

      animationFrameRef.current = requestAnimationFrame(tick);
    };

    const handleReady = () => {
      setIsReady(true);
      video.pause();
      settleAtTarget();
    };

    if (video.readyState >= 1) {
      handleReady();
    } else {
      video.addEventListener("loadedmetadata", handleReady, { once: true });
      video.load();
    }

    return () => {
      stopAnimation();
      video.removeEventListener("loadedmetadata", handleReady);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;

    if (!video || !isReady || !video.duration || Number.isNaN(video.duration)) {
      currentTargetRef.current = targetProgress;
      return;
    }

    currentTargetRef.current = targetProgress;

    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    const targetTime = video.duration * targetProgress;
    const direction = targetTime >= video.currentTime ? 1 : -1;

    const tick = () => {
      const distance = targetTime - video.currentTime;

      if (Math.abs(distance) < 0.035) {
        video.pause();
        video.currentTime = targetTime;
        animationFrameRef.current = null;
        return;
      }

      video.currentTime += distance * 0.16 + direction * 0.012;
      animationFrameRef.current = requestAnimationFrame(tick);
    };

    animationFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [isReady, targetProgress]);

  return (
    <div className="relative mx-auto h-[248px] w-full max-w-[280px] overflow-hidden rounded-[1.35rem] border border-white/8 bg-[radial-gradient(circle_at_50%_68%,rgba(34,197,94,0.12),transparent_44%),linear-gradient(180deg,rgba(7,16,13,0.16),rgba(7,16,13,0.02))] sm:h-[292px] sm:max-w-[320px] sm:rounded-[1.8rem] md:h-[330px] md:max-w-[360px]">
      <motion.div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_70%,rgba(74,222,128,0.12),transparent_38%)]"
        animate={{ opacity: [0.6, 0.95, 0.6] }}
        transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
      <video
        ref={videoRef}
        src={beliefVideoSrc}
        preload="auto"
        muted
        playsInline
        crossOrigin="anonymous"
        className="h-full w-full object-cover"
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24"
        style={{
          background:
            "linear-gradient(180deg, rgba(8,17,15,0) 0%, rgba(8,17,15,0.16) 38%, rgba(8,17,15,0.42) 100%)",
        }}
      />
      <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/18 to-transparent" />
      <div className="pointer-events-none absolute left-1/2 top-4 h-20 w-20 -translate-x-1/2 rounded-full bg-[#22c55e]/8 blur-[42px] sm:top-6 sm:h-24 sm:w-24" />
    </div>
  );
}

const screenDetails: Record<
  Exclude<ScreenId, "done">,
  { pillar: string; signal: string; helper: string }
> = {
  welcome: {
    pillar: "Pulse setup",
    signal: "A warmer opening improves completion and honesty.",
    helper: "This demo sets the emotional tone before any question appears.",
  },
  belonging: {
    pillar: "Culture",
    signal: "Belonging is a leading indicator of trust, advocacy, and retention.",
    helper: "Quick emotional read, not a rational overthink.",
  },
  workload: {
    pillar: "Performance",
    signal: "Workload pressure explains delivery drag before outcomes visibly slip.",
    helper: "The visual should feel sensed, not calculated.",
  },
  manager: {
    pillar: "Performance",
    signal: "Manager friction often separates healthy pressure from avoidable burnout.",
    helper: "Keep the choice clear and emotionally safe.",
  },
  belief: {
    pillar: "Sustainability",
    signal: "Belief predicts whether ESG programs feel real or performative.",
    helper: "Use growth as the metaphor, not generic sliders.",
  },
  friction: {
    pillar: "Sustainability",
    signal: "Friction tells you why participation is failing, not just that it is.",
    helper: "This is the moment where blockers become operationally useful.",
  },
  voice: {
    pillar: "Open signal",
    signal: "Free text gives leaders the language behind the metrics.",
    helper: "This should feel spacious and welcome voice naturally.",
  },
};

function clampScreen(index: number) {
  return Math.max(0, Math.min(index, screens.length - 1));
}

function ProgressBar({ currentIndex }: { currentIndex: number }) {
  const progress = (currentIndex / (screens.length - 1)) * 100;

  return (
    <div className="flex items-center gap-4">
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/12">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-[#efe8db] via-[#16a34a] to-[#fbbf24]"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
        />
      </div>
      <p className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/50 sm:text-xs sm:tracking-[0.22em]">
        {currentIndex}/{screens.length - 1}
      </p>
    </div>
  );
}

function FloatingParticles() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {[...Array(10)].map((_, index) => (
        <motion.span
          key={index}
          className="absolute rounded-full bg-white/10"
          style={{
            width: 6 + (index % 4) * 6,
            height: 6 + (index % 4) * 6,
            left: `${8 + index * 9}%`,
            top: `${12 + (index % 5) * 14}%`,
          }}
          animate={{
            y: [-6, 12, -4],
            x: [0, 8, -6],
            opacity: [0.25, 0.6, 0.28],
          }}
          transition={{
            duration: 8 + index,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

export default function SurveyDemoExperience() {
  const searchParams = useSearchParams();
  const isEmbedded = searchParams.get("embed") === "1";
  const [screenIndex, setScreenIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>(initialAnswers);
  const [isRecording, setIsRecording] = useState(false);
  const [isCompactMobile, setIsCompactMobile] = useState(false);
  const [frameScale, setFrameScale] = useState(1);
  const [showFullscreenPrompt, setShowFullscreenPrompt] = useState(false);
  const recognitionRef = useRef<InstanceType<RecognitionCtor> | null>(null);

  const currentScreen = screens[screenIndex];
  const canGoBack = screenIndex > 0 && currentScreen !== "done";
  const canGoForward = useMemo(() => {
    switch (currentScreen) {
      case "welcome":
        return true;
      case "belonging":
        return answers.belonging !== null;
      case "workload":
        return answers.workload !== null;
      case "manager":
        return answers.manager !== null;
      case "belief":
        return answers.belief !== null;
      case "friction":
        return answers.friction.length > 0;
      case "voice":
        return answers.voice.trim().length > 0;
      case "done":
        return true;
      default:
        return false;
    }
  }, [answers, currentScreen]);

  useEffect(() => {
    if (isEmbedded) {
      return;
    }

    const updateScale = () => {
      const availableWidth = window.innerWidth - 32;
      const availableHeight = window.innerHeight - 32;
      const nextScale = Math.min(
        availableWidth / surveyPreviewWidth,
        availableHeight / surveyPreviewHeight
      );

      setFrameScale(Math.max(nextScale, 0.32));
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [isEmbedded]);

  useEffect(() => {
    if (isEmbedded) {
      return;
    }

    const syncPrompt = () => {
      setShowFullscreenPrompt(!document.fullscreenElement);
    };

    syncPrompt();
    document.addEventListener("fullscreenchange", syncPrompt);
    return () => document.removeEventListener("fullscreenchange", syncPrompt);
  }, [isEmbedded]);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  useEffect(() => {
    const updateViewport = () => {
      setIsCompactMobile(window.innerWidth <= 390);
    };

    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  useEffect(() => {
    preloadBeliefVideo();
  }, []);

  const setAnswer = <K extends keyof Answers>(key: K, value: Answers[K]) => {
    setAnswers((current) => ({ ...current, [key]: value }));
  };

  const next = () => {
    setScreenIndex((current) => clampScreen(current + 1));
  };

  const back = () => {
    setScreenIndex((current) => clampScreen(current - 1));
  };

  const toggleFriction = (option: string) => {
    setAnswers((current) => {
      const exists = current.friction.includes(option);

      return {
        ...current,
        friction: exists
          ? current.friction.filter((item) => item !== option)
          : [...current.friction, option],
      };
    });
  };

  const toggleRecording = () => {
    const recognitionApi =
      typeof window !== "undefined"
        ? (window as Window & {
            webkitSpeechRecognition?: RecognitionCtor;
            SpeechRecognition?: RecognitionCtor;
          }).webkitSpeechRecognition ||
          (window as Window & { SpeechRecognition?: RecognitionCtor }).SpeechRecognition
        : undefined;

    if (!recognitionApi) {
      setAnswers((current) => ({
        ...current,
        voice:
          current.voice ||
          "Recognition is falling in Product because planning shifts keep interrupting deep work mid-week.",
      }));
      return;
    }

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }

    const recognition = new recognitionApi();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join(" ");

      setAnswers((current) => ({
        ...current,
        voice: transcript.trim(),
      }));
    };

    recognition.onerror = () => {
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
    recognitionRef.current = recognition;
    setIsRecording(true);
  };

  const summary = useMemo(() => {
    const cultureTone = answers.belonging
      ? ["fragile", "warming", "steady", "strong", "thriving"][answers.belonging - 1]
      : "unknown";
    const performanceTone =
      answers.workload !== null ? getWorkloadState(answers.workload).label : "unknown";
    const sustainabilityTone =
      answers.belief !== null
        ? ["skeptical", "unconvinced", "open-minded", "engaged", "fully bought in"][
            getBeliefStateIndex(answers.belief)
          ]
        : "unknown";

    return { cultureTone, performanceTone, sustainabilityTone };
  }, [answers.belief, answers.belonging, answers.workload]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight" && canGoForward && currentScreen !== "done") {
        next();
      }

      if (event.key === "ArrowLeft" && canGoBack) {
        back();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [canGoBack, canGoForward, currentScreen]);

  const currentDetails =
    currentScreen === "done" ? null : screenDetails[currentScreen];

  const requestFullscreenMode = async () => {
    if (typeof document === "undefined") {
      return;
    }

    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      }

      const orientationApi = screen.orientation as ScreenOrientation & {
        lock?: (orientation: "portrait" | "landscape") => Promise<void>;
      };

      if (orientationApi?.lock) {
        await orientationApi.lock("portrait").catch(() => undefined);
      }

      setShowFullscreenPrompt(false);
    } catch {
      setShowFullscreenPrompt(false);
    }
  };

  if (!isEmbedded) {
    return (
      <div className="flex min-h-[100dvh] w-full items-center justify-center overflow-hidden bg-[#050a0a] p-4">
        <div
          className="relative overflow-hidden border border-white/8 bg-[#08110f] shadow-[0_60px_180px_-60px_rgba(0,0,0,0.9)]"
          style={{
            width: surveyPreviewWidth * frameScale,
            height: surveyPreviewHeight * frameScale,
          }}
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <div className="pointer-events-none absolute left-1/2 top-3 z-10 h-1.5 w-20 -translate-x-1/2 rounded-full bg-white/10" />
          <iframe
            src="/survey/demo?embed=1"
            title="Survey demo preview"
            className="block origin-top-left border-0"
            style={{
              width: surveyPreviewWidth,
              height: surveyPreviewHeight,
              transform: `scale(${frameScale})`,
            }}
          />
          <AnimatePresence>
            {showFullscreenPrompt ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-30 flex items-center justify-center bg-[#050a0a]/78 p-5 backdrop-blur-xl"
              >
                <motion.div
                  initial={{ opacity: 0, y: 18, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 12, scale: 0.98 }}
                  transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
                  className="w-full max-w-[18rem] rounded-[1.9rem] border border-white/10 bg-[linear-gradient(180deg,rgba(16,24,22,0.96),rgba(8,17,15,0.96))] p-5 text-center shadow-[0_30px_90px_-32px_rgba(0,0,0,0.92)]"
                >
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-400/12 ring-1 ring-emerald-200/10">
                    <div className="h-8 w-8 rounded-[0.9rem] border border-emerald-200/20 bg-[linear-gradient(180deg,rgba(110,231,183,0.22),rgba(74,222,128,0.08))]" />
                  </div>
                  <p className="mt-4 text-[1.2rem] font-semibold tracking-[-0.05em] text-[#f7f1e7]">
                    Go fullscreen
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white/58">
                    For the cleanest phone preview, open this survey in fullscreen.
                    We&apos;ll also try to keep it in portrait mode.
                  </p>
                  <div className="mt-5 flex flex-col gap-2.5">
                    <button
                      type="button"
                      onClick={requestFullscreenMode}
                      className="inline-flex items-center justify-center rounded-full bg-[#f3eee5] px-5 py-3 text-sm font-semibold text-[#08100f] transition-transform active:scale-[0.98]"
                    >
                      OK, go fullscreen
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowFullscreenPrompt(false)}
                      className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white/70 transition-colors hover:bg-white/8"
                    >
                      Not now
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[100dvh] overflow-x-hidden overflow-y-auto bg-[#0b1010] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.24),_transparent_28%),radial-gradient(circle_at_80%_16%,_rgba(251,191,36,0.14),_transparent_18%),radial-gradient(circle_at_50%_120%,_rgba(110,231,183,0.12),_transparent_40%),linear-gradient(180deg,_#08100f_0%,_#0a1211_52%,_#07100f_100%)]" />
      {!isCompactMobile ? <FloatingParticles /> : null}
      <div className="pointer-events-none absolute left-[-10%] top-[18%] hidden h-72 w-72 rounded-full bg-[#16a34a]/10 blur-[120px] md:block" />
      <div className="pointer-events-none absolute right-[-8%] top-[48%] hidden h-80 w-80 rounded-full bg-[#f59e0b]/10 blur-[140px] md:block" />

      <div className="relative mx-auto flex min-h-[100dvh] w-full max-w-[440px] flex-col px-3 py-2 sm:max-w-[520px] sm:px-4 md:max-w-7xl md:px-6 lg:px-10">
        <header className="hidden items-center justify-between rounded-[1.35rem] border border-white/8 bg-white/5 px-3 py-3 backdrop-blur-xl sm:rounded-[1.75rem] sm:px-5 md:flex">
          <BrandLogo
            logoHeightClassName="h-7 sm:h-8"
            textClassName="text-[1.08rem] tracking-[-0.04em] text-white sm:text-[1.3rem]"
          />
          <div className="hidden items-center gap-3 sm:flex">
            <span className="rounded-full bg-white/8 px-3 py-1.5 text-xs font-semibold text-white/75">
              Monthly Pulse
            </span>
            <span className="rounded-full bg-emerald-400/12 px-3 py-1.5 text-xs font-semibold text-emerald-200">
              Anonymous · 2 minutes
            </span>
          </div>
        </header>

        <div className="mt-0.5 flex min-h-0 flex-1 flex-col pb-25 md:mt-4 md:pb-0">
          <div className="mb-2 px-1 pt-[calc(env(safe-area-inset-top)+0.15rem)] sm:mb-4 sm:px-0">
            <div className="grid gap-4 md:rounded-[1.6rem] md:border md:border-white/8 md:bg-white/5 md:px-6 md:py-4 md:backdrop-blur-xl lg:grid-cols-[minmax(0,1fr)_320px] lg:items-center">
              <ProgressBar currentIndex={screenIndex} />
              {currentDetails ? (
                <div className="hidden rounded-[1.2rem] bg-black/14 px-4 py-3 lg:block">
                  <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/46">
                    <Dot className="h-4 w-4 text-emerald-300" />
                    {currentDetails.pillar}
                  </div>
                  <p className="mt-2 text-sm font-medium text-[#f7f1e7]">
                    {currentDetails.signal}
                  </p>
                </div>
              ) : (
                <div className="hidden lg:block" />
              )}
            </div>
          </div>

          <div className="relative flex flex-1 items-start justify-center md:items-center">
            <AnimatePresence mode="wait">
              <motion.section
                key={currentScreen}
                initial={{ opacity: 0, y: isCompactMobile ? 8 : 18, scale: 1 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: isCompactMobile ? -6 : -14, scale: 1 }}
                transition={{
                  duration: isCompactMobile ? 0.16 : 0.28,
                  ease: [0.23, 1, 0.32, 1],
                }}
                className="w-full"
              >
                {currentScreen === "welcome" ? (
                  <WelcomeScreen onBegin={next} />
                ) : null}

                {currentScreen === "belonging" ? (
                  <BelongingScreen
                    value={answers.belonging}
                    onChange={(value) => setAnswer("belonging", value)}
                  />
                ) : null}

                {currentScreen === "workload" ? (
                  <WorkloadScreen
                    value={answers.workload}
                    onChange={(value) => setAnswer("workload", value)}
                  />
                ) : null}

                {currentScreen === "manager" ? (
                  <ManagerScreen
                    value={answers.manager}
                    onChange={(value) => setAnswer("manager", value)}
                  />
                ) : null}

                {currentScreen === "belief" ? (
                  <BeliefScreen
                    value={answers.belief}
                    onChange={(value) => setAnswer("belief", value)}
                  />
                ) : null}

                {currentScreen === "friction" ? (
                  <FrictionScreen
                    value={answers.friction}
                    onToggle={toggleFriction}
                  />
                ) : null}

                {currentScreen === "voice" ? (
                  <VoiceScreen
                    value={answers.voice}
                    onChange={(value) => setAnswer("voice", value)}
                    isRecording={isRecording}
                    onToggleRecording={toggleRecording}
                  />
                ) : null}

                {currentScreen === "done" ? (
                  <DoneScreen summary={summary} answers={answers} />
                ) : null}
              </motion.section>
            </AnimatePresence>
          </div>

          {currentDetails ? null : null}

          {currentScreen !== "welcome" && currentScreen !== "done" ? (
            <div className="fixed inset-x-0 bottom-0 z-30 px-3 pb-[calc(env(safe-area-inset-bottom)+0.65rem)] md:static md:mt-6 md:px-0 md:pb-0">
              <div className="mx-auto flex w-full max-w-[440px] items-center justify-between gap-3 rounded-[1.25rem] border border-white/8 bg-[#08110ff2] px-3 py-2.5 sm:max-w-[520px] sm:rounded-[1.7rem] sm:px-4 md:max-w-none md:backdrop-blur-2xl">
                <button
                  type="button"
                  onClick={back}
                  disabled={!canGoBack}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white/85 transition-transform active:scale-[0.98] sm:flex-none sm:px-5 md:backdrop-blur-xl disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={next}
                  disabled={!canGoForward}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#16a34a] px-5 py-2.5 text-sm font-semibold text-white transition-transform active:scale-[0.98] sm:flex-none sm:px-6 disabled:cursor-not-allowed disabled:bg-[#2a5644] disabled:text-white/50"
                >
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function ScreenShell({
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
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 md:gap-7.5 lg:grid lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-start lg:gap-9">
      <div className="max-w-[42rem] flex-1 space-y-2.5 lg:sticky lg:top-8 lg:space-y-5.5">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#d5d0c7]/58">
          {eyebrow}
        </p>
        <h1 className="max-w-[14ch] text-[2.5rem] leading-[0.98] font-semibold tracking-[-0.07em] text-[#f7f1e7] sm:text-[2.95rem] md:text-[3.85rem] lg:text-[4.45rem]">
          {title}
        </h1>
        <p className="max-w-[34rem] text-[12px] leading-[1.15rem] text-white/58 sm:text-[13.5px] sm:leading-[1.35rem] md:text-lg md:leading-8">
          {description}
        </p>
        <div className="hidden max-w-md rounded-[1.6rem] border border-white/8 bg-white/4 p-4 text-sm leading-7 text-white/52 lg:block">
          Beautiful survey design is not about adding more UI. It is about
          making each answer feel inevitable, expressive, and easy to give.
        </div>
      </div>

      <div className="flex-1">{children}</div>
    </div>
  );
}

function WelcomeScreen({ onBegin }: { onBegin: () => void }) {
  return (
    <div className="mx-auto flex min-h-[calc(100dvh-7.8rem)] w-full max-w-5xl flex-col justify-between px-3 sm:px-4 md:px-0">
      <div className="grid gap-5 md:gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
        <div className="flex min-h-[52dvh] flex-col justify-center">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#d5d0c7]/65">
            Workenvo Monthly Pulse
          </p>
          <h1 className="mt-4 max-w-[11ch] text-[2.8rem] leading-[0.915] font-semibold tracking-[-0.07em] text-[#f7f1e7] sm:text-[3.35rem] md:text-[4.35rem] lg:text-[5.1rem]">
            Hey Alex, this&apos;ll take about 2 minutes.
          </h1>
          <p className="mt-4 max-w-xl text-[14px] leading-6 text-white/68 sm:mt-6 sm:text-lg sm:leading-8">
            This is designed to feel like a live check-in, not a boring form.
            Your answers feed the culture, performance, and sustainability
            signals leadership actually uses to act.
          </p>

          <div className="mt-5 flex flex-wrap gap-2 sm:mt-8 sm:gap-3">
            {[
              "Anonymous by default",
              "7 screens after this",
              "Used for real decisions",
            ].map((item) => (
              <span
                key={item}
                className="rounded-full bg-white/8 px-3 py-1.5 text-xs font-medium text-white/78 sm:px-4 sm:py-2 sm:text-sm"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="hidden gap-3 sm:grid-cols-3 lg:grid">
          {[
            {
              title: "Culture",
              body: "Belonging, trust, and whether people feel at home in the team.",
            },
            {
              title: "Performance",
              body: "Workload, manager impact, and whether execution still feels healthy.",
            },
            {
              title: "Sustainability",
              body: "Belief, friction, and what blocks real participation in better habits.",
            },
          ].map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + index * 0.08 }}
              className="rounded-[1.6rem] border border-white/8 bg-[#101716]/75 p-4 backdrop-blur-xl sm:rounded-[2rem] sm:p-5"
            >
              <p className="text-sm font-semibold text-[#f7f1e7]">{card.title}</p>
              <p className="mt-2 text-sm leading-7 text-white/60">{card.body}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="pt-5">
        <button
          type="button"
          onClick={onBegin}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#f3eee5] px-6 py-4 text-sm font-semibold text-[#08100f] transition-transform active:scale-[0.98] sm:w-auto sm:min-w-[220px]"
        >
          Start the pulse
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function BelongingScreen({
  value,
  onChange,
}: {
  value: number | null;
  onChange: (value: number) => void;
}) {
  return (
    <ScreenShell
      eyebrow="Culture · Belonging"
      title="Do you feel like you truly belong in your team right now?"
      description="The selection should feel emotional, not clinical. We want a quick gut answer here, because belonging is usually felt before it is articulated."
    >
      <div className="flex min-h-[calc(100dvh-22rem)] flex-col justify-between gap-3 sm:min-h-0 sm:gap-6">
        <div className="rounded-[2rem] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.04))] p-4 backdrop-blur-2xl sm:rounded-[2.8rem] sm:p-6 md:p-8">
          <div className="flex min-h-[220px] flex-col items-center justify-center sm:min-h-[360px]">
            <motion.div
              key={value ?? 0}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.26, ease: [0.23, 1, 0.32, 1] }}
              className="relative flex flex-col items-center"
            >
              <div className="absolute -inset-12 rounded-full bg-[#fbbf24]/12 blur-[48px]" />
              <div
                className="relative flex h-30 w-30 items-center justify-center rounded-[2.2rem] text-[3.6rem] shadow-[0_42px_120px_-42px_rgba(251,191,36,0.6)] sm:h-40 sm:w-40 sm:rounded-[3rem] sm:text-[4.7rem] md:h-46 md:w-46 md:text-[5.2rem]"
                style={{
                  background:
                    value !== null
                      ? "linear-gradient(180deg,#ffd46b 0%, #ffb800 100%)"
                      : "linear-gradient(180deg,rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 100%)",
                }}
              >
                <span>{value !== null ? belongingFaces[value - 1].emoji : "🙂"}</span>
              </div>
              <div className="mt-3 text-center text-[2.35rem] font-medium tracking-[-0.065em] text-[#f7f1e7] sm:mt-8 sm:text-4xl md:text-5xl">
                {value ? belongingFaces[value - 1].label : "How does it feel?"}
              </div>
              <p className="mt-2 max-w-[17rem] text-center text-[13px] leading-5 text-white/54 sm:max-w-sm sm:text-sm sm:leading-7">
                {value
                  ? "Trust the immediate answer. It is usually the right one."
                  : "Choose the face that matches your real feeling today."}
              </p>
            </motion.div>
          </div>
        </div>

        <div className="mx-auto mb-1 w-full max-w-[360px] rounded-[2rem] border border-white/8 bg-white/5 px-3 py-2.5 shadow-2xl backdrop-blur-2xl sm:max-w-[400px] sm:rounded-[2.4rem] sm:px-3.5 sm:py-3">
          <div className="grid grid-cols-5 place-items-center gap-1.5 sm:gap-2">
            {belongingFaces.map((face, index) => {
              const selected = value === index + 1;

              return (
                <button
                  key={face.label}
                  type="button"
                  onClick={() => onChange(index + 1)}
                  className="group relative flex h-14 w-full items-center justify-center rounded-[1.2rem] px-1 py-1 sm:h-16 sm:rounded-[1.4rem]"
                >
                  <motion.div
                    animate={{
                      scale: selected ? 1.55 : 1,
                      y: 0,
                      opacity: selected ? 1 : 0.45,
                    }}
                    whileHover={{ scale: selected ? 1.55 : 1.15 }}
                    transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
                    className="relative z-10 flex items-center justify-center text-[1.45rem] sm:text-[1.7rem]"
                  >
                    {face.emoji}
                  </motion.div>
                  {selected ? (
                    <motion.div
                      layoutId="belonging-selector"
                      className="absolute inset-0 rounded-[1.2rem] border sm:rounded-[1.4rem]"
                      style={{
                        backgroundColor: "rgba(255, 255, 255, 0.08)",
                        borderColor: `${face.glow}88`,
                        boxShadow: `0 16px 40px -16px ${face.glow}66, inset 0 1px 1px rgba(255,255,255,0.1)`,
                      }}
                      transition={{ type: "spring", duration: 0.5, bounce: 0.22 }}
                    />
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </ScreenShell>
  );
}

function WorkloadScreen({
  value,
  onChange,
}: {
  value: number | null;
  onChange: (value: number) => void;
}) {
  const sliderValue = value ?? 50;
  const current = getWorkloadState(sliderValue);
  const fillPercent = Math.max(12, sliderValue);

  return (
    <ScreenShell
      eyebrow="Performance · Workload"
      title="How full is your plate this week?"
      description="This one should feel alive. Instead of asking people to translate pressure into abstract numbers, we let them feel the state in a visual object."
    >
      <div className="rounded-[2rem] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.04))] p-3.5 backdrop-blur-2xl sm:rounded-[2.8rem] sm:p-6 md:p-8">
        <div className="mx-auto grid max-w-3xl gap-4 sm:gap-8 lg:grid-cols-[220px_1fr] lg:items-center">
          <div className="relative mx-auto h-[184px] w-[118px] overflow-hidden rounded-b-[2.4rem] rounded-t-[1.35rem] border border-white/16 bg-white/5 sm:h-[280px] sm:w-[180px] sm:rounded-b-[3.4rem] sm:rounded-t-[2rem] md:h-[300px] md:w-[190px] md:rounded-b-[3.7rem] md:rounded-t-[2.1rem]">
            <motion.div
              className="absolute inset-x-0 bottom-0"
              animate={{
                height: `${fillPercent}%`,
                background:
                  sliderValue <= 60
                    ? `linear-gradient(180deg, ${current.color}cc 0%, ${current.color} 100%)`
                    : `linear-gradient(180deg, ${current.color}ee 0%, #7c2d12 100%)`,
              }}
              transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
              style={{
                borderTopLeftRadius: "28px",
                borderTopRightRadius: "28px",
                boxShadow: `0 0 48px -14px ${current.color}`,
              }}
            >
              <motion.div
                animate={{
                  y: [0, -8, 0],
                  opacity: [0.5, 0.85, 0.5],
                }}
                transition={{
                  duration: sliderValue >= 75 ? 1.3 : 2.4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
                className="absolute inset-x-0 top-0 h-5 bg-white/28 blur-[2px]"
              />
            </motion.div>
          </div>

          <div>
            <div className="rounded-[1.2rem] bg-black/14 p-3.5 sm:rounded-[1.8rem] sm:p-5">
              <p className="text-[1.75rem] font-medium tracking-[-0.05em] text-[#f7f1e7] sm:text-3xl">
                {current.label}
              </p>
              <p className="mt-2 text-[13px] leading-5 text-white/62 sm:text-sm sm:leading-7">
                {current.description}
              </p>
            </div>

            <div className="mt-3 rounded-[1.35rem] bg-black/14 px-4 py-3.5 sm:mt-6 sm:rounded-[1.8rem] sm:px-5 sm:py-4">
              <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.2em] text-white/36">
                <span>Calm</span>
                <span>Overloaded</span>
              </div>
              <div className="relative mt-3">
                <div className="h-2.5 w-full rounded-full bg-white/10" />
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full"
                  animate={{
                    width: `${sliderValue}%`,
                    background: `linear-gradient(90deg, #d8f7e8 0%, ${current.color} 68%, ${
                      sliderValue >= 75 ? "#f59e0b" : current.color
                    } 100%)`,
                    boxShadow: `0 8px 26px -10px ${current.color}`,
                  }}
                  transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
                />
                <motion.div
                  className="pointer-events-none absolute top-1/2 h-6 w-6 -translate-y-1/2 rounded-full border border-white/70 bg-[#f7f1e7] shadow-[0_12px_32px_-12px_rgba(0,0,0,0.65)] sm:h-7 sm:w-7"
                  animate={{ left: `calc(${sliderValue}% - 12px)` }}
                  transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
                />
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={sliderValue}
                  onChange={(event) => onChange(Number(event.target.value))}
                  className="absolute inset-0 h-6 w-full cursor-pointer opacity-0 sm:h-7"
                  aria-label="Workload slider"
                />
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-[10px] uppercase tracking-[0.16em] text-white/38 sm:mt-5 sm:text-xs sm:tracking-[0.2em]">
              <span>Calm</span>
              <span>At capacity</span>
              <span>Overloaded</span>
            </div>
          </div>
        </div>
      </div>
    </ScreenShell>
  );
}

function ManagerScreen({
  value,
  onChange,
}: {
  value: Answers["manager"];
  onChange: (value: NonNullable<Answers["manager"]>) => void;
}) {
  return (
    <ScreenShell
      eyebrow="Performance · Manager Impact"
      title="Does your manager make it easier to do your best work?"
      description="This is a calm judgment question. The interaction should still feel beautiful, but the tone should stay composed so the answer feels safe to give."
    >
      <div className="grid grid-cols-2 gap-2.5">
        {managerCards.map((card) => {
          const selected = value === card.value;

          return (
            <motion.button
              key={card.value}
              type="button"
              onClick={() => onChange(card.value)}
              whileTap={{ scale: 0.98 }}
              animate={{
                borderColor: selected ? `${card.accent}` : "rgba(255,255,255,0.08)",
                backgroundColor: selected ? `${card.accent}20` : "rgba(255,255,255,0.05)",
                y: selected ? -4 : 0,
                boxShadow: selected
                  ? `0 30px 80px -40px ${card.accent}`
                  : "0 0 0 0 transparent",
              }}
              className="rounded-[1.2rem] border p-3 text-left backdrop-blur-xl sm:rounded-[2.1rem] sm:p-6"
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="text-[1.45rem] font-semibold sm:text-3xl"
                  style={{ color: selected ? "#f7f1e7" : card.accent }}
                >
                  {card.icon}
                </span>
                <h3 className="text-[1.05rem] font-semibold tracking-[-0.04em] text-[#f7f1e7] sm:text-2xl">
                  {card.title}
                </h3>
              </div>
              <p className="mt-3 text-[12px] leading-[1.15rem] text-white/58 sm:mt-3 sm:text-sm sm:leading-7">
                {card.body}
              </p>
            </motion.button>
          );
        })}
      </div>
    </ScreenShell>
  );
}

function BeliefScreen({
  value,
  onChange,
}: {
  value: number | null;
  onChange: (value: number) => void;
}) {
  const sliderValue = value ?? 50;
  const current = getBeliefStateMeta(sliderValue);

  return (
    <ScreenShell
      eyebrow="Sustainability · Belief"
      title="Do you think our sustainability efforts actually make a real difference?"
      description="This step should feel unexpectedly tactile. The more conviction rises, the more the visual comes alive, so the answer feels embodied instead of administrative."
    >
      <div className="rounded-[2rem] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.04))] p-4 backdrop-blur-2xl sm:rounded-[2.8rem] sm:p-6 md:p-8">
        <div className="grid gap-5 sm:gap-8 lg:grid-cols-[0.96fr_1.04fr] lg:items-center">
          <div className="relative overflow-hidden rounded-[1.8rem] border border-white/7 bg-[radial-gradient(circle_at_50%_72%,rgba(22,163,74,0.16),transparent_42%),linear-gradient(180deg,rgba(7,16,13,0.5),rgba(7,16,13,0.18))] px-3 py-4 sm:rounded-[2.3rem] sm:px-5 sm:py-5">
            <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/18 to-transparent" />
            {/* Legacy fallback kept on purpose:
            <PlantGrowthIllustration value={sliderValue} />
            */}
            <BeliefGrowthVideo value={value} />
          </div>

          <div className="space-y-3.5 sm:space-y-5">
            <div className="rounded-[1.45rem] bg-black/14 px-4 py-4 sm:rounded-[1.8rem] sm:px-5 sm:py-5">
              <p className="text-[1.95rem] font-medium tracking-[-0.06em] text-[#f7f1e7] sm:text-[2.35rem]">
                {current.label}
              </p>
              <p className="mt-2 text-[13px] leading-6 text-white/60 sm:text-sm sm:leading-7">
                {current.description}
              </p>
            </div>
            <div className="rounded-[1.5rem] bg-black/14 px-4 py-4 sm:rounded-[1.8rem] sm:px-5">
              <div className="relative">
                <div className="h-3 w-full rounded-full bg-white/10 shadow-[inset_0_1px_2px_rgba(255,255,255,0.05)]" />
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full"
                  animate={{
                    width: `${sliderValue}%`,
                    background:
                      "linear-gradient(90deg, rgba(34,197,94,0.85) 0%, #4ade80 56%, #86efac 100%)",
                    boxShadow: "0 10px 30px -12px rgba(34,197,94,0.9)",
                  }}
                  transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
                />
                <motion.div
                  className="pointer-events-none absolute top-1/2 h-7 w-7 -translate-y-1/2 rounded-full border border-white/80 bg-[#f7f1e7] shadow-[0_14px_34px_-12px_rgba(0,0,0,0.65)] ring-4 ring-[#f7f1e7]/8"
                  animate={{ left: `calc(${sliderValue}% - 14px)` }}
                  transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
                />
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={sliderValue}
                  onChange={(event) => onChange(Number(event.target.value))}
                  className="absolute inset-0 h-7 w-full cursor-pointer opacity-0"
                  aria-label="Sustainability belief slider"
                />
              </div>
              <div className="mt-4 flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-white/38 sm:text-xs sm:tracking-[0.2em]">
                <span>Doubtful</span>
                <span>Strong belief</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ScreenShell>
  );
}

function FrictionScreen({
  value,
  onToggle,
}: {
  value: string[];
  onToggle: (option: string) => void;
}) {
  return (
    <ScreenShell
      eyebrow="Sustainability · Friction"
      title="What gets in the way of joining sustainability initiatives?"
      description="This is multi-select, but it still needs rhythm. The options should arrive with a soft stagger so the screen feels composed and alive, not dumped onto the page."
    >
      <div className="rounded-[2rem] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.04))] p-4 backdrop-blur-2xl sm:rounded-[2.8rem] sm:p-6 md:p-8">
        <div className="mb-4 flex items-center justify-between rounded-[1.2rem] bg-black/14 px-4 py-3 sm:mb-5 sm:rounded-[1.5rem]">
          <p className="max-w-[12rem] text-sm leading-6 text-white/66 sm:max-w-none">Select every blocker that feels true.</p>
          <span className="rounded-full bg-white/8 px-3 py-1 text-xs font-semibold text-white/70">
            {value.length} selected
          </span>
        </div>
        <div className="flex flex-wrap gap-2.5 sm:gap-3">
          {frictionOptions.map((option, index) => {
            const selected = value.includes(option);

            return (
              <motion.button
                key={option}
                type="button"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onToggle(option)}
                className={
                  selected
                    ? "rounded-full bg-[#16a34a] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_24px_60px_-28px_rgba(22,163,74,0.9)] sm:px-5 sm:py-3"
                    : "rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/74 backdrop-blur-xl transition-colors hover:bg-white/8 sm:px-5 sm:py-3"
                }
              >
                {option}
              </motion.button>
            );
          })}
        </div>
      </div>
    </ScreenShell>
  );
}

function VoiceScreen({
  value,
  onChange,
  isRecording,
  onToggleRecording,
}: {
  value: string;
  onChange: (value: string) => void;
  isRecording: boolean;
  onToggleRecording: () => void;
}) {
  return (
    <ScreenShell
      eyebrow="Open Signal · Voice"
      title="What’s one thing we could change to make your week better?"
      description="This is the emotional release valve. The input should feel spacious, supportive, and slightly alive, with voice capture sitting there as a natural option rather than a gimmick."
    >
      <div className="rounded-[2rem] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.04))] p-4 backdrop-blur-2xl sm:rounded-[2.8rem] sm:p-6 md:p-8">
        <div className="relative">
          <textarea
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="Write freely. This is the part people remember."
            className="h-52 w-full resize-none rounded-[1.5rem] border border-white/10 bg-[#08110f]/70 px-4 py-4 pr-4 pb-18 text-base leading-7 text-[#f7f1e7] outline-none placeholder:text-white/28 sm:h-56 sm:rounded-[2rem] sm:px-6 sm:py-5 sm:pr-6 sm:pb-20 sm:text-lg sm:leading-8"
          />
          <button
            type="button"
            onClick={onToggleRecording}
            className={
              isRecording
                ? "absolute right-3 bottom-3 inline-flex items-center justify-center gap-3 rounded-full bg-[#ef4444] px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_42px_-18px_rgba(239,68,68,0.9)] sm:right-5 sm:bottom-5 sm:px-5"
                : "absolute right-3 bottom-3 inline-flex items-center justify-center gap-3 rounded-full bg-white/8 px-3.5 py-3 text-sm font-semibold text-white/85 backdrop-blur-xl sm:right-5 sm:bottom-5 sm:px-4"
            }
            aria-label={isRecording ? "Stop recording" : "Use voice input"}
          >
            <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white/16">
              {isRecording ? (
                <>
                  <motion.span
                    className="absolute h-full w-full rounded-full bg-white/20"
                    animate={{ scale: [1, 1.45, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 1.4, repeat: Number.POSITIVE_INFINITY }}
                  />
                  <Mic className="relative h-4 w-4" />
                </>
              ) : (
                <MicOff className="h-4 w-4" />
              )}
            </span>
            <span>{isRecording ? "Recording" : "Voice"}</span>
          </button>
        </div>
      </div>
    </ScreenShell>
  );
}

function DoneScreen({
  summary,
  answers,
}: {
  summary: {
    cultureTone: string;
    performanceTone: string;
    sustainabilityTone: string;
  };
  answers: Answers;
}) {
  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="rounded-[2rem] border border-white/8 bg-white/6 p-5 text-center backdrop-blur-2xl sm:rounded-[2.8rem] sm:p-8 md:p-12">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-white/10 bg-white/5 sm:h-32 sm:w-32">
          <motion.div
            initial={{ rotate: -90, pathLength: 0 }}
            animate={{ rotate: 0, pathLength: 1 }}
            transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
            className="relative flex h-20 w-20 items-center justify-center sm:h-24 sm:w-24"
          >
            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full -rotate-90">
              <circle cx="50" cy="50" r="42" stroke="rgba(255,255,255,0.12)" strokeWidth="8" fill="none" />
              <motion.circle
                cx="50"
                cy="50"
                r="42"
                stroke="#4ade80"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.15, ease: [0.23, 1, 0.32, 1] }}
                style={{ pathLength: 1 }}
              />
            </svg>
            <motion.div
              initial={{ opacity: 0, scale: 0.82 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.28 }}
              className="rounded-full bg-[#16a34a] p-2.5 sm:p-3"
            >
              <Check className="h-6 w-6 text-white sm:h-8 sm:w-8" />
            </motion.div>
          </motion.div>
        </div>

        <h1 className="mt-6 text-[2.55rem] leading-[0.915] font-semibold tracking-[-0.067em] text-[#f7f1e7] sm:mt-8 sm:text-[3.45rem]">
          Your pulse is in.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-7 text-white/64 sm:text-lg sm:leading-8">
          We&apos;ll act on this. The goal is not to collect answers and admire
          them. It&apos;s to turn what people are actually feeling into better
          decisions across culture, performance, and sustainability.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:mt-8 sm:gap-3">
          <span className="rounded-full bg-white/8 px-3 py-1.5 text-xs font-semibold text-white/80 sm:px-4 sm:py-2 sm:text-sm">
            Culture feels {summary.cultureTone}
          </span>
          <span className="rounded-full bg-white/8 px-3 py-1.5 text-xs font-semibold text-white/80 sm:px-4 sm:py-2 sm:text-sm">
            Performance feels {summary.performanceTone.toLowerCase()}
          </span>
          <span className="rounded-full bg-white/8 px-3 py-1.5 text-xs font-semibold text-white/80 sm:px-4 sm:py-2 sm:text-sm">
            Sustainability belief is {summary.sustainabilityTone}
          </span>
        </div>

        <div className="mt-8 grid gap-3 text-left sm:mt-10 sm:gap-4 sm:grid-cols-3">
          <div className="rounded-[1.4rem] bg-[#0f1716] p-4 sm:rounded-[1.8rem] sm:p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/40">
              Culture signal
            </p>
            <p className="mt-3 text-sm leading-6 text-white/70 sm:text-base sm:leading-7">
              Belonging landed at{" "}
              <span className="font-semibold text-[#f7f1e7]">
                {answers.belonging ?? "—"}/5
              </span>
              , which will influence the culture health story this month.
            </p>
          </div>
          <div className="rounded-[1.4rem] bg-[#0f1716] p-4 sm:rounded-[1.8rem] sm:p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/40">
              Performance signal
            </p>
            <p className="mt-3 text-sm leading-6 text-white/70 sm:text-base sm:leading-7">
              Workload and manager support create a sharper explanation for what
              pressure feels like on the ground.
            </p>
          </div>
          <div className="rounded-[1.4rem] bg-[#0f1716] p-4 sm:rounded-[1.8rem] sm:p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/40">
              Sustainability signal
            </p>
            <p className="mt-3 text-sm leading-6 text-white/70 sm:text-base sm:leading-7">
              We now know both your belief level and the friction that blocks
              participation, which is what makes action possible.
            </p>
          </div>
        </div>

        <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-400/12 px-4 py-2 text-sm font-medium text-emerald-200 sm:mt-8">
          <Sparkles className="h-4 w-4" />
          Private by design. Useful by default.
        </div>
      </div>
    </div>
  );
}
