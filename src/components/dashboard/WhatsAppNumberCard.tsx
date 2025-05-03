import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Settings,
  BarChart2,
  RefreshCw,
  Trash2,
  ExternalLink,
} from "lucide-react";

interface WhatsAppNumberCardProps {
  number: string;
  status: "connected" | "disconnected" | "pending";
  webhookUrl?: string;
  lastActive?: string;
  messageCount?: number;
  onConfigure?: () => void;
  onViewAnalytics?: () => void;
  onRefresh?: () => void;
  onDelete?: () => void;
}

const WhatsAppNumberCard = ({
  number = "+1234567890",
  status = "connected",
  webhookUrl = "https://example.com/webhook",
  lastActive = "2 hours ago",
  messageCount = 156,
  onConfigure = () => {},
  onViewAnalytics = () => {},
  onRefresh = () => {},
  onDelete = () => {},
}: WhatsAppNumberCardProps) => {
  const getStatusColor = () => {
    switch (status) {
      case "connected":
        return "bg-green-500";
      case "disconnected":
        return "bg-red-500";
      case "pending":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "connected":
        return "Connected";
      case "disconnected":
        return "Disconnected";
      case "pending":
        return "Pending";
      default:
        return "Unknown";
    }
  };

  return (
    <Card className="w-[350px] h-[220px] bg-white shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-bold">{number}</CardTitle>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${getStatusColor()}`}></div>
            <span className="text-sm text-gray-600">{getStatusText()}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium text-gray-500">Webhook URL</p>
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-700 truncate">{webhookUrl}</p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="p-0 h-auto">
                      <ExternalLink className="h-4 w-4 text-gray-400" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Open webhook URL</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Last Active</p>
              <p className="text-sm text-gray-700">{lastActive}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Messages</p>
              <p className="text-sm text-gray-700">{messageCount}</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <div className="flex justify-between w-full">
          <Button variant="outline" size="sm" onClick={onConfigure}>
            <Settings className="h-4 w-4 mr-1" />
            Configure
          </Button>
          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={onViewAnalytics}>
                    <BarChart2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View Analytics</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={onRefresh}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Refresh Connection</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500"
                    onClick={onDelete}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Delete Number</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default WhatsAppNumberCard;
