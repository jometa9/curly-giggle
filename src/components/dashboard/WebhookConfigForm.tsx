import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, Plus, Trash2, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

interface WebhookConfigFormProps {
  phoneNumber?: string;
  currentWebhookUrl?: string;
  onSave?: (config: WebhookConfig) => Promise<boolean>;
  onTest?: (url: string) => Promise<boolean>;
}

interface CustomParameter {
  key: string;
  value: string;
}

interface WebhookConfig {
  url: string;
  includeMedia: boolean;
  includeMetadata: boolean;
  customParameters: CustomParameter[];
}

const WebhookConfigForm = ({
  phoneNumber = "+1234567890",
  currentWebhookUrl = "",
  onSave = async () => true,
  onTest = async () => true,
}: WebhookConfigFormProps) => {
  const [webhookUrl, setWebhookUrl] = useState(currentWebhookUrl);
  const [includeMedia, setIncludeMedia] = useState(true);
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [customParameters, setCustomParameters] = useState<CustomParameter[]>([
    { key: "", value: "" },
  ]);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testSuccess, setTestSuccess] = useState<boolean | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const addCustomParameter = () => {
    setCustomParameters([...customParameters, { key: "", value: "" }]);
  };

  const removeCustomParameter = (index: number) => {
    const newParams = [...customParameters];
    newParams.splice(index, 1);
    setCustomParameters(newParams);
  };

  const updateCustomParameter = (
    index: number,
    field: "key" | "value",
    value: string,
  ) => {
    const newParams = [...customParameters];
    newParams[index][field] = value;
    setCustomParameters(newParams);
  };

  const handleTestWebhook = async () => {
    if (!webhookUrl) {
      setErrorMessage("Please enter a webhook URL before testing");
      return;
    }

    setIsTesting(true);
    setTestSuccess(null);
    setErrorMessage("");

    try {
      const success = await onTest(webhookUrl);
      setTestSuccess(success);
      if (!success) {
        setErrorMessage(
          "Webhook test failed. Please check your URL and try again.",
        );
      }
    } catch (error) {
      setTestSuccess(false);
      setErrorMessage("An error occurred while testing the webhook.");
    } finally {
      setIsTesting(false);
    }
  };

  const handleSaveConfig = async () => {
    if (!webhookUrl) {
      setErrorMessage("Please enter a webhook URL");
      return;
    }

    setIsSaving(true);
    setSaveSuccess(null);
    setErrorMessage("");

    try {
      // Filter out empty custom parameters
      const validCustomParameters = customParameters.filter(
        (param) => param.key.trim() !== "" && param.value.trim() !== "",
      );

      const config: WebhookConfig = {
        url: webhookUrl,
        includeMedia,
        includeMetadata,
        customParameters: validCustomParameters,
      };

      const success = await onSave(config);
      setSaveSuccess(success);
      if (!success) {
        setErrorMessage("Failed to save webhook configuration.");
      }
    } catch (error) {
      setSaveSuccess(false);
      setErrorMessage("An error occurred while saving the configuration.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl bg-white">
      <CardHeader>
        <CardTitle>Webhook Configuration</CardTitle>
        <CardDescription>
          Configure where WhatsApp messages for {phoneNumber} will be sent
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {(errorMessage || saveSuccess === false) && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {errorMessage || "Failed to save configuration"}
            </AlertDescription>
          </Alert>
        )}

        {saveSuccess === true && (
          <Alert className="bg-green-50 border-green-200 text-green-800">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription>
              Webhook configuration saved successfully!
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="webhook-url">Webhook URL</Label>
          <Input
            id="webhook-url"
            placeholder="https://your-api.example.com/webhook"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
          />
          <p className="text-sm text-muted-foreground">
            This URL will receive POST requests when messages arrive at your
            WhatsApp number
          </p>
        </div>

        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="include-media">Include Media</Label>
              <p className="text-sm text-muted-foreground">
                Include media files in base64 format
              </p>
            </div>
            <Switch
              id="include-media"
              checked={includeMedia}
              onCheckedChange={setIncludeMedia}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="include-metadata">Include Metadata</Label>
              <p className="text-sm text-muted-foreground">
                Include message metadata (timestamps, read status)
              </p>
            </div>
            <Switch
              id="include-metadata"
              checked={includeMetadata}
              onCheckedChange={setIncludeMetadata}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Custom Parameters</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addCustomParameter}
            >
              <Plus className="h-4 w-4 mr-1" /> Add Parameter
            </Button>
          </div>

          <div className="space-y-3">
            {customParameters.map((param, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  placeholder="Key"
                  value={param.key}
                  onChange={(e) =>
                    updateCustomParameter(index, "key", e.target.value)
                  }
                  className="flex-1"
                />
                <Input
                  placeholder="Value"
                  value={param.value}
                  onChange={(e) =>
                    updateCustomParameter(index, "value", e.target.value)
                  }
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeCustomParameter(index)}
                  disabled={customParameters.length === 1}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            These parameters will be included in the JSON payload sent to your
            webhook
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="payload-preview">Payload Preview</Label>
          <div className="relative">
            <Textarea
              id="payload-preview"
              readOnly
              className="font-mono text-xs h-32 bg-slate-50"
              value={JSON.stringify(
                {
                  message: {
                    from: "sender-number",
                    body: "Hello, this is a sample message",
                    timestamp: new Date().toISOString(),
                    ...(includeMedia && {
                      media: { url: "base64://...", type: "image/jpeg" },
                    }),
                    ...(includeMetadata && {
                      metadata: { status: "delivered", messageId: "msg123" },
                    }),
                  },
                  whatsappNumber: phoneNumber,
                  ...Object.fromEntries(
                    customParameters
                      .filter((p) => p.key && p.value)
                      .map((p) => [p.key, p.value]),
                  ),
                },
                null,
                2,
              )}
            />
            <Badge className="absolute top-2 right-2 bg-slate-200 text-slate-700">
              Preview
            </Badge>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleTestWebhook}
          disabled={isTesting || !webhookUrl}
        >
          {isTesting ? "Testing..." : "Test Webhook"}
          {testSuccess === true && (
            <CheckCircle2 className="ml-2 h-4 w-4 text-green-500" />
          )}
        </Button>
        <Button onClick={handleSaveConfig} disabled={isSaving || !webhookUrl}>
          {isSaving ? "Saving..." : "Save Configuration"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WebhookConfigForm;
