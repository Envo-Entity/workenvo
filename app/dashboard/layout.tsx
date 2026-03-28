import styles from "./dashboard.module.css";
import Sidebar from "./components/sidebar";
import MobileNav from "./components/mobile-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${styles.page} flex min-h-screen`}>
      <Sidebar />
      <main className="mx-auto max-w-7xl flex-1 space-y-8 p-5 pb-24 md:p-8 md:pb-8">
        {children}
      </main>
      <MobileNav />
    </div>
  );
}
