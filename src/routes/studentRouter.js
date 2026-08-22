import express from "express";
import {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  resetStudentPassword,
  deleteStudent,
} from "../controllers/studentController.js";

const router = express.Router();

router.get("/", getAllStudents);
router.get("/:id", getStudentById);
router.post("/", createStudent);
router.put("/:id", updateStudent);
router.patch("/:id/reset-password", resetStudentPassword);
router.delete("/:id", deleteStudent);

export default router;
