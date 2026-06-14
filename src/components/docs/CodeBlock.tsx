"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

interface CodeBlockProps {
  code: string;
  language?: string;
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const el = document.createElement("textarea");
      el.value = code;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative group">
      <div className="flex items-center justify-between px-4 py-2 bg-[#0a0a0f] border-b border-[rgba(255,255,255,0.07)] rounded-t-xl">
        <span className="text-xs text-[#55556a] font-mono">{language || "code"}</span>
        <button
          onClick={handleCopy}
          className="p-1 text-[#55556a] hover:text-[#e2e2ea] transition-colors"
        >
          {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
      <pre className="p-4 bg-[#111118] rounded-b-xl overflow-x-auto">
        <code className="text-sm font-mono text-[#e2e2ea]">{code}</code>
      </pre>
    </div>
  );
}
