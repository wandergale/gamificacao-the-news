import { Router } from "express";
import { getUsers } from "../controllers/userController";
import {
  processWebhook,
  webhookHandler,
} from "../controllers/webhookController";

const router = Router();

router.get("/users", getUsers);
router.post("/webhook", processWebhook);
router.get("/webhook", webhookHandler);

export default router;
