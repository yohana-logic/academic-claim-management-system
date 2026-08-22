import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Department name is required"],
      trim: true,
    },
    year: {
      type: String,
      required: [true, "Year is required"],
      enum: ["Y1", "Y2", "Y3", "Y4"],
    },
  },
  { timestamps: true },
);

departmentSchema.index({ name: 1, year: 1 }, { unique: true });

const Department = mongoose.model("Department", departmentSchema);
export default Department;
