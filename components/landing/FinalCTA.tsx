"use client";

import ScrollReveal from "./ScrollReveal";

export default function FinalCTA() {
  return (
    <section
      className="relative py-40 px-6 flex items-center justify-center overflow-hidden section-divider"
      style={{
        background: "linear-gradient(135deg, #F5F9F7 0%, #ECFDF5 50%, #F0FDF4 100%)",
        minHeight: "70vh",
      }}
    >
      {/* Floating orbs */}
      <div
        className="absolute left-[10%] top-[15%] w-80 h-80 orb float-orb pointer-events-none"
        style={{ background: "rgba(22, 133, 91, 0.08)" }}
      />
      <div
        className="absolute right-[8%] bottom-[20%] w-64 h-64 orb float-orb-2 pointer-events-none"
        style={{ background: "rgba(217, 119, 6, 0.07)" }}
      />

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <ScrollReveal>
          <div className="inline-flex items-center tag-green rounded-full px-4 py-1.5 mb-8 text-xs font-semibold tracking-wide">
            Ready to get started?
          </div>
        </ScrollReveal>

        <ScrollReveal delay={80}>
          <h2
            className="text-5xl lg:text-7xl leading-tight mb-8"
            style={{
              fontFamily: "var(--font-serif)",
              color: "#111827",
              fontWeight: 400,
            }}
          >
            Stop reacting.
            <br />
            <span style={{ color: "#16855B" }}>Start seeing.</span>
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={150}>
          <p
            className="text-xl leading-relaxed mb-12 mx-auto"
            style={{
              color: "#6B7280",
              fontFamily: "var(--font-sans)",
              maxWidth: "560px",
            }}
          >
            Understand what&apos;s changing before it becomes a problem. Build
            the organisation you&apos;ll need in the future.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={250}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#"
              className="btn-primary inline-flex items-center gap-2 px-10 py-4 rounded-xl text-lg font-medium"
            >
              Book a demo
            </a>
            <a
              href="#"
              className="btn-ghost inline-flex items-center gap-2 px-10 py-4 rounded-xl text-lg font-medium"
            >
              Speak to an expert
            </a>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={350}>
          <p
            className="mt-10 text-sm"
            style={{ color: "#9CA3AF", fontFamily: "var(--font-sans)" }}
          >
            No credit card required · Free 30-day trial
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
