"use client";

import { useEffect, useState } from "react";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 nav-border transition-all duration-300 ${
        scrolled ? "py-3 shadow-sm" : "py-4"
      }`}
      style={{
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        background: "rgba(255,255,255,0.92)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Wordmark */}
        <a
          href="/"
          className="flex items-center gap-2"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          <span
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-semibold"
            style={{ background: "#16855B", fontFamily: "var(--font-sans)" }}
          >
            W
          </span>
          <span
            className="text-xl font-normal tracking-tight"
            style={{ color: "#111827" }}
          >
            Workenvo
          </span>
        </a>

        {/* Center Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {["Platform", "ESG", "For HR", "For Leaders", "Pricing"].map(
            (link) => (
              <a
                key={link}
                href="#"
                className="text-sm font-medium transition-colors duration-200"
                style={{ color: "#6B7280" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#111827")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#6B7280")}
              >
                {link}
              </a>
            )
          )}
        </div>

        {/* Right CTAs */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href="#"
            className="text-sm font-medium transition-colors duration-200"
            style={{ color: "#6B7280" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#111827")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#6B7280")}
          >
            Log in
          </a>
          <a
            href="#"
            className="btn-primary text-sm px-5 py-2.5 rounded-xl font-medium"
          >
            Book a demo
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="Menu"
        >
          <span className="w-5 h-0.5 block rounded-full" style={{ background: "#374151" }} />
          <span className="w-5 h-0.5 block rounded-full" style={{ background: "#374151" }} />
          <span className="w-3.5 h-0.5 block rounded-full" style={{ background: "#374151" }} />
        </button>
      </div>
    </nav>
  );
}
