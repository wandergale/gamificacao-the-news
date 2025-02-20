import { Router } from "express";
import { subscribe } from "../controllers/userController";
import { processWebhook } from "../controllers/webhookController";
import { metrics, topReaders } from "../controllers/dashboardController";

const router = Router();

router.get("/create", subscribe);
router.get("/webhook", processWebhook);
router.get("/metrics", metrics);
router.get("/top-readers", topReaders);

export default router;
