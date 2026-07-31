import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["leave", "od"],
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    periodCount: {
      type: Number,
      required: true,
      default: 1,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
    },
    eventName: {
      type: String,
      default: null,
    },
    proofUrl: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["pending", "mentor_approved", "approved", "rejected"],
      default: "pending",
    },
    mentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    mentorStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    mentorComment: {
      type: String,
      default: null,
    },
    mentorReviewedAt: {
      type: Date,
      default: null,
    },
    hod: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    hodStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    hodComment: {
      type: String,
      default: null,
    },
    hodReviewedAt: {
      type: Date,
      default: null,
    },
    submittedDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Application = mongoose.model("Application", applicationSchema);
export default Application;
