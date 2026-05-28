import BrandLogo from "@/components/BrandLogo";

export function Footer() {
  return (
    <footer className="border-t border-webinar-wire/40 bg-webinar-surface/50 py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
        {/* Brand */}
        <div className="flex flex-col gap-3">
          <BrandLogo
            logoHeightClassName="h-8"
            imageClassName="opacity-95"
            textClassName="!text-webinar-ink text-xl"
          />
          <span className="text-xs text-webinar-ink-faint">
            AI-Driven Workforce Intelligence
          </span>
        </div>

        {/* Links */}
        <nav className="flex flex-wrap gap-x-8 gap-y-3" aria-label="Footer">
          {[
            { label: "Website", href: "#" },
            { label: "LinkedIn", href: "#" },
            { label: "Contact", href: "mailto:info@workenvo.com" },
            { label: "Privacy Policy", href: "#" },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="text-sm text-webinar-ink-faint hover:text-webinar-ink-dim transition-colors duration-200"
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Disclaimer */}
        <p className="text-[11px] text-webinar-ink-faint leading-[1.7] max-w-xs">
          AI workforce intelligence is designed to augment human decision-making.
          All employee data is handled with privacy, ethics, and trust at its core.
          No individual employee data is used without appropriate consent.
        </p>
      </div>

      <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-webinar-wire/20">
        <p className="text-[11px] text-webinar-ink-faint">
          &copy; {new Date().getFullYear()} Workenvo. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
