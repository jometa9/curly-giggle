import { Request, Response } from "express";

// Temporary in-memory storage until we implement a database
const webhookConfigs: Record<string, any> = {};

/**
 * Configure webhook for a WhatsApp number
 */
export const configureWebhook = (req: Request, res: Response) => {
  try {
    const { numberId } = req.params;
    const { url, includeMedia, includeMetadata, customParameters } = req.body;

    if (!url) {
      return res.status(400).json({ error: "Webhook URL is required" });
    }

    // In a real implementation, we would validate the URL format

    const webhookConfig = {
      numberId,
      url,
      includeMedia: includeMedia || false,
      includeMetadata: includeMetadata || false,
      customParameters: customParameters || [],
      createdAt: webhookConfigs[numberId]?.createdAt || new Date(),
      updatedAt: new Date(),
    };

    webhookConfigs[numberId] = webhookConfig;

    return res.status(200).json(webhookConfig);
  } catch (error) {
    console.error("Error configuring webhook:", error);
    return res.status(500).json({ error: "Failed to configure webhook" });
  }
};

/**
 * Get webhook configuration for a WhatsApp number
 */
export const getWebhookConfig = (req: Request, res: Response) => {
  try {
    const { numberId } = req.params;

    const webhookConfig = webhookConfigs[numberId];

    if (!webhookConfig) {
      return res.status(404).json({ error: "Webhook configuration not found" });
    }

    return res.status(200).json(webhookConfig);
  } catch (error) {
    console.error("Error getting webhook configuration:", error);
    return res
      .status(500)
      .json({ error: "Failed to get webhook configuration" });
  }
};

/**
 * Test webhook configuration
 */
export const testWebhook = (req: Request, res: Response) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: "Webhook URL is required" });
    }

    // In a real implementation, we would send a test request to the webhook URL
    // For now, we'll just simulate it

    // Simulate webhook test
    setTimeout(() => {
      // Simulate success (in a real implementation, we would check the response)
      const success = Math.random() > 0.2; // 80% success rate for simulation

      if (success) {
        return res
          .status(200)
          .json({ success: true, message: "Webhook test successful" });
      } else {
        return res
          .status(400)
          .json({ success: false, error: "Webhook test failed" });
      }
    }, 1000);
  } catch (error) {
    console.error("Error testing webhook:", error);
    return res.status(500).json({ error: "Failed to test webhook" });
  }
};

/**
 * Receive webhook events from WhatsApp
 * This endpoint would be called by the WhatsApp API
 */
export const receiveWebhook = (req: Request, res: Response) => {
  try {
    const { numberId } = req.params;
    const webhookData = req.body;

    console.log(`Received webhook for number ${numberId}:`, webhookData);

    // In a real implementation, we would process the webhook data
    // and forward it to the user's configured webhook URL

    // For now, we'll just acknowledge receipt
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return res.status(500).json({ error: "Failed to process webhook" });
  }
};
