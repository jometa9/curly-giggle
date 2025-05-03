import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Copy,
  CheckCircle,
  Send,
  Code,
  BookOpen,
  Terminal,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface APIDocumentationProps {
  apiKey?: string;
  whatsappNumbers?: string[];
}

const APIDocumentation = ({
  apiKey = "sk_test_4eC39HqLyjWDarjtT1zdp7dc",
  whatsappNumbers = ["+1234567890", "+9876543210"],
}: APIDocumentationProps) => {
  const [copied, setCopied] = useState<string | null>(null);
  const [testResponse, setTestResponse] = useState<string | null>(null);
  const [testLoading, setTestLoading] = useState(false);
  const [testParams, setTestParams] = useState({
    to: "",
    message: "Hello from API test!",
    number: whatsappNumbers[0] || "+1234567890",
  });

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleTestRequest = () => {
    setTestLoading(true);
    // Simulate API request
    setTimeout(() => {
      setTestResponse(
        JSON.stringify(
          {
            success: true,
            messageId: "msg_" + Math.random().toString(36).substr(2, 9),
            timestamp: new Date().toISOString(),
          },
          null,
          2,
        ),
      );
      setTestLoading(false);
    }, 1500);
  };

  const codeExamples = {
    curl: `curl -X POST https://api.whatsapphosting.com/v1/messages \\\n  -H "Authorization: Bearer ${apiKey}" \\\n  -H "Content-Type: application/json" \\\n  -d '{
    "from": "${whatsappNumbers[0] || "+1234567890"}",
    "to": "+1234567890",
    "message": "Hello from WhatsApp Hosting!"
  }'`,
    javascript: `import axios from 'axios';

const sendMessage = async () => {
  try {
    const response = await axios.post('https://api.whatsapphosting.com/v1/messages', {
      from: '${whatsappNumbers[0] || "+1234567890"}',
      to: '+1234567890',
      message: 'Hello from WhatsApp Hosting!'
    }, {
      headers: {
        'Authorization': 'Bearer ${apiKey}',
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Message sent:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

sendMessage();`,
    python: `import requests
import json

url = "https://api.whatsapphosting.com/v1/messages"

payload = json.dumps({
  "from": "${whatsappNumbers[0] || "+1234567890"}",
  "to": "+1234567890",
  "message": "Hello from WhatsApp Hosting!"
})

headers = {
  'Authorization': 'Bearer ${apiKey}',
  'Content-Type': 'application/json'
}

response = requests.post(url, headers=headers, data=payload)
print(response.text)`,
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">API Documentation</h1>
        <p className="text-gray-600">
          Use our API to programmatically send WhatsApp messages from your
          hosted numbers.
        </p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">
            <BookOpen className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="endpoints">
            <Terminal className="w-4 h-4 mr-2" />
            Endpoints
          </TabsTrigger>
          <TabsTrigger value="examples">
            <Code className="w-4 h-4 mr-2" />
            Code Examples
          </TabsTrigger>
          <TabsTrigger value="test">
            <Send className="w-4 h-4 mr-2" />
            Test API
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Authentication</CardTitle>
              <CardDescription>
                All API requests require authentication using your API key.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="flex justify-between items-center">
                  <code className="text-sm">
                    Authorization: Bearer {apiKey}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      copyToClipboard(`Authorization: Bearer ${apiKey}`, "auth")
                    }
                  >
                    {copied === "auth" ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <p className="mt-4 text-sm text-gray-600">
                Include this header in all API requests to authenticate your
                account.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Base URL</CardTitle>
              <CardDescription>
                All API requests should be made to the following base URL:
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="flex justify-between items-center">
                  <code className="text-sm">
                    https://api.whatsapphosting.com/v1
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      copyToClipboard(
                        "https://api.whatsapphosting.com/v1",
                        "url",
                      )
                    }
                  >
                    {copied === "url" ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your WhatsApp Numbers</CardTitle>
              <CardDescription>
                These are the WhatsApp numbers you have hosted on our platform:
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {whatsappNumbers.length > 0 ? (
                  whatsappNumbers.map((number, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 p-3 rounded-md flex justify-between items-center"
                    >
                      <span>{number}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          copyToClipboard(number, `number-${index}`)
                        }
                      >
                        {copied === `number-${index}` ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">
                    No WhatsApp numbers found. Please add a number to your
                    account.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="endpoints" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Send Message</CardTitle>
              <CardDescription>
                Send a WhatsApp message from one of your hosted numbers.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-1">Endpoint</h4>
                  <div className="bg-gray-50 p-3 rounded-md flex justify-between items-center">
                    <code className="text-sm">POST /messages</code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        copyToClipboard("POST /messages", "endpoint-messages")
                      }
                    >
                      {copied === "endpoint-messages" ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-1">Request Body</h4>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <pre className="text-xs overflow-auto">
                      {JSON.stringify(
                        {
                          from: whatsappNumbers[0] || "+1234567890",
                          to: "+1234567890",
                          message: "Hello from WhatsApp Hosting!",
                        },
                        null,
                        2,
                      )}
                    </pre>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-1">Response</h4>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <pre className="text-xs overflow-auto">
                      {JSON.stringify(
                        {
                          success: true,
                          messageId: "msg_1234567890",
                          timestamp: "2023-06-15T12:34:56.789Z",
                        },
                        null,
                        2,
                      )}
                    </pre>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Get Message Status</CardTitle>
              <CardDescription>
                Check the delivery status of a sent message.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-1">Endpoint</h4>
                  <div className="bg-gray-50 p-3 rounded-md flex justify-between items-center">
                    <code className="text-sm">
                      GET /messages/{"{messageId}"}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        copyToClipboard(
                          "GET /messages/{messageId}",
                          "endpoint-status",
                        )
                      }
                    >
                      {copied === "endpoint-status" ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-1">Response</h4>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <pre className="text-xs overflow-auto">
                      {JSON.stringify(
                        {
                          messageId: "msg_1234567890",
                          status: "delivered",
                          deliveredAt: "2023-06-15T12:35:10.123Z",
                          from: whatsappNumbers[0] || "+1234567890",
                          to: "+1234567890",
                        },
                        null,
                        2,
                      )}
                    </pre>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="examples" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Code Examples</CardTitle>
              <CardDescription>
                Examples of how to use our API in different programming
                languages.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="curl">
                  <AccordionTrigger>cURL</AccordionTrigger>
                  <AccordionContent>
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-md relative">
                      <pre className="text-xs overflow-auto whitespace-pre-wrap">
                        {codeExamples.curl}
                      </pre>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 text-gray-300 hover:text-white"
                        onClick={() =>
                          copyToClipboard(codeExamples.curl, "curl")
                        }
                      >
                        {copied === "curl" ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="javascript">
                  <AccordionTrigger>JavaScript</AccordionTrigger>
                  <AccordionContent>
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-md relative">
                      <pre className="text-xs overflow-auto whitespace-pre-wrap">
                        {codeExamples.javascript}
                      </pre>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 text-gray-300 hover:text-white"
                        onClick={() =>
                          copyToClipboard(codeExamples.javascript, "javascript")
                        }
                      >
                        {copied === "javascript" ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="python">
                  <AccordionTrigger>Python</AccordionTrigger>
                  <AccordionContent>
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-md relative">
                      <pre className="text-xs overflow-auto whitespace-pre-wrap">
                        {codeExamples.python}
                      </pre>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 text-gray-300 hover:text-white"
                        onClick={() =>
                          copyToClipboard(codeExamples.python, "python")
                        }
                      >
                        {copied === "python" ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="test" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Test API</CardTitle>
              <CardDescription>
                Send a test message to verify your API integration.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">From Number</label>
                    <select
                      className="w-full p-2 border rounded-md"
                      value={testParams.number}
                      onChange={(e) =>
                        setTestParams({ ...testParams, number: e.target.value })
                      }
                    >
                      {whatsappNumbers.map((number, index) => (
                        <option key={index} value={number}>
                          {number}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">To Number</label>
                    <Input
                      placeholder="+1234567890"
                      value={testParams.to}
                      onChange={(e) =>
                        setTestParams({ ...testParams, to: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Message</label>
                  <Textarea
                    placeholder="Enter your message here"
                    value={testParams.message}
                    onChange={(e) =>
                      setTestParams({ ...testParams, message: e.target.value })
                    }
                  />
                </div>

                <Button
                  onClick={handleTestRequest}
                  disabled={testLoading || !testParams.to}
                  className="w-full"
                >
                  {testLoading ? "Sending..." : "Send Test Message"}
                </Button>

                {testResponse && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Response:</h4>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <pre className="text-xs overflow-auto">
                        {testResponse}
                      </pre>
                    </div>
                  </div>
                )}

                <Alert>
                  <AlertDescription>
                    Test messages will be sent from your actual WhatsApp number
                    and may incur charges depending on your plan.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default APIDocumentation;
