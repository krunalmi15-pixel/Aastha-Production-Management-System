import { Card, CardContent } from "@/components/ui/card";
import {
  Package,
  Factory,
  Users,
  Boxes,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Props = {
  title: string;
  value: number | string;
};

const icons: Record<string, LucideIcon> = {
  "Total Lots": Package,
  "Today's Production": Factory,
  Employees: Users,
  "Total Quantity": Boxes,
};

function StatCard({ title, value }: Props) {
  const Icon = icons[title] ?? Package;

  return (
    <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">{title}</p>

            <h2 className="mt-3 text-4xl font-bold text-slate-900">
              {value}
            </h2>
          </div>

          <div className="rounded-xl bg-blue-100 p-4">
            <Icon className="h-7 w-7 text-blue-600" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default StatCard;