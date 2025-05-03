import express from "express";
import {
  addWhatsAppNumber,
  getWhatsAppNumbers,
  getWhatsAppNumberById,
  updateWhatsAppNumber,
  deleteWhatsAppNumber,
  generateQRCode,
  refreshConnection,
} from "../controllers/whatsapp.controller";
import {
  sendTextMessage,
  sendMediaMessage,
} from "../controllers/message.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = express.Router();

// WhatsApp number routes
// Note: In a production environment, uncomment the authenticate middleware
router.post("/", /* authenticate, */ addWhatsAppNumber);
router.get("/", /* authenticate, */ getWhatsAppNumbers);
router.get("/:id", /* authenticate, */ getWhatsAppNumberById);
router.put("/:id", /* authenticate, */ updateWhatsAppNumber);
router.delete("/:id", /* authenticate, */ deleteWhatsAppNumber);

// QR code generation for WhatsApp connection
router.post("/:id/qrcode", /* authenticate, */ generateQRCode);
router.post("/:id/refresh", /* authenticate, */ refreshConnection);

// Message sending routes
router.post("/:id/messages", /* authenticate, */ sendTextMessage);
router.post("/:id/media", /* authenticate, */ sendMediaMessage);

export default router;
