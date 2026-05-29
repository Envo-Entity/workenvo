import { ScrollReveal } from "./ScrollReveal";

const cards = [
  {
    num: "01",
    title: "The Hidden Workforce Signals Leaders Miss",
    body: "Understand the behavioural patterns and workplace signals that often appear before disengagement, burnout, attrition, and performance decline.",
    accent: "text-webinar-accent",
  },
  {
    num: "02",
    title: "How AI Is Changing Performance Management",
    body: "Discover how AI can help organisations move from reactive HR processes to proactive workforce intelligence.",
    accent: "text-webinar-violet",
  },
  {
    num: "03",
    title: "The Disconnect Between Culture & Performance",
    body: "Learn why strategy often fails when culture, leadership behaviour, and employee experience become misaligned.",
    accent: "text-webinar-teal",
  },
  {
    num: "04",
    title: "Real-Time Workforce Intelligence",
    body: "Explore how organisations are beginning to use real-time employee insights instead of relying purely on annual surveys and outdated reporting cycles.",
    accent: "text-webinar-accent",
  },
  {
    num: "05",
    title: "Practical Use Cases",
    items: [
      "Performance management",
      "Engagement and wellbeing",
      "Leadership effectiveness",
      "Retention and workforce planning",
    ],
    accent: "text-webinar-gold",
  },
  {
    num: "06",
    title: "The Future of HR & Organisational Performance",
    body: "Understand what the next generation of HR, culture, and performance leadership will look like.",
    accent: "text-webinar-violet",
  },
];

export function Learn() {
  return (
    <section
      id="learn"
      className="relative py-32 md:py-40 px-6 overflow-hidden"
    >
      <div className="relative z-10 max-w-6xl mx-auto">
        <ScrollReveal>
          <span className="webinar-chapter-label block mb-6">04 &mdash; What You&apos;ll Learn</span>
        </ScrollReveal>

        <ScrollReveal delay={80}>
          <h2
            className="font-webinar-heading font-normal text-webinar-ink max-w-2xl mb-16"
            style={{ fontSize: "clamp(2rem, 3vw + 0.5rem, 3.25rem)", lineHeight: 1.05, letterSpacing: "-0.02em" }}
          >
            What This Webinar Will Cover
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-px bg-webinar-wire/30 rounded-2xl overflow-hidden border border-webinar-wire/30">
          {cards.map((card, i) => (
            <ScrollReveal key={card.num} delay={i * 80}>
              <div className="group bg-webinar-surface hover:bg-webinar-raised p-8 xl:p-10 h-full flex flex-col gap-5 transition-colors duration-300 cursor-default">
                {/* Number */}
                <span
                  className={`font-webinar-heading font-bold leading-none ${card.accent}`}
                  style={{ fontSize: "clamp(2.5rem, 3vw, 3.5rem)" }}
                  aria-hidden="true"
                >
                  {card.num}
                </span>

                {/* Title */}
                <h3 className="font-webinar-heading font-normal text-webinar-ink" style={{ fontSize: "clamp(1rem, 1vw + 0.4rem, 1.15rem)", lineHeight: 1.3, letterSpacing: "-0.02em" }}>
                  {card.title}
                </h3>

                {/* Body or list */}
                {card.body ? (
                  <p className="text-webinar-ink-dim leading-[1.75] text-[0.9375rem] mt-auto">
                    {card.body}
                  </p>
                ) : card.items ? (
                  <ul className="space-y-2 mt-auto" role="list">
                    {card.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-3 text-webinar-ink-dim text-[0.9375rem] leading-[1.6]"
                      >
                        <span className="size-1.5 rounded-full bg-webinar-gold flex-shrink-0 mt-[0.45rem]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
