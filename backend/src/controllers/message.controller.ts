import { Request, Response } from "express";
import { Client } from "whatsapp-web.js";
import { activeClients } from "./whatsapp.controller";

/**
 * Send a text message to a WhatsApp contact
 */
export const sendTextMessage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const numberId = parseInt(id);
    const { to, message } = req.body;

    if (!to || !message) {
      return res.status(400).json({
        error: "Missing required parameters",
        details: "Both 'to' and 'message' are required",
      });
    }

    // Check if the client exists and is ready
    const client = activeClients[numberId];
    if (!client) {
      return res.status(404).json({
        error: "WhatsApp client not found",
        details:
          "The WhatsApp number is not connected. Please connect it first.",
      });
    }

    // Format the number (add country code if not present)
    const formattedNumber = formatPhoneNumber(to);

    // Send the message
    const response = await client.sendMessage(
      `${formattedNumber}@c.us`,
      message,
    );

    return res.status(200).json({
      id: response.id._serialized,
      from: numberId,
      to: formattedNumber,
      message: message,
      timestamp: new Date(),
      status: "sent",
    });
  } catch (error) {
    console.error("Error sending message:", error);
    return res.status(500).json({
      error: "Failed to send message",
      details: error instanceof Error ? error.message : String(error),
    });
  }
};

/**
 * Send a media message (image, document, etc.) to a WhatsApp contact
 */
export const sendMediaMessage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const numberId = parseInt(id);
    const { to, mediaUrl, caption, mediaType } = req.body;

    if (!to || !mediaUrl) {
      return res.status(400).json({
        error: "Missing required parameters",
        details: "Both 'to' and 'mediaUrl' are required",
      });
    }

    // Check if the client exists and is ready
    const client = activeClients[numberId];
    if (!client) {
      return res.status(404).json({
        error: "WhatsApp client not found",
        details:
          "The WhatsApp number is not connected. Please connect it first.",
      });
    }

    // Format the number
    const formattedNumber = formatPhoneNumber(to);

    // Send the media message
    const media = await getMediaFromUrl(mediaUrl);
    const response = await client.sendMessage(
      `${formattedNumber}@c.us`,
      media,
      { caption },
    );

    return res.status(200).json({
      id: response.id._serialized,
      from: numberId,
      to: formattedNumber,
      mediaUrl,
      caption,
      mediaType,
      timestamp: new Date(),
      status: "sent",
    });
  } catch (error) {
    console.error("Error sending media message:", error);
    return res.status(500).json({
      error: "Failed to send media message",
      details: error instanceof Error ? error.message : String(error),
    });
  }
};

/**
 * Helper function to format phone numbers
 */
function formatPhoneNumber(phoneNumber: string): string {
  // Remove any non-digit characters
  const digits = phoneNumber.replace(/\D/g, "");

  // If the number doesn't start with a country code (assumed to be without +),
  // add the default country code (assuming 1 for US/Canada)
  if (digits.length === 10) {
    return "1" + digits;
  }

  return digits;
}

/**
 * Helper function to get media from URL
 */
async function getMediaFromUrl(url: string) {
  // In a real implementation, we would download the media and create a MessageMedia object
  // For now, we'll just use the URL directly
  const { MessageMedia } = require("whatsapp-web.js");
  return await MessageMedia.fromUrl(url);
}
