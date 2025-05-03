import express from "express";
import {
  configureWebhook,
  getWebhookConfig,
  testWebhook,
  receiveWebhook,
} from "../controllers/webhook.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = express.Router();

// Webhook configuration routes
// Note: In a production environment, uncomment the authenticate middleware
router.post("/configure/:numberId", /* authenticate, */ configureWebhook);
router.get("/configure/:numberId", /* authenticate, */ getWebhookConfig);
router.post("/test", /* authenticate, */ testWebhook);

// Endpoint to receive webhook events from WhatsApp
// This endpoint is public as it needs to be accessible by WhatsApp
router.post("/receive/:numberId", receiveWebhook);

export default router;
