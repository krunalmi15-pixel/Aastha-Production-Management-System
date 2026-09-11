import express from "express";
import Production from "../models/Production";
import Lot from "../models/Lot";
import Machine from "../models/Machine";

const router = express.Router();

// GET ALL PRODUCTIONS
router.get("/", async (req, res) => {
  try {
    const productions = await Production.find()
      .populate("machineId")
      .populate("operatorId")
      .populate("cutterMachineId")
      .populate("cutterOperatorId");

    res.json(productions);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch productions",
    });
  }
});

// CREATE PRODUCTION
router.post("/", async (req, res) => {

  try {


    // CHECK SLIDER MACHINE

    const sliderMachine =
      await Machine.findById(
        req.body.machineId
      );


    if(!sliderMachine){

      return res.status(400).json({

        message:"Slider machine not found"

      });

    }



    if(sliderMachine.type !== "Slider"){

      return res.status(400).json({

        message:
        "Selected machine is not a Slider machine"

      });

    }




    // CHECK CUTTER MACHINE

    if(req.body.cutterMachineId){


      const cutterMachine =
        await Machine.findById(
          req.body.cutterMachineId
        );


      if(!cutterMachine){

        return res.status(400).json({

          message:"Cutter machine not found"

        });

      }



      if(cutterMachine.type !== "Cutter"){

        return res.status(400).json({

          message:
          "Selected machine is not a Cutter machine"

        });

      }

    }




    const production =
    await Production.create({

      lotId:req.body.lotId,

      lotNumber:req.body.lotNumber,

      itemId:req.body.itemId,


      machineId:
      sliderMachine._id,


      operatorId:req.body.operatorId,


      cutterMachineId:
      req.body.cutterMachineId || null,


      cutterOperatorId:
      req.body.cutterOperatorId || null,


      cutType:req.body.cutType,


      scanDate:req.body.scanDate,


      quantity:req.body.quantity,

      status:"Completed"

    });





    await Lot.findOneAndUpdate(

      {
        lotNumber:req.body.lotNumber
      },

      {

        status:"Completed",

        scanDate:req.body.scanDate,

      }

    );





    res.status(201).json(production);



  }

  catch(error:any){

    console.error(
      "PRODUCTION CREATE ERROR:",
      error
    );

    res.status(500).json({
      message: error.message
    });

  }

});

// UPDATE PRODUCTION

router.put("/:id", async (req, res) => {

  try {

    const sliderMachine = await Machine.findById(
     req.body.machineId
    );
    if(!sliderMachine || sliderMachine.type !== "Slider"){

     return res.status(400).json({

     message:"Invalid slider machine"

     });

    }
    if(req.body.cutterMachineId){
      const cutterMachine = await Machine.findById(
       req.body.cutterMachineId
      );
      if(!cutterMachine || cutterMachine.type !== "Cutter"){

       return res.status(400).json({

       message:"Invalid cutter machine"

       });

      }

    }

    const updated = await Production.findByIdAndUpdate(

      req.params.id,

      {
        machineId: req.body.machineId,
        operatorId: req.body.operatorId,
        cutterMachineId: req.body.cutterMachineId,
        cutterOperatorId: req.body.cutterOperatorId,
        cutType: req.body.cutType,
        scanDate: req.body.scanDate,
        quantity: req.body.quantity,
      },

      {
        new: true
      }

    );


    res.json(updated);


  } catch(error) {

    console.error(error);

    res.status(500).json({
      message:"Failed to update production"
    });

  }

});

// DELETE PRODUCTION
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Production.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message: "Production deleted",
      deleted
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete production"
    });
  }
});

// GET PRODUCTION BY LOT ID
router.get("/lot/:lotId", async (req, res) => {
  try {
    const production = await Production.findOne({
    lotId: req.params.lotId
  })
      .populate("machineId")
      .populate("operatorId")
      .populate("cutterMachineId")
      .populate("cutterOperatorId");

    res.json(production);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch production"
    });
  }
});

export default router;