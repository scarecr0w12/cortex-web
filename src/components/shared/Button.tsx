import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50",
          {
            "bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:opacity-90":
              variant === "primary",
            "bg-[#18181f] text-[#e2e2ea] border border-[rgba(255,255,255,0.07)] hover:bg-[#1e1e28]":
              variant === "secondary",
            "text-[#9090a8] hover:text-[#e2e2ea] hover:bg-[#111118]":
              variant === "ghost",
            "border border-[rgba(255,255,255,0.15)] text-[#e2e2ea] hover:bg-[#111118]":
              variant === "outline",
          },
          {
            "px-3 py-1.5 text-sm": size === "sm",
            "px-4 py-2 text-sm": size === "md",
            "px-6 py-3 text-base": size === "lg",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
