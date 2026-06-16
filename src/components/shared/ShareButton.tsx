"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Share2, Twitter, Facebook, Linkedin, Link, Mail, Check, X,
  MessageCircle, ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getShareUrls, nativeShare, copyToClipboard, SITE_URL } from "@/lib/share";

interface ShareButtonProps {
  url: string;
  title: string;
  text?: string;
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const variantStyles: Record<string, string> = {
  primary: "bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:opacity-90",
  secondary: "bg-[#18181f] text-[#e2e2ea] border border-[rgba(255,255,255,0.07)] hover:bg-[#1e1e28]",
  ghost: "text-[#9090a8] hover:text-[#e2e2ea] hover:bg-[#111118]",
  outline: "border border-[rgba(255,255,255,0.15)] text-[#e2e2ea] hover:bg-[#111118]",
};

const sizeStyles: Record<string, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

interface ShareOption {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const shareOptions: ShareOption[] = [
  { key: "twitter", label: "Twitter / X", icon: Twitter, color: "hover:text-[#1DA1F2]" },
  { key: "facebook", label: "Facebook", icon: Facebook, color: "hover:text-[#1877F2]" },
  { key: "linkedin", label: "LinkedIn", icon: Linkedin, color: "hover:text-[#0A66C2]" },
  { key: "reddit", label: "Reddit", icon: MessageCircle, color: "hover:text-[#FF4500]" },
  { key: "hackernews", label: "Hacker News", icon: ExternalLink, color: "hover:text-[#FF6600]" },
  { key: "email", label: "Email", icon: Mail, color: "hover:text-[#EA4335]" },
];

export function ShareButton({
  url,
  title,
  text,
  variant = "secondary",
  size = "sm",
  className,
}: ShareButtonProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const fullUrl = url.startsWith("http") ? url : `${SITE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
  const shareUrls = getShareUrls(fullUrl, title, text || title);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  const handleNativeShare = useCallback(async () => {
    const canShare = typeof navigator !== "undefined" && typeof navigator.share === "function";
    if (canShare) {
      await nativeShare(title, text || title, fullUrl);
    } else {
      setOpen((o) => !o);
    }
  }, [title, text, fullUrl]);

  const handleCopyLink = useCallback(async () => {
    const ok = await copyToClipboard(fullUrl);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [fullUrl]);

  const handleSocialShare = useCallback((shareUrl: string) => {
    window.open(shareUrl, "_blank", "noopener,noreferrer,width=600,height=400");
    setOpen(false);
  }, []);

  return (
    <div className={cn("relative inline-block", className)} ref={menuRef}>
      <button
        onClick={handleNativeShare}
        className={cn(
          "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 gap-1.5",
          variantStyles[variant] || variantStyles.secondary,
          sizeStyles[size] || sizeStyles.sm,
        )}
        aria-label="Share"
        aria-expanded={open}
      >
        {open ? <X className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
        <span className="hidden sm:inline">Share</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 z-50 w-56 rounded-xl border border-[rgba(255,255,255,0.07)] bg-[#18181f] shadow-2xl shadow-black/50 p-1.5">
          <div className="space-y-0.5">
            {shareOptions.map((opt) => (
              <button
                key={opt.key}
                onClick={() => handleSocialShare(shareUrls[opt.key as keyof typeof shareUrls])}
                className={cn(
                  "flex items-center gap-2.5 w-full px-3 py-2 text-sm text-[#9090a8] rounded-lg transition-colors",
                  opt.color,
                )}
              >
                <opt.icon className="w-4 h-4" />
                {opt.label}
              </button>
            ))}
            <div className="border-t border-[rgba(255,255,255,0.07)] my-1" />
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-[#9090a8] rounded-lg transition-colors hover:text-emerald-400"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Link className="w-4 h-4" />}
              {copied ? "Copied!" : "Copy Link"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
