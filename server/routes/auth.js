import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Student from "../models/Student.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Helper to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "fallback_secret_123456", {
    expiresIn: "30d",
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
router.post("/register", async (req, res) => {
  const { name, email, password, role, departmentId } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      department: departmentId || null,
    });

    if (user) {
      return res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        token: generateToken(user._id),
      });
    } else {
      return res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
router.post("/login", async (req, res) => {
  const { emailOrReg, password, role } = req.body;

  try {
    let user;

    if (role === "student") {
      // Students log in using their register number
      const studentProfile = await Student.findOne({ registerNumber: emailOrReg }).populate("user");
      if (!studentProfile) {
        return res.status(401).json({ message: "Invalid registration number or role" });
      }
      user = studentProfile.user;
    } else {
      // Mentors, HODs, Admins log in using their email
      user = await User.findOne({ email: emailOrReg });
    }

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Double-check selected role matches stored role
    if (user.role !== role) {
      return res.status(401).json({ message: "Unauthorized role selected for this account" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    let studentData = null;
    if (role === "student") {
      studentData = await Student.findOne({ user: user._id })
        .populate("mentor", "name email")
        .populate({
          path: "user",
          populate: { path: "department" },
        });
    }

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      studentProfile: studentData,
      token: generateToken(user._id),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("department");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let studentProfile = null;
    if (user.role === "student") {
      studentProfile = await Student.findOne({ user: user._id })
        .populate("mentor", "name email")
        .populate({
          path: "user",
          populate: { path: "department" },
        });
    }

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      studentProfile,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// @desc    Forgot Password / Reset Password
// @route   POST /api/auth/forgot-password
// @access  Public
router.post("/forgot-password", async (req, res) => {
  const { role, name, email, registerNumber, newPassword } = req.body;

  if (!role || !name || !email || !newPassword) {
    return res.status(400).json({ message: "Please provide all required fields" });
  }

  try {
    let user;

    if (role === "student") {
      if (!registerNumber) {
        return res.status(400).json({ message: "Registration number is required for students" });
      }

      // Find student and populate user
      const studentProfile = await Student.findOne({ registerNumber }).populate("user");
      if (!studentProfile || !studentProfile.user) {
        return res.status(404).json({ message: "Student profile or user not found" });
      }

      user = studentProfile.user;

      // Verify email and name match
      const emailMatches = user.email.toLowerCase().trim() === email.toLowerCase().trim();
      const nameMatches = user.name.toLowerCase().trim() === name.toLowerCase().trim();

      if (!emailMatches || !nameMatches) {
        return res.status(400).json({ message: "Verification failed. Student details do not match." });
      }
    } else {
      // Find staff user by email and role
      user = await User.findOne({ email, role });
      if (!user) {
        return res.status(404).json({ message: "User not found with this email and role" });
      }

      // Verify name matches
      const nameMatches = user.name.toLowerCase().trim() === name.toLowerCase().trim();
      if (!nameMatches) {
        return res.status(400).json({ message: "Verification failed. Staff name does not match." });
      }
    }

    // Update password
    user.password = newPassword;
    await user.save();

    return res.json({ message: "Password reset successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default router;
