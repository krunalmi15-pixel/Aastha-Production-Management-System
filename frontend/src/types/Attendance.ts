export interface Attendance {

  id?: number;

  _id?: string;

  employeeId: string;

  employeeName: string;

  date: string;

  status:
    | "Present"
    | "Absent"
    | "Half Day";

  createdAt?: string;

  updatedAt?: string;

}