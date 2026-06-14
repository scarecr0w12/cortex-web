import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export function Card({ className, hover = false, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "bg-[#111118] border border-[rgba(255,255,255,0.07)] rounded-xl",
        hover && "transition-all duration-200 hover:border-indigo-500/30 hover:bg-[#18181f]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
