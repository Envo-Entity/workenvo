import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { adminClient } from "@/lib/supabase/admin";
import BrandLogo from "@/components/BrandLogo";
import StepProgress from "./_components/StepProgress";

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // If they already finished onboarding, send them to the app.
  const { data: membership } = await adminClient
    .from("org_members")
    .select("orgs(onboarding_step)")
    .eq("user_id", user.id)
    .limit(1)
    .single();

  const orgsData = membership?.orgs;
  const orgRow = Array.isArray(orgsData) ? orgsData[0] : orgsData;
  const step = (orgRow as { onboarding_step: number } | null)?.onboarding_step ?? 0;

  if (step >= 4) redirect("/dashboard");

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#FAFAFA",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Top bar */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "24px 40px",
          background: "#FFFFFF",
          borderBottom: "1px solid #F3F4F6",
        }}
      >
        <BrandLogo logoHeightClassName="h-7" textClassName="text-lg tracking-[-0.03em]" />

        <StepProgress />

        {/* Spacer to balance the logo */}
        <div style={{ width: "120px" }} />
      </header>

      {/* Page content */}
      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "48px 24px 80px",
        }}
      >
        {children}
      </main>
    </div>
  );
}
