import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const config = {
  port: process.env.PORT || 4000,
  nodeEnv: process.env.NODE_ENV || "development",
  jwtSecret:
    process.env.JWT_SECRET || "default_jwt_secret_change_in_production",
  stripeSecretKey: process.env.STRIPE_SECRET_KEY || "",
  googleClientId: process.env.GOOGLE_CLIENT_ID || "",
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
  mongodb: {
    uri:
      process.env.MONGODB_URI || "mongodb://localhost:27017/whatsapp-hosting",
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  whatsapp: {
    sessionDir: process.env.WHATSAPP_SESSION_DIR || "./whatsapp-sessions",
    webhookBaseUrl: process.env.WEBHOOK_BASE_URL || "http://localhost:4000",
    maxRetries: parseInt(process.env.WHATSAPP_MAX_RETRIES || "5"),
    retryDelay: parseInt(process.env.WHATSAPP_RETRY_DELAY || "5000"),
    puppeteerArgs: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--no-first-run",
      "--no-zygote",
      "--single-process",
      "--disable-gpu",
    ],
  },
};

export default config;
