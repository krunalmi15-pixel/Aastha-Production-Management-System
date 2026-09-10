import { useEffect, useMemo, useState } from "react";

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import {
  reportAPI,
  attendanceAPI,
  api,
} from "@/services/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import {
  FileSpreadsheet,
  FileDown,
  Search,
  ChevronDown,
  ChevronRight,
} from "lucide-react";


function Reports() {


  const [fromDate, setFromDate] =
    useState("2026-08-01");

  const [tillDate, setTillDate] =
    useState("2026-08-31");


  const [status, setStatus] =
    useState("Completed");


  const [reports, setReports] =
    useState<any[]>([]);



  // TODAY PRODUCTION

  const [todayStatus, setTodayStatus] =
    useState("Completed");

  const [todayDate, setTodayDate] = useState(
    new Date()
      .toISOString()
      .split("T")[0]
  );


  const [todayReports, setTodayReports] =
    useState<any[]>([]);



  // ==========================
  // ATTENDANCE STATES
  // ==========================


  const [attendanceOpen, setAttendanceOpen] =
    useState(false);


  const [attendanceSummaryOpen, setAttendanceSummaryOpen] =
    useState(true);


  const [employeeAttendanceOpen, setEmployeeAttendanceOpen] =
    useState(true);


  const [attendanceData, setAttendanceData] =
    useState<any[]>([]);


  const [attendanceMonth, setAttendanceMonth] =
    useState("2026-08");


  const [selectedEmployee, setSelectedEmployee] =
    useState("All");


  const [attendanceFromDate, setAttendanceFromDate] =
    useState("");


  const [attendanceTillDate, setAttendanceTillDate] =
    useState("");




  // ==========================
  // LOAD PRODUCTION REPORT
  // ==========================


  const loadReports = async () => {

    try {

      const data =
        await reportAPI.getProduction({

          from: fromDate,

          to: tillDate,

          status,

        });


      setReports(data.data || []);


    } catch(error) {

      console.error(error);

    }

  };





  // ==========================
  // LOAD TODAY PRODUCTION
  // ==========================


  const loadTodayProduction = async () => {

    try {


      const res = await api.get("/reports/today", {
        params: {
          status: todayStatus,
          date: todayDate,
        },
      });

      const json = await res.json();

      setTodayReports(
        json.data || []
      );


    } catch(error) {

      console.error(error);

    }

  };





  // ==========================
  // LOAD ATTENDANCE
  // ==========================


  const loadAttendance = async () => {

    try {

      const data = await attendanceAPI.getAll();

      console.log("ATTENDANCE FROM BACKEND:", data);

      setAttendanceData(data || []);

    } catch(error) {

      console.error(
        "Attendance loading failed",
        error
      );

    }

  };





  useEffect(()=>{

    loadReports();

  },[]);




  useEffect(()=>{

    loadTodayProduction();

  },[todayStatus, todayDate]);





  useEffect(()=>{

    loadAttendance();

  },[]);






  // ==========================
  // ATTENDANCE SUMMARY
  // ==========================


  const filteredAttendance = useMemo(()=>{

    return attendanceData.filter(
      (item:any)=>{

        // month filter
        const monthMatch =
        item.date.startsWith(
          attendanceMonth
        );

        // if no date selected
        // ignore date filtering
        const fromMatch =
        attendanceFromDate ?
        item.date >= attendanceFromDate :
        true;

        const tillMatch =
        attendanceTillDate ?
        item.date <= attendanceTillDate :
        true;

        return (
          monthMatch &&
          fromMatch &&
          tillMatch
        );

      }
    );

  },[
    attendanceData,
    attendanceMonth,
    attendanceFromDate,
    attendanceTillDate
  ]);


  const employees = useMemo(()=>{

    const list = Array.from(
      new Set(
        attendanceData.map(
          (item:any)=>item.employeeName
        )
      )
    );


    return list;

  },[attendanceData]);


  const attendanceSummary = useMemo(()=>{

    const result:any = {};

    filteredAttendance.forEach(
      (item:any)=>{

        const date = item.date;

        if(!result[date]){
          result[date] = {
            date,
            present: 0,
            absent: 0,
            halfDay: 0
          };
        }

        if(item.status === "Present")
          result[date].present++;

        if(item.status === "Absent")
          result[date].absent++;

        if(item.status === "Half Day")
          result[date].halfDay++;

      }
    );

    return Object.values(result).sort((a:any, b:any) =>
      a.date.localeCompare(b.date)
    );

  },[
    filteredAttendance
  ]);





  const employeeAttendance = useMemo(()=>{

    const result:any = {};

    filteredAttendance.forEach(
    (item:any)=>{

      if(selectedEmployee !== "All" &&
      item.employeeName !== selectedEmployee
      )
      {
      return;
      }

      if(!result[item.employeeName]){

        result[item.employeeName]={

          present:0,

          absent:0,

          halfDay:0

        };


      }

      if(item.status==="Present")
        result[item.employeeName].present++;

      if(item.status==="Absent")
        result[item.employeeName].absent++;

      if(item.status==="Half Day")
        result[item.employeeName].halfDay++;

    });

    return Object.keys(result).map(
    (employee)=>({

      employee,

      present:result[employee].present,

      absent:result[employee].absent,

      halfDay:result[employee].halfDay

    })

    );

  },[filteredAttendance,selectedEmployee]);





  // ==========================
  // QUALITY SUMMARY
  // ==========================


  const qualitySummary:any =
  useMemo(()=>{


    const summary:any = {};



    reports.forEach((lot:any)=>{


      const quality =
      lot.lotId?.quality ||
      lot.quality ||
      "NA";



      summary[quality] =
      (summary[quality] || 0)
      +
      Number(lot.quantity || 0);


    });



    return summary;


  },[reports]);




  const qualityTotal =
  Object.values(qualitySummary)
  .reduce(
    (sum:number,value:any)=>
    sum + Number(value),
    0
  );



  // ==========================
  // CUTTER SUMMARY
  // ==========================


  const cutterSummary:any =
  useMemo(()=>{


    const summary:any = {};


    reports.forEach((lot:any)=>{


      const cutter =
      lot.cutterOperatorId?.name ||
      "NA";


      summary[cutter] =
      (summary[cutter] || 0)
      +
      Number(lot.quantity || 0);


    });



    return summary;


  },[reports]);






  // ==========================
  // EXPORT EXCEL
  // ==========================


  const exportExcel = () => {


    const worksheet =
    XLSX.utils.json_to_sheet(
      reports.map((item:any)=>({

        Date:
        item.date,

        "Lot Number":
        item.lotNumber,

        Number:
        item.number,

        Percentage:
        item.percentage,

        Quality:
        item.quality,

        Quantity:
        item.quantity,

        "Cutter Machine":
        item.cutterMachine,

        "Cutter Employee":
        item.cutterEmployee,

        "Slider Machine":
        item.sliderMachine,

        Operator:
        item.operator,

        "Cut Type":
        item.cutType,

        Status:
        item.status

      }))
    );



    const workbook =
    XLSX.utils.book_new();



    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Production"
    );



    XLSX.writeFile(
      workbook,
      "Production_Report_${status}_${fromDate}_to_${tillDate}.xlsx"
    );


  };






  // ==========================
  // EXPORT PDF
  // ==========================


  const exportPDF = () => {


    const doc =
    new jsPDF();



    doc.text(
      "Production Report",
      14,
      15
    );doc.setFontSize(11);doc.text(
      `From Date : ${fromDate}`,
      14,
      25
    );doc.text(
      `Till Date : ${tillDate}`,
      14,
      32
    );doc.text(
      `Status : ${status}`,
      14,
      39
    );



    autoTable(
      doc,
      {

        startY:50,


        head:[
          [
            "Date",
            "Lot Number",
            "Number",
            "Percentage",
            "Quality",
            "Quantity",
            "Cutter Machine",
            "Cutter Employee",
            "Slider Machine",
            "Operator",
            "Cut Type",
            "Status"
          ]
        ],


        body:
        reports.map((item:any)=>[
          item.date,
          item.lotNumber,
          item.number,
          item.percentage,
          item.quality,
          item.quantity,
          item.cutterMachine,
          item.cutterEmployee,
          item.sliderMachine,
          item.operator,
          item.cutType,
          item.status
        ])

      }
    );



    doc.save(
      "Production_Report_${status}_${fromDate}_to_${tillDate}.pdf"
    );


  };



  // ==========================
  // EXPORT TODAY EXCEL
  // ==========================

  const exportTodayExcel = () => {

    const worksheetData = todayReports.map((item:any)=>({

      Date: item.date,

      "Lot Number":
        item.lotNumber,

      Number:
        item.number,

      Percentage:
        item.percentage,

      Quality:
        item.quality,

      Quantity:
        item.quantity,

      "Cutter Machine":
        item.cutterMachine,

      "Cutter Employee":
        item.cutterEmployee,

      "Slider Machine":
        item.sliderMachine,

      Operator:
        item.operator,

      "Cut Type":
        item.cutType,

      Status:
        item.status,

    }));


    const worksheet =
      XLSX.utils.json_to_sheet(
        worksheetData
      );


    const workbook =
      XLSX.utils.book_new();


    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Today's Production"
    );


    XLSX.writeFile(
      workbook,
      "Todays_Production_Report.xlsx"
    );

  };





  // ==========================
  // EXPORT TODAY PDF
  // ==========================

  const exportTodayPDF = () => {
    const tableData = todayReports.map((item:any)=>[
      item.date,
      item.lotNumber,
      item.number,
      item.percentage,
      item.quality,
      item.quantity,
      item.cutterMachine,
      item.cutterEmployee,
      item.sliderMachine,
      item.operator,
      item.cutType,
      item.status
    ]);

    const doc = new jsPDF("landscape");
    doc.text("Today's Production Report", 20, 20);

    autoTable(doc, {
      startY: 30,
      head: [
        [
          "Date",
          "Lot Number",
          "Number",
          "Percentage",
          "Quality",
          "Quantity",
          "Cutter Machine",
          "Cutter Employee",
          "Slider Machine",
          "Operator",
          "Cut Type",
          "Status"
        ]
      ],
      body: tableData,
      styles: {
        fontSize: 8
      }
    });

    doc.save("Todays_Production_Report.pdf");
  };



  const exportAttendanceSummaryPDF = () => {

    const doc = new jsPDF();

    doc.setFontSize(18);

    doc.text("Attendance Summary Report", 14, 15);

    doc.setFontSize(12);

    doc.text(`Month : ${attendanceMonth}`, 14, 25);

    autoTable(
      doc,
      {

        startY: 35,

        head: [

          ["Date", "Present", "Absent", "Half Day"]

        ],

        body: attendanceSummary.map(
          (item: any) => [
            item.date,
            item.present,
            item.absent,
            item.halfDay
          ]
        )

      }
    );

    doc.save("Attendance_Summary_Report.pdf");

  };



  const exportEmployeeAttendancePDF = () => {

    const doc = new jsPDF();

    doc.setFontSize(18);

    doc.text("Employee Wise Attendance Report", 14, 15);

    doc.setFontSize(12);

    doc.text(`Month : ${attendanceMonth}`, 14, 25);

    if (selectedEmployee !== "All") {

      doc.text(`Employee : ${selectedEmployee}`, 14, 35);

    }

    autoTable(
      doc,
      {

        startY: selectedEmployee !== "All" ? 45 : 35,

        head: [

          ["Employee", "Present", "Absent", "Half Day"]

        ],

        body: employeeAttendance.map(
          (emp: any) => [
            emp.employee,
            emp.present,
            emp.absent,
            emp.halfDay
          ]
        )

      }
    );

    doc.save("Employee_Wise_Attendance_Report.pdf");

  };








  return (

    <div className="space-y-8">


      <div>

        <h1 className="text-4xl font-bold">
          Reports
        </h1>


        <p className="text-muted-foreground mt-2">
          Production and attendance reports
        </p>


      </div>





      {/* ==========================
          PRODUCTION REPORT
      ========================= */}


      <Collapsible>


        <CollapsibleTrigger
        className="
        w-full flex items-center justify-between
        rounded-xl border px-6 py-5
        text-xl font-semibold
        hover:bg-muted/50
        "
        >


          <span>
            Production Report
          </span>


          <ChevronDown/>


        </CollapsibleTrigger>




        <CollapsibleContent
        className="mt-6 space-y-6"
        >



          <div
          className="
          grid md:grid-cols-4 gap-4
          "
          >


            <div>

              <label>
                From Date
              </label>


              <Input
              type="date"
              value={fromDate}
              onChange={(e)=>
              setFromDate(e.target.value)}
              />

            </div>



            <div>

              <label>
                Till Date
              </label>


              <Input
              type="date"
              value={tillDate}
              onChange={(e)=>
              setTillDate(e.target.value)}
              />

            </div>



            <div>

              <label>
                Status
              </label>

              <select
                className="h-10 border rounded-md px-3 w-full"
                value={status}
                onChange={(e)=>setStatus(e.target.value)}
              >

                <option value="Completed">
                  Completed
                </option>

                <option value="Created">
                  Created
                </option>

                <option value="All">
                  All
                </option>

              </select>

            </div>



            <div className="flex items-end">
              <Button
              className="w-full"
              onClick={loadReports}
              >
                Search
              </Button>
            </div>


          </div>






          <div className="flex gap-3">


            <Button
            onClick={exportExcel}
            >

              <FileSpreadsheet
              className="mr-2 h-4 w-4"
              />

              Excel

            </Button>



            <Button
            onClick={exportPDF}
            >

              <FileDown
              className="mr-2 h-4 w-4"
              />

              PDF

            </Button>



          </div>






          <div
          className="
          grid md:grid-cols-3 gap-4
          "
          >


            <div className="border rounded-xl p-5">

              <p>
                Total Lots
              </p>


              <h2 className="text-2xl font-bold">

                {
                 new Set(
                   reports.map((item:any)=>item.lotNumber)
                 ).size
                }

              </h2>


            </div>




            <div className="border rounded-xl p-5">

              <p>
                Total Production
              </p>


              <h2 className="text-2xl font-bold">

                {
                reports.reduce(
                  (sum:any,item:any)=>sum + Number(item.quantity || 0),0
                )
                }

              </h2>


            </div>




            <div className="border rounded-xl p-5">

              <p>
                Status
              </p>


              <h2 className="text-2xl font-bold">
                {status}
              </h2>


            </div>



          </div>





          <div className="border rounded-xl overflow-auto">


            <table className="w-full">


              <thead className="border-b">


                <tr>


                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Lot Number</th>
                  <th className="p-3 text-left">Number</th>
                  <th className="p-3 text-left">Percentage</th>
                  <th className="p-3 text-left">Quality</th>
                  <th className="p-3 text-left">Quantity</th>
                  <th className="p-3 text-left">Cutter Machine</th>
                  <th className="p-3 text-left">Cutter Employee</th>
                  <th className="p-3 text-left">Slider Machine</th>
                  <th className="p-3 text-left">Operator</th>
                  <th className="p-3 text-left">Cut Type</th>
                  <th className="p-3 text-left">Status</th>


                </tr>


              </thead>



              <tbody>


              {
              reports.map((item:any)=>(


                <tr
                key={item._id}
                className="border-b"
                >


                  <td className="p-3">
                  {item.date}</td><td className="p-3">
                  {item.lotNumber}</td><td className="p-3">
                  {item.number}</td><td className="p-3">
                  {item.percentage}</td><td className="p-3">
                  {item.quality}</td><td className="p-3">
                  {item.quantity}</td><td className="p-3">
                  {item.cutterMachine}</td><td className="p-3">
                  {item.cutterEmployee}</td><td className="p-3">
                  {item.sliderMachine}</td><td className="p-3">
                  {item.operator}</td><td className="p-3">
                  {item.cutType}</td><td className="p-3">
                  {item.status}</td>


                </tr>


              ))
              }


              </tbody>


            </table>


          </div>




        </CollapsibleContent>


      </Collapsible>



      {/* ==========================
          TODAY PRODUCTION
      ========================= */}


      <Collapsible>


        <CollapsibleTrigger
        className="
        w-full flex items-center justify-between
        rounded-xl border px-6 py-5
        text-xl font-semibold
        hover:bg-muted/50
        "
        >


          <span>
            Today's Production
          </span>


          <ChevronDown/>


        </CollapsibleTrigger>




        <CollapsibleContent
        className="mt-6 space-y-6"
        >



          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">

            <div>
              <label className="text-sm font-medium">
                Production Date
              </label>

              <input
                type="date"
                value={todayDate}
                onChange={(e)=>
                  setTodayDate(e.target.value)
                }
                className="border rounded-md p-2 h-10 w-full"
              />
            </div>

            <div>
              <label className="text-sm font-medium block">
                Status
              </label>
              <select
                className="h-10 border rounded-md px-3"
                value={todayStatus}
                onChange={(e)=>setTodayStatus(e.target.value)}
              >
                <option value="Completed">
                  Completed
                </option>
                <option value="Created">
                  Created
                </option>
                <option value="All">
                  All
                </option>
              </select>
            </div>

            <div className="flex gap-3 items-end h-full pt-5">
              <Button
              onClick={exportTodayExcel}
              >
                <FileSpreadsheet
                className="mr-2 h-4 w-4"
                />
                Excel
              </Button>

              <Button
              onClick={exportTodayPDF}
              >
                <FileDown
                className="mr-2 h-4 w-4"
                />
                PDF
              </Button>
            </div>



          </div>





          <div className="border rounded-xl overflow-auto">


            <table className="w-full">


              <thead className="border-b">


                <tr>


                  <th className="p-3 text-left">
                    Date
                  </th>


                  <th className="p-3 text-left">
                    Lot Number
                  </th>


                  <th className="p-3 text-left">
                    Number
                  </th>


                  <th className="p-3 text-left">
                    Percentage
                  </th>


                  <th className="p-3 text-left">
                    Quality
                  </th>


                  <th className="p-3 text-left">
                    Quantity
                  </th>


                  <th className="p-3 text-left">
                    Cutter Machine
                  </th>


                  <th className="p-3 text-left">
                    Cutter Employee
                  </th>


                  <th className="p-3 text-left">
                    Slider Machine
                  </th>


                  <th className="p-3 text-left">
                    Operator
                  </th>


                  <th className="p-3 text-left">
                    Cut Type
                  </th>


                  <th className="p-3 text-left">
                    Status
                  </th>


                </tr>


              </thead>



              <tbody>


              {

              todayReports.map((item:any)=>(


                <tr
                key={item._id}
                className="border-b"
                >


                  <td className="p-3">
                  {item.date}</td><td className="p-3">
                  {item.lotNumber}</td><td className="p-3">
                  {item.number}</td><td className="p-3">
                  {item.percentage}</td><td className="p-3">
                  {item.quality}</td><td className="p-3">
                  {item.quantity}</td><td className="p-3">
                  {item.cutterMachine}</td><td className="p-3">
                  {item.cutterEmployee}</td><td className="p-3">
                  {item.sliderMachine}</td><td className="p-3">
                  {item.operator}</td><td className="p-3">
                  {item.cutType}</td><td className="p-3">
                  {item.status}</td>



                </tr>


              ))

              }



              </tbody>


            </table>


          </div>




        </CollapsibleContent>


      </Collapsible>







      {/* ==========================
          ATTENDANCE REPORT
      ========================= */}


      <Collapsible>



        <CollapsibleTrigger

        onClick={()=>setAttendanceOpen(!attendanceOpen)}

        className="
        w-full flex items-center justify-between
        rounded-xl border px-6 py-5
        text-xl font-semibold
        hover:bg-muted/50
        "

        >


          <span>
            Attendance Report
          </span>



          {
          attendanceOpen
          ?
          <ChevronDown/>
          :
          <ChevronRight/>
          }



        </CollapsibleTrigger>





        <CollapsibleContent
        className="mt-6 space-y-6"
        >


          <div className="flex flex-col md:flex-row gap-4 items-start md:items-end mb-6">
            <div className="w-full md:w-auto">
              <label className="text-sm font-medium">
                Attendance Month
              </label>
              <Input
              type="month"
              value={attendanceMonth}
              onChange={(e)=>
                setAttendanceMonth(e.target.value)
              }
              />
            </div>

            <div className="flex gap-4">
              <Button onClick={exportAttendanceSummaryPDF}>
                <FileDown className="mr-2 h-4 w-4" />
                Attendance Summary PDF
              </Button>
              <Button onClick={exportEmployeeAttendancePDF}>
                <FileDown className="mr-2 h-4 w-4" />
                Employee Attendance PDF
              </Button>
            </div>
          </div>


          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="text-sm font-medium">
                From Date
              </label>
              <Input
              type="date"
              value={attendanceFromDate}
              onChange={(e)=>
                setAttendanceFromDate(e.target.value)
              }
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                Till Date
              </label>
              <Input
              type="date"
              value={attendanceTillDate}
              onChange={(e)=>
                setAttendanceTillDate(e.target.value)
              }
              />
            </div>
          </div>


          <div>
            <Button
            variant="outline"
            onClick={()=>{
              setAttendanceFromDate("");
              setAttendanceTillDate("");
            }}
            >
              Clear Date Filter
            </Button>
          </div>




          {/* GENERAL SUMMARY */}

          <div className="border rounded-xl">



            <div

            onClick={()=>setAttendanceSummaryOpen(
              !attendanceSummaryOpen
            )}

            className="
            flex justify-between items-center
            px-5 py-4 cursor-pointer
          "

            >


              <h2 className="font-semibold text-lg">

                Attendance Summary

              </h2>



              {
              attendanceSummaryOpen
              ?
              <ChevronDown/>
              :
              <ChevronRight/>
              }



            </div>





            {
            attendanceSummaryOpen &&

            <div className="p-5">


              <table className="w-full border">


            <thead className="border-b">


              <tr>


              <th className="p-3 text-left">
                Date
              </th>


              <th className="p-3 text-left">
                Present
              </th>


              <th className="p-3 text-left">
                Absent
              </th>


              <th className="p-3 text-left">
                Half Day
              </th>


              </tr>


          </thead>



          <tbody>


            {attendanceSummary.map((item: any) => (
             <tr key={item.date} className="border-b">
              <td className="p-3">
                {item.date}
              </td>
              <td className="p-3">
                {item.present}
              </td>
              <td className="p-3">
                {item.absent}
              </td>
              <td className="p-3">
                {item.halfDay}
              </td>
             </tr>
          ))}


          </tbody>


          </table>



          </div>

            }



          </div>







          {/* EMPLOYEE WISE */}



          <div className="border rounded-xl">



            <div

            onClick={()=>setEmployeeAttendanceOpen(
              !employeeAttendanceOpen
            )}

            className="
            flex justify-between items-center
            px-5 py-4 cursor-pointer
            "

            >


              <h2 className="font-semibold text-lg">

                Employee Wise Attendance

              </h2>



              {
              employeeAttendanceOpen
              ?
              <ChevronDown/>
              :
              <ChevronRight/>
              }



            </div>






            {

            employeeAttendanceOpen &&


            <div className="p-5 space-y-4">

              <div className="mb-5">
                <label className="text-sm font-medium">
                  Select Employee
                </label>
                <select
                className="
                h-10 rounded-md border px-3 w-full
                "
                value={selectedEmployee}
                onChange={(e)=>setSelectedEmployee(e.target.value)}
                >
                  <option value="All">
                    All Employees
                  </option>
                  {employees.map(
                    (emp:any)=>(
                      <option key={emp} value={emp}>
                        {emp}
                      </option>
                    )
                  )}
                </select>
              </div>


              <table className="w-full border">


            <thead className="border-b">


            <tr>


              <th className="p-3 text-left">
                Employee
              </th>


              <th className="p-3 text-left">
                Present
              </th>


              <th className="p-3 text-left">
                Absent
              </th>


              <th className="p-3 text-left">
                Half Day
              </th>


            </tr>


            </thead>




            <tbody>


            {

            employeeAttendance.map(
            (emp:any)=>(


            <tr
            key={emp.employee}
            className="border-b"
            >


              <td className="p-3">
                {emp.employee}
              </td>


              <td className="p-3">
                {emp.present}
              </td>


              <td className="p-3">
                {emp.absent}
              </td>


              <td className="p-3">
                {emp.halfDay}
              </td>


            </tr>


            )

            )


            }



            </tbody>


            </table>

            </div>


            }



          </div>




        </CollapsibleContent>



      </Collapsible>




  </div>

);

}



export default Reports;