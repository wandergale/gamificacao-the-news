import { Router } from "express";

import { handleWebhook } from "../controllers/webhookController";
import { login } from "../controllers/authController";
import { getDashboard } from "../controllers/dashboardController";
import { updateStreak } from "../controllers/streakController";

const router = Router();

router.post("/webhook", handleWebhook);
router.get("/login", login);
router.get("/dashboard", getDashboard);
router.put("/streak", updateStreak);

export default router;
