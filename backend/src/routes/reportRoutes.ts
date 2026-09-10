import express from "express";

import Production from "../models/Production";
import Lot from "../models/Lot";

const router = express.Router();


// =====================================
// TODAY COMPLETED REPORT
// =====================================

router.get("/today/completed", async (req, res) => {

  try {

    const today =
      new Date()
        .toISOString()
        .split("T")[0];


    const productions = await Production.find({

      scanDate: today,

      status: "Completed"

    })

    .populate({
      path: "lotId",
      match:{
        status:"Completed"
      }
    })

    .populate("machineId")
    .populate("operatorId")
    .populate("cutterMachineId")
    .populate("cutterOperatorId");



    const lots = productions.filter(
      (item:any)=>item.lotId
    );



    const qualitySummary:any = {};

    const cutterSummary:any = {};



    lots.forEach((item:any)=>{


      const quality =
      item.lotId?.quality || "NA";


      qualitySummary[quality] =
      (qualitySummary[quality] || 0)
      +
      item.quantity;



      const cutter =
      item.cutterOperatorId?.name || "NA";


      cutterSummary[cutter] =
      (cutterSummary[cutter] || 0)
      +
      item.quantity;


    });



    res.json({

      lots,

      qualitySummary:
      Object.keys(qualitySummary)
      .map(key=>({

        quality:key,

        quantity:qualitySummary[key]

      })),



      cutterSummary:
      Object.keys(cutterSummary)
      .map(key=>({

        employee:key,

        quantity:cutterSummary[key]

      })),


      totalProduction:
      lots.reduce(
        (sum:any,item:any)=>
        sum + item.quantity,
        0
      ),


      totalLots:
      lots.length

    });



  }

  catch(error){

    console.error(error);

    res.status(500).json({

      message:"Report generation failed"

    });

  }

});





// =====================================
// DATE RANGE PRODUCTION REPORT
// =====================================

router.get("/production", async(req,res)=>{

try{

const {
 from,
 to,
 status
}=req.query;

let data:any[] = [];

// COMPLETED → Production DB
if(status === "Completed"){

  const productions =
  await Production.find({
    status:"Completed",
    scanDate:{
      $gte:from,
      $lte:to
    }
  })

  .populate("lotId")
  .populate("machineId")
  .populate("operatorId")
  .populate("cutterMachineId")
  .populate("cutterOperatorId");


  data = productions.map((item:any)=>({

    date: item.scanDate,

    lotNumber:
      item.lotNumber ||
      item.lotId?.lotNumber ||
      "-",

    number:
      item.lotId?.number || "-",

    percentage:
      item.lotId?.percentage || "-",

    quality:
      item.lotId?.quality || "-",

    quantity:
      item.quantity || 0,


    cutterMachine:
      item.cutterMachineId?.machineNo || "-",


    cutterEmployee:
      item.cutterOperatorId?.name || "-",


    sliderMachine:
      item.machineId?.machineNo || "-",


    operator:
      item.operatorId?.name || "-",


    cutType:
      item.cutType || "-",


    status:"Completed"

  }));

}
// CREATED → Lot DB
else if(status === "Created"){


  const lots =
  await Lot.find({

    status:"Created",

    startDate:{
      $gte:from,
      $lte:to
    }

  });


  data = lots.map((lot:any)=>({

    date: lot.startDate,

    lotNumber: lot.lotNumber,

    number: lot.number || "-",

    percentage: lot.percentage || "-",


    quality: lot.quality || "-",


    quantity: lot.quantity || 0,


    cutterMachine:"-",

    cutterEmployee:"-",


    sliderMachine:"-",


    operator:"-",


    cutType:"-",


    status:"Created"

  }));

}
// ALL → Both
else if(status === "All"){


 const productions =
 await Production.find({

   status:"Completed",

   scanDate:{
     $gte:from,
     $lte:to
   }

 })

 .populate("lotId")
 .populate("machineId")
 .populate("operatorId")
 .populate("cutterMachineId")
 .populate("cutterOperatorId");



 const lots =
 await Lot.find({

   status:"Created",

   startDate:{
     $gte:from,
     $lte:to
   }

 });



 data = [

    ...lots.map((lot:any)=>({

      date: lot.startDate,

      lotNumber: lot.lotNumber,

      number: lot.number || "-",

      percentage: lot.percentage || "-",

      quality: lot.quality || "-",

      quantity: lot.quantity || 0,

      cutterMachine:"-",

      cutterEmployee:"-",

      sliderMachine:"-",

      operator:"-",

      cutType:"-",

      status:"Created"

    })),


    ...productions.map((item:any)=>({

      date:item.scanDate,

      lotNumber:item.lotNumber || item.lotId?.lotNumber || "-",

      number:item.lotId?.number || "-",

      percentage:item.lotId?.percentage || "-",

      quality:item.lotId?.quality || "-",

      quantity:item.quantity || 0,

      cutterMachine:item.cutterMachineId?.machineNo || "-",

      cutterEmployee:item.cutterOperatorId?.name || "-",

      sliderMachine:item.machineId?.machineNo || "-",

      operator:item.operatorId?.name || "-",

      cutType:item.cutType || "-",

      status:"Completed"

    }))

  ];

}

const totalProduction =

data.reduce(

(sum:any,item:any)=>

sum + Number(item.quantity || 0),

0

);


res.json({

 data,

 totalLots:data.length,

 totalProduction

});


}catch(error){

console.error(error);

res.status(500).json({
 message:"Production report failed"
});

}

});







// =====================================
// TODAY PRODUCTION REPORT
// =====================================


router.get("/today", async (req, res) => {
  try {
    const status: any = req.query.status || "Completed";
    const selectedDate: any = req.query.date || new Date().toISOString().split("T")[0];
    console.log("TODAY QUERY:", req.query);

    let data: any[] = [];

    // COMPLETED → Production DB
    if (status === "Completed") {
      const productions = await Production.find({
        status: "Completed",
        scanDate: selectedDate,
      })
        .populate("lotId")
        .populate("machineId")
        .populate("operatorId")
        .populate("cutterMachineId")
        .populate("cutterOperatorId");

      data = productions.map((item: any) => ({
        date: item.scanDate,
        lotNumber:
          item.lotNumber ||
          item.lotId?.lotNumber ||
          "-",
        number: item.lotId?.number || "-",
        percentage: item.lotId?.percentage || "-",
        quality: item.lotId?.quality || "-",
        quantity: item.quantity || 0,
        cutterMachine: item.cutterMachineId?.machineNo || "-",
        cutterEmployee: item.cutterOperatorId?.name || "-",
        sliderMachine: item.machineId?.machineNo || "-",
        operator: item.operatorId?.name || "-",
        cutType: item.cutType || "-",
        status: "Completed",
      }));
    }
    // CREATED → Lot DB
    else if (status === "Created") {
      const lots = await Lot.find({
        status: "Created",
        startDate: selectedDate,
      });

      console.log("CREATED LOTS:", lots);

      data = lots.map((lot: any) => ({
        date: lot.startDate,
        lotNumber: lot.lotNumber,
        number: lot.number || "-",
        percentage: lot.percentage || "-",
        quality: lot.quality || "-",
        quantity: lot.quantity || 0,
        cutterMachine: "-",
        cutterEmployee: "-",
        sliderMachine: "-",
        operator: "-",
        cutType: "-",
        status: "Created",
      }));
    }
    // ALL → Both
    else if (status === "All") {
      const productions = await Production.find({
        status: "Completed",
        scanDate: selectedDate,
      })
        .populate("lotId")
        .populate("machineId")
        .populate("operatorId")
        .populate("cutterMachineId")
        .populate("cutterOperatorId");

      const lots = await Lot.find({
        status: "Created",
        startDate: selectedDate,
      });

      data = [
        ...lots.map((lot: any) => ({
          date: lot.startDate,
          lotNumber: lot.lotNumber,
          number: lot.number || "-",
          percentage: lot.percentage || "-",
          quality: lot.quality || "-",
          quantity: lot.quantity || 0,
          cutterMachine: "-",
          cutterEmployee: "-",
          sliderMachine: "-",
          operator: "-",
          cutType: "-",
          status: "Created",
        })),
        ...productions.map((item: any) => ({
          date: item.scanDate,
          lotNumber:
            item.lotNumber ||
            item.lotId?.lotNumber ||
            "-",
          number: item.lotId?.number || "-",
          percentage: item.lotId?.percentage || "-",
          quality: item.lotId?.quality || "-",
          quantity: item.quantity || 0,
          cutterMachine: item.cutterMachineId?.machineNo || "-",
          cutterEmployee: item.cutterOperatorId?.name || "-",
          sliderMachine: item.machineId?.machineNo || "-",
          operator: item.operatorId?.name || "-",
          cutType: item.cutType || "-",
          status: "Completed",
        })),
      ];
    }

    const totalProduction = data.reduce(
      (sum: any, item: any) => sum + Number(item.quantity || 0),
      0
    );

    res.json({
      data,
      totalLots: data.length,
      totalProduction,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Today's production failed",
    });
  }
});






export default router;