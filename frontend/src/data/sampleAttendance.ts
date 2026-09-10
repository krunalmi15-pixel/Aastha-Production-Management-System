import type { Attendance } from "@/types/Attendance";


const now =
new Date()
.toISOString();



export const sampleAttendance: Attendance[] = [

  {
    id:1,

    date:"2026-08-07",

    employeeId:1,

    employeeName:"Rahul",

    status:"Present",

    createdAt:now,

    updatedAt:now,

  },


  {
    id:2,

    date:"2026-08-07",

    employeeId:2,

    employeeName:"Amit",

    status:"Absent",

    createdAt:now,

    updatedAt:now,

  },


];