/**
 * API service for interacting with the backend
 */

const API_BASE_URL = "http://localhost:4000/api";

/**
 * Generic API request function
 */
async function apiRequest<T>(
  endpoint: string,
  method: string = "GET",
  data?: any,
  headers: Record<string, string> = {},
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...headers,
  };

  // Add auth token if available
  const token = localStorage.getItem("auth_token");
  if (token) {
    requestHeaders["Authorization"] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method,
    headers: requestHeaders,
    credentials: "include",
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  const response = await fetch(url, config);

  if (!response.ok) {
    // Try to parse error message from response
    try {
      const errorData = await response.json();
      throw new Error(errorData.error || `API error: ${response.status}`);
    } catch (e) {
      throw new Error(`API error: ${response.status}`);
    }
  }

  return response.json();
}

/**
 * WhatsApp API functions
 */
export const whatsappApi = {
  // Get all WhatsApp numbers for the authenticated user
  getNumbers: () => apiRequest<any[]>("/whatsapp"),

  // Get a specific WhatsApp number by ID
  getNumber: (id: string) => apiRequest<any>(`/whatsapp/${id}`),

  // Add a new WhatsApp number
  addNumber: (number: string) =>
    apiRequest<any>("/whatsapp", "POST", { number }),

  // Update a WhatsApp number
  updateNumber: (id: string, data: any) =>
    apiRequest<any>(`/whatsapp/${id}`, "PUT", data),

  // Delete a WhatsApp number
  deleteNumber: (id: string) => apiRequest<void>(`/whatsapp/${id}`, "DELETE"),

  // Generate QR code for WhatsApp connection
  generateQRCode: (id: string) =>
    apiRequest<any>(`/whatsapp/${id}/qrcode`, "POST"),

  // Refresh WhatsApp connection
  refreshConnection: (id: string) =>
    apiRequest<any>(`/whatsapp/${id}/refresh`, "POST"),
};

/**
 * Webhook API functions
 */
export const webhookApi = {
  // Configure webhook for a WhatsApp number
  configureWebhook: (numberId: string, config: any) =>
    apiRequest<any>(`/webhook/configure/${numberId}`, "POST", config),

  // Get webhook configuration for a WhatsApp number
  getWebhookConfig: (numberId: string) =>
    apiRequest<any>(`/webhook/configure/${numberId}`),

  // Test webhook configuration
  testWebhook: (url: string) =>
    apiRequest<any>("/webhook/test", "POST", { url }),
};

/**
 * Auth API functions
 */
export const authApi = {
  // Register a new user
  register: (email: string, password: string, name?: string) =>
    apiRequest<any>("/auth/register", "POST", { email, password, name }),

  // Login a user
  login: (email: string, password: string) =>
    apiRequest<any>("/auth/login", "POST", { email, password }),

  // Logout a user
  logout: () => apiRequest<any>("/auth/logout", "POST"),
};

/**
 * Subscription API functions
 */
export const subscriptionApi = {
  // Create a new subscription
  createSubscription: (paymentMethodId: string) =>
    apiRequest<any>("/subscription", "POST", { paymentMethodId }),

  // Get subscription for the authenticated user
  getSubscription: () => apiRequest<any>("/subscription"),

  // Update subscription (e.g., change plan)
  updateSubscription: (plan: string) =>
    apiRequest<any>("/subscription", "PUT", { plan }),

  // Cancel subscription
  cancelSubscription: (cancelImmediately: boolean = false) =>
    apiRequest<any>("/subscription", "DELETE", { cancelImmediately }),

  // Update payment method
  updatePaymentMethod: (paymentMethodId: string) =>
    apiRequest<any>("/subscription/payment-method", "PUT", { paymentMethodId }),
};

export default {
  whatsapp: whatsappApi,
  webhook: webhookApi,
  auth: authApi,
  subscription: subscriptionApi,
};
