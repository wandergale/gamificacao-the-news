import { Router } from "express";
import { subscribe } from "../controllers/userController";
import { processWebhook } from "../controllers/webhookController";
import { metrics, topReaders, stats } from "../controllers/dashboardController";

const router = Router();

router.get("/create", subscribe);
router.get("/webhook", processWebhook);
router.get("/metrics", metrics);
router.get("/top-readers", topReaders);
router.get("/stats", stats);

export default router;
