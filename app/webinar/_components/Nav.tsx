"use client";

import BrandLogo from "@/components/BrandLogo";
import Link from "next/link";
import { useEffect, useState } from "react";
import { RegisterTrigger } from "./RegisterTrigger";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handle, { passive: true });
    return () => window.removeEventListener("scroll", handle);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-500 ${
        scrolled
          ? "bg-webinar-page/90 backdrop-blur-md border-b border-webinar-wire/50"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" aria-label="Workenvo home">
          <BrandLogo
            className="shrink-0"
            logoHeightClassName="h-8"
            imageClassName="drop-shadow-[0_0_18px_rgba(22,133,91,0.25)]"
            textClassName="!text-webinar-ink text-xl tracking-tight"
            priority
          />
        </Link>

        <RegisterTrigger className="text-sm font-semibold px-5 py-2.5 rounded-full bg-webinar-accent text-white transition-all duration-200 hover:bg-webinar-violet [box-shadow:0_0_20px_rgba(22,133,91,0.3)] hover:[box-shadow:0_0_28px_rgba(22,133,91,0.45)] cursor-pointer">
          Register Now
        </RegisterTrigger>
      </div>
    </header>
  );
}
