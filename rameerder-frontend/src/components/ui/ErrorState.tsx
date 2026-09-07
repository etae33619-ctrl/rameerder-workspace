// import React from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "./Button";

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ title = "Something went wrong", message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center rounded-lg border border-brand-red/20 bg-brand-red-light">
      <AlertCircle className="w-8 h-8 text-brand-red mb-3" />
      <h3 className="text-lg font-medium text-brand-text mb-1">{title}</h3>
      <p className="text-sm text-brand-muted mb-4">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" className="border-brand-red text-brand-red hover:bg-brand-red hover:text-white">
          Try Again
        </Button>
      )}
    </div>
  );
}