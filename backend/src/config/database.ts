import mongoose from "mongoose";


const connectDB = async () => {

  try {


    console.log(
      "MONGO URI:",
      process.env.MONGO_URI
    );


    const conn = await mongoose.connect(
      process.env.MONGO_URI as string
    );


    console.log(
      `MongoDB Connected: ${conn.connection.host}`
    );


  } catch (error) {


    console.error(
      "MongoDB connection failed",
      error
    );


    throw error;


  }

};


export default connectDB;