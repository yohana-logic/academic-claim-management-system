import express from "express";
import { login, logout, changePassword, resetPassword } from "../controllers/authController.js";

const router = express.Router();

router.post("/login", login);
router.post("/logout", logout);
router.post("/change-password", changePassword);
router.post("/reset-password", resetPassword);

export default router;
