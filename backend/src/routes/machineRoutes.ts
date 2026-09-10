import express from "express";
import mongoose from "mongoose";
import Machine from "../models/Machine";
import Production from "../models/Production";

const router = express.Router();


// GET ALL MACHINES

router.get("/", async (req, res) => {

  try {

    const machines = await Machine.find();

    res.json(machines);

  } catch (error) {

    res.status(500).json({
      message: "Failed to fetch machines",
    });

  }

});




// CREATE MACHINE

router.post("/", async (req, res) => {

  try {

    const machine = await Machine.create(
      req.body
    );

    res.status(201).json(machine);

  } catch (error) {

    res.status(500).json({
      message: "Failed to create machine",
    });

  }

});




// UPDATE MACHINE

router.put("/:id", async (req, res) => {

  try {

    const machine =
      await Machine.findByIdAndUpdate(

        req.params.id,

        req.body,

        {
          new: true,
        }

      );


    res.json(machine);

  } catch (error) {

    res.status(500).json({
      message: "Failed to update machine",
    });

  }

});




// DELETE MACHINE

router.delete("/:id", async (req, res) => {

  try {

    await Machine.findByIdAndDelete(
      req.params.id
    );


    res.json({
      message: "Machine deleted",
    });


  } catch (error) {

    res.status(500).json({
      message: "Failed to delete machine",
    });

  }

});


// =====================================
// MACHINE PRODUCTION SUMMARY
// =====================================
router.get("/production/:machineId", async (req, res) => {

  try {

    console.log("PARAMS:", req.params);
    console.log("QUERY:", req.query);

    const { machineId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(machineId)) {
      return res.status(400).json({
        message: "Invalid machine id"
      });
    }

    const { from, to } = req.query;

    const machine = await Machine.findById(
      req.params.machineId
    );

    console.log("SELECTED MACHINE:", machine);
    
    if(!machine){

     return res.status(404).json({

       message:"Machine not found"

     });

    }
    
    const filter:any = {

     status:"Completed",

     scanDate:{
       $gte:from,
       $lte:to
     }

    };
    
    if(machine.type === "Slider"){

     filter.machineId =
     machine._id;

    }
    
    if(machine.type === "Cutter"){

     filter.cutterMachineId =
     machine._id;

    }


    console.log("FINAL FILTER:", filter);
    console.log("MACHINE TYPE:", req.query.type);
    console.log("MACHINE ID:", req.params.machineId);
    
    const productions =
      await Production.find(filter);
    console.log("FOUND PRODUCTIONS:", productions);


    const totalProduction =
      productions.reduce(

        (sum: any, item: any) =>

          sum + Number(item.quantity || 0),

        0

      );


    const totalLots =
      new Set(

        productions.map(
          (item: any) => item.lotNumber
        )

      ).size;



    console.log("FOUND DATA:", productions);
    res.json({

      totalProduction,

      totalLots,

      records: productions.length

    });


  }

  catch (error) {

    console.error(error);

    res.status(500).json({

      message: "Machine production summary failed"

    });

  }

});



export default router;