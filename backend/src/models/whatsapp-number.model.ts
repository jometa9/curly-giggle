import mongoose, { Schema, Document } from "mongoose";
import { WhatsAppNumber } from "./types";

/**
 * MongoDB schema for WhatsApp numbers
 */
export interface WhatsAppNumberDocument extends WhatsAppNumber, Document {}

const WhatsAppNumberSchema = new Schema<WhatsAppNumberDocument>(
  {
    id: { type: Number, required: true, unique: true },
    number: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "connected", "disconnected"],
      default: "pending",
    },
    webhookUrl: { type: String, default: "" },
    lastActive: { type: Date, default: null },
    messageCount: { type: Number, default: 0 },
    userId: { type: Number, required: true },
  },
  { timestamps: true },
);

// Create indexes for faster queries
WhatsAppNumberSchema.index({ id: 1 });
WhatsAppNumberSchema.index({ userId: 1 });
WhatsAppNumberSchema.index({ status: 1 });

// Create the model
const WhatsAppNumberModel = mongoose.model<WhatsAppNumberDocument>(
  "WhatsAppNumber",
  WhatsAppNumberSchema,
);

export default WhatsAppNumberModel;
