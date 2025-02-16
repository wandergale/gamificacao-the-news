import { Router } from "express";

import { handleWebhook } from "../controllers/WebhookController";
import { login } from "../controllers/authController";

const router = Router();

router.get("/login", login);
router.post("/webhook", handleWebhook);

export default router;
