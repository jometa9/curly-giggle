# WhatsApp Hosting Backend

This is the backend service for the WhatsApp Hosting Subscription platform. It provides APIs for managing WhatsApp numbers, handling webhooks, user authentication, and subscription management.

## Features

- User authentication (email and Google sign-in)
- WhatsApp number management
- QR code generation for WhatsApp connection
- Webhook configuration and handling
- Subscription management with Stripe integration

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
cd backend
npm install
```

3. Create a `.env` file in the root directory with the following variables:

```
PORT=4000
NODE_ENV=development
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

4. Start the development server:

```bash
npm run dev
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/google` - Google OAuth authentication
- `GET /api/auth/google/callback` - Google OAuth callback
- `POST /api/auth/refresh-token` - Refresh authentication token
- `POST /api/auth/logout` - Logout a user

### WhatsApp Numbers

- `POST /api/whatsapp` - Add a new WhatsApp number
- `GET /api/whatsapp` - Get all WhatsApp numbers for the authenticated user
- `GET /api/whatsapp/:id` - Get a specific WhatsApp number by ID
- `PUT /api/whatsapp/:id` - Update a WhatsApp number
- `DELETE /api/whatsapp/:id` - Delete a WhatsApp number
- `POST /api/whatsapp/:id/qrcode` - Generate QR code for WhatsApp connection
- `POST /api/whatsapp/:id/refresh` - Refresh WhatsApp connection

### Webhooks

- `POST /api/webhook/configure/:numberId` - Configure webhook for a WhatsApp number
- `GET /api/webhook/configure/:numberId` - Get webhook configuration for a WhatsApp number
- `POST /api/webhook/test` - Test webhook configuration
- `POST /api/webhook/receive/:numberId` - Receive webhook events from WhatsApp

### Subscriptions

- `POST /api/subscription` - Create a new subscription
- `GET /api/subscription` - Get subscription for a user
- `PUT /api/subscription` - Update subscription (e.g., change plan)
- `DELETE /api/subscription` - Cancel subscription
- `PUT /api/subscription/payment-method` - Update payment method
- `POST /api/subscription/webhook` - Handle Stripe webhook events

## Future Improvements

- Database integration (MongoDB, PostgreSQL, etc.)
- Implement proper authentication middleware
- Add validation for all API endpoints
- Implement rate limiting
- Add comprehensive error handling
- Add unit and integration tests
- Set up CI/CD pipeline
- Add API documentation (Swagger/OpenAPI)
