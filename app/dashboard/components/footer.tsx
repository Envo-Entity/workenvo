import BrandLogo from "@/components/BrandLogo";

const footerLinks = ["Support", "Privacy", "Terms", "API Docs"];

export default function DashboardFooter() {
  return (
    <footer className="pb-12 pt-20">
      <div className="flex flex-col items-center justify-between gap-8 border-t border-[#f0edec] pt-12 md:flex-row">
        <BrandLogo
          logoHeightClassName="h-7"
          textClassName="text-xl tracking-[-0.03em]"
        />

        <div className="flex gap-8 text-xs font-medium text-stone-500">
          {footerLinks.map((link) => (
            <a
              key={link}
              href="#"
              className="transition-all hover:text-[#006841]"
            >
              {link}
            </a>
          ))}
        </div>

        <p className="text-xs text-stone-400">© 2024 Workenvo. All rights reserved.</p>
      </div>
    </footer>
  );
}
