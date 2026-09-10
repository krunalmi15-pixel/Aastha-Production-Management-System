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

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const result = await dashboardAPI.get();
        setData(result);

        const monthly = await fetch(
          "http://localhost:5000/api/dashboard/monthly-production"
        ).then((res) => res.json());

        setMonthlyProduction(monthly);
      } catch (error) {
        console.error("Dashboard loading failed", error);
      }
    };

    loadDashboard();
  }, []);

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

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Monthly Production</CardTitle>
        </CardHeader>

        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={monthlyProduction}
              barCategoryGap="35%"
              margin={{
                top: 20,
                right: 20,
                left: 10,
                bottom: 10,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="production" barSize={35} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
        <StatCard title="Total Production" value={data.totalQuantity} />
        <StatCard title="Completed Lots" value={data.completedLots} />
        <StatCard title="Active Employees" value={data.activeEmployees} />
        <StatCard title="Active Machines" value={data.activeMachines} />
        <StatCard title="Today's Production" value={data.todayProduction} />
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