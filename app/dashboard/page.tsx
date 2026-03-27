import type { Metadata } from "next";
import styles from "./dashboard.module.css";
import Sidebar from "./components/sidebar";
import DashboardHeader from "./components/header";
import CapabilityIndexCard from "./components/capability-index-card";
import AIRecommendationsPanel from "./components/ai-recommendations-panel";
import BehaviouralSignalsCard from "./components/behavioural-signals-card";
import ESGMetricsCard from "./components/esg-metrics-card";
import MobileNav from "./components/mobile-nav";

export const metadata: Metadata = {
  title: "Workenvo | HR & Leadership Dashboard",
};

export default function DashboardPage() {
  return (
    <div className={`${styles.page} flex min-h-screen`}>
      <Sidebar />

      <main className="mx-auto max-w-7xl flex-1 space-y-8 p-5 md:p-8">
        <DashboardHeader />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          <CapabilityIndexCard />
          <AIRecommendationsPanel />
          <BehaviouralSignalsCard />
          <ESGMetricsCard />
        </div>
      </main>

      <MobileNav />
    </div>
  );
}
