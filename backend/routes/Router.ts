import express from "express";

import { handleWebhook } from "../controllers/webhookController";

const router = express();

router.use(express.json());

router.post("/webhook", handleWebhook);

export default router;
