// import React from "react";
import { FileQuestion } from "lucide-react";
import { Button } from "./Button";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-lg border border-dashed border-brand-border bg-brand-bg">
      <div className="bg-white p-3 rounded-full mb-4 shadow-sm border border-brand-border">
        <FileQuestion className="w-6 h-6 text-brand-muted" />
      </div>
      <h3 className="text-lg font-semibold text-brand-text mb-1">{title}</h3>
      <p className="text-sm text-brand-muted max-w-sm mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="outline">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}