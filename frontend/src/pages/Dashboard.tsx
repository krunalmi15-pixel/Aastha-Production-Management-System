import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Crown,
  Medal,
  Scissors,
  UserRound
} from "lucide-react";
import StatCard from "@/components/StatCard";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { dashboardAPI } from "@/services/api";

function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [monthlyProduction, setMonthlyProduction] = useState<any[]>([]);
  const [performance, setPerformance] = useState({
    cutters: [],
    operators: []
  });

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const result = await dashboardAPI.get();
        setData(result);

        const monthly = await fetch(
          "http://localhost:5000/api/dashboard/monthly-production"
        ).then((res) => res.json());

        setMonthlyProduction(monthly);

        const performanceData = await dashboardAPI.employeePerformance();
        setPerformance(performanceData);
      } catch (error) {
        console.error("Dashboard loading failed", error);
      }
    };

    loadDashboard();
  }, []);

  const getRankIcon = (index: number) => {
    if (index === 0) {
      return <Crown className="h-5 w-5 text-yellow-500" />;
    }
    if (index === 1) {
      return <Medal className="h-5 w-5 text-gray-400" />;
    }
    if (index === 2) {
      return <Medal className="h-5 w-5 text-orange-500" />;
    }
    return null;
  };

  if (!data) {
    return <div>Loading Dashboard...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Welcome to the Aastha Engineering Production Management System.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Total Production"
          value={data.totalQuantity}
        />

        <StatCard
          title="Completed Lots"
          value={data.completedLots}
        />

        <StatCard
          title="Today's Production"
          value={data.todayProduction}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[2fr_1fr_1fr]">
        {/* Monthly Chart */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>
              Monthly Production
            </CardTitle>
          </CardHeader>

          <CardContent>
            <ResponsiveContainer
              width="100%"
              height={280}
            >
              <BarChart
                data={monthlyProduction}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                />
                <XAxis
                  dataKey="month"
                />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="production"
                  radius={[
                    6,
                    6,
                    0,
                    0
                  ]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Cutter Performer */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scissors className="h-5 w-5 text-red-500" />
              Cutter Top Performer
            </CardTitle>
          </CardHeader>

          <CardContent className="p-4 space-y-2">
            {performance.cutters.slice(0, 5).map(
              (employee: any, index: number) => (
                <div
                  key={employee.name}
                  className="flex items-center justify-between border-b py-3 text-sm"
                >
                  <div className="flex items-center gap-3">
                    <span>{index + 1}.</span>
                    {getRankIcon(index)}
                    <span className={index < 3 ? "font-bold" : ""}>
                      {employee.name}
                    </span>
                  </div>
                  <strong>
                    {employee.production}
                  </strong>
                </div>
              )
            )}
          </CardContent>
        </Card>

        {/* Operator Performer */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserRound className="h-5 w-5 text-blue-500" />
              Operator Top Performer
            </CardTitle>
          </CardHeader>

          <CardContent className="p-4 space-y-2">
            {performance.operators.slice(0, 5).map(
              (employee: any, index: number) => (
                <div
                  key={employee.name}
                  className="flex items-center justify-between border-b py-3 text-sm"
                >
                  <div className="flex items-center gap-3">
                    <span>{index + 1}.</span>
                    {getRankIcon(index)}
                    <span className={index < 3 ? "font-bold" : ""}>
                      {employee.name}
                    </span>
                  </div>
                  <strong>
                    {employee.production}
                  </strong>
                </div>
              )
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Production Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span>Total Production</span>
              <strong>{data.totalQuantity}</strong>
            </div>

            <div className="flex justify-between">
              <span>Completed Lots</span>
              <strong>{data.completedLots}</strong>
            </div>

            <div className="flex justify-between">
              <span>Today's Production</span>
              <strong>{data.todayProduction}</strong>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span>Employees</span>
              <strong>{data.activeEmployees}</strong>
            </div>

            <div className="flex justify-between">
              <span>Machines</span>
              <strong>{data.activeMachines}</strong>
            </div>

            <div className="flex justify-between">
              <span>Status</span>
              <strong>Running</strong>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Dashboard;