import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "Course code is required"],
      uppercase: true,
      trim: true,
    },
    title: {
      type: String,
      required: [true, "Course title is required"],
      trim: true,
    },
    lecturer: {
      type: String,
      trim: true,
      default: "",
    },
    year: {
      type: String,
      required: [true, "Year is required"],
      enum: ["Y1", "Y2", "Y3", "Y4"],
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: [true, "Department is required"],
    },
  },
  { timestamps: true },
);

courseSchema.index({ code: 1 }, { unique: true });
courseSchema.index({ year: 1, department: 1 });

const Course = mongoose.model("Course", courseSchema);
export default Course;
