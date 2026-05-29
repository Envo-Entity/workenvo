"use client";

const W = 360, H = 220;

const SAFE = "#16855B";
const WARN = "#D97706";
const HIGH = "#EF4444";

type NodeDef = {
  id: string;
  x: number;
  y: number;
  r: number;
  fill: string;
  label?: string;
  risk?: "warn" | "high";
  riskLabel?: string;
  animDelay?: string;
};

const nodes: NodeDef[] = [
  { id: "ceo", x: 180, y: 28, r: 8, fill: SAFE },
  { id: "d1",  x: 60,  y: 104, r: 7, fill: SAFE, label: "Sales" },
  { id: "d2",  x: 180, y: 104, r: 7, fill: WARN, label: "Ops",
    risk: "warn", riskLabel: "Disengaged", animDelay: "0.5s" },
  { id: "d3",  x: 300, y: 104, r: 7, fill: SAFE, label: "Product" },
  { id: "e1",  x: 24,  y: 192, r: 5.5, fill: SAFE },
  { id: "e2",  x: 96,  y: 192, r: 5.5, fill: HIGH,
    risk: "high", riskLabel: "Burnout", animDelay: "0s" },
  { id: "e3",  x: 144, y: 192, r: 5.5, fill: SAFE },
  { id: "e4",  x: 216, y: 192, r: 5.5, fill: WARN,
    risk: "warn", riskLabel: "At risk", animDelay: "1s" },
  { id: "e5",  x: 264, y: 192, r: 5.5, fill: SAFE },
  { id: "e6",  x: 336, y: 192, r: 5.5, fill: SAFE },
];

const edges: [string, string][] = [
  ["ceo", "d1"], ["ceo", "d2"], ["ceo", "d3"],
  ["d1", "e1"],  ["d1", "e2"],
  ["d2", "e3"],  ["d2", "e4"],
  ["d3", "e5"],  ["d3", "e6"],
];

function nodeById(id: string): NodeDef {
  return nodes.find((n) => n.id === id)!;
}

export function OrgNetwork() {
  return (
    <div
      className="relative w-full max-w-[360px] select-none"
      aria-hidden="true"
    >
      {/* Signal count badge */}
      <div className="absolute -top-3 -right-1 z-10 flex items-center gap-1.5 bg-white border border-webinar-wire/60 rounded-full px-3 py-1 shadow-sm">
        <span className="size-1.5 rounded-full bg-webinar-accent animate-webinar-live-dot" />
        <span className="text-[9px] font-semibold tracking-wide text-webinar-ink-dim">
          3 signals detected
        </span>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        className="overflow-visible"
      >
        <defs>
          <linearGradient id="org-scan-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="25%" stopColor="rgba(22,133,91,0.22)" />
            <stop offset="75%" stopColor="rgba(22,133,91,0.22)" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>

        {/* Edges */}
        {edges.map(([fromId, toId]) => {
          const from = nodeById(fromId);
          const to = nodeById(toId);
          const isRiskEdge =
            (from.risk || to.risk) && !(from.risk === "warn" && !to.risk);
          return (
            <line
              key={`${fromId}-${toId}`}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke={
                isRiskEdge
                  ? "rgba(217,119,6,0.2)"
                  : "rgba(107,114,128,0.2)"
              }
              strokeWidth="1"
              strokeDasharray={isRiskEdge ? "3 3" : undefined}
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((node) => (
          <g key={node.id}>
            {/* Pulse ring */}
            {node.risk && (
              <circle
                cx={node.x}
                cy={node.y}
                r={node.r * 2.4}
                fill={
                  node.risk === "high"
                    ? "rgba(239,68,68,0.07)"
                    : "rgba(217,119,6,0.07)"
                }
                stroke={
                  node.risk === "high"
                    ? "rgba(239,68,68,0.28)"
                    : "rgba(217,119,6,0.28)"
                }
                strokeWidth="1"
                className="webinar-risk-ring"
                style={{ animationDelay: node.animDelay }}
              />
            )}

            {/* Dot */}
            <circle cx={node.x} cy={node.y} r={node.r} fill={node.fill} opacity={0.9} />

            {/* Director label */}
            {node.label && (
              <text
                x={node.x}
                y={node.y - node.r - 5}
                textAnchor="middle"
                fontSize="7.5"
                fill="rgba(55,65,81,0.6)"
                fontFamily="system-ui, sans-serif"
                letterSpacing="0.06em"
                fontWeight="600"
              >
                {node.label.toUpperCase()}
              </text>
            )}

            {/* Risk label */}
            {node.riskLabel && (
              <text
                x={node.x}
                y={node.y + node.r + 13}
                textAnchor="middle"
                fontSize="7.5"
                fill={node.risk === "high" ? HIGH : WARN}
                fontFamily="system-ui, sans-serif"
                fontWeight="700"
                letterSpacing="0.08em"
              >
                {node.riskLabel.toUpperCase()}
              </text>
            )}
          </g>
        ))}

        {/* AI scan line */}
        <rect
          x="0"
          y="-1.5"
          width={W}
          height="2.5"
          fill="url(#org-scan-grad)"
          className="webinar-scan-line"
        />
      </svg>
    </div>
  );
}
