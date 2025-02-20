import { Router } from "express";
import { getUsers } from "../controllers/userController";
import { processWebhook } from "../controllers/webhookController";

const router = Router();

router.get("/users", getUsers);
router.post("/webhook", processWebhook);

export default router;
