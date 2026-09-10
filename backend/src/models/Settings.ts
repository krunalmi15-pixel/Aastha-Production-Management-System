import mongoose, { Schema, Document } from "mongoose";


export interface ISettings extends Document {


  companyName:string;


  logo?:string;


  bartenderTemplatePath:string;


  printerName:string;


  labelSize:string;

  barTenderPath:string;

  templatePath:string;



}



const SettingsSchema = new Schema<ISettings>(


{


companyName:{

type:String,

default:"Aastha Engineering"

},



logo:{

type:String

},




bartenderTemplatePath:{

type:String,

default:""

},




printerName:{

type:String,

default:""

},




labelSize:{

type:String,

default:""

},


barTenderPath: {
  type: String,
  default: ""
},


templatePath: {
  type: String,
  default: ""
}



},


{

timestamps:true

}


);





export default mongoose.model<ISettings>(

"Settings",

SettingsSchema

);