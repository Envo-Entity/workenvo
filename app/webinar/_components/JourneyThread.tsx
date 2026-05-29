"use client";

import { useEffect, useState } from "react";

const chapters = [
  { id: "hero",     label: "The Signal",        num: "01" },
  { id: "speakers", label: "Your Hosts",         num: "02" },
  { id: "problem",  label: "The Problem",        num: "03" },
  { id: "learn",    label: "What You'll Learn",  num: "04" },
  { id: "audience", label: "Who It's For",       num: "05" },
  { id: "why",      label: "Why It Matters",     num: "06" },
];

export function JourneyThread() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const update = () => {
      let next = 0;
      for (let i = 0; i < chapters.length; i++) {
        const el = document.getElementById(chapters[i].id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= window.innerHeight * 0.55) {
          next = i;
        }
      }
      setActive(next);
    };

    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className="fixed left-7 top-1/2 -translate-y-1/2 z-50 hidden xl:block"
      aria-label="Chapter navigation"
    >
      <div className="relative flex flex-col">
        {chapters.map((ch, i) => (
          <div key={ch.id} className="relative flex items-center">
            {/* Connector line between dots */}
            {i < chapters.length - 1 && (
              <div
                className="absolute left-[4px] top-[22px] w-px bg-webinar-wire/50"
                style={{ height: "calc(100% + 4px)", minHeight: "32px" }}
              >
                <div
                  className="w-full bg-webinar-accent origin-top transition-[transform] duration-500 ease-out"
                  style={{
                    height: "100%",
                    transform: `scaleY(${i < active ? 1 : 0})`,
                  }}
                />
              </div>
            )}

            <button
              onClick={() => scrollTo(ch.id)}
              className="group relative z-10 flex items-center gap-3 py-[14px]"
              aria-current={i === active ? "step" : undefined}
            >
              {/* Dot */}
              <div
                className={`w-[9px] h-[9px] rounded-full border transition-all duration-300 flex-shrink-0 ${
                  i === active
                    ? "border-webinar-accent bg-webinar-accent [box-shadow:0_0_12px_rgba(22,133,91,0.5)]"
                    : i < active
                    ? "border-webinar-accent/50 bg-webinar-accent/25"
                    : "border-webinar-wire bg-transparent group-hover:border-webinar-wire/80"
                }`}
              />

              {/* Label — appears for active, reveals on hover for others */}
              <span
                className={`text-[10px] tracking-[0.16em] uppercase font-semibold whitespace-nowrap transition-all duration-200 ${
                  i === active
                    ? "opacity-100 text-webinar-ink translate-x-0"
                    : "opacity-0 -translate-x-1 group-hover:opacity-40 group-hover:translate-x-0 text-webinar-ink-dim"
                }`}
              >
                {ch.num} {ch.label}
              </span>
            </button>
          </div>
        ))}
      </div>
    </nav>
  );
}
