import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RefreshCw, CheckCircle, XCircle } from "lucide-react";

interface QRCodeModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  phoneNumber?: string;
  onSuccess?: () => void;
}

const QRCodeModal = ({
  isOpen = true,
  onClose = () => {},
  phoneNumber = "+1234567890",
  onSuccess = () => {},
}: QRCodeModalProps) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<
    "loading" | "ready" | "success" | "error"
  >("loading");
  const [timer, setTimer] = useState<number>(60);

  // Simulate QR code generation
  useEffect(() => {
    if (isOpen) {
      setStatus("loading");
      // Simulate API call to generate QR code
      const timeout = setTimeout(() => {
        setQrCodeUrl("https://api.dicebear.com/7.x/avataaars/svg?seed=qrcode");
        setStatus("ready");
      }, 1500);

      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  // Countdown timer for QR code expiration
  useEffect(() => {
    if (status === "ready" && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(interval);
    } else if (timer === 0 && status === "ready") {
      setStatus("error");
    }
  }, [status, timer]);

  const handleRefresh = () => {
    setStatus("loading");
    setTimer(60);

    // Simulate API call to refresh QR code
    setTimeout(() => {
      setQrCodeUrl(
        "https://api.dicebear.com/7.x/avataaars/svg?seed=qrcode" + Date.now(),
      );
      setStatus("ready");
    }, 1500);
  };

  const handleSuccess = () => {
    setStatus("success");
    setTimeout(() => {
      onSuccess();
      onClose();
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            Connect WhatsApp Number
          </DialogTitle>
          <DialogDescription className="text-center">
            Scan this QR code with your WhatsApp to link your number{" "}
            {phoneNumber}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center p-6 space-y-4">
          {status === "loading" && (
            <div className="w-64 h-64 bg-gray-100 flex items-center justify-center rounded-md">
              <RefreshCw className="w-12 h-12 text-gray-400 animate-spin" />
              <span className="sr-only">Loading QR code...</span>
            </div>
          )}

          {status === "ready" && qrCodeUrl && (
            <>
              <div className="w-64 h-64 bg-white border-2 border-gray-200 rounded-md p-2 relative">
                <img
                  src={qrCodeUrl}
                  alt="WhatsApp QR Code"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-sm text-gray-500 text-center">
                QR code expires in <span className="font-bold">{timer}</span>{" "}
                seconds
              </div>
            </>
          )}

          {status === "success" && (
            <div className="w-64 h-64 bg-green-50 flex flex-col items-center justify-center rounded-md">
              <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
              <p className="text-green-700 font-medium text-center">
                WhatsApp connected successfully!
              </p>
            </div>
          )}

          {status === "error" && (
            <div className="w-64 h-64 bg-red-50 flex flex-col items-center justify-center rounded-md">
              <XCircle className="w-16 h-16 text-red-500 mb-4" />
              <p className="text-red-700 font-medium text-center">
                QR code expired
              </p>
              <p className="text-red-600 text-sm text-center mt-2">
                Please refresh to generate a new code
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row sm:justify-center gap-2">
          {status === "ready" && (
            <Button
              variant="outline"
              onClick={handleSuccess}
              className="w-full sm:w-auto"
            >
              I've scanned the code
            </Button>
          )}

          {(status === "error" || status === "ready") && (
            <Button
              onClick={handleRefresh}
              className="w-full sm:w-auto"
              variant={status === "error" ? "default" : "outline"}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh QR code
            </Button>
          )}

          <Button
            variant="ghost"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QRCodeModal;
