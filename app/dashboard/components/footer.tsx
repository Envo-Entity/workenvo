import DashboardIcon from "./dashboard-icon";

const footerLinks = ["Support", "Privacy", "Terms", "API Docs"];

export default function DashboardFooter() {
  return (
    <footer className="pb-12 pt-20">
      <div className="flex flex-col items-center justify-between gap-8 border-t border-[#f0edec] pt-12 md:flex-row">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#006841] text-white">
            <DashboardIcon name="work" fill className="text-sm" />
          </div>
          <span className="text-xl font-black tracking-tighter text-emerald-900">
            Workenvo
          </span>
        </div>

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
