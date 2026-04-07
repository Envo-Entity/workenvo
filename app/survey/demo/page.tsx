import type { Metadata } from "next";
import SurveyDemoExperience from "./survey-demo-experience";

export const metadata: Metadata = {
  title: "Workenvo | Monthly Pulse Demo",
  description:
    "An interactive Workenvo survey demo designed to make monthly pulse collection feel conversational, alive, and genuinely useful.",
};

export default function SurveyDemoPage() {
  return <SurveyDemoExperience />;
}
