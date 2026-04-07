import type { Metadata } from "next";
import DashboardHeader from "../components/header";
import DashboardIcon from "../components/dashboard-icon";

export const metadata: Metadata = {
  title: "Workenvo | Settings",
};

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <DashboardHeader
        tag="Workspace Settings"
        title="Envo Settings"
        ctaSecondary=""
        ctaPrimary=""
      />

      <section className="max-w-3xl rounded-[2rem] bg-white p-8 md:p-10">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#006841]/10">
            <DashboardIcon name="settings" className="text-[28px] text-[#006841]" />
          </div>

          <div className="space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#006841]/70">
              Admin Controls
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-[#1c1b1b]">
              User management
            </h2>
            <p className="max-w-xl text-sm leading-7 text-[#3e4941]">
              Manage access, permissions, and account ownership for the people
              using Workenvo across your organisation.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
