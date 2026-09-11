import { useEffect, useState } from "react";

import type { Employee } from "@/types/Employee";
import { employeeAPI } from "@/services/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  editingEmployee?: Employee | null;
  onSave: (employee: Employee) => void;
};

function EmployeeForm({ editingEmployee, onSave }: Props) {
  const [form, setForm] = useState<Employee>({
    id: Date.now(),
    name: "",
    phone: "",
    address: "",
    joiningDate: new Date().toISOString().split("T")[0],
    role: "Operator",
    aadhaar: "",
    accountNumber: "",
    bankName: "",
    branch: "",
    ifscCode: "",
    status: "Active",
  });

  useEffect(() => {
    if (editingEmployee) {
      setForm({
        ...editingEmployee,
        role: editingEmployee.role || "Operator",
        aadhaar:
          editingEmployee.aadhaar || "",
        accountNumber:
          editingEmployee.accountNumber || "",
        bankName:
          editingEmployee.bankName || "",
        branch:
          editingEmployee.branch || "",
        ifscCode:
          editingEmployee.ifscCode || "",
      });
    }
  }, [editingEmployee]);

  const update = (field: keyof Employee, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let savedEmployee;

      const employeeData = {
        name: form.name,
        phone: form.phone,
        address: form.address,
        joiningDate: form.joiningDate,
        role: form.role,
        aadhaar: form.aadhaar,
        accountNumber: form.accountNumber,
        bankName: form.bankName,
        branch: form.branch,
        ifscCode: form.ifscCode,
        status: form.status,
      };
      
      console.log("EMPLOYEE DATA SENT:", employeeData);

      if (editingEmployee && editingEmployee._id) {
        savedEmployee = await employeeAPI.update(
          editingEmployee._id,
          employeeData
        );

        alert("Employee Updated Successfully");
      } else {
        savedEmployee = await employeeAPI.create(
          employeeData
        );

        alert("Employee Added Successfully");
      }

      onSave(savedEmployee);
    } catch (error) {
      console.error(
        "Employee save failed",
        error
      );

      alert(
        "Failed to save employee"
      );
    }
  };

  return (
    <form onSubmit={submit} className="grid grid-cols-2 gap-5">
      <div>
        <Label>Name</Label>
        <Input
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          placeholder="Employee name"
        />
      </div>

      <div>
        <Label>Phone</Label>
        <Input
          value={form.phone}
          onChange={(e) => update("phone", e.target.value)}
          placeholder="Phone number"
        />
      </div>

      <div className="col-span-2">
        <Label>Address</Label>
        <Input
          value={form.address}
          onChange={(e) => update("address", e.target.value)}
          placeholder="Address"
        />
      </div>

      <div>
        <Label>Joining Date</Label>
        <Input
          type="date"
          value={form.joiningDate}
          onChange={(e) => update("joiningDate", e.target.value)}
        />
      </div>

      <div>
        <Label>Employee Type</Label>
        <select
          className="h-10 w-full rounded-md border px-3"
          value={form.role || ""}
          onChange={(e) =>
            update("role", e.target.value)
          }
        >
          <option value="">
            Select Type
          </option>
          <option value="Operator">
            Operator
          </option>
          <option value="Cutter">
            Cutter
          </option>
        </select>
      </div>

      <div>
        <Label>Aadhaar Card No</Label>
        <Input
          value={form.aadhaar || ""}
          onChange={(e) => update("aadhaar", e.target.value)}
          placeholder="Aadhaar number"
        />
      </div>

      <div>
        <Label>Account Number</Label>
        <Input
          value={form.accountNumber}
          onChange={(e) => update("accountNumber", e.target.value)}
          placeholder="Bank account number"
        />
      </div>

      <div>
        <Label>Bank Name</Label>
        <Input
          value={form.bankName}
          onChange={(e) => update("bankName", e.target.value)}
          placeholder="Bank name"
        />
      </div>

      <div>
        <Label>Branch</Label>
        <Input
          value={form.branch}
          onChange={(e) => update("branch", e.target.value)}
          placeholder="Branch"
        />
      </div>

      <div>
        <Label>IFSC Code</Label>
        <Input
          value={form.ifscCode}
          onChange={(e) => update("ifscCode", e.target.value)}
          placeholder="IFSC code"
        />
      </div>

      <div>
        <Label>Status</Label>
        <select
          className="h-10 w-full rounded-md border px-3"
          value={form.status}
          onChange={(e) => update("status", e.target.value)}
        >
          <option>Active</option>
          <option>Inactive</option>
        </select>
      </div>

      <div className="col-span-2 flex justify-end pt-3">
        <Button type="submit">
          {editingEmployee ? "Update Employee" : "Add Employee"}
        </Button>
      </div>
    </form>
  );
}

export default EmployeeForm;