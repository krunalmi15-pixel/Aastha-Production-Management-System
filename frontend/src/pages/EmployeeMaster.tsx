import { employeeAPI, productionAPI } from "@/services/api";
import { useEffect, useMemo, useState } from "react";

import type { Employee } from "@/types/Employee";
import type { Attendance } from "@/types/Attendance";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import EmployeeForm from "@/components/employees/EmployeeForm";
import AttendanceForm from "@/components/employees/AttendanceForm";

import {
  Users,
  Plus,
  Search,
  Pencil,
  Trash2,
  Eye,
  ChevronDown,
  ChevronRight,
  Calendar,
  BarChart3,
} from "lucide-react";

function EmployeeMaster() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [productions, setProductions] = useState<any[]>([]);

  const [attendanceOpen, setAttendanceOpen] = useState(false);
  const [employeeListOpen, setEmployeeListOpen] = useState(false);
  const [productionReportOpen, setProductionReportOpen] = useState(false);

  useEffect(() => {
    loadEmployees();
  }, []);

  useEffect(() => {
    const loadProductions = async () => {
      try {
        const data = await productionAPI.getAll();
        setProductions(data);
      } catch (error) {
        console.error(
          "Failed to load productions",
          error
        );
      }
    };

    loadProductions();
  }, []);

  const loadEmployees = async () => {
    const data = await employeeAPI.getAll();
    setEmployees(data);
  };

  const [attendanceDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("2026-07-01");
  const [tillDate, setTillDate] = useState("2026-07-31");
  const [selectedEmployee, setSelectedEmployee] = useState("All");

  const [open, setOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [viewEmployee, setViewEmployee] = useState<Employee | null>(null);
  const [viewOpen, setViewOpen] = useState(false);

  const saveAttendance = (items: Attendance[]) => {
    setAttendance((prev) => [...prev, ...items]);
  };

  const employeeProduction = useMemo(() => {
    const filteredProduction = productions.filter((production) => {
      const dateMatch =
        production.scanDate >= fromDate &&
        production.scanDate <= tillDate;

      const sliderEmployee =
        production.operatorId?.name;

      const cutterEmployee =
        production.cutterOperatorId?.name;

      const employeeMatch =
        selectedEmployee === "All" ||
        sliderEmployee === selectedEmployee ||
        cutterEmployee === selectedEmployee;

      return dateMatch && employeeMatch;
    });

    console.log(
      "EMPLOYEE FILTERED PRODUCTION",
      filteredProduction
    );

    return {
      totalLots: new Set(
        filteredProduction.map(
          (production)=>production.lotNumber
        )
      ).size,

      totalProduction:
        filteredProduction.reduce(
          (sum, production)=>{
            return sum + Number(production.quantity || 0);
          },
          0
        ),

      totalHours: 0,
    };
  }, [
    productions,
    fromDate,
    tillDate,
    selectedEmployee
  ]);

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.phone.includes(search)
  );

  const deleteEmployee = async (id: string) => {
    try {
      await employeeAPI.delete(id);

      setEmployees((prev) =>
        prev.filter((e) => e._id !== id)
      );

      alert("Employee Deleted Successfully");
    } catch (error) {
      console.error(
        "Delete employee failed",
        error
      );
    }
  };

  const handleSave = (employee: Employee) => {
    if (editingEmployee) {
      setEmployees((prev) =>
        prev.map((item) =>
          item._id === employee._id
            ? employee
            : item
        )
      );
    } else {
      setEmployees((prev) => [
        ...prev,
        employee
      ]);
    }

    setEditingEmployee(null);
    setOpen(false);
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setOpen(true);
  };

  const handleView = (employee: Employee) => {
    setViewEmployee(employee);
    setViewOpen(true);
  };

  const handleNewEmployee = () => {
    setEditingEmployee(null);
    setOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">Employee Master</h1>
          <p className="mt-2 text-muted-foreground">
            Manage employee production and workforce details.
          </p>
        </div>

        <Button onClick={handleNewEmployee}>
          <Plus className="mr-2 h-4 w-4" />
          Add Employee
        </Button>
      </div>

      {/* DAILY ATTENDANCE */}
      <Card className="rounded-xl border">
        <div
          className="flex items-center justify-between p-5 cursor-pointer"
          onClick={() => setAttendanceOpen(!attendanceOpen)}
        >
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            <CardTitle>Daily Attendance</CardTitle>
          </div>

          {attendanceOpen ? <ChevronDown /> : <ChevronRight />}
        </div>

        {attendanceOpen && (
          <CardContent className="space-y-6">
            <AttendanceForm employees={employees} onSave={saveAttendance} />

            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full">
                <thead className="border-b">
                  <tr>
                    <th className="p-3 text-left">Date</th>
                    <th className="p-3 text-left">Employee</th>
                    <th className="p-3 text-left">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {attendance
                    .filter((item) => item.date === attendanceDate)
                    .map((item) => (
                      <tr key={item.id} className="border-b">
                        <td className="p-3">{item.date}</td>
                        <td className="p-3">{item.employeeName}</td>
                        <td className="p-3">
                          <Badge>{item.status}</Badge>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        )}
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingEmployee ? "Edit Employee" : "Add Employee"}
            </DialogTitle>
          </DialogHeader>

          <EmployeeForm
            editingEmployee={editingEmployee}
            onSave={handleSave}
          />
        </DialogContent>
      </Dialog>

      {/* EMPLOYEE PRODUCTION REPORT */}
      <Card className="rounded-xl border">
        <div
          className="flex items-center justify-between p-5 cursor-pointer"
          onClick={() => setProductionReportOpen(!productionReportOpen)}
        >
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            <CardTitle>Employee Production Report</CardTitle>
          </div>

          {productionReportOpen ? <ChevronDown /> : <ChevronRight />}
        </div>

        {productionReportOpen && (
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="text-sm font-medium">From Date</label>
                <Input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Till Date</label>
                <Input
                  type="date"
                  value={tillDate}
                  onChange={(e) => setTillDate(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Select Employee</label>
                <select
                  className="h-10 w-full rounded-md border px-3"
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                >
                  <option>All</option>
                  {employees.map((emp) => (
                    <option key={emp._id} value={emp.name}>
                      {emp.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <Card className="rounded-xl border">
                <CardContent className="p-5">
                  <p className="text-sm text-muted-foreground">Total Lots</p>
                  <h2 className="text-3xl font-bold">
                    {employeeProduction.totalLots}
                  </h2>
                </CardContent>
              </Card>

              <Card className="rounded-xl border">
                <CardContent className="p-5">
                  <p className="text-sm text-muted-foreground">
                    Total Production
                  </p>
                  <h2 className="text-3xl font-bold">
                    {employeeProduction.totalProduction}
                  </h2>
                </CardContent>
              </Card>

              <Card className="rounded-xl border">
                <CardContent className="p-5">
                  <p className="text-sm text-muted-foreground">Total Hours</p>
                  <h2 className="text-3xl font-bold">
                    {employeeProduction.totalHours}
                  </h2>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        )}
      </Card>

      {/* EMPLOYEE LIST */}
      <Card className="rounded-xl border">
        <div
          className="flex items-center justify-between p-5 cursor-pointer"
          onClick={() => setEmployeeListOpen(!employeeListOpen)}
        >
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            <CardTitle>Employee List</CardTitle>
          </div>

          {employeeListOpen ? <ChevronDown /> : <ChevronRight />}
        </div>

        {employeeListOpen && (
          <CardContent>
            <div className="mb-5 relative max-w-sm">
              <Search className="absolute left-3 top-3 h-4 w-4" />
              <Input
                className="pl-9"
                placeholder="Search employee..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr>
                    <th className="py-3 text-left">Name</th>
                    <th className="text-left">Type</th>
                    <th className="text-left">Phone</th>
                    <th className="text-left">Aadhaar</th>
                    <th className="text-left">Bank</th>
                    <th className="text-left">Status</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredEmployees.map((employee) => (
                    <tr key={employee._id} className="border-b">
                      <td className="py-4 font-medium">{employee.name}</td>
                      <td>
                        <Badge>{employee.role}</Badge>
                      </td>
                      <td>{employee.phone}</td>
                      <td>[Aadhaar Redacted]</td>
                      <td>{employee.bankName}</td>
                      <td>
                        <Badge>{employee.status}</Badge>
                      </td>
                      <td>
                        <div className="flex justify-end gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => handleView(employee)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => handleEdit(employee)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>

                          <Button
                            size="icon"
                            variant="destructive"
                            onClick={() => deleteEmployee(employee._id!)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        )}
      </Card>

      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Employee Details</DialogTitle>
          </DialogHeader>

          {viewEmployee && (
            <div className="space-y-3">
              <p><b>Name:</b> {viewEmployee.name}</p>
              <p><b>Type:</b> {viewEmployee.role}</p>
              <p><b>Phone:</b> {viewEmployee.phone}</p>
              <p><b>Address:</b> {viewEmployee.address}</p>
              <p><b>Joining Date:</b> {viewEmployee.joiningDate}</p>
              <p>
                <b>Aadhaar:</b> [Aadhaar Redacted]</p>
              <p><b>Account Number:</b> {viewEmployee.accountNumber || "-"}</p>
              <p><b>Bank:</b> {viewEmployee.bankName || "-"}</p>
              <p><b>Branch:</b> {viewEmployee.branch || "-"}</p>
              <p><b>IFSC:</b> {viewEmployee.ifscCode || "-"}</p>
              <p><b>Status:</b> {viewEmployee.status}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default EmployeeMaster;