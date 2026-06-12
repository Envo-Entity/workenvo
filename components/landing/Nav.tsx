"use client";

import BrandLogo from "@/components/BrandLogo";
import { useEffect, useState } from "react";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const atTop = !scrolled;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "py-2" : "py-3"
      }`}
      style={{
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        background: atTop
          ? "rgba(0,0,0,0.12)"
          : "rgba(255,255,255,0.78)",
        WebkitMaskImage: atTop ? "linear-gradient(to bottom, black 60%, transparent 100%)" : "none",
        maskImage: atTop ? "linear-gradient(to bottom, black 60%, transparent 100%)" : "none",
        boxShadow: atTop ? "none" : "0 1px 0 rgba(0,0,0,0.06)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <a
          href="/"
          className="flex items-center transition-all duration-300"
          style={{ filter: atTop ? "brightness(0) invert(1)" : "none" }}
        >
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
          ].map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm transition-colors duration-200"
              style={{
                color: atTop ? "rgba(255,255,255,0.78)" : "#6B7280",
                fontWeight: 450,
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = atTop ? "#fff" : "#111827")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = atTop
                  ? "rgba(255,255,255,0.78)"
                  : "#6B7280")
              }
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Right CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="/login"
            className="text-sm transition-colors duration-200"
            style={{
              color: atTop ? "rgba(255,255,255,0.78)" : "#6B7280",
              fontWeight: 450,
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = atTop ? "#fff" : "#111827")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = atTop
                ? "rgba(255,255,255,0.78)"
                : "#6B7280")
            }
          >
            Log in
          </a>
          <a
            href="/book-demo"
            className="text-sm px-5 py-2.5 rounded-xl font-medium transition-all duration-200"
            style={
              atTop
                ? {
                    background: "rgba(255,255,255,0.18)",
                    color: "#fff",
                    border: "1px solid rgba(255,255,255,0.3)",
                  }
                : {
                    background: "#16855B",
                    color: "#fff",
                    border: "none",
                  }
            }
          >
            Book a Demo
          </a>
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden flex flex-col gap-1.5 p-2" aria-label="Menu">
          <span
            className="w-5 h-0.5 block rounded-full transition-colors duration-300"
            style={{ background: atTop ? "rgba(255,255,255,0.9)" : "#374151" }}
          />
          <span
            className="w-5 h-0.5 block rounded-full transition-colors duration-300"
            style={{ background: atTop ? "rgba(255,255,255,0.9)" : "#374151" }}
          />
          <span
            className="w-3.5 h-0.5 block rounded-full transition-colors duration-300"
            style={{ background: atTop ? "rgba(255,255,255,0.9)" : "#374151" }}
          />
        </button>
      </div>
    </nav>
  );
}
