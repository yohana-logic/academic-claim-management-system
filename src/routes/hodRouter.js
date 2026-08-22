import express from "express";
import {
  getAllHods,
  getHodById,
  createHod,
  updateHod,
  resetHodPassword,
  deleteHod,
} from "../controllers/hodController.js";

const router = express.Router();

router.get("/", getAllHods);
router.get("/:id", getHodById);
router.post("/", createHod);
router.put("/:id", updateHod);
router.patch("/:id/reset-password", resetHodPassword);
router.delete("/:id", deleteHod);

export default router;
