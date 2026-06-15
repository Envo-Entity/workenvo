"use client";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export function RegisterTrigger({ children, className }: Props) {
  return (
    <button
      className={className}
      onClick={() => window.dispatchEvent(new Event("open-webinar-register"))}
    >
      {children}
    </button>
  );
}
