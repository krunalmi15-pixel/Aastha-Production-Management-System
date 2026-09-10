import express from "express";

import Employee from "../models/Employee";



const router = express.Router();





// GET ALL EMPLOYEES

router.get("/", async (req, res) => {


  try {


    const employees = await Employee.find();


    res.json(employees);


  } catch (error) {


    res.status(500).json({

      message: "Failed to fetch employees"

    });


  }


});








// CREATE EMPLOYEE

router.post("/", async (req, res) => {


  try {


    const employee = await Employee.create(

      req.body

    );


    res.status(201).json(employee);



  } catch (error) {


    res.status(500).json({

      message: "Failed to create employee"

    });


  }


});






// UPDATE EMPLOYEE

router.put("/:id", async (req, res) => {


  try {


    const employee = await Employee.findByIdAndUpdate(

      req.params.id,

      req.body,

      {

        new:true

      }

    );


    res.json(employee);



  } catch(error){


    res.status(500).json({

      message:"Failed to update employee"

    });


  }


});







// DELETE EMPLOYEE

router.delete("/:id", async(req,res)=>{


  try{


    await Employee.findByIdAndDelete(

      req.params.id

    );


    res.json({

      message:"Employee deleted"

    });



  }catch(error){


    res.status(500).json({

      message:"Failed to delete employee"

    });


  }


});






export default router;
