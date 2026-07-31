import express from "express";
import Department from "../models/Department.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

// @desc    Get all departments
// @route   GET /api/departments
// @access  Private
router.get("/", protect, async (req, res) => {
  try {
    const departments = await Department.find({}).sort({ name: 1 });
    return res.json(departments);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// @desc    Create a new department
// @route   POST /api/departments
// @access  Private/Admin
router.post("/", protect, authorize("admin"), async (req, res) => {
  const { name, code } = req.body;

  try {
    const deptExists = await Department.findOne({ code: code.toUpperCase() });
    if (deptExists) {
      return res.status(400).json({ message: "Department already exists with this code" });
    }

    const department = await Department.create({
      name,
      code: code.toUpperCase(),
    });
    return res.status(201).json(department);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default router;
