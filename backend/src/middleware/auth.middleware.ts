import { Request, Response, NextFunction } from "express";
// import jwt from 'jsonwebtoken';
// import config from '../config/config';

/**
 * Middleware to authenticate requests using JWT
 */
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Get the token from the Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const token = authHeader.split(" ")[1];

    // In a real implementation, we would verify the token using jwt.verify
    // For now, we'll just simulate it

    // Simulate token verification
    if (token.startsWith("simulated-jwt-token-")) {
      // In a real implementation, we would decode the token and add the user to the request
      // For now, we'll just add a dummy user
      (req as any).user = {
        id: 1,
        email: "user@example.com",
      };

      next();
    } else {
      return res.status(401).json({ error: "Invalid token" });
    }
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(500).json({ error: "Authentication failed" });
  }
};
