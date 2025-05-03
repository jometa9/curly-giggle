import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import config from "./config/config";
import { authenticate } from "./middleware/auth.middleware";
import { initializeDatabase } from "./database/mongodb";

// Import routes
import whatsappRoutes from "./routes/whatsapp.routes";
import authRoutes from "./routes/auth.routes";
import webhookRoutes from "./routes/webhook.routes";
import subscriptionRoutes from "./routes/subscription.routes";

const app = express();

// Initialize database connection
initializeDatabase()
  .then(() => console.log("Database initialized successfully"))
  .catch((err) => {
    console.error("Failed to initialize database:", err);
    process.exit(1);
  });

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(
      `${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`,
    );
  });
  next();
});

// Routes
app.use("/api/whatsapp", whatsappRoutes); // Will add authenticate middleware later
app.use("/api/auth", authRoutes);
app.use("/api/webhook", webhookRoutes); // Will add authenticate middleware later
app.use("/api/subscription", subscriptionRoutes); // Will add authenticate middleware later

// API documentation endpoint
app.get("/api-docs", (req, res) => {
  res.status(200).json({
    message: "API documentation",
    endpoints: {
      auth: [
        {
          method: "POST",
          path: "/api/auth/register",
          description: "Register a new user",
        },
        {
          method: "POST",
          path: "/api/auth/login",
          description: "Login a user",
        },
        {
          method: "GET",
          path: "/api/auth/google",
          description: "Google OAuth authentication",
        },
        {
          method: "GET",
          path: "/api/auth/google/callback",
          description: "Google OAuth callback",
        },
        {
          method: "POST",
          path: "/api/auth/refresh-token",
          description: "Refresh authentication token",
        },
        {
          method: "POST",
          path: "/api/auth/logout",
          description: "Logout a user",
        },
      ],
      whatsapp: [
        {
          method: "POST",
          path: "/api/whatsapp",
          description: "Add a new WhatsApp number",
        },
        {
          method: "GET",
          path: "/api/whatsapp",
          description: "Get all WhatsApp numbers for the authenticated user",
        },
        {
          method: "GET",
          path: "/api/whatsapp/:id",
          description: "Get a specific WhatsApp number by ID",
        },
        {
          method: "PUT",
          path: "/api/whatsapp/:id",
          description: "Update a WhatsApp number",
        },
        {
          method: "DELETE",
          path: "/api/whatsapp/:id",
          description: "Delete a WhatsApp number",
        },
        {
          method: "POST",
          path: "/api/whatsapp/:id/qrcode",
          description: "Generate QR code for WhatsApp connection",
        },
        {
          method: "POST",
          path: "/api/whatsapp/:id/refresh",
          description: "Refresh WhatsApp connection",
        },
      ],
      webhook: [
        {
          method: "POST",
          path: "/api/webhook/configure/:numberId",
          description: "Configure webhook for a WhatsApp number",
        },
        {
          method: "GET",
          path: "/api/webhook/configure/:numberId",
          description: "Get webhook configuration for a WhatsApp number",
        },
        {
          method: "POST",
          path: "/api/webhook/test",
          description: "Test webhook configuration",
        },
        {
          method: "POST",
          path: "/api/webhook/receive/:numberId",
          description: "Receive webhook events from WhatsApp",
        },
      ],
      subscription: [
        {
          method: "POST",
          path: "/api/subscription",
          description: "Create a new subscription",
        },
        {
          method: "GET",
          path: "/api/subscription",
          description: "Get subscription for a user",
        },
        {
          method: "PUT",
          path: "/api/subscription",
          description: "Update subscription (e.g., change plan)",
        },
        {
          method: "DELETE",
          path: "/api/subscription",
          description: "Cancel subscription",
        },
        {
          method: "PUT",
          path: "/api/subscription/payment-method",
          description: "Update payment method",
        },
        {
          method: "POST",
          path: "/api/subscription/webhook",
          description: "Handle Stripe webhook events",
        },
      ],
    },
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Server is running",
    database: {
      connected: mongoose.connection.readyState === 1,
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

export default app;
