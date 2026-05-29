import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Hidden Workforce Problems AI Is Finally Exposing - Workenvo Webinar",
  description:
    "Discover the invisible employee signals impacting performance, engagement, burnout, retention, and culture. Join Workenvo's live webinar on AI-driven workforce intelligence.",
  keywords: [
    "AI in HR",
    "AI workforce intelligence",
    "employee engagement AI",
    "future of performance management",
    "AI and workplace culture",
    "workforce analytics",
    "hidden workforce risks",
    "predictive workforce intelligence",
  ],
  openGraph: {
    title: "The Hidden Workforce Problems AI Is Finally Exposing",
    description:
      "A live webinar by Workenvo on AI-driven workforce intelligence and the hidden signals impacting your organisation.",
    type: "website",
  },
};

export default function WebinarLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="min-h-screen bg-webinar-page text-webinar-ink antialiased">
      {children}
    </section>
  );
}
