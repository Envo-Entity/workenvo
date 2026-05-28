interface SignalRingsProps {
  size?: number;
  rings?: number;
  intervalSeconds?: number;
  className?: string;
}

export function SignalRings({
  size = 700,
  rings = 4,
  intervalSeconds = 4,
  className = "",
}: SignalRingsProps) {
  const interval = intervalSeconds / rings;

  return (
    <div
      className={`absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {Array.from({ length: rings }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full border border-webinar-accent/25 animate-webinar-ring"
          style={{
            width: size,
            height: size,
            animationDelay: `${i * interval}s`,
          }}
        />
      ))}
    </div>
  );
}
