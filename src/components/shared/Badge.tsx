import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "indigo" | "green" | "yellow" | "red" | "purple";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full",
        {
          "bg-[#18181f] text-[#9090a8] border border-[rgba(255,255,255,0.07)]": variant === "default",
          "bg-indigo-500/10 text-indigo-300 border border-indigo-500/20": variant === "indigo",
          "bg-green-500/10 text-green-300 border border-green-500/20": variant === "green",
          "bg-yellow-500/10 text-yellow-300 border border-yellow-500/20": variant === "yellow",
          "bg-red-500/10 text-red-300 border border-red-500/20": variant === "red",
          "bg-purple-500/10 text-purple-300 border border-purple-500/20": variant === "purple",
        },
        className
      )}
    >
      {children}
    </span>
  );
}
