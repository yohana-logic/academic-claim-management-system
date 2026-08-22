import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const hodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    department: {
      type: String,
      required: [true, "Department is required"],
      trim: true,
    },
    password: {
      type: String,
      default: "ulk@123",
    },
    role: {
      type: String,
      default: "hod",
    },
  },
  { timestamps: true }
);

// Hash password before saving
hodSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Also hash when password is updated via findOneAndUpdate
hodSchema.pre("findOneAndUpdate", async function () {
  const update = this.getUpdate();
  if (update.password) {
    update.password = await bcrypt.hash(update.password, 10);
  }
});

// Instance method to compare passwords
hodSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const HOD = mongoose.model("HOD", hodSchema);
export default HOD;
