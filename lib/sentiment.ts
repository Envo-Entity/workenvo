/**
 * Simplified VADER-inspired lexicon sentiment scorer.
 * Designed for short workplace text (Slack messages, survey comments).
 *
 * Reference: Hutto, C.J. & Gilbert, E.E. (2014). VADER: A Parsimonious
 * Rule-based Model for Sentiment Analysis of Social Media Text. ICWSM.
 * https://ojs.aaai.org/index.php/ICWSM/article/view/14550
 */

// Core sentiment lexicon — valence scores in [-4, 4]
// Curated for workplace/professional text
const LEXICON: Record<string, number> = {
  // Strong positive
  excellent: 3.4, outstanding: 3.3, amazing: 3.4, fantastic: 3.4, wonderful: 3.4,
  brilliant: 3.2, superb: 3.2, exceptional: 3.2, thrilled: 3.1, ecstatic: 3.3,
  love: 3.0, loving: 3.0, great: 3.1, awesome: 3.2, perfect: 3.4,

  // Moderate positive
  good: 1.9, nice: 1.8, happy: 2.7, glad: 2.1, pleased: 2.1, enjoy: 2.0,
  helpful: 2.1, support: 1.5, supported: 2.0, motivated: 2.4, excited: 2.5,
  clear: 1.5, productive: 2.0, efficient: 1.8, collaborative: 2.0, engaged: 2.1,
  appreciate: 2.3, appreciated: 2.4, thankful: 2.0, grateful: 2.4, positive: 1.9,
  energized: 2.3, inspired: 2.5, confident: 2.0, comfortable: 1.7, valued: 2.5,
  recognized: 2.2, celebrate: 2.4, celebrating: 2.3, progress: 1.8, improve: 1.6,
  improved: 1.8, success: 2.1, successful: 2.2, win: 2.0, winning: 2.1,
  easy: 1.5, fun: 2.3, rewarding: 2.4, proud: 2.6, proactive: 1.8,

  // Mild positive
  ok: 0.9, okay: 0.9, fine: 0.6, decent: 1.3, reasonable: 1.0, manageable: 1.2,
  stable: 0.8, steady: 0.8, consistent: 1.0, adequate: 0.7, useful: 1.5,

  // Strong negative (workplace)
  burnout: -3.1, burned: -2.5, exhausted: -2.9, overwhelmed: -2.8, stressed: -2.5,
  anxiety: -2.9, anxious: -2.5, horrible: -3.3, terrible: -3.2, awful: -3.0,
  toxic: -3.1, nightmare: -3.0, crisis: -2.7, disaster: -3.0, catastrophe: -3.2,
  quit: -2.0, quitting: -2.2, leaving: -1.8, resign: -2.3, resigning: -2.4,
  hate: -3.2, hating: -3.0, unbearable: -3.1, unsustainable: -2.8, broken: -2.4,

  // Moderate negative
  frustrated: -2.4, frustrating: -2.4, frustration: -2.3, annoyed: -2.0,
  annoying: -2.1, difficult: -1.4, struggling: -2.0, struggle: -1.8,
  worried: -2.0, concern: -1.5, concerned: -1.7, problem: -1.6,
  problems: -1.7, issue: -1.2, issues: -1.3, blocked: -1.8, stuck: -1.6,
  confused: -1.7, unclear: -1.8, overwhelming: -2.5, overloaded: -2.6,
  pressure: -1.8, overwork: -2.3, overtime: -1.5, deadline: -1.2, deadlines: -1.4,
  behind: -1.3, delayed: -1.4, missed: -1.5, unhappy: -2.3, disappointed: -2.2,
  disappointing: -2.2, waste: -1.8, wasted: -1.7, slow: -1.0, inefficient: -1.8,
  disconnected: -1.9, isolated: -2.1, lonely: -2.4, ignored: -2.3, micromanaged: -2.5,
  undervalued: -2.4, underpaid: -2.0, unfair: -2.1, lack: -1.3, missing: -1.2,

  // Mild negative
  hard: -0.8, tired: -1.6, bad: -1.7, poor: -1.7, wrong: -1.4, boring: -1.7,
  tedious: -1.6, repetitive: -1.0, chaotic: -2.0, messy: -1.4,
};

// Emoji sentiment scores
const EMOJI_SCORES: Record<string, number> = {
  "😀": 2.0, "😃": 2.2, "😄": 2.3, "😁": 2.3, "😊": 2.0, "🙂": 1.5,
  "😍": 3.0, "🥰": 3.0, "😎": 1.8, "🤩": 2.8, "🥳": 2.5, "🎉": 2.5,
  "👍": 1.8, "👏": 2.2, "🙌": 2.5, "💪": 1.8, "✅": 1.5, "🔥": 1.8,
  "❤️": 2.5, "💚": 2.0, "💙": 1.8, "⭐": 1.8, "🌟": 2.0, "✨": 1.8,
  "😔": -2.0, "😢": -2.5, "😭": -2.8, "😤": -2.0, "😠": -2.5, "😡": -2.8,
  "😞": -2.2, "😟": -2.0, "😩": -2.5, "😫": -2.8, "🥺": -1.8, "😰": -2.3,
  "😱": -2.5, "💔": -2.8, "👎": -2.0, "🚫": -1.5, "❌": -1.5, "⚠️": -1.0,
};

// Negation words — flip sentiment of following word
const NEGATIONS = new Set([
  "not", "no", "never", "neither", "nowhere", "nothing", "nobody",
  "cannot", "can't", "won't", "don't", "doesn't", "didn't", "isn't",
  "wasn't", "aren't", "weren't", "haven't", "hasn't", "hadn't",
  "barely", "hardly", "scarcely", "without",
]);

// Boosters increase/decrease magnitude
const BOOSTERS: Record<string, number> = {
  very: 0.293, really: 0.293, extremely: 0.733, incredibly: 0.733,
  absolutely: 0.733, completely: 0.733, totally: 0.293, quite: 0.193,
  slightly: -0.293, somewhat: -0.293, little: -0.293, bit: -0.163,
  kinda: -0.163, rather: 0.193,
};

export type SentimentResult = {
  compound: number;    // normalized score: -1.0 to +1.0
  positive: number;    // proportion of positive sentiment
  negative: number;    // proportion of negative sentiment
  neutral: number;     // proportion of neutral
  label: "positive" | "negative" | "neutral";
};

function normalize(score: number, n: number): number {
  // VADER normalization: score / sqrt(score^2 + alpha), alpha=15
  const alpha = 15;
  return score / Math.sqrt(score * score + alpha * n);
}

export function analyzeSentiment(text: string): SentimentResult {
  if (!text || text.trim().length === 0) {
    return { compound: 0, positive: 0, negative: 0, neutral: 1, label: "neutral" };
  }

  const scores: number[] = [];

  // Check emojis first
  for (const [emoji, score] of Object.entries(EMOJI_SCORES)) {
    const count = (text.split(emoji).length - 1);
    for (let i = 0; i < count; i++) scores.push(score);
  }

  // Tokenize text
  const tokens = text.toLowerCase()
    .replace(/[^\w\s']/g, " ")
    .split(/\s+/)
    .filter(Boolean);

  let allCaps = false;
  const upperCount = tokens.filter(t => t === t.toUpperCase() && t.length > 1).length;
  if (upperCount > tokens.length * 0.5 && tokens.length > 1) allCaps = true;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    let valence = LEXICON[token] ?? 0;
    if (valence === 0) continue;

    // Booster from previous word
    if (i > 0) {
      const prev = tokens[i - 1];
      const boostAmount = BOOSTERS[prev];
      if (boostAmount !== undefined) {
        valence += valence > 0 ? boostAmount : -boostAmount;
      }
    }

    // Negation — check 3 words back
    for (let j = Math.max(0, i - 3); j < i; j++) {
      if (NEGATIONS.has(tokens[j])) {
        valence *= -0.74;
        break;
      }
    }

    // All-caps amplifier
    if (allCaps) {
      valence += valence > 0 ? 0.733 : -0.733;
    }

    scores.push(valence);
  }

  // Exclamation marks boost positive sentiment
  const exclamations = (text.match(/!/g) ?? []).length;
  if (exclamations > 0 && scores.some(s => s > 0)) {
    scores.push(Math.min(exclamations * 0.292, 0.876));
  }

  if (scores.length === 0) {
    return { compound: 0, positive: 0, negative: 0, neutral: 1, label: "neutral" };
  }

  const posSum = scores.filter(s => s > 0).reduce((a, b) => a + b, 0);
  const negSum = Math.abs(scores.filter(s => s < 0).reduce((a, b) => a + b, 0));
  const total = posSum + negSum;

  const compound = normalize(scores.reduce((a, b) => a + b, 0), scores.length);

  const pos = total > 0 ? posSum / total : 0;
  const neg = total > 0 ? negSum / total : 0;
  const neu = 1 - pos - neg;

  const label: SentimentResult["label"] =
    compound >= 0.05 ? "positive" : compound <= -0.05 ? "negative" : "neutral";

  return {
    compound: Math.round(compound * 10000) / 10000,
    positive: Math.round(pos * 10000) / 10000,
    negative: Math.round(neg * 10000) / 10000,
    neutral: Math.round(Math.max(0, neu) * 10000) / 10000,
    label,
  };
}

export type AggregatedSentiment = {
  positive_pct: number;
  negative_pct: number;
  neutral_pct: number;
  avg_compound: number;
};

export function aggregateSentiment(texts: string[]): AggregatedSentiment {
  if (texts.length === 0) {
    return { positive_pct: 0, negative_pct: 0, neutral_pct: 1, avg_compound: 0 };
  }

  const results = texts.map(analyzeSentiment);
  const pos = results.filter(r => r.label === "positive").length / results.length;
  const neg = results.filter(r => r.label === "negative").length / results.length;
  const neu = results.filter(r => r.label === "neutral").length / results.length;
  const avgCompound = results.reduce((a, b) => a + b.compound, 0) / results.length;

  return {
    positive_pct: Math.round(pos * 10000) / 10000,
    negative_pct: Math.round(neg * 10000) / 10000,
    neutral_pct: Math.round(neu * 10000) / 10000,
    avg_compound: Math.round(avgCompound * 10000) / 10000,
  };
}
