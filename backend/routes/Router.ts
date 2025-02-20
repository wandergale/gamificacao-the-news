import { Router } from "express";
import { subscribe } from "../controllers/userController";
import { processWebhook } from "../controllers/webhookController";
import { metrics } from "../controllers/dashboardController";

const router = Router();

router.get("/create", subscribe);
router.get("/webhook", processWebhook);
router.get("/metrics", metrics);

export default router;
