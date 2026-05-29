import { ScrollReveal } from "./ScrollReveal";

const capabilities = [
  "identify hidden workforce risks early",
  "improve employee experience continuously",
  "align culture with strategy",
  "support managers with better insight",
  "detect disengagement before it becomes turnover",
  "create environments where people perform sustainably",
];

export function Why() {
  return (
    <section
      id="why"
      className="relative py-32 md:py-44 px-6 overflow-hidden"
    >
      {/* Large top accent glow */}
      <div
        className="absolute top-0 inset-x-0 h-96 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(22,133,91,0.06), transparent 70%)",
        }}
      />

      {/* Watermark word */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        aria-hidden="true"
      >
        <span
          className="font-webinar-heading font-bold text-webinar-ink/[0.025] uppercase tracking-[0.2em]"
          style={{ fontSize: "clamp(5rem, 18vw, 22rem)" }}
        >
          HUMAN
        </span>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <ScrollReveal>
          <span className="webinar-chapter-label block mb-6">06 &mdash; Why It Matters</span>
        </ScrollReveal>

        {/* Large headline */}
        <ScrollReveal delay={80}>
          <h2
            className="font-webinar-heading font-normal text-webinar-ink max-w-4xl mb-12"
            style={{ fontSize: "clamp(2.2rem, 4vw + 0.5rem, 4.25rem)", lineHeight: 1.05, letterSpacing: "-0.02em" }}
          >
            AI Will Not Replace Human Leadership.
            <br />
            But It Will Change It Forever.
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          {/* Left: body copy + heatmap */}
          <div>
            <ScrollReveal delay={160}>
              <div className="space-y-5 text-webinar-ink-dim leading-[1.85]" style={{ fontSize: "clamp(0.95rem, 0.8vw + 0.4rem, 1.075rem)" }}>
                <p>
                  The future of high-performing organisations will not be built
                  purely on dashboards, targets, or automation. It will be built
                  on understanding people better.
                </p>
                <p>
                  The organisations that succeed over the next decade will be those
                  that invest in seeing clearly, earlier.
                </p>
              </div>
            </ScrollReveal>

            {/* Engagement heatmap */}
            <ScrollReveal delay={260}>
              <div className="mt-10 p-5 rounded-2xl border border-webinar-wire/50 bg-webinar-surface/50" aria-hidden="true">
                <p className="text-[9px] tracking-[0.16em] uppercase font-semibold text-webinar-ink-faint mb-4">
                  Engagement signal map — 7 weeks
                </p>
                <div className="flex gap-2 items-start">
                  {/* Row labels */}
                  <div className="flex flex-col gap-1.5 pt-0.5">
                    {["A","B","C","D","E"].map((t) => (
                      <span key={t} className="text-[9px] font-semibold text-webinar-ink-faint w-5 text-right leading-none" style={{ height: 16 }}>
                        {t}
                      </span>
                    ))}
                  </div>
                  {/* Grid */}
                  <div className="flex-1">
                    <div className="grid gap-1.5" style={{ gridTemplateColumns: "repeat(7, 1fr)" }}>
                      {[
                        [5,5,4,4,4,3,3],
                        [4,4,3,2,2,2,1],
                        [5,5,5,4,4,5,4],
                        [3,3,3,2,2,1,1],
                        [4,4,4,4,3,3,3],
                      ].flatMap((row, ri) =>
                        row.map((val, ci) => {
                          const color =
                            val === 5 ? "rgba(22,133,91,0.65)"
                            : val === 4 ? "rgba(22,133,91,0.32)"
                            : val === 3 ? "rgba(217,119,6,0.38)"
                            : val === 2 ? "rgba(217,119,6,0.62)"
                            : "rgba(239,68,68,0.55)";
                          return (
                            <div
                              key={`${ri}-${ci}`}
                              className="rounded-sm"
                              style={{ height: 16, backgroundColor: color }}
                            />
                          );
                        })
                      )}
                    </div>
                    {/* Week labels */}
                    <div className="grid mt-1.5 gap-1.5" style={{ gridTemplateColumns: "repeat(7, 1fr)" }}>
                      {["W1","W2","W3","W4","W5","W6","W7"].map((w) => (
                        <span key={w} className="text-[8px] text-center text-webinar-ink-faint font-medium">
                          {w}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Legend */}
                <div className="flex items-center gap-3 mt-4">
                  <span className="text-[8px] text-webinar-ink-faint tracking-wide">Low</span>
                  {["rgba(239,68,68,0.55)","rgba(217,119,6,0.62)","rgba(217,119,6,0.38)","rgba(22,133,91,0.32)","rgba(22,133,91,0.65)"].map((c,i) => (
                    <div key={i} className="w-4 h-2.5 rounded-sm" style={{ backgroundColor: c }} />
                  ))}
                  <span className="text-[8px] text-webinar-ink-faint tracking-wide">High</span>
                  <span className="ml-auto text-[8px] text-webinar-accent font-semibold tracking-wide">2 teams flagged</span>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right: capabilities list */}
          <div>
            <ScrollReveal delay={120}>
              <p className="text-xs tracking-[0.18em] uppercase font-semibold text-webinar-ink-faint mb-7">
                The organisations that succeed will be those that can
              </p>
            </ScrollReveal>

            <ul className="space-y-0" role="list">
              {capabilities.map((cap, i) => (
                <ScrollReveal key={cap} delay={160 + i * 110}>
                  <li className="group flex items-start gap-4 py-4 border-b border-webinar-wire/30 last:border-none cursor-default">
                    <span className="size-2 rounded-full bg-webinar-accent/60 flex-shrink-0 mt-[0.45rem] group-hover:bg-webinar-accent transition-colors duration-200" />
                    <span
                      className="text-webinar-ink-dim group-hover:text-webinar-ink transition-colors duration-200 leading-[1.6]"
                      style={{ fontSize: "clamp(0.95rem, 0.8vw + 0.3rem, 1.05rem)" }}
                    >
                      {cap}
                    </span>
                  </li>
                </ScrollReveal>
              ))}
            </ul>
          </div>
        </div>

        {/* Closing statement */}
        <ScrollReveal delay={160 + capabilities.length * 110 + 120}>
          <div className="mt-16 max-w-xl">
            <p
              className="font-webinar-heading font-normal text-webinar-ink"
              style={{ fontSize: "clamp(1.35rem, 2vw + 0.3rem, 2rem)", lineHeight: 1.2, letterSpacing: "-0.02em" }}
            >
              This is where AI becomes transformational.
            </p>
            <p className="mt-3 text-webinar-ink-dim text-lg">
              Not replacing people. Understanding them better.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
