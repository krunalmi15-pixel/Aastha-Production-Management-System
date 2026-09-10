import { useEffect, useState } from "react";

import { employeeAPI } from "@/services/api";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import type { Employee } from "@/types/Employee";
import type { Attendance } from "@/types/Attendance";


type Props = {
  employees: Employee[];
  onSave: (attendance: Attendance[]) => void;
};


function AttendanceForm({
  employees,
  onSave,
}: Props) {


  const today = new Date()
    .toISOString()
    .split("T")[0];


  const [date, setDate] = useState(today);

  const [search, setSearch] = useState("");

  const [attendance, setAttendance] = useState<Attendance[]>([]);



  useEffect(() => {

    setAttendance(
      employees.map((emp) => ({

        id: Date.now(),

        employeeId: emp._id!,

        employeeName: emp.name,

        date: today,

        status: "Present",

        createdAt: new Date().toISOString(),

        updatedAt: new Date().toISOString(),

      }))
    );

  }, [employees]);





  const updateStatus = (
    employeeId: string,
    status:
      | "Present"
      | "Absent"
      | "Half Day"
  ) => {


    setAttendance((prev) =>

      prev.map((item) =>

        item.employeeId === employeeId

          ? {

              ...item,

              date,

              status,

              updatedAt:
                new Date().toISOString(),

            }

          : item

      )

    );

  };





  const save = async () => {


    try {


      const savedAttendance = await Promise.all(

        attendance.map((item) =>

          employeeAPI.attendance.create({

            employeeId: item.employeeId,

            employeeName: item.employeeName,

            date: item.date,

            status: item.status,

          })

        )

      );


      onSave(savedAttendance);


      alert(
        "Attendance Saved Successfully"
      );


    } catch(error) {


      console.error(
        "Attendance save failed",
        error
      );


      alert(
        "Failed to save attendance"
      );


    }

  };





  const filteredAttendance =
    attendance.filter((item) =>

      item.employeeName
        .toLowerCase()
        .includes(search.toLowerCase())

    );






  return (

    <div className="space-y-5">


      <div>

        <Label>
          Attendance Date
        </Label>


        <input

          type="date"

          className="h-10 w-full rounded-md border px-3"

          value={date}

          onChange={(e)=>{

            setDate(e.target.value);


            setAttendance((prev)=>

              prev.map((item)=>({

                ...item,

                date:e.target.value

              }))

            );

          }}

        />

      </div>





      <div className="relative max-w-sm">


        <input

          className="h-10 w-full rounded-md border px-3"

          placeholder="Search employee..."

          value={search}

          onChange={(e)=>

            setSearch(e.target.value)

          }

        />


      </div>






      <div className="rounded-lg border">


        <table className="w-full">


          <thead className="border-b">

            <tr>

              <th className="p-3 text-left">
                Employee
              </th>


              <th className="p-3 text-left">
                Status
              </th>


            </tr>

          </thead>





          <tbody>


            {filteredAttendance.map((item)=>(


              <tr

                key={item.employeeId}

                className="border-b"

              >


                <td className="p-3">

                  {item.employeeName}

                </td>





                <td className="p-3">


                  <select

                    className="h-9 rounded-md border px-3"

                    value={item.status}

                    onChange={(e)=>

                      updateStatus(

                        item.employeeId,

                        e.target.value as
                        | "Present"
                        | "Absent"
                        | "Half Day"

                      )

                    }

                  >


                    <option>
                      Present
                    </option>


                    <option>
                      Absent
                    </option>


                    <option>
                      Half Day
                    </option>


                  </select>


                </td>


              </tr>


            ))}


          </tbody>


        </table>


      </div>





      <Button onClick={save}>

        Save Attendance

      </Button>



    </div>

  );

}


export default AttendanceForm;