import mongoose from "mongoose";

const claimSchema = new mongoose.Schema(
  {
    claimCode: {
      type: String,
      required: [true, "Claim code is required"],
      unique: true,
      trim: true,
      uppercase: true,
    },
    createdBy: {
      type: String,
      required: [true, "Student reference is required"],
    },
    courseCode: {
      type: String,
      required: [true, "Course code is required"],
      trim: true,
      uppercase: true,
    },
    courseName: {
      type: String,
      required: [true, "Course name is required"],
      trim: true,
    },
    claimType: {
      type: String,
      required: [true, "Claim type is required"],
      enum: ["grade_dispute", "missing_grade", "re_evaluation", "other"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    attachment: {
      type: String,
      default: null,
    },

    status: {
      type: String,
      enum: ["pending", "under_review", "approved", "rejected"],
      default: "pending",
    },
    hodFeedback: {
      type: String,
      default: null,
    },
    hodComment: {
      type: String,
      default: null,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HOD",
      default: null,
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

const Claim = mongoose.model("Claim", claimSchema);
export default Claim;
