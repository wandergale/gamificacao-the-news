import { Router } from "express";

import { handleWebhook } from "../controllers/webhookController";
import { login } from "../controllers/authController";
import { getDashboard } from "../controllers/dashboardController";

const router = Router();

router.post("/webhook", handleWebhook);
router.get("/login", login);
router.get("/dashboard", getDashboard);

export default router;
