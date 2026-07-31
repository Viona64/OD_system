import express from "express";
import LeavePolicy from "../models/LeavePolicy.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

// @desc    Get leave policy for a department/semester
// @route   GET /api/policies
// @access  Private
router.get("/", protect, async (req, res) => {
  const { departmentId, academicYear, semester } = req.query;

  try {
    const year = academicYear ? parseInt(academicYear) : new Date().getFullYear();
    const sem = semester ? parseInt(semester) : 1;

    let policy = null;
    if (departmentId) {
      policy = await LeavePolicy.findOne({
        department: departmentId,
        academicYear: year,
        semester: sem,
      });
    }

    // Fallback to global policy (department = null) if no specific department policy exists
    if (!policy) {
      policy = await LeavePolicy.findOne({
        department: null,
        academicYear: year,
        semester: sem,
      });
    }

    // Default static response if no policy is in DB
    if (!policy) {
      return res.json({
        maxLeavePerSemester: 15,
        maxODPerSemester: 10,
        academicYear: year,
        semester: sem,
        isDefault: true,
      });
    }

    return res.json(policy);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// @desc    Update or create a leave policy
// @route   PUT /api/policies
// @access  Private/Admin
router.put("/", protect, authorize("admin"), async (req, res) => {
  const {
    departmentId,
    maxLeavePerSemester,
    maxODPerSemester,
    academicYear,
    semester,
  } = req.body;

  try {
    const year = academicYear || new Date().getFullYear();
    const sem = semester || 1;
    const dept = departmentId || null;

    let policy = await LeavePolicy.findOne({
      department: dept,
      academicYear: year,
      semester: sem,
    });

    if (policy) {
      if (maxLeavePerSemester !== undefined) policy.maxLeavePerSemester = maxLeavePerSemester;
      if (maxODPerSemester !== undefined) policy.maxODPerSemester = maxODPerSemester;
      await policy.save();
    } else {
      policy = await LeavePolicy.create({
        department: dept,
        maxLeavePerSemester: maxLeavePerSemester || 15,
        maxODPerSemester: maxODPerSemester || 10,
        academicYear: year,
        semester: sem,
      });
    }

    return res.json(policy);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default router;
