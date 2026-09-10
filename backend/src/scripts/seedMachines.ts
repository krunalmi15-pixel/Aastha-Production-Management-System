import dotenv from "dotenv";
import mongoose from "mongoose";

import Machine from "../models/Machine";



dotenv.config();



const MONGO_URL = process.env.MONGO_URI as string;






const createMachines = () => {


  const machines:any[] = [];



  // ============================
  // SLIDER MACHINES
  // A1 - F10
  // TOTAL 60
  // ============================


  const sliderLetters = [

    "A",
    "B",
    "C",
    "D",
    "E",
    "F"

  ];



  sliderLetters.forEach((letter)=>{


    for(let i = 1; i <= 10; i++){


      machines.push({

        machineNo: `${letter}${i}`,

        type: "Slider",

        status: "Active"

      });


    }


  });








  // ============================
  // CUTTER MACHINES
  // A1 - G10
  // TOTAL 70
  // ============================


  const cutterLetters = [

    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G"

  ];



  cutterLetters.forEach((letter)=>{


    for(let i = 1; i <= 10; i++){


      machines.push({

        machineNo: `${letter}${i}`,

        type: "Cutter",

        status: "Active"

      });


    }


  });





  console.log(
    "Total machines prepared:",
    machines.length
  );



  console.log(
    "Slider count:",
    machines.filter(
      (m)=>m.type==="Slider"
    ).length
  );



  console.log(
    "Cutter count:",
    machines.filter(
      (m)=>m.type==="Cutter"
    ).length
  );



  return machines;


};








const seedMachines = async()=>{


  try{


    if(!MONGO_URL){

      throw new Error(
        "MONGO_URI missing"
      );

    }




    await mongoose.connect(MONGO_URL);



    console.log(
      "MongoDB Connected"
    );





    await Machine.deleteMany({});



    console.log(
      "Old machines removed"
    );







    const machines = createMachines();





    await Machine.insertMany(

      machines,

      {
        ordered:false
      }

    );





    console.log(
      "Machines inserted successfully"
    );



    await mongoose.disconnect();



    process.exit(0);



  }


  catch(error:any){



    console.error(

      "Seed Error:",

      error.message

    );



    await mongoose.disconnect();



    process.exit(1);



  }



};






seedMachines();