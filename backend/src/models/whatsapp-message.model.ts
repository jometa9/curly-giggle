import mongoose, { Schema, Document } from "mongoose";
import { WhatsAppMessage } from "./types";

/**
 * MongoDB schema for WhatsApp messages
 */
export interface WhatsAppMessageDocument extends WhatsAppMessage, Document {}

const WhatsAppMessageSchema = new Schema<WhatsAppMessageDocument>(
  {
    id: { type: String, required: true, unique: true },
    numberId: { type: Number, required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    body: { type: String, required: true },
    mediaUrl: { type: String },
    mediaType: { type: String },
    timestamp: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["sent", "delivered", "read", "failed"],
      default: "sent",
    },
    direction: {
      type: String,
      enum: ["inbound", "outbound"],
      required: true,
    },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true },
);

// Create indexes for faster queries
WhatsAppMessageSchema.index({ numberId: 1 });
WhatsAppMessageSchema.index({ from: 1 });
WhatsAppMessageSchema.index({ to: 1 });
WhatsAppMessageSchema.index({ timestamp: -1 });
WhatsAppMessageSchema.index({ direction: 1 });

// Create the model
const WhatsAppMessageModel = mongoose.model<WhatsAppMessageDocument>(
  "WhatsAppMessage",
  WhatsAppMessageSchema,
);

export default WhatsAppMessageModel;
