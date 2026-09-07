import React from "react";
//import { forwardRef, type ButtonHTMLAttributes } from "react";
import { Slot } from "@radix-ui/react-slot"
import { cn } from "../../utils/cn";
import { Spinner } from "./Spinner";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading,asChild = false, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    const variants = {
      primary: "bg-brand-blue text-white hover:bg-blue-700 active:bg-blue-800 shadow-sm",
      secondary: "bg-brand-navy text-white hover:bg-slate-800 active:bg-slate-900 shadow-sm",
      outline: "border border-brand-border bg-white text-brand-text hover:bg-slate-50",
      danger: "bg-brand-red text-white hover:bg-red-700 active:bg-red-800 shadow-sm",
      ghost: "bg-transparent text-brand-text hover:bg-slate-100",
    };
    

    const sizes = {
      sm: "h-8 px-3 text-sm",
      md: "h-10 px-4 py-2",
      lg: "h-12 px-6 text-lg",
    };

    return (
      <Comp
        ref={ref}
        disabled={isLoading || disabled}
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading && <Spinner className="mr-2 h-4 w-4 text-current" />}
        {children}
      </Comp>
    );
  }
);
Button.displayName = "Button";