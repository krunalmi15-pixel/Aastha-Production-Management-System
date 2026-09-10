import express from "express";

import Production from "../models/Production";

const router = express.Router();

// EMPLOYEE PERFORMANCE SUMMARY
router.get("/employees", async (req, res) => {
  try {
    const summary = await Production.aggregate([
      {
        $group: {
          _id: "$operatorId",
          totalQuantity: { $sum: "$quantity" },
          totalLots: { $count: {} },
        },
      },
      {
        $lookup: {
          from: "employees",
          localField: "_id",
          foreignField: "_id",
          as: "employee",
        },
      },
      {
        $unwind: "$employee",
      },
      {
        $project: {
          _id: 0,
          employeeName: "$employee.name",
          phone: "$employee.phone",
          totalQuantity: 1,
          totalLots: 1,
        },
      },
    ]);

    res.json(summary);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get employee summary",
    });
  }
});

// MACHINE PERFORMANCE SUMMARY
router.get("/machines", async (req, res) => {
  try {
    const summary = await Production.aggregate([
      {
        $group: {
          _id: "$machineId",
          totalQuantity: { $sum: "$quantity" },
          totalLots: { $count: {} },
        },
      },
      {
        $lookup: {
          from: "machines",
          localField: "_id",
          foreignField: "_id",
          as: "machine",
        },
      },
      {
        $unwind: "$machine",
      },
      {
        $project: {
          _id: 0,
          machineNo: "$machine.machineNo",
          machineName: "$machine.machineName",
          type: "$machine.type",
          totalQuantity: 1,
          totalLots: 1,
        },
      },
    ]);

    res.json(summary);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get machine summary",
    });
  }
});

export default router;