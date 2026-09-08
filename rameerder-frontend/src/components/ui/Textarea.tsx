import React from "react";
import { cn } from "../../utils/cn";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const textareaId = id || React.useId();
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={textareaId} className="block text-sm font-medium text-brand-text mb-1">
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          className={cn(
            "flex min-h-[80px] w-full rounded-md border border-brand-border bg-white px-3 py-2 text-sm placeholder:text-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-shadow",
            error && "border-brand-red focus:ring-brand-red",
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-brand-red">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";