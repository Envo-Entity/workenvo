import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";

const productLinks = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Sentiment", href: "/dashboard/envo-sentiment" },
  { label: "Survey Builder", href: "/dashboard/envo-survey-builder" },
  { label: "Employees", href: "/dashboard/envo-employees" },
];

const companyLinks = [
  { label: "Support", href: "#" },
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "API Docs", href: "#" },
];

export default function DashboardFooter() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-0 border-t border-[var(--dash-line)] bg-[var(--dash-surface)] md:left-64">
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-12 md:px-10">

        {/* Main grid */}
        <div className="grid grid-cols-2 gap-10 md:grid-cols-[1fr_120px_160px]">

          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <BrandLogo
              logoHeightClassName="h-8"
              textClassName="text-[1.5rem] tracking-[-0.04em] !text-[var(--dash-ink)]"
            />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[var(--dash-ink-soft)]">
              The intelligence layer for modern HR leadership. Built for CHROs who move fast.
            </p>
          </div>

          {/* Product */}
          <div>
            <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--dash-ink-faint)]">
              Product
            </p>
            <ul className="space-y-3.5">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--dash-ink-soft)] transition-colors hover:text-[var(--dash-primary)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--dash-ink-faint)]">
              Company
            </p>
            <ul className="space-y-3.5">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--dash-ink-soft)] transition-colors hover:text-[var(--dash-primary)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-[var(--dash-line-soft)] pt-6 md:flex-row md:items-center">
          <p className="text-xs text-[var(--dash-ink-faint)]">
            © 2025 Workenvo, Inc. All rights reserved.
          </p>
          <p className="text-xs text-[var(--dash-ink-ghost)]">
            Built for the future of work.
          </p>
        </div>

      </div>
    </footer>
  );
}
