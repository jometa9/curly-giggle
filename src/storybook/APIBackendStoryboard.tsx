import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const APIBackendStoryboard = () => {
  const [activeTab, setActiveTab] = useState("backend");
  const [backendUrl, setBackendUrl] = useState("http://localhost:4000");
  const [testResponse, setTestResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const testBackendConnection = async () => {
    setIsLoading(true);
    setTestResponse(null);

    try {
      const response = await fetch(`${backendUrl}/health`);
      const data = await response.json();

      setTestResponse(JSON.stringify(data, null, 2));
    } catch (error) {
      setTestResponse(
        JSON.stringify({ error: "Failed to connect to backend" }, null, 2),
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">WhatsApp Hosting Backend</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="backend">Backend Status</TabsTrigger>
          <TabsTrigger value="api">API Documentation</TabsTrigger>
          <TabsTrigger value="setup">Setup Instructions</TabsTrigger>
        </TabsList>

        <TabsContent value="backend">
          <Card>
            <CardHeader>
              <CardTitle>Backend Connection</CardTitle>
              <CardDescription>
                Test the connection to your WhatsApp Hosting backend server
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Backend URL</label>
                  <Input
                    value={backendUrl}
                    onChange={(e) => setBackendUrl(e.target.value)}
                    placeholder="http://localhost:4000"
                  />
                </div>

                <Button onClick={testBackendConnection} disabled={isLoading}>
                  {isLoading ? "Testing..." : "Test Connection"}
                </Button>

                {testResponse && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium mb-2">Response:</h3>
                    <div className="bg-gray-100 p-4 rounded-md">
                      <pre className="text-xs whitespace-pre-wrap">
                        {testResponse}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle>API Documentation</CardTitle>
              <CardDescription>
                Overview of the available API endpoints
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Authentication</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      <code className="text-sm bg-gray-100 px-1">
                        POST /api/auth/register
                      </code>{" "}
                      - Register a new user
                    </li>
                    <li>
                      <code className="text-sm bg-gray-100 px-1">
                        POST /api/auth/login
                      </code>{" "}
                      - Login a user
                    </li>
                    <li>
                      <code className="text-sm bg-gray-100 px-1">
                        GET /api/auth/google
                      </code>{" "}
                      - Google OAuth authentication
                    </li>
                    <li>
                      <code className="text-sm bg-gray-100 px-1">
                        GET /api/auth/google/callback
                      </code>{" "}
                      - Google OAuth callback
                    </li>
                    <li>
                      <code className="text-sm bg-gray-100 px-1">
                        POST /api/auth/refresh-token
                      </code>{" "}
                      - Refresh authentication token
                    </li>
                    <li>
                      <code className="text-sm bg-gray-100 px-1">
                        POST /api/auth/logout
                      </code>{" "}
                      - Logout a user
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">WhatsApp Numbers</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      <code className="text-sm bg-gray-100 px-1">
                        POST /api/whatsapp
                      </code>{" "}
                      - Add a new WhatsApp number
                    </li>
                    <li>
                      <code className="text-sm bg-gray-100 px-1">
                        GET /api/whatsapp
                      </code>{" "}
                      - Get all WhatsApp numbers
                    </li>
                    <li>
                      <code className="text-sm bg-gray-100 px-1">
                        GET /api/whatsapp/:id
                      </code>{" "}
                      - Get a specific WhatsApp number
                    </li>
                    <li>
                      <code className="text-sm bg-gray-100 px-1">
                        PUT /api/whatsapp/:id
                      </code>{" "}
                      - Update a WhatsApp number
                    </li>
                    <li>
                      <code className="text-sm bg-gray-100 px-1">
                        DELETE /api/whatsapp/:id
                      </code>{" "}
                      - Delete a WhatsApp number
                    </li>
                    <li>
                      <code className="text-sm bg-gray-100 px-1">
                        POST /api/whatsapp/:id/qrcode
                      </code>{" "}
                      - Generate QR code
                    </li>
                    <li>
                      <code className="text-sm bg-gray-100 px-1">
                        POST /api/whatsapp/:id/refresh
                      </code>{" "}
                      - Refresh connection
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Webhooks</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      <code className="text-sm bg-gray-100 px-1">
                        POST /api/webhook/configure/:numberId
                      </code>{" "}
                      - Configure webhook
                    </li>
                    <li>
                      <code className="text-sm bg-gray-100 px-1">
                        GET /api/webhook/configure/:numberId
                      </code>{" "}
                      - Get webhook config
                    </li>
                    <li>
                      <code className="text-sm bg-gray-100 px-1">
                        POST /api/webhook/test
                      </code>{" "}
                      - Test webhook
                    </li>
                    <li>
                      <code className="text-sm bg-gray-100 px-1">
                        POST /api/webhook/receive/:numberId
                      </code>{" "}
                      - Receive webhook events
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Subscriptions</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      <code className="text-sm bg-gray-100 px-1">
                        POST /api/subscription
                      </code>{" "}
                      - Create a subscription
                    </li>
                    <li>
                      <code className="text-sm bg-gray-100 px-1">
                        GET /api/subscription
                      </code>{" "}
                      - Get subscription
                    </li>
                    <li>
                      <code className="text-sm bg-gray-100 px-1">
                        PUT /api/subscription
                      </code>{" "}
                      - Update subscription
                    </li>
                    <li>
                      <code className="text-sm bg-gray-100 px-1">
                        DELETE /api/subscription
                      </code>{" "}
                      - Cancel subscription
                    </li>
                    <li>
                      <code className="text-sm bg-gray-100 px-1">
                        PUT /api/subscription/payment-method
                      </code>{" "}
                      - Update payment method
                    </li>
                    <li>
                      <code className="text-sm bg-gray-100 px-1">
                        POST /api/subscription/webhook
                      </code>{" "}
                      - Handle Stripe webhook
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="setup">
          <Card>
            <CardHeader>
              <CardTitle>Setup Instructions</CardTitle>
              <CardDescription>
                How to set up and run the WhatsApp Hosting backend
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Prerequisites</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Node.js (v14 or higher)</li>
                    <li>npm or yarn</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Installation</h3>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>
                      <p>Navigate to the backend directory:</p>
                      <pre className="bg-gray-100 p-2 rounded-md text-sm mt-1">
                        cd backend
                      </pre>
                    </li>
                    <li>
                      <p>Install dependencies:</p>
                      <pre className="bg-gray-100 p-2 rounded-md text-sm mt-1">
                        npm install
                      </pre>
                    </li>
                    <li>
                      <p>Create a .env file with the following variables:</p>
                      <pre className="bg-gray-100 p-2 rounded-md text-sm mt-1">
                        PORT=4000 NODE_ENV=development
                        JWT_SECRET=your_jwt_secret
                        STRIPE_SECRET_KEY=your_stripe_secret_key
                        GOOGLE_CLIENT_ID=your_google_client_id
                        GOOGLE_CLIENT_SECRET=your_google_client_secret
                      </pre>
                    </li>
                    <li>
                      <p>Start the development server:</p>
                      <pre className="bg-gray-100 p-2 rounded-md text-sm mt-1">
                        npm run dev
                      </pre>
                    </li>
                  </ol>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Testing</h3>
                  <p>Once the server is running, you can test it by:</p>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>
                      Visiting{" "}
                      <a
                        href="http://localhost:4000/health"
                        className="text-blue-500 underline"
                      >
                        http://localhost:4000/health
                      </a>{" "}
                      in your browser
                    </li>
                    <li>
                      Using the "Test Connection" button in the Backend Status
                      tab
                    </li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default APIBackendStoryboard;
