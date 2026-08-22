import Course from "../Schema/courseSchema.js";
import Department from "../Schema/departmentSchema.js";

const validYears = ["Y1", "Y2", "Y3", "Y4"];

const getCourseFilter = (query) => {
  const filter = {};
  if (query.year) filter.year = query.year;
  if (query.department) filter.department = query.department;
  return filter;
};

export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find(getCourseFilter(req.query))
      .populate("department", "name year")
      .sort({ year: 1, code: 1 });
    res.json({ success: true, count: courses.length, data: courses });
  } catch (err) {
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to load courses.",
        error: err.message,
      });
  }
};

export const createCourse = async (req, res) => {
  try {
    const { code, title, lecturer, year, department } = req.body;
    if (!code || !title || !year || !department) {
      return res
        .status(400)
        .json({
          success: false,
          message: "code, title, year and department are required.",
        });
    }
    if (!validYears.includes(year)) {
      return res
        .status(400)
        .json({ success: false, message: "year must be Y1, Y2, Y3 or Y4." });
    }
    const assignedDepartment = await Department.findOne({
      _id: department,
      year,
    });
    if (!assignedDepartment) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Department is not assigned to this year.",
        });
    }
    const course = await Course.create({
      code,
      title,
      lecturer,
      year,
      department,
    });
    const saved = await Course.findById(course._id).populate(
      "department",
      "name year",
    );
    res
      .status(201)
      .json({
        success: true,
        message: "Course created successfully.",
        data: saved,
      });
  } catch (err) {
    const status = err.code === 11000 ? 409 : 500;
    res
      .status(status)
      .json({
        success: false,
        message:
          status === 409
            ? "Course code already exists."
            : "Failed to create course.",
        error: err.message,
      });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const { code, title, lecturer, year, department } = req.body;
    if (!code || !title || !year || !department || !validYears.includes(year)) {
      return res
        .status(400)
        .json({
          success: false,
          message: "code, title, year and a valid department are required.",
        });
    }
    const assignedDepartment = await Department.findOne({
      _id: department,
      year,
    });
    if (!assignedDepartment) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Department is not assigned to this year.",
        });
    }
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { code, title, lecturer: lecturer || "", year, department },
      { new: true, runValidators: true },
    ).populate("department", "name year");
    if (!course)
      return res
        .status(404)
        .json({ success: false, message: "Course not found." });
    res.json({
      success: true,
      message: "Course updated successfully.",
      data: course,
    });
  } catch (err) {
    const status = err.code === 11000 ? 409 : 500;
    res
      .status(status)
      .json({
        success: false,
        message:
          status === 409
            ? "Course code already exists."
            : "Failed to update course.",
        error: err.message,
      });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course)
      return res
        .status(404)
        .json({ success: false, message: "Course not found." });
    res.json({ success: true, message: "Course deleted successfully." });
  } catch (err) {
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to delete course.",
        error: err.message,
      });
  }
};

export const getDepartments = async (req, res) => {
  try {
    const filter = req.query.year ? { year: req.query.year } : {};
    const departments = await Department.find(filter).sort({
      year: 1,
      name: 1,
    });
    res.json({ success: true, count: departments.length, data: departments });
  } catch (err) {
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to load departments.",
        error: err.message,
      });
  }
};

export const createDepartment = async (req, res) => {
  try {
    const { name, year } = req.body;
    if (!name || !validYears.includes(year)) {
      return res
        .status(400)
        .json({
          success: false,
          message: "name and a valid year are required.",
        });
    }
    const department = await Department.create({ name, year });
    res
      .status(201)
      .json({
        success: true,
        message: "Department created successfully.",
        data: department,
      });
  } catch (err) {
    const status = err.code === 11000 ? 409 : 500;
    res
      .status(status)
      .json({
        success: false,
        message:
          status === 409
            ? "Department already exists for this year."
            : "Failed to create department.",
        error: err.message,
      });
  }
};

export const updateDepartment = async (req, res) => {
  try {
    const { name, year } = req.body;
    if (!name || !validYears.includes(year)) {
      return res
        .status(400)
        .json({
          success: false,
          message: "name and a valid year are required.",
        });
    }
    const existingDepartment = await Department.findById(req.params.id);
    if (!existingDepartment)
      return res
        .status(404)
        .json({ success: false, message: "Department not found." });
    const department = await Department.findByIdAndUpdate(
      req.params.id,
      { name, year },
      { new: true, runValidators: true },
    );
    await Course.updateMany({ department: req.params.id }, { year });
    res.json({
      success: true,
      message: "Department updated successfully.",
      data: department,
    });
  } catch (err) {
    const status = err.code === 11000 ? 409 : 500;
    res
      .status(status)
      .json({
        success: false,
        message:
          status === 409
            ? "Department already exists for this year."
            : "Failed to update department.",
        error: err.message,
      });
  }
};

export const deleteDepartment = async (req, res) => {
  try {
    const courseCount = await Course.countDocuments({
      department: req.params.id,
    });
    if (courseCount)
      return res
        .status(409)
        .json({
          success: false,
          message: "Delete or move this department's courses first.",
        });
    const department = await Department.findByIdAndDelete(req.params.id);
    if (!department)
      return res
        .status(404)
        .json({ success: false, message: "Department not found." });
    res.json({ success: true, message: "Department deleted successfully." });
  } catch (err) {
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to delete department.",
        error: err.message,
      });
  }
};
