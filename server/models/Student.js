import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    registerNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    mentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    academicYear: {
      type: Number,
      required: true,
    },
    semester: {
      type: Number,
      required: true,
    },
    totalLeaveQuota: {
      type: Number,
      default: 15,
    },
    usedLeaveQuota: {
      type: Number,
      default: 0,
    },
    totalODQuota: {
      type: Number,
      default: 10,
    },
    usedODQuota: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Student = mongoose.model("Student", studentSchema);
export default Student;
