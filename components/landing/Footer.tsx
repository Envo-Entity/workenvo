"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";

const productLinks = [
  { label: "Culture", href: "/dashboard/envo-culture" },
  { label: "Performance", href: "/dashboard/envo-performance" },
  { label: "Sustainability", href: "/dashboard/envo-sustainability" },
  { label: "Employees", href: "/dashboard/envo-employees" },
];

const companyLinks = [
  { label: "Support", href: "#" },
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "API Docs", href: "#" },
];

function FooterWordmark() {
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState(120);

  useEffect(() => {
    const fit = () => {
      const container = containerRef.current;
      const measure = measureRef.current;
      if (!container || !measure) return;

      const availableWidth = container.offsetWidth * 0.92;
      if (availableWidth === 0) return;

      measure.style.fontSize = "100px";
      const measuredWidth = measure.scrollWidth;
      if (measuredWidth === 0) return;

      setFontSize((availableWidth / measuredWidth) * 100);
    };

    fit();

    const resizeObserver = new ResizeObserver(fit);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  const wordmarkStyle: React.CSSProperties = {
    fontFamily: "var(--font-brand), var(--font-sans), sans-serif",
    letterSpacing: "-0.06em",
    textTransform: "lowercase",
    lineHeight: 0.9,
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.88) 0%, rgba(255,255,255,0.64) 56%, rgba(255,255,255,0.24) 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    color: "transparent",
  };

  return (
    <div className="pt-4 md:pt-5">
      <div
        ref={containerRef}
        className="relative mx-auto w-full max-w-full overflow-hidden"
      >
        <div
          ref={measureRef}
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 whitespace-nowrap opacity-0"
          style={{ ...wordmarkStyle, fontSize: "100px" }}
        >
          <span style={{ fontWeight: 400 }}>work</span>
          <span style={{ fontWeight: 600 }}>envo</span>
        </div>

        <div
          className="mx-auto whitespace-nowrap"
          style={{ ...wordmarkStyle, fontSize: `${fontSize}px` }}
        >
          <span style={{ fontWeight: 400 }}>work</span>
          <span style={{ fontWeight: 600 }}>envo</span>
        </div>
      </div>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#111111] text-white">
      <div className="mx-auto max-w-7xl px-6 pb-6 pt-8 md:px-12 md:pb-8 md:pt-10">
        <div className="grid gap-12 md:grid-cols-[minmax(0,1.25fr)_160px_190px] md:items-start">
          <div>
            <BrandLogo
              logoHeightClassName="h-8"
              textClassName="text-[1.5rem] tracking-[-0.04em] !text-white"
              imageClassName="brightness-0 invert"
            />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/45 md:text-[15px]">
              The intelligence layer for modern HR leadership. Built for CHROs
              and leadership teams who want to see behaviour clearly and act
              early.
            </p>
          </div>

          <div>
            <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.25em] text-white/30">
              Product
            </p>
            <ul className="space-y-3.5">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/58 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.25em] text-white/30">
              Company
            </p>
            <ul className="space-y-3.5">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/58 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-5">
          <p className="text-xs text-white/25">
            © 2025 Workenvo, Inc. All rights reserved.
          </p>
        </div>

        <FooterWordmark />
      </div>
    </footer>
  );
}
