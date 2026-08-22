import Claim from "../Schema/claimSchema.js";
import Student from "../Schema/studentSchema.js";
import crypto from "crypto";

const generateClaimCode = async () => {
  let claimCode = "";

  do {
    const suffix = crypto.randomBytes(3).toString("hex").toUpperCase();
    claimCode = `CLM-${Date.now().toString().slice(-6)}-${suffix}`;
  } while (await Claim.exists({ claimCode }));

  return claimCode;
};

export const getAllClaims = async (req, res) => {
  try {
    const filter = {};
    if (req.query.studentId) filter.createdBy = req.query.studentId;
    if (req.query.status) filter.status = req.query.status;

    const claims = await Claim.find(filter)
      .populate("reviewedBy", "name department")
      .sort({ createdAt: -1 });

    res.json({ success: true, count: claims.length, data: claims });
  } catch (err) {
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to load claims.",
        error: err.message,
      });
  }
};

export const getClaimById = async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id).populate(
      "reviewedBy",
      "name department",
    );

    if (!claim)
      return res
        .status(404)
        .json({ success: false, message: "Claim not found." });
    res.json({ success: true, data: claim });
  } catch (err) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error fetching claim.",
        error: err.message,
      });
  }
};

export const getClaimsByStudent = async (req, res) => {
  try {
    const claims = await Claim.find({ createdBy: req.params.studentId })
      .populate("reviewedBy", "name department")
      .sort({ createdAt: -1 });

    res.json({ success: true, count: claims.length, data: claims });
  } catch (err) {
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to load student claims.",
        error: err.message,
      });
  }
};

export const createClaim = async (req, res) => {
  try {
    const {
      studentId,
      courseCode,
      courseName,
      claimType,
      description,
      attachment,
    } = req.body;
    if (
      !studentId ||
      !courseCode ||
      !courseName ||
      !claimType ||
      !description
    ) {
      return res.status(400).json({
        success: false,
        message:
          "studentId, courseCode, courseName, claimType and description are required.",
      });
    }

    const student = await Student.findById(studentId).select("-password");
    if (!student)
      return res
        .status(404)
        .json({ success: false, message: "Student not found." });

    const claimCode = await generateClaimCode();

    const claim = new Claim({
      claimCode,
      createdBy: studentId,
      courseCode,
      courseName,
      claimType,
      description,
      attachment: attachment || null,
    });

    await claim.save();
    res
      .status(201)
      .json({
        success: true,
        message: "Claim submitted successfully.",
        data: claim,
      });
  } catch (err) {
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to create claim.",
        error: err.message,
      });
  }
};


export const reviewClaim = async (req, res) => {
  try {
    const { status, hodFeedback, hodComment, hodId } = req.body;
    const validStatuses = ["under_review", "approved", "rejected"];
    if (!status || !validStatuses.includes(status)) {
      return res
        .status(400)
        .json({
          success: false,
          message: `Status must be one of: ${validStatuses.join(", ")}.`,
        });
    }

    const feedbackText = hodFeedback ?? hodComment ?? null;

    const claim = await Claim.findByIdAndUpdate(
      req.params.id,
      {
        status,
        hodFeedback: feedbackText,
        hodComment: feedbackText,
        reviewedBy: hodId || null,
        reviewedAt: new Date(),
      },
      { new: true, runValidators: true },
    ).populate("reviewedBy", "name department");

    if (!claim)
      return res
        .status(404)
        .json({ success: false, message: "Claim not found." });
    res.json({
      success: true,
      message: "Claim reviewed successfully.",
      data: claim,
    });
  } catch (err) {
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to review claim.",
        error: err.message,
      });
  }
};

export const deleteClaim = async (req, res) => {
  try {
    const claim = await Claim.findByIdAndDelete(req.params.id);
    if (!claim)
      return res
        .status(404)
        .json({ success: false, message: "Claim not found." });
    res.json({ success: true, message: "Claim deleted successfully." });
  } catch (err) {
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to delete claim.",
        error: err.message,
      });
  }
};
