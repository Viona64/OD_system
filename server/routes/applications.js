import express from "express";
import Application from "../models/Application.js";
import Student from "../models/Student.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

// Helper: Calculate duration in days between two dates inclusive
const getDurationInDays = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return diffDays;
};

// Helper: Format application object to include student register number
const formatApplication = async (app) => {
  if (!app) return null;
  const studentId = app.student._id || app.student;
  const studentProfile = await Student.findOne({ user: studentId });
  return {
    ...app.toObject(),
    registerNumber: studentProfile ? studentProfile.registerNumber : "",
  };
};

// Helper: Format an array of applications
const formatApplications = async (apps) => {
  return await Promise.all(apps.map(formatApplication));
};

// @desc    Get applications based on user role and permissions
// @route   GET /api/applications
// @access  Private
router.get("/", protect, async (req, res) => {
  try {
    let applications = [];

    if (req.user.role === "student") {
      // Students see only their own applications
      applications = await Application.find({ student: req.user._id })
        .populate("student", "name email")
        .populate("mentor", "name email")
        .populate("hod", "name email")
        .sort({ submittedDate: -1 });
    } else if (req.user.role === "mentor") {
      // Mentors see applications of their mentees
      applications = await Application.find({ mentor: req.user._id })
        .populate("student", "name email")
        .populate("mentor", "name email")
        .populate("hod", "name email")
        .sort({ submittedDate: -1 });
    } else if (req.user.role === "hod") {
      // HODs see all applications from students in their department
      const studentsInDept = await Student.find({})
        .populate({
          path: "user",
          match: { department: req.user.department },
        });

      const studentUserIds = studentsInDept
        .filter((s) => s.user !== null)
        .map((s) => s.user._id);

      applications = await Application.find({ student: { $in: studentUserIds } })
        .populate("student", "name email")
        .populate("mentor", "name email")
        .populate("hod", "name email")
        .sort({ submittedDate: -1 });
    } else {
      // Admin sees everything
      applications = await Application.find({})
        .populate("student", "name email")
        .populate("mentor", "name email")
        .populate("hod", "name email")
        .sort({ submittedDate: -1 });
    }

    const formattedApps = await formatApplications(applications);
    return res.json(formattedApps);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// @desc    Submit a new leave/OD application
// @route   POST /api/applications
// @access  Private/Student
router.post("/", protect, authorize("student"), async (req, res) => {
  const { type, startDate, endDate, reason, eventName, proofUrl, periodCount } = req.body;

  try {
    // 1. Fetch student profile to verify remaining quota and get mentor
    const student = await Student.findOne({ user: req.user._id });
    if (!student) {
      return res.status(404).json({ message: "Student profile not found" });
    }

    // 2. Validate dates and calculate requested duration in periods
    const duration = Number(periodCount) || 1;
    if (new Date(startDate) > new Date(endDate)) {
      return res.status(400).json({ message: "Start date must be before or equal to end date" });
    }

    // 3. Check quota availability
    if (type === "leave") {
      const remainingLeave = student.totalLeaveQuota - student.usedLeaveQuota;
      if (remainingLeave < duration) {
        return res.status(400).json({
          message: `Insufficient leave balance. Requested: ${duration} period(s), Available: ${remainingLeave} period(s)`,
        });
      }
    } else if (type === "od") {
      if (!eventName) {
        return res.status(400).json({ message: "Event name is required for On-Duty (OD) applications" });
      }
      const remainingOD = student.totalODQuota - student.usedODQuota;
      if (remainingOD < duration) {
        return res.status(400).json({
          message: `Insufficient OD balance. Requested: ${duration} period(s), Available: ${remainingOD} period(s)`,
        });
      }
    }

    // 4. Create the application (initially set to pending)
    const application = await Application.create({
      student: req.user._id,
      type,
      startDate,
      endDate,
      periodCount: duration,
      reason,
      eventName: type === "od" ? eventName : null,
      proofUrl: proofUrl || null,
      mentor: student.mentor,
      status: "pending",
      mentorStatus: "pending",
    });

    // 5. Notify the mentor
    await Notification.create({
      user: student.mentor,
      message: `New ${type.toUpperCase()} request from ${req.user.name} for ${duration} period(s) starting ${startDate.toString().split("T")[0]}.`,
    });

    const populatedApp = await Application.findById(application._id)
      .populate("student", "name email")
      .populate("mentor", "name email");

    const formattedApp = await formatApplication(populatedApp);
    return res.status(201).json(formattedApp);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// @desc    Mentor reviews an application
// @route   PUT /api/applications/:id/mentor-review
// @access  Private/Mentor
router.put("/:id/mentor-review", protect, authorize("mentor"), async (req, res) => {
  const { status, comment } = req.body; // status: 'approved' | 'rejected'

  if (!["approved", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid review status. Must be approved or rejected." });
  }

  try {
    const application = await Application.findById(req.params.id).populate("student", "name department");
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Verify this mentor is assigned to the application
    if (application.mentor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to review this application" });
    }

    application.mentorStatus = status;
    application.mentorComment = comment || "";
    application.mentorReviewedAt = new Date();

    if (status === "approved") {
      application.status = "mentor_approved";
      
      // Find HOD of the student's department to route the application
      const studentProfile = await Student.findOne({ user: application.student._id }).populate("user");
      const hod = await User.findOne({
        role: "hod",
        department: studentProfile.user.department,
      });

      if (hod) {
        application.hod = hod._id;
        // Notify HOD
        await Notification.create({
          user: hod._id,
          message: `Application from ${application.student.name} approved by Mentor, needs HOD approval.`,
        });
      }
    } else {
      application.status = "rejected";
      // Notify Student
      await Notification.create({
        user: application.student._id,
        message: `Your ${application.type.toUpperCase()} application has been rejected by Mentor. Comment: ${comment || "None"}`,
      });
    }

    await application.save();
    
    const populatedApp = await Application.findById(application._id)
      .populate("student", "name email")
      .populate("mentor", "name email")
      .populate("hod", "name email");

    const formattedApp = await formatApplication(populatedApp);
    return res.json(formattedApp);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// @desc    HOD reviews an application
// @route   PUT /api/applications/:id/hod-review
// @access  Private/HOD
router.put("/:id/hod-review", protect, authorize("hod"), async (req, res) => {
  const { status, comment } = req.body; // status: 'approved' | 'rejected'

  if (!["approved", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid review status. Must be approved or rejected." });
  }

  try {
    const application = await Application.findById(req.params.id).populate("student", "name");
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Verify HOD matches assigned department HOD (if assigned)
    if (application.hod && application.hod.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to review this department application" });
    }

    application.hodStatus = status;
    application.hodComment = comment || "";
    application.hodReviewedAt = new Date();

    if (status === "approved") {
      application.status = "approved";
      
      // Calculate duration to update student's used quota
      const duration = application.periodCount || 1;
      const studentProfile = await Student.findOne({ user: application.student._id });

      if (studentProfile) {
        if (application.type === "leave") {
          studentProfile.usedLeaveQuota += duration;
        } else if (application.type === "od") {
          studentProfile.usedODQuota += duration;
        }
        await studentProfile.save();
      }

      // Notify Student
      await Notification.create({
        user: application.student._id,
        message: `Your ${application.type.toUpperCase()} application starting ${application.startDate.toISOString().split("T")[0]} has been fully approved by the HOD for ${duration} period(s).`,
      });
    } else {
      application.status = "rejected";
      // Notify Student
      await Notification.create({
        user: application.student._id,
        message: `Your ${application.type.toUpperCase()} application starting ${application.startDate.toISOString().split("T")[0]} has been rejected by HOD. Comment: ${comment || "None"}`,
      });
    }

    await application.save();
    
    const populatedApp = await Application.findById(application._id)
      .populate("student", "name email")
      .populate("mentor", "name email")
      .populate("hod", "name email");

    const formattedApp = await formatApplication(populatedApp);
    return res.json(formattedApp);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default router;
