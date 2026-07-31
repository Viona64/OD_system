import mongoose from "mongoose";
import dotenv from "dotenv";
import Department from "../models/Department.js";
import User from "../models/User.js";
import Student from "../models/Student.js";
import LeavePolicy from "../models/LeavePolicy.js";
import Application from "../models/Application.js";
import Notification from "../models/Notification.js";

dotenv.config();

const seedData = async () => {
  try {
    const connStr = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/leave_portal";
    await mongoose.connect(connStr);
    console.log("Connected to MongoDB for seeding...");

    // Wipe any existing collections to ensure a clean slate
    await Department.deleteMany({});
    await User.deleteMany({});
    await Student.deleteMany({});
    await LeavePolicy.deleteMany({});
    await Application.deleteMany({});
    await Notification.deleteMany({});
    console.log("Cleared existing collections.");

    // 1. Create CSE Department
    const cseDept = await Department.create({
      name: "Computer Science and Engineering",
      code: "CSE",
    });
    console.log("Created Departments.");

    // 2. Create Admin, HOD, and Mentor users
    const admin = await User.create({
      name: "Global Administrator",
      email: "admin@college.edu",
      password: "password123",
      role: "admin",
      department: null,
    });

    const hod = await User.create({
      name: "Dr. Sarah Connor",
      email: "hod@college.edu",
      password: "password123",
      role: "hod",
      department: cseDept._id,
    });

    const mentor = await User.create({
      name: "Prof. John Smith",
      email: "mentor@college.edu",
      password: "password123",
      role: "mentor",
      department: cseDept._id,
    });
    console.log("Created administrative staff accounts.");

    // 3. Create Student Users and associated Student Profile Info
    const student1User = await User.create({
      name: "Rahul Kumar",
      email: "rahul.kumar@college.edu",
      password: "password123",
      role: "student",
      department: cseDept._id,
    });

    await Student.create({
      user: student1User._id,
      registerNumber: "20CS001",
      mentor: mentor._id,
      academicYear: 2026,
      semester: 6,
      totalLeaveQuota: 15,
      usedLeaveQuota: 3,
      totalODQuota: 10,
      usedODQuota: 2,
    });

    const student2User = await User.create({
      name: "Priya Sharma",
      email: "priya.sharma@college.edu",
      password: "password123",
      role: "student",
      department: cseDept._id,
    });

    await Student.create({
      user: student2User._id,
      registerNumber: "20CS002",
      mentor: mentor._id,
      academicYear: 2026,
      semester: 6,
      totalLeaveQuota: 15,
      usedLeaveQuota: 5,
      totalODQuota: 10,
      usedODQuota: 4,
    });

    const student3User = await User.create({
      name: "Amit Patel",
      email: "amit.patel@college.edu",
      password: "password123",
      role: "student",
      department: cseDept._id,
    });

    await Student.create({
      user: student3User._id,
      registerNumber: "20CS003",
      mentor: mentor._id,
      academicYear: 2026,
      semester: 6,
      totalLeaveQuota: 15,
      usedLeaveQuota: 2,
      totalODQuota: 10,
      usedODQuota: 1,
    });
    console.log("Created student accounts and profiles.");

    // 4. Create Policies
    await LeavePolicy.create({
      department: null, // Global default
      maxLeavePerSemester: 15,
      maxODPerSemester: 10,
      academicYear: 2026,
      semester: 6,
    });
    console.log("Created default leave policies.");

    // 5. Create Applications mapping exactly to frontend mock states
    // App 1: Rahul - Approved Leave request
    await Application.create({
      student: student1User._id,
      type: "leave",
      startDate: new Date("2026-03-15"),
      endDate: new Date("2026-03-15"),
      reason: "Medical appointment",
      status: "approved",
      mentor: mentor._id,
      mentorStatus: "approved",
      mentorComment: "Approved. Take care.",
      mentorReviewedAt: new Date("2026-03-10"),
      hod: hod._id,
      hodStatus: "approved",
      hodComment: "Approved.",
      hodReviewedAt: new Date("2026-03-10"),
      submittedDate: new Date("2026-03-10"),
    });

    // App 2: Rahul - Pending OD request
    await Application.create({
      student: student1User._id,
      type: "od",
      startDate: new Date("2026-03-20"),
      endDate: new Date("2026-03-20"),
      reason: "Attending workshop",
      eventName: "AI/ML Workshop",
      status: "pending",
      mentor: mentor._id,
      mentorStatus: "pending",
      submittedDate: new Date("2026-03-12"),
    });

    // App 3: Priya - Pending Leave request
    await Application.create({
      student: student2User._id,
      type: "leave",
      startDate: new Date("2026-03-18"),
      endDate: new Date("2026-03-18"),
      reason: "Family function",
      status: "pending",
      mentor: mentor._id,
      mentorStatus: "pending",
      submittedDate: new Date("2026-03-11"),
    });

    // App 4: Amit - Approved by Mentor, pending HOD approval
    await Application.create({
      student: student3User._id,
      type: "od",
      startDate: new Date("2026-03-22"),
      endDate: new Date("2026-03-22"),
      reason: "Symposium Presentation",
      eventName: "National Tech Symposium",
      status: "mentor_approved",
      mentor: mentor._id,
      mentorStatus: "approved",
      mentorComment: "Highly recommended for department representation.",
      mentorReviewedAt: new Date("2026-03-14"),
      hod: hod._id,
      hodStatus: "pending",
      submittedDate: new Date("2026-03-14"),
    });
    console.log("Created leave and OD applications.");

    // 6. Create Notifications
    await Notification.create({
      user: student1User._id,
      message: "Your leave application for March 15 has been approved",
      createdAt: new Date("2026-03-10"),
      isRead: false,
    });

    await Notification.create({
      user: mentor._id,
      message: "New OD application submitted",
      createdAt: new Date("2026-03-12"),
      isRead: false,
    });
    console.log("Created notifications.");

    console.log("Seeding database completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

seedData();
