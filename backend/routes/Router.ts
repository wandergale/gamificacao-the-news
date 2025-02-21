import { Router } from "express";
import { subscribe } from "../controllers/userController";
import { processWebhook } from "../controllers/webhookController";
import { metrics, topReaders, stats } from "../controllers/dashboardController";
import { auth, sendLoginLink, streak } from "../controllers/loginController";

const router = Router();

router.get("/create", subscribe);
router.get("/webhook", processWebhook);
router.get("/metrics", metrics);
router.get("/top-readers", topReaders);
router.get("/stats", stats);
router.post("/send-login-link", sendLoginLink);
router.get("/streaks", streak);
router.post("/auth", auth);

export default router;
