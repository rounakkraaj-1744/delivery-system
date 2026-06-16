import { Router } from "express";
import { loginAdmin, sendAgentOtp, verifyAgentOtp, getMe, logout } from "./auth.controller.ts";
import { authenticate } from "./auth.middleware.ts";

export const router = Router();

router.post("/auth/admin/login", loginAdmin);
router.post("/auth/agent/send-otp", sendAgentOtp);
router.post("/auth/agent/verify-otp", verifyAgentOtp);

router.get("/auth/me", authenticate, getMe);
router.post("/auth/logout", authenticate, logout);