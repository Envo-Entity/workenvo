"use client";

import { useState } from "react";
import styles from "../dashboard.module.css";
import DashboardIcon from "./dashboard-icon";

type Employee = {
  id: string;
  name: string;
  designation: string;
  department: string;
  location: string;
  startDate: string;
  manager: string;
  avatarColor: string;
  performance: number;
  engagement: number;
  skills: string[];
  directReports: number;
};

const employees: Employee[] = [
  {
    id: "EMP001",
    name: "Priya Sharma",
    designation: "VP of People",
    department: "Human Resources",
    location: "Mumbai, India",
    startDate: "Mar 2019",
    manager: "CEO",
    avatarColor: "#006841",
    performance: 94,
    engagement: 88,
    skills: ["Talent Strategy", "OKRs", "Culture Design", "Coaching"],
    directReports: 8,
  },
  {
    id: "EMP002",
    name: "Marcus Webb",
    designation: "Senior Software Engineer",
    department: "Engineering",
    location: "London, UK",
    startDate: "Jun 2021",
    manager: "Anita Roy",
    avatarColor: "#4338ca",
    performance: 89,
    engagement: 76,
    skills: ["TypeScript", "React", "Node.js", "System Design"],
    directReports: 0,
  },
  {
    id: "EMP003",
    name: "Chloe Laurent",
    designation: "Head of Marketing",
    department: "Marketing",
    location: "Paris, France",
    startDate: "Jan 2020",
    manager: "Priya Sharma",
    avatarColor: "#b54708",
    performance: 81,
    engagement: 63,
    skills: ["Brand Strategy", "Growth", "Storytelling", "Analytics"],
    directReports: 5,
  },
  {
    id: "EMP004",
    name: "Rajesh Nair",
    designation: "Product Manager",
    department: "Product",
    location: "Bengaluru, India",
    startDate: "Sep 2022",
    manager: "Marcus Webb",
    avatarColor: "#0e9384",
    performance: 87,
    engagement: 91,
    skills: ["Roadmapping", "User Research", "Figma", "Agile"],
    directReports: 2,
  },
  {
    id: "EMP005",
    name: "Sofia Martinez",
    designation: "Data Scientist",
    department: "Analytics",
    location: "Barcelona, Spain",
    startDate: "Nov 2021",
    manager: "Rajesh Nair",
    avatarColor: "#6941c6",
    performance: 92,
    engagement: 85,
    skills: ["Python", "ML Models", "SQL", "Dashboarding"],
    directReports: 0,
  },
  {
    id: "EMP006",
    name: "James Okafor",
    designation: "Sales Director",
    department: "Sales",
    location: "Lagos, Nigeria",
    startDate: "Feb 2018",
    manager: "CEO",
    avatarColor: "#c4320a",
    performance: 78,
    engagement: 72,
    skills: ["Enterprise Sales", "CRM", "Negotiation", "Pipeline Management"],
    directReports: 12,
  },
  {
    id: "EMP007",
    name: "Amelia Foster",
    designation: "UX Designer",
    department: "Design",
    location: "Sydney, Australia",
    startDate: "Jul 2023",
    manager: "Rajesh Nair",
    avatarColor: "#c11574",
    performance: 84,
    engagement: 93,
    skills: ["Figma", "Design Systems", "Prototyping", "Research"],
    directReports: 0,
  },
  {
    id: "EMP008",
    name: "Derek Huang",
    designation: "DevOps Engineer",
    department: "Engineering",
    location: "Singapore",
    startDate: "Apr 2022",
    manager: "Marcus Webb",
    avatarColor: "#027a48",
    performance: 90,
    engagement: 80,
    skills: ["Kubernetes", "CI/CD", "AWS", "Terraform"],
    directReports: 1,
  },
  {
    id: "EMP009",
    name: "Nina Patel",
    designation: "Finance Controller",
    department: "Finance",
    location: "Toronto, Canada",
    startDate: "Oct 2020",
    manager: "CEO",
    avatarColor: "#344054",
    performance: 95,
    engagement: 79,
    skills: ["Financial Modelling", "Compliance", "Forecasting", "SAP"],
    directReports: 3,
  },
  {
    id: "EMP010",
    name: "Luca Romano",
    designation: "Customer Success Manager",
    department: "Operations",
    location: "Milan, Italy",
    startDate: "Aug 2021",
    manager: "James Okafor",
    avatarColor: "#dc6803",
    performance: 83,
    engagement: 88,
    skills: ["Onboarding", "NPS", "Retention", "HubSpot"],
    directReports: 0,
  },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("");
}

function ScoreBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs font-bold uppercase tracking-[0.2em] text-[#3e4941]">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-[#ebe7e7]">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

function EmployeeModal({
  employee,
  onClose,
}: {
  employee: Employee;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(28,27,27,0.4)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-[2rem] bg-white"
        style={{ boxShadow: "0 24px 80px -8px rgba(0,104,65,0.18)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header band */}
        <div
          className="px-8 pt-8 pb-6"
          style={{ backgroundColor: employee.avatarColor }}
        >
          <button
            onClick={onClose}
            className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white transition-all hover:bg-white/30"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>

          <div className="flex items-center gap-5">
            <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-[1rem] bg-white/20 text-2xl font-black text-white">
              {getInitials(employee.name)}
            </div>
            <div className="text-white">
              <h2 className="text-2xl font-black tracking-tight">{employee.name}</h2>
              <p className="mt-0.5 text-sm font-semibold text-white/80">{employee.designation}</p>
              <span className="mt-2 inline-block rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em]">
                {employee.id}
              </span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="space-y-6 p-8">
          {/* Quick facts */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: "groups", label: "Department", value: employee.department },
              { icon: "person", label: "Manager", value: employee.manager },
              { icon: "verified", label: "Location", value: employee.location },
              { icon: "work", label: "Joined", value: employee.startDate },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-[1rem] bg-[#f6f3f2] p-4"
              >
                <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#3e4941]">
                  {item.label}
                </p>
                <div className="flex items-center gap-2">
                  <DashboardIcon name={item.icon} className="text-[16px] text-[#006841]" />
                  <p className="text-sm font-bold text-[#1c1b1b]">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Performance scores */}
          <div className="space-y-4 rounded-[1rem] bg-[#f6f3f2] p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#3e4941]">
              Performance Overview
            </p>
            <ScoreBar label="Performance" value={employee.performance} color={employee.avatarColor} />
            <ScoreBar label="Engagement" value={employee.engagement} color="#008454" />
          </div>

          {/* Skills */}
          <div>
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.25em] text-[#3e4941]">
              Core Skills
            </p>
            <div className="flex flex-wrap gap-2">
              {employee.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-[#006841]/10 px-4 py-1.5 text-xs font-semibold text-[#006841]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Direct reports */}
          {employee.directReports > 0 && (
            <div className="flex items-center justify-between rounded-[1rem] bg-[#72dba3]/20 px-5 py-4">
              <p className="text-sm font-semibold text-[#006841]">Direct Reports</p>
              <span className="text-2xl font-black text-[#006841]">{employee.directReports}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function EmployeeCard({
  employee,
  onClick,
}: {
  employee: Employee;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`group flex w-full flex-col items-center gap-4 rounded-[1.5rem] bg-white p-6 text-left transition-all hover:scale-[1.02] active:scale-[0.99] ${styles.ambientShadow}`}
    >
      <div
        className="flex h-16 w-16 items-center justify-center rounded-[1rem] text-xl font-black text-white"
        style={{ backgroundColor: employee.avatarColor }}
      >
        {getInitials(employee.name)}
      </div>
      <div className="w-full text-center">
        <p className="font-bold text-[#1c1b1b]">{employee.name}</p>
        <p className="mt-0.5 text-xs text-[#3e4941]">{employee.designation}</p>
      </div>
      <span className="rounded-full bg-[#f6f3f2] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#3e4941]">
        {employee.id}
      </span>
    </button>
  );
}

export default function EmployeesTab() {
  const [selected, setSelected] = useState<Employee | null>(null);

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <span className="rounded-full bg-[#006841]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-[#006841]">
              {employees.length} team members
            </span>
            <h2 className="mt-2 text-xl font-bold tracking-tight text-[#1c1b1b]">
              All Employees
            </h2>
          </div>
          <button className="rounded-full bg-[#ebe7e7] px-5 py-2.5 text-sm font-semibold transition-all hover:bg-[#e5e2e1]">
            + Add Employee
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {employees.map((emp) => (
            <EmployeeCard key={emp.id} employee={emp} onClick={() => setSelected(emp)} />
          ))}
        </div>
      </div>

      {selected && (
        <EmployeeModal employee={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
