import mongoose, { Schema, Document } from "mongoose";



export interface IProduction extends Document {


  lotId: mongoose.Types.ObjectId;


  lotNumber: string;


  itemId?: string;



  machineId: mongoose.Types.ObjectId;


  operatorId: mongoose.Types.ObjectId;



  cutterMachineId?: mongoose.Types.ObjectId;


  cutterOperatorId?: mongoose.Types.ObjectId;



  cutType?: string;



  scanDate: string;



  quantity: number;



  status:
  | "Completed";


}







const ProductionSchema = new Schema<IProduction>(

{


  lotId: {

    type: mongoose.Schema.Types.ObjectId,

    ref: "Lot",

    required: true,

  },




  lotNumber: {

    type: String,

    required: true,

  },





  itemId: {

    type: String,

  },







  machineId: {

    type: Schema.Types.ObjectId,

    ref: "Machine",

    required: true,

  },







  operatorId: {

    type: Schema.Types.ObjectId,

    ref: "Employee",

    required: true,

  },







  cutterMachineId: {

    type: Schema.Types.ObjectId,

    ref: "Machine",

  },







  cutterOperatorId: {

    type: Schema.Types.ObjectId,

    ref: "Employee",

  },







  cutType: {

    type: String,

  },







  scanDate: {

    type: String,

    required: true,

  },







  quantity: {

    type: Number,

    required: true,

  },







  status: {

    type: String,

    enum: [

      "Completed"

    ],

    default: "Completed",

  },





},


{


timestamps:true,


}

);







export default mongoose.model<IProduction>(

"Production",

ProductionSchema

);