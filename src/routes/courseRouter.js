import express from "express";
import {
  createCourse,
  createDepartment,
  deleteCourse,
  deleteDepartment,
  getCourses,
  getDepartments,
  updateCourse,
  updateDepartment,
} from "../controllers/courseController.js";

const router = express.Router();

router.get("/departments", getDepartments);
router.post("/departments", createDepartment);
router.put("/departments/:id", updateDepartment);
router.delete("/departments/:id", deleteDepartment);

router.get("/", getCourses);
router.post("/", createCourse);
router.put("/:id", updateCourse);
router.delete("/:id", deleteCourse);

export default router;
