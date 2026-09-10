import type { Machine } from "@/types/Machine";

export const sampleMachines: Machine[] = [
  {
    id: 1,
    name: "Machine 1",
    operator: "Rahul",
    model: "CNC-100",
    location: "Unit A",
    installationDate: "2025-01-10",
    status: "Running",
  },
  {
    id: 2,
    name: "Machine 2",
    operator: "Amit",
    model: "CNC-200",
    location: "Unit B",
    installationDate: "2025-03-18",
    status: "Running",
  },
  {
    id: 3,
    name: "Machine 3",
    operator: "Suresh",
    model: "CNC-300",
    location: "Unit C",
    installationDate: "2024-11-25",
    status: "Maintenance",
  },
];