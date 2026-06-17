import { GoogleGenAI } from "@google/genai";

const MODEL = "gemini-3.1-flash-lite";

export type AnalysisResult = {
  health_score: number;
  summary: string;
  risks: {
    name: string;
    severity: "low" | "medium" | "high";
    confidence: number;
    description: string;
  }[];
  recommendations: {
    action: string;
    priority: "low" | "medium" | "high";
  }[];
};

const responseSchema = {
  type: "object",
  properties: {
    health_score: { type: "integer", minimum: 0, maximum: 100 },
    summary: { type: "string" },
    risks: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          severity: { type: "string", enum: ["low", "medium", "high"] },
          confidence: { type: "number", minimum: 0, maximum: 1 },
          description: { type: "string" },
        },
        required: ["name", "severity", "confidence", "description"],
      },
    },
    recommendations: {
      type: "array",
      items: {
        type: "object",
        properties: {
          action: { type: "string" },
          priority: { type: "string", enum: ["low", "medium", "high"] },
        },
        required: ["action", "priority"],
      },
    },
  },
  required: ["health_score", "summary", "risks", "recommendations"],
};

const SURVEY_RESPONSES = [
  {
    respondent: "Alex",
    question: "Workload (1-5)",
    score: 3,
    comment: "Tight deadlines but manageable",
  },
  {
    respondent: "Jordan",
    question: "Workload (1-5)",
    score: 2,
    comment: "Overwhelmed with campaign volume",
  },
  {
    respondent: "Alex",
    question: "Manager support (1-5)",
    score: 4,
    comment: "Good support from management",
  },
  { respondent: "Jordan", question: "eNPS (0-10)", score: 6, comment: "" },
  {
    respondent: "Jordan",
    question: "Intent to stay (1-5)",
    score: 3,
    comment: "Not sure about the next 6 months",
  },
  {
    respondent: "Sam",
    question: "Workload (1-5)",
    score: 2,
    comment: "Too many competing priorities",
  },
  {
    respondent: "Sam",
    question: "Psychological safety (1-5)",
    score: 3,
    comment: "Sometimes hesitant to raise blockers",
  },
];

export async function analyzeTeam(
  teamName: string,
  messages: { username: string; text: string; ts: string }[],
): Promise<AnalysisResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set");

  const ai = new GoogleGenAI({ apiKey });

  const messageText = messages
    .map((m) => `[${m.username}]: ${m.text}`)
    .join("\n");

  const surveyText = SURVEY_RESPONSES.map(
    (s) =>
      `${s.respondent} — ${s.question}: ${s.score}${s.comment ? ` ("${s.comment}")` : ""}`,
  ).join("\n");

  const prompt = `You are an expert People Analytics AI. Analyze the following data for the ${teamName} team and return a structured workforce health assessment.

## Slack Messages (last 7 days)
${messageText || "(no messages found)"}

## Survey Responses
${surveyText}

## Instructions
- Assign an Organisation Health Score from 0 to 100 (0 = severe dysfunction, 100 = outstanding)
- Identify the top 3 risks with severity (low/medium/high) and confidence (0.0–1.0)
- Provide 3 concrete, actionable recommendations with priority
- Write a 2–3 sentence executive summary
- Base your analysis on communication patterns, sentiment, workload signals, collaboration quality, and survey data
- Be direct and specific — this is for HR/People teams who need early warning signals

Return JSON only.`;

  const result = await ai.models.generateContent({
    model: MODEL,
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    config: {
      temperature: 1,
      maxOutputTokens: 8192,
      candidateCount: 1,
      responseMimeType: "application/json",
      responseSchema,
    },
  });

  const finishReason = result.candidates?.[0]?.finishReason;
  if (
    finishReason &&
    finishReason !== "STOP" &&
    finishReason !== "MAX_TOKENS"
  ) {
    throw new Error(`Gemini response blocked. Reason: ${finishReason}`);
  }

  let responseText =
    result.text || result.candidates?.[0]?.content?.parts?.[0]?.text || "";

  if (!responseText) throw new Error("Gemini returned empty response");

  responseText = responseText.trim();
  if (responseText.startsWith("```json")) {
    responseText = responseText
      .replace(/^```json\n?/, "")
      .replace(/\n?```$/, "");
  } else if (responseText.startsWith("```")) {
    responseText = responseText.replace(/^```\n?/, "").replace(/\n?```$/, "");
  }

  return JSON.parse(responseText) as AnalysisResult;
}
