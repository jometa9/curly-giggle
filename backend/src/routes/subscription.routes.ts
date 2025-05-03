import express from "express";
import {
  createSubscription,
  getSubscription,
  updateSubscription,
  cancelSubscription,
  updatePaymentMethod,
  handleStripeWebhook,
} from "../controllers/subscription.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = express.Router();

// Subscription management routes
// Note: In a production environment, uncomment the authenticate middleware
router.post("/", /* authenticate, */ createSubscription);
router.get("/", /* authenticate, */ getSubscription);
router.put("/", /* authenticate, */ updateSubscription);
router.delete("/", /* authenticate, */ cancelSubscription);
router.put("/payment-method", /* authenticate, */ updatePaymentMethod);

// Stripe webhook handler
// This endpoint is public as it needs to be accessible by Stripe
router.post("/webhook", handleStripeWebhook);

export default router;
