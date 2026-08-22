import Student from "../Schema/studentSchema.js";
import Department from "../Schema/departmentSchema.js";
import mongoose from "mongoose";

export const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().select("-password");
    res.json({ success: true, count: students.length, data: students });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to load students.",
      error: err.message,
    });
  }
};

export const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).select("-password");
    if (!student)
      return res
        .status(404)
        .json({ success: false, message: "Student not found." });
    res.json({ success: true, data: student });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching student.",
      error: err.message,
    });
  }
};

export const createStudent = async (req, res) => {
  try {
    const { name, phone, email, roll, year, department, password } = req.body;
    if (!name || !phone || !email || !roll || !year || !department) {
      return res.status(400).json({
        success: false,
        message: "name, phone, email, roll, year and department are required.",
      });
    }

    if (!mongoose.isValidObjectId(department)) {
      return res
        .status(400)
        .json({ success: false, message: "A valid department is required." });
    }

    const assignedDepartment = await Department.findOne({
      _id: department,
      year,
    });
    if (!assignedDepartment) {
      return res.status(400).json({
        success: false,
        message: "Department is not assigned to this year.",
      });
    }

    const student = new Student({
      name,
      phone,
      email,
      roll,
      year,
      program: assignedDepartment.name,
      password: password || "ulk@123",
    });
    await student.save();

    const saved = student.toObject();
    delete saved.password;
    res.status(201).json({
      success: true,
      message: "Student created successfully.",
      data: saved,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Phone number, roll number or email already registered.",
      });
    }
    res.status(500).json({
      success: false,
      message: "Failed to create student.",
      error: err.message,
    });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const { name, phone, year, program } = req.body;
    const updateData = {};
    if (name) updateData.name = name.trim();
    if (phone) updateData.phone = phone.trim();
    if (year) updateData.year = year.trim();
    if (program) updateData.program = program.trim();

    const student = await Student.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!student)
      return res
        .status(404)
        .json({ success: false, message: "Student not found." });
    res.json({
      success: true,
      message: "Student updated successfully.",
      data: student,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Phone number, email or roll number already registered.",
      });
    }
    res.status(500).json({
      success: false,
      message: "Failed to update student.",
      error: err.message,
    });
  }
};

export const resetStudentPassword = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student)
      return res
        .status(404)
        .json({ success: false, message: "Student not found." });

    student.password = "ulk@123"; 
    await student.save();

    res.json({
      success: true,
      message: "Student password reset to default (ulk@123).",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to reset password.",
      error: err.message,
    });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student)
      return res
        .status(404)
        .json({ success: false, message: "Student not found." });
    res.json({ success: true, message: "Student deleted successfully." });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to delete student.",
      error: err.message,
    });
  }
};
