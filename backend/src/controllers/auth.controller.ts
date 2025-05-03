import { Request, Response } from "express";

// Temporary in-memory storage until we implement a database
const users: any[] = [];
let nextUserId = 1;

/**
 * Register a new user
 */
export const register = (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Check if user already exists
    const existingUser = users.find((user) => user.email === email);
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User with this email already exists" });
    }

    // In a real implementation, we would hash the password
    const newUser = {
      id: nextUserId++,
      email,
      password, // In a real implementation, this would be hashed
      name: name || email.split("@")[0],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    users.push(newUser);

    // In a real implementation, we would generate a JWT token
    const token = `simulated-jwt-token-${Math.random().toString(36).substring(7)}`;

    // Don't return the password
    const { password: _, ...userWithoutPassword } = newUser;

    return res.status(201).json({
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ error: "Failed to register user" });
  }
};

/**
 * Login a user
 */
export const login = (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find user by email
    const user = users.find((user) => user.email === email);

    if (!user || user.password !== password) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // In a real implementation, we would generate a JWT token
    const token = `simulated-jwt-token-${Math.random().toString(36).substring(7)}`;

    // Don't return the password
    const { password: _, ...userWithoutPassword } = user;

    return res.status(200).json({
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    return res.status(500).json({ error: "Failed to login" });
  }
};

/**
 * Google OAuth authentication
 */
export const googleAuth = (req: Request, res: Response) => {
  // In a real implementation, we would redirect to Google OAuth
  res.status(200).json({ message: "This would redirect to Google OAuth" });
};

/**
 * Google OAuth callback
 */
export const googleCallback = (req: Request, res: Response) => {
  try {
    // In a real implementation, we would process the Google OAuth callback
    // For now, we'll just simulate it

    const googleUser = {
      id: nextUserId++,
      email: `google-user-${Math.random().toString(36).substring(7)}@gmail.com`,
      name: `Google User ${nextUserId}`,
      googleId: `google-id-${Math.random().toString(36).substring(7)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    users.push(googleUser);

    // In a real implementation, we would generate a JWT token
    const token = `simulated-jwt-token-${Math.random().toString(36).substring(7)}`;

    return res.status(200).json({
      user: googleUser,
      token,
    });
  } catch (error) {
    console.error("Error processing Google callback:", error);
    return res
      .status(500)
      .json({ error: "Failed to process Google authentication" });
  }
};

/**
 * Refresh authentication token
 */
export const refreshToken = (req: Request, res: Response) => {
  try {
    // In a real implementation, we would validate the refresh token
    // and generate a new access token

    const newToken = `simulated-jwt-token-${Math.random().toString(36).substring(7)}`;

    return res.status(200).json({ token: newToken });
  } catch (error) {
    console.error("Error refreshing token:", error);
    return res.status(500).json({ error: "Failed to refresh token" });
  }
};

/**
 * Logout a user
 */
export const logout = (req: Request, res: Response) => {
  // In a real implementation, we would invalidate the token
  return res.status(200).json({ message: "Logged out successfully" });
};
