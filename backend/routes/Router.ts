import { Router } from "express";
import { subscribe } from "../controllers/userController";
import { processWebhook } from "../controllers/webhookController";
import {
  getGeneralStats,
  getTopUsers,
  getFilteredStats,
} from "../controllers/dashboardController";
import { auth, sendLoginLink, streak } from "../controllers/loginController";

const router = Router();

router.get("/create", subscribe);
router.get("/webhook", processWebhook);
router.get("/admin/stats", getGeneralStats);
router.get("/admin/ranking", getTopUsers);
router.get("/admin/stats/filter", getFilteredStats);
router.post("/send-login-link", sendLoginLink);
router.get("/streaks", streak);
router.get("/auth", auth);

export default router;
