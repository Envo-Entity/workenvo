"use client";

interface CalButtonProps {
  children: React.ReactNode;
  className?: string;
}

const CAL_LINK = process.env.NEXT_PUBLIC_CAL_WEBINAR_LINK ?? "saransh/webinar-workenvo-development";

export function CalButton({ children, className }: CalButtonProps) {
  return (
    <button
      data-cal-namespace="webinar"
      data-cal-link={CAL_LINK}
      data-cal-config='{"layout":"month_view"}'
      className={className}
    >
      {children}
    </button>
  );
}
