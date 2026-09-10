import express from "express";
import Attendance from "../models/Attendance";

const router = express.Router();


// GET ALL ATTENDANCE
router.get("/", async (req, res) => {
  try {
    const attendance = await Attendance.find();
    res.json(attendance);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch attendance",
    });
  }
});


// CREATE ATTENDANCE
router.post("/", async (req, res) => {
  try {
    const attendance = await Attendance.create(req.body);
    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({
      message: "Failed to save attendance",
    });
  }
});


// DELETE ATTENDANCE
router.delete("/:id", async (req, res) => {
  try {
    await Attendance.findByIdAndDelete(req.params.id);

    res.json({
      message: "Attendance deleted",
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to delete attendance",
    });
  }
});


export default router;