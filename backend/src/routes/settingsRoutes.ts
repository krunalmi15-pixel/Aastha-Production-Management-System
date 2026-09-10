import express from "express";
import Settings from "../models/Settings";


const router = express.Router();



// GET SETTINGS

router.get("/", async(req,res)=>{


  try{


    let settings = await Settings.findOne();



    if(!settings){


      settings = await Settings.create({});


    }



    res.json(settings);



  }

  catch(error){


    res.status(500).json({

      message:"Failed to fetch settings"

    });


  }



});








// UPDATE SETTINGS

router.put("/", async(req,res)=>{


  try{


    let settings = await Settings.findOne();



    if(!settings){


      settings = new Settings(req.body);


    }

    else{


      Object.assign(

        settings,

        req.body

      );


    }




    await settings.save();



    res.json(settings);



  }


  catch(error){


    res.status(500).json({

      message:"Failed to update settings"

    });


  }



});





export default router;