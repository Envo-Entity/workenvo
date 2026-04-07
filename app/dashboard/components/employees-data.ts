export type Employee = {
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

export const employees: Employee[] = [
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

export function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("");
}
