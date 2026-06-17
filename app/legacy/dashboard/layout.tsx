import styles from "./legacy-dashboard.module.css";
import LegacySidebar from "./components/legacy-sidebar";
import LegacyMobileNav from "./components/legacy-mobile-nav";

export default function LegacyDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${styles.page} flex min-h-screen`}>
      <LegacySidebar />
      <main className="mx-auto max-w-[104rem] flex-1 space-y-8 p-5 pb-24 md:p-8 md:pb-8">
        {children}
      </main>
      <LegacyMobileNav />
    </div>
  );
}
