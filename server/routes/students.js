import express from "express";
import User from "../models/User.js";
import Student from "../models/Student.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

// @desc    Get all students
// @route   GET /api/students
// @access  Private (Admin, HOD, Mentor)
router.get("/", protect, authorize("admin", "hod", "mentor"), async (req, res) => {
  try {
    let students;

    if (req.user.role === "mentor") {
      // Mentors only see their own mentees
      students = await Student.find({ mentor: req.user._id })
        .populate({
          path: "user",
          select: "name email role department",
          populate: { path: "department", select: "name code" },
        })
        .populate("mentor", "name email");
    } else if (req.user.role === "hod") {
      // HODs see all students belonging to their department
      students = await Student.find({})
        .populate({
          path: "user",
          select: "name email role department",
          match: { department: req.user.department },
          populate: { path: "department", select: "name code" },
        })
        .populate("mentor", "name email");

      // Filter out students that do not match the department population
      students = students.filter((s) => s.user !== null);
    } else {
      // Admin sees all students in the system
      students = await Student.find({})
        .populate({
          path: "user",
          select: "name email role department",
          populate: { path: "department", select: "name code" },
        })
        .populate("mentor", "name email");
    }

    return res.json(students);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// @desc    Get all mentors
// @route   GET /api/students/mentors
// @access  Private (Admin, HOD)
router.get("/mentors", protect, authorize("admin", "hod"), async (req, res) => {
  try {
    const mentors = await User.find({ role: "mentor" }).select("name email department").populate("department", "name code");
    return res.json(mentors);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// @desc    Add a new student
// @route   POST /api/students
// @access  Private/Admin
router.post("/", protect, authorize("admin"), async (req, res) => {
  const {
    name,
    registerNumber,
    email,
    mentorId,
    departmentId,
    academicYear,
    semester,
    totalLeaveQuota,
    totalODQuota,
  } = req.body;

  try {
    // Check if email is already taken
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    // Check if register number is already taken
    const regExists = await Student.findOne({ registerNumber });
    if (regExists) {
      return res.status(400).json({ message: "Student with this register number already exists" });
    }

    // Verify or find fallback mentor
    let selectedMentorId = mentorId;
    if (!selectedMentorId) {
      const defaultMentor = await User.findOne({ role: "mentor" });
      if (defaultMentor) {
        selectedMentorId = defaultMentor._id;
      } else {
        return res.status(400).json({ message: "No mentor available in the database to assign" });
      }
    } else {
      const mentor = await User.findById(mentorId);
      if (!mentor || mentor.role !== "mentor") {
        return res.status(400).json({ message: "Valid mentor must be assigned" });
      }
    }

    // Verify or find fallback department
    let selectedDeptId = departmentId;
    if (!selectedDeptId) {
      const defaultDept = await Department.findOne({ code: "CSE" });
      if (defaultDept) {
        selectedDeptId = defaultDept._id;
      }
    }

    // Create Base User record (Default password is set)
    const user = await User.create({
      name,
      email,
      password: "password123",
      role: "student",
      department: selectedDeptId || null,
    });

    // Create associated Student profile
    const student = await Student.create({
      user: user._id,
      registerNumber,
      mentor: selectedMentorId,
      academicYear,
      semester,
      totalLeaveQuota: totalLeaveQuota || 15,
      totalODQuota: totalODQuota || 10,
    });

    const populatedStudent = await Student.findById(student._id)
      .populate("user", "name email role department")
      .populate("mentor", "name email");

    return res.status(201).json(populatedStudent);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// @desc    Update student details
// @route   PUT /api/students/:id
// @access  Private/Admin
router.put("/:id", protect, authorize("admin"), async (req, res) => {
  const {
    name,
    email,
    mentorId,
    departmentId,
    academicYear,
    semester,
    totalLeaveQuota,
    totalODQuota,
  } = req.body;

  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student profile not found" });
    }

    // Update parent user profile fields
    const user = await User.findById(student.user);
    if (user) {
      user.name = name || user.name;
      user.email = email || user.email;
      if (departmentId) user.department = departmentId;
      await user.save();
    }

    // Update student quota and metadata
    student.mentor = mentorId || student.mentor;
    student.academicYear = academicYear || student.academicYear;
    student.semester = semester || student.semester;
    if (totalLeaveQuota !== undefined) student.totalLeaveQuota = totalLeaveQuota;
    if (totalODQuota !== undefined) student.totalODQuota = totalODQuota;

    await student.save();

    const updatedStudent = await Student.findById(student._id)
      .populate("user", "name email role department")
      .populate("mentor", "name email");

    return res.json(updatedStudent);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// @desc    Delete student profile and user account
// @route   DELETE /api/students/:id
// @access  Private/Admin
router.delete("/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student profile not found" });
    }

    // Remove user account and student record
    await User.findByIdAndDelete(student.user);
    await Student.findByIdAndDelete(req.params.id);

    return res.json({ message: "Student record and user profile deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default router;
