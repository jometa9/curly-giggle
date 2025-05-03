import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";

export default function WhatsAppAPIStoryboard() {
  return (
    <div className="container mx-auto p-4 bg-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6">WhatsApp API Documentation</h1>

      <Tabs defaultValue="whatsapp">
        <TabsList className="mb-4">
          <TabsTrigger value="whatsapp">WhatsApp Numbers</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
        </TabsList>

        <TabsContent value="whatsapp" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>WhatsApp Number Management</CardTitle>
              <CardDescription>
                Endpoints for managing WhatsApp numbers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <EndpointCard
                method="POST"
                endpoint="/api/whatsapp"
                description="Add a new WhatsApp number"
                requestBody={{
                  number: "1234567890",
                }}
                responseBody={{
                  id: 1,
                  number: "1234567890",
                  status: "pending",
                  webhookUrl: "",
                  lastActive: null,
                  messageCount: 0,
                  userId: 1,
                  createdAt: "2023-06-01T12:00:00Z",
                  updatedAt: "2023-06-01T12:00:00Z",
                }}
              />

              <EndpointCard
                method="GET"
                endpoint="/api/whatsapp"
                description="Get all WhatsApp numbers"
                responseBody={[
                  {
                    id: 1,
                    number: "1234567890",
                    status: "connected",
                    webhookUrl: "https://example.com/webhook",
                    lastActive: "2023-06-01T12:30:00Z",
                    messageCount: 42,
                    userId: 1,
                    createdAt: "2023-06-01T12:00:00Z",
                    updatedAt: "2023-06-01T12:30:00Z",
                  },
                ]}
              />

              <EndpointCard
                method="GET"
                endpoint="/api/whatsapp/:id"
                description="Get a specific WhatsApp number"
                responseBody={{
                  id: 1,
                  number: "1234567890",
                  status: "connected",
                  webhookUrl: "https://example.com/webhook",
                  lastActive: "2023-06-01T12:30:00Z",
                  messageCount: 42,
                  userId: 1,
                  createdAt: "2023-06-01T12:00:00Z",
                  updatedAt: "2023-06-01T12:30:00Z",
                }}
              />

              <EndpointCard
                method="POST"
                endpoint="/api/whatsapp/:id/qrcode"
                description="Generate QR code for WhatsApp connection"
                responseBody={{
                  id: 1,
                  qrCodeData: "data:image/png;base64,...",
                  expiresAt: "2023-06-01T12:05:00Z",
                }}
              />

              <EndpointCard
                method="POST"
                endpoint="/api/whatsapp/:id/refresh"
                description="Refresh WhatsApp connection"
                responseBody={{
                  id: 1,
                  number: "1234567890",
                  status: "pending",
                  webhookUrl: "https://example.com/webhook",
                  lastActive: "2023-06-01T12:30:00Z",
                  messageCount: 42,
                  userId: 1,
                  createdAt: "2023-06-01T12:00:00Z",
                  updatedAt: "2023-06-01T12:35:00Z",
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Message Sending</CardTitle>
              <CardDescription>
                Endpoints for sending WhatsApp messages
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <EndpointCard
                method="POST"
                endpoint="/api/whatsapp/:id/messages"
                description="Send a text message"
                requestBody={{
                  to: "1234567890",
                  message: "Hello, this is a test message!",
                }}
                responseBody={{
                  id: "message-id-123",
                  from: 1,
                  to: "1234567890",
                  message: "Hello, this is a test message!",
                  timestamp: "2023-06-01T12:40:00Z",
                  status: "sent",
                }}
              />

              <EndpointCard
                method="POST"
                endpoint="/api/whatsapp/:id/media"
                description="Send a media message"
                requestBody={{
                  to: "1234567890",
                  mediaUrl: "https://example.com/image.jpg",
                  caption: "Check out this image!",
                  mediaType: "image",
                }}
                responseBody={{
                  id: "message-id-456",
                  from: 1,
                  to: "1234567890",
                  mediaUrl: "https://example.com/image.jpg",
                  caption: "Check out this image!",
                  mediaType: "image",
                  timestamp: "2023-06-01T12:45:00Z",
                  status: "sent",
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Webhook Configuration</CardTitle>
              <CardDescription>
                Endpoints for managing webhook configurations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <EndpointCard
                method="GET"
                endpoint="/api/webhooks/:numberId"
                description="Get webhook configuration for a WhatsApp number"
                responseBody={{
                  numberId: "1",
                  url: "https://example.com/webhook",
                  includeMedia: true,
                  includeMetadata: true,
                  customParameters: [
                    { key: "source", value: "whatsapp-api" },
                    { key: "version", value: "1.0" },
                  ],
                  createdAt: "2023-06-01T12:00:00Z",
                  updatedAt: "2023-06-01T12:00:00Z",
                }}
              />

              <EndpointCard
                method="POST"
                endpoint="/api/webhooks/:numberId"
                description="Create or update webhook configuration"
                requestBody={{
                  url: "https://example.com/webhook",
                  includeMedia: true,
                  includeMetadata: true,
                  customParameters: [
                    { key: "source", value: "whatsapp-api" },
                    { key: "version", value: "1.0" },
                  ],
                }}
                responseBody={{
                  numberId: "1",
                  url: "https://example.com/webhook",
                  includeMedia: true,
                  includeMetadata: true,
                  customParameters: [
                    { key: "source", value: "whatsapp-api" },
                    { key: "version", value: "1.0" },
                  ],
                  createdAt: "2023-06-01T12:00:00Z",
                  updatedAt: "2023-06-01T12:50:00Z",
                }}
              />

              <EndpointCard
                method="POST"
                endpoint="/api/webhooks/:numberId/test"
                description="Test webhook configuration"
                responseBody={{
                  success: true,
                  message: "Test webhook sent successfully",
                  payload: {
                    event: "test",
                    timestamp: "2023-06-01T12:55:00Z",
                    numberId: 1,
                    message: "This is a test message from the WhatsApp API",
                  },
                }}
              />

              <EndpointCard
                method="DELETE"
                endpoint="/api/webhooks/:numberId"
                description="Delete webhook configuration"
                responseStatus="204 No Content"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Webhook Payload Examples</CardTitle>
              <CardDescription>
                Example payloads sent to your webhook URL
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md bg-slate-50 p-4">
                <h3 className="text-lg font-medium mb-2">
                  Incoming Text Message
                </h3>
                <pre className="text-sm overflow-x-auto">
                  {JSON.stringify(
                    {
                      id: "message-id-789",
                      from: "1234567890@c.us",
                      to: "0987654321@c.us",
                      body: "Hello, this is an incoming message!",
                      timestamp: "2023-06-01T13:00:00Z",
                      isGroup: false,
                      author: "1234567890@c.us",
                      metadata: {
                        numberId: 1,
                        type: "chat",
                        ack: 1,
                      },
                      customParameters: {
                        source: "whatsapp-api",
                        version: "1.0",
                      },
                    },
                    null,
                    2,
                  )}
                </pre>
              </div>

              <div className="rounded-md bg-slate-50 p-4">
                <h3 className="text-lg font-medium mb-2">
                  Incoming Media Message
                </h3>
                <pre className="text-sm overflow-x-auto">
                  {JSON.stringify(
                    {
                      id: "message-id-101112",
                      from: "1234567890@c.us",
                      to: "0987654321@c.us",
                      body: "Check out this image!",
                      timestamp: "2023-06-01T13:05:00Z",
                      isGroup: false,
                      author: "1234567890@c.us",
                      media: {
                        mimetype: "image/jpeg",
                        data: "base64-encoded-data",
                        filename: "image.jpg",
                      },
                      metadata: {
                        numberId: 1,
                        type: "image",
                        ack: 1,
                      },
                      customParameters: {
                        source: "whatsapp-api",
                        version: "1.0",
                      },
                    },
                    null,
                    2,
                  )}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface EndpointCardProps {
  method: "GET" | "POST" | "PUT" | "DELETE";
  endpoint: string;
  description: string;
  requestBody?: any;
  responseBody?: any;
  responseStatus?: string;
}

function EndpointCard({
  method,
  endpoint,
  description,
  requestBody,
  responseBody,
  responseStatus = "200 OK",
}: EndpointCardProps) {
  const methodColors = {
    GET: "bg-blue-100 text-blue-800",
    POST: "bg-green-100 text-green-800",
    PUT: "bg-yellow-100 text-yellow-800",
    DELETE: "bg-red-100 text-red-800",
  };

  return (
    <div className="border rounded-md p-4">
      <div className="flex items-center gap-2 mb-2">
        <Badge className={methodColors[method]}>{method}</Badge>
        <code className="text-sm font-mono">{endpoint}</code>
      </div>
      <p className="text-sm text-gray-600 mb-3">{description}</p>

      {requestBody && (
        <div className="mb-3">
          <h4 className="text-xs font-medium text-gray-500 mb-1">
            Request Body:
          </h4>
          <pre className="text-xs bg-slate-50 p-2 rounded overflow-x-auto">
            {JSON.stringify(requestBody, null, 2)}
          </pre>
        </div>
      )}

      <div>
        <h4 className="text-xs font-medium text-gray-500 mb-1">
          Response: {responseStatus}
        </h4>
        {responseBody && (
          <pre className="text-xs bg-slate-50 p-2 rounded overflow-x-auto">
            {JSON.stringify(responseBody, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}
