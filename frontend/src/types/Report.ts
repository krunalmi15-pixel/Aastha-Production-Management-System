export interface Report {
  id: number;
  title: string;
  type: "Excel" | "PDF";
  generatedBy: string;
  generatedAt: string;
  status: "Ready" | "Generating";
}