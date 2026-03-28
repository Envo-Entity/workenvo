import type { Metadata } from "next";
import DashboardHeader from "../components/header";
import EmployeesTab from "../components/employees-tab";

export const metadata: Metadata = {
  title: "Workenvo | Employees",
};

export default function EmployeesPage() {
  return (
    <>
      <DashboardHeader
        tag="People Directory"
        title="Employees"
        ctaSecondary="Export CSV"
        ctaPrimary="+ Add Employee"
      />
      <EmployeesTab />
    </>
  );
}
