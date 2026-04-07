"use client";

import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import DashboardHeader from "./header";
import { employees, getInitials } from "./employees-data";
import styles from "../dashboard.module.css";

type AccessLevel = "none" | "read" | "write";

type ManagedAccess = {
  employeeId: string;
  dashboards: {
    culture: boolean;
    performance: boolean;
    sustainability: boolean;
  };
  configuration: {
    signalsSetup: AccessLevel;
    surveyBuilder: AccessLevel;
  };
};

const insightOptions = [
  { key: "culture", label: "Culture" },
  { key: "performance", label: "Performance" },
  { key: "sustainability", label: "Sustainability" },
] as const;

const configurationOptions = [
  { key: "signalsSetup", label: "Signals Setup" },
  { key: "surveyBuilder", label: "Survey Builder" },
] as const;

const initialManagedAccess: ManagedAccess[] = [
  {
    employeeId: "EMP001",
    dashboards: { culture: true, performance: true, sustainability: true },
    configuration: { signalsSetup: "write", surveyBuilder: "write" },
  },
  {
    employeeId: "EMP002",
    dashboards: { culture: true, performance: true, sustainability: false },
    configuration: { signalsSetup: "read", surveyBuilder: "none" },
  },
  {
    employeeId: "EMP003",
    dashboards: { culture: true, performance: true, sustainability: true },
    configuration: { signalsSetup: "read", surveyBuilder: "read" },
  },
];

function StatChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.35rem] bg-[#f6f3f2] px-4 py-3">
      <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-[#3e4941]/65">
        {label}
      </p>
      <p className="mt-1 text-lg font-bold tracking-tight text-[#1c1b1b]">{value}</p>
    </div>
  );
}

function DashboardCheckbox({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: () => void;
}) {
  return (
    <label className="flex items-center gap-2 text-xs font-semibold text-[#1c1b1b]">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded border-0 accent-[#006841]"
      />
      <span>{label}</span>
    </label>
  );
}

function AccessDropdown({
  value,
  onChange,
}: {
  value: AccessLevel;
  onChange: (nextValue: AccessLevel) => void;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as AccessLevel)}
        className="w-full appearance-none rounded-[1rem] bg-white px-3.5 py-2.5 pr-9 text-sm font-semibold capitalize text-[#1c1b1b] outline-none ring-1 ring-[#006841]/8 transition-shadow focus:ring-2 focus:ring-[#006841]/18"
      >
        <option value="none">None</option>
        <option value="read">Read</option>
        <option value="write">Write</option>
      </select>
      <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[#3e4941]/55">
        ▾
      </span>
    </div>
  );
}

export default function UserManagementShell() {
  const [query, setQuery] = useState("");
  const [managedUsers, setManagedUsers] = useState<ManagedAccess[]>(initialManagedAccess);

  const employeeMap = useMemo(
    () => new Map(employees.map((employee) => [employee.id, employee])),
    [],
  );

  const normalizedQuery = query.trim().toLowerCase();

  const managedRows = managedUsers.reduce<
    Array<{ entry: ManagedAccess; employee: (typeof employees)[number] }>
  >((rows, entry) => {
    const employee = employeeMap.get(entry.employeeId);

    if (!employee) {
      return rows;
    }

    if (
      normalizedQuery &&
      !employee.name.toLowerCase().includes(normalizedQuery) &&
      !employee.designation.toLowerCase().includes(normalizedQuery) &&
      !employee.department.toLowerCase().includes(normalizedQuery)
    ) {
      return rows;
    }

    rows.push({ entry, employee });
    return rows;
  }, []);

  const availableEmployees = employees.filter(
    (employee) =>
      !managedUsers.some((entry) => entry.employeeId === employee.id) &&
      (!normalizedQuery ||
        employee.name.toLowerCase().includes(normalizedQuery) ||
        employee.designation.toLowerCase().includes(normalizedQuery) ||
        employee.department.toLowerCase().includes(normalizedQuery)),
  );

  const summary = {
    totalManaged: managedUsers.length,
    fullDashboardAccess: managedUsers.filter(
      (user) =>
        user.dashboards.culture &&
        user.dashboards.performance &&
        user.dashboards.sustainability,
    ).length,
    configEditors: managedUsers.filter(
      (user) =>
        user.configuration.signalsSetup === "write" ||
        user.configuration.surveyBuilder === "write",
    ).length,
  };

  const addEmployee = (employeeId: string) => {
    setManagedUsers((current) => [
      ...current,
      {
        employeeId,
        dashboards: {
          culture: true,
          performance: false,
          sustainability: false,
        },
        configuration: {
          signalsSetup: "read",
          surveyBuilder: "none",
        },
      },
    ]);
    setQuery("");
  };

  const toggleDashboard = (
    employeeId: string,
    dashboard: keyof ManagedAccess["dashboards"],
  ) => {
    setManagedUsers((current) =>
      current.map((entry) =>
        entry.employeeId === employeeId
          ? {
              ...entry,
              dashboards: {
                ...entry.dashboards,
                [dashboard]: !entry.dashboards[dashboard],
              },
            }
          : entry,
      ),
    );
  };

  const updateConfigAccess = (
    employeeId: string,
    configKey: keyof ManagedAccess["configuration"],
    nextValue: AccessLevel,
  ) => {
    setManagedUsers((current) =>
      current.map((entry) =>
        entry.employeeId === employeeId
          ? {
              ...entry,
              configuration: {
                ...entry.configuration,
                [configKey]: nextValue,
              },
            }
          : entry,
      ),
    );
  };

  return (
    <div className="space-y-8">
      <DashboardHeader
        tag="Workspace Settings"
        title="Envo Settings"
        ctaSecondary=""
        ctaPrimary=""
      />

      <section className={`rounded-[2rem] bg-white p-7 md:p-9 ${styles.ambientShadow}`}>
        <div className="flex flex-col gap-8 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-2xl space-y-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#006841]/70">
              Admin Controls
            </p>
            <h2 className="text-[2rem] font-bold tracking-[-0.03em] text-[#1c1b1b]">
              User management
            </h2>
            <p className="text-sm leading-7 text-[#3e4941]">
              Choose which people appear in this admin list, then shape exactly
              what their dashboard sidebar unlocks. Every person here is pulled
              from the existing Employees directory, so access stays anchored to
              the same source of truth.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <StatChip label="Managed users" value={String(summary.totalManaged)} />
            <StatChip
              label="Full dashboard"
              value={`${summary.fullDashboardAccess} people`}
            />
            <StatChip
              label="Config writers"
              value={`${summary.configEditors} people`}
            />
          </div>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(300px,0.95fr)]">
          <div className="rounded-[1.75rem] bg-[#f6f3f2] p-5 md:p-6">
            <div className="flex items-center gap-3 rounded-[1.35rem] bg-white px-4 py-3">
              <Search className="h-4 w-4 text-[#3e4941]/55" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search an employee by name, role, or department"
                className="w-full bg-transparent text-sm text-[#1c1b1b] outline-none placeholder:text-[#3e4941]/45"
              />
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#3e4941]/65">
                  Add people from Employees
                </p>
                <p className="text-xs text-[#3e4941]/60">
                  {availableEmployees.length} available
                </p>
              </div>

              {availableEmployees.length > 0 ? (
                <div className="grid gap-3 md:grid-cols-2">
                  {availableEmployees.slice(0, 4).map((employee) => (
                    <button
                      key={employee.id}
                      type="button"
                      onClick={() => addEmployee(employee.id)}
                      className="group flex items-center justify-between rounded-[1.35rem] bg-white px-4 py-4 text-left transition-transform hover:scale-[1.01] active:scale-[0.98]"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-11 w-11 items-center justify-center rounded-[0.95rem] text-sm font-bold text-white"
                          style={{ backgroundColor: employee.avatarColor }}
                        >
                          {getInitials(employee.name)}
                        </div>
                        <div>
                          <p className="font-semibold text-[#1c1b1b]">{employee.name}</p>
                          <p className="text-xs text-[#3e4941]/70">
                            {employee.designation}
                          </p>
                        </div>
                      </div>
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#006841]/10 text-[#006841] transition-colors group-hover:bg-[#006841] group-hover:text-white">
                        <Plus className="h-4 w-4" />
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="rounded-[1.35rem] bg-white px-4 py-5 text-sm text-[#3e4941]/75">
                  {normalizedQuery
                    ? "No additional employees match that search."
                    : "Everyone from the Employees directory is already configured here."}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-[1.75rem] bg-[#eef8f2] p-5 md:p-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#006841]/70">
              Sidebar access logic
            </p>
            <div className="mt-4 space-y-4 text-sm leading-7 text-[#3e4941]">
              <p>
                Dashboard toggles decide which insight destinations show up in a
                user&apos;s sidebar.
              </p>
              <p>
                Signals Setup and Survey Builder use permissions instead of
                simple visibility, so you can leave someone in read mode until
                they need to edit live configuration.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={`rounded-[2rem] bg-white p-5 md:p-6 ${styles.ambientShadow}`}>
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.26em] text-[#006841]/70">
              Access Matrix
            </p>
            <h3 className="mt-2 text-2xl font-bold tracking-tight text-[#1c1b1b]">
              Configured people
            </h3>
          </div>
          <p className="max-w-xl text-sm text-[#3e4941]">
            Search above to add more people. The list below only shows employees
            you&apos;ve explicitly added to this admin surface.
          </p>
        </div>

        <div className="mt-6 overflow-hidden rounded-[1.6rem] bg-[#f6f3f2]">
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-0">
              <thead>
                <tr className="bg-[#eef8f2]">
                  <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-[0.24em] text-[#3e4941]/65">
                    Employee
                  </th>
                  <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-[0.24em] text-[#3e4941]/65">
                    Dashboards
                  </th>
                  <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-[0.24em] text-[#3e4941]/65">
                    Signals Setup
                  </th>
                  <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-[0.24em] text-[#3e4941]/65">
                    Survey Builder
                  </th>
                  <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-[0.24em] text-[#3e4941]/65">
                    Sidebar Preview
                  </th>
                </tr>
              </thead>
              <tbody>
                {managedRows.map(({ employee, entry }, index) => {
                  const sidebarPreview = [
                    ...insightOptions
                      .filter(({ key }) => entry.dashboards[key])
                      .map(({ label }) => label),
                    ...configurationOptions
                      .filter(({ key }) => entry.configuration[key] !== "none")
                      .map(
                        ({ label, key }) =>
                          `${label} (${entry.configuration[key]})`,
                      ),
                  ];

                  return (
                    <tr
                      key={employee.id}
                      className={index % 2 === 0 ? "bg-white/75" : "bg-[#f9f7f6]"}
                    >
                      <td className="px-5 py-5 align-top">
                        <div className="flex min-w-[240px] items-start gap-4">
                          <div
                            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[1rem] text-sm font-bold text-white"
                            style={{ backgroundColor: employee.avatarColor }}
                          >
                            {getInitials(employee.name)}
                          </div>
                          <div className="space-y-1">
                            <p className="font-bold tracking-tight text-[#1c1b1b]">
                              {employee.name}
                            </p>
                            <p className="text-sm text-[#3e4941]">
                              {employee.designation}
                            </p>
                            <p className="text-xs text-[#3e4941]/70">
                              {employee.department} · {employee.location}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-5 align-top">
                        <div className="min-w-[220px] space-y-3">
                          {insightOptions.map(({ key, label }) => (
                            <DashboardCheckbox
                              key={key}
                              label={label}
                              checked={entry.dashboards[key]}
                              onChange={() => toggleDashboard(employee.id, key)}
                            />
                          ))}
                        </div>
                      </td>
                      <td className="px-5 py-5 align-top">
                        <div className="min-w-[150px]">
                          <AccessDropdown
                            value={entry.configuration.signalsSetup}
                            onChange={(nextValue) =>
                              updateConfigAccess(
                                employee.id,
                                "signalsSetup",
                                nextValue,
                              )
                            }
                          />
                        </div>
                      </td>
                      <td className="px-5 py-5 align-top">
                        <div className="min-w-[150px]">
                          <AccessDropdown
                            value={entry.configuration.surveyBuilder}
                            onChange={(nextValue) =>
                              updateConfigAccess(
                                employee.id,
                                "surveyBuilder",
                                nextValue,
                              )
                            }
                          />
                        </div>
                      </td>
                      <td className="px-5 py-5 align-top">
                        <div className="flex min-w-[260px] flex-wrap gap-2">
                          {sidebarPreview.length > 0 ? (
                            sidebarPreview.map((item) => (
                              <span
                                key={item}
                                className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-[#1c1b1b]"
                              >
                                {item}
                              </span>
                            ))
                          ) : (
                            <span className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-[#3e4941]/70">
                              No access granted
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
