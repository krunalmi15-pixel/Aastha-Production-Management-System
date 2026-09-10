import mongoose, { Schema, Document } from "mongoose";


export interface IMachine extends Document {


  machineNo:string;


  type:
  | "Slider"
  | "Cutter";


  status:
  | "Active"
  | "Inactive";


}





const MachineSchema = new Schema<IMachine>(

{


machineNo:{

type:String,

required:true,

},




type:{

type:String,

enum:[

"Slider",

"Cutter"

],

required:true,

},




status:{

type:String,

enum:[

"Active",

"Inactive"

],

default:"Active",

},



},


{

timestamps:true,

}

);




// UNIQUE COMBINATION:
// Same number allowed for different types
// Duplicate same type not allowed

MachineSchema.index(

{
 machineNo:1,
 type:1
},

{
 unique:true
}

);






export default mongoose.model<IMachine>(

"Machine",

MachineSchema

);