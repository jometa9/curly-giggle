import { Request, Response } from "express";
import { Client, LocalAuth, Events } from "whatsapp-web.js";
import * as fs from "fs-extra";
import * as path from "path";
import axios from "axios";
import config from "../config/config";
import { WhatsAppNumber, WebhookConfig } from "../models/types";

// Export active WhatsApp clients for use in message controller
export const activeClients: Record<number, Client> = {};

// Temporary in-memory storage until we implement a database
let whatsappNumbers: WhatsAppNumber[] = [];
let nextId = 1;

// Import webhook configurations from webhook controller
import { webhookConfigs } from "./webhook.controller";

/**
 * Initialize a WhatsApp client for a specific number
 */
async function initializeWhatsAppClient(
  numberId: number,
  phoneNumber: string,
): Promise<Client> {
  // Create session directory if it doesn't exist
  const sessionDir = path.join(
    config.whatsapp.sessionDir,
    `session-${numberId}`,
  );
  await fs.ensureDir(sessionDir);

  // Initialize the WhatsApp client with local authentication
  const client = new Client({
    authStrategy: new LocalAuth({
      clientId: `whatsapp-${numberId}`,
      dataPath: sessionDir,
    }),
    puppeteer: {
      args: config.whatsapp.puppeteerArgs,
      headless: true,
    },
  });

  // Set up event handlers
  client.on(Events.QR_RECEIVED, (qr) => {
    // Store QR code for retrieval via API
    fs.writeFileSync(path.join(sessionDir, "qrcode.txt"), qr);
    console.log(
      `QR Code generated for number ${phoneNumber} (ID: ${numberId})`,
    );
  });

  client.on(Events.READY, async () => {
    console.log(
      `WhatsApp client ready for number ${phoneNumber} (ID: ${numberId})`,
    );

    // Update number status in memory
    const index = whatsappNumbers.findIndex((num) => num.id === numberId);
    if (index !== -1) {
      whatsappNumbers[index] = {
        ...whatsappNumbers[index],
        status: "connected",
        lastActive: new Date(),
        updatedAt: new Date(),
      };
    }
  });

  client.on(Events.DISCONNECTED, async (reason) => {
    console.log(
      `WhatsApp client disconnected for number ${phoneNumber} (ID: ${numberId}): ${reason}`,
    );

    // Update number status in memory
    const index = whatsappNumbers.findIndex((num) => num.id === numberId);
    if (index !== -1) {
      whatsappNumbers[index] = {
        ...whatsappNumbers[index],
        status: "disconnected",
        updatedAt: new Date(),
      };
    }

    // Remove from active clients
    delete activeClients[numberId];
  });

  // Set up message handling
  client.on(Events.MESSAGE_RECEIVED, async (message) => {
    console.log(`Message received for number ${phoneNumber} (ID: ${numberId})`);

    // Update message count
    const index = whatsappNumbers.findIndex((num) => num.id === numberId);
    if (index !== -1) {
      whatsappNumbers[index] = {
        ...whatsappNumbers[index],
        messageCount: (whatsappNumbers[index].messageCount || 0) + 1,
        lastActive: new Date(),
        updatedAt: new Date(),
      };
    }

    // Forward to webhook if configured
    await forwardMessageToWebhook(numberId, message);
  });

  // Initialize the client
  await client.initialize().catch((err) => {
    console.error(
      `Failed to initialize WhatsApp client for ${phoneNumber} (ID: ${numberId}):`,
      err,
    );
    throw err;
  });

  return client;
}

/**
 * Forward a message to the configured webhook URL
 */
async function forwardMessageToWebhook(numberId: number, message: any) {
  try {
    const webhookConfig = webhookConfigs[numberId];
    if (!webhookConfig || !webhookConfig.url) {
      console.log(`No webhook configured for number ID ${numberId}`);
      return;
    }

    // Prepare the message data
    const messageData: any = {
      id: message.id._serialized,
      from: message.from,
      to: message.to,
      body: message.body,
      timestamp: message.timestamp,
      isGroup: message.isGroup,
      author: message.author,
    };

    // Include media if configured
    if (webhookConfig.includeMedia && message.hasMedia) {
      try {
        const media = await message.downloadMedia();
        messageData.media = {
          mimetype: media.mimetype,
          data: media.data, // Base64 encoded
          filename: media.filename,
        };
      } catch (error) {
        console.error("Error downloading media:", error);
      }
    }

    // Include metadata if configured
    if (webhookConfig.includeMetadata) {
      messageData.metadata = {
        numberId,
        type: message.type,
        ack: message.ack,
      };
    }

    // Add custom parameters
    if (
      webhookConfig.customParameters &&
      webhookConfig.customParameters.length > 0
    ) {
      messageData.customParameters = {};
      webhookConfig.customParameters.forEach((param) => {
        messageData.customParameters[param.key] = param.value;
      });
    }

    // Send to webhook URL
    await axios.post(webhookConfig.url, messageData, {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 10000, // 10 seconds timeout
    });

    console.log(`Message forwarded to webhook for number ID ${numberId}`);
  } catch (error) {
    console.error(
      `Error forwarding message to webhook for number ID ${numberId}:`,
      error,
    );
  }
}

/**
 * Add a new WhatsApp number
 */
export const addWhatsAppNumber = async (req: Request, res: Response) => {
  try {
    const { number } = req.body;

    if (!number) {
      return res.status(400).json({ error: "Phone number is required" });
    }

    // In a real implementation, we would validate the number format

    const newNumber: WhatsAppNumber = {
      id: nextId++,
      number,
      status: "pending", // pending, connected, disconnected
      webhookUrl: "",
      lastActive: null,
      messageCount: 0,
      userId: req.body.userId || 1, // We'll get this from auth middleware later
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    whatsappNumbers.push(newNumber);

    return res.status(201).json(newNumber);
  } catch (error) {
    console.error("Error adding WhatsApp number:", error);
    return res.status(500).json({ error: "Failed to add WhatsApp number" });
  }
};

/**
 * Get all WhatsApp numbers for the authenticated user
 */
export const getWhatsAppNumbers = (req: Request, res: Response) => {
  try {
    // In a real implementation, we would filter by the authenticated user's ID
    const userId = req.query.userId || 1;

    const userNumbers = whatsappNumbers.filter((num) => num.userId === userId);

    return res.status(200).json(userNumbers);
  } catch (error) {
    console.error("Error getting WhatsApp numbers:", error);
    return res.status(500).json({ error: "Failed to get WhatsApp numbers" });
  }
};

/**
 * Get a specific WhatsApp number by ID
 */
export const getWhatsAppNumberById = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const numberId = parseInt(id);

    const number = whatsappNumbers.find((num) => num.id === numberId);

    if (!number) {
      return res.status(404).json({ error: "WhatsApp number not found" });
    }

    // In a real implementation, we would check if the number belongs to the authenticated user

    return res.status(200).json(number);
  } catch (error) {
    console.error("Error getting WhatsApp number:", error);
    return res.status(500).json({ error: "Failed to get WhatsApp number" });
  }
};

/**
 * Update a WhatsApp number
 */
export const updateWhatsAppNumber = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const numberId = parseInt(id);

    const index = whatsappNumbers.findIndex((num) => num.id === numberId);

    if (index === -1) {
      return res.status(404).json({ error: "WhatsApp number not found" });
    }

    // In a real implementation, we would check if the number belongs to the authenticated user

    const updatedNumber = {
      ...whatsappNumbers[index],
      ...req.body,
      updatedAt: new Date(),
    };

    whatsappNumbers[index] = updatedNumber;

    return res.status(200).json(updatedNumber);
  } catch (error) {
    console.error("Error updating WhatsApp number:", error);
    return res.status(500).json({ error: "Failed to update WhatsApp number" });
  }
};

/**
 * Delete a WhatsApp number
 */
export const deleteWhatsAppNumber = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const numberId = parseInt(id);

    const index = whatsappNumbers.findIndex((num) => num.id === numberId);

    if (index === -1) {
      return res.status(404).json({ error: "WhatsApp number not found" });
    }

    // In a real implementation, we would check if the number belongs to the authenticated user

    // Disconnect and destroy client if active
    if (activeClients[numberId]) {
      await activeClients[numberId].destroy();
      delete activeClients[numberId];
    }

    // Remove session directory
    const sessionDir = path.join(
      config.whatsapp.sessionDir,
      `session-${numberId}`,
    );
    await fs
      .remove(sessionDir)
      .catch((err) =>
        console.error(`Failed to remove session directory: ${err}`),
      );

    whatsappNumbers.splice(index, 1);

    return res.status(204).send();
  } catch (error) {
    console.error("Error deleting WhatsApp number:", error);
    return res.status(500).json({ error: "Failed to delete WhatsApp number" });
  }
};

/**
 * Generate QR code for WhatsApp connection
 */
export const generateQRCode = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const numberId = parseInt(id);

    const number = whatsappNumbers.find((num) => num.id === numberId);

    if (!number) {
      return res.status(404).json({ error: "WhatsApp number not found" });
    }

    // Initialize client if not already active
    if (!activeClients[numberId]) {
      try {
        activeClients[numberId] = await initializeWhatsAppClient(
          numberId,
          number.number,
        );
      } catch (error) {
        console.error(`Failed to initialize WhatsApp client: ${error}`);
        return res
          .status(500)
          .json({ error: "Failed to initialize WhatsApp client" });
      }
    }

    // Wait for QR code to be generated (with timeout)
    let attempts = 0;
    const maxAttempts = 10;
    const sessionDir = path.join(
      config.whatsapp.sessionDir,
      `session-${numberId}`,
    );
    const qrCodePath = path.join(sessionDir, "qrcode.txt");

    while (attempts < maxAttempts) {
      if (await fs.pathExists(qrCodePath)) {
        const qrCode = await fs.readFile(qrCodePath, "utf8");
        return res.status(200).json({
          id: numberId,
          qrCodeData: qrCode,
          expiresAt: new Date(Date.now() + 60000), // Expires in 1 minute
        });
      }

      // Wait before checking again
      await new Promise((resolve) => setTimeout(resolve, 1000));
      attempts++;
    }

    return res
      .status(408)
      .json({ error: "Timeout waiting for QR code generation" });
  } catch (error) {
    console.error("Error generating QR code:", error);
    return res.status(500).json({ error: "Failed to generate QR code" });
  }
};

/**
 * Refresh WhatsApp connection
 */
export const refreshConnection = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const numberId = parseInt(id);

    const index = whatsappNumbers.findIndex((num) => num.id === numberId);

    if (index === -1) {
      return res.status(404).json({ error: "WhatsApp number not found" });
    }

    // Disconnect existing client if any
    if (activeClients[numberId]) {
      await activeClients[numberId].destroy();
      delete activeClients[numberId];
    }

    // Initialize a new client
    try {
      activeClients[numberId] = await initializeWhatsAppClient(
        numberId,
        whatsappNumbers[index].number,
      );

      whatsappNumbers[index] = {
        ...whatsappNumbers[index],
        status: "pending", // Will be updated to connected when ready
        updatedAt: new Date(),
      };

      return res.status(200).json(whatsappNumbers[index]);
    } catch (error) {
      console.error(`Failed to refresh WhatsApp connection: ${error}`);
      return res
        .status(500)
        .json({ error: "Failed to refresh WhatsApp connection" });
    }
  } catch (error) {
    console.error("Error refreshing connection:", error);
    return res.status(500).json({ error: "Failed to refresh connection" });
  }
};
