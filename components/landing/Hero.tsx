"use client";

export default function Hero() {
  return (
    <section
      className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden"
      style={{ background: "#FFFFFF" }}
    >
      {/* Soft background tint */}
      <div className="absolute inset-0 dot-pattern pointer-events-none" />
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] orb float-orb pointer-events-none"
        style={{ background: "rgba(22, 133, 91, 0.07)" }}
      />
      <div
        className="absolute bottom-0 left-[10%] w-[400px] h-[400px] orb float-orb-2 pointer-events-none"
        style={{ background: "rgba(217, 119, 6, 0.05)" }}
      />

      <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text block */}
          <div className="max-w-2xl">
            {/* Eyebrow */}
            <div className="inline-flex items-center tag-green rounded-full px-4 py-1.5 mb-8 animate-fade-up">
              <span
                className="text-xs font-semibold tracking-wide"
                style={{ color: "#065F46" }}
              >
                Behaviour Intelligence Platform
              </span>
            </div>

            {/* Headline */}
            <h1
              className="text-5xl lg:text-[64px] leading-[1.08] tracking-tight mb-6 animate-fade-up delay-100"
              style={{
                fontFamily: "var(--font-serif)",
                color: "#111827",
                fontWeight: 400,
              }}
            >
              Turn{" "}
              <span className="wavy-underline" style={{ color: "#111827" }}>
                behaviour
              </span>{" "}
              into organisational capability
            </h1>

            {/* Subheadline */}
            <p
              className="text-lg leading-relaxed mb-4 animate-fade-up delay-200"
              style={{
                color: "#6B7280",
                fontFamily: "var(--font-sans)",
                maxWidth: "560px",
              }}
            >
              Most organisations invest in people, culture, and sustainability —
              but still discover problems too late. Workenvo helps you detect
              behavioural signals early, reinforce the right actions, and build
              the capabilities your organisation needs to perform and scale.
            </p>

            {/* Supporting line */}
            <p
              className="text-base font-medium mb-10 animate-fade-up delay-300"
              style={{
                color: "#16855B",
                fontFamily: "var(--font-sans)",
              }}
            >
              Not another HR system. A system for making strategy real.
            </p>

            {/* CTA Row */}
            <div className="flex flex-wrap items-center gap-4 animate-fade-up delay-400">
              <a
                href="#"
                className="btn-primary inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-base font-medium"
              >
                Book a demo
              </a>
              <a
                href="#"
                className="inline-flex items-center gap-2 text-base font-medium transition-colors duration-200 group"
                style={{ color: "#374151" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#16855B")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#374151")}
              >
                See how it works
                <span className="transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>
              </a>
            </div>

            {/* Social proof */}
            <div className="mt-12 flex items-center gap-6 animate-fade-up delay-500">
              <div className="flex -space-x-2">
                {["#16855B", "#0F6E50", "#1A9A6B", "#12785A"].map((c, i) => (
                  <div
                    key={i}
                    className="w-9 h-9 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-semibold"
                    style={{ background: c }}
                  >
                    {["A", "B", "C", "D"][i]}
                  </div>
                ))}
              </div>
              <p className="text-sm" style={{ color: "#6B7280" }}>
                Trusted by forward-thinking HR teams
              </p>
            </div>
          </div>

          {/* Right: Capability Loop Diagram */}
          <div className="hidden lg:flex items-center justify-center">
            <CapabilityDiagram />
          </div>
        </div>
      </div>
    </section>
  );
}

function CapabilityDiagram() {
  const nodes = [
    { label: "Define", angle: -90, emoji: "🎯" },
    { label: "Translate", angle: -18, emoji: "🔀" },
    { label: "Detect", angle: 54, emoji: "👁" },
    { label: "Reinforce", angle: 126, emoji: "💪" },
    { label: "Build & Prove", angle: 198, emoji: "📈" },
  ];

  const r = 140;

  return (
    <div className="relative w-[400px] h-[400px] flex items-center justify-center">
      {/* Outer ring */}
      <div
        className="absolute inset-0 rounded-full"
        style={{ border: "1.5px dashed #D1FAE5" }}
      />
      {/* Inner ring */}
      <div
        className="absolute rounded-full"
        style={{ inset: "40px", border: "1px solid #F3F4F6" }}
      />

      {/* Center */}
      <div
        className="absolute w-24 h-24 rounded-full flex items-center justify-center"
        style={{
          background: "#ECFDF5",
          border: "2px solid #A7F3D0",
          boxShadow: "0 4px 16px rgba(22, 133, 91, 0.12)",
        }}
      >
        <div className="text-center">
          <div className="text-2xl mb-0.5">🌿</div>
          <span
            className="text-[9px] font-semibold uppercase tracking-wider"
            style={{ color: "#065F46", fontFamily: "var(--font-sans)" }}
          >
            Workenvo
          </span>
        </div>
      </div>

      {/* Nodes */}
      {nodes.map((node) => {
        const rad = (node.angle * Math.PI) / 180;

        return (
          <div
            key={node.label}
            className="absolute flex flex-col items-center gap-1.5"
            style={{
              left: `calc(${50 + ((r * Math.cos(rad)) / 200) * 100}% - 48px)`,
              top: `calc(${50 + ((r * Math.sin(rad)) / 200) * 100}% - 38px)`,
              width: "96px",
            }}
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl soft-card lift-hover"
              style={{ cursor: "default" }}
            >
              {node.emoji}
            </div>
            <span
              className="text-center text-xs font-medium leading-tight"
              style={{
                color: "#374151",
                fontFamily: "var(--font-sans)",
              }}
            >
              {node.label}
            </span>
          </div>
        );
      })}

      {/* Connector lines */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 400 400"
      >
        {nodes.map((node, i) => {
          const nextNode = nodes[(i + 1) % nodes.length];
          const rad1 = (node.angle * Math.PI) / 180;
          const rad2 = (nextNode.angle * Math.PI) / 180;
          const x1 = 200 + r * Math.cos(rad1);
          const y1 = 200 + r * Math.sin(rad1);
          const x2 = 200 + r * Math.cos(rad2);
          const y2 = 200 + r * Math.sin(rad2);
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#D1FAE5"
              strokeWidth="1.5"
              strokeDasharray="5 4"
            />
          );
        })}
      </svg>
    </div>
  );
}
