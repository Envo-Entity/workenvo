import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { adminClient } from "@/lib/supabase/admin";
import styles from "./dashboard.module.css";
import Sidebar from "./components/sidebar";
import MobileNav from "./components/mobile-nav";

const ONBOARDING_PATHS: Record<number, string> = {
  0: "/onboarding/goals",
  1: "/onboarding/strategy",
  2: "/onboarding/connect",
  3: "/onboarding/welcome",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Check onboarding status and fetch role in one query
  const { data: membership } = await supabase
    .from("org_members")
    .select("role, orgs(onboarding_step)")
    .eq("user_id", user.id)
    .limit(1)
    .single();

  const orgsData = membership?.orgs;
  const orgRow = Array.isArray(orgsData) ? orgsData[0] : orgsData;
  const step = (orgRow as { onboarding_step: number } | null)?.onboarding_step ?? 4;

  if (step < 4) {
    redirect(ONBOARDING_PATHS[step] ?? "/onboarding/goals");
  }

  // Fetch real name + avatar from public.users
  const { data: userRow } = await adminClient
    .from("users")
    .select("full_name, avatar_url")
    .eq("id", user.id)
    .single();

  const userProfile = {
    fullName: userRow?.full_name ?? null,
    email: user.email ?? "",
    avatarUrl: userRow?.avatar_url ?? null,
    role: membership?.role ?? "hr",
  };

  return (
    <div className={`${styles.page} flex min-h-screen`}>
      <Sidebar userProfile={userProfile} />
      <main className="mx-auto max-w-[104rem] flex-1 space-y-8 p-5 pb-24 md:p-8 md:pb-8">
        {children}
      </main>
      <MobileNav />
    </div>
  );
}
