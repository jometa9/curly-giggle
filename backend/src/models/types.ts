/**
 * User model
 */
export interface User {
  id: number;
  email: string;
  password?: string;
  name: string;
  googleId?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * WhatsApp number model
 */
export interface WhatsAppNumber {
  id: number;
  number: string;
  status: "pending" | "connected" | "disconnected";
  webhookUrl: string;
  lastActive: Date | null;
  messageCount: number;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Webhook configuration model
 */
export interface WebhookConfig {
  numberId: string;
  url: string;
  includeMedia: boolean;
  includeMetadata: boolean;
  customParameters: CustomParameter[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Custom parameter model
 */
export interface CustomParameter {
  key: string;
  value: string;
}

/**
 * Subscription model
 */
export interface Subscription {
  id: string;
  userId: string;
  status: "active" | "canceled" | "past_due" | "trialing";
  plan: string;
  amount: number;
  currency: string;
  interval: "month" | "year";
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  paymentMethodId: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * WhatsApp Session model
 */
export interface WhatsAppSession {
  numberId: number;
  userId: number;
  sessionData: string; // JSON stringified session data
  status: "active" | "inactive";
  lastActive: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * WhatsApp Message model
 */
export interface WhatsAppMessage {
  id: string;
  numberId: number;
  from: string;
  to: string;
  body: string;
  mediaUrl?: string;
  mediaType?: string;
  timestamp: Date;
  status: "sent" | "delivered" | "read" | "failed";
  direction: "inbound" | "outbound";
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}
