import express from "express";
import Item from "../models/Item";


const router = express.Router();


// GET ALL ITEMS

router.get("/", async(req,res)=>{

  try{

    const items =
    await Item.find();

    res.json(items);

  }catch(error){

    res.status(500).json({
      message:"Failed to fetch items"
    });

  }

});





// CREATE ITEM

router.post("/", async(req,res)=>{

  try{

    const item =
    await Item.create(
      req.body
    );

    res.status(201).json(item);

  }catch(error){

    res.status(500).json({
      message:"Failed to create item"
    });

  }

});





// UPDATE ITEM

router.put("/:id", async(req,res)=>{

  try{

    const item =
    await Item.findByIdAndUpdate(

      req.params.id,

      req.body,

      {
        new:true
      }

    );


    res.json(item);


  }catch(error){

    res.status(500).json({
      message:"Failed to update item"
    });

  }

});





// DELETE ITEM

router.delete("/:id", async(req,res)=>{

  try{

    await Item.findByIdAndDelete(
      req.params.id
    );


    res.json({
      message:"Item deleted"
    });


  }catch(error){

    res.status(500).json({
      message:"Failed to delete item"
    });

  }

});
// BULK CREATE ITEMS

router.post("/bulk", async(req,res)=>{

  try{

    const items =
    await Item.insertMany(
      req.body
    );


    res.status(201).json(items);


  }catch(error){

    res.status(500).json({

      message:"Failed to create bulk items"

    });

  }

});


export default router;