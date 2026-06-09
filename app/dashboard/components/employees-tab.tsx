"use client";

import Link from "next/link";
import styles from "../dashboard.module.css";
import { employees, getInitials, type Employee } from "./employees-data";

function EmployeeCard({ employee }: { employee: Employee }) {
  return (
    <Link
      href={`/dashboard/envo-employees/${employee.id.toLowerCase()}`}
      className={`group flex w-full flex-col items-center gap-4 rounded-[1.5rem] bg-white p-6 text-left transition-all hover:-translate-y-1 hover:bg-[var(--dash-primary)] hover:text-white active:translate-y-0 ${styles.ambientShadow}`}
    >
      <div
        className="flex h-16 w-16 items-center justify-center rounded-[1rem] text-xl font-black text-white transition-all group-hover:bg-white/20"
        style={{ backgroundColor: employee.avatarColor }}
      >
        {getInitials(employee.name)}
      </div>
      <div className="w-full text-center">
        <p className={`text-xl leading-none text-[var(--dash-ink)] transition-colors group-hover:text-white ${styles.displaySerif}`}>
          {employee.name}
        </p>
        <p className="mt-0.5 text-xs text-[var(--dash-ink-soft)] transition-colors group-hover:text-white/75">
          {employee.designation}
        </p>
      </div>
      <span className="rounded-full bg-[var(--dash-surface-muted)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--dash-ink-soft)] transition-colors group-hover:bg-white/20 group-hover:text-white">
        View timeline
      </span>
    </Link>
  );
}

export default function EmployeesTab() {
  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <span className="rounded-full bg-[rgba(16,137,79,0.10)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--dash-primary)]">
            {employees.length} team members
          </span>
          <h2 className={`mt-2 text-3xl leading-none text-[var(--dash-ink)] ${styles.displaySerif}`}>
            All Employees
          </h2>
        </div>
        <button className="rounded-full bg-[var(--dash-surface-muted)] px-5 py-2.5 text-sm font-semibold transition-all hover:bg-[var(--dash-line-strong)]">
          + Add Employee
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {employees.map((employee) => (
          <EmployeeCard key={employee.id} employee={employee} />
        ))}
      </div>
    </div>
  );
}
