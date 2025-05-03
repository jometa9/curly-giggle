import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  Settings,
  Plus,
  MessageSquare,
  FileText,
  CreditCard,
  LogOut,
} from "lucide-react";
import WhatsAppNumberCard from "./dashboard/WhatsAppNumberCard";
import QRCodeModal from "./dashboard/QRCodeModal";
import WebhookConfigForm from "./dashboard/WebhookConfigForm";
import APIDocumentation from "./dashboard/APIDocumentation";

const Home = () => {
  const [activeTab, setActiveTab] = useState("numbers");
  const [showQRModal, setShowQRModal] = useState(false);
  const [showWebhookConfig, setShowWebhookConfig] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState<string | null>(null);

  // Mock data for demonstration
  const mockNumbers = [
    {
      id: "1",
      number: "+1234567890",
      status: "active",
      webhookUrl: "https://api.example.com/webhook",
      lastActive: "2023-06-15T10:30:00Z",
      messagesCount: 1250,
    },
    {
      id: "2",
      number: "+9876543210",
      status: "disconnected",
      webhookUrl: "https://webhook.site/abc123",
      lastActive: "2023-06-10T08:15:00Z",
      messagesCount: 890,
    },
  ];

  const mockSubscription = {
    status: "active",
    plan: "Pro",
    nextBilling: "2023-07-15",
    amount: "$20.00",
  };

  const handleAddNumber = () => {
    setShowQRModal(true);
  };

  const handleConfigureWebhook = (numberId: string) => {
    setSelectedNumber(numberId);
    setShowWebhookConfig(true);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r bg-card p-4 flex flex-col">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">WhatsApp Host</h1>
          <p className="text-sm text-muted-foreground">
            Manage your WhatsApp numbers
          </p>
        </div>

        <nav className="space-y-2 flex-1">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => setActiveTab("numbers")}
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Numbers
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => setActiveTab("api")}
          >
            <FileText className="mr-2 h-4 w-4" />
            API Documentation
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => setActiveTab("subscription")}
          >
            <CreditCard className="mr-2 h-4 w-4" />
            Subscription
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => setActiveTab("settings")}
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </nav>

        <div className="mt-auto pt-4 border-t">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Subscription Status Banner */}
        <div className="bg-primary/10 p-4 flex justify-between items-center">
          <div className="flex items-center">
            <Badge
              variant="outline"
              className="mr-2 bg-green-100 text-green-800 border-green-200"
            >
              {mockSubscription.status === "active" ? "Active" : "Inactive"}
            </Badge>
            <span className="text-sm">
              {mockSubscription.plan} Plan - Next billing on{" "}
              {mockSubscription.nextBilling} - {mockSubscription.amount}/month
            </span>
          </div>
          <div className="flex items-center">
            <Button variant="outline" size="sm" className="mr-2">
              <Bell className="h-4 w-4 mr-1" />
              Notifications
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-1" />
              Account
            </Button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="mb-6">
              <TabsTrigger value="numbers">WhatsApp Numbers</TabsTrigger>
              <TabsTrigger value="api">API Documentation</TabsTrigger>
              <TabsTrigger value="subscription">Subscription</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="numbers" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Your WhatsApp Numbers</h2>
                <Button onClick={handleAddNumber}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Number
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockNumbers.map((number) => (
                  <WhatsAppNumberCard
                    key={number.id}
                    number={number.number}
                    status={number.status}
                    webhookUrl={number.webhookUrl}
                    lastActive={number.lastActive}
                    messagesCount={number.messagesCount}
                    onConfigure={() => handleConfigureWebhook(number.id)}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="api">
              <APIDocumentation />
            </TabsContent>

            <TabsContent value="subscription">
              <Card>
                <CardHeader>
                  <CardTitle>Subscription Management</CardTitle>
                  <CardDescription>
                    Manage your WhatsApp hosting subscription
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium">Current Plan</h3>
                        <p className="text-2xl font-bold">
                          {mockSubscription.plan}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">Status</h3>
                        <Badge
                          variant="outline"
                          className="mt-1 bg-green-100 text-green-800 border-green-200"
                        >
                          {mockSubscription.status === "active"
                            ? "Active"
                            : "Inactive"}
                        </Badge>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">
                          Next Billing Date
                        </h3>
                        <p>{mockSubscription.nextBilling}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">Monthly Amount</h3>
                        <p>{mockSubscription.amount}</p>
                      </div>
                    </div>

                    <div className="flex space-x-4 pt-4 border-t">
                      <Button variant="outline">Update Payment Method</Button>
                      <Button variant="destructive">Cancel Subscription</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>
                    Manage your account preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium">
                        Email Notifications
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Configure when you receive email notifications
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Security</h3>
                      <p className="text-sm text-muted-foreground">
                        Update your password and security settings
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">API Keys</h3>
                      <p className="text-sm text-muted-foreground">
                        Manage your API keys for programmatic access
                      </p>
                    </div>

                    <div className="flex space-x-4 pt-4 border-t">
                      <Button>Save Changes</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Modals */}
      {showQRModal && (
        <QRCodeModal
          isOpen={showQRModal}
          onClose={() => setShowQRModal(false)}
        />
      )}

      {showWebhookConfig && selectedNumber && (
        <WebhookConfigForm
          isOpen={showWebhookConfig}
          onClose={() => setShowWebhookConfig(false)}
          numberId={selectedNumber}
          initialWebhookUrl={
            mockNumbers.find((n) => n.id === selectedNumber)?.webhookUrl || ""
          }
        />
      )}
    </div>
  );
};

export default Home;
