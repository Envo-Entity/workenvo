import type { Metadata } from "next";
import Nav from "@/components/landing/Nav";
import BookDemoForm from "@/components/book-demo/BookDemoForm";

export const metadata: Metadata = {
  title: "Book a Demo — Workenvo",
  description:
    "See how Workenvo helps you understand what's changing across your organisation before it becomes a problem.",
};

const POINTS = [
  {
    heading: "Understand your organisation in real time",
    body: "See exactly how culture, sentiment, and capability are shifting — before they become issues.",
  },
  {
    heading: "Tailored to your team size and sector",
    body: "Every demo is personalised. We'll walk through scenarios relevant to your organisation.",
  },
  {
    heading: "30 minutes. No pitch deck.",
    body: "Live platform, real data, and time for your questions. No slides, no fluff.",
  },
];

export default function BookDemoPage() {
  return (
    <>
      <Nav />
      <main
        style={{
          paddingTop: "72px",
          minHeight: "100vh",
          background: "linear-gradient(160deg, #F5F9F7 0%, #ECFDF5 60%, #F0FDF4 100%)",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

            {/* Left — value content */}
            <div className="lg:sticky lg:top-28">
              <p
                className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold mb-6"
                style={{
                  background: "#ECFDF5",
                  color: "#065F46",
                  border: "1px solid #A7F3D0",
                  fontFamily: "var(--font-sans)",
                }}
              >
                Book a demo
              </p>

              <h1
                className="mb-6 leading-tight"
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "clamp(36px, 5vw, 56px)",
                  color: "#111827",
                  fontWeight: 400,
                }}
              >
                See your organisation as it actually is.
              </h1>

              <p
                className="mb-12 text-lg leading-relaxed"
                style={{ color: "#6B7280", fontFamily: "var(--font-sans)", maxWidth: "420px" }}
              >
                Most leaders find out something&apos;s wrong months after it started. Workenvo gives you a continuous, real-time view of how your people are operating.
              </p>

              <div className="space-y-8">
                {POINTS.map((point, i) => (
                  <div key={i} className="flex gap-4">
                    <div
                      className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mt-0.5"
                      style={{ background: "#ECFDF5" }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16855B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <div>
                      <p
                        className="font-semibold mb-1"
                        style={{ color: "#111827", fontSize: "15px", fontFamily: "var(--font-sans)" }}
                      >
                        {point.heading}
                      </p>
                      <p style={{ color: "#6B7280", fontSize: "14px", lineHeight: "1.65", fontFamily: "var(--font-sans)" }}>
                        {point.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — form */}
            <div>
              <BookDemoForm />
            </div>

          </div>
        </div>
      </main>
    </>
  );
}
