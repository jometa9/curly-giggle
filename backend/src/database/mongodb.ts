import mongoose from "mongoose";
import config from "../config/config";

/**
 * Connect to MongoDB
 */
export async function connectToDatabase() {
  try {
    // Set mongoose options
    mongoose.set("strictQuery", false);

    // Connect to MongoDB with retry logic
    let retries = 0;
    const maxRetries = 5;

    while (retries < maxRetries) {
      try {
        await mongoose.connect(config.mongodb.uri);
        console.log("Connected to MongoDB");
        return mongoose.connection;
      } catch (err) {
        retries++;
        console.error(`MongoDB connection attempt ${retries} failed:`, err);
        if (retries >= maxRetries) throw err;

        // Wait before retrying (exponential backoff)
        const delay = Math.min(1000 * Math.pow(2, retries), 30000);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  } catch (error) {
    console.error(
      "Failed to connect to MongoDB after multiple attempts:",
      error,
    );
    throw error;
  }
}

/**
 * Disconnect from MongoDB
 */
export async function disconnectFromDatabase() {
  try {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("Failed to disconnect from MongoDB:", error);
    throw error;
  }
}

/**
 * Get MongoDB connection
 */
export function getConnection() {
  return mongoose.connection;
}

/**
 * Check if MongoDB is connected
 */
export function isConnected() {
  return mongoose.connection.readyState === 1;
}

/**
 * Initialize database connection
 */
export async function initializeDatabase() {
  try {
    await connectToDatabase();

    // Set up connection event handlers
    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("MongoDB disconnected. Attempting to reconnect...");
      setTimeout(() => connectToDatabase(), 5000);
    });

    process.on("SIGINT", async () => {
      await disconnectFromDatabase();
      process.exit(0);
    });

    return mongoose.connection;
  } catch (error) {
    console.error("Failed to initialize database:", error);
    throw error;
  }
}
