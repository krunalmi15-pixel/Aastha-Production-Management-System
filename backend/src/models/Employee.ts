import mongoose, { Schema, Document } from "mongoose";


export interface IEmployee extends Document {

  name: string;

  phone: string;

  address: string;

  joiningDate: string;


  aadhaar?: string;

  accountNumber?: string;

  bankName?: string;

  branch?: string;

  ifscCode?: string;


  status:
    | "Active"
    | "Inactive";


  createdAt: Date;

  updatedAt: Date;

}



const EmployeeSchema = new Schema<IEmployee>(

{

  name: {

    type: String,

    required: true,

  },


  phone: {

    type: String,

    required: true,

  },


  address: {

    type: String,

    required: true,

  },


  joiningDate: {

    type: String,

    required: true,

  },


  aadhaar: {

    type: String,

  },


  accountNumber: {

    type: String,

  },


  bankName: {

    type: String,

  },


  branch: {

    type: String,

  },


  ifscCode: {

    type: String,

  },


  status: {

    type: String,

    enum: [

      "Active",

      "Inactive"

    ],

    default: "Active",

  },


},

{

  timestamps:true,

}

);



export default mongoose.model<IEmployee>(

"Employee",

EmployeeSchema

);