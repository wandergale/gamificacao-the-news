import { Router } from "express";
import { subscribe } from "../controllers/userController";
import { processWebhook } from "../controllers/webhookController";

const router = Router();

router.get("/create", subscribe);
router.get("/webhook", processWebhook);

export default router;
