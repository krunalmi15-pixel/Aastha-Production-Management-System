import mongoose, { Schema, Document } from "mongoose";


export interface IItem extends Document {

  quality: string;

  number: string;

  percentage: number;

  category:
    | "DD"
    | "SH"
    | "AUTO"
    | "DIALIT"
    | "WASSCOVER";

  status:
    | "Active"
    | "Inactive";

}




const ItemSchema = new Schema<IItem>(

{

quality:{
type:String,
required:true,
},


number:{
type:String,
required:true,
},


percentage:{
type:Number,
required:true,
},


category:{
type:String,
enum:[
"DD",
"SH",
"AUTO",
"DIALIT",
"WASSCOVER"
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
timestamps:true
}

);



export default mongoose.model<IItem>(
"Item",
ItemSchema
);