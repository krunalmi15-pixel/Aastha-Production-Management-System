import mongoose, { Schema, Document } from "mongoose";



export interface IAttendance extends Document {


  employeeId: string;


  employeeName: string;


  date: string;


  status:
    | "Present"
    | "Absent"
    | "Half Day";



  createdAt: Date;


  updatedAt: Date;


}






const AttendanceSchema = new Schema<IAttendance>(


{

  employeeId: {

    type: String,

    required: true,

  },


  employeeName: {

    type: String,

    required: true,

  },


  date: {

    type: String,

    required: true,

  },


  status: {

    type: String,

    enum: [

      "Present",

      "Absent",

      "Half Day"

    ],

    default: "Present",

  },


},


{

  timestamps: true,

}


);






export default mongoose.model<IAttendance>(

  "Attendance",

  AttendanceSchema

);