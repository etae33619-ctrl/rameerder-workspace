import React from "react";
import { cn } from "../../utils/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id || React.useId();
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-brand-text mb-1">
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={cn(
            "flex h-10 w-full rounded-md border border-brand-border bg-white px-3 py-2 text-sm placeholder:text-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-shadow",
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
Input.displayName = "Input";