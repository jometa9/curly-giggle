import mongoose, { Schema, Document } from "mongoose";
import { WhatsAppSession } from "./types";

/**
 * MongoDB schema for WhatsApp sessions
 */
export interface WhatsAppSessionDocument extends WhatsAppSession, Document {}

const WhatsAppSessionSchema = new Schema<WhatsAppSessionDocument>(
  {
    numberId: { type: Number, required: true, unique: true },
    userId: { type: Number, required: true },
    sessionData: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "connected", "disconnected", "failed"],
      default: "pending",
    },
    qrCode: { type: String, default: null },
    qrCodeExpiry: { type: Date, default: null },
    lastActive: { type: Date, default: Date.now },
    messageCount: { type: Number, default: 0 },
    failureReason: { type: String, default: null },
    retryCount: { type: Number, default: 0 },
    webhookConfigId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WebhookConfig",
      default: null,
    },
  },
  { timestamps: true },
);

// Create indexes for faster queries
WhatsAppSessionSchema.index({ numberId: 1 });
WhatsAppSessionSchema.index({ userId: 1 });
WhatsAppSessionSchema.index({ status: 1 });

// Add methods to the schema
WhatsAppSessionSchema.methods.updateStatus = function (
  status: string,
  reason?: string,
) {
  this.status = status;
  if (reason) this.failureReason = reason;
  this.updatedAt = new Date();
  return this.save();
};

WhatsAppSessionSchema.methods.incrementMessageCount = function () {
  this.messageCount += 1;
  this.lastActive = new Date();
  return this.save();
};

WhatsAppSessionSchema.methods.setQRCode = function (qrCode: string) {
  this.qrCode = qrCode;
  this.qrCodeExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry
  return this.save();
};

// Create the model
const WhatsAppSessionModel = mongoose.model<WhatsAppSessionDocument>(
  "WhatsAppSession",
  WhatsAppSessionSchema,
);

export default WhatsAppSessionModel;
