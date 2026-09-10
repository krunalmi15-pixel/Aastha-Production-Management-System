import express from "express";

import Production from "../models/Production";
import Employee from "../models/Employee";
import Machine from "../models/Machine";
import Lot from "../models/Lot";


const router = express.Router();



// =============================
// MAIN DASHBOARD DATA
// =============================

router.get("/", async(req,res)=>{

  try{


    const totalProduction =

    await Production.aggregate([

      {
        $match:{
          status:"Completed"
        }
      },


      {
        $group:{

          _id:null,

          totalQuantity:{

            $sum:"$quantity"

          }

        }

      }

    ]);





    const completedLots = await Production.distinct(
      "lotNumber",
      {
        status:"Completed"
      }
    );





    const activeEmployees =

    await Employee.countDocuments({

      status:"Active"

    });





    const activeMachines =

    await Machine.countDocuments({

      status:"Active"

    });





    const today = new Date()
      .toLocaleDateString("en-CA");





    const todayProduction =

    await Production.aggregate([


      {

        $match:{

          scanDate:today,

          status:"Completed"

        }

      },



      {

        $group:{

          _id:null,

          quantity:{

            $sum:"$quantity"

          }

        }

      }


    ]);







    res.json({

      totalQuantity:

      totalProduction[0]?.totalQuantity || 0,


      completedLots: completedLots.length,


      activeEmployees,


      activeMachines,


      todayProduction:

      todayProduction[0]?.quantity || 0


    });





  }

  catch(error){


    console.error(error);


    res.status(500).json({

      message:"Dashboard data failed"

    });


  }


});









// =============================
// MONTHLY PRODUCTION GRAPH
// =============================


router.get("/monthly-production", async(req,res)=>{


  try{



    const monthlyProduction =

    await Production.aggregate([



      {

        $match:{

          status:"Completed"

        }

      },



      {

        $addFields:{

          monthNumber:{

            $month:{

              $dateFromString:{

                dateString:"$scanDate"

              }

            }

          }

        }

      },



      {

        $group:{

          _id:"$monthNumber",


          production:{

            $sum:"$quantity"

          }


        }

      },



      {

        $sort:{

          _id:1

        }

      }



    ]);







    // Production year starts from November

    const months = [


      "Nov",
      "Dec",
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct"


    ];







    const monthMap:any = {


      Jan:1,

      Feb:2,

      Mar:3,

      Apr:4,

      May:5,

      Jun:6,

      Jul:7,

      Aug:8,

      Sep:9,

      Oct:10,

      Nov:11,

      Dec:12


    };







    const result = months.map((month)=>{



      const found = monthlyProduction.find(

        (item)=>

        item._id === monthMap[month]

      );




      return {


        month,


        production:


        found

        ?

        found.production

        :

        0


      };



    });







    res.json(result);



  }


  catch(error){


    console.error(error);


    res.status(500).json({

      message:"Monthly production failed"

    });


  }



});







export default router;