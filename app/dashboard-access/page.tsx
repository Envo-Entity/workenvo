import type { Metadata } from "next";
import PasscodeForm from "./passcode-form";

export const metadata: Metadata = {
  title: "Workenvo | Dashboard Access",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function DashboardAccessPage() {
  return <PasscodeForm />;
}
