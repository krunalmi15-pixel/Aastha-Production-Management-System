import express from "express";
import path from "path";
import fs from "fs";

import Lot from "../models/Lot";
import Production from "../models/Production";
import { printLabel } from "../services/barTenderService";

const router = express.Router();


// GET ALL LOTS

router.get("/", async(req,res)=>{

  try{

    const lots = await Lot.find();

    res.json(lots);

  }
  catch(error){

    res.status(500).json({
      message:"Failed to fetch lots"
    });

  }

});




// GET CREATED LOTS

router.get("/created", async(req,res)=>{

  try{

    const lots = await Lot.find({
      status:"Created"
    });

    res.json(lots);

  }
  catch(error){

    res.status(500).json({
      message:"Failed to fetch created lots"
    });

  }

});




// COMPLETED LOTS WITH DATE FILTER
router.get("/completed", async(req,res)=>{
  try{
    const filter:any = {
      status:"Completed"
    };

    if(req.query.date){
      filter.scanDate = req.query.date;
    }

    const lots = await Lot.find(filter);
    res.json(lots);
  }
  catch(error){
    console.error(error);
    res.status(500).json({
      message:"Failed to fetch completed lots"
    });
  }
});




// GET NEXT LOT NUMBER
router.get("/next-number", async(req,res)=>{

  try{

    const month = new Date()
      .toLocaleString(
        "en-US",
        {
          month:"short"
        }
      )
      .toUpperCase();


    const lastLot = await Lot.findOne({

      lotNumber:{
        $regex:`^${month}`
      }

    })
    .sort({

      lotNumber:-1

    });



    let nextNumber = 1;


    if(lastLot){

      const lastNumber =
      parseInt(
        lastLot.lotNumber.slice(3)
      );


      nextNumber = lastNumber + 1;

    }



    const lotNumber =
    `${month}${String(nextNumber).padStart(3,"0")}`;



    res.json({

      lotNumber,

      barcode:lotNumber

    });


  }
  catch(error){

    console.error(error);

    res.status(500).json({

      message:"Failed to generate lot number"

    });

  }

});




// CREATE LOT

router.post("/", async(req,res)=>{

  try{

    const month = new Date()
      .toLocaleString(
        "en-US",
        {
          month:"short"
        }
      )
      .toUpperCase();


    const lastLot = await Lot.findOne({

      lotNumber:{

        $regex:`^${month}`

      }

    })
    .sort({

      lotNumber:-1

    });


    let nextNumber = 1;


    if(lastLot){

      const lastNumber =
      parseInt(
        lastLot.lotNumber.slice(3)
      );


      nextNumber =
      lastNumber + 1;

    }


    const lotNumber =
    `${month}${String(nextNumber).padStart(3,"0")}`;



    const lot = await Lot.create({

      itemId:req.body.itemId,

      startDate:req.body.startDate,

      quality:req.body.quality,

      number:req.body.number,

      percentage:req.body.percentage,

      quantity:req.body.quantity,

      lotNumber,

      barcode:lotNumber,

      status:"Created"

    });



    res.status(201).json(lot);


  }
  catch(error){

    res.status(500).json({

      message:"Failed to create lot"

    });

  }

});




// GET LOT BY LOT NUMBER / BARCODE

router.get("/:lotNumber", async(req,res)=>{

  try{

    const lot = await Lot.findOne({

      $or:[

        {
          lotNumber:req.params.lotNumber
        },

        {
          barcode:req.params.lotNumber
        }

      ]

    });


    if(!lot){

      return res.status(404).json({
        message:"Lot not found"
      });

    }


    res.json(lot);

  }
  catch(error){

    res.status(500).json({
      message:"Failed to fetch lot"
    });

  }

});




// PRINT LOT LABEL DATA

router.post("/:id/print", async(req,res)=>{

  try{


    const lot = await Lot.findById(
      req.params.id
    );


    if(!lot){

      return res.status(404).json({

        message:"Lot not found"

      });

    }



    const templatePath = path.join(

      process.cwd(),

      "templates",

      "LotLabel.btw"

    );



    if(!fs.existsSync(templatePath)){


      return res.status(400).json({

        message:"BarTender template not found"

      });


    }



    const printerName =
    "Zebra Printer";



    await printLabel(
      templatePath,
      printerName,
      {
        lotNumber: lot.lotNumber,
        quality: lot.quality,
        number: lot.number,
        percentage: lot.percentage,
        quantity: lot.quantity,
        barcode: lot.barcode
      }
    );



    res.json({


      message:"Print data prepared",


      data:{


        templatePath,

        printerName,


        lotNumber:lot.lotNumber,

        quality:lot.quality,

        number:lot.number,

        percentage:lot.percentage,

        quantity:lot.quantity,

        barcode:lot.barcode


      }


    });



  }
  catch(error){


    console.error(
      "PRINT ERROR:",
      error
    );


    res.status(500).json({

      message:"Print preparation failed"

    });


  }


});




// UPDATE LOT
router.put("/:id", async(req,res)=>{

  try{

    const lot = await Lot.findById(
      req.params.id
    );

    if(!lot){

      return res.status(404).json({
        message:"Lot not found"
      });

    }

    const updatedLot = await Lot.findByIdAndUpdate(

      req.params.id,

      {
        itemId:req.body.itemId,
        quality:req.body.quality,
        number:req.body.number,
        percentage:req.body.percentage,
        quantity:req.body.quantity,
        startDate:req.body.startDate,
        scanDate:req.body.scanDate,
        status:req.body.status
      },

      {
        new:true
      }

    );

    // Sync production also
    await Production.updateMany(

      {
        lotId: lot._id
      },

      {
        itemId:req.body.itemId,
        quantity:req.body.quantity
      }

    );

    res.json(updatedLot);

  }
  catch(error){

    console.error(error);

    res.status(500).json({
      message:"Failed to update lot"
    });

  }

});




// DELETE LOT WITH RELATED PRODUCTION
router.delete("/:id", async(req,res)=>{

  try{

    const lot = await Lot.findById(
      req.params.id
    );


    if(!lot){

      return res.status(404).json({
        message:"Lot not found"
      });

    }


    await Production.deleteMany({
      lotId: lot._id
    });


    await Lot.findByIdAndDelete(
      req.params.id
    );


    res.json({
      message:"Lot and production deleted"
    });


  }
  catch(error){

    console.error(error);

    res.status(500).json({
      message:"Failed to delete lot"
    });

  }

});


export default router;