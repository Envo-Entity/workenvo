import type { Metadata } from "next";
import UserManagementShell from "../components/user-management-shell";

export const metadata: Metadata = {
  title: "Workenvo | Settings",
};

export default function SettingsPage() {
  return <UserManagementShell />;
}
