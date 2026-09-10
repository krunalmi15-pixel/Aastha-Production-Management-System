import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import authMiddleware from "../middleware/authMiddleware";

const router = express.Router();


// CREATE FIRST ADMIN / NEW ADMIN
router.post("/create", async(req,res)=>{

  try{

    const {
      name,
      email,
      password
    } = req.body;


    const existing =
    await User.findOne({
      email
    });


    if(existing){

      return res.status(400).json({
        message:"User already exists"
      });

    }


    const hashedPassword =
    await bcrypt.hash(
      password,
      10
    );


    const user =
    await User.create({

      name,

      email,

      password:hashedPassword,

      role:"Admin"

    });


    res.status(201).json({

      message:"Admin created",

      user:{
        id:user._id,
        name:user.name,
        email:user.email
      }

    });


  }
  catch(error){

    console.error(error);

    res.status(500).json({

      message:"Failed to create user"

    });

  }

});




// LOGIN

router.post("/login", async(req,res)=>{

  try{

    const {
      email,
      password
    } = req.body;



    const user =
    await User.findOne({
      email
    });



    if(!user){

      return res.status(401).json({

        message:"Invalid email or password"

      });

    }



    const match =
    await bcrypt.compare(

      password,

      user.password

    );



    if(!match){

      return res.status(401).json({

        message:"Invalid email or password"

      });

    }



    const token =
    jwt.sign(

      {
        id:user._id,
        role:user.role
      },

      process.env.JWT_SECRET as string,

      {
        expiresIn:"1d"
      }

    );



    res.json({

      token,

      user:{
        name:user.name,
        email:user.email,
        role:user.role
      }

    });


  }
  catch(error){

    console.error(error);

    res.status(500).json({

      message:"Login failed"

    });

  }

});


export default router;