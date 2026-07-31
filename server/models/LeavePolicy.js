import mongoose from "mongoose";

const leavePolicySchema = new mongoose.Schema(
  {
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      default: null, // Null indicates global default policy
    },
    maxLeavePerSemester: {
      type: Number,
      default: 15,
    },
    maxODPerSemester: {
      type: Number,
      default: 10,
    },
    academicYear: {
      type: Number,
      required: true,
    },
    semester: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure unique policy configuration per department per semester/year
leavePolicySchema.index({ department: 1, academicYear: 1, semester: 1 }, { unique: true });

const LeavePolicy = mongoose.model("LeavePolicy", leavePolicySchema);
export default LeavePolicy;
