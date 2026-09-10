import { exec } from "child_process";


export const printLabel = async (
  templatePath:string,
  printerName:string,
  data:any
)=>{


  const command = `"${process.env.BARTENDER_PATH || ""}" /F="${templatePath}" /P /D="${JSON.stringify(data)}"`;



  exec(
    command,
    (error,stdout,stderr)=>{


      if(error){

        console.error(
          "BarTender Error:",
          error
        );

        return;

      }


      console.log(
        "BarTender Output:",
        stdout
      );


      console.error(
        stderr
      );


    }
  );



  return {

    success:true,

    message:
    "BarTender print started"

  };


};