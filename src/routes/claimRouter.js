import express from "express";
import {
  getAllClaims,
  getClaimById,
  getClaimsByStudent,
  createClaim,
  reviewClaim,
  deleteClaim,
} from "../controllers/claimController.js";

const router = express.Router();

router.get("/", getAllClaims);
router.get("/student/:studentId", getClaimsByStudent);
router.get("/:id", getClaimById);
router.post("/", createClaim);
router.patch("/:id/review", reviewClaim);
router.delete("/:id", deleteClaim);

export default router;
