import type { Report } from "@/types/Report";

export const sampleReports: Report[] = [
  {
    id: 1,
    title: "Daily Production Report",
    type: "Excel",
    generatedBy: "Admin",
    generatedAt: "2026-07-31 09:30",
    status: "Ready",
  },
  {
    id: 2,
    title: "Weekly Production Report",
    type: "PDF",
    generatedBy: "Admin",
    generatedAt: "2026-07-30 17:45",
    status: "Ready",
  },
  {
    id: 3,
    title: "Monthly Production Report",
    type: "PDF",
    generatedBy: "Manager",
    generatedAt: "2026-07-29 15:10",
    status: "Generating",
  },
];