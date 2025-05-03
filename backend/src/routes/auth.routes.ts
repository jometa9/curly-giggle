import express from "express";
import {
  register,
  login,
  googleAuth,
  googleCallback,
  refreshToken,
  logout,
} from "../controllers/auth.controller";

const router = express.Router();

// Authentication routes
router.post("/register", register);
router.post("/login", login);
router.get("/google", googleAuth);
router.get("/google/callback", googleCallback);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);

export default router;
