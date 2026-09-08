// import React from "react";
import { Spinner } from "./Spinner";

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = "Loading..." }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <Spinner className="w-8 h-8" />
      <p className="text-brand-muted text-sm">{message}</p>
    </div>
  );
}