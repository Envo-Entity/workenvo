"use client";

import BrandLogo from "@/components/BrandLogo";
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
        scrolled ? "py-2 shadow-sm" : "py-2.5"
      }`}
      style={{
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        background: "rgba(255,255,255,0.92)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center">
          <BrandLogo
            priority
            logoHeightClassName="h-7 md:h-7"
            textClassName="text-lg md:text-xl tracking-[-0.03em]"
          />
        </a>

        {/* Center Nav Links */}
        <div className="hidden md:flex items-center gap-7">
          {[
            { name: "How it Works", href: "#how-it-works" },
            { name: "Product", href: "#product" },
            { name: "Signals", href: "#signals" },
            { name: "Pricing", href: "#pricing" },
          ].map(
            (link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm transition-colors duration-200"
                style={{ color: "#6B7280", fontWeight: 450 }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#111827")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#6B7280")}
              >
                {link.name}
              </a>
            )
          )}
        </div>

        {/* Right CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="#"
            className="text-sm transition-colors duration-200"
            style={{ color: "#6B7280", fontWeight: 450 }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#111827")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#6B7280")}
          >
            Log in
          </a>
          <a
            href="#pricing"
            className="btn-primary text-sm px-4 py-2 rounded-lg font-medium"
          >
            Start free
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
